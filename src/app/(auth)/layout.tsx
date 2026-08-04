
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If auth is done loading and the user is logged in, redirect them.
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // While loading auth state, or if a user is found (and we are about to redirect),
  // show a loading indicator. This prevents the login/signup form from flashing.
  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            {loading ? 'Verifying your session...' : 'Redirecting to homepage...'}
          </p>
        </div>
      </div>
    );
  }

  // If auth is done loading and there is no user, show the auth page.
  return <div className="min-h-screen bg-background">{children}</div>;
}
