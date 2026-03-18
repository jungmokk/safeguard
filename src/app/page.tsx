"use client";

import React, { useState } from 'react';
import { Shield, Camera, Lock, CheckCircle2, MapPin, ChevronRight, Settings } from 'lucide-react';
import { GlassCard, Button } from '@/components/ui/core-ui';
import Link from 'next/link';
import { useAuth } from '@/lib/use-auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { requestLocationPermission } from '@/lib/permissions';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export default function Home() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [safetyScore] = useState(85);
  const [location, setLocation] = useState("Locating...");

  React.useEffect(() => {
    async function updateLocation() {
      const granted = await requestLocationPermission();
      if (granted) {
        try {
          const position = await Geolocation.getCurrentPosition();
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        } catch (error) {
          console.error("Error getting location:", error);
          setLocation("Location unavailable");
        }
      } else {
        setLocation("Permission denied");
      }
    }
    updateLocation();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 space-y-6">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center glow-accent">
            <Shield className="text-background" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">{t.home.title}</span>
        </div>
        <Link href={user ? "/profile" : "/login"}>
          {user?.photoURL ? (
            <div className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden outline outline-accent outline-offset-2">
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <Button variant="ghost" className="p-2 h-10 w-10 rounded-full bg-white/5 border border-white/5">
              <Settings size={22} className="text-foreground/60" />
            </Button>
          )}
        </Link>
      </header>

      {/* Safety Score Gauge */}
      <section className="w-full max-w-md flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Progress Ring */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="var(--accent)"
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - safetyScore / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="glow-accent transition-all duration-1000 ease-out"
            />
          </svg>
          
          <div className="absolute flex flex-col items-center">
            <span className="text-6xl font-bold">{safetyScore}%</span>
            <span className="text-sm text-foreground/60 uppercase tracking-widest mt-1">{t.home.safety_score}</span>
          </div>
        </div>

        <GlassCard className="mt-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secure/20 rounded-lg text-secure">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-foreground/50 uppercase font-bold tracking-tighter">Current Location</p>
              <p className="font-semibold">{location}</p>
            </div>
          </div>
          <ChevronRight className="text-foreground/30" />
        </GlassCard>
      </section>

      {/* Primary Actions */}
      <section className="w-full max-w-md grid grid-cols-2 gap-4">
        <Link href="/scan" className="w-full">
          <GlassCard className="flex flex-col items-center justify-center gap-3 text-center py-8 hover:border-accent/30 transition-colors group">
            <div className="p-4 bg-accent/10 rounded-2xl text-accent group-hover:scale-110 transition-transform">
              <Camera size={28} />
            </div>
            <span className="font-bold">{t.home.ai_scanner}</span>
          </GlassCard>
        </Link>
        <Link href="/guard" className="w-full">
          <GlassCard className="flex flex-col items-center justify-center gap-3 text-center py-8 hover:border-alert/30 transition-colors group">
            <div className="p-4 bg-alert/10 rounded-2xl text-alert group-hover:scale-110 transition-transform">
              <Lock size={28} />
            </div>
            <span className="font-bold">{t.home.door_guard}</span>
          </GlassCard>
        </Link>
      </section>

      {/* Community Feed */}
      <section className="w-full max-w-md">
        <Link href="/community">
          <GlassCard className="flex items-center justify-between border-accent/20 bg-accent/5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-full text-accent shadow-[0_0_15px_rgba(0,195,255,0.2)]">
                <Shield size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{t.home.community}</span>
                <span className="text-xs text-foreground/70">{t.home.community_desc}</span>
              </div>
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full">
              <ChevronRight size={20} />
            </div>
          </GlassCard>
        </Link>
      </section>

      {/* Checklist Summary */}
      <section className="w-full max-w-md">
        <Link href="/checklist">
          <GlassCard className="flex items-center justify-between border-secure/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secure/10 rounded-full text-secure pulse-secure">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{t.home.checklist}</span>
                <span className="text-xs text-foreground/60">{t.home.checklist_desc}</span>
              </div>
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full">
              <ChevronRight size={20} />
            </div>
          </GlassCard>
        </Link>
      </section>

      <footer className="w-full max-w-md py-8">
        <Button className="w-full" glow variant="primary">
          <Shield className="mr-2" />
          Full Security Audit
        </Button>
      </footer>
    </main>
  );
}
