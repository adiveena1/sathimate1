
import { format } from "date-fns";

export type GroupCreator = {
    id: string;
    name: string;
    age?: number;
    avatarUrl: string;
    isVerified: boolean;
    bio: string;
    rating: number;
};

export type Group = {
    id: string;
    destination: string;
    dateRange: { from: Date; to: Date };
    members: { current: number; max: number };
    type: 'Budget' | 'Backpacking' | 'Luxury' | 'Local Explore' | 'Relaxed';
    genderPref: 'Any' | 'Women-Only';
    cost: { min: number; max: number };
    status: 'Planning' | 'Confirmed' | 'On-Trip' | 'Completed' | 'Full';
    creator: GroupCreator;
};

const creators: GroupCreator[] = [
    {
        id: 'creator-1',
        name: 'Fardeen',
        age: 21,
        avatarUrl: 'https://picsum.photos/seed/creator1/200',
        isVerified: true,
        bio: 'Loves hiking and exploring new cultures. Believes in responsible and respectful travel. Looking for fellow nature lovers.',
        rating: 4.9,
    },
    {
        id: 'creator-2',
        name: 'Anurag',
        avatarUrl: 'https://picsum.photos/seed/creator2/200',
        isVerified: false,
        bio: 'Digital nomad and foodie. Always searching for the best local cuisine and coffee shops. Enjoys a flexible, relaxed pace.',
        rating: 4.7,
    },
    {
        id: 'creator-3',
        name: 'Sonu',
        age: 32,
        avatarUrl: 'https://picsum.photos/seed/creator3/200',
        isVerified: true,
        bio: 'History buff and photographer. I plan my trips around historical sites and beautiful landscapes. Early riser.',
        rating: 5.0,
    },
];

export const mockGroups: Group[] = [
    {
        id: 'group-1',
        destination: 'Spiti Valley Circuit',
        dateRange: { from: new Date('2025-08-10'), to: new Date('2025-08-22') },
        members: { current: 2, max: 6 },
        type: 'Backpacking',
        genderPref: 'Any',
        cost: { min: 400, max: 600 },
        status: 'Planning',
        creator: creators[0],
    },
    {
        id: 'group-2',
        destination: 'Kyoto Cherry Blossoms',
        dateRange: { from: new Date('2026-03-25'), to: new Date('2026-04-05') },
        members: { current: 3, max: 4 },
        type: 'Luxury',
        genderPref: 'Any',
        cost: { min: 2500, max: 4000 },
        status: 'Planning',
        creator: creators[2],
    },
    {
        id: 'group-3',
        destination: 'Weekend in Hampi',
        dateRange: { from: new Date('2025-11-08'), to: new Date('2025-11-10') },
        members: { current: 4, max: 4 },
        type: 'Local Explore',
        genderPref: 'Any',
        cost: { min: 1000, max: 2000 },
        status: 'Full',
        creator: creators[1],
    },
    {
        id: 'group-4',
        destination: 'Andaman Islands Discovery',
        dateRange: { from: new Date('2025-12-20'), to: new Date('2025-12-30') },
        members: { current: 5, max: 5 },
        type: 'Budget',
        genderPref: 'Any',
        cost: { min: 8000, max: 12000 },
        status: 'Confirmed',
        creator: creators[0],
    },
    {
        id: 'group-5',
        destination: 'Kerala Backwaters (Women-Only)',
        dateRange: { from: new Date('2026-01-15'), to: new Date('2026-01-22') },
        members: { current: 1, max: 5 },
        type: 'Relaxed',
        genderPref: 'Women-Only',
        cost: { min: 7000, max: 10000 },
        status: 'Planning',
        creator: creators[2],
    },
    {
        id: 'group-6',
        destination: 'Northern Lights in Norway',
        dateRange: { from: new Date('2026-02-10'), to: new Date('2026-02-18') },
        members: { current: 6, max: 6 },
        type: 'Luxury',
        genderPref: 'Any',
        cost: { min: 3000, max: 5000 },
        status: 'On-Trip',
        creator: creators[1],
    }
];
