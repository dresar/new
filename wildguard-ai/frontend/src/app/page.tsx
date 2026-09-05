"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { 
  Activity, 
  ShieldAlert, 
  Clock, 
  Eye, 
  MapPin, 
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Detection {
  id: string;
  image_url: string;
  top_label: string;
  status: string;
  timestamp: any;
  device_id: string;
  detections: any[];
}

export default function Dashboard() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "detections"),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Detection[];
      setDetections(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const stats = [
    { label: "Active Devices", value: "3", icon: MapPin, color: "text-blue-400" },
    { label: "Detections (24h)", value: "124", icon: Activity, color: "text-green-400" },
    { label: "Critical Alerts", value: "12", icon: ShieldAlert, color: "text-red-400" },
    { label: "Avg. Accuracy", value: "94.2%", icon: CheckCircle2, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Live Monitoring</h1>
          <p className="text-gray-400 mt-1">Real-time wildlife intrusion detection overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Network Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`${stat.color} p-3 bg-white/5 rounded-xl`}>
                <stat.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Eye size={20} className="text-primary-400" />
              Latest Detections
            </h2>
            <button className="text-sm text-primary-400 hover:underline">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {detections.map((detection, i) => (
                <motion.div
                  key={detection.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card overflow-hidden group"
                >
                  <div className="relative aspect-video">
                    <img 
                      src={detection.image_url} 
                      alt="Detection"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${
                        detection.status === 'alert' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                      }`}>
                        {detection.top_label}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Clock size={14} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{detection.top_label} Detected</p>
                        <p className="text-xs text-gray-400">
                          {detection.timestamp?.toDate().toLocaleTimeString() || "Just now"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Device</p>
                      <p className="text-xs font-mono">{detection.device_id}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="col-span-full h-64 flex items-center justify-center text-gray-500 italic">
                Loading live feed...
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Status/Logs */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle size={20} className="text-yellow-400" />
            System Logs
          </h2>
          <div className="glass-card p-4 space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-red-500' : 'bg-blue-500'}`} />
                <div>
                  <p className="text-sm font-medium">
                    {i === 0 ? "Critical Alert: Wild Boar near Camping Zone A" : "Device heartbeat received from ESP32-CAM-01"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">12:45 PM - Apr 22</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-primary-600/10 border border-primary-500/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold text-lg">Retrain Model</h3>
              <p className="text-sm text-gray-400 mt-2">New dataset available for better accuracy in monkeys detection.</p>
              <button className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-sm font-bold transition-colors">
                Start Training
              </button>
            </div>
            <BrainCircuit className="absolute -right-4 -bottom-4 text-primary-500/10 w-32 h-32 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
