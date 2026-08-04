
'use client';

// This file is the single source of truth for all Firebase-related functionality.
// It exports an initialization function, providers, and hooks for easy access
// throughout the application. By centralizing these exports, we can ensure
// consistent Firebase usage and make it easier to manage dependencies.

// It's crucial to understand that this file, and the functions it exports,
// are designed to be used in 'use client' components. Firebase JS SDK
// is a client-side library.

export { initializeFirebase } from './config';
export {
  FirebaseProvider,
  useFirebaseApp,
  useFirestore,
  useAuth,
  useFirebase,
  useAnalytics,
} from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
