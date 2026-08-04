// Complete Sathimate backend types and interfaces

// ============================================
// USER & PROFILE TYPES
// ============================================

export interface UserAccount {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  city?: string;
  country?: string;
  bio?: string;
  phoneNumber?: string;
  photoURL?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  emergencyContact?: string;
  emergencyContactNumber?: string;
  onboardingStep?: number; // 1-4 for multi-step flow
  isProfileComplete?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// TRAVEL PLAN TYPES
// ============================================

export interface TravelPlan {
  id: string;
  uid: string; // user who owns this plan
  travelFrom: string;
  travelTo: string;
  departureDate: Date;
  returnDate?: Date;
  tripDays?: number;
  budgetRange: 'budget' | 'mid-range' | 'luxury';
  tripMode: 'solo' | 'with_friends' | 'group';
  preferredGroupSize?: number;
  travelTypes: string[]; // Adventure, Cultural, Beach, etc.
  lookingFor?: string[]; // Travel Partner, Group, Co-traveler, etc.
  preferences?: string[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Form data type for travel plan creation
export type TravelPlanFormData = Omit<TravelPlan, 'id' | 'uid' | 'createdAt' | 'updatedAt'>;

// ============================================
// TRAVEL GROUP TYPES
// ============================================

export interface TravelGroup {
  id: string;
  creatorId: string; // uid of group creator
  destination: string;
  source: string; // where group is traveling from
  departureDate: Date;
  returnDate?: Date;
  tripDays?: number;
  budgetRange: 'budget' | 'mid-range' | 'luxury';
  description: string;
  maxMembers: number;
  travelTypes: string[];
  members: string[]; // array of uids
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export type TravelGroupFormData = Omit<TravelGroup, 'id' | 'creatorId' | 'members' | 'createdAt' | 'updatedAt'>;

// ============================================
// MATCHING & RECOMMENDATION TYPES
// ============================================

export interface MatchedTraveler {
  uid: string;
  fullName: string;
  photoURL?: string;
  city?: string;
  age?: number;
  bio?: string;
  travelPlan: TravelPlan;
  matchScore: number; // 0-100 based on similarity
  matchReasons: string[]; // e.g., "Same destination", "Similar dates", etc.
}

export interface MatchCriteria {
  maxDateDifferenceDays?: number; // How many days apart is acceptable
  budgetMatch?: boolean; // Must be exact match
  minMatchScore?: number; // Minimum match score (0-100)
}

// ============================================
// CONNECTION & MESSAGING TYPES
// ============================================

export interface UserConnection {
  id: string;
  userId1: string;
  userId2: string;
  status: 'pending' | 'accepted' | 'blocked';
  initiatedBy: string; // uid who started the connection
  createdAt: Date;
  updatedAt: Date;
}

export interface UserChat {
  id: string;
  participants: string[]; // array of 2 uids
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  createdAt: Date;
}

// ============================================
// FIRESTORE COLLECTION STRUCTURE
// ============================================

/*
FIRESTORE COLLECTIONS STRUCTURE:

1. users/{uid}
   - UserProfile document for each authenticated user
   
2. travelPlans/{docId}
   - TravelPlan documents (one per user trip)
   - indexed by uid for querying
   
3. groups/{groupId}
   - TravelGroup documents
   - indexed by creatorId, destination, dates for searching
   
4. matches/{docId}
   - MatchedTraveler cache for quick lookups
   - Regenerated when user updates travel plan
   
5. connections/{connectionId}
   - UserConnection documents for tracking friendships
   
6. chats/{chatId}
   - UserChat documents for conversations
   
7. messages/{chatId}/messages/{messageId}
   - Individual message documents as subcollection
*/
