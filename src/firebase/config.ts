'use client';

import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const rawFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const firebaseConfig = Object.fromEntries(
  Object.entries(rawFirebaseConfig).filter(([, value]) => Boolean(value?.trim()))
) as FirebaseOptions;

interface FirebaseServices {
  app: FirebaseApp | null;
  auth: Auth;
  db: Firestore;
  analytics: Analytics | null;
}

const NULL_SERVICES: FirebaseServices = {
  app: null,
  auth: null as unknown as Auth,
  db: null as unknown as Firestore,
  analytics: null
};

// Use a global on window to survive HMR and bundle splits in development
const GLOBAL_FIREBASE_KEY = '__SATHIMATE_FIREBASE_SERVICES__';

// Validate Firebase config — returns missing fields instead of throwing
function getMissingFirebaseFields(): string[] {
  const requiredFields = ['apiKey', 'authDomain', 'projectId'] as const;
  return requiredFields.filter(field => !firebaseConfig[field]);
}

// Helper function to initialize Firebase and get services
export function initializeFirebase(): FirebaseServices {
  if (typeof window !== 'undefined' && (window as any)[GLOBAL_FIREBASE_KEY]) {
    return (window as any)[GLOBAL_FIREBASE_KEY];
  }

  const missing = getMissingFirebaseFields();
  if (missing.length > 0) {
    console.warn(
      `[Sathimate] Firebase configuration incomplete. Missing: ${missing.join(', ')}. ` +
      `Please set NEXT_PUBLIC_FIREBASE_* environment variables in .env.local. ` +
      `Firebase features will be disabled until this is resolved.`
    );
    return NULL_SERVICES;
  }

  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    // Initialize Analytics only when measurement config is present
    let analytics: Analytics | null = null;
    try {
      if (typeof window !== 'undefined' && firebaseConfig.appId && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
    } catch (e) {
      console.warn('Firebase Analytics initialization skipped:', e);
    }
    
    const services = { app, auth, db, analytics };
    if (typeof window !== 'undefined') {
      (window as any)[GLOBAL_FIREBASE_KEY] = services;
    }
    return services;
  } catch (e) {
    console.error('[Sathimate] Firebase initialization failed:', e);
    return NULL_SERVICES;
  }
}
