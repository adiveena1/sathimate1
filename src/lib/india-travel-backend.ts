/**
 * SATHIMATE INDIA-FOCUSED BACKEND SYSTEM
 * ========================================
 * 
 * Complete backend architecture for India-focused travel community platform.
 * 
 * Key Features:
 * - India cities & states as first-class fields
 * - INR budget ranges
 * - Indian travel modes (train, bus, flight, bike, car)
 * - Indian travel purposes (spiritual, adventure, nature, cultural, etc.)
 * - Real matching algorithm based on Indian routes
 * - Mobile-first design
 * - Trust & safety features
 * - Production-ready error handling
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  arrayUnion,
  arrayRemove,
  QueryConstraint,
  addDoc as firestoreAddDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/config-client';

// ============================================
// INDIA-SPECIFIC TYPES
// ============================================

export interface IndianUserProfile {
  uid: string;
  fullName: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  
  // India-specific location fields
  city: string; // e.g., "Delhi", "Bangalore"
  state: string; // e.g., "Delhi", "Karnataka"
  country?: string; // Always "India" for Sathimate
  
  // Contact details
  phoneNumber?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  bio?: string;
  profilePhoto?: string;
  
  // Trust & Safety
  emergencyContact?: string;
  emergencyContactPhone?: string;
  
  // Onboarding tracking
  onboardingStep?: number; // 1-4
  isProfileComplete?: boolean;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IndianTravelPlan {
  id: string;
  uid: string; // User who owns this plan
  
  // Source location (India-specific)
  sourceCity: string; // e.g., "Delhi"
  sourceState: string; // e.g., "Delhi"
  
  // Destination (India-specific)
  destinationCity: string; // e.g., "Goa"
  destinationState: string; // e.g., "Goa"
  
  // Travel dates
  departureDate: Timestamp;
  returnDate?: Timestamp;
  tripDays?: number; // Calculated from dates
  
  // Travel mode (Indian-specific)
  travelMode: 'train' | 'bus' | 'flight' | 'bike' | 'car'; // Common in India
  
  // Budget in INR
  budgetRangeINR: 'under-5k' | '5k-10k' | '10k-20k' | '20k-50k' | 'over-50k';
  // Actual INR values:
  // under-5k: < ₹5,000
  // 5k-10k: ₹5,000–₹10,000
  // 10k-20k: ₹10,000–₹20,000
  // 20k-50k: ₹20,000–₹50,000
  // over-50k: > ₹50,000
  
  // Trip mode
  tripMode: 'solo' | 'with_friends'; // Indian travelers typically travel solo or with friends
  preferredGroupSize?: number; // If with_friends, how many?
  
  // Travel purpose (India-specific)
  travelPurpose: (
    | 'spiritual' // Temple trips, pilgrimages
    | 'adventure' // Trekking, water sports
    | 'nature' // Hill stations, national parks
    | 'cultural' // Museums, heritage sites
    | 'weekend_trip' // Short getaway
    | 'backpacking' // Budget travel
    | 'local_exploration' // Discover nearby cities
  )[];
  
  // What they're looking for
  lookingFor: (
    | 'travel_partner' // One-on-one travel buddy
    | 'group_travel' // Join existing group
    | 'nearby_travelers' // Meet people on the way
    | 'local_guide' // Meet locals
  )[];
  
  // Status
  status: 'active' | 'completed' | 'cancelled';
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IndianTravelGroup {
  id: string;
  createdBy: string; // UID of creator
  
  // Route (India-specific)
  sourceCity: string; // e.g., "Delhi"
  sourceState: string; // e.g., "Delhi"
  destinationCity: string; // e.g., "Goa"
  destinationState: string; // e.g., "Goa"
  
  // Travel dates
  departureDate: Timestamp;
  returnDate?: Timestamp;
  tripDays?: number;
  
  // Travel mode
  travelMode: 'train' | 'bus' | 'flight' | 'bike' | 'car';
  
  // Budget
  budgetRangeINR: 'under-5k' | '5k-10k' | '10k-20k' | '20k-50k' | 'over-50k';
  
  // Travel purpose
  travelPurpose: (
    | 'spiritual'
    | 'adventure'
    | 'nature'
    | 'cultural'
    | 'weekend_trip'
    | 'backpacking'
    | 'local_exploration'
  )[];
  
  // Group details
  description: string; // What the group is about
  maxMembers: number; // Total capacity
  members: string[]; // Array of UIDs of members
  
  // Privacy
  isPrivate?: boolean; // Private: invite-only
  
  // Status
  status: 'active' | 'completed' | 'cancelled';
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IndianMatchedTraveler {
  uid: string;
  fullName: string;
  age?: number;
  gender?: string;
  city: string;
  state: string;
  bio?: string;
  profilePhoto?: string;
  travelPlan: IndianTravelPlan;
  
  // Matching score (0-100)
  matchScore: number;
  
  // Why they match (for transparency)
  matchReasons: string[];
}

// ============================================
// FIRESTORE COLLECTION STRUCTURE
// ============================================

/**
 * Firestore Collections for Sathimate India:
 * 
 * Collection: users/{uid}
 *   ├─ fullName: string
 *   ├─ email: string
 *   ├─ city: string (e.g., "Delhi")
 *   ├─ state: string (e.g., "Delhi")
 *   ├─ age: number
 *   ├─ gender: string
 *   ├─ phoneNumber: string
 *   ├─ phoneVerified: boolean
 *   ├─ emailVerified: boolean
 *   ├─ bio: string
 *   ├─ profilePhoto: string
 *   ├─ onboardingStep: number
 *   ├─ isProfileComplete: boolean
 *   ├─ createdAt: Timestamp
 *   └─ updatedAt: Timestamp
 * 
 * Collection: travelPlans/{planId}
 *   ├─ uid: string (foreign key to users)
 *   ├─ sourceCity: string
 *   ├─ sourceState: string
 *   ├─ destinationCity: string
 *   ├─ destinationState: string
 *   ├─ departureDate: Timestamp
 *   ├─ returnDate: Timestamp
 *   ├─ tripDays: number
 *   ├─ travelMode: string (train|bus|flight|bike|car)
 *   ├─ budgetRangeINR: string
 *   ├─ tripMode: string (solo|with_friends)
 *   ├─ preferredGroupSize: number
 *   ├─ travelPurpose: string[]
 *   ├─ lookingFor: string[]
 *   ├─ status: string
 *   ├─ createdAt: Timestamp
 *   └─ updatedAt: Timestamp
 * 
 * Indexes to create:
 *   - travelPlans: sourceCity + destinationCity + status
 *   - travelPlans: departureDate + status
 *   - travelPlans: budgetRangeINR + status
 * 
 * Collection: groups/{groupId}
 *   ├─ createdBy: string (uid)
 *   ├─ sourceCity: string
 *   ├─ sourceState: string
 *   ├─ destinationCity: string
 *   ├─ destinationState: string
 *   ├─ departureDate: Timestamp
 *   ├─ returnDate: Timestamp
 *   ├─ tripDays: number
 *   ├─ travelMode: string
 *   ├─ budgetRangeINR: string
 *   ├─ travelPurpose: string[]
 *   ├─ description: string
 *   ├─ maxMembers: number
 *   ├─ members: string[] (array of UIDs)
 *   ├─ isPrivate: boolean
 *   ├─ status: string
 *   ├─ createdAt: Timestamp
 *   └─ updatedAt: Timestamp
 * 
 * Indexes to create:
 *   - groups: sourceCity + destinationCity + status
 *   - groups: members (for array-contains queries)
 *   - groups: createdBy + status
 */

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

