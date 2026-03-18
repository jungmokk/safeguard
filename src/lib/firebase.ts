import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDTG1GnLOA2A6dltfQoM2pyG08m-80vAL0",
  authDomain: "safeguard-app-2026.firebaseapp.com",
  projectId: "safeguard-app-2026",
  storageBucket: "safeguard-app-2026.firebasestorage.app",
  messagingSenderId: "213478403984",
  appId: "1:213478403984:web:82862546990b4682e28d15"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
