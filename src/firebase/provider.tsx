
'use client';

import React, { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Analytics } from 'firebase/analytics';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  analytics: Analytics | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  db: null,
  analytics: null,
});

export function FirebaseProvider({
  children,
  app,
  auth,
  db,
  analytics,
}: {
  children: React.ReactNode;
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  analytics: Analytics | null;
}) {
  const value = React.useMemo(() => ({ app, auth, db, analytics }), [app, auth, db, analytics]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};

export const useFirebaseApp = () => useFirebase().app;
export const useAuth = () => {
  const firebase = useFirebase();
  return firebase.app ? firebase.auth : null;
};
export const useFirestore = () => {
  const firebase = useFirebase();
  return firebase.app ? firebase.db : null;
};
export const useAnalytics = () => {
  const firebase = useFirebase();
  return firebase.app ? firebase.analytics : null;
};
