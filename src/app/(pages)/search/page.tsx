
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { TravellerDetails } from '@/services/traveller-service';
import { collection, query, where, getFirestore, getDocs } from 'firebase/firestore';
import { TravelerCard } from '@/components/travel/TravelerCard';
import { connectionService, ConnectionRequest } from '@/services/connection-service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Compass, Search, Filter, Loader2, Users, MapPin, SlidersHorizontal, ArrowUpRight, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { AnimatePresence, motion } from 'framer-motion';

export default function SearchPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [searchQuery, setSearchQuery] = useState("");
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const travelersQuery = useMemo(() => 
    db ? query(collection(db, 'users'), where('onboardingComplete', '==', true)) : null
  , [db]);

  const requestsQuery = useMemo(() => 
    db && user ? query(collection(db, 'requests'), where('senderId', '==', user.uid)) : null
  , [db, user]);

  const { data: travelersDataRaw, loading: travelersLoading } = useCollection(travelersQuery);
  const { data: outgoingRequestsRaw, loading: requestsLoading } = useCollection(requestsQuery);
  
  const travelersData = (travelersDataRaw as TravellerDetails[]) || [];
  const outgoingRequests = (outgoingRequestsRaw as ConnectionRequest[]) || [];

  const filteredTravelers = useMemo(() => {
    const data = (travelersDataRaw as TravellerDetails[]) || [];
    if (!data || data.length === 0) return [];
    
    return data.filter(t => {
      if (user && t.uid === user.uid) return false;

      // Filter by search query (destination or name)
      const matchesSearch = !searchQuery || 
        (t.travelDestination?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (t.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      // Filter by age range
      const ageNum = parseInt(t.age) || 0;
      const matchesAge = ageNum >= ageRange[0] && ageNum <= ageRange[1];

      // Filter by travel style
      const matchesStyle = !selectedStyle || (t.travelStyle?.includes(selectedStyle) || false);

      // Filter by interests
      const matchesInterests = selectedInterests.length === 0 || 
        (t.interests?.some(interest => selectedInterests.includes(interest)) || false);

      return matchesSearch && matchesAge && matchesStyle && matchesInterests;
    });
  }, [travelersDataRaw, searchQuery, ageRange, selectedStyle, selectedInterests, user]);

  const INTEREST_OPTIONS = ["Nature", "Food", "Mountains", "Temples", "Cafes", "Beaches", "Culture", "Nightlife", "Photography"];
  const STYLE_OPTIONS = ["Backpacking", "Luxury", "Budget", "Adventure", "Family", "Solo"];

  if (travelersLoading || requestsLoading) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF9] gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="font-bold text-muted-foreground animate-pulse tracking-widest uppercase text-xs">Discovering Sathi Mates...</p>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCF9] pb-20">
      {/* Search Header */}
      <section className="bg-white border-b border-muted/20 pt-20 pb-12 sticky top-0 z-20 backdrop-blur-xl bg-white/80">
          <div className="container mx-auto px-6 max-w-6xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                             <Users className="h-3 w-3" /> Connect Community
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl font-headline">Find Your <span className="text-primary underline underline-offset-8 decoration-sky-200 decoration-4">Sathi</span></h1>
                   </div>
                   
                   <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                             <Input 
                                placeholder="Search by destination or name..." 
                                className="pl-12 h-14 bg-muted/20 border-none rounded-2xl focus-visible:ring-primary focus-visible:ring-offset-2 transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                             />
                        </div>
                        <Button 
                            variant={showFilters ? "default" : "outline"} 
                            className="h-14 w-14 rounded-2xl border-none shadow-sm transition-all"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal className="h-6 w-6" />
                        </Button>
                   </div>
              </div>

              {/* Collapsible Filters */}
              <AnimatePresence>
                  {showFilters && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-8 border-t border-muted/10 pt-8"
                    >
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4">
                              <div className="space-y-4">
                                   <label className="text-xs sm:text-[10px] font-black uppercase text-muted-foreground tracking-widest">Age Range: {ageRange[0]} - {ageRange[1]}</label>
                                   <div className="px-2 pt-2">
                                        <Slider 
                                            min={18} 
                                            max={80} 
                                            step={1} 
                                            value={ageRange} 
                                            onValueChange={setAgeRange} 
                                            className="cursor-pointer"
                                        />
                                   </div>
                              </div>

                              <div className="space-y-4">
                                   <label className="text-xs sm:text-[10px] font-black uppercase text-muted-foreground tracking-widest">Travel Style</label>
                                   <Select onValueChange={setSelectedStyle} value={selectedStyle || undefined}>
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/10 border-none font-bold">
                                             <SelectValue placeholder="All Styles" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Styles</SelectItem>
                                            {STYLE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                        </SelectContent>
                                   </Select>
                              </div>

                              <div className="space-y-4">
                                   <label className="text-xs sm:text-[10px] font-black uppercase text-muted-foreground tracking-widest">Interests</label>
                                   <div className="flex flex-wrap gap-2">
                                        {INTEREST_OPTIONS.map(interest => (
                                            <Badge 
                                                key={interest}
                                                variant={selectedInterests.includes(interest) ? "default" : "secondary"}
                                                className="cursor-pointer px-4 py-1.5 rounded-full text-xs transition-all hover:scale-105 active:scale-95 border-none shadow-sm"
                                                onClick={() => {
                                                    if (selectedInterests.includes(interest)) {
                                                        setSelectedInterests(selectedInterests.filter(i => i !== interest));
                                                    } else {
                                                        setSelectedInterests([...selectedInterests, interest]);
                                                    }
                                                }}
                                            >
                                                {interest}
                                            </Badge>
                                        ))}
                                   </div>
                              </div>
                         </div>
                    </motion.div>
                  )}
              </AnimatePresence>
          </div>
      </section>

      {/* Results Main */}
      <main className="container mx-auto px-6 max-w-6xl py-12">
           {filteredTravelers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTravelers.map(t => (
                        <TravelerCard 
                            key={t.uid} 
                            traveler={t} 
                            existingRequest={outgoingRequests?.find(r => r.receiverId === t.uid)}
                        />
                    ))}
                </div>
           ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-muted shadow-sm">
                     <div className="p-6 bg-muted/20 rounded-full mb-6 relative">
                          <Compass className="h-16 w-16 text-muted-foreground animate-[spin_10s_linear_infinite]" />
                          <X className="absolute top-0 right-0 h-8 w-8 text-destructive animate-bounce" />
                     </div>
                     <h2 className="text-2xl font-black mb-2">No Travelers Found</h2>
                     <p className="text-muted-foreground max-w-xs text-center">We couldn't find any travelers matching your filters. Try search for "Goa" or clearing your interests.</p>
                     <Button variant="ghost" className="mt-8 font-bold text-primary group" onClick={() => {
                         setSearchQuery("");
                         setAgeRange([18, 60]);
                         setSelectedInterests([]);
                         setSelectedStyle(null);
                     }}>
                         Clear All Filters <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     </Button>
                </div>
           )}
      </main>
    </div>
  );
}
