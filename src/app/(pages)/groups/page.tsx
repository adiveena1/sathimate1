
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Users, Sparkles } from 'lucide-react';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { mockGroups, Group } from '@/lib/groups-data';
import { GroupCard } from '@/components/groups/GroupCard';
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getTravelGroups, getTravelerProfile } from '@/firebase/firestore';
import { useEffect } from 'react';
import { ScrollReveal, ScrollRevealItem } from '@/components/shared/ScrollReveal';

const months = [
    { value: 'all', label: 'Any Month' }, { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' }, { value: '5', label: 'May' },
    { value: '6', label: 'June' }, { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' }, { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];


function GroupsPageSkeleton() {
    return (
        <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <Skeleton className="h-12 w-2/3 mx-auto" />
                <Skeleton className="mt-4 h-6 w-1/2 mx-auto" />
            </div>
            <Skeleton className="h-48 md:h-24 w-full rounded-2xl mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-2xl" />)}
            </div>
        </div>
    );
}

export default function GroupsPage() {
    const { user, loading } = useRequireAuth();
    const [createGroupOpen, setCreateGroupOpen] = useState(false);
    const [liveGroups, setLiveGroups] = useState<Group[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [groupType, setGroupType] = useState('all');
    const [groupStatus, setGroupStatus] = useState('all');
    const [month, setMonth] = useState('all');
    const [womenOnly, setWomenOnly] = useState(false);

    useEffect(() => {
        if (!user) return;
        async function fetchGroups() {
            try {
                const tg = await getTravelGroups();
                const mappedGroups: Group[] = await Promise.all(tg.map(async (g) => {
                    const prof = await getTravelerProfile(g.creatorId).catch(() => null);
                    return {
                        id: g.id || Math.random().toString(),
                        destination: g.destination,
                        dateRange: g.dateRange,
                        members: { current: g.members?.length || 1, max: g.maxGroupSize || 4 },
                        type: g.groupType as any,
                        genderPref: g.safetyPref as any,
                        cost: { min: 500, max: 1500 }, // Fallback cost as it's not in the form
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
                // Combine with mock groups just so the page doesn't look completely empty initially, 
                // but prepend the live ones
                setLiveGroups([...mappedGroups, ...mockGroups]);
            } catch (error) {
                console.error("Failed to fetch groups", error);
                setLiveGroups(mockGroups);
            } finally {
                setIsFetching(false);
            }
        }
        fetchGroups();
    }, [user, createGroupOpen]); // Re-fetch when dialog closes so new groups appear!

    const filteredGroups = useMemo(() => {
        return liveGroups.filter(group => {
            const searchTermMatch = searchTerm.trim() === '' || group.destination.toLowerCase().includes(searchTerm.toLowerCase());
            const groupTypeMatch = groupType === 'all' || group.type === groupType;
            const groupStatusMatch = groupStatus === 'all' || group.status.toLowerCase().replace(' ', '-') === groupStatus;
            const monthMatch = month === 'all' || (group.dateRange.from.getMonth() + 1).toString() === month;
            const womenOnlyMatch = !womenOnly || group.genderPref === 'Women-Only';

            return searchTermMatch && groupTypeMatch && groupStatusMatch && monthMatch && womenOnlyMatch;
        });
    }, [searchTerm, groupType, groupStatus, month, womenOnly, liveGroups]);

    if (loading || !user || isFetching) {
        return (
            <div className="bg-background min-h-screen">
                <GroupsPageSkeleton />
            </div>
        );
    }

    return (
        <>
            <div className="bg-background min-h-screen">
                <div className="container mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
                    
                    <ScrollReveal className="text-center mb-12" stagger staggerChildren={0.2}>
                        <ScrollRevealItem>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-headline">
                            Find Your Travel Group
                        </h1>
                        </ScrollRevealItem>
                        <ScrollRevealItem>
                        <p className="mt-4 max-w-3xl mx-auto text-xl text-muted-foreground">
                            Connect with small, verified groups that match your style. Safety and compatibility first.
                        </p>
                        </ScrollRevealItem>
                    </ScrollReveal>

                    {/* Filters */}
                    <ScrollReveal>
                    <Card className="mb-12 p-4 md:p-6 shadow-sm rounded-2xl bg-card/80 backdrop-blur-sm border">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 items-end">
                            <div className="lg:col-span-2">
                                <Label htmlFor="destination">Destination</Label>
                                <div className="relative mt-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input id="destination" placeholder="Search by destination..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="group-type">Group Type</Label>
                                <Select value={groupType} onValueChange={setGroupType}>
                                    <SelectTrigger id="group-type" className="mt-1">
                                        <SelectValue placeholder="Any Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any Type</SelectItem>
                                        <SelectItem value="Budget">Budget</SelectItem>
                                        <SelectItem value="Backpacking">Backpacking</SelectItem>
                                        <SelectItem value="Luxury">Luxury</SelectItem>
                                        <SelectItem value="Local Explore">Local Explore</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="group-status">Group Status</Label>
                                <Select value={groupStatus} onValueChange={setGroupStatus}>
                                    <SelectTrigger id="group-status" className="mt-1">
                                        <SelectValue placeholder="Any Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any Status</SelectItem>
                                        <SelectItem value="planning">Planning</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="on-trip">On-Trip</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div>
                                <Label htmlFor="month">Month</Label>
                                <Select value={month} onValueChange={setMonth}>
                                    <SelectTrigger id="month" className="mt-1">
                                        <SelectValue placeholder="Any Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-center space-x-2 pb-2 lg:pb-0">
                                <Switch id="women-only" checked={womenOnly} onCheckedChange={setWomenOnly} />
                                <Label htmlFor="women-only" className="cursor-pointer">Women-Only</Label>
                            </div>
                        </div>
                    </Card>
                    </ScrollReveal>

                    {/* Community Suggestion Section (UI Mock) */}
                    <ScrollReveal>
                     <Card className="mb-12 p-6 bg-blue-50 border-blue-200 border-dashed border flex-col md:flex-row items-center justify-between gap-4 dark:bg-blue-900/20 dark:border-blue-400/30">
                        <div className='flex items-center gap-4'>
                            <div className='p-3 bg-blue-100 dark:bg-blue-400/10 rounded-full'>
                                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-white">Community Interest: Manali</h3>
                                <p className="text-blue-700 dark:text-blue-300 text-sm">12+ users are interested in a trip to Manali in September. Be the first to bring them together!</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className='mt-4 md:mt-0'>Suggest a Group</Button>
                    </Card>
                    </ScrollReveal>

                    {/* Groups Grid */}
                    <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" stagger staggerChildren={0.1}>
                      {filteredGroups.map((group) => (
                        <ScrollRevealItem key={group.id}>
                            <GroupCard group={group} />
                        </ScrollRevealItem>
                      ))}
                    </ScrollReveal>

                    {filteredGroups.length === 0 && (
                        <ScrollReveal className="text-center py-16 col-span-full">
                            <Users className="mx-auto h-12 w-12 text-slate-500" />
                            <p className="mt-4 text-lg text-slate-400">No groups match your current filters.</p>
                            <p className="text-slate-500">Why not start your own?</p>
                        </ScrollReveal>
                    )}

                    {/* CTA Section */}
                    <ScrollReveal>
                    <Card className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl shadow-xl">
                         <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
                             <div className="text-center md:text-left">
                                 <h2 className="text-3xl font-bold">Can't Find Your Perfect Group?</h2>
                                 <p className="mt-2 text-blue-100 max-w-lg">Become a creator. Start a public group and attract the right people for your journey.</p>
                             </div>
                            <Button size="lg" variant='outline' onClick={() => setCreateGroupOpen(true)} className="mt-6 md:mt-0 bg-transparent text-white border-white hover:bg-white hover:text-blue-600 transition-colors shrink-0 rounded-full">
                                <Plus className="mr-2 h-5 w-5" /> Create a Group
                            </Button>
                         </div>
                    </Card>
                    </ScrollReveal>
                </div>
            </div>
            <CreateGroupDialog open={createGroupOpen} onOpenChange={setCreateGroupOpen} />
        </>
    );
}
