
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Heart, UserPlus, Check, Clock, User, Globe } from 'lucide-react';
import { TravellerDetails } from '@/services/traveller-service';
import { connectionService, ConnectionRequest } from '@/services/connection-service';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TravelerCardProps {
  traveler: TravellerDetails;
  existingRequest?: ConnectionRequest;
}

export function TravelerCard({ traveler, existingRequest }: TravelerCardProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [requestStatus, setRequestStatus] = useState<'idle' | 'pending' | 'accepted' | 'rejected'>(existingRequest?.status || 'idle');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await connectionService.sendRequest({
        senderId: user.uid,
        receiverId: traveler.uid,
        senderName: user.displayName || 'Traveler',
        senderPhoto: user.photoURL || undefined,
      });
      setRequestStatus('pending');
      toast({
        title: "Request Sent",
        description: `Waiting for ${traveler.fullName} to respond.`,
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message || "Failed to send request",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 rounded-3xl border border-muted/20 bg-card/80 backdrop-blur-sm">
      <div className="relative h-48 overflow-hidden">
          {traveler.photoURL ? (
              <Image src={traveler.photoURL} alt={traveler.fullName} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform group-hover:scale-110 duration-700" />
          ) : (
              <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                  <User className="h-20 w-20 text-primary/20" />
              </div>
          )}
          <div className="absolute top-4 right-4 group-hover:scale-105 transition-transform">
               <Badge className="bg-white/90 backdrop-blur-md text-black border-none px-3 py-1 font-bold shadow-lg shadow-black/10">
                  {traveler.age} yrs
               </Badge>
          </div>
          <div className="absolute bottom-4 left-4">
               <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xl">
                    <MapPin className="h-3 w-3 text-sky-400" />
                    <span className="text-xs sm:text-[10px] font-black uppercase tracking-widest">{traveler.travelDestination}</span>
               </div>
          </div>
      </div>
      
      <CardHeader className="px-6 pt-6 pb-2">
           <div className="flex justify-between items-start">
                <div>
                     <h3 className="text-xl font-extrabold tracking-tight">{traveler.fullName}</h3>
                     <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-1">
                          From {traveler.city}, {traveler.country}
                     </p>
                </div>
           </div>
      </CardHeader>

      <CardContent className="px-6 py-4 space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2 italic leading-relaxed">
               "{traveler.bio}"
          </p>
          
          <div className="flex flex-wrap gap-1.5">
               {traveler.interests.slice(0, 3).map(interest => (
                  <Badge key={interest} variant="secondary" className="px-3 py-0.5 rounded-full text-xs sm:text-[10px] font-bold bg-primary/5 text-primary border-none">
                       {interest}
                  </Badge>
               ))}
               {traveler.interests.length > 3 && <span className="text-xs sm:text-[10px] font-bold text-muted-foreground px-1">+{traveler.interests.length - 3}</span>}
          </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 gap-3">
          <Dialog>
              <DialogTrigger asChild>
                   <Button variant="outline" className="flex-1 rounded-2xl font-bold h-11 border-muted hover:bg-muted text-xs">Profile</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-3xl sm:rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                   <div className="h-40 bg-primary/10 relative">
                        <div className="absolute -bottom-16 left-8">
                             <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                                  <AvatarImage src={traveler.photoURL} />
                                  <AvatarFallback className="text-4xl">{traveler.fullName?.charAt(0)}</AvatarFallback>
                             </Avatar>
                        </div>
                   </div>
                   <div className="pt-20 px-8 pb-10 space-y-6">
                        <div>
                             <h2 className="text-3xl font-black">{traveler.fullName}, {traveler.age}</h2>
                             <p className="text-muted-foreground flex items-center gap-2 mt-2">
                                  <MapPin className="h-4 w-4" /> {traveler.city}, {traveler.country}
                                  <span className="mx-1">•</span>
                                  <Globe className="h-4 w-4" /> {traveler.languages.join(", ")}
                             </p>
                        </div>
                        <div className="space-y-4">
                             <div className="flex items-center gap-2 p-4 rounded-2xl bg-muted/30">
                                  <Calendar className="h-5 w-5 text-primary" />
                                  <div className="text-sm">
                                       <span className="font-bold">Next Trip: {traveler.travelDestination}</span>
                                       <p className="text-xs text-muted-foreground">Budget: {traveler.budgetRange}</p>
                                  </div>
                             </div>
                             <div className="space-y-2">
                                  <span className="text-xs sm:text-[10px] font-black uppercase text-primary tracking-widest">ABOUT</span>
                                  <p className="text-sm leading-relaxed">{traveler.bio}</p>
                             </div>
                             <div className="space-y-2">
                                  <span className="text-xs sm:text-[10px] font-black uppercase text-primary tracking-widest">INTERESTS</span>
                                  <div className="flex flex-wrap gap-2">
                                       {traveler.interests.map(i => <Badge key={i} variant="secondary" className="rounded-full px-4 py-1.5 font-bold transition-all hover:bg-primary hover:text-white cursor-default border-none">{i}</Badge>)}
                                  </div>
                             </div>
                        </div>
                   </div>
              </DialogContent>
          </Dialog>

          {requestStatus === 'idle' ? (
              <Button 
                onClick={handleConnect} 
                className="flex-1 rounded-2xl font-black h-11 gap-2 text-xs shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                  {isLoading ? '...' : <><UserPlus className="h-4 w-4" /> Connect</>}
              </Button>
          ) : requestStatus === 'pending' ? (
              <Button variant="secondary" className="flex-1 rounded-2xl font-black h-11 gap-2 text-xs opacity-80 cursor-default" disabled>
                   <Clock className="h-4 w-4" /> Requested
              </Button>
          ) : requestStatus === 'accepted' ? (
              <Button className="flex-1 rounded-2xl font-black h-11 gap-2 text-xs bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20">
                   <Check className="h-4 w-4" /> Chat Now
              </Button>
          ) : (
              <Button variant="ghost" className="flex-1 rounded-2xl font-bold h-11 text-xs text-destructive" disabled>
                   Request Declined
              </Button>
          )}
      </CardFooter>
    </Card>
  );
}
