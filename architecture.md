# Architecture: SafeStay (SafeGuard)

## 1. Technical Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Vanilla CSS (Glassmorphism, Dark Theme)
- **Frameworks:** React
- **PWA:** `next-pwa` (Service Workers, manifest.json)
- **AI/Vision:** TensorFlow.js (Object Detection for lenses)
- **Sensors:**
  - Magnetometer API (EMF detection)
  - DeviceMotionEvent (Accelerometer for intrusion detection)
  - Wake Lock API (Preventing sleep during monitoring)
  - Web Audio API (Siren and voice alerts)

## 2. Directory Structure
```text
/src
  /app            - Next.js App Router (Dashboard, Scan, Guard, Checklist)
  /components     - UI components (CameraPreview, Sensors, UI elements)
  /lib            - Core sensor logic (WakeLock, EMF/Motion wrappers)
  /services       - Potential backend integrations (Future Scope)
  /styles         - Global and modular CSS
/public
  /icons          - PWA icons
  /audio          - Siren and voice alert samples
  /manifest.json  - PWA configuration
```

## 3. Core Logic & Data Flow
1. **EMF Detection:** Raw magnetometer data (μT) -> threshold analysis (62μT/192μT) -> UI feedback + Haptic vibrations.
2. **Intrusion Detection:** Accelerometer spikes (>0.162 m/s²) -> Counter/Timer logic -> Siren trigger + Voice guard.
3. **Lens Detection:** Camera stream -> Luminance thresholding + Circular Hough Transform (Prototype) -> AR Glow overlay.
4. **Sleep Prevention:** User gesture -> Wake Lock Request -> App stays active with Black UI layer.

## 4. Design Principles
- **Aesthetics:** Premium Dark Mode (#0A0E1A), Accents (#FFD700), Glassmorphism effects.
- **Responsiveness:** Optimized for mobile browser and standalone PWA usage.
- **Safety First:** Clear, immediate feedback for all threats.
