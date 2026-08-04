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
import { Menu, User, LogOut, X, Compass, Users, Bell, Search, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../theme/theme-toggle';
import { LanguageToggle } from '../shared/LanguageToggle';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

export function PremiumHeader() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
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
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      );
    }

    if (user) {
      return (
        <div className="flex items-center gap-3 md:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 ring-2 ring-transparent hover:ring-blue-400/30 transition-all duration-300 hover:bg-blue-500/10"
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
            <DropdownMenuContent
              className="w-64 backdrop-blur-xl bg-white/98 dark:bg-black/98 border border-white/20 dark:border-white/10 rounded-xl shadow-xl"
              align="end"
            >
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
              <DropdownMenuSeparator className="bg-white/10 dark:bg-white/5" />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 md:gap-3">
        <Button
          asChild
          variant="ghost"
          className="hidden sm:inline-flex text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-blue-500/10 transition-all duration-300 rounded-full"
        >
          <Link href="/login">Sign In</Link>
        </Button>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 px-6"
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
          ? 'bg-white/85 dark:bg-black/85 backdrop-blur-xl border-b border-white/15 dark:border-white/10 shadow-lg'
          : 'bg-gradient-to-b from-white/40 dark:from-black/60 to-white/20 dark:to-black/40 backdrop-blur-2xl border-b border-white/10 dark:border-white/5'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Left: Logo
              PEHLE KYA THA: logo.png ek 1024x1024 square tha jisme asli artwork
              sirf 545x424 tha — 58% file khaali transparent padding thi. Uspe
              se lockup stacked tha (symbol upar, "SATHIMATE" neeche).
              h-10 par render hone se wordmark ~3px ka reh jata tha. Isliye
              alphabet dikhte hi nahi the.

              AB: padding crop karke symbol aur wordmark alag assets bana diye,
              aur lockup horizontal kar diya. h-20 header mein ab wordmark ko
              poori height milti hai. */}
          <Link
            href="/"
            aria-label="Sathimate — home"
            className="group flex items-center gap-2.5 flex-shrink-0 transition-opacity duration-300 hover:opacity-80 active:scale-95"
          >
            <Image
              src="/my-images/logo-mark.png"
              alt=""
              width={702}
              height={825}
              className="h-11 w-auto transition-transform duration-300 group-hover:scale-105 md:h-12"
              priority
            />

            {/* Wordmark ke do versions — dark blue dark background par doob
                jata hai. Chhoti screen par sirf symbol, warna nav cramp ho
                jata hai. */}
            <Image
              src="/my-images/logo-wordmark.png"
              alt="Sathimate"
              width={1629}
              height={207}
              className="hidden h-[18px] w-auto sm:block dark:sm:hidden md:h-5"
              priority
            />
            <Image
              src="/my-images/logo-wordmark-dark.png"
              alt="Sathimate"
              width={1629}
              height={207}
              className="hidden h-[18px] w-auto dark:sm:block md:h-5"
              priority
            />
          </Link>

          {/* Center: Navigation - Hidden on Mobile */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group',
                    isActive(link.href)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/15'
                      : 'text-foreground/70 hover:text-foreground hover:bg-blue-50/50 dark:hover:bg-blue-500/10'
                  )}
                >
                  <Icon className={cn(
                    'h-4 w-4 transition-all duration-300',
                    isActive(link.href) ? 'text-blue-600 dark:text-blue-400' : 'group-hover:scale-110'
                  )} />
                  <span>{link.label}</span>
                  {isActive(link.href) && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-3 ml-auto">
            <div className="hidden md:flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <AuthNav />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-10 w-10 hover:bg-blue-500/20 transition-all duration-300 rounded-full"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full sm:w-80 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-r border-white/10 dark:border-white/5 p-0 flex flex-col shadow-2xl"
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 dark:border-white/5 bg-gradient-to-r from-blue-50/50 dark:from-blue-500/10 to-transparent">
                  <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                    <Image
                      src="/my-images/logo-mark.png"
                      alt=""
                      width={702}
                      height={825}
                      className="h-9 w-auto"
                    />
                    <Image
                      src="/my-images/logo-wordmark.png"
                      alt="Sathimate"
                      width={1629}
                      height={207}
                      className="h-4 w-auto dark:hidden"
                    />
                    <Image
                      src="/my-images/logo-wordmark-dark.png"
                      alt="Sathimate"
                      width={1629}
                      height={207}
                      className="hidden h-4 w-auto dark:block"
                    />
                  </Link>
                  <div className="flex items-center gap-2">
                    <LanguageToggle />
                    <ThemeToggle />
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-blue-500/20 rounded-full transition-all duration-300">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                </div>

                {/* Mobile Menu Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  <div className="space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground/50 px-3">
                      Navigation
                    </p>
                    <div className="space-y-1.5">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <SheetClose asChild key={link.href}>
                            <Link
                              href={link.href}
                              className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                                isActive(link.href)
                                  ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 font-semibold'
                                  : 'text-foreground/70 hover:text-foreground hover:bg-blue-50/50 dark:hover:bg-blue-500/10'
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
                      <div className="border-t border-white/10 dark:border-white/5 pt-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground/50 px-3 mb-3">
                          Account
                        </p>
                        <SheetClose asChild>
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-blue-600/15 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium"
                          >
                            <User className="h-5 w-5" />
                            <span>My Profile</span>
                          </Link>
                        </SheetClose>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-600/10 transition-all duration-300 mt-3 font-medium"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                        </button>
                      </div>
                    </>
                  )}

                  {!user && (
                    <div className="border-t border-white/10 dark:border-white/5 pt-5 space-y-3">
                      <SheetClose asChild>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-full font-semibold border-blue-200 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        >
                          <Link href="/login">Sign In</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
