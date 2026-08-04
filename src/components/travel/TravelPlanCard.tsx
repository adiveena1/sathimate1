
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Wallet, Shield, MapPin, Sparkles, UserCheck, Send, Info } from 'lucide-react';
import { format, isWithinInterval, subDays } from 'date-fns';
import { Progress } from '../ui/progress';
import { SathiPlan } from '@/lib/sathi-space-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { requestToJoinPlan } from '@/services/sathi-space-service';
import type { User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { ClientOnly } from '../shared/ClientOnly';

interface TravelPlanCardProps {
  plan: SathiPlan;
  user: User | null;
  db: Firestore | null;
}

export function TravelPlanCard({ plan, user, db }: TravelPlanCardProps) {
  const { toast } = useToast();
  const [requested, setRequested] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    // This logic is now inside useEffect to prevent hydration mismatch.
    // It runs only on the client-side.
    const checkIsNew = isWithinInterval(plan.createdAt.toDate(), { start: subDays(new Date(), 3), end: new Date() });
    setIsNew(checkIsNew);
  }, [plan.createdAt]);

  const groupProgress = (plan.groupSizeMin / plan.groupSizeMax) * 100;
  const spotsLeft = plan.groupSizeMax - plan.groupSizeMin;

  const handleRequestJoin = async () => {
    if (!user || !db) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to send a request.' });
        return;
    }
    try {
        await requestToJoinPlan(db, user, plan.id, plan.createdBy);
        toast({ title: 'Request Sent!', description: `Your request to join the plan for ${plan.destination} has been sent.` });
        setRequested(true);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 hover:shadow-2xl rounded-2xl shadow-soft-lg hover:bg-primary hover:text-primary-foreground group">
      <CardHeader className="p-5">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold font-headline line-clamp-1 text-foreground group-hover:text-white">
              <Link href={`/travel-plans/${plan.id}`}>{plan.destination}</Link>
            </h3>
            <div className="flex items-center space-x-1">
                <ClientOnly>
                  {isNew && <Badge variant="secondary" className="bg-blue-100 text-blue-800 group-hover:bg-white/20 group-hover:text-white">New</Badge>}
                </ClientOnly>
                {plan.groupType === 'women-only' && <Badge variant="destructive" className="bg-pink-100 text-pink-800 group-hover:bg-white/20 group-hover:text-white"><Shield className="mr-1 h-3 w-3" />Women-Only</Badge>}
            </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-white/80">
            <MapPin className="h-4 w-4"/>
            <span>From {plan.fromCity}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 pt-0 flex-grow flex flex-col">
        <div className="space-y-3 text-sm text-muted-foreground group-hover:text-white/80 flex-grow">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{format(plan.startDate.toDate(), 'MMM d')} - {format(plan.endDate.toDate(), 'MMM d, yyyy')}</span></div>
            <div className="flex items-center gap-2"><Wallet className="h-4 w-4" /><span>Budget: <span className="capitalize font-medium">{plan.budget}</span></span></div>
            <div className="flex flex-wrap gap-1">
                {plan.interests.slice(0, 3).map(interest => <Badge key={interest} variant="outline" className="group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20">{interest}</Badge>)}
                {plan.interests.length > 3 && <Badge variant="outline" className="group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20">+{plan.interests.length - 3}</Badge>}
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border group-hover:border-white/20">
             <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground group-hover:text-white/80">
                     <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>Group Size</span>
                     </div>
                     <span className="font-semibold text-foreground group-hover:text-white">{plan.groupSizeMin}-{plan.groupSizeMax}</span>
                </div>
                <Progress value={groupProgress} className="h-1.5" />
                <p className="text-xs text-right text-muted-foreground group-hover:text-white/80">{plan.groupSizeMin} joined, {spotsLeft} spots left</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/30 group-hover:bg-white/10">
        <div className="w-full flex justify-between items-center">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={`/profile/${plan.createdBy}`}>
                            <Avatar className="h-9 w-9 border-2 border-background group-hover:border-primary">
                                <AvatarImage src={plan.creator.photoURL} alt={plan.creator.name} />
                                <AvatarFallback>{plan.creator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Created by {plan.creator.name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
             <div className="flex gap-2">
                <Button asChild variant="ghost" size="sm" className="text-primary group-hover:text-white group-hover:bg-white/10">
                    <Link href={`/travel-plans/${plan.id}`}><Info className="mr-2 h-4 w-4"/>View Plan</Link>
                </Button>
                <Button size="sm" onClick={handleRequestJoin} disabled={requested || !user || !db} className="bg-primary group-hover:bg-white group-hover:text-primary">
                    <Send className="mr-2 h-4 w-4" />
                    {requested ? 'Requested' : 'Request to Join'}
                </Button>
             </div>
        </div>
      </CardFooter>
    </Card>
  );
}
