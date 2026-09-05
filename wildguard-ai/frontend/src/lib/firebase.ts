import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSy_SANITIZED_KEY_PROTECTED",
  authDomain: "biasa-bb4a1.firebaseapp.com",
  projectId: "biasa-bb4a1",
  storageBucket: "biasa-bb4a1.firebasestorage.app",
  messagingSenderId: "455630233341",
  appId: "1:455630233341:web:8c4667b64cd0491c162894",
  measurementId: "G-SN911ENHBV"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics is client-side only
const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export { app, db, storage, analytics };
