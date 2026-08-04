'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/firebase';
import { getDb } from '@/firebase/config-client';
import { collection, query, where, getDocs, limit, startAfter, orderBy, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { UserProfile } from '@/types/profile';
import { TravelerCard } from '@/components/discover/TravelerCard';
import { DiscoverFilters } from '@/components/discover/DiscoverFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DiscoverTravelersPage() {
  const auth = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const [filters, setFilters] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTravelers = useCallback(async (isLoadMore = false) => {
    if (!auth?.currentUser) return;
    
    try {
      const db = getDb();
      if (!db) return;

      setLoading(!isLoadMore);
      if (isLoadMore) setLoadingMore(true);

      const usersRef = collection(db, 'users');
      
      // Base constraints
      let constraints: any[] = [
        where('visibility', '==', 'public'),
        where('uid', '!=', auth.currentUser.uid)
      ];

      // Filters
      if (filters.budget) {
        constraints.push(where('budgetRange', '==', filters.budget));
      }
      if (filters.gender) {
        constraints.push(where('gender', '==', filters.gender));
      }

      // Ordering
      // Note: Because we use '!=' on uid, we must order by uid first in Firestore, 
      // but to keep it simple and avoid complex index requirements initially, 
      // we might do client-side filtering for uid if we add other orderBys.
      // For now, we will just fetch and filter out the current user client-side if we need specific sorts.
      
      let q = query(usersRef, where('visibility', '==', 'public'), limit(20));
      
      // If we have sorting, we'd add orderBy. 
      // Let's do a simple query and client-side filter for currentUser to avoid index hell.
      if (filters.sortBy === 'newest') {
        q = query(usersRef, where('visibility', '==', 'public'), orderBy('createdAt', 'desc'), limit(20));
      }

      if (isLoadMore && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapshot = await getDocs(q);
      
      const newUsers: UserProfile[] = [];
      snapshot.forEach(doc => {
        const data = doc.data() as UserProfile;
        if (data.uid !== auth.currentUser?.uid) {
          
          // Apply client-side filters for things that are hard to index
          let match = true;
          
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const nameMatch = data.fullName?.toLowerCase().includes(searchLower) || false;
            const destMatch = data.travelDestination?.toLowerCase().includes(searchLower) || false;
            const cityMatch = data.city?.toLowerCase().includes(searchLower) || false;
            match = match && (nameMatch || destMatch || cityMatch);
          }

          if (filters.budget && data.budgetRange !== filters.budget) match = false;
          if (filters.gender && data.gender !== filters.gender) match = false;
          if (filters.destination && !data.travelDestination?.toLowerCase().includes(filters.destination.toLowerCase())) match = false;

          if (match) newUsers.push(data);
        }
      });

      if (isLoadMore) {
        setUsers(prev => [...prev, ...newUsers]);
      } else {
        setUsers(newUsers);
      }

      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === 20); // If we got 20, there might be more
      } else {
        setHasMore(false);
      }

    } catch (error) {
      console.error('Error fetching travelers:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [auth?.currentUser, filters, searchTerm, lastVisible]);

  useEffect(() => {
    // Reset and fetch on mount or filter change
    setLastVisible(null);
    setHasMore(true);
    fetchTravelers(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.currentUser, filters, searchTerm]);

  if (!auth?.currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-primary/5 py-12 border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-headline text-foreground">
            Discover Travelers
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Find your next travel buddy, join existing trips, and explore the world together. 
            Connect with verified travelers heading to your dream destinations.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <DiscoverFilters 
          filters={filters} 
          setFilters={setFilters} 
          onSearch={setSearchTerm} 
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <>
            <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger staggerChildren={0.05}>
              {users.map(user => (
                <ScrollRevealItem key={user.uid}>
                  <TravelerCard user={user} />
                </ScrollRevealItem>
              ))}
            </ScrollReveal>
            
            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => fetchTravelers(true)}
                  disabled={loadingMore}
                  className="rounded-full px-8"
                >
                  {loadingMore ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  Load More Travelers
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative w-64 h-64 mb-8 opacity-80">
              <Image 
                src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=600" 
                alt="No travelers found" 
                fill 
                className="object-cover rounded-full grayscale mix-blend-multiply opacity-50"
              />
            </div>
            <h2 className="text-2xl font-bold font-headline mb-2">No travelers found</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find any travelers matching your exact filters right now. 
              Try adjusting your search criteria or explore another destination!
            </p>
            <Button onClick={() => { setFilters({}); setSearchTerm(''); }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
