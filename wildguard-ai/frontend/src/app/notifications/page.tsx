"use client";

import { Bell, Send, ShieldAlert, MessageSquare, Mail, Settings2 } from "lucide-react";

const notificationLogs = [
  { id: 1, type: "ALERT", title: "Wild Boar Detected", body: "Warning: Wild boar detected in North Zone perkemahan.", time: "10 mins ago", status: "Sent" },
  { id: 2, type: "WARNING", title: "Human Detected", body: "Unauthorized movement detected at 02:00 AM.", time: "2 hours ago", status: "Sent" },
  { id: 3, type: "INFO", title: "System Update", body: "Model v1.2.5 successfully deployed.", time: "5 hours ago", status: "Viewed" },
];

export default function Notifications() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notification Center</h1>
          <p className="text-gray-400 mt-1">Manage alert triggers and messaging integrations.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <Settings2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Integrations */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Send size={20} className="text-primary-400" />
            Integrations
          </h2>
          
          <div className="space-y-4">
            {[
              { icon: MessageSquare, name: "Telegram Bot", status: "Connected", color: "text-blue-400" },
              { icon: Bell, name: "Firebase (FCM)", status: "Active", color: "text-orange-400" },
              { icon: Mail, name: "Email Digest", status: "Disabled", color: "text-gray-500" },
            ].map((integration) => (
              <div key={integration.name} className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-white/5 rounded-lg ${integration.color}`}>
                    <integration.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{integration.name}</p>
                    <p className="text-xs text-gray-500">{integration.status}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${integration.status === 'Disabled' ? 'bg-gray-700' : 'bg-green-500'}`} />
              </div>
            ))}
          </div>

          <div className="glass-card p-6 bg-red-500/5 border-red-500/20">
            <h3 className="font-bold flex items-center gap-2 text-red-400 mb-2">
              <ShieldAlert size={18} />
              Emergency Broadcast
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Immediately send a high-priority alert to all connected devices and users.
            </p>
            <button className="w-full py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-bold transition-colors">
              TRIGGER ALARM
            </button>
          </div>
        </div>

        {/* Notification Logs */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <Bell size={20} className="text-yellow-400" />
             Notification History
          </h2>
          
          <div className="space-y-4">
            {notificationLogs.map((log) => (
              <div key={log.id} className="glass-card p-6 flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  log.type === 'ALERT' ? 'bg-red-500/10 text-red-500' : 
                  log.type === 'WARNING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      log.type === 'ALERT' ? 'bg-red-500/20 text-red-400' : 
                      log.type === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-xs text-gray-500">{log.time}</span>
                  </div>
                  <h3 className="font-bold mt-1">{log.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{log.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
