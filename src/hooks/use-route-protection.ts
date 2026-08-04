'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { isProfileComplete } from '@/lib/user-flow-backend';

export function useRouteProtection() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    // Don't do anything while loading
    if (loading) return;

    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if profile is complete
    const checkProfile = async () => {
      try {
        const isComplete = await isProfileComplete(user.uid);
        if (!isComplete) {
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        // On error, allow access (be permissive)
      }
    };

    checkProfile();
  }, [user, loading, router]);

  return { user, loading };
}

/**
 * Hook to require authentication only (no profile check)
 */
export function useAuth() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  return { user, loading };
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { user, loading } = useUser();

  if (loading) return { isAuthenticated: false, loading: true };

  return {
    isAuthenticated: !!user,
    loading: false,
    user,
  };
}
