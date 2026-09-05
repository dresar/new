"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, Users, Bird, Zap } from "lucide-react";

const barData = [
  { name: "Mon", monkeys: 40, boars: 24, humans: 10 },
  { name: "Tue", monkeys: 30, boars: 13, humans: 22 },
  { name: "Wed", monkeys: 20, boars: 98, humans: 15 },
  { name: "Thu", monkeys: 27, boars: 39, humans: 40 },
  { name: "Fri", monkeys: 18, boars: 48, humans: 32 },
  { name: "Sat", monkeys: 23, boars: 38, humans: 55 },
  { name: "Sun", monkeys: 34, boars: 43, humans: 45 },
];

const pieData = [
  { name: "Monkey", value: 400, color: "#3b82f6" },
  { name: "Wild Boar", value: 300, color: "#f97316" },
  { name: "Human", value: 300, color: "#10b981" },
  { name: "Others", value: 200, color: "#8b5cf6" },
];

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-gray-400 mt-1">Detailed statistical insights of wildlife activities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Detection Trends */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-primary-400" />
              Detection Trends
            </h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={barData}>
                <defs>
                  <linearGradient id="colorMonkeys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area type="monotone" dataKey="monkeys" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMonkeys)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Species Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
            <Bird size={20} className="text-orange-400" />
            Species Distribution
          </h3>
          <div className="h-80 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 pr-8">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-xs text-gray-400">{item.name}</p>
                    <p className="text-sm font-bold">{((item.value / 1200) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-Class Activity */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
            <Zap size={20} className="text-yellow-400" />
            Daily Activity by Species
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px" }}
                />
                <Bar dataKey="monkeys" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="boars" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="humans" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
