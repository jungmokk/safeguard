"use client";

import React, { useEffect, useState } from 'react';
import { Shield, MapPin, Clock, Zap, Camera, ArrowLeft, RefreshCw } from 'lucide-react';
import { GlassCard, Button } from '@/components/ui/core-ui';
import { subscribeToAlerts, AlertPost } from '@/lib/alerts';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function CommunityPage() {
  const { language, t } = useLanguage();
  const [alerts, setAlerts] = useState<AlertPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAlerts((data) => {
      setAlerts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return language === 'ko' ? '방금 전' : 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.RelativeTimeFormat(language, { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / 60000),
      'minute'
    );
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-foreground">
      {/* Header */}
      <nav className="p-4 flex items-center justify-between z-10 sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/5">
        <Link href="/">
          <Button variant="ghost" className="p-2">
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">{t.home.community}</span>
          <span className="font-bold flex items-center gap-2">Live Alerts Feed</span>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </nav>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Community Stats */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4 border-accent/20 bg-accent/5">
            <div className="flex items-center gap-2 text-accent mb-1">
              <Shield size={16} />
              <span className="text-[10px] font-bold uppercase">Active Guards</span>
            </div>
            <p className="text-2xl font-black">{Math.max(12, alerts.length * 3)}+</p>
          </GlassCard>
          <GlassCard className="p-4 border-alert/20 bg-alert/5">
            <div className="flex items-center gap-2 text-alert mb-1">
              <Zap size={16} />
              <span className="text-[10px] font-bold uppercase">Recent Risks</span>
            </div>
            <p className="text-2xl font-black">{alerts.length}</p>
          </GlassCard>
        </div>

        {/* Feed Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {language === 'ko' ? '실시간 리포트' : 'Real-time Reports'}
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-foreground/20">
              <RefreshCw size={40} className="animate-spin" />
              <p className="text-sm font-medium">Syncing with secure vault...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-foreground/30">
              <Shield size={48} className="opacity-20" />
              <p className="text-sm font-medium">No threats detected in the last 24h.</p>
              <p className="text-xs text-center px-6">The community is currently secure. Keep your guard up!</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <GlassCard key={alert.id} className="p-5 border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${alert.type === 'emf' ? 'bg-alert/10 text-alert' : 'bg-accent/10 text-accent'}`}>
                      {alert.type === 'emf' ? <Zap size={20} /> : <Camera size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">
                        {alert.type === 'emf' ? 'Abnormal EMF Detected' : 'Suspicious Lens Reflection'}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-foreground/40">
                        <MapPin size={10} />
                        <span>Anonymous City</span>
                        <span className="mx-1">•</span>
                        <Clock size={10} />
                        <span>{formatDate(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 text-xs text-foreground/70 leading-relaxed border border-white/5">
                  {alert.type === 'emf' 
                    ? (language === 'ko' ? `자기장 수치 ${Math.round(alert.value)}μT가 보고되었습니다. 해당 구역의 전자기기 주변에서 주의하십시오.` : `Magnetic field spike of ${Math.round(alert.value)}μT reported. Stay cautious around electronic devices in this area.`)
                    : (language === 'ko' ? `고강도 광학 반사 패턴이 탐지되었습니다. 이 위치에서 다수의 렌즈 특성이 일치합니다.` : `High-intensity optical reflection pattern detected. Multiple lens characteristics matched at this location.`)}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button variant="ghost" className="h-8 text-[10px] bg-white/5 border-none px-4">
                    Verify detection
                  </Button>
                  <Button variant="ghost" className="h-8 text-[10px] bg-white/5 border-none px-4">
                    View guide
                  </Button>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
