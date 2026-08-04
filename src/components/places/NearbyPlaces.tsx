
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocation } from '@/hooks/use-location';
import { placesService, NearbyPlace } from '@/services/places-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Compass, Search, Navigation, Coffee, Utensils, Landmark, Mountain, Droplets, Star, RefreshCcw, AlertCircle, LayoutGrid, Map as MapIcon } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { NearbyMap } from '@/components/map/NearbyMap';
import { NearbyTraveler, nearbyService } from '@/services/nearby-service';

const CATEGORIES = [
  { id: 'temples', label: 'Temples', icon: Landmark, color: 'orange' },
  { id: 'tourist spots', label: 'Tourist Spots', icon: Compass, color: 'blue' },
  { id: 'hills', label: 'Hills', icon: Mountain, color: 'slate' },
  { id: 'waterfalls', label: 'Waterfalls', icon: Droplets, color: 'cyan' },
  { id: 'cafes', label: 'Cafes', icon: Coffee, color: 'amber' },
  { id: 'restaurants', label: 'Restaurants', icon: Utensils, color: 'red' }
];

const RADII = [2, 5, 10];

interface NearbyPlacesProps {
  travelers?: NearbyTraveler[];
}

export function NearbyPlaces({ travelers = [] }: NearbyPlacesProps) {
  const { lat, lng, error: locError, loading: locationLoading, getLocation } = useLocation();
  const [radiusKm, setRadiusKm] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [fetching, setFetching] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const { toast } = useToast();

  const handleSearch = useCallback(async () => {
    if (!lat || !lng) return;
    setFetching(true);
    try {
      const results = await placesService.getNearbyPlaces(lat, lng, radiusKm, selectedCategories);
      setPlaces(results);
    } catch (e: any) {
      toast({ title: 'Failed to find places', description: e.message, variant: 'destructive' });
    } finally {
      setFetching(false);
    }
  }, [lat, lng, radiusKm, selectedCategories, toast]);

  useEffect(() => {
    if (lat && lng) {
      handleSearch();
    }
  }, [lat, lng, handleSearch]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleConnect = async (t: NearbyTraveler) => {
    try {
      await nearbyService.sendConnectRequest(t.uid, "Hi! I found you on the Radar. Want to explore together?");
      toast({ title: 'Request Sent', description: `Message sent to ${t.name}.` });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Search Controls */}
      <Card className="p-6 bg-gradient-to-br from-background to-accent/20 border-accent/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Compass className="text-primary h-7 w-7" />
              Explore Nearby
            </h2>
            <p className="text-muted-foreground mt-1">Discover hidden gems around your location.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
             <div className="flex bg-muted p-1 rounded-xl border">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Grid
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <MapIcon className="w-3.5 h-3.5" /> Map
                </button>
             </div>

             <div className="h-8 w-px bg-border hidden md:block" />

             <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-semibold mr-2">Radius:</span>
                {RADII.map(r => (
                  <Button 
                    key={r}
                    size="sm"
                    variant={radiusKm === r ? 'default' : 'outline'}
                    onClick={() => setRadiusKm(r)}
                    className="rounded-full w-14 h-8 text-xs"
                  >
                    {r}km
                  </Button>
                ))}
                
                {!lat && (
                  <Button size="sm" onClick={getLocation} disabled={locationLoading} className="ml-2 rounded-full px-6 bg-primary hover:bg-primary/90 h-8 text-xs font-bold">
                    {locationLoading ? 'Locating...' : 'Allow Location'}
                  </Button>
                )}
             </div>
          </div>
        </div>

        {locError && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-3 mt-4 rounded-r flex gap-3 items-center">
             <AlertCircle className="text-destructive h-4 w-4" />
             <p className="text-destructive text-sm font-medium">{locError}</p>
          </div>
        )}

        <div className="mt-8">
           <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-3">Categories</label>
           <div className="flex flex-wrap gap-3">
             {CATEGORIES.map(cat => {
               const Icon = cat.icon;
               const isActive = selectedCategories.includes(cat.id);
               return (
                 <button 
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200
                    ${isActive 
                      ? `bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105` 
                      : `bg-card hover:bg-accent border-border text-card-foreground`
                    }
                  `}
                 >
                   <Icon className={`h-4 w-4 ${isActive ? 'text-current' : 'text-primary'}`} />
                   <span className="text-sm font-semibold">{cat.label}</span>
                 </button>
               );
             })}
           </div>
        </div>
      </Card>

      {/* Places List / Map Toggle */}
      <div className="min-h-[400px]">
        {fetching ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Navigation className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary h-6 w-6" />
             </div>
             <p className="text-muted-foreground font-medium animate-pulse">Scanning the surroundings for gems...</p>
          </div>
        ) : !lat ? (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed flex flex-col items-center">
             <div className="bg-primary/10 p-5 rounded-full mb-6">
                <MapPin className="w-10 h-10 text-primary" />
             </div>
             <h3 className="text-xl font-bold">Location Access Required</h3>
             <p className="text-muted-foreground max-w-sm mt-2 mx-auto">Please allow location access to discover amazing places like temples, parks, and cafes around you.</p>
             <Button className="mt-8 rounded-full px-8" onClick={getLocation} size="lg">Unlock Nearby Mode</Button>
          </div>
        ) : viewMode === 'map' ? (
          <div className="rounded-3xl overflow-hidden border">
             <NearbyMap 
               lat={lat!} 
               lng={lng!} 
               places={places} 
               travelers={travelers} 
               onSelectTraveler={() => {}} 
               onConnect={handleConnect}
             />
          </div>
        ) : places.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {places.map((place, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={place.id}
                >
                  <Card className="overflow-hidden h-full group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-border/50 hover:border-primary/20">
                    <div className="relative h-48 w-full bg-muted overflow-hidden">
                      {place.imageUrl ? (
                        <Image 
                          src={place.imageUrl} 
                          alt={place.name} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-110" 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                          <MapPin className="h-8 w-8 opacity-20" />
                          <span className="text-xs uppercase tracking-tighter opacity-50 font-bold">No Preview</span>
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-md text-slate-800 border-none capitalize font-bold shadow-sm">
                          {place.category}
                        </Badge>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs sm:text-[10px] font-bold uppercase tracking-wider">Distance: {place.distance || '??'} km</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">{place.name}</h3>
                        {place.rating && (
                          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold border border-yellow-200 shrink-0">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {place.rating}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground flex items-start gap-1.5 line-clamp-2 min-h-[2.5rem]">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {place.vicinity}
                      </p>

                      <div className="mt-5 flex gap-2">
                        <Button 
                          variant="secondary" 
                          className="flex-1 rounded-xl h-10 font-bold text-xs"
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.vicinity)}&query_place_id=${place.id}`, '_blank')}
                        >
                          Show on Map
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/10 rounded-3xl border flex flex-col items-center">
             <Search className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
             <h3 className="text-lg font-bold">No results found nearby</h3>
             <p className="text-muted-foreground mt-1">Try expanding the radius or changing filters.</p>
             <Button variant="outline" className="mt-6 font-bold" onClick={handleSearch}>
               <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}
