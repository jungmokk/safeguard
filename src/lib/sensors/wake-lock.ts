"use client";

export async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      const wakeLock = await (navigator as any).wakeLock.request('screen');
      console.log('Wake Lock is active');
      return wakeLock;
    } catch (err: any) {
      console.error(`${err.name}, ${err.message}`);
      return null;
    }
  }
  return null;
}