export async function getIndianUserProfile(uid: string): Promise<IndianUserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    return userSnap.data() as IndianUserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to load profile. Please try again.');
  }
}

export async function createOrUpdateIndianUserProfile(
  uid: string,
  profileData: Partial<IndianUserProfile>
): Promise<void> {
  try {
    // Validate required fields
    const requiredFields = ['fullName', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !profileData[field as keyof IndianUserProfile]);
    
    if (missingFields.length > 0) {
      throw new Error(`Please fill all required fields: ${missingFields.join(', ')}`);
    }
    
    const userRef = doc(db, 'users', uid);
    const now = Timestamp.now();
    
    const userSnap = await getDoc(userRef);
    const dataToSave = {
      ...profileData,
      uid,
      country: 'India', // Always India
      updatedAt: now,
    };
    
    if (userSnap.exists()) {
      // Update existing
      await updateDoc(userRef, {
        ...dataToSave,
        createdAt: userSnap.data().createdAt,
      });
    } else {
      // Create new
      await setDoc(userRef, {
        ...dataToSave,
        createdAt: now,
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function updateIndianOnboardingStep(
  uid: string,
  step: number,
  profileData?: Partial<IndianUserProfile>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    
    const updateData: any = {
      onboardingStep: step,
      updatedAt: Timestamp.now(),
    };
    
    if (profileData) {
      Object.assign(updateData, profileData);
    }
    
    // Check if profile is complete (all required fields filled)
    if (step === 4) {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        const hasAllFields = data.fullName && data.city && data.state && data.email;
        
        // Also check if travel plan exists
        const travelPlan = await getIndianTravelPlan(uid);
        updateData.isProfileComplete = hasAllFields && !!travelPlan;
      }
    }
    
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Error updating onboarding step:', error);
    throw new Error('Failed to update onboarding step.');
  }
}

// ============================================
// TRAVEL PLAN FUNCTIONS
// ============================================

export async function getIndianTravelPlan(uid: string): Promise<IndianTravelPlan | null> {
  try {
    const plansRef = collection(db, 'travelPlans');
    const q = query(plansRef, where('uid', '==', uid), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    return snapshot.docs[0].data() as IndianTravelPlan;
  } catch (error) {
    console.error('Error fetching travel plan:', error);
    throw new Error('Failed to load travel plan.');
  }
}

export async function createOrUpdateIndianTravelPlan(
  uid: string,
  planData: Omit<IndianTravelPlan, 'id' | 'uid' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    // Validate required fields
    const requiredFields = ['sourceCity', 'sourceState', 'destinationCity', 'destinationState', 'departureDate'];
    const missingFields = requiredFields.filter(field => !planData[field as keyof typeof planData]);
    
    if (missingFields.length > 0) {
      throw new Error(`Please fill all required fields: ${missingFields.join(', ')}`);
    }
    
    // Calculate trip days if return date is provided
    let tripDays = planData.tripDays;
    if (planData.returnDate && planData.departureDate) {
      const dept = (planData.departureDate as any).toDate?.() || new Date(planData.departureDate as any);
      const ret = (planData.returnDate as any).toDate?.() || new Date(planData.returnDate as any);
      tripDays = Math.ceil((ret.getTime() - dept.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    
    const now = Timestamp.now();
    
    // Check if plan exists
    const existingPlan = await getIndianTravelPlan(uid);
    
    if (existingPlan) {
      // Update existing
      await updateDoc(doc(db, 'travelPlans', existingPlan.id), {
        ...planData,
        tripDays,
        updatedAt: now,
      });
      return existingPlan.id;
    } else {
      // Create new
      const plansRef = collection(db, 'travelPlans');
      const docRef = await firestoreAddDoc(plansRef, {
        ...planData,
        uid,
        tripDays,
        createdAt: now,
        updatedAt: now,
        status: 'active',
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error creating/updating travel plan:', error);
    throw error;
  }
}

// ============================================
// TRAVEL GROUP FUNCTIONS
// ============================================

export async function createIndianTravelGroup(
  creatorId: string,
  groupData: Omit<IndianTravelGroup, 'id' | 'createdBy' | 'members' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    // Validate required fields
    const requiredFields = ['sourceCity', 'destinationCity', 'departureDate', 'description', 'maxMembers'];
    const missingFields = requiredFields.filter(field => !groupData[field as keyof typeof groupData]);
    
    if (missingFields.length > 0) {
      throw new Error(`Please fill all required fields: ${missingFields.join(', ')}`);
    }
    
    // Calculate trip days
    let tripDays = groupData.tripDays;
    if (groupData.returnDate && groupData.departureDate) {
      const dept = (groupData.departureDate as any).toDate?.() || new Date(groupData.departureDate as any);
      const ret = (groupData.returnDate as any).toDate?.() || new Date(groupData.returnDate as any);
      tripDays = Math.ceil((ret.getTime() - dept.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    
    const now = Timestamp.now();
    const groupsRef = collection(db, 'groups');
    
    const docRef = await firestoreAddDoc(groupsRef, {
      ...groupData,
      createdBy: creatorId,
      members: [creatorId], // Creator is first member
      tripDays,
      createdAt: now,
      updatedAt: now,
      status: 'active',
      isPrivate: groupData.isPrivate ?? false,
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
}

export async function getIndianTravelGroup(groupId: string): Promise<IndianTravelGroup | null> {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (!groupSnap.exists()) {
      return null;
    }
    
    return { id: groupId, ...groupSnap.data() } as IndianTravelGroup;
  } catch (error) {
    console.error('Error fetching group:', error);
    throw new Error('Failed to load group details.');
  }
}

export async function joinIndianTravelGroup(groupId: string, userId: string): Promise<void> {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (!groupSnap.exists()) {
      throw new Error('Group not found.');
    }
    
    const group = groupSnap.data() as IndianTravelGroup;
    
    // Check if user already in group
    if (group.members.includes(userId)) {
      throw new Error('You are already a member of this group.');
    }
    
    // Check if group is full
    if (group.members.length >= group.maxMembers) {
      throw new Error('This group is full.');
    }
    
    // Add user to group
    await updateDoc(groupRef, {
      members: arrayUnion(userId),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
}

export async function leaveIndianTravelGroup(groupId: string, userId: string): Promise<void> {
  try {
    const groupRef = doc(db, 'groups', groupId);
    
    await updateDoc(groupRef, {
      members: arrayRemove(userId),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error leaving group:', error);
    throw new Error('Failed to leave group.');
  }
}

export async function getIndianUserGroups(userId: string): Promise<IndianTravelGroup[]> {
  try {
    const groupsRef = collection(db, 'groups');
    const q = query(
      groupsRef,
      where('members', 'array-contains', userId),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IndianTravelGroup[];
  } catch (error) {
    console.error('Error fetching user groups:', error);
    throw new Error('Failed to load your groups.');
  }
}

export async function searchIndianGroups(
  sourceCity?: string,
  destinationCity?: string,
  budgetRange?: string
): Promise<IndianTravelGroup[]> {
  try {
    let constraints: QueryConstraint[] = [
      where('status', '==', 'active'),
    ];
    
    if (sourceCity) {
      constraints.push(where('sourceCity', '==', sourceCity));
    }
    
    if (destinationCity) {
      constraints.push(where('destinationCity', '==', destinationCity));
    }
    
    if (budgetRange) {
      constraints.push(where('budgetRangeINR', '==', budgetRange));
    }
    
    constraints.push(limit(50));
    
    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, ...constraints);
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IndianTravelGroup[];
  } catch (error) {
    console.error('Error searching groups:', error);
    throw new Error('Failed to search groups.');
  }
}

// ============================================
// MATCHING ALGORITHM (INDIA-SPECIFIC)
// ============================================

interface MatchCriteria {
  maxDateDifferenceDays?: number; // Default: 7 days
  minMatchScore?: number; // Default: 50/100
  maxResults?: number; // Default: 20
}

export async function findIndianMatchedTravelers(
  userId: string,
  criteria?: MatchCriteria
): Promise<IndianMatchedTraveler[]> {
  try {
    const userPlan = await getIndianTravelPlan(userId);
    if (!userPlan) {
      return [];
    }
    
    const maxDateDiff = criteria?.maxDateDifferenceDays ?? 7;
    const minScore = criteria?.minMatchScore ?? 50;
    const maxResults = criteria?.maxResults ?? 20;
    
    // Get all active travel plans except user's own
    const plansRef = collection(db, 'travelPlans');
    const q = query(
      plansRef,
      where('uid', '!=', userId),
      where('status', '==', 'active'),
      limit(100) // Get more to filter client-side
    );
    
    const snapshot = await getDocs(q);
    
    // Calculate match scores
    const matches: IndianMatchedTraveler[] = [];
    
    for (const doc of snapshot.docs) {
      const otherPlan = doc.data() as IndianTravelPlan;
      const score = calculateIndianMatchScore(userPlan, otherPlan, maxDateDiff);
      
      if (score >= minScore) {
        const otherUserProfile = await getIndianUserProfile(otherPlan.uid);
        
        if (otherUserProfile) {
          matches.push({
            uid: otherPlan.uid,
            fullName: otherUserProfile.fullName,
            age: otherUserProfile.age,
            gender: otherUserProfile.gender,
            city: otherUserProfile.city,
            state: otherUserProfile.state,
            bio: otherUserProfile.bio,
            profilePhoto: otherUserProfile.profilePhoto,
            travelPlan: otherPlan,
            matchScore: score,
            matchReasons: getIndianMatchReasons(userPlan, otherPlan),
          });
        }
      }
    }
    
    // Sort by score descending and return top results
    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxResults);
  } catch (error) {
    console.error('Error finding matched travelers:', error);
    throw new Error('Failed to find matched travelers.');
  }
}

function calculateIndianMatchScore(
  userPlan: IndianTravelPlan,
  otherPlan: IndianTravelPlan,
  maxDateDifferenceInDays: number = 7
): number {
  let score = 0;
  
  // Same destination city: +50 (most important)
  if (userPlan.destinationCity === otherPlan.destinationCity) {
    score += 50;
  }
  // Same destination state: +30
  else if (userPlan.destinationState === otherPlan.destinationState) {
    score += 30;
  }
  
  // Same source city: +20
  if (userPlan.sourceCity === otherPlan.sourceCity) {
    score += 20;
  }
  // Same source state: +10
  else if (userPlan.sourceState === otherPlan.sourceState) {
    score += 10;
  }
  
  // Dates within range: +15
  if (areDatesNearby(userPlan.departureDate, otherPlan.departureDate, maxDateDifferenceInDays)) {
    score += 15;
  }
  
  // Same budget: +10
  if (userPlan.budgetRangeINR === otherPlan.budgetRangeINR) {
    score += 10;
  }
  
  // Same travel mode: +5
  if (userPlan.travelMode === otherPlan.travelMode) {
    score += 5;
  }
  
  // Shared travel purpose: +5
  const sharedPurposes = userPlan.travelPurpose.filter(p => otherPlan.travelPurpose.includes(p));
  if (sharedPurposes.length > 0) {
    score += 5;
  }
  
  return Math.min(score, 100); // Cap at 100
}

function areDatesNearby(date1: Timestamp, date2: Timestamp, maxDaysApart: number): boolean {
  const d1 = (date1 as any).toDate?.() || new Date(date1 as any);
  const d2 = (date2 as any).toDate?.() || new Date(date2 as any);
  
  const diffMs = Math.abs(d1.getTime() - d2.getTime());
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays <= maxDaysApart;
}

function getIndianMatchReasons(userPlan: IndianTravelPlan, otherPlan: IndianTravelPlan): string[] {
  const reasons: string[] = [];
  
  if (userPlan.destinationCity === otherPlan.destinationCity) {
    reasons.push(`Same destination: ${userPlan.destinationCity}`);
  }
  
  if (userPlan.sourceCity === otherPlan.sourceCity) {
    reasons.push(`Same starting point: ${userPlan.sourceCity}`);
  }
  
  if (userPlan.budgetRangeINR === otherPlan.budgetRangeINR) {
    reasons.push(`Similar budget: ${userPlan.budgetRangeINR}`);
  }
  
  if (userPlan.travelMode === otherPlan.travelMode) {
    reasons.push(`Same travel mode: ${userPlan.travelMode}`);
  }
  
  const sharedPurposes = userPlan.travelPurpose.filter(p => otherPlan.travelPurpose.includes(p));
  if (sharedPurposes.length > 0) {
    reasons.push(`Similar interests: ${sharedPurposes.join(', ')}`);
  }
  
  return reasons.slice(0, 3); // Return top 3 reasons
}

// ============================================
// INDIA-SPECIFIC DATA & CONSTANTS
// ============================================

export const INDIAN_TRAVEL_MODES = [
  { value: 'train', label: 'Train', icon: '🚂' },
  { value: 'bus', label: 'Bus', icon: '🚌' },
  { value: 'flight', label: 'Flight', icon: '✈️' },
  { value: 'bike', label: 'Bike/Motorcycle', icon: '🏍️' },
  { value: 'car', label: 'Car', icon: '🚗' },
];

export const INDIAN_TRAVEL_PURPOSES = [
  { value: 'spiritual', label: 'Spiritual/Pilgrimage', icon: '🙏' },
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'nature', label: 'Nature & Trekking', icon: '🌿' },
  { value: 'cultural', label: 'Cultural & Heritage', icon: '🏛️' },
  { value: 'weekend_trip', label: 'Weekend Getaway', icon: '🏖️' },
  { value: 'backpacking', label: 'Backpacking', icon: '🎒' },
  { value: 'local_exploration', label: 'Local Exploration', icon: '🗺️' },
];

export const INDIAN_BUDGET_RANGES = [
  { value: 'under-5k', label: 'Under ₹5,000', color: 'green' },
  { value: '5k-10k', label: '₹5,000–₹10,000', color: 'blue' },
  { value: '10k-20k', label: '₹10,000–₹20,000', color: 'purple' },
  { value: '20k-50k', label: '₹20,000–₹50,000', color: 'orange' },
  { value: 'over-50k', label: 'Over ₹50,000', color: 'red' },
];

export const INDIAN_LOOKING_FOR = [
  { value: 'travel_partner', label: 'Travel Partner', icon: '👥' },
  { value: 'group_travel', label: 'Join a Group', icon: '👫' },
  { value: 'nearby_travelers', label: 'Meet on the way', icon: '🤝' },
  { value: 'local_guide', label: 'Meet Locals', icon: '🏘️' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function formatINRBudget(budgetKey: string): string {
  const mapping: { [key: string]: string } = {
    'under-5k': 'Under ₹5,000',
    '5k-10k': '₹5,000–₹10,000',
    '10k-20k': '₹10,000–₹20,000',
    '20k-50k': '₹20,000–₹50,000',
    'over-50k': 'Over ₹50,000',
  };
  return mapping[budgetKey] || budgetKey;
}

export function formatTravelMode(mode: string): string {
  const item = INDIAN_TRAVEL_MODES.find(m => m.value === mode);
  return item?.label || mode;
}

export function formatTravelPurpose(purpose: string): string {
  const item = INDIAN_TRAVEL_PURPOSES.find(p => p.value === purpose);
  return item?.label || purpose;
}
