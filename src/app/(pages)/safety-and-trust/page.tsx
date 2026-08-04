'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, MessageCircle, Ban, HandHeart, UserCheck, Mail, Phone, Handshake, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal';

const safetyPrinciples = [
  {
    icon: <Users className="h-10 w-10 text-primary group-hover:text-primary-foreground" />,
    title: 'Small Groups, Big Trust',
    text: 'Journeys are best in small, compatible groups (2-6 people). This focus allows for genuine connection and shared decision-making, not mass meetups.',
  },
  {
    icon: <MessageCircle className="h-10 w-10 text-primary group-hover:text-primary-foreground" />,
    title: 'Public-First Discussions',
    text: 'Trust begins with transparency. We encourage all initial conversations to happen in public discussions on a travel plan. You only share private details when you feel comfortable.',
  },
  {
    icon: <Handshake className="h-10 w-10 text-primary group-hover:text-primary-foreground" />,
    title: 'No Pressure, Ever',
    text: 'Your comfort is our priority. You are always in control. You can leave a discussion, decline to join a group, or change your mind at any point. There is zero pressure.',
  },
];

const howItWorksSteps = [
    {
        number: "01",
        title: "Planning Phase: Find Your People Safely",
        description: "This is where trust is built. We provide a structured environment to connect before any commitments are made.",
        features: [
            "Browse or create public travel plans.",
            "Discuss itineraries, budgets, and expectations openly.",
            "Review profiles to learn about potential travel partners.",
        ]
    },
    {
        number: "02",
        title: "Pre-Trip Phase: Form Your Group with Clarity",
        description: "Once you've connected, you can form a small, private group. Clarity and consent are key.",
        features: [
            "Groups are intentionally small (2-6 members).",
            "Confirm shared travel goals before finalizing.",
            "You can choose to leave the group if it's not the right fit.",
        ]
    },
    {
        number: "03",
        title: "During-Trip Phase: Travel with Confidence",
        description: "Because you planned together, you travel with a foundation of mutual understanding and respect.",
        features: [
            "We provide safety guidelines and best practices.",
            "Encourage first meetups in public places.",
            "An accessible reporting system is available 24/7.",
        ]
    }
]

const trustFeatures = [
    { icon: <UserCheck className="h-6 w-6 text-green-500" />, title: "Verified Profiles", description: "Look for badges on profiles, indicating that a user has verified their email. This is a first step in building a community of real, accountable travelers." },
    { icon: <Ban className="h-6 w-6 text-red-500" />, title: "Block & Report", description: "You have full control. Easily block anyone you don’t want to interact with and report any behavior that violates our community guidelines." },
    { icon: <Users className="h-6 w-6 text-blue-500" />, title: "Public Reputation", description: "Trust is built in the open. A history of positive public discussions and successful trips contributes to a member's reputation." },
]

const faqItems = [
    {
        question: "What if I feel uncomfortable in a discussion?",
        answer: "You have complete control. You can leave any travel plan discussion at any time without pressure. You can also block any user to prevent further interaction, and report them if their behavior violates our guidelines."
    },
    {
        question: "Do I have to share my personal contact information?",
        answer: "Absolutely not. We strongly recommend keeping all initial conversations within Sathimate's public discussion forums. Only share personal details like your phone number or social media when you feel 100% comfortable and have built sufficient trust."
    },
    {
        question: "How does Sathimate handle harassment?",
        answer: "We have a zero-tolerance policy for harassment, spam, and any form of abuse. Use the 'Report' button to flag any inappropriate content or behavior. Our moderation team will review the report and take immediate action, which may include warnings or permanent account suspension."
    },
    {
        question: "How are groups officially formed?",
        answer: "Groups are formed by mutual consent. Once a creator and potential members agree on the plan, the creator can mark the plan as 'Group Formed'. This is a signal that the core planning is complete, but it is not a binding contract."
    }
]


