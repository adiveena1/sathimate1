'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './config';
import { FirebaseProvider } from './provider';

// This provider ensures that Firebase is initialized only once on the client
// and shares the same instance across all children components.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseServices = useMemo(() => initializeFirebase(), []);

  return <FirebaseProvider {...firebaseServices}>{children}</FirebaseProvider>;
}
