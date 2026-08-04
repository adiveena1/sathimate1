'use client';

import Link from 'next/link';
import { Mountain, Instagram, Rss, Send, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ClientOnly } from '@/components/shared/ClientOnly';
import { cn } from '@/lib/utils';

const platformLinks = [
  { name: 'Sathimate Work', href: '/how-it-works' },
  { name: 'Sathi Space', href: '/sathi-space' },
  { name: 'Planning Discussions', href: '/community' },
  { name: 'Community Guidelines', href: '/safety-and-trust' },
];

const supportLinks = [
  { name: 'Safety Policy', href: '/safety-and-trust' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms & Conditions', href: '/terms-and-conditions' },
  { name: 'Contact Us', href: '/contact' },
];

const companyLinks = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/community' },
  { name: 'Careers', href: '/how-it-works' },
];

const XIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/sathimate.in/',
    icon: Instagram,
    color: 'text-[#E4405F]',
    hoverColor: 'hover:bg-[#E4405F]/10'
  },
  {
    name: 'Reddit',
    href: 'https://www.reddit.com/r/sathimate/',
    icon: Rss,
    color: 'text-[#FF4500]',
    hoverColor: 'hover:bg-[#FF4500]/10'
  },
  {
    name: 'Telegram',
    href: 'https://t.me/Sathimate/',
    icon: Send,
    color: 'text-[#0088CC]',
    hoverColor: 'hover:bg-[#0088CC]/10'
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/sathimate',
    icon: Linkedin,
    color: 'text-[#0077B5]',
    hoverColor: 'hover:bg-[#0077B5]/10'
  },
];

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const logoImage = PlaceHolderImages.find((img) => img.id === 'site-logo');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative bg-black/95 backdrop-blur-xl text-white overflow-hidden border-t border-white/5">
      {/* Decorative Glow Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-6">
            <Link
              href="/"
              className="inline-block transition-all hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 rounded-lg p-1"
            >
              {logoImage ? (
                <Image
                  src={logoImage.imageUrl}
                  alt="Sathimate Logo"
                  width={180}
                  height={60}
                  className="h-14 w-auto brightness-110"
                  data-ai-hint={logoImage.imageHint}
                  priority
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Mountain className="h-8 w-8 text-blue-500" />
                  <span className="font-bold text-xl tracking-tight">SATHIMATE</span>
                </div>
              )}
            </Link>
            <p className="text-sm sm:text-base text-slate-400 max-w-sm leading-relaxed">
              Meet before you move. A premium community for solo travelers to connect, plan journeys, and explore the world with trust and choice.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ name, href, icon: Icon, color, hoverColor }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className={cn(
                    'p-2.5 rounded-full bg-white/5 border border-white/10 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500',
                    color,
                    hoverColor
                  )}
                >
                  <Icon className="h-5 w-5 transition-transform hover:rotate-12" />
                </a>
              ))}
              <a
                href="https://x.com/adiveena1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white transition-all duration-300 hover:scale-110 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
              >
                <XIcon />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-blue-400 font-semibold">Platform</h3>
            <ul className="space-y-3 sm:space-y-4">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-all duration-300 flex items-center group focus:outline-none focus:text-blue-400"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-blue-400 font-semibold">Support</h3>
            <ul className="space-y-3 sm:space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-all duration-300 flex items-center group focus:outline-none focus:text-blue-400"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-blue-400 font-semibold">Company</h3>
            <ul className="space-y-3 sm:space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-all duration-300 flex items-center group focus:outline-none focus:text-blue-400"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-white/5" />

        {/* Footer Bottom */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium">
          <p>
            &copy; <ClientOnly>{currentYear}</ClientOnly> Sathimate. Built on clarity, respect, and choice.
          </p>
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/safety-and-trust" className="hover:text-slate-300 transition-colors focus:outline-none focus:text-blue-400">
              Safety
            </Link>
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors focus:outline-none focus:text-blue-400">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-slate-300 transition-colors focus:outline-none focus:text-blue-400">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
