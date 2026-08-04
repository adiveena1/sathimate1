'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocation } from '@/hooks/use-location';
import { nearbyService, NearbyTraveler } from '@/services/nearby-service';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, SignalHigh, Users, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

const INTERESTS = ['cafes', 'sightseeing', 'food', 'trekking', 'adventure', 'bike ride', 'photography', 'local explore'];

export function NearbyTravelersList({ onTravelersUpdate }: { onTravelersUpdate?: (t: NearbyTraveler[]) => void }) {
  const { user } = useUser();
  const { lat, lng, error: locError, loading: locationLoading, getLocation, setLocation } = useLocation();
  const [isLive, setIsLive] = useState(false);
  const [radiusKm, setRadiusKm] = useState(5);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [travelers, setTravelers] = useState<NearbyTraveler[]>([]);
  const [fetching, setFetching] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = useCallback(async () => {
    if (!lat || !lng) return;
    setFetching(true);
    try {
      const results = await nearbyService.findNearbyTravelers(lat, lng, radiusKm, selectedInterests);
      setTravelers(results);
      onTravelersUpdate?.(results);
    } catch (e: any) {
      toast({ title: 'Failed to search nearby', description: e.message, variant: 'destructive' });
    } finally {
      setFetching(false);
    }
  }, [lat, lng, radiusKm, selectedInterests, onTravelersUpdate, toast]);

  useEffect(() => {
    if (isLive && lat && lng) {
      handleSearch();
    }
  }, [isLive, lat, lng, handleSearch]);

  const toggleLive = async () => {
    setCustomError(null);
    if (!user) {
      setCustomError("You must be logged in to use the Nearby feature.");
      return;
    }

    if (isLive) {
      // Turn off
      await nearbyService.hideLocation();
      setIsLive(false);
      setTravelers([]);
      setLocation({ lat: null, lng: null, error: null, loading: false });
      toast({ title: 'Nearby Mode Disabled', description: 'You are no longer visible on the map.' });
    } else {
      // Turn on
      getLocation();
    }
  };

  // When location is successfully fetched
  useEffect(() => {
    if (lat && lng && !isLive && !locationLoading && !locError) {
      const startLive = async () => {
        try {
          await nearbyService.goLive(lat, lng, selectedInterests, 'public');
          setIsLive(true);
          toast({ title: 'Nearby Mode Enabled', description: 'You are now visible to other travelers.' });
        } catch (e: any) {
           setCustomError(e.message);
        }
      };
      startLive();
    }
  }, [lat, lng, locationLoading, locError, isLive, selectedInterests, toast]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleConnect = async (uid: string) => {
    try {
      await nearbyService.sendConnectRequest(uid, "Hi, I am also nearby and want to explore together!");
      toast({ title: 'Request Sent', description: 'Traveler has been notified.' });
    } catch(e:any) {
       toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header and Controls */}
      <Card className="p-6 bg-secondary/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <SignalHigh className={isLive ? "text-green-500 animate-pulse" : "text-muted-foreground"} />
              Nearby Travelers
            </h2>
            <p className="text-muted-foreground mt-1">Connect with people around you right now.</p>
          </div>
          <Button 
            size="lg" 
            variant={isLive ? "destructive" : "default"} 
            onClick={toggleLive}
            disabled={locationLoading}
          >
            {locationLoading ? 'Locating...' : isLive ? 'Go Offline' : 'Turn On Nearby Mode'}
          </Button>
        </div>

        {(locError || customError) && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mt-6 rounded-r flex gap-3 items-center">
             <AlertTriangle className="text-destructive h-5 w-5 flex-shrink-0" />
             <p className="text-destructive text-sm font-semibold">{locError || customError}</p>
          </div>
        )}

        {isLive && (
          <div className="mt-8 space-y-6">
            <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <label className="font-semibold text-sm">Search Radius: {radiusKm} km</label>
               </div>
               <Slider 
                 value={[radiusKm]} 
                 min={1} 
                 max={25} 
                 step={1} 
                 onValueChange={(val) => setRadiusKm(val[0])} 
                 className="w-full md:w-1/2"
               />
            </div>

            <div className="space-y-3">
               <label className="font-semibold text-sm">Filter by Interests</label>
               <div className="flex flex-wrap gap-2">
                 {INTERESTS.map(interest => (
                   <Badge 
                     key={interest} 
                     variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                     className="cursor-pointer capitalize hover:bg-primary/80"
                     onClick={() => toggleInterest(interest)}
                   >
                     {interest}
                   </Badge>
                 ))}
               </div>
            </div>
          </div>
        )}
      </Card>

      {/* Results */}
      {isLive && (
        <div>
           {fetching ? (
             <p className="text-center py-10 text-muted-foreground flex items-center justify-center gap-2">
                <Navigation className="animate-spin w-5 h-5" /> Scanning the area...
             </p>
           ) : travelers.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {travelers.map(t => (
                  <Card key={t.uid} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                       <div className="p-4 flex items-start gap-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                             {t.profilePhoto ? (
                               <Image src={t.profilePhoto} alt={t.name} fill className="object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">{t.name.charAt(0)}</div>
                             )}
                          </div>
                          <div>
                             <h3 className="font-bold text-lg">{t.name}</h3>
                             <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {t.distanceKm} km away {t.city ? `in ${t.city}` : ''}
                             </p>
                             <p className="text-sm mt-2 line-clamp-2">{t.shortBio || 'Ready to explore!'}</p>
                          </div>
                       </div>
                       <div className="px-4 pb-3 flex flex-wrap gap-1">
                          {t.interests.slice(0,3).map(i => <Badge key={i} variant="secondary" className="text-xs sm:text-[10px] capitalize">{i}</Badge>)}
                       </div>
                       <div className="p-4 pt-2 border-t bg-secondary/20">
                          <Button className="w-full" onClick={() => handleConnect(t.uid)}>Connect 👋</Button>
                       </div>
                    </CardContent>
                  </Card>
                ))}
             </div>
           ) : (
             <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-bold">No travelers found</h3>
                <p className="text-muted-foreground">Try expanding your search radius or modifying filters.</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
