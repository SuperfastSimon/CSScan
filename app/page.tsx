"use client";
import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Terminal, Search, Lock, BarChart3, Activity, Loader2 } from 'lucide-react';

export default function SecurityDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulatie van data-loading sequence
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-300 p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        {/* Top Header Section */}
        <header className="mb-12 flex justify-between items-end border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
               <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                  <Lock className="text-blue-400" size={22} />
               </div>
               <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase tracking-widest">CS-SCAN <span className="text-blue-500">PRO</span></h1>
            </div>
            <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase italic">
              System Status: {loading ? "Scanning_Modules..." : "Core_Active"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {loading && <Loader2 className="animate-spin text-blue-500" size={16} />}
            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10 uppercase font-bold">Live_Sync</span>
          </div>
        </header>

        {/* Stats Grid: Initial vs Target vs Threats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-zinc-900/10 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:border-blue-500/20 transition-all">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 italic">Initial_Score</p>
            <p className="text-6xl font-mono text-white tracking-tighter">--</p>
          </div>
          
          <div className="bg-blue-600/[0.02] border border-blue-500/20 p-8 rounded-[2.5rem] shadow-[inset_0_0_40px_rgba(59,130,246,0.02)] group hover:border-blue-400/40 transition-all">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 italic">Target_Score</p>
            <p className="text-6xl font-mono text-white tracking-tighter">--</p>
          </div>

          <div className="bg-zinc-900/10 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:border-red-500/20 transition-all">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 italic">Threats_Detected</p>
            <p className="text-6xl font-mono text-white tracking-tighter">0</p>
          </div>
        </div>

        {/* Data Buffer: De plek waar je scanner-output komt */}
        <div className="bg-zinc-900/5 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
          <div className="p-8 border-b border-white/5 flex items-center gap-3 bg-white/[0.01]">
             <Terminal size={18} className="text-blue-500" />
             <span className="text-xs font-black uppercase tracking-widest text-white italic">Analysis_Output_Buffer</span>
          </div>
          <div className="p-12 text-center">
            <div className="py-10 text-zinc-600 font-mono text-xs italic tracking-widest animate-pulse">
              [ Waiting for inbound data stream from scanner modules... ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
