"use client";
import React, { useState, useEffect } from 'react';
import { Terminal, Lock, Loader2, Zap, Search } from 'lucide-react';

export default function SecurityDashboard() {
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([
    { id: 1, type: 'INSIGHT', msg: '30 apps are looking for funding', time: '05:19' },
    { id: 2, type: 'SCAN', msg: 'Analyzing market opportunities...', time: '05:18' }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-300 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
               <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-500/20">
                  <Lock className="text-blue-400" size={22} />
               </div>
               <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">CS-SCAN <span className="text-blue-500">PRO</span></h1>
            </div>
            <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase italic">
              System Status: {loading ? "Syncing..." : "Live_Feed_Active"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10 uppercase font-bold tracking-tighter">Connected</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl hover:border-blue-500/20 transition-all">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 italic text-xs">Total_Apps</p>
            <p className="text-6xl font-mono text-white tracking-tighter">30</p>
          </div>
          <div className="bg-blue-600/[0.03] border border-blue-500/20 p-8 rounded-[2.5rem] shadow-[inset_0_0_40px_rgba(59,130,246,0.03)]">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 italic text-xs">Market_Target</p>
            <p className="text-6xl font-mono text-white tracking-tighter">VC_SEED</p>
          </div>
          <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem]">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 italic text-xs">Signal_Strength</p>
            <p className="text-6xl font-mono text-emerald-500 tracking-tighter">98%</p>
          </div>
        </div>

        <div className="bg-zinc-900/10 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center gap-3 bg-white/[0.01]">
             <Terminal size={18} className="text-blue-500" />
             <span className="text-xs font-black uppercase tracking-widest text-white italic">Analysis_Output_Buffer</span>
          </div>
          <div className="p-6 font-mono text-xs">
            {feed.map(item => (
              <div key={item.id} className="flex gap-4 p-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <span className="text-zinc-600">[{item.time}]</span>
                <span className="text-blue-500 font-bold">[{item.type}]</span>
                <span className="text-zinc-300">{item.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
