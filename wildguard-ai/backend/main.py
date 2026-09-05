import os
import io
import time
import datetime
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from ultralytics import YOLO
import firebase_admin
from firebase_admin import credentials, firestore, storage, messaging
import cv2
import numpy as np
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
# Load Firebase Admin SDK
# You need to download your service account key from Firebase Console:
# Settings -> Service Accounts -> Generate New Private Key
SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT", "serviceAccountKey.json")
STORAGE_BUCKET = "biasa-bb4a1.firebasestorage.app"

db = None
bucket = None

if os.path.exists(SERVICE_ACCOUNT_PATH):
    try:
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred, {
            'storageBucket': STORAGE_BUCKET
        })
        db = firestore.client()
        bucket = storage.bucket()
        print("✅ Firebase Admin initialized successfully.")
    except Exception as e:
        print(f"❌ Error initializing Firebase: {e}")
else:
    print(f"⚠️ WARNING: Service account file not found at {SERVICE_ACCOUNT_PATH}. Firebase storage/firestore will be skipped.")

# --- AI MODEL ---
# Load YOLOv8 model (it will download automatically if not exists)
model = YOLO("yolov8n.pt") 

# Target classes (COCO classes for yolov8n):
# 0: person
# 15: cat (sometimes looks like wild animals)
# 16: dog
# 17: horse
# 18: sheep
# 19: cow
# 20: elephant
# 21: bear
# 22: zebra
# 23: giraffe
# Custom mapping for our specific wildlife context
CLASS_MAPPING = {
    0: "human",
    15: "animal",
    16: "animal",
    17: "animal",
    18: "animal",
    19: "animal",
    20: "wildlife",
    21: "wildlife",
    22: "wildlife",
    23: "wildlife",
    # Specific ones if we use a custom model
}

app = FastAPI(title="WildGuard AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DetectionResult(BaseModel):
    label: str
    confidence: float
    box: List[float]

@app.get("/")
async def root():
    return {"message": "WildGuard AI API is running"}

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...), device_id: str = "ESP32-CAM-01"):
    try:
        # 1. Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")

        # 2. Run YOLO Inference
        results = model(img)[0]
        
        detections = []
        alert_triggered = False
        top_label = "unknown"
        
        for box in results.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            
            if conf > 0.4: # Threshold
                label = CLASS_MAPPING.get(cls, "unknown")
                if label == "unknown":
                    # Check COCO names
                    label = results.names[cls]
                
                detections.append({
                    "label": label,
                    "confidence": round(conf, 2),
                    "box": box.xyxy[0].tolist()
                })
                
                # Check for specific animals for alerts
                if label in ["wildlife", "boar", "tiger", "bear", "elephant"]:
                    alert_triggered = True
                    top_label = label
                elif label == "human" and top_label == "unknown":
                    top_label = "human"

        # 3. Save to Firebase Storage
        image_url = "https://via.placeholder.com/800x600.png?text=Wildlife+Detection"
        if bucket:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"detections/{device_id}_{timestamp}.jpg"
            
            # Upload original image
            blob = bucket.blob(filename)
            blob.upload_from_string(contents, content_type="image/jpeg")
            blob.make_public()
            image_url = blob.public_url

        # 4. Save to Firestore
        if db:
            doc_ref = db.collection("detections").document()
            detection_data = {
                "device_id": device_id,
                "image_url": image_url,
                "detections": detections,
                "top_label": top_label if detections else "none",
                "timestamp": firestore.SERVER_TIMESTAMP,
                "status": "alert" if alert_triggered else "info"
            }
            doc_ref.set(detection_data)

        # 5. Send Notification if triggered
        if alert_triggered and db:
            send_notification(top_label, device_id)

        return {
            "status": "success",
            "detected": detections,
            "image_url": image_url
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def send_notification(label, device_id):
    # Firebase Cloud Messaging or Telegram Logic
    message = messaging.Message(
        notification=messaging.Notification(
            title=f"🚨 ALERT: {label.upper()} DETECTED!",
            body=f"A {label} has been detected by {device_id} at perkemahan area.",
        ),
        topic="alerts",
    )
    try:
        response = messaging.send(message)
        print("Successfully sent message:", response)
    except Exception as e:
        print("Error sending notification:", e)

@app.get("/detections")
async def get_detections(limit: int = 20):
    if not db:
        return [
            {
                "id": "mock-1",
                "image_url": "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&q=80&w=800",
                "top_label": "monkey",
                "status": "info",
                "timestamp": datetime.datetime.now(),
                "device_id": "ESP32-CAM-01",
                "detections": []
            }
        ]
    docs = db.collection("detections").order_by("timestamp", direction=firestore.Query.DESCENDING).limit(limit).stream()
    results = []
    for doc in docs:
        d = doc.to_dict()
        d["id"] = doc.id
        results.append(d)
    return results

@app.post("/mock-trigger")
async def mock_trigger(label: str = "boar"):
    if db:
        doc_ref = db.collection("detections").document()
        doc_ref.set({
            "device_id": "MOCK-DEVICE",
            "image_url": "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800",
            "top_label": label,
            "status": "alert" if label == "boar" else "info",
            "timestamp": firestore.SERVER_TIMESTAMP,
            "detections": [{"label": label, "confidence": 0.95, "box": [0,0,100,100]}]
        })
        return {"status": "success", "message": f"Mock {label} detection added to Firestore"}
    return {"status": "error", "message": "Firebase not initialized"}

@app.get("/stats")
async def get_stats():
    # Simple stats for now
    docs = db.collection("detections").stream()
    total = 0
    counts = {}
    for doc in docs:
        total += 1
        label = doc.to_dict().get("top_label", "none")
        counts[label] = counts.get(label, 0) + 1
    
    return {
        "total_detections": total,
        "label_counts": counts
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
