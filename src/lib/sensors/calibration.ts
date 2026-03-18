/**
 * Sensor Optimization Utilities (Iteration 4)
 * Based on W3C Geolocation and Alexander Pacha research.
 */

export interface CalibrationResult {
  baseline: number;
  stdDev: number;
  sensitivity: number;
}

/**
 * 1-st Order Low-pass Filter for smoothing jitter
 * value = alpha * prevValue + (1 - alpha) * newValue
 */
export const applyLowPassFilter = (prevValue: number, newValue: number, alpha: number = 0.8) => {
  return alpha * prevValue + (1 - alpha) * newValue;
};

/**
 * Calculates a dynamic Z-score based threshold
 * If (newValue - baseline) > (stdDev * sensitivityMultiplier), it's a spike.
 */
export const calculateDynamicThreshold = (
  value: number, 
  baseline: number, 
  stdDev: number, 
  multiplier: number = 3
) => {
  const zScore = Math.abs(value - baseline) / (stdDev || 0.01);
  return zScore > multiplier;
};

/**
 * Baseline calibration helper
 * Takes a sample of sensor readings and calculates average noise and stability
 */
export const calibrateSensor = (samples: number[]): CalibrationResult => {
  if (samples.length === 0) return { baseline: 0, stdDev: 0, sensitivity: 1 };
  
  const sum = samples.reduce((a, b) => a + b, 0);
  const baseline = sum / samples.length;
  
  const squareDiffs = samples.map(value => Math.pow(value - baseline, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / samples.length;
  const stdDev = Math.sqrt(avgSquareDiff);

  // High stdDev means noisy environment -> lower sensitivity
  // Low stdDev means quiet environment -> higher sensitivity
  const sensitivity = stdDev > 0.5 ? 0.5 : stdDev < 0.05 ? 1.5 : 1.0;

  return { baseline, stdDev, sensitivity };
};
