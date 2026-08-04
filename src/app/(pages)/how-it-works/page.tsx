
'use client';

import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CalendarCheck, Plane, MessageSquare, MapPin, Camera, ArrowRight } from 'lucide-react';
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal';

// ─── Types ────────────────────────────────────────────────────────
interface Feature {
  icon: ReactNode;
  title: string;
  text: string;
}

interface Step {
  phase: string;
  phaseNumber: string;
  badge: {
    label: string;
    className: string;
  };
  accent: string;          // Tailwind color token for timeline dot ring + icon bg
  dotColor: string;        // bg color for numbered circle
  title: string;
  description: string;
  features: Feature[];
}

// ─── Data ─────────────────────────────────────────────────────────
const steps: Step[] = [
  {
    phase: 'Plan',
    phaseNumber: '01',
    badge: {
      label: 'Plan',
      className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border border-sky-200 dark:border-sky-700',
    },
    accent: 'sky',
    dotColor: 'bg-sky-500',
    title: 'Connect, Discuss & Plan Together',
    description:
      'Every great journey starts with a conversation. Sathimate gives you the space to share your travel vision publicly, discover people who think like you, and align on the details that matter — before you ever pack a bag.',
    features: [
      {
        icon: <Users className="h-5 w-5" />,
        title: 'Post & Discover Plans',
        text: 'Share your travel idea or browse plans from others. Public discussions help you gauge interest and spot the right travel partners early.',
      },
      {
        icon: <CalendarCheck className="h-5 w-5" />,
        title: 'Align on the Essentials',
        text: 'Be clear about your destination, dates, budget range, and travel style — relaxed, adventurous, or somewhere in between.',
      },
      {
        icon: <MessageSquare className="h-5 w-5" />,
        title: 'Find Your People',
        text: 'Our platform is built to surface travelers whose philosophy matches yours — because the right companion makes all the difference.',
      },
    ],
  },
  {
    phase: 'Travel',
    phaseNumber: '02',
    badge: {
      label: 'Travel',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700',
    },
    accent: 'emerald',
    dotColor: 'bg-emerald-500',
    title: 'Coordinate, Move & Stay in Sync',
    description:
      'Your group is ready. Now Sathimate keeps everyone on the same page while the journey unfolds — no confusion, no surprises, just clarity and shared momentum.',
    features: [
      {
        icon: <MapPin className="h-5 w-5" />,
        title: 'Seamless Coordination',
        text: 'Link your preferred messaging tools from the platform to align on daily plans, meeting points, and transport without friction.',
      },
      {
        icon: <Plane className="h-5 w-5" />,
        title: 'Travel with Full Clarity',
        text: 'Because you planned together, every person in the group knows the budget, pace, and key activities. Zero guesswork.',
      },
      {
        icon: <Users className="h-5 w-5" />,
        title: 'Shared Experiences',
        text: 'With logistics handled, you\'re free to be present — to laugh, explore, and build memories that last with people you trust.',
      },
    ],
  },
  {
    phase: 'Explore',
    phaseNumber: '03',
    badge: {
      label: 'Explore',
      className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-700',
    },
    accent: 'violet',
    dotColor: 'bg-violet-500',
    title: 'Share, Inspire & Give Back',
    description:
      'Your journey doesn\'t end at the airport. The stories, lessons, and moments you bring back are gold for the community — and the spark that inspires the next traveler.',
    features: [
      {
        icon: <Camera className="h-5 w-5" />,
        title: 'Share Your Story',
        text: 'Post photos, write about your adventures, and pass on honest tips. Your experiences can inspire someone else to take the leap.',
      },
      {
        icon: <MessageSquare className="h-5 w-5" />,
        title: 'Learn from Real Journeys',
        text: 'Read authentic accounts from fellow Sathimate travelers — discover what worked, what to avoid, and where to go next.',
      },
      {
        icon: <Users className="h-5 w-5" />,
        title: 'Lift Future Travelers',
        text: 'Your feedback and advice build a living knowledge base that makes every journey after yours a little safer and a lot richer.',
      },
    ],
  },
];

// ─── Icon Accent Colours (Tailwind safe-list via full class strings) ──
const iconBgMap: Record<string, string> = {
  sky:     'bg-sky-100     text-sky-600     dark:bg-sky-900/40     dark:text-sky-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  violet:  'bg-violet-100  text-violet-600  dark:bg-violet-900/40  dark:text-violet-400',
};

const cardBorderMap: Record<string, string> = {
  sky:     'hover:border-sky-300     dark:hover:border-sky-700',
  emerald: 'hover:border-emerald-300 dark:hover:border-emerald-700',
  violet:  'hover:border-violet-300  dark:hover:border-violet-700',
};

