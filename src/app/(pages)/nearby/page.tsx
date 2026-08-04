'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NearbyTravelersList } from '@/components/travel/NearbyTravelersList';
import { NearbyPlaces } from '@/components/places/NearbyPlaces';
import { Users, Compass, Navigation } from 'lucide-react';
import { NearbyTraveler, nearbyService } from '@/services/nearby-service';
import { useLocation } from '@/hooks/use-location';

export default function NearbyPage() {
  const [travelers, setTravelers] = useState<NearbyTraveler[]>([]);
  const { lat, lng } = useLocation();

  // We could fetch here, but NearbyTravelersList currently handles its own state.
  // To keep it simple without breaking existing components too much,
  // we'll let NearbyTravelersList pass its travelers up or just use a shared service.
  
  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic Radar Header */}
      <section className="relative bg-primary/5 py-16 overflow-hidden border-b border-primary/10">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                 <Navigation className="h-3 w-3 animate-pulse" /> Live Radar
              </div>
              <h1 className="text-5xl md:text-6xl font-headline font-bold text-slate-900 tracking-tight">Neighborhood <span className="text-primary">Radar</span></h1>
              <p className="text-xl text-muted-foreground mt-6 leading-relaxed">
                Unlock the area around you. Find travel buddies right now or discover the best local gems, from hidden temples to the coziest cafes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Radar Application */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs defaultValue="places" className="w-full">
            <div className="flex justify-center mb-12">
               <TabsList className="h-14 p-1 rounded-2xl bg-secondary/30 border border-secondary">
                 <TabsTrigger value="places" className="h-full px-8 rounded-xl font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Compass className="h-4 w-4" /> Discover Places
                 </TabsTrigger>
                 <TabsTrigger value="travelers" className="h-full px-8 rounded-xl font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Users className="h-4 w-4" /> Find Sathi Mate
                 </TabsTrigger>
               </TabsList>
            </div>
            
            <TabsContent value="places" className="mt-0 focus-visible:outline-none">
              <NearbyPlaces travelers={travelers} />
            </TabsContent>
            
            <TabsContent value="travelers" className="mt-0 focus-visible:outline-none">
              <NearbyTravelersList onTravelersUpdate={setTravelers} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
