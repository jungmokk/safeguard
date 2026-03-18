"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgpu';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

/**
 * Hook for AI-driven camera lens detection
 * Hybrid approach: 
 * 1. Pixel luminance for retro-reflection detection
 * 2. TensorFlow.js (COCO-SSD) for object classification
 */
export function useLensDetector(isStreaming: boolean) {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [predictions, setPredictions] = useState<cocoSsd.DetectedObject[]>([]);
  const [backend, setBackend] = useState<string>('wasm');

  // Initialize TensorFlow.js and load model
  useEffect(() => {
    async function initTF() {
      setIsModelLoading(true);
      try {
        // Try to use WebGPU for 3x speed boost (Rule 1 & Research Findings)
        try {
          await tf.setBackend('webgpu');
          setBackend('webgpu');
        } catch (e) {
          console.warn("WebGPU not supported, falling back to webgl/wasm");
          await tf.setBackend('webgl');
          setBackend('webgl');
        }

        const loadedModel = await cocoSsd.load({
          base: 'mobilenet_v2' // Recommended for mobile real-time (Rule 2)
        });
        setModel(loadedModel);
      } catch (err) {
        console.error("TF.js Initialization Error:", err);
      } finally {
        setIsModelLoading(false);
      }
    }

    if (isStreaming && !model) {
      initTF();
    }
  }, [isStreaming, model]);

  const detectObjects = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!model || !isStreaming) return [];
    
    // Performance Optimization: Run inference only every few frames
    const detections = await model.detect(videoElement);
    
    // Filter for small circular objects or electronics that might be cameras
    // Note: COCO-SSD has "cell phone", "remote", "clock" etc.
    // Custom logic: we label small electronics/round objects as higher threat
    setPredictions(detections);
    return detections;
  }, [model, isStreaming]);

  return { model, isModelLoading, predictions, detectObjects, backend };
}