const dotRingMap: Record<string, string> = {
  sky:     'ring-sky-200     dark:ring-sky-800',
  emerald: 'ring-emerald-200 dark:ring-emerald-800',
  violet:  'ring-violet-200  dark:ring-violet-800',
};

// ─── Component ────────────────────────────────────────────────────
export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ── Subtle background decoration ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -right-40 h-[200px] sm:h-[400px] md:h-[600px] w-[200px] sm:w-[400px] md:w-[600px] rounded-full bg-sky-100/40 blur-3xl dark:bg-sky-900/10" />
        <div className="absolute top-1/2 -left-60 h-[150px] sm:h-[300px] md:h-[500px] w-[150px] sm:w-[300px] md:w-[500px] rounded-full bg-violet-100/30 blur-3xl dark:bg-violet-900/10" />
        <div className="absolute -bottom-40 right-1/4 h-[100px] sm:h-[250px] md:h-[400px] w-[100px] sm:w-[250px] md:w-[400px] rounded-full bg-emerald-100/30 blur-3xl dark:bg-emerald-900/10" />
      </div>

      <div className="container mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:py-24 lg:px-8">

        {/* ── Hero section ── */}
        <ScrollReveal className="text-center mb-20" stagger staggerChildren={0.15}>
          <ScrollRevealItem>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              The Sathimate Journey
            </span>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline leading-[1.1]">
              How{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">Sathimate</span>
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 left-0 -z-0 h-3 w-full rounded bg-sky-200/70 dark:bg-sky-700/40"
                />
              </span>{' '}
              Work
            </h1>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              From the first idea to the last story — here\'s how Sathimate connects you with the right people, at every stage of your journey.
            </p>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-sky-400" /> Plan
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-40" />
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Travel
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-40" />
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-violet-400" /> Explore
              </span>
            </div>
          </ScrollRevealItem>
        </ScrollReveal>

        {/* ── Timeline ── */}
        <div className="relative">

          {/* Vertical spine */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-sky-300 via-emerald-300 to-violet-300 dark:from-sky-700 dark:via-emerald-700 dark:to-violet-700 opacity-60"
          />

          <div className="space-y-20">
            {steps.map((step, index) => (
              <ScrollReveal key={step.phase} className="relative">

                {/* Numbered dot on timeline */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ring-4 ${dotRingMap[step.accent]} ${step.dotColor} shadow-lg`}>
                    <span className="text-xs font-black text-white tracking-tight">{step.phaseNumber}</span>
                  </div>
                </div>

                {/* Card */}
                <Card
                  className={`
                    mt-8 w-full overflow-hidden border border-border/60 bg-card/80 backdrop-blur-sm
                    shadow-md transition-all duration-300 ease-out
                    hover:shadow-xl hover:-translate-y-1
                    ${cardBorderMap[step.accent]}
                    rounded-2xl
                  `}
                >
                  <CardHeader className="px-6 pt-7 pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        variant="secondary"
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${step.badge.className}`}
                      >
                        {step.badge.label}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground/50 font-semibold tracking-widest">
                        {step.phaseNumber} / 03
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-bold leading-snug tracking-tight">
                      {step.title}
                    </CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </CardHeader>

                  <CardContent className="px-6 pb-7">
                    {/* Subtle divider */}
                    <div className="mb-6 h-px w-full bg-border/50" />

                    <ScrollReveal
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      stagger
                      staggerChildren={0.1}
                    >
                      {step.features.map((feature) => (
                        <ScrollRevealItem key={feature.title}>
                          <div
                            className="
                              group flex flex-col items-center text-center p-5 rounded-xl h-full
                              bg-muted/30 dark:bg-muted/10
                              border border-transparent
                              hover:border-border hover:bg-muted/50 dark:hover:bg-muted/20
                              transition-all duration-200
                            "
                          >
                            {/* Icon bubble */}
                            <div
                              className={`
                                mb-4 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl
                                shadow-sm transition-transform duration-200 group-hover:scale-110
                                ${iconBgMap[step.accent]}
                              `}
                            >
                              {feature.icon}
                            </div>
                            <h4 className="font-semibold text-sm leading-snug mb-1.5">
                              {feature.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {feature.text}
                            </p>
                          </div>
                        </ScrollRevealItem>
                      ))}
                    </ScrollReveal>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA nudge ── */}
        <ScrollReveal className="mt-24 text-center">
          <ScrollRevealItem>
            <p className="text-sm text-muted-foreground">
              Ready to find your travel people?{' '}
              <a
                href="/community"
                className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Browse travel plans →
              </a>
            </p>
          </ScrollRevealItem>
        </ScrollReveal>

      </div>
    </div>
  );
}