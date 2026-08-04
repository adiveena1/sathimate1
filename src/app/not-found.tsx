'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. Don't worry, you can always go back to the homepage or explore other sections.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="px-6 py-2">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" className="px-6 py-2">
            <Link href="/search">Explore</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
