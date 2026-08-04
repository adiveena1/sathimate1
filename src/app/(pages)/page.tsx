'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Users, Calendar, Plane, ShieldCheck, Eye, Heart } from 'lucide-react';
import { PopularDestinations } from '@/components/home/PopularDestinations';
import { NearbyPlaces } from '@/components/home/NearbyPlaces';
import React, { Suspense, memo } from 'react';
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal';
import { PremiumHero } from '@/components/premium/PremiumHero';
import { useT } from '@/lib/i18n/provider';
import { DiscoveryPreview, PlanningPreview, ExplorationPreview } from '@/components/home/AppPreview';
import { motion } from 'framer-motion';
import { HomePageErrorBoundary } from '@/components/shared/HomePageErrorBoundary';
import { PopularDestinationsSkeleton } from '@/components/home/PopularDestinationsSkeleton';
import { NearbyPlacesSkeleton } from '@/components/home/NearbyPlacesSkeleton';

// Memoized feature steps - prevent unnecessary re-renders
const featureSteps = [
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Plan',
    description: 'Find like-minded travelers in our community. Discuss ideas, share plans, and build trust before your journey begins.',
  },
  {
    icon: <Calendar className="h-10 w-10 text-primary" />,
    title: 'Travel',
    description: 'Create or join a travel plan. Set your destination, budget, and travel style to form the perfect group for your adventure.',
  },
  {
    icon: <Plane className="h-10 w-10 text-primary" />,
    title: 'Explore',
    description: 'Embark on your journey with clarity and companionship. Share experiences, coordinate on the go, and make lasting memories.',
  },
] as const;

const communityValues = [
  { icon: <ShieldCheck className="h-8 w-8 text-accent-foreground" />, titleKey: "values.trust.title", descKey: "values.trust.desc", },
  { icon: <Eye className="h-8 w-8 text-accent-foreground" />, titleKey: "values.clarity.title", descKey: "values.clarity.desc", },
  { icon: <Heart className="h-8 w-8 text-accent-foreground" />, titleKey: "values.respect.title", descKey: "values.respect.desc", },
] as const;

/**
 * Yahan pehle 6 "testimonials" the — Rajan, Vedanshu, Sweety, Nishant...
 * Woh sab banaye hue the. App par abhi ek bhi user nahi hai.
 *
 * Fake reviews sabse pehle pakde jaate hain: naam Google par milte nahi,
 * language ek jaisi hoti hai ("game-changer!", "Highly recommend!"), aur
 * photo hoti nahi. Ek bhi banda pakad le to poori site par bharosa khatam.
 *
 * Isliye jab tak asli users nahi aate, yahan founder ki apni baat rahegi.
 * Ek chhoti si sachhi baat 6 jhoothi tareefon se zyada bikti hai.
 *
 * Jab asli reviews aa jayein: is section ko Firestore ke `reviews` collection
 * se replace kar dena — sirf wo reviews jinka trip actually complete hua ho.
 */
const founderNote = {
  name: 'Aditya',
  roleKey: 'founder.role',
  // TODO Adi: neeche wali lines apne shabdon mein badal dena. Jo tumhare
  // saath sach mein hua, wahi likhna — koi bhi likha hua "marketing" turant
  // pakda jaata hai. 3-4 line kaafi hai.
  lines: [
    'I am a B.Tech student. The idea came from a trip that fell apart while we were still planning it — everyone was in different WhatsApp groups, nobody knew who was actually coming, what the budget was, or who was sharing a room with whom.',
    'Every travel app sells tickets. None of them help you find the people. So I built Sathimate.',
    'This is very early. If you are one of the first hundred people trying it — tell me straight what feels broken. I read every message myself.',
  ],
} as const;

/**
 * Sections memoized hain aur error boundaries mein wrapped hain — ek section
 * crash ho to poora homepage blank na ho jaye.
 */

