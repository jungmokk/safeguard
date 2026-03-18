"use client";

import { useState, useEffect } from 'react';

export interface MagnetometerData {
  x: number;
  y: number;
  z: number;
  total: number;
}

import { applyLowPassFilter, calibrateSensor, CalibrationResult } from '@/lib/sensors/calibration';

export function useMagnetometer() {
  const [data, setData] = useState<MagnetometerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const [calibration, setCalibration] = useState<CalibrationResult | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);

  useEffect(() => {
    if (!('Magnetometer' in window)) {
      setError('Magnetometer API not supported on this browser.');
      return;
    }

    let sensor: any = null;
    let lastTotal = 0;

    try {
      // @ts-ignore
      sensor = new Magnetometer({ frequency: 15 }); // Increased frequency for better filtering
      
      sensor.addEventListener('reading', () => {
        const { x, y, z } = sensor;
        const rawTotal = Math.sqrt(x * x + y * y + z * z);
        
        // Apply Low-pass filtering (Iteration 4)
        const smoothedTotal = applyLowPassFilter(lastTotal || rawTotal, rawTotal, 0.7);
        lastTotal = smoothedTotal;

        setData({ x, y, z, total: smoothedTotal });
      });

      sensor.addEventListener('error', (event: any) => {
        if (event.error.name === 'NotAllowedError') {
          setPermission('denied');
          setError('Permission to access magnetometer denied.');
        } else {
          setError(event.error.message);
        }
      });

      sensor.start();
      setPermission('granted');
    } catch (err: any) {
      setError(err.message);
    }

    return () => {
      if (sensor) sensor.stop();
    };
  }, []);

  const runCalibration = async (durationMs: number = 3000) => {
    if (!data) return;
    setIsCalibrating(true);
    const samples: number[] = [];
    
    const startTime = Date.now();
    while (Date.now() - startTime < durationMs) {
      if (data) samples.push(data.total);
      await new Promise(r => setTimeout(r, 100)); // Sample every 100ms
    }

    const result = calibrateSensor(samples);
    setCalibration(result);
    setIsCalibrating(false);
    return result;
  };

  return { data, error, permission, calibration, isCalibrating, runCalibration };
}
