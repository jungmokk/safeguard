"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Shield, ShieldAlert, ShieldOff, ArrowLeft, Volume2, VolumeX, Moon, Sun, AlertTriangle, Activity, ShieldCheck } from 'lucide-react';
import { useAccelerometer } from '@/components/sensors/use-accelerometer';
import { requestWakeLock } from '@/lib/sensors/wake-lock';
import { useGuardAudio } from '@/components/sensors/use-guard-audio';
import { GlassCard, Button, cn } from '@/components/ui/core-ui';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function GuardPage() {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [isStealth, setIsStealth] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { isVibrating, data, requestPermission, calibration, isCalibrating, runCalibration } = useAccelerometer(0.162); 
  const { initAudio, startSiren, stopSiren, playVoiceAlert, isPlayingSiren } = useGuardAudio();
  const wakeLockRef = useRef<any>(null);
  const vibrationStartTimeRef = useRef<number | null>(null);

  // Handle activation
  const toggleGuard = async () => {
    if (!isActive) {
      // Rule 3 Case: User Gesture required for Audio & Sensors
      initAudio(); 
      const granted = await requestPermission();
      if (granted) {
        setIsActive(true);
        wakeLockRef.current = await requestWakeLock();
      }
    } else {
      setIsActive(false);
      setIsStealth(false);
      stopSiren();
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      vibrationStartTimeRef.current = null;
    }
  };

  // Logic for Alarm triggering (Rule 2: >3s persistent vibration)
  useEffect(() => {
    if (isActive && isVibrating) {
      if (!vibrationStartTimeRef.current) {
        vibrationStartTimeRef.current = Date.now();
      }

      const duration = Date.now() - vibrationStartTimeRef.current;
      
      if (duration > 3000 && !isMuted) {
        startSiren();
        playVoiceAlert("Intruder detected. Identify yourself.");
      }
    } else {
      vibrationStartTimeRef.current = null;
      // Option: stopSiren() when vibrating stops? 
      // PRD says "if vibration persists for 3s", so we might want to keep siren going until manual stop
    }
  }, [isActive, isVibrating, isMuted, startSiren, playVoiceAlert]);

  // Handle manual siren stop if needed via Mute toggle?
  useEffect(() => {
    if (isMuted && isPlayingSiren) {
      stopSiren();
    }
  }, [isMuted, isPlayingSiren, stopSiren]);

  return (
    <main className={`flex min-h-screen flex-col transition-colors duration-700 ${isStealth ? 'bg-black' : 'bg-background'}`}>
      {/* Stealth Mode Overlay - Tap to exit */}
      {isStealth && (
        <div 
          onClick={() => setIsStealth(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer"
        >
          <div className="opacity-10 scale-50">
             <Shield className="text-white" size={120} />
          </div>
          <div className="absolute bottom-12 text-white/20 text-xs font-bold uppercase tracking-widest animate-pulse">
            {t.guard.stealth_desc}
          </div>
        </div>
      )}

      <nav className={`p-4 flex items-center justify-between ${isStealth ? 'hidden' : ''}`}>
        <Link href="/">
          <Button variant="ghost" className="p-2">
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <span className="font-bold tracking-tight uppercase text-xs text-foreground/50">{t.home.door_guard}</span>
        <Button variant="ghost" className="p-2" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </Button>
      </nav>

      <div className={`flex-1 flex flex-col items-center justify-center p-8 space-y-12 ${isStealth ? 'hidden' : ''}`}>
        {/* Status Indicator */}
        <div className="relative">
          <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${
            isActive 
              ? isVibrating 
                ? 'bg-alert/20 scale-110 shadow-[0_0_80px_var(--alert)]' 
                : 'bg-accent/10 shadow-[0_0_50px_rgba(0,195,255,0.1)]'
              : 'bg-white/5'
          }`}>
            {isActive ? (
              isVibrating ? (
                <ShieldAlert className="text-alert animate-bounce" size={80} />
              ) : (
                <Shield className="text-accent animate-pulse" size={80} />
              )
            ) : (
              <ShieldOff className="text-foreground/20" size={80} />
            )}
          </div>
          
            <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
              isVibrating ? 'bg-alert text-foreground' : 'bg-accent text-background'
            }`}>
              {isVibrating ? t.guard.intrusion_detected : t.guard.monitoring}
            </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">
            {!isActive ? t.guard.inactive : isVibrating ? t.guard.intrusion_detected : t.guard.monitoring}
          </h2>
          <p className="text-sm text-foreground/50 max-w-[250px]">
            {!isActive 
              ? (t.guard.active_desc) 
              : 'Keep the device still. Any vibration will trigger the alert.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="w-full max-w-xs space-y-4">
          {!calibration && !isActive && (
            <Button 
              onClick={() => runCalibration()}
              disabled={isCalibrating}
              variant="outline"
              className="w-full py-4 text-sm gap-3 border-accent/20 text-accent/80 hover:bg-accent/5"
            >
              <Activity size={18} className={isCalibrating ? "animate-spin" : ""} />
              {isCalibrating ? t.guard.measuring : t.guard.calibrate_surface}
            </Button>
          )}

          <Button 
            onClick={toggleGuard}
            variant={isActive ? 'secondary' : 'primary'}
            glow={!isActive}
            className={cn("w-full py-6 text-lg transition-all", (!calibration && !isActive) && "opacity-50")}
          >
            {isActive ? t.guard.deactivate : t.guard.activate}
          </Button>

          {isActive && (
            <Button 
              onClick={() => setIsStealth(true)}
              variant="ghost" 
              className="w-full border border-white/10"
            >
              <Moon size={18} className="mr-2" />
              {t.guard.stealth_mode}
            </Button>
          )}
        </div>
      </div>

      {/* Vibration Log / History */}
      {!isStealth && (isActive || calibration) && (
        <section className="px-8 pb-12 w-full max-w-md mx-auto">
          <GlassCard className={cn("p-4 border-white/5", calibration && "border-secure/30 bg-secure/5")}>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">
              <ShieldCheck size={14} className={calibration ? "text-secure" : ""} />
              <span>{calibration ? t.scan.optimized_sensitivity : 'Surface Analytics'}</span>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-[10px] font-bold uppercase opacity-60">
                 <span>{t.scan.surface_noise} (RMS)</span>
                 <span className="text-foreground">{calibration ? `${calibration.stdDev.toFixed(3)} m/s²` : 'Waiting...'}</span>
               </div>
               {calibration && (
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase opacity-60">
                   <span>{t.scan.safety_multiplier}</span>
                   <span className="text-secure">3.0x Z-Score</span>
                 </div>
               )}
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className={cn("h-full transition-all duration-500", calibration ? "bg-secure" : "bg-accent")} style={{ width: calibration ? '100%' : '20%' }} />
               </div>
            </div>
          </GlassCard>
        </section>
      )}
    </main>
  );
}
