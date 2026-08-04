'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { getTravelGroups, getTravelerProfile } from '@/firebase/firestore';
import { TravelGroup } from '@/types';
import { useRouter } from 'next/navigation';
import { GroupCard } from '@/components/groups/GroupCard';
import { mockGroups, Group } from '@/lib/groups-data';
import { format } from 'date-fns';
import { Users, Briefcase, Calendar, Plus, ArrowRight } from 'lucide-react';
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal';

function MyGroupsSkeleton() {
    return (
        <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <Skeleton className="h-12 w-2/3 mx-auto" />
                <Skeleton className="mt-4 h-6 w-1/2 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-2xl" />)}
            </div>
        </div>
    );
}

export default function MyGroupsPage() {
    const { user, loading: authLoading } = useRequireAuth();
    const router = useRouter();
    const [createdGroups, setCreatedGroups] = useState<Group[]>([]);
    const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function fetchMyGroups() {
            try {
                const allGroups = await getTravelGroups();
                
                // Map Firestore groups to UI Group type
                const mappedGroups: Group[] = await Promise.all(allGroups.map(async (g) => {
                    const prof = await getTravelerProfile(g.creatorId).catch(() => null);
                    return {
                        id: g.id || Math.random().toString(),
                        destination: g.destination,
                        dateRange: g.dateRange,
                        members: { current: g.members?.length || 1, max: g.maxGroupSize || 4 },
                        type: g.groupType as any,
                        genderPref: g.safetyPref as any,
                        cost: { min: 500, max: 1500 },
                        status: g.status === 'active' ? 'Planning' : g.status === 'completed' ? 'Completed' : 'Planning',
                        creator: {
                            id: g.creatorId,
                            name: prof?.fullName || 'Traveler',
                            age: prof?.age,
                            avatarUrl: prof?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${g.creatorId}`,
                            isVerified: true,
                            bio: prof?.bio || g.description || 'Ready for an adventure!',
                            rating: 5.0,
                        }
                    };
                }));

                // Separate created vs joined groups
                const created = mappedGroups.filter(g => g.creator.id === user?.uid);
                const joined = mappedGroups.filter(g => g.creator.id !== user?.uid && g.members.current > 0);

                setCreatedGroups(created);
                setJoinedGroups(joined);
            } catch (error) {
                console.error('Failed to fetch my groups:', error);
                setCreatedGroups([]);
                setJoinedGroups([]);
            } finally {
                setLoading(false);
            }
        }

        fetchMyGroups();
    }, [user]);

    if (authLoading || loading) {
        return <MyGroupsSkeleton />;
    }

    const totalGroups = createdGroups.length + joinedGroups.length;
    const totalMembers = createdGroups.reduce((acc, g) => acc + g.members.current, 0) +
                         joinedGroups.reduce((acc, g) => acc + g.members.current, 0);

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <ScrollReveal className="mb-16">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-headline">
                            My Travel Groups
                        </h1>
                        <p className="mt-4 max-w-3xl mx-auto text-xl text-muted-foreground">
                            Manage your travel community and adventures
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Total Groups</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalGroups}</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-purple-900 dark:text-purple-100">Created</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{createdGroups.length}</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950 dark:to-emerald-900/50 border-emerald-200 dark:border-emerald-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-emerald-900 dark:text-emerald-100">Joined</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{joinedGroups.length}</div>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollReveal>

                {/* Created Groups */}
                {createdGroups.length > 0 && (
                    <ScrollReveal className="mb-16">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-full">
                                    <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Created by You</h2>
                                    <p className="text-sm text-muted-foreground">{createdGroups.length} group{createdGroups.length !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {createdGroups.map((group) => (
                                    <GroupCard key={group.id} group={group} />
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                )}

                {/* Joined Groups */}
                {joinedGroups.length > 0 && (
                    <ScrollReveal className="mb-16">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-950 rounded-full">
                                    <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Joined</h2>
                                    <p className="text-sm text-muted-foreground">{joinedGroups.length} group{joinedGroups.length !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {joinedGroups.map((group) => (
                                    <GroupCard key={group.id} group={group} />
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                )}

                {/* Empty State */}
                {totalGroups === 0 && (
                    <ScrollReveal className="text-center py-16">
                        <div className="mb-6">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-muted rounded-full">
                                    <Users className="h-8 w-8 text-muted-foreground" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No Groups Yet</h3>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                Start your journey by creating or joining a travel group. Find your perfect travel companions!
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button onClick={() => router.push('/groups')} variant="outline">
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    Browse Groups
                                </Button>
                                <Button onClick={() => router.push('/groups')} className="bg-gradient-to-r from-blue-600 to-cyan-500">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Group
                                </Button>
                            </div>
                        </div>
                    </ScrollReveal>
                )}
            </div>
        </div>
    );
}
