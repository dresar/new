"use client";

import { useState } from "react";
import { BrainCircuit, Upload, Play, Database, History, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Training() {
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);

  const startTraining = () => {
    setTraining(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTraining(false);
      }
    }, 500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">AI Training Center</h1>
        <p className="text-gray-400 mt-1">Refine and update YOLOv8 models with new datasets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Training Control */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 text-center border-dashed border-2 border-primary-500/20 group hover:border-primary-500/40 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-primary-400" />
            </div>
            <h3 className="text-xl font-bold">Upload New Dataset</h3>
            <p className="text-gray-400 mt-2 max-w-xs mx-auto">
              Drag and drop your images or .zip files here. Make sure they are labeled in YOLO format.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BrainCircuit size={20} className="text-purple-400" />
                Model Training
              </h3>
              {!training ? (
                <button 
                  onClick={startTraining}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary-500/20"
                >
                  <Play size={16} fill="currentColor" />
                  Train Model
                </button>
              ) : (
                <span className="text-primary-400 animate-pulse font-medium">Training in progress...</span>
              )}
            </div>

            {training && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Epoch 42/100</span>
                  <span className="text-primary-400">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
                  />
                </div>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-gray-500 space-y-1">
                  <p>[INFO] Loading dataset from /tmp/train...</p>
                  <p>[INFO] Initializing YOLOv8n weights...</p>
                  <p>[TRAIN] Epoch 42: box_loss=0.45, cls_loss=0.32, dfl_loss=0.11</p>
                  <p>[TRAIN] mAP50=0.92, mAP50-95=0.74</p>
                </div>
              </div>
            )}

            {!training && progress === 100 && (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <CheckCircle className="text-green-500" size={20} />
                <p className="text-sm text-green-500 font-medium">Model successfully trained and deployed to production.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Database size={20} className="text-blue-400" />
              Dataset Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Total Images</span>
                <span className="font-bold">4,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Labeled Classes</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Validation Split</span>
                <span className="font-bold">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Last Update</span>
                <span className="font-bold">2 hours ago</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <History size={20} className="text-gray-400" />
              Training History
            </h3>
            <div className="space-y-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1 h-10 bg-primary-500 rounded-full" />
                  <div>
                    <p className="text-sm font-bold">v1.2.{i} - Deployment</p>
                    <p className="text-xs text-gray-500">mAP 0.94 • Apr 20, 2026</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
