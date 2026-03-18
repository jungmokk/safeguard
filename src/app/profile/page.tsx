"use client";

import React, { useEffect, useState } from 'react';
import { User, LogOut, Shield, Award, Clock, MapPin, ChevronRight, Settings, AlertCircle, Share2, ArrowLeft, Languages } from 'lucide-react';
import { GlassCard, Button } from '@/components/ui/core-ui';
import { useAuth } from '@/lib/use-auth';
import { logOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@/lib/i18n/translations';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    safetyScore: 85,
    discoveryCount: 7,
    badges: ['First Step', 'SafeGuardian']
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Shield className="text-accent animate-pulse" size={64} />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-foreground">
      {/* Header & Back Button */}
      <nav className="p-4 flex items-center justify-between z-10 sticky top-0 bg-black/80 backdrop-blur-md">
        <Link href="/">
          <Button variant="ghost" className="p-2">
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <span className="font-bold uppercase tracking-widest text-xs text-foreground/50">{t.profile.title}</span>
        <Button variant="ghost" className="p-2" onClick={() => logOut().then(() => router.push('/'))}>
          <LogOut size={22} className="text-alert" />
        </Button>
      </nav>

      <div className="p-6 space-y-8">
        {/* User Card */}
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="relative group pt-4">
            <div className="absolute inset-0 bg-accent rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Sentinel'} className="w-24 h-24 rounded-full border-2 border-accent relative z-10" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center relative z-10">
                <User size={48} className="text-foreground/20" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-accent text-background p-2 rounded-xl shadow-xl z-20">
              <Award size={18} />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black">{user.displayName || 'Safe Sentinel'}</h1>
            <p className="text-foreground/40 text-sm mt-1">{user.isAnonymous ? 'Anonymous Sentinel' : (user.email || 'Verified User')}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-5 flex flex-col items-center border-accent/20">
            <span className="text-[10px] uppercase font-bold text-accent mb-2 tracking-widest">{t.home.safety_score}</span>
            <span className="text-3xl font-black">{profileData.safetyScore}%</span>
            <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-accent shadow-[0_0_10px_var(--accent)]" style={{ width: `${profileData.safetyScore}%` }} />
            </div>
          </GlassCard>
          <GlassCard className="p-5 flex flex-col items-center border-secure/20">
            <span className="text-[10px] uppercase font-bold text-secure mb-2 tracking-widest">Discoveries</span>
            <span className="text-3xl font-black">{profileData.discoveryCount}</span>
            <p className="text-[10px] text-foreground/40 mt-1 uppercase font-bold">Threats Removed</p>
          </GlassCard>
        </div>

        {/* Badges Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2 px-2">
            <Award size={16} /> {t.profile.badges}
          </h3>
          <div className="grid grid-cols-3 gap-3">
             <div className="flex flex-col items-center gap-3 p-4 glass rounded-3xl border-accent shadow-lg bg-accent/10">
                <Shield className="text-accent" size={24} />
                <span className="text-[10px] font-bold text-center">First Step</span>
             </div>
             <div className="flex flex-col items-center gap-3 p-4 glass rounded-3xl border-alert/20 bg-alert/5 opacity-50 grayscale">
                <AlertCircle size={24} />
                <span className="text-[10px] font-bold text-center">Spy Hunter</span>
             </div>
             <div className="flex flex-col items-center gap-3 p-4 glass rounded-3xl border-secure bg-secure/10 shadow-lg glow-secure">
                <Award className="text-secure" size={24} />
                <span className="text-[10px] font-bold text-center">Sentinel</span>
             </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2 px-2">
            <Languages size={16} /> {t.common.settings}
          </h3>
          <GlassCard className="p-2 border-white/5">
            <div className="grid grid-cols-5 gap-2 p-2">
              {[
                { id: 'en', label: 'EN' },
                { id: 'ko', label: 'KO' },
                { id: 'zh-TW', label: 'TW' },
                { id: 'ja', label: 'JA' },
                { id: 'es', label: 'ES' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id as Language)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all ${
                    language === lang.id 
                    ? 'bg-accent text-background shadow-[0_0_15px_rgba(0,195,255,0.4)]' 
                    : 'bg-white/5 text-foreground/40 hover:bg-white/10'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Account Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2 px-2">
            <Settings size={16} /> Account Security
          </h3>
          <GlassCard className="p-2 border-white/5">
            <button className="w-full p-3 flex items-center justify-between hover:bg-white/5 rounded-2xl transition-all">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/5 rounded-xl"><Share2 size={18} /></div>
                 <span className="text-sm font-medium">Auto-backup profile</span>
               </div>
               <div className="w-10 h-5 bg-secure rounded-full relative">
                 <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1" />
               </div>
            </button>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
