
import { Timestamp } from "firebase/firestore";

export type SathiUser = {
    uid: string;
    displayName: string;
    username?: string;
    email?: string;
    photoURL?: string;
    city?: string;
    verified?: boolean;
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    createdAt: Timestamp;
    bio?: string;
    interests?: string[];
    trustScore?: number;
};

export type SathiPlan = {
    id: string;
    createdBy: string;
    creator: { // Denormalized for easy display
        name: string;
        photoURL?: string;
    };
    destination: string;
    fromCity: string;
    startDate: Timestamp;
    endDate: Timestamp;
    budget: 'low' | 'mid' | 'premium';
    interests: string[];
    groupSizeMin: number;
    groupSizeMax: number;
    groupType: 'mixed' | 'women-only';
    description: string;
    status: 'open' | 'closed';
    createdAt: Timestamp;
};

export type SathiGroup = {
    id: string;
    planId: string;
    createdBy: string;
    title: string;
    destination: string;
    startDate: Timestamp;
    endDate: Timestamp;
    members: string[]; // array of uids
    admins: string[]; // array of uids
    groupType: 'mixed' | 'women-only';
    status: 'active' | 'completed';
    createdAt: Timestamp;
    lastActivityAt: Timestamp;
};

export type SathiGroupRequest = {
    id: string;
    type: 'plan' | 'group';
    targetId: string; // planId or groupId
    fromUid: string;
    toUid: string;
    message?: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Timestamp;
};

export type SathiDiscussion = {
    id: string;
    createdBy: string;
    category: 'destination' | 'general' | 'tips';
    title: string;
    text: string;
    tags: string[];
    createdAt: Timestamp;
    likesCount: number;
    commentsCount: number;
};

export type SathiComment = {
    id: string;
    uid: string;
    text: string;
    createdAt: Timestamp;
};

export type SathiReport = {
    id: string;
    reportedBy: string;
    reportedUser: string;
    reason: string;
    contextType: 'plan' | 'group' | 'discussion' | 'comment' | 'user';
    contextId: string;
    createdAt: Timestamp;
    status: 'open' | 'closed' | 'resolved';
};
