'use client';

import { Group } from '@/lib/groups-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, Users, Briefcase, Star, ShieldCheck, Check, Shield, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GroupCardProps {
    group: Group;
}

const statusConfig = {
    'Planning': { color: 'bg-blue-500', text: 'text-blue-500', Icon: Briefcase, actionText: 'Request to Join', buttonVariant: 'default', disabled: false },
    'Ready to Confirm': { color: 'bg-teal-500', text: 'text-teal-500', Icon: ShieldCheck, actionText: 'Request to Join', buttonVariant: 'default', disabled: false },
    'Confirmed': { color: 'bg-green-500', text: 'text-green-500', Icon: Check, actionText: 'Request to Join', buttonVariant: 'default', disabled: false },
    'Full': { color: 'bg-yellow-500', text: 'text-yellow-500', Icon: Users, actionText: 'Group Full', buttonVariant: 'secondary', disabled: true },
    'On-Trip': { color: 'bg-purple-500', text: 'text-purple-500', Icon: Briefcase, actionText: 'Currently Traveling', buttonVariant: 'secondary', disabled: true },
    'Completed': { color: 'bg-gray-500', text: 'text-gray-500', Icon: Check, actionText: 'Trip Completed', buttonVariant: 'outline', disabled: true },
};

const SafetyStatus = ({ group }: { group: Group }) => {
    if (group.genderPref === 'Women-Only') {
        return (
            <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400 group-hover:text-primary-foreground">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Women-first</span>
            </div>
        );
    }
    if (group.creator.isVerified) {
        return (
            <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 group-hover:text-primary-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-medium">Verified-only</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary-foreground/80">
            <Users className="h-4 w-4" />
            <span className="font-medium">Mixed</span>
        </div>
    );
};

export function GroupCard({ group }: GroupCardProps) {
    const { creator, destination, dateRange, members, type, cost, status, id } = group;
    const router = useRouter();

    // Dynamically determine the display status based on your rules
    let displayStatus: keyof typeof statusConfig = status;
    if (status === 'Planning' && members.current >= 3) {
        displayStatus = 'Ready to Confirm';
    }
    if ((status === 'Planning' || status === 'Confirmed') && members.current >= members.max) {
        displayStatus = 'Full';
    }

    const { Icon, actionText, buttonVariant, disabled } = statusConfig[displayStatus] || statusConfig['Planning'];

    const memberProgress = (members.current / members.max) * 100;

    const handleViewDetails = () => {
        router.push(`/groups/${id}`);
    };

    return (
        <Card
            className="flex flex-col h-full bg-card border rounded-2xl shadow-lg transition-all duration-300 hover:bg-primary hover:text-primary-foreground group cursor-pointer"
            onClick={handleViewDetails}
        >
            {/* Creator Info */}
            <CardHeader className="p-5 flex flex-row items-start gap-4">
                <Avatar className="h-14 w-14 border-2 border-border group-hover:border-primary-foreground/50">
                    <AvatarImage src={creator.avatarUrl} alt={creator.name} />
                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3 className="font-bold text-lg group-hover:text-primary-foreground">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1 group-hover:text-primary-foreground/80">{creator.bio}</p>
                    <div className="mt-2 space-y-2 text-xs">
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-muted-foreground group-hover:text-primary-foreground/80">
                            <div className="flex items-center gap-1.5">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{creator.rating} Rating</span>
                            </div>
                            {creator.age && <span>• {creator.age} years</span>}
                        </div>
                        <div>
                            <SafetyStatus group={group} />
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 flex-grow flex flex-col">
                <div className="space-y-4 text-sm text-muted-foreground group-hover:text-primary-foreground/80 flex-grow">
                    <h2 className="text-2xl font-bold text-card-foreground group-hover:text-primary-foreground font-headline">{destination}</h2>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                        <span>{format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                            <span className='capitalize'>{type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                            <span>₹{cost.min}-₹{cost.max}</span>
                        </div>
                    </div>

                    <div className="pt-1">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground group-hover:text-primary-foreground/80">
                                <Users className="h-4 w-4" />
                                <span>Group Members</span>
                            </div>
                            <span className="text-xs font-semibold text-card-foreground group-hover:text-primary-foreground">{members.current}/{members.max}</span>
                        </div>
                        <Progress value={memberProgress} className="h-2" />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 border-t group-hover:border-primary-foreground/20">
                <div className='w-full flex justify-between items-center'>
                    <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", statusConfig[displayStatus].text, "group-hover:text-primary-foreground")} />
                        <span className={cn("text-sm font-semibold", statusConfig[displayStatus].text, "group-hover:text-primary-foreground")}>{displayStatus}</span>
                    </div>
                    <Button
                        size="sm"
                        variant={disabled ? 'secondary' : 'default'}
                        className={cn(
                            "rounded-full",
                            !disabled && "group-hover:bg-primary-foreground/10 group-hover:text-primary-foreground"
                        )}
                        disabled={disabled}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails();
                        }}
                    >
                        View Details
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
