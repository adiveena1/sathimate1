'use client';

import { type Firestore } from 'firebase/firestore';
import { initializeFirebase } from './config';

const services = initializeFirebase();
let dbInstance: Firestore = services.db;

function resolveDb(): Firestore {
  if (!dbInstance) {
    const s = initializeFirebase();
    dbInstance = s.db;
  }
  return dbInstance;
}

export function getDb(): Firestore {
  return resolveDb();
}

export function getFirebaseDb(): Firestore {
  return resolveDb();
}

// Export the real instance instead of a Proxy. 
// If Firebase fails to initialize (e.g. missing env vars), this will be null.
export const db = services.db as Firestore;
