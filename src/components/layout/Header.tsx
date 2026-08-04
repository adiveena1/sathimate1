
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
import { Menu, User, LogOut, Search, X, ArrowRight } from 'lucide-react';
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
    { href: '/sathi-space', label: 'Sathi Space' },
    ...(user ? [
      { href: '/groups', label: 'Groups' },
      { href: '/search', label: 'Find Sathi' },
      { href: '/requests', label: 'Requests' }
    ] : []),
    { href: '/nearby', label: 'Nearby' },
    { href: '/safety-and-trust', label: 'Safety' },
    { href: '/how-it-works', label: 'Sathimate Work' },
    { href: '/about', label: 'About' },
  ];

  const AuthNav = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-32" />
        </div>
      );
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user.photoURL || ''}
                  alt={user.displayName || 'User'}
                />
                <AvatarFallback>
                  {user.displayName?.charAt(0).toUpperCase() ||
                    user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.displayName || 'Welcome'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="hidden items-center gap-2 md:flex">
        <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black">
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Join Community</Link>
        </Button>
      </div>
    );
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent',
        scrolled ? 'bg-black/70 backdrop-blur-xl border-white/10 py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto flex h-[75px] max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105 active:scale-95">
            {logoImage ? (
              <div className="relative group">
                <Image
                  src={logoImage.imageUrl}
                  alt="Sathimate Logo"
                  width={120}
                  height={120}
                  className="h-14 w-auto drop-shadow-2xl transition-all group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  data-ai-hint={logoImage.imageHint}
                  priority
                />
              </div>
            ) : (
              <span className="text-2xl font-black text-white tracking-tighter uppercase italic">Sathimate</span>
            )}
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-white',
                isActive(link.href) && 'text-accent font-semibold'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Auth & Theme */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <div className="hidden md:flex items-center gap-2 md:gap-4">
            <GlobalSearch />
            <ThemeToggle />
            <AuthNav />
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/10 h-10 w-10 sm:h-9 sm:w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[350px] bg-card p-0 flex flex-col border-r-0 shadow-2xl">
                <div className="p-6 flex items-center justify-between border-b border-border bg-black/5">
                  <Link href="/">
                    {logoImage && <Image src={logoImage.imageUrl} alt="Sathimate Logo" width={120} height={32} data-ai-hint={logoImage.imageHint} className="h-8 w-auto invert dark:invert-0" />}
                  </Link>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-8 sm:w-8">
                        <X className="h-5 w-5 sm:h-4 sm:w-4" />
                      </Button>
                    </SheetClose>
                  </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  <div className="space-y-2">
                    <span className="text-xs sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Universal Search</span>
                    <GlobalSearch variant="header" />
                  </div>

                  <div className="space-y-4">
                    <span className="text-xs sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Menu</span>
                    <div className="grid gap-2">
                      {navLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-accent group",
                              isActive(link.href) && "bg-primary/10 text-primary font-bold"
                            )}
                          >
                            <span className="text-lg">{link.label}</span>
                            <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 mt-auto border-t border-border bg-muted/30">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={user.photoURL || ''} />
                          <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-lg">{user.displayName || 'Welcome'}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Button variant="outline" asChild className="w-full justify-start rounded-xl h-12">
                          <Link href={`/profile/${user.uid}`} className="flex items-center gap-3"><User className="h-5 w-5" /> My Profile</Link>
                        </Button>
                      </SheetClose>
                      <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl h-12">
                        <LogOut className="h-5 w-5 mr-3" /> Log Out
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <SheetClose asChild>
                        <Button variant="outline" asChild className="w-full h-12 rounded-xl border-border hover:border-primary">
                          <Link href="/login">Log In</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild className="w-full h-12 rounded-xl shadow-lg shadow-primary/20">
                          <Link href="/signup">Join Community</Link>
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
