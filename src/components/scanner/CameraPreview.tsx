"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/core-ui';
import { requestCameraPermission } from '@/lib/permissions';

import { useLensDetector } from '@/components/scanner/use-lens-detector';

interface CameraPreviewProps {
  onStreamReady?: (stream: MediaStream) => void;
  className?: string;
}

export function CameraPreview({ onStreamReady, className }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedLens, setDetectedLens] = useState<{ x: number, y: number, score: number } | null>(null);
  
  const { detectObjects, predictions, isModelLoading, backend } = useLensDetector(isStreaming);

  // Evidence-Based Optical Logic (Source: Journal of Science & Technology)
  // - Combined logic: ML Object Detection + Pixel Luminance
  useEffect(() => {
    let animationId: number;
    let lastInferenceTime = 0;
    
    const analyzeFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !isStreaming) {
        animationId = requestAnimationFrame(analyzeFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // 1. Pixel Luminance Analysis (Fast)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let bestSpot = null;
      let maxBrightness = 0;

      for (let i = 0; i < data.length; i += 40) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (avg > 235) {
          const x = (i / 4) % canvas.width;
          const y = Math.floor((i / 4) / canvas.width);
          if (avg > maxBrightness) {
            maxBrightness = avg;
            bestSpot = { x: (x / canvas.width) * 100, y: (y / canvas.height) * 100, score: avg };
          }
        }
      }
      setDetectedLens(bestSpot);

      // 2. ML Inference (Throttled for performance)
      const now = Date.now();
      if (now - lastInferenceTime > 200) { // 5 FPS for ML to save battery
        await detectObjects(video);
        lastInferenceTime = now;
      }

      animationId = requestAnimationFrame(analyzeFrame);
    };

    if (isStreaming) {
      animationId = requestAnimationFrame(analyzeFrame);
    }

    return () => cancelAnimationFrame(animationId);
  }, [isStreaming, detectObjects]);

  useEffect(() => {
    async function setupCamera() {
      const granted = await requestCameraPermission();
      if (!granted) {
        setError("Camera permission is required to use the scanner.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
          onStreamReady?.(stream);
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        setError("Camera access denied. Please enable permissions.");
      }
    }

    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onStreamReady]);

  if (error) {
    return (
      <div className="w-full aspect-[3/4] glass flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="p-4 bg-alert/20 rounded-full text-alert">
          <CameraOff size={48} />
        </div>
        <p className="font-semibold">{error}</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-black ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover grayscale brightness-120"
      />
      
      {/* Hidden canvas for pixel analysis */}
      <canvas ref={canvasRef} width="160" height="120" className="hidden" />
      
      {/* AI Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* ML Prediction Boxes */}
        {predictions.map((pred, i) => (
          <div 
            key={i}
            className="absolute border border-accent bg-accent/10 rounded flex flex-col"
            style={{
              left: `${(pred.bbox[0] / (videoRef.current?.videoWidth || 1)) * 100}%`,
              top: `${(pred.bbox[1] / (videoRef.current?.videoHeight || 1)) * 100}%`,
              width: `${(pred.bbox[2] / (videoRef.current?.videoWidth || 1)) * 100}%`,
              height: `${(pred.bbox[3] / (videoRef.current?.videoHeight || 1)) * 100}%`,
            }}
          >
            <span className="bg-accent text-background text-[10px] px-1 font-bold uppercase whitespace-nowrap w-fit">
              {pred.class} ({Math.round(pred.score * 100)}%)
            </span>
          </div>
        ))}

        {/* Luminance Marker (Retro-reflection) */}
        {detectedLens && (
          <div 
            className="absolute w-8 h-8 border-2 border-alert rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_var(--alert)]"
            style={{ left: `${detectedLens.x}%`, top: `${detectedLens.y}%` }}
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-alert text-[8px] font-bold text-black px-1 rounded uppercase">
              Lens Reflection
            </div>
          </div>
        )}
        
        {/* Scanning Dashboard */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="px-2 py-1 bg-black/60 rounded text-[10px] border border-white/10 uppercase tracking-widest font-bold">
            AI: {isModelLoading ? 'Loading...' : `Live (${backend.toUpperCase()})`}
          </div>
        </div>

        {/* Scanning Grid */}
        <div className="w-full h-full border-[0.5px] border-white/10 grid grid-cols-4 grid-rows-6 opacity-30" />
        
        {/* Scanning Line */}
        <div className="absolute w-full h-0.5 bg-accent/30 shadow-[0_0_15px_var(--accent)] animate-[scan_3s_linear_infinite]" 
             style={{ top: '0%' }} 
        />
      </div>

      {!isStreaming && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <Camera className="text-accent" size={40} />
            <span className="text-sm font-bold tracking-widest uppercase">Initializing...</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* Add specialized scan animation to globals.css if needed, or use inline style */
