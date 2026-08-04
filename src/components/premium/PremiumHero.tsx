'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useT } from '@/lib/i18n/provider';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { Users, CheckCircle } from 'lucide-react';
import { GlobalSearch } from '../shared/GlobalSearch';

interface SocialProofItem {
  icon: React.ReactNode;
  stat: string;
  description: string;
}

/**
 * Pehle yahan "1200+ Travelers" aur "45+ Active Groups" likha tha — app par
 * abhi ek bhi user nahi hai. Jhoothe numbers pakde jaate hain aur pehle hi
 * din bharosa tod dete hain.
 *
 * Early stage mein honesty hi asli differentiator hai: yeh strip batati hai
 * ki hum kya karte hain, kitne log hain ye nahi.
 *
 * Jab sach mein 500+ users ho jayein, tab ise wapas live counts se replace
 * kar dena — Firestore se aggregate karke.
 */
const buildSocialProof = (t: (k: any) => string): SocialProofItem[] => [
  {
    icon: <Users className="w-5 h-5 text-accent" />,
    stat: t('hero.point1.stat'),
    description: t('hero.point1.desc'),
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-accent" />,
    stat: t('hero.point2.stat'),
    description: t('hero.point2.desc'),
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-accent" />,
    stat: t('hero.point3.stat'),
    description: t('hero.point3.desc'),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export function PremiumHero() {
  const t = useT();
  const socialProofItems = buildSocialProof(t);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'home-hero');
  const { user, loading } = useUser();

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden pt-20 md:pt-24">
      {/* Background Image */}
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt="Travelers connecting - Hero background"
          fill
          className="object-cover -z-10 scale-110 animate-[slow-zoom_25s_ease-in-out_infinite_alternate]"
          priority
          data-ai-hint={heroImage.imageHint}
          sizes="100vw"
        />
      )}

      {/* Premium Overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/40" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-accent/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 relative z-10 py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center space-y-8 md:space-y-12"
        >
          {/* Premium Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 hover:border-accent/50 transition-all hover:bg-white/15 shadow-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-xs font-black tracking-widest uppercase text-white/90">
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="max-w-5xl mx-auto space-y-4">
            {/* Gradient text + animate-pulse 2021 ke template ki nishani hai.
                Ek solid marigold underline zyada confident lagti hai. */}
            <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.05] text-white">
              {t('hero.title.line1')}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">{t('hero.title.line2')}</span>
                <span
                  aria-hidden
                  className="absolute left-0 bottom-1 md:bottom-2 h-3 md:h-4 w-full bg-accent/70 -rotate-1"
                />
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto font-medium text-white/90 leading-relaxed drop-shadow-lg"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg max-w-2xl mx-auto text-white/70 leading-relaxed"
          >
            {t('hero.description')}
          </motion.p>

          {/* Social Proof Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 py-8 md:py-12 border-t border-b border-white/10"
          >
            {socialProofItems.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center space-y-2 group cursor-default"
              >
                <div className="font-headline text-2xl md:text-3xl font-bold text-white">
                  {item.stat}
                </div>
                <p className="text-sm md:text-base text-white/80 font-semibold">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Search Bar */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-2xl p-4 md:p-6 rounded-3xl border border-white/20 shadow-2xl hover:border-accent/50 hover:bg-white/15 transition-all duration-300 group">
              <GlobalSearch variant="hero" />
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto pt-4 md:pt-8"
          >
            {loading ? (
              <>
                <Skeleton className="h-14 w-full sm:w-56 rounded-full" />
                <Skeleton className="h-14 w-full sm:w-56 rounded-full" />
              </>
            ) : user ? (
              <>
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 rounded-full text-base font-bold shadow-2xl hover:shadow-3xl transition-all hover:scale-105 bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto"
                >
                  <Link href="/sathi-space" className="flex items-center gap-2">
                    <span>🔍</span>
                    Find Travel Partners
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-full text-base font-bold bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-black transition-all w-full sm:w-auto"
                >
                  <Link href="/groups" className="flex items-center gap-2">
                    <span>👥</span>
                    Create Travel Group
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 rounded-full text-base font-bold shadow-2xl hover:shadow-3xl transition-all hover:scale-105 bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto"
                >
                  <Link href="/signup" className="flex items-center gap-2">
                    <span>🚀</span>
                    Join the Community
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-full text-base font-bold bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-black transition-all w-full sm:w-auto"
                >
                  <Link href="/how-it-works" className="flex items-center gap-2">
                    <span>📖</span>
                    How It Works
                  </Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="pt-8 md:pt-16 text-white/50"
          >
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium">Explore More</p>
              <svg
                className="w-6 h-6 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