export default function SafetyAndTrustPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <ScrollReveal className="bg-gradient-to-b from-black/10 to-background py-20 md:py-32">
        <div className="container mx-auto max-w-5xl text-center px-4">
          <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
            Travel Together. Feel Safe Together.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-muted-foreground">
            We design trust and safety into every stage of your journey — from the first hello to your final destination.
          </p>
        </div>
      </ScrollReveal>

      <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:py-20 lg:px-8 space-y-24">
        
        {/* Safety Philosophy Section */}
        <ScrollReveal className="text-center">
            <h2 className="text-3xl font-bold font-headline">Our Safety Philosophy</h2>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">Sathimate is safer than a random social media group because our entire platform is built on one core idea: <strong className="text-foreground">Meet before you move.</strong></p>
            <ScrollReveal className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12" stagger staggerChildren={0.1}>
                {safetyPrinciples.map((principle) => (
                    <ScrollRevealItem key={principle.title} className="flex flex-col items-center">
                        <div className="mb-4">{principle.icon}</div>
                        <h3 className="text-xl font-bold">{principle.title}</h3>
                        <p className="mt-2 text-muted-foreground">{principle.text}</p>
                    </ScrollRevealItem>
                ))}
            </ScrollReveal>
        </ScrollReveal>

        {/* How Safety Works Section */}
        <ScrollReveal>
            <div className="text-center">
                <h2 className="text-3xl font-bold font-headline">How Safety is Built Into Your Journey</h2>
                <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">Safety isn't just a feature; it's a process. Here’s how we structure your experience for peace of mind.</p>
            </div>
            <div className="mt-12 space-y-12">
                {howItWorksSteps.map((step) => (
                    <ScrollReveal key={step.number}>
                    <Card className="overflow-hidden shadow-lg border-l-4 border-primary bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground group">
                        <div className="md:flex">
                            <div className="md:w-1/3 bg-primary/10 p-6 flex flex-col justify-center items-center text-center group-hover:bg-primary-foreground/10">
                                <span className="text-5xl font-extrabold text-primary/50 group-hover:text-primary">{step.number}</span>
                                <h3 className="text-xl font-bold mt-2 group-hover:text-primary">{step.title}</h3>
                            </div>
                            <div className="md:w-2/3 p-6">
                                <p className="text-muted-foreground mb-4 group-hover:text-primary-foreground/80">{step.description}</p>
                                <ul className="space-y-2">
                                    {step.features.map(feature => (
                                        <li key={feature} className="flex items-start">
                                            <BadgeCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0 group-hover:text-green-300" />
                                            <span className="text-muted-foreground group-hover:text-primary-foreground/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Card>
                    </ScrollReveal>
                ))}
            </div>
        </ScrollReveal>

        {/* Women-First Commitment */}
        <ScrollReveal className="bg-secondary text-secondary-foreground rounded-lg p-8 md:p-12 text-center">
             <HandHeart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
             <h2 className="text-3xl font-bold font-headline">A Commitment to Women's Safety</h2>
             <p className="mt-3 max-w-3xl mx-auto text-muted-foreground">We are building Sathimate with a women-first mindset. Your safety and comfort are paramount. We enforce a zero-tolerance policy for harassment and provide easy-to-use reporting and blocking tools. We are actively working on features like optional women-only groups to further enhance safety.</p>
             <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="destructive">Report an Issue</Button>
                <Button variant="outline">Read Our Guidelines</Button>
            </div>
        </ScrollReveal>

        {/* Trust Features Section */}
        <ScrollReveal>
             <div className="text-center">
                <h2 className="text-3xl font-bold font-headline">Features That Build Trust</h2>
                <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">We provide tools to help you make informed decisions about who you travel with.</p>
            </div>
            <ScrollReveal className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8" stagger staggerChildren={0.1}>
                {trustFeatures.map(feature => (
                    <ScrollRevealItem key={feature.title}>
                        <Card className="p-6 text-center h-full hover:bg-primary hover:text-primary-foreground">
                            <div className="flex justify-center mb-4">{React.cloneElement(feature.icon, { className: "h-6 w-6 group-hover:text-primary-foreground" })}</div>
                            <h3 className="font-bold text-lg group-hover:text-primary-foreground">{feature.title}</h3>
                            <p className="text-muted-foreground mt-1 text-sm group-hover:text-primary-foreground/80">{feature.description}</p>
                        </Card>
                    </ScrollRevealItem>
                ))}
            </ScrollReveal>
        </ScrollReveal>
        
        {/* FAQ Section */}
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-bold font-headline">Common Safety Questions</h2>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">Your questions, answered clearly.</p>
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <ScrollRevealItem key={item.question}>
                <AccordionItem value={item.question}>
                  <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
                </ScrollRevealItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>

        {/* Final CTA */}
        <ScrollReveal className="mt-24 text-center border-t pt-16">
            <h2 className="text-2xl font-bold text-foreground max-w-3xl mx-auto">Ready to explore with confidence?</h2>
            <p className="text-lg text-muted-foreground mt-2">Join a community that puts your safety first.</p>
            <div className="mt-8">
                <Button asChild size="lg">
                    <Link href="/signup">Join Sathimate Today</Link>
                </Button>
            </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
