"use client";

import React, { useState } from 'react';
import { Camera, Zap, Shield, ArrowLeft, Info, AlertCircle, RefreshCw, Activity, ShieldCheck } from 'lucide-react';
import { CameraPreview } from '@/components/scanner/CameraPreview';
import { useMagnetometer } from '@/components/sensors/use-magnetometer';
import { GlassCard, Button, cn } from '@/components/ui/core-ui';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type ScanMode = 'optical' | 'emf';

import { createAlert } from '@/lib/alerts';

export default function ScanPage() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<ScanMode>('optical');
  const { data: magData, error: magError, calibration, isCalibrating, runCalibration } = useMagnetometer();

  // Dynamic thresholds (Iteration 4)
  const emfBaseline = calibration ? calibration.baseline : 50; 
  const emfNoise = calibration ? calibration.stdDev : 5;
  
  const isEmfWarning = magData && magData.total > (emfBaseline + emfNoise * 4.5);
  const isEmfCritical = magData && magData.total > (emfBaseline + 150);

  const handleReport = async () => {
    try {
      if (mode === 'emf' && magData) {
        await createAlert({
          type: 'emf',
          value: magData.total,
        });
        alert(t.common.success_report);
      } else if (mode === 'optical') {
        await createAlert({
          type: 'lens',
          value: 1, 
        });
        alert(t.common.success_report);
      }
    } catch (e) {
      console.error(e);
      alert(t.common.error_report);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-black text-foreground overflow-hidden">
      {/* Top Navigation */}
      <nav className="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/">
          <Button variant="ghost" className="p-2">
            <ArrowLeft size={24} />
          </Button>
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-foreground/50">{t.home.ai_scanner}</span>
          <span className="font-bold flex items-center gap-2">
            {mode === 'optical' ? <Camera size={16} className="text-accent" /> : <Zap size={16} className="text-alert" />}
            {mode === 'optical' ? t.scan.lens_detection : t.scan.emf_analysis}
          </span>
        </div>
        <Button 
          variant="ghost" 
          className={cn("p-2", isCalibrating && "animate-spin")}
          onClick={() => mode === 'emf' && runCalibration()}
          disabled={isCalibrating || mode !== 'emf'}
        >
          {isCalibrating ? <RefreshCw size={24} /> : <Info size={24} />}
        </Button>
      </nav>

      {/* Main Scanner View */}
      <div className="flex-1 relative flex flex-col items-center justify-center px-4">
        {mode === 'optical' ? (
          <CameraPreview className="max-w-md w-full shadow-[0_0_50px_rgba(0,195,255,0.15)]" />
        ) : (
          <div className="w-full max-w-md flex flex-col items-center justify-center space-y-6 pt-4 text-center">
            {/* Calibration Banner */}
            {!calibration && !isCalibrating && (
              <GlassCard className="w-full border-accent/30 bg-accent/5 p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="p-2 bg-accent rounded-lg text-background"><Activity size={20} /></div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-wider">{t.scan.calibration_required}</p>
                  <p className="text-[10px] text-foreground/60 leading-tight mt-0.5">{t.scan.calibration_desc}</p>
                </div>
                <Button className="h-8 px-4 text-[10px] uppercase font-black" onClick={() => runCalibration()}>{t.common.start}</Button>
              </GlassCard>
            )}

            {isCalibrating && (
              <GlassCard className="w-full border-white/10 p-4 flex flex-col gap-3">
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                   <span>{t.scan.analyzing}</span>
                   <span className="text-accent animate-pulse">{t.scan.keep_still}</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-accent animate-[calibration-progress_3s_linear]" />
                 </div>
              </GlassCard>
            )}

            {/* Visual EMF Gauge */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className={cn(
                "absolute inset-0 rounded-full border-2 border-white/10",
                isEmfWarning && "animate-ping bg-alert/5",
                isEmfCritical && "animate-[ping_0.5s_linear_infinite] bg-alert/20"
              )} />
              <div className={cn(
                "w-40 h-40 rounded-full border-4 border-dashed border-white/20 flex flex-col items-center justify-center transition-all",
                isEmfWarning && "border-alert/50 shadow-[0_0_20px_rgba(255,100,100,0.2)]",
                isEmfCritical && "border-alert shadow-[0_0_30px_var(--alert)]"
              )}>
                <span className={cn(
                  "text-4xl font-black transition-colors",
                  isEmfCritical ? "text-alert" : isEmfWarning ? "text-alert/70" : "text-foreground"
                )}>
                  {magData ? Math.round(magData.total) : '--'}
                </span>
                <span className="text-xs text-foreground/50 uppercase tracking-tighter">μT (Microtesla)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full text-center">
              <div className="glass p-3 rounded-xl border-white/5">
                <p className="text-[10px] text-foreground/40 uppercase">X-Axis</p>
                <p className="font-mono text-sm">{magData ? magData.x.toFixed(1) : '0.0'}</p>
              </div>
              <div className="glass p-3 rounded-xl border-white/5">
                <p className="text-[10px] text-foreground/40 uppercase">Y-Axis</p>
                <p className="font-mono text-sm">{magData ? magData.y.toFixed(1) : '0.0'}</p>
              </div>
              <div className="glass p-3 rounded-xl border-white/5">
                <p className="text-[10px] text-foreground/40 uppercase">Z-Axis</p>
                <p className="font-mono text-sm">{magData ? magData.z.toFixed(1) : '0.0'}</p>
              </div>
            </div>

            {isEmfWarning && (
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                isEmfCritical ? "text-background bg-alert border-alert animate-bounce" : "text-alert bg-alert/10 border-alert/20"
              )}>
                <AlertCircle size={18} />
                <span className="text-sm font-bold uppercase tracking-tight">
                  {isEmfCritical ? t.scan.critical_alert : t.scan.abnormal_alert}
                </span>
              </div>
            )}
            
            {calibration && (
              <GlassCard className="w-full p-4 border-secure/30 bg-secure/5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-secure" size={20} />
                  <div className="flex-1 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-secure">{t.scan.optimized_sensitivity}</p>
                    <p className="text-[10px] text-foreground/60 leading-tight">Environment noise (±{calibration.stdDev.toFixed(1)}μT) filtered.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold opacity-40 uppercase">Baseline</p>
                    <span className="text-xs font-black">{Math.round(calibration.baseline)}μT</span>
                  </div>
                </div>
              </GlassCard>
            )}
            
            {magError && (
              <p className="text-alert text-xs text-center">{magError}</p>
            )}
          </div>
        )}

        {/* Guidance Note */}
        <div className="mt-8 text-center text-sm text-foreground/40 max-w-[280px]">
          {mode === 'optical' 
            ? t.scan.optical_guide
            : t.scan.emf_guide}
        </div>
      </div>

      {/* Mode Selector Tab */}
      <div className="p-8 flex justify-center mt-auto">
        <div className="glass-card p-1 rounded-2xl flex gap-1 border-white/10 shadow-xl overflow-hidden">
          <button 
            onClick={() => setMode('optical')}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
              mode === 'optical' ? "bg-accent text-background glow-accent" : "hover:bg-white/5 text-foreground/60"
            )}
          >
            <Camera size={20} />
            <span>{mode === 'optical' ? 'OPTICAL' : 'EMF'}</span>
          </button>
          <button 
             onClick={() => setMode('emf')}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
              mode === 'emf' ? "bg-alert text-foreground glow-alert" : "hover:bg-white/5 text-foreground/60"
            )}
          >
            <Zap size={20} />
            <span>EMF</span>
          </button>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="px-8 pb-8">
        {(mode === 'optical' || isEmfCritical) && (
          <Button 
            className="w-full" 
            variant="secondary"
            onClick={handleReport}
          >
            {t.scan.report_discovery}
          </Button>
        )}
      </div>
    </main>
  );
}
