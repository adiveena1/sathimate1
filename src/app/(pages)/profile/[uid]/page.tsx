'use client';

import { useParams, notFound } from 'next/navigation';
import { useDoc, useFirestore, useUser } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MapPin, ShieldCheck, User as UserIcon, Calendar, Languages, Plane, Image as ImageIcon, Send, Clock, Star, MessageSquare } from 'lucide-react';
import { UserProfile } from '@/types/profile';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function ProfilePageSkeleton() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <Skeleton className="h-[30vh] w-full" />
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
          <div className="mt-16 md:mt-4 space-y-4 flex-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const uid = params.uid as string;
  const db = useFirestore();
  const { user: currentUser } = useUser();
  const { toast } = useToast();
  
  const [requestSending, setRequestSending] = useState(false);

  const userRef = useMemo(() =>
    db && uid ? doc(db, 'users', uid) : null
  , [db, uid]);

  const { data: profile, loading } = useDoc(userRef) as { data: UserProfile | null, loading: boolean };

  if (loading) return <ProfilePageSkeleton />;
  if (!profile || profile.visibility !== 'public') return notFound();

  const handleSendRequest = async () => {
    if (!currentUser) {
      toast({ title: 'Please login', description: 'You must be logged in to send a travel request.', variant: 'destructive' });
      return;
    }
    if (!db) return;

    setRequestSending(true);
    try {
      await addDoc(collection(db, 'requests'), {
        from: currentUser.uid,
        to: uid,
        status: 'pending',
        type: 'travel_buddy',
        createdAt: serverTimestamp()
      });
      toast({ title: 'Request Sent', description: `Your travel request has been sent to ${profile.fullName || 'the traveler'}.` });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to send request.', variant: 'destructive' });
    } finally {
      setRequestSending(false);
    }
  };

  const isOwnProfile = currentUser?.uid === uid;

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Cover Image */}
      <div className="h-[30vh] md:h-[40vh] w-full bg-muted relative overflow-hidden">
        {/* Placeholder cover image based on user destination or fallback */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-blue-600/60" />
        {profile.travelDestination && (
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070')] bg-cover bg-center" />
        )}
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
            <AvatarImage src={profile.photoURL || ''} alt={profile.fullName || 'User'} className="object-cover" />
            <AvatarFallback className="text-5xl">{profile.fullName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2 mt-2 md:mt-0 md:pb-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-3xl md:text-4xl font-extrabold font-headline">{profile.fullName || 'Anonymous Traveler'}</h1>
              {profile.verificationStatus === 'verified' && (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none w-fit">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
              {profile.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {profile.city}
                </div>
              )}
              {profile.gender && (
                <div className="flex items-center gap-1 capitalize">
                  <UserIcon className="h-4 w-4" /> {profile.gender}
                </div>
              )}
              {profile.age && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {profile.age} years old
                </div>
              )}
            </div>
          </div>

          {!isOwnProfile && (
            <div className="w-full md:w-auto md:pb-4 flex shrink-0">
              <Button size="lg" className="w-full md:w-auto rounded-full font-bold shadow-lg" onClick={handleSendRequest} disabled={requestSending}>
                <Send className="mr-2 h-4 w-4" />
                {requestSending ? 'Sending...' : 'Send Travel Request'}
              </Button>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-primary/5 border-none shadow-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-primary">{profile.travelScore || 0}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Travel Score</span>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-none shadow-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-primary">{profile.followers || 0}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Followers</span>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-none shadow-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-primary">{profile.reviews || 0}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Reviews</span>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-none shadow-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-primary">{profile.pastTrips?.length || 0}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Past Trips</span>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 rounded-none h-auto">
            <TabsTrigger value="about" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-semibold">About</TabsTrigger>
            <TabsTrigger value="trips" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-semibold">Trips & Timeline</TabsTrigger>
            <TabsTrigger value="photos" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-semibold">Photos</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-semibold">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {profile.travelDestination && (
                  <Card className="bg-primary text-primary-foreground border-none">
                    <CardContent className="p-6">
                      <h3 className="font-headline text-lg font-bold flex items-center gap-2 mb-2">
                        <Plane className="w-5 h-5" /> Current Plan
                      </h3>
                      <p className="text-lg">Planning a trip to <strong>{profile.travelDestination}</strong></p>
                      <div className="flex gap-4 mt-4 text-sm opacity-90">
                        {profile.travelDate && <div className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {typeof profile.travelDate === 'string' ? profile.travelDate : 'Flexible'}</div>}
                        {profile.tripDuration && <div className="flex items-center gap-1"><Clock className="w-4 h-4"/> {profile.tripDuration}</div>}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <section>
                  <h3 className="text-xl font-bold font-headline mb-4">About Me</h3>
                  <div className="prose prose-sm md:prose-base dark:prose-invert">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {profile.bio || 'This traveler hasn\'t written a bio yet.'}
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold font-headline mb-4">Interests</h3>
                  {profile.interests && profile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map(interest => (
                        <Badge key={interest} variant="secondary" className="px-4 py-2 text-sm rounded-xl bg-secondary/50">{interest}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No interests added.</p>
                  )}
                </section>
                
                {profile.mutualInterests && profile.mutualInterests.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold font-headline mb-4 text-emerald-600 dark:text-emerald-400">Mutual Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.mutualInterests.map(interest => (
                        <Badge key={interest} variant="outline" className="px-4 py-2 text-sm rounded-xl border-emerald-500 text-emerald-600 dark:text-emerald-400">{interest}</Badge>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="space-y-6">
                <Card className="shadow-none border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Travel Style</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.travelStyle && profile.travelStyle.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.travelStyle.map(style => (
                          <Badge key={style} variant="outline" className="border-dashed">{style}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not specified</p>
                    )}
                    
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Budget Preference</p>
                      <p className="text-sm font-medium capitalize">{profile.budgetRange || profile.budget || 'Any'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2"><Languages className="w-5 h-5"/> Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile.languages && profile.languages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map(lang => (
                          <span key={lang} className="text-sm text-foreground bg-muted px-3 py-1 rounded-md">{lang}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not specified</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trips" className="mt-8">
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Travel Timeline</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Detailed timelines and trip history will appear here once the traveler logs their past adventures.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="mt-8">
            <div className="text-center py-16">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Photo Gallery</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No public photos uploaded yet.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-8">
            <div className="text-center py-16">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Traveler Reviews</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No reviews yet. Travel with {profile.fullName?.split(' ')[0] || 'them'} to leave the first review!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
