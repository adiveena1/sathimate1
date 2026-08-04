'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { getTravelGroup, addMemberToGroup, updateTravelGroup } from '@/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { TravelGroup } from '@/types';
import { format } from 'date-fns';
import { Calendar, Users, DollarSign, MapPin, ArrowLeft, Share2, Edit2, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getTravelerProfile } from '@/firebase/firestore';

function GroupDetailSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-24 mb-8" />
            <Skeleton className="h-96 w-full rounded-2xl mb-8" />
            <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
    );
}

export default function GroupDetailPage() {
    const { user, loading: authLoading } = useRequireAuth();
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const auth = useAuth();
    
    const groupId = params.id as string;
    const [group, setGroup] = useState<TravelGroup | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [creatorProfile, setCreatorProfile] = useState<any>(null);
    
    const isCreator = group?.creatorId === user?.uid;
    const isAlreadyMember = group?.members?.includes(user?.uid || '') || false;

    useEffect(() => {
        if (!user) return;

        async function fetchGroup() {
            try {
                const fetchedGroup = await getTravelGroup(groupId);
                if (!fetchedGroup) {
                    toast({
                        variant: 'destructive',
                        title: 'Group Not Found',
                        description: 'The group you are looking for does not exist.',
                    });
                    router.push('/groups');
                    return;
                }
                setGroup(fetchedGroup);

                // Fetch creator profile
                try {
                    const profile = await getTravelerProfile(fetchedGroup.creatorId);
                    setCreatorProfile(profile);
                } catch (err) {
                    console.error('Failed to fetch creator profile:', err);
                }
            } catch (error) {
                console.error('Failed to fetch group:', error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to load group details.',
                });
            } finally {
                setLoading(false);
            }
        }

        fetchGroup();
    }, [groupId, user, toast, router]);

    async function handleJoinGroup() {
        if (!auth?.currentUser?.uid || !group?.id) return;

        setJoining(true);
        try {
            await addMemberToGroup(group.id, auth.currentUser.uid);
            toast({
                title: 'Success!',
                description: 'You have joined the group.',
            });
            // Refresh group data
            const updatedGroup = await getTravelGroup(groupId);
            setGroup(updatedGroup);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to join group.';
            toast({
                variant: 'destructive',
                title: 'Error',
                description: errorMessage,
            });
            console.error('Failed to join group:', error);
        } finally {
            setJoining(false);
        }
    }

    async function handleDeleteGroup() {
        if (!group?.id) return;
        
        const confirmed = window.confirm('Are you sure you want to delete this group? This action cannot be undone.');
        if (!confirmed) return;

        try {
            await updateTravelGroup(group.id, { status: 'cancelled' });
            toast({
                title: 'Success!',
                description: 'Group has been deleted.',
            });
            router.push('/groups');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete group.';
            toast({
                variant: 'destructive',
                title: 'Error',
                description: errorMessage,
            });
            console.error('Failed to delete group:', error);
        }
    }

    if (authLoading || loading) {
        return <GroupDetailSkeleton />;
    }

    if (!group) {
        return null;
    }

    const memberProgress = (group.members.length / group.maxGroupSize) * 100;
    const isFull = group.members.length >= group.maxGroupSize;

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 pl-0 hover:pl-0"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                {/* Header with Actions */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-bold font-headline mb-2">{group.destination}</h1>
                        <p className="text-muted-foreground">
                            Created by {creatorProfile?.fullName || 'Traveler'} • Status: {group.status}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isCreator && (
                            <>
                                <Button variant="outline" size="sm" disabled>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDeleteGroup}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </>
                        )}
                        <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Trip Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Trip Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Travel Dates</p>
                                        <p className="font-medium">
                                            {format(group.dateRange.from, 'MMM d, yyyy')} - {format(group.dateRange.to, 'MMM d, yyyy')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Destination</p>
                                        <p className="font-medium">{group.destination}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Budget Range</p>
                                        <p className="font-medium">₹0 - ₹0</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About This Trip</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground">{group.description}</p>
                            </CardContent>
                        </Card>

                        {/* Trip Style */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Trip Style</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Group Type</p>
                                    <p className="font-medium text-lg capitalize">{group.groupType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Safety Preference</p>
                                    <p className="font-medium text-lg">{group.safetyPref}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Creator & CTA */}
                    <div className="space-y-6">
                        {/* Creator Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Group Creator</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={creatorProfile?.photoURL} alt={creatorProfile?.fullName} />
                                        <AvatarFallback>{creatorProfile?.fullName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{creatorProfile?.fullName || 'Traveler'}</p>
                                        <p className="text-sm text-muted-foreground">{creatorProfile?.age || '—'} years</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{creatorProfile?.bio || 'No bio provided'}</p>
                            </CardContent>
                        </Card>

                        {/* Members Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Group Members
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">
                                            {group.members.length}/{group.maxGroupSize} members
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {isFull ? 'Full' : `${group.maxGroupSize - group.members.length} spots left`}
                                        </span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all"
                                            style={{ width: `${memberProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Join Button */}
                        {!isCreator && (
                            <Button
                                onClick={handleJoinGroup}
                                disabled={isFull || isAlreadyMember || joining}
                                size="lg"
                                className="w-full"
                            >
                                {joining ? 'Joining...' : isAlreadyMember ? 'Already a Member' : isFull ? 'Group Full' : 'Join Group'}
                            </Button>
                        )}

                        {isCreator && (
                            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                                <CardContent className="pt-6">
                                    <p className="text-sm text-blue-900 dark:text-blue-100">
                                        ✓ You are the creator of this group
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
