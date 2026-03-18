"use client";

import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { GlassCard } from './core-ui';

interface SafetyBadgeProps {
  score: number;
  date: string;
}

export function SafetyBadge({ score, date }: SafetyBadgeProps) {
  return (
    <div className="relative group perspective-1000">
      <GlassCard className="w-64 h-80 flex flex-col items-center justify-center gap-6 border-accent/40 bg-gradient-to-br from-accent/10 to-transparent relative overflow-hidden group-hover:rotate-y-12 transition-transform duration-500">
        {/* Background Decorative Rings */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-white rounded-full" />
        </div>

        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center glow-accent">
          <Shield className="text-background" size={48} />
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-black tracking-tighter uppercase italic">SafeStay Certified</h3>
          <p className="text-[10px] text-foreground/50 uppercase tracking-widest mt-1">Verification Badge</p>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-4xl font-black text-accent">{score}%</span>
          <span className="text-[10px] font-bold opacity-40 uppercase">Safety Index</span>
        </div>

        <div className="flex items-center gap-1 text-[10px] bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <CheckCircle2 size={10} className="text-secure" />
          <span>Verified on {date}</span>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </GlassCard>
    </div>
  );
}
