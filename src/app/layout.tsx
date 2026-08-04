import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LanguageProvider } from '@/lib/i18n/provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import AITravelAssistant from '@/components/chat/AITravelAssistant';
import { Inter, Bricolage_Grotesque } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Headings ke liye alag display face.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700', '800'],
  variable: '--font-bricolage',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sathimate.com'),
  title: 'Sathimate Travel Connect',
  description: 'Connect online, form groups, and journey together',
  icons: {
    icon: '/my-images/logo.png',
    shortcut: '/my-images/logo.png',
    apple: '/my-images/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background overflow-x-hidden', inter.variable, bricolage.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <FirebaseClientProvider>
              {children}
              <AITravelAssistant />
              <Toaster />
            </FirebaseClientProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
