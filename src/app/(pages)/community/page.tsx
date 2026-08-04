
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, MessageSquare, Rss } from 'lucide-react';
import { TravelPlanCard } from '@/components/travel/TravelPlanCard';
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { SathiPlan } from '@/lib/sathi-space-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

const communityLinks = [
  {
    name: 'Telegram Community',
    description: 'Join our real-time chat for instant discussions, quick questions, and finding people to meet up with now.',
    href: 'https://t.me/Sathimate/',
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    cta: 'Join on Telegram',
  },
  {
    name: 'Reddit Planning Threads',
    description: 'Our subreddit is the place for in-depth discussions, sharing detailed travel plans, and asking for advice from the community.',
    href: 'https://www.reddit.com/r/sathimate/',
    icon: <Rss className="h-8 w-8 text-primary" />,
    cta: 'See Reddit Threads',
  },
];

function PlanCardSkeleton() {
    return (
        <div className="flex flex-col h-full bg-card border rounded-2xl shadow-lg p-5 space-y-4">
            <div className="flex justify-between items-start">
                <div className='space-y-2'>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-12" />
                </div>
            </div>
            <div className="pt-4 border-t space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
            </div>
            <div className="pt-4 border-t flex justify-between items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                </div>
            </div>
        </div>
    );
}

export default function CommunityPage() {
    const db = useFirestore();
    const { user, loading: userLoading } = useUser();
    const plansQuery = useMemo(() =>
        db ? query(collection(db, "plans"), orderBy("createdAt", "desc"), limit(3)) : null
    , [db]);
    const { data: openTrips, loading: plansLoading } = useCollection(plansQuery);

    const loading = userLoading || plansLoading;

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:py-20 lg:px-8">
        
        {/* Hero Section */}
        <ScrollReveal className="text-center mb-16" stagger staggerChildren={0.2}>
          <ScrollRevealItem>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
            Find Your Travel Companions
          </h1>
          </ScrollRevealItem>
          <ScrollRevealItem>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-muted-foreground">
            Sathimate is built on public discussions and small, compatible groups. Find a plan that interests you, or join our community channels to start your own.
          </p>
          </ScrollRevealItem>
        </ScrollReveal>

        {/* Mock/Open Trips Section */}
        <ScrollReveal className="mb-20">
            <h2 className="text-3xl font-bold text-center tracking-tight font-headline mb-8">Explore Open Trips</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [...Array(3)].map((_, i) => <PlanCardSkeleton key={i} />)
                ) : (
                    (openTrips as SathiPlan[])?.map((plan) => (
                        <ScrollRevealItem key={plan.id}>
                            <TravelPlanCard plan={plan} user={user} db={db} />
                        </ScrollRevealItem>
                    ))
                )}
            </div>
            <div className="mt-12 text-center">
                <Button asChild size="lg" className="group">
                    <Link href="/sathi-space">
                        Explore Sathi Space <ArrowRight className="ml-2 h-4 w-4 btn-arrow" />
                    </Link>
                </Button>
            </div>
        </ScrollReveal>

        {/* Community Channels Section */}
        <ScrollReveal className="mb-20">
            <h2 className="text-3xl font-bold text-center tracking-tight font-headline mb-8">Join the Conversation</h2>
            <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" stagger staggerChildren={0.1}>
            {communityLinks.map((item) => (
                <ScrollRevealItem key={item.name}>
                <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardHeader className="flex-grow">
                    <div className="flex items-start space-x-4">
                        {item.icon}
                        <div>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription className="mt-1">{item.description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full group">
                    <Link href={item.href} target="_blank" rel="noopener noreferrer">
                        {item.cta} <ArrowRight className="ml-2 h-4 w-4 btn-arrow" />
                    </Link>
                    </Button>
                </CardContent>
                </Card>
                </ScrollRevealItem>
            ))}
            </ScrollReveal>
        </ScrollReveal>

        {/* Trust Line */}
        <ScrollReveal className="text-center border-t pt-12">
            <p className="text-lg text-muted-foreground">
                All groups start with open chats — meet only when you feel ready and comfortable.
            </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
