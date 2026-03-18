import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export interface AlertPost {
  id?: string;
  type: 'emf' | 'lens';
  value: number;
  location?: {
    lat: number;
    lng: number;
  };
  timestamp: any;
  userId?: string;
}

export const createAlert = async (alert: Omit<AlertPost, 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, 'community_alerts'), {
      ...alert,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const subscribeToAlerts = (callback: (alerts: AlertPost[]) => void) => {
  const q = query(collection(db, 'community_alerts'), orderBy('timestamp', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AlertPost[];
    callback(alerts);
  });
};