// Memoized sections to prevent unnecessary re-renders
const DiscoverySection = memo(() => {
  const t = useT();
  return (
  <section className="w-full py-16 md:py-24 lg:py-32">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-6"
        >
          <div>
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              {t('discovery.label')}
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {t('discovery.title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('discovery.body')}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">✓</div>
              <div>
                <h4 className="font-semibold mb-1">{t('discovery.f1.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('discovery.f1.desc')}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">✓</div>
              <div>
                <h4 className="font-semibold mb-1">{t('discovery.f2.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('discovery.f2.desc')}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">✓</div>
              <div>
                <h4 className="font-semibold mb-1">{t('discovery.f3.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('discovery.f3.desc')}</p>
              </div>
            </div>
          </div>

          <Button asChild size="lg" className="mt-2 h-12 px-8 rounded-full font-bold">
            <Link href="/search">{t('discovery.cta')} →</Link>
          </Button>
        </motion.div>

        {/* Right: Image/Icon */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          <DiscoveryPreview />
        </motion.div>
      </div>
    </div>
  </section>
);
});
DiscoverySection.displayName = 'DiscoverySection';

const PlanningSection = memo(() => {
  const t = useT();
  return (
  <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/30">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Image/Icon */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative order-2 lg:order-1"
        >
          <PlanningPreview />
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-6 order-1 lg:order-2"
        >
          <div>
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm">
              {t('planning.label')}
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {t('planning.title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('planning.body')}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">✓</div>
              <div>
                <h4 className="font-semibold mb-1">{t('planning.f1.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('planning.f1.desc')}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">✓</div>
              <div>
                <h4 className="font-semibold mb-1">{t('planning.f2.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('planning.f2.desc')}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">✓</div>
              <div>
                <h4 className="font-semibold mb-1">{t('planning.f3.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('planning.f3.desc')}</p>
              </div>
            </div>
          </div>

          <Button asChild size="lg" className="mt-2 h-12 px-8 rounded-full font-bold">
            <Link href="/groups">{t('planning.cta')} →</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);
});
PlanningSection.displayName = 'PlanningSection';

const ExplorationSection = memo(() => {
  const t = useT();
  return (
  <section className="w-full py-16 md:py-24 lg:py-32">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-6"
        >
          <div>
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent/15 text-accent-foreground dark:text-accent font-semibold text-sm">
              {t('exploration.label')}
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {t('exploration.title')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('exploration.body')}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground dark:text-accent font-bold text-sm">✓</div>
              <div>
                <h4 className="font-semibold mb-1">{t('exploration.f1.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('exploration.f1.desc')}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground dark:text-accent font-bold text-sm">✓</div>
              <div>
                <h4 className="font-semibold mb-1">{t('exploration.f2.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('exploration.f2.desc')}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground dark:text-accent font-bold text-sm">✓</div>
              <div>
                <h4 className="font-semibold mb-1">{t('exploration.f3.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('exploration.f3.desc')}</p>
              </div>
            </div>
          </div>

          <Button asChild size="lg" className="mt-2 h-12 px-8 rounded-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/nearby">{t('exploration.cta')} →</Link>
          </Button>
        </motion.div>

        {/* Right: Image/Icon */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          <ExplorationPreview />
        </motion.div>
      </div>
    </div>
  </section>
);
});
ExplorationSection.displayName = 'ExplorationSection';

const HowItWorksSection = memo(() => {
  const t = useT();
  return (
  <section id="how-it-works" className="py-24 md:py-32 bg-background relative overflow-hidden">
    <div className="container mx-auto px-6">
      <ScrollReveal className="text-center mb-20 space-y-4">
        <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight">{t('how.title')}</h2>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
          {t('how.subtitle')}
        </p>
      </ScrollReveal>

      <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12" stagger staggerChildren={0.15}>
        {featureSteps.map((feature, index) => (
          <ScrollRevealItem key={index}>
            <div className="group relative p-10 rounded-[3rem] border border-border/50 bg-card hover:bg-muted/30 transition-all duration-500 hover:shadow-[-5px_-5px_20px_rgba(255,255,255,0.02),5px_5px_20px_rgba(0,0,0,0.05)] hover:-translate-y-2 h-full overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:rotate-12 duration-700">
                {React.cloneElement(feature.icon as React.ReactElement, { className: "h-32 w-32" })}
              </div>
              
              <div className="mb-8 inline-flex p-5 rounded-[1.5rem] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:scale-110 drop-shadow-md">
                {feature.icon}
              </div>
              
              <h3 className="font-headline text-3xl font-bold mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {feature.description}
              </p>
              
              <div className="mt-10 flex items-center gap-4">
                <span className="text-xs font-black tracking-[0.2em] uppercase text-primary/40 group-hover:text-primary transition-colors">Step {index + 1}</span>
                <div className="h-[2px] flex-1 bg-border/40 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-1000 ease-in-out" />
                </div>
              </div>
            </div>
          </ScrollRevealItem>
        ))}
      </ScrollReveal>
    </div>
  </section>
);
});
HowItWorksSection.displayName = 'HowItWorksSection';

const ValuesSection = memo(() => {
  const t = useT();
  return (
  <section id="values">
    <ScrollReveal as="div" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">{t('values.title')}</h2>
          <p className="text-muted-foreground mt-2">{t('values.subtitle')}</p>
        </div>
        <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger staggerChildren={0.1}>
          {communityValues.map(value => (
            <ScrollRevealItem key={value.titleKey}>
              <div className="flex items-start space-x-4">
                <div className="bg-accent rounded-full p-3">{value.icon}</div>
                <div>
                  <h3 className="font-bold text-lg">{t(value.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(value.descKey)}</p>
                </div>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollReveal>
      </div>
    </ScrollReveal>
  </section>
);
});
ValuesSection.displayName = 'ValuesSection';

const FounderNoteSection = memo(() => {
  const t = useT();
  return (
  <section id="founder-note">
    <ScrollReveal as="div" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="font-headline text-sm uppercase tracking-[0.2em] text-accent mb-6">
            {t('founder.label')}
          </p>
          <div className="space-y-5">
            {founderNote.lines.map((line) => (
              <p
                key={line.slice(0, 24)}
                className="text-lg md:text-xl leading-relaxed text-foreground/90"
              >
                {line}
              </p>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3 border-l-2 border-accent pl-4">
            <div>
              <p className="font-headline font-bold">{founderNote.name}</p>
              <p className="text-sm text-muted-foreground">{t(founderNote.roleKey)}</p>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  </section>
);
});
FounderNoteSection.displayName = 'FounderNoteSection';

export default function HomePage() {

  return (
    <div className="flex flex-col">
      {/* ===== PREMIUM HERO SECTION ===== */}
      <PremiumHero />

      {/* ===== DISCOVERY SECTION ===== */}
      <HomePageErrorBoundary name="Discovery">
        <DiscoverySection />
      </HomePageErrorBoundary>

      {/* ===== PLANNING SECTION ===== */}
      <HomePageErrorBoundary name="Planning">
        <PlanningSection />
      </HomePageErrorBoundary>

      {/* ===== EXPLORATION SECTION ===== */}
      <HomePageErrorBoundary name="Exploration">
        <ExplorationSection />
      </HomePageErrorBoundary>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <HomePageErrorBoundary name="HowItWorks">
        <HowItWorksSection />
      </HomePageErrorBoundary>

      {/* ===== POPULAR DESTINATIONS - LAZY LOADED ===== */}
      <HomePageErrorBoundary name="PopularDestinations">
        <section id="popular-destinations">
          <div className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <Suspense fallback={<PopularDestinationsSkeleton />}>
                <PopularDestinations />
              </Suspense>
            </div>
          </div>
        </section>
      </HomePageErrorBoundary>

      {/* ===== NEARBY PLACES - LAZY LOADED ===== */}
      <HomePageErrorBoundary name="NearbyPlaces">
        <section id="nearby-places">
          <div className="w-full py-12 md:py-24 lg:py-32 bg-secondary text-secondary-foreground">
            <div className="container mx-auto px-4 md:px-6">
              <Suspense fallback={<NearbyPlacesSkeleton />}>
                <NearbyPlaces />
              </Suspense>
            </div>
          </div>
        </section>
      </HomePageErrorBoundary>

      {/* ===== VALUES SECTION ===== */}
      <HomePageErrorBoundary name="Values">
        <ValuesSection />
      </HomePageErrorBoundary>

      {/* ===== FOUNDER NOTE ===== */}
      <HomePageErrorBoundary name="Testimonials">
        <FounderNoteSection />
      </HomePageErrorBoundary>
    </div>
  );
}
