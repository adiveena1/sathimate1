
'use client';

import { useParams, notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Users, Wallet, MapPin, MessageCircle, UserPlus, CheckCircle2, Shield, Send } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SathiPlan } from '@/lib/sathi-space-data';
import { requestToJoinPlan } from '@/services/sathi-space-service';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';


function TravelPlanDetailSkeleton() {
    return (
        <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-10 w-3/4" />
                        <div className="mt-3 flex items-center space-x-2">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-28 w-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                     <Separator />
                    <div className="space-y-6">
                         <Skeleton className="h-8 w-40" />
                         <div className="flex items-start space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                         </div>
                    </div>
                </div>
                 <div className="lg:col-span-1 space-y-6">
                    <Skeleton className="h-64 w-full" />
                 </div>
            </div>
        </div>
    )
}


export default function TravelPlanDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { user: authUser, loading: authLoading } = useRequireAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [requested, setRequested] = useState(false);

  const planRef = useMemo(() =>
    db && id ? doc(db, 'plans', id) : null
  , [db, id]);
  const { data: plan, loading: planLoading } = useDoc(planRef) as { data: SathiPlan | null, loading: boolean };

  const handleRequestJoin = async () => {
    if (!authUser || !plan || !db) {
        toast({ variant: 'destructive', title: 'Could not send request.' });
        return;
    }
    setRequested(true);
    try {
        await requestToJoinPlan(db, authUser, plan.id, plan.createdBy);
        toast({ title: 'Request Sent!', description: `Your request to join the plan for ${plan.destination} has been sent.` });
    } catch (error: any) {
        setRequested(false);
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  if (authLoading || planLoading) {
    return <TravelPlanDetailSkeleton />;
  }

  if (!plan) {
    notFound();
    return null;
  }

  const isOwner = authUser?.uid === plan.createdBy;
  const isClosed = plan.status === 'closed';

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Plan Header */}
          <div>
             <Badge variant={isClosed ? 'default' : 'secondary'} className={`mb-2 ${isClosed ? "bg-green-500 hover:bg-green-600" : ""}`}>
                {isClosed ? 'Group Formed' : 'Seeking Members'}
             </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight font-headline">{plan.destination}</h1>
            <div className="mt-2 flex items-center space-x-2 text-muted-foreground">
              <span>Created by</span>
              <Avatar className="h-6 w-6">
                <AvatarImage src={plan.creator.photoURL} alt={plan.creator.name} />
                <AvatarFallback>{plan.creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{plan.creator.name}</span>
            </div>
          </div>
          
          {/* Plan Details */}
          <Card>
            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <CalendarDays className="h-6 w-6 text-primary" />
                    <span className="text-sm font-bold">{format(plan.startDate.toDate(), 'MMM d')} - {format(plan.endDate.toDate(), 'd')}</span>
                    <span className="text-xs text-muted-foreground">{format(plan.endDate.toDate(), 'yyyy')}</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    <span className="text-sm font-bold capitalize">{plan.budget}</span>
                     <span className="text-xs text-muted-foreground">Budget</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    <span className="text-sm font-bold">{plan.groupSizeMin} - {plan.groupSizeMax}</span>
                     <span className="text-xs text-muted-foreground">Group Size</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="text-sm font-bold capitalize">{plan.groupType === 'women-only' ? 'Women-Only' : 'Mixed'}</span>
                     <span className="text-xs text-muted-foreground">Group Type</span>
                </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <div>
            <h2 className="text-2xl font-bold font-headline mb-3">Trip Vibe & Interests</h2>
            <div className="flex flex-wrap gap-2">
                {plan.interests.map(interest => <Badge key={interest} variant="secondary">{interest}</Badge>)}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold font-headline">About This Trip</h2>
            <p className="mt-2 text-muted-foreground">{plan.description}</p>
          </div>
          <Separator />
          
          {/* Discussion */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
              <MessageCircle className="h-6 w-6" /> Discussion
            </h2>
            <Card className='p-6 text-center text-muted-foreground bg-secondary'>
                Commenting is coming soon! This is where you'll be able to chat with the creator and other interested travelers.
            </Card>
            <div className="flex items-start space-x-4">
                 <Avatar>
                    <AvatarImage src={authUser?.photoURL || ''} alt={authUser?.displayName || ''} />
                    <AvatarFallback>{authUser?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                <div className="w-full space-y-2">
                    <Textarea placeholder="Ask a question or share your thoughts..." disabled />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span tabIndex={0}>
                                    <Button disabled>Post Comment</Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Commenting feature is coming soon!</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
                {isClosed ? (
                     <Button className="w-full bg-green-500 hover:bg-green-600 cursor-default">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Group Formed
                    </Button>
                ) : isOwner ? (
                     <Button variant="outline" className="w-full cursor-default">You are the creator</Button>
                ) : (
                    <Button size="lg" className="w-full" onClick={handleRequestJoin} disabled={requested}>
                        <Send className="mr-2 h-4 w-4" /> {requested ? 'Request Sent' : 'Request to Join'}
                    </Button>
                )}
             
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">Creator</h3>
              <div className="space-y-4">
                   <Link href={`/profile/${plan.createdBy}`} className="flex items-center space-x-3 group">
                    <Avatar>
                      <AvatarImage src={plan.creator.photoURL} alt={plan.creator.name} />
                      <AvatarFallback>{plan.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium group-hover:underline">{plan.creator.name}</span>
                    <Badge variant="outline">Creator</Badge>
                  </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
