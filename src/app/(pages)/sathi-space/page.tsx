
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal';
import { CreatePlanModal } from '@/components/sathi-space/CreatePlanModal';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Compass, MessageSquareText, Search, Users, WandSparkles, MapPin, Calendar, Wallet, Heart, Shield, Activity, CheckCircle, Info, Send } from 'lucide-react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { SathiPlan } from '@/lib/sathi-space-data';
import { format } from 'date-fns';
import { requestToJoinPlan } from '@/services/sathi-space-service';
import { useToast } from '@/hooks/use-toast';
import type { User } from 'firebase/auth';

const interests = [ 'Adventure', 'Peace', 'Party', 'Spiritual', 'Culture'];

const safeFormatDate = (timestamp: any, formatStr: string) => {
    if (!timestamp) return 'Pending...';
    if (typeof timestamp.toDate === 'function') {
        try {
            return format(timestamp.toDate(), formatStr);
        } catch (e) {
            return 'Invalid Date';
        }
    }
    try {
        return format(new Date(timestamp), formatStr);
    } catch (e) {
        return 'Invalid Date';
    }
};

const PlanCard = ({ plan, currentUser }: { plan: SathiPlan, currentUser: User | null }) => {
    const { toast } = useToast();
    const db = useFirestore();
    const [requested, setRequested] = useState(false);

    const handleRequestJoin = async () => {
        if (!currentUser || !db) {
            toast({ variant: 'destructive', title: 'You must be logged in.' });
            return;
        }
        try {
            await requestToJoinPlan(db, currentUser, plan.id, plan.createdBy);
            toast({ title: 'Request Sent!', description: `Your request to join the plan for ${plan.destination} has been sent.` });
            setRequested(true);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    return (
        <Card className="flex flex-col h-full rounded-2xl shadow-soft-lg">
            <CardContent className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold font-headline line-clamp-2 text-foreground group-hover:text-white">{plan.destination}</h3>
                    <Badge variant={plan.groupType === 'women-only' ? 'destructive' : 'secondary'} className="group-hover:bg-white/20 group-hover:text-white">
                        {plan.groupType === 'women-only' ? 'Women-Only' : 'Mixed Group'}
                    </Badge>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground group-hover:text-white/80 flex-grow">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-current" /><span>From: {plan.fromCity}</span></div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-current" /><span>{safeFormatDate(plan.startDate, 'MMM d')} - {safeFormatDate(plan.endDate, 'd, yyyy')}</span></div>
                    <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-current" /><span>Budget: <span className="capitalize">{plan.budget}</span></span></div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 text-current" /><span>Group: {plan.groupSizeMin}-{plan.groupSizeMax} people</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-border group-hover:border-white/20">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(plan.interests || []).map(interest => <Badge key={interest} variant="outline" className="group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30">{interest}</Badge>)}
                    </div>
                    <Button onClick={handleRequestJoin} disabled={requested} className="w-full group-hover:bg-white group-hover:text-primary">
                        <Send className="mr-2 h-4 w-4" />
                        {requested ? 'Request Sent' : 'Request to Join'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const samplePlans: Partial<SathiPlan>[] = [
    {
        id: 'sample-1',
        destination: 'Leh-Ladakh Expedition',
        fromCity: 'Delhi',
        startDate: Timestamp.now() as any,
        endDate: Timestamp.now() as any,
        budget: 'mid',
        interests: ['Adventure', 'Culture'],
        groupSizeMin: 2,
        groupSizeMax: 6,
        groupType: 'mixed',
        description: 'Looking for adventure junkies for a 10-day Leh-Ladakh bike trip.',
        createdBy: 'sample',
        creator: { name: 'Aditya' }
    },
    {
        id: 'sample-2',
        destination: 'Goa Beach Hopping',
        fromCity: 'Mumbai',
        startDate: Timestamp.now() as any,
        endDate: Timestamp.now() as any,
        budget: 'low',
        interests: ['Party', 'Peace'],
        groupSizeMin: 3,
        groupSizeMax: 5,
        groupType: 'women-only',
        description: 'Relaxed trip to explore South Goa beaches and cafes.',
        createdBy: 'sample',
        creator: { name: 'Ananya' }
    },
    {
        id: 'sample-3',
        destination: 'Spiritual Rishikesh',
        fromCity: 'Lucknow',
        startDate: Timestamp.now() as any,
        endDate: Timestamp.now() as any,
        budget: 'low',
        interests: ['Spiritual', 'Peace'],
        groupSizeMin: 1,
        groupSizeMax: 4,
        groupType: 'mixed',
        description: 'Yoga and meditation retreat in Rishikesh.',
        createdBy: 'sample',
        creator: { name: 'Rahul' }
    }
];

export default function SathiSpacePage() {
    const { user, loading: authLoading } = useRequireAuth();
    const db = useFirestore();
    const [createPlanOpen, setCreatePlanOpen] = useState(false);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const plansQuery = useMemo(() => 
        db ? query(collection(db, "plans"), orderBy("createdAt", "desc")) : null
    , [db]);
    const { data: plansData, loading: plansLoading } = useCollection(plansQuery);

    const myGroupsQuery = useMemo(() => 
        db && user ? query(collection(db, "groups"), where("members", "array-contains", user.uid)) : null
    , [db, user]);
    const { data: myGroupsData, loading: myGroupsLoading } = useCollection(myGroupsQuery);
    
    const filteredPlans = useMemo(() => {
        if (!plansData) return [];
        return (plansData as SathiPlan[]).filter(plan => {
            const searchMatch = searchTerm.trim() === '' || 
                                plan.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                plan.description.toLowerCase().includes(searchTerm.toLowerCase());
            const interestMatch = selectedInterests.length === 0 || selectedInterests.every(i => plan.interests.includes(i));
            return searchMatch && interestMatch;
        });
    }, [plansData, searchTerm, selectedInterests]);

    const isLoading = authLoading || plansLoading || myGroupsLoading;

    const quickActions = [
        { title: 'Create Plan', description: 'Post destination, dates, vibe, and group size.', icon: WandSparkles, action: () => setCreatePlanOpen(true) },
        { title: 'Explore Groups', description: 'Browse by destination, date, budget, and interests.', icon: Compass, action: () => document.getElementById('content-tabs')?.scrollIntoView({ behavior: 'smooth' }) },
        { title: 'Discussions', description: 'Ask questions, share tips, and find travel buddies.', icon: MessageSquareText, action: () => {} },
        { title: 'My Groups', description: 'View your joined groups, requests, and trip status.', icon: Users, action: () => {} },
    ];
    
    const safetyPoints = [
        { title: "Verified Profiles", icon: CheckCircle },
        { title: "Women-First Groups", icon: Shield },
        { title: "Report & Moderation", icon: Info },
        { title: "No Pressure to Meet", icon: Heart },
    ];

    const displayPlans = useMemo(() => {
        if (!isLoading && filteredPlans.length === 0 && searchTerm === '' && selectedInterests.length === 0) {
            return samplePlans as SathiPlan[];
        }
        return filteredPlans;
    }, [filteredPlans, isLoading, searchTerm, selectedInterests]);

    if (authLoading || !user) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading Sathi Space...</p>
            </div>
          </div>
        );
    }
    
  return (
    <>
    <div className="bg-background text-foreground min-h-screen">
        <div className="container mx-auto max-w-6xl py-16 px-4 sm:px-6 lg:px-8 space-y-20">

            {/* Hero Section */}
            <ScrollReveal as="section" className="text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-headline">Meet Before You Move.</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">Find your travel people, plan together, build trust, then explore.</p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={() => setCreatePlanOpen(true)}>Create a Travel Plan</Button>
                    <Button size="lg" variant="outline" onClick={() => document.getElementById('content-tabs')?.scrollIntoView({ behavior: 'smooth' })}>Explore Groups</Button>
                </div>
            </ScrollReveal>

            {/* Quick Action Grid */}
            <ScrollReveal as="section" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map(action => (
                    <ScrollRevealItem key={action.title}>
                        <Card onClick={action.action} className="p-6 h-full cursor-pointer rounded-2xl shadow-soft-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-border hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10">
                            <action.icon className="h-8 w-8 mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{action.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                        </Card>
                    </ScrollRevealItem>
                ))}
            </ScrollReveal>

            {/* Search + Filters Bar */}
            <ScrollReveal as="section" className="space-y-4">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search destination, group, plan..." className="pl-12 h-12 text-lg rounded-xl" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex flex-wrap gap-2">
                    {interests.map(interest => (
                        <Button key={interest} variant={selectedInterests.includes(interest) ? 'default' : 'outline'} onClick={() => {
                            setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest])
                        }}>{interest}</Button>
                    ))}
                </div>
            </ScrollReveal>

            {/* Content Tabs */}
            <section id="content-tabs">
                <ScrollReveal>
                    <Tabs defaultValue="plans" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="plans">Plans</TabsTrigger>
                            <TabsTrigger value="groups">Groups</TabsTrigger>
                            <TabsTrigger value="discussions">Discussions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="plans" className="mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                               {isLoading && [...Array(6)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-2xl" />)}
                               {!isLoading && displayPlans.map(plan => <PlanCard key={plan.id} plan={plan} currentUser={user} />)}
                            </div>
                            {!isLoading && displayPlans.length === 0 && <div className="text-center py-16 col-span-full"><p className="text-lg text-muted-foreground">No plans match your filters. Be the first to create one!</p></div>}
                        </TabsContent>
                        <TabsContent value="groups" className="mt-8">
                           <h2 className="text-xl font-semibold mb-4">My Groups</h2>
                           {myGroupsLoading ? <p>Loading your groups...</p> : 
                            myGroupsData && myGroupsData.length > 0 ? (
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                   {myGroupsData.map(group => <Card key={group.id} className="p-4">{group.title}</Card>)}
                               </div>
                           ) : (
                               <div className="text-center py-16">
                                   <p className="text-lg text-muted-foreground">You haven't joined any groups yet.</p>
                                   <Button variant="link" onClick={() => setCreatePlanOpen(true)}>Create a Plan to start a group</Button>
                               </div>
                           )}
                        </TabsContent>
                        <TabsContent value="discussions" className="mt-8 text-center py-16">
                            <p className="text-lg text-muted-foreground">Discussions feature coming soon!</p>
                        </TabsContent>
                    </Tabs>
                </ScrollReveal>
            </section>

             {/* Live Activity */}
            <ScrollReveal as="section">
                <h2 className="text-2xl font-bold font-headline mb-6 text-center">What’s happening now</h2>
                <div className="space-y-4 max-w-2xl mx-auto">
                    {plansData?.slice(0, 5).map((plan) => (
                        <Card key={plan.id} className="p-4 flex items-center gap-4">
                            <Activity className="h-5 w-5 text-primary"/>
                            <div className="text-sm">
                                <span className="font-semibold">{plan.creator?.name || 'Anonymous'}</span> created a new plan for <span className="font-semibold">{plan.destination}</span>.
                                <p className="text-xs text-muted-foreground">{safeFormatDate(plan.createdAt, 'PPP')}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollReveal>

            {/* Safety & Trust */}
            <ScrollReveal as="section" className="bg-secondary text-secondary-foreground rounded-2xl p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold font-headline">Your Safety is Our Foundation</h2>
                    <p className="mt-2 text-muted-foreground">We build trust into every step of the journey.</p>
                </div>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {safetyPoints.map(point => (
                        <div key={point.title} className="text-center">
                            <point.icon className="h-8 w-8 mx-auto mb-3 text-primary"/>
                            <h3 className="font-semibold">{point.title}</h3>
                        </div>
                    ))}
                </div>
            </ScrollReveal>

        </div>
    </div>
    <CreatePlanModal open={createPlanOpen} onOpenChange={setCreatePlanOpen} />
    </>
  );
}
