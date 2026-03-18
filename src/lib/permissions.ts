import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export async function requestCameraPermission() {
  if (Capacitor.getPlatform() === 'web') return true;

  try {
    const status = await Camera.checkPermissions();
    if (status.camera === 'granted') return true;

    const requestStatus = await Camera.requestPermissions({ permissions: ['camera'] });
    return requestStatus.camera === 'granted';
  } catch (error) {
    console.error('Camera permission request failed:', error);
    return false;
  }
}

export async function requestLocationPermission() {
  if (Capacitor.getPlatform() === 'web') return true;

  try {
    const status = await Geolocation.checkPermissions();
    if (status.location === 'granted') return true;

    const requestStatus = await Geolocation.requestPermissions({ permissions: ['location'] });
    return requestStatus.location === 'granted';
  } catch (error) {
    console.error('Location permission request failed:', error);
    return false;
  }
}

export async function checkAllPermissions() {
  const cameraGranted = await requestCameraPermission();
  const locationGranted = await requestLocationPermission();
  return { cameraGranted, locationGranted };
}
