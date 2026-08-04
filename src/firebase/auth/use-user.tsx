'use client';

import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

interface AuthState {
  user: User | null;
  loading: boolean;
}

/**
 * OPTIMIZATION: useUser hook with fixes for:
 * 1. Memory leak prevention with proper cleanup
 * 2. Avoid multiple subscriptions to Firebase
 * 3. Prevent infinite re-render loops
 * 4. Handle null auth gracefully
 * 5. Use useCallback to prevent dependency updates
 */
export function useUser(): AuthState {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Exit early if auth not initialized
    if (!auth) {
      console.debug('[useUser] Auth not initialized yet');
      setLoading(false);
      return;
    }

    // Track if component is mounted to avoid state updates after unmount
    let isMounted = true;
    let unsubscribe: ReturnType<typeof onAuthStateChanged> | null = null;

    try {
      // Subscribe to auth state changes
      unsubscribe = onAuthStateChanged(auth, (user) => {
        // Only update state if component is still mounted
        if (isMounted) {
          setUser(user);
          setLoading(false);
        }
      }, (error) => {
        // Handle auth state change errors
        console.error('[useUser] Auth state error:', error);
        if (isMounted) {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('[useUser] Failed to subscribe to auth state:', error);
      if (isMounted) {
        setLoading(false);
      }
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [auth]); // Only depend on auth object

  return { user, loading };
}
