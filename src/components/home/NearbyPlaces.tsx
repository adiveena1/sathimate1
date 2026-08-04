'use client';

import { indianStates, type Place } from '@/lib/india-data';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { MapPin, Star, Users, CheckCircle, XCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollReveal, ScrollRevealItem } from '../shared/ScrollReveal';

// For demonstration, we're hardcoding to Rajasthan. In a real app, this would be dynamic.
const locationId = 'rajasthan';

const categories = [
    { id: 'all', title: 'All' },
    { id: 'attraction', title: 'Attractions' },
    { id: 'restaurant', title: 'Restaurants' },
    { id: 'cafe', title: 'Cafes' },
    { id: 'market', title: 'Markets' },
];

export function NearbyPlaces() {
  const [activeTab, setActiveTab] = useState('all');
  const state = indianStates.find((s) => s.id === locationId);

  const filteredPlaces = useMemo(() => {
    if (!state) return [];
    const allPlaces = [...state.famousPlaces].sort((a, b) => a.distance - b.distance);
    if (activeTab === 'all') {
      return allPlaces;
    }
    return allPlaces.filter(place => place.category === activeTab);
  }, [state, activeTab]);

  if (!state) {
    return (
      <div className="text-center py-10">
        <p>Could not find data for the selected location.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-left mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
          Explore What's Nearby
        </h2>
        <div className="flex items-center gap-2 mt-3 text-xl text-muted-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Showing places in <strong>{state.name}</strong></span>
        </div>
        <p className="mt-2 text-muted-foreground max-w-2xl">Discover and connect with others visiting the same spots around you.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto -mx-1">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="py-2 capitalize">{category.title}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-8">
          {filteredPlaces.length > 0 ? (
            <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" stagger staggerChildren={0.1}>
              {filteredPlaces.map(place => (
                <ScrollRevealItem key={place.name}>
                  <PlaceCard place={place} />
                </ScrollRevealItem>
              ))}
            </ScrollReveal>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
                <p>No places found in this category.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PlaceCard({ place }: { place: Place }) {
  return (
    <Card className="overflow-hidden cursor-pointer transition-shadow duration-300 shadow-md hover:shadow-xl flex flex-col h-full hover:bg-primary hover:text-primary-foreground group">
      <div className="relative h-48 w-full">
        <Image 
           src={place.imageUrl} 
           alt={place.name} 
           fill 
           className="object-cover group-hover:scale-110 transition-transform duration-300" 
           data-ai-hint={place.imageHint}
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
           priority={false}
         />
         <Badge className="absolute top-2 right-2 capitalize group-hover:bg-primary-foreground group-hover:text-primary" variant="secondary">{place.category}</Badge>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg group-hover:text-primary-foreground">{place.name}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground group-hover:text-primary-foreground/80 my-2">
            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 group-hover:fill-primary-foreground group-hover:text-primary-foreground" />
                <span className="font-semibold">{place.rating}</span>
                <span>({place.reviews})</span>
            </div>
            <div className="flex items-center gap-1">
               <MapPin className="w-4 h-4" />
               <span>{place.distance}km</span>
            </div>
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-medium ${place.isOpen ? 'text-green-600' : 'text-red-600'} group-hover:text-primary-foreground`}>
            {place.isOpen ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{place.isOpen ? 'Open' : 'Closed'}</span>
        </div>
        <div className="mt-4 pt-4 border-t group-hover:border-primary-foreground/20 flex-grow flex items-end">
            <Button className="w-full group-hover:bg-primary-foreground/10 group-hover:text-primary-foreground">
                <Users className="mr-2 h-4 w-4" />
                Connect with people going here
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}
