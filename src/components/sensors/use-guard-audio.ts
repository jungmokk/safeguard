"use client";

import { useRef, useCallback, useState } from 'react';

/**
 * Hook to manage SafeStay Guard Audio
 * - Handles Siren (Synthesized or Sampled)
 * - Handles "Who is it?" Voice Guard
 * - Handles iOS AudioContext Unlocking
 */
export function useGuardAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sirenOscRef = useRef<OscillatorNode | null>(null);
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);

  // Initialize or Unlock AudioContext
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    // Play a silent buffer to unlock iOS audio
    const buffer = audioContextRef.current.createBuffer(1, 1, 22050);
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start(0);
  }, []);

  // Synthesize a Siren sound if no file exists
  const startSiren = useCallback(() => {
    if (!audioContextRef.current || sirenOscRef.current) return;
    
    authCheck(); // Ensure context is running

    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
    
    // Siren wail effect
    osc.frequency.exponentialRampToValueAtTime(880, audioContextRef.current.currentTime + 0.5);
    osc.frequency.exponentialRampToValueAtTime(440, audioContextRef.current.currentTime + 1.0);
    
    gain.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, audioContextRef.current.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);
    
    osc.start();
    
    // Loop frequency wail
    const interval = setInterval(() => {
      if (!audioContextRef.current) return;
      const now = audioContextRef.current.currentTime;
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
      osc.frequency.exponentialRampToValueAtTime(440, now + 1.0);
    }, 1000);

    sirenOscRef.current = osc;
    (osc as any)._interval = interval;
    setIsPlayingSiren(true);
  }, []);

  const stopSiren = useCallback(() => {
    if (sirenOscRef.current) {
      clearInterval((sirenOscRef.current as any)._interval);
      sirenOscRef.current.stop();
      sirenOscRef.current.disconnect();
      sirenOscRef.current = null;
      setIsPlayingSiren(false);
    }
  }, []);

  // Voice Alert Prototype - Uses SpeechSynthesis as a placeholder if no audio file is available
  const playVoiceAlert = useCallback((text = "Who is it?") => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  const authCheck = () => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  return { initAudio, startSiren, stopSiren, playVoiceAlert, isPlayingSiren };
}
