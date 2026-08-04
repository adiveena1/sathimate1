'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { popularDestinations } from '@/lib/india-data';
import { ScrollReveal, ScrollRevealItem } from '../shared/ScrollReveal';

export function PopularDestinations() {
  const [showAll, setShowAll] = useState(false);
  const displayedDestinations = showAll ? popularDestinations : popularDestinations.slice(0, 9);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div className="text-left">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Popular Destinations in India</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">Explore places our community loves to visit.</p>
        </div>
        {!showAll && popularDestinations.length > 9 && (
          <Button 
            variant="outline" 
            className="rounded-full px-6"
            onClick={() => setShowAll(true)}
          >
            Show More
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedDestinations.map((destination) => (
          <Link
            key={destination.id + '-' + destination.name}
            href={`/state/${destination.id}`}
            className="block h-full transition-transform hover:-translate-y-2 duration-300"
          >
            <Card className="overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all group hover:bg-primary border-border/40">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={destination.imageUrl}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  data-ai-hint={destination.imageHint}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={displayedDestinations.indexOf(destination) < 3}
                />
                {destination.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-white/95 backdrop-blur-md text-primary border-none font-bold py-1 px-3 shadow-lg">
                      {destination.badge}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5 flex-grow">
                <h3 className="font-black text-xl group-hover:text-primary-foreground tracking-tight">{destination.name}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-primary group-hover:text-primary-foreground/70 mt-1">{destination.state}</p>
                <p className="text-muted-foreground mt-3 line-clamp-2 group-hover:text-primary-foreground/90 leading-relaxed font-medium">
                  {destination.description}
                </p>
                {destination.communityText && (
                   <div className="mt-5 pt-5 border-t border-border/50 group-hover:border-primary-foreground/20 flex items-center justify-between">
                      <span className="text-xs sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary-foreground/60">{destination.communityText}</span>
                      <div className="bg-primary/5 group-hover:bg-primary-foreground/20 p-2 rounded-full transition-colors">
                        <ArrowRight className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                   </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {showAll && (
        <div className="mt-12 text-center">
           <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-primary"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </Button>
        </div>
      )}
    </div>
  );
}
