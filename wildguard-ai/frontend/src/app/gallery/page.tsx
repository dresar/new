"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { Filter, Calendar, Search } from "lucide-react";

export default function Gallery() {
  const [detections, setDetections] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let q = query(
      collection(db, "detections"),
      orderBy("timestamp", "desc")
    );

    if (filter !== "all") {
      q = query(
        collection(db, "detections"),
        where("top_label", "==", filter),
        orderBy("timestamp", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDetections(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [filter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Detection Gallery</h1>
          <p className="text-gray-400 mt-1">Browse and filter all captured events.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 px-4 border-r border-white/10">
            <Filter size={16} className="text-gray-400" />
            <select 
              className="bg-transparent text-sm outline-none cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Species</option>
              <option value="monkey">Monkeys</option>
              <option value="boar">Wild Boars</option>
              <option value="human">Humans</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-4">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm">Today</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {detections.map((item) => (
          <div key={item.id} className="glass-card overflow-hidden group cursor-pointer">
            <div className="relative aspect-square">
              <img 
                src={item.image_url} 
                alt={item.top_label} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Search className="text-white" />
              </div>
              <div className="absolute top-2 right-2">
                 <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase">
                   {item.top_label}
                 </span>
              </div>
            </div>
            <div className="p-3 text-center">
              <p className="text-xs text-gray-400">
                {item.timestamp?.toDate().toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        {detections.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 italic">
            No detections found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
