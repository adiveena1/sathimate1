'use client';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, MessageSquare, Shield, Users, Handshake, ShieldOff, UserX, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal';
import React from 'react';

const values = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Small Over Massive',
    description: 'We believe genuine connection happens in small, compatible groups (2-6 people), not large, anonymous crowds.',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'Transparency First',
    description: 'All planning starts with open, public discussions. You only share private details when you feel comfortable and ready.',
  },
  {
    icon: <Handshake className="h-8 w-8 text-primary" />,
    title: 'No-Pressure Policy',
    description: 'Your comfort is paramount. You are always in control, with the freedom to leave any discussion or group at any time.',
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: 'Women-First Safety',
    description: 'Our platform is built with a women-first safety mindset, featuring a zero-tolerance harassment policy and active moderation.',
  },
];

const problems = [
    { icon: <UserX className="h-8 w-8 text-primary" />, title: "Solo Planning Loneliness", text: "Planning a big trip by yourself can feel isolating and overwhelming." },
    { icon: <ShieldOff className="h-8 w-8 text-primary" />, title: "Unsafe Group Chats", text: "Joining random, unvetted travel groups on social media comes with inherent risks." },
    { icon: <Users className="h-8 w-8 text-primary" />, title: "No Accountability", text: "In large, anonymous forums, there's little to no accountability, leading to unreliable plans." },
    { icon: <Clock className="h-8 w-8 text-primary" />, title: "Last-Minute Stress", text: "Coordinating with strangers at the last minute often leads to stress and miscommunication." },
];


export default function AboutPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'about-hero');

  return (
    <div className="bg-background text-foreground">
      {/* 1. HERO SECTION */}
      <section className="relative text-center bg-gradient-to-b from-primary/10 to-background py-24 sm:py-32 lg:py-40">
        {heroImage && (
            <Image
            src={heroImage.imageUrl}
            alt={heroImage.description || 'Placeholder Image'}
            fill
            className="object-cover -z-20 opacity-10"
            data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/10 via-background to-background" />

        <ScrollReveal className="container mx-auto px-4" stagger staggerChildren={0.2}>
            <ScrollRevealItem>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl font-headline">
            Travel Feels Better When Shared.
          </h1>
            </ScrollRevealItem>
            <ScrollRevealItem>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Sathimate was built on one simple belief — the best journeys begin with the right people, long before the first step is taken.
          </p>
            </ScrollRevealItem>
        </ScrollReveal>
      </section>

      {/* 2. THE STORY */}
      <ScrollReveal className="py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold font-headline mb-4">Why We Started</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground mx-auto space-y-6">
                <p>
                Most travel platforms focus on the "where" — the destinations, the hotels, the tickets. But we realized the most unforgettable travel memories are rarely about a place. They’re about the people you share it with.
                </p>
                <p>
                Planning a trip solo can feel isolating. Joining a random group chat on social media can feel unsafe and chaotic. We saw a gap: a need for a calm, structured, and safe space where connection could happen *before* movement. That’s why we built Sathimate.
                </p>
            </div>
        </div>
      </ScrollReveal>

      {/* 3. THE PROBLEM */}
        <ScrollReveal className="bg-secondary text-secondary-foreground py-16 sm:py-24">
            <div className="container mx-auto max-w-5xl px-4">
                <div className="text-center">
                        <h2 className="text-3xl font-bold font-headline">Travel Is Beautiful. Planning It Alone Isn’t.</h2>
                        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">We're solving the human coordination problem in travel, addressing the real pain points that anonymous, large-scale platforms ignore.</p>
                </div>
                <ScrollReveal className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6" stagger staggerChildren={0.1}>
                    {problems.map(problem => (
                        <ScrollRevealItem key={problem.title}>
                            <Card className="p-6 bg-card h-full hover:bg-primary hover:text-primary-foreground group">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">{React.cloneElement(problem.icon, { className: "h-8 w-8 text-primary group-hover:text-primary-foreground" })}</div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold group-hover:text-primary-foreground">{problem.title}</CardTitle>
                                        <CardDescription className="mt-1 text-muted-foreground group-hover:text-primary-foreground/80">{problem.text}</CardDescription>
                                    </div>
                                </div>
                            </Card>
                        </ScrollRevealItem>
                    ))}
                </ScrollReveal>
            </div>
        </ScrollReveal>

       {/* 4. THE PHILOSOPHY */}
      <ScrollReveal className="py-16 sm:py-24 text-center">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-headline">
            Meet Before You Move.
          </h2>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            This is our guiding principle. It means conversations happen first. Compatibility is discussed openly. Groups form naturally based on shared interests and travel styles — not through algorithms or forced matching. A connection built on clarity is always safer and more meaningful than one built on impulse.
          </p>
        </div>
      </ScrollReveal>

       {/* 5. HOW IT WORKS */}
        <ScrollReveal className="py-16 sm:py-24 bg-secondary text-secondary-foreground">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold font-headline">A Journey in Three Steps</h2>
                    <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">Our process is designed for clarity, safety, and confidence.</p>
                </div>
                <ScrollReveal className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4" stagger staggerChildren={0.2}>
                    {['Discuss', 'Align', 'Travel'].map((step, i) => (
                        <ScrollRevealItem key={step} className="relative flex flex-col items-center text-center">
                             <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl border-4 border-secondary">{i+1}</div>
                            <h3 className="text-xl font-bold">{step}</h3>
                            <p className="mt-2 text-muted-foreground">
                                {i === 0 && 'Engage in public planning conversations to find people with shared interests.'}
                                {i === 1 && 'Form a small, compatible group (2-6 people) once expectations and travel styles align.'}
                                {i === 2 && 'Move forward on your journey with a foundation of trust and shared understanding.'}
                            </p>
                        </ScrollRevealItem>
                    ))}
                </ScrollReveal>
            </div>
        </ScrollReveal>

      {/* 6. OUR VALUES */}
      <ScrollReveal className="py-16 sm:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-headline">Our Core Values</h2>
            <p className="mt-2 text-muted-foreground">These principles guide every feature we build.</p>
          </div>
          <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" stagger staggerChildren={0.1}>
            {values.map((value) => (
              <ScrollRevealItem key={value.title}>
              <Card className="p-6 text-center transform hover:-translate-y-2 transition-transform duration-300 ease-in-out h-full hover:bg-primary hover:text-primary-foreground group">
                 <div className="mb-4 inline-block p-4 bg-primary/10 rounded-full group-hover:bg-primary-foreground/10">{React.cloneElement(value.icon, { className: "h-8 w-8 text-primary group-hover:text-primary-foreground" })}</div>
                <CardTitle className="text-xl font-bold group-hover:text-primary-foreground">{value.title}</CardTitle>
                <CardDescription className="mt-2 text-muted-foreground group-hover:text-primary-foreground/80">{value.description}</CardDescription>
              </Card>
              </ScrollRevealItem>
            ))}
          </ScrollReveal>
        </div>
      </ScrollReveal>

      {/* 7. THE VISION */}
      <ScrollReveal className="bg-primary text-primary-foreground py-20 sm:py-24">
        <div className="container mx-auto max-w-3xl text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold">
            We aren't building a booking platform. We're building a human coordination infrastructure for travel.
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-primary-foreground/80">
            Travel feels better when planned together, experienced together, and remembered together.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="group">
              <Link href="/signup">
                Join the Community <ArrowRight className="ml-2 h-5 w-5 btn-arrow" />
              </Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
