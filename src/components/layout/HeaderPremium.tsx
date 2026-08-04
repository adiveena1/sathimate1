'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Menu, User, LogOut, Search, X, ChevronDown, Compass, Users, Bell, Settings } from 'lucide-react';
import { ThemeToggle } from '../theme/theme-toggle';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { GlobalSearch } from '../shared/GlobalSearch';

export function Header() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const logoImage = PlaceHolderImages.find((img) => img.id === 'site-logo');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoggingOut(true);
    try {
      if (auth) {
        await signOut(auth);
      }
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: '/sathi-space', label: 'Community', icon: Users },
    ...(user ? [
      { href: '/groups', label: 'Groups', icon: Compass },
      { href: '/search', label: 'Find Sathi', icon: Search },
    ] : []),
    { href: '/safety-and-trust', label: 'Safety', icon: Bell },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const AuthNav = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      );
    }

    if (user) {
      return (
        <div className="flex items-center gap-3 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 rounded-full p-0 ring-2 ring-transparent hover:ring-blue-500/50 transition-all duration-200"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.photoURL || ''}
                    alt={user.displayName || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {user.displayName?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 backdrop-blur-xl bg-white/95 dark:bg-black/95 border-white/20 dark:border-white/10 rounded-2xl shadow-2xl" align="end">
              <DropdownMenuLabel className="font-normal px-4 py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {user.displayName || 'Welcome'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10 dark:bg-white/5" />
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer px-4 py-2.5 flex items-center gap-3 text-sm text-foreground hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4 text-blue-600" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <div
                  onClick={handleLogout}
                  className="cursor-pointer px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 md:gap-4">
        <Button
          asChild
          variant="ghost"
          className="text-sm font-medium hover:bg-white/10 text-white"
        >
          <Link href="/login">Sign In</Link>
        </Button>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>
    );
  };

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-500',
        scrolled
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-b border-white/10 dark:border-white/5 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-lg border-b border-white/5'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-all duration-300 hover:opacity-80 active:scale-95 flex-shrink-0"
          >
            <div className="relative group">
              {logoImage ? (
                <Image
                  src={logoImage.imageUrl}
                  alt="Sathimate"
                  width={160}
                  height={160}
                  className="h-10 w-auto drop-shadow-xl transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  data-ai-hint={logoImage.imageHint}
                  priority
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl blur-lg opacity-50" />
                    <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg px-3 py-1.5">
                      <span className="text-sm font-black text-white tracking-tight">S</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Sathimate
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Center: Navigation - Hidden on Mobile */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(link.href)
                      ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
            </div>
            <AuthNav />
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-10 w-10 hover:bg-white/10 dark:hover:bg-white/5"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full sm:w-80 bg-white dark:bg-black border-r border-white/10 dark:border-white/5 p-0 flex flex-col shadow-2xl backdrop-blur-xl"
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-white/5 bg-gradient-to-r from-white/5 to-transparent dark:from-white/5">
                  <Link href="/" className="flex items-center gap-2">
                    {logoImage && (
                      <Image
                        src={logoImage.imageUrl}
                        alt="Sathimate"
                        width={140}
                        height={140}
                        className="h-8 w-auto"
                        data-ai-hint={logoImage.imageHint}
                      />
                    )}
                  </Link>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                </div>

                {/* Mobile Menu Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
                      Navigation
                    </p>
                    <div className="space-y-1">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <SheetClose asChild key={link.href}>
                            <Link
                              href={link.href}
                              className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                isActive(link.href)
                                  ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400 font-semibold'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5'
                              )}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{link.label}</span>
                            </Link>
                          </SheetClose>
                        );
                      })}
                    </div>
                  </div>

                  {user && (
                    <>
                      <div className="border-t border-white/10 dark:border-white/5 pt-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2 mb-3">
                          Account
                        </p>
                        <SheetClose asChild>
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-blue-600/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                          >
                            <User className="h-5 w-5" />
                            <span>My Profile</span>
                          </Link>
                        </SheetClose>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-600/10 transition-all duration-200 mt-2"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                        </button>
                      </div>
                    </>
                  )}

                  {!user && (
                    <div className="border-t border-white/10 dark:border-white/5 pt-4 space-y-3">
                      <SheetClose asChild>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-lg"
                        >
                          <Link href="/login">Sign In</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg"
                        >
                          <Link href="/signup">Get Started</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
