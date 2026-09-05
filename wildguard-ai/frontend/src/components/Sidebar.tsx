"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  BarChart3, 
  Settings, 
  Bell, 
  Cpu, 
  BrainCircuit,
  ShieldAlert
} from "lucide-react";
import { clsx } from "clsx";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: ImageIcon, label: "Gallery", href: "/gallery" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: BrainCircuit, label: "Training", href: "/training" },
  { icon: Cpu, label: "Devices", href: "/devices" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass border-r border-white/10 flex flex-col h-screen sticky top-0 hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
          <ShieldAlert className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          WildGuard AI
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              pathname === item.href 
                ? "bg-primary-500/10 text-primary-400 border border-primary-500/20" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={20} className={clsx(
              "transition-colors",
              pathname === item.href ? "text-primary-400" : "group-hover:text-white"
            )} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-600/20 to-purple-600/20 border border-primary-500/20">
          <p className="text-xs text-primary-300 font-bold uppercase tracking-wider mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm font-medium">All Systems Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
