// Types for user profile
export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  username?: string;
  age?: number | string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | string;
  city?: string;
  currentCity?: string;
  country?: string;
  bio?: string;
  phoneNumber?: string;
  photoURL?: string;
  
  // Discover Feature Fields
  verificationStatus?: 'verified' | 'unverified' | 'pending';
  visibility?: 'public' | 'private';
  destination?: string;
  travelDestination?: string; // from onboarding
  travelDate?: string | Date;
  tripDuration?: string;
  interests?: string[];
  languages?: string[];
  travelStyle?: string[]; // Backpacking, Luxury, etc.
  followers?: number;
  following?: number;
  reviews?: number;
  rating?: number;
  travelScore?: number;

  // Rich Profile Fields
  upcomingTrips?: any[];
  pastTrips?: any[];
  photos?: string[];
  visitedPlaces?: string[];
  mutualInterests?: string[];

  // Travel Info
  travelFrom?: string;
  travelTo?: string;
  travelType?: string[];
  budget?: 'budget' | 'mid-range' | 'luxury' | string;
  budgetRange?: string; // from onboarding
  groupSize?: string;
  lookingFor?: string[];
  
  // Safety & Trust
  phoneVerified?: boolean;
  emailVerified?: boolean;
  emergencyContact?: string;
  emergencyContactNumber?: string;
  
  // Metadata
  createdAt?: Date | any;
  updatedAt?: Date | any;
  isProfileComplete?: boolean;
  onboardingComplete?: boolean;
}

export type UserProfileFormData = Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>;
