"use client";

import { Cpu, Signal, Battery, Activity, Plus, MoreVertical, Map } from "lucide-react";

const devices = [
  { id: "ESP32-CAM-01", status: "Online", lastPing: "2 mins ago", battery: "85%", location: "North Zone", signal: "Excellent" },
  { id: "ESP32-CAM-02", status: "Online", lastPing: "Just now", battery: "92%", location: "East Camping Area", signal: "Good" },
  { id: "ESP32-CAM-03", status: "Offline", lastPing: "1 hour ago", battery: "12%", location: "Water Tank", signal: "Poor" },
];

export default function Devices() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Edge Devices</h1>
          <p className="text-gray-400 mt-1">Monitor and manage your ESP32-CAM network.</p>
        </div>
        <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl font-bold flex items-center gap-2 transition-colors">
          <Plus size={18} />
          Add New Device
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div key={device.id} className="glass-card overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    device.status === 'Online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{device.id}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Signal size={12} />
                      {device.signal} Signal
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className={`text-sm font-bold ${device.status === 'Online' ? 'text-green-400' : 'text-red-400'}`}>
                    {device.status}
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Battery</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">{device.battery}</p>
                    <Battery size={12} className={parseInt(device.battery) < 20 ? 'text-red-500' : 'text-green-500'} />
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Last Heartbeat</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Activity size={12} className="text-primary-400" />
                    {device.lastPing}
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Map size={12} className="text-orange-400" />
                    {device.location}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-white/5 flex gap-2">
              <button 
                onClick={async () => {
                  try {
                    await fetch('http://localhost:8000/mock-trigger?label=boar', { method: 'POST' });
                    alert('Mock alert triggered!');
                  } catch (e) {
                    alert('Failed to trigger mock. Is backend running?');
                  }
                }}
                className="flex-1 py-2 text-xs font-bold rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
              >
                TEST ALERT
              </button>
              <button className="flex-1 py-2 text-xs font-bold rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                SETTINGS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
