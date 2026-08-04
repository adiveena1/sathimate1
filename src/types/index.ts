// Main types and interfaces for Sathimate Onboarding Flow

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TravelerProfile {
  userId: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  city: string;
  country: string;
  destination: string;
  travelDates: {
    start: Date;
    end: Date;
  };
  travelStyle: TravelStyle[];
  interests: Interest[];
  bio: string;
  photoURL: string;
  languages: Language[];
  createdAt: Date;
  updatedAt: Date;
  isProfileComplete: boolean;
}

export type TravelStyle = 
  | 'budget'
  | 'luxury'
  | 'backpacking'
  | 'adventure'
  | 'family'
  | 'solo'
  | 'group';

export type Interest =
  | 'nature'
  | 'food'
  | 'mountains'
  | 'temples'
  | 'cafes'
  | 'beaches'
  | 'culture'
  | 'nightlife'
  | 'photography'
  | 'history';

export type Language =
  | 'english'
  | 'hindi'
  | 'spanish'
  | 'french'
  | 'german'
  | 'mandarin'
  | 'japanese'
  | 'portuguese'
  | 'italian'
  | 'korean';

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: Date;
  updatedAt: Date;
  connectedAt?: Date;
}

export interface Chat {
  id: string;
  connectionId: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  readAt?: Date;
}

export interface SearchFilters {
  destination?: string;
  dateStart?: Date;
  dateEnd?: Date;
  travelStyle?: TravelStyle[];
  interests?: Interest[];
  genderPreference?: 'male' | 'female' | 'other' | 'any';
  ageMin?: number;
  ageMax?: number;
}

export interface OnboardingStep {
  step: number;
  title: string;
  completed: boolean;
}

export interface TravelGroup {
  id?: string;
  creatorId: string;
  destination: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  groupSize: number;
  maxGroupSize: number;
  groupType: 'Budget' | 'Backpacking' | 'Luxury' | 'Local Explore';
  description: string;
  safetyPref: 'Any' | 'Women-Only';
  members: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'cancelled';
}
