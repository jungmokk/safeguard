"use client";

import { useState, useEffect, useCallback } from 'react';

export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  magnitude: number;
}

import { applyLowPassFilter, calibrateSensor, CalibrationResult, calculateDynamicThreshold } from '@/lib/sensors/calibration';

export function useAccelerometer(initialThreshold: number = 0.162) {
  const [data, setData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0, magnitude: 0 });
  const [isVibrating, setIsVibrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calibration, setCalibration] = useState<CalibrationResult | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const acc = event.acceleration;
    if (!acc) return;

    const rawX = acc.x || 0;
    const rawY = acc.y || 0;
    const rawZ = acc.z || 0;
    const rawMagnitude = Math.sqrt(rawX * rawX + rawY * rawY + rawZ * rawZ);

    // Apply smoothing
    const smoothedMagnitude = applyLowPassFilter(data.magnitude, rawMagnitude, 0.7);
    
    setData({ x: rawX, y: rawY, z: rawZ, magnitude: smoothedMagnitude });

    // Threshold logic (Iteration 4)
    if (calibration) {
      // Use dynamic Z-score based threshold
      if (calculateDynamicThreshold(smoothedMagnitude, calibration.baseline, calibration.stdDev, 3)) {
        setIsVibrating(true);
        setTimeout(() => setIsVibrating(false), 2000);
      }
    } else if (smoothedMagnitude > initialThreshold && smoothedMagnitude > 0.02) {
      // Fallback to static threshold
      setIsVibrating(true);
      setTimeout(() => setIsVibrating(false), 2000);
    }
  }, [calibration, initialThreshold, data.magnitude]);

  const runCalibration = async (durationMs: number = 3000) => {
    setIsCalibrating(true);
    const samples: number[] = [];
    
    // Using a temporary listener to collect raw noise samples
    const calibrator = (event: DeviceMotionEvent) => {
      const acc = event.acceleration;
      if (acc) samples.push(Math.sqrt((acc.x || 0)**2 + (acc.y || 0)**2 + (acc.z || 0)**2));
    };

    window.addEventListener('devicemotion', calibrator);
    await new Promise(r => setTimeout(r, durationMs));
    window.removeEventListener('devicemotion', calibrator);

    const result = calibrateSensor(samples);
    setCalibration(result);
    setIsCalibrating(false);
    return result;
  };

  const requestPermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceMotionEvent as any).requestPermission();
        if (response === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
          return true;
        }
        return false;
      } catch (err) {
        setError('Permission request failed');
        return false;
      }
    } else {
      window.addEventListener('devicemotion', handleMotion);
      return true;
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [handleMotion]);

  return { data, isVibrating, error, requestPermission, calibration, isCalibrating, runCalibration };
}
