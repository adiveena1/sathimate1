'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, PlaneTakeoff, Calendar, Clock, CheckCircle2, User as UserIcon } from 'lucide-react';
import { UserProfile } from '@/types/profile';

interface TravelerCardProps {
  user: UserProfile;
}

export function TravelerCard({ user }: TravelerCardProps) {
  const formatTravelDate = (date: any) => {
    if (!date) return 'Flexible';
    if (typeof date === 'string') return date;
    if (date.toDate) {
      try {
        return date.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      } catch {
        return 'Flexible';
      }
    }
    return 'Flexible';
  };

  return (
    <Card className="flex flex-col h-full rounded-2xl shadow-soft-lg hover:shadow-xl transition-shadow duration-300 border-border overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-muted">
          {user.photoURL ? (
            <Image 
              src={user.photoURL} 
              alt={user.fullName || 'Traveler'} 
              fill 
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary/5">
              <UserIcon className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {user.verificationStatus === 'verified' && (
              <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 border-none shadow-md">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {user.fullName || 'Anonymous Traveler'}
              {user.age && <span className="text-sm font-normal text-white/80">{user.age}</span>}
              {user.gender && <span className="text-sm font-normal text-white/80 capitalize hidden sm:inline">• {user.gender}</span>}
            </h3>
            {user.city && (
              <p className="text-sm text-white/90 flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {user.city}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 flex-grow flex flex-col gap-4">
        {/* Travel Plan Highlight */}
        {user.travelDestination && (
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <div className="flex items-center gap-3 text-primary font-medium mb-2">
              <PlaneTakeoff className="w-4 h-4" />
              <span>Planning to visit {user.travelDestination}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>{formatTravelDate(user.travelDate)}</span>
              </div>
              {user.tripDuration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{user.tripDuration}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            "{user.bio}"
          </p>
        )}

        {/* Tags */}
        <div className="space-y-3 mt-auto pt-4">
          {user.interests && user.interests.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.slice(0, 4).map((interest, i) => (
                  <Badge key={i} variant="secondary" className="bg-secondary/50 text-xs font-normal">
                    {interest}
                  </Badge>
                ))}
                {user.interests.length > 4 && (
                  <Badge variant="outline" className="text-xs font-normal border-dashed">
                    +{user.interests.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {user.languages && user.languages.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Speaks</p>
              <div className="flex flex-wrap gap-1.5">
                {user.languages.map((lang, i) => (
                  <span key={i} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto border-t border-border/50 flex items-center justify-center">
        <Button asChild className="w-full mt-4 font-semibold rounded-xl" variant="default">
          <Link href={`/profile/${user.uid}`}>
            View Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
