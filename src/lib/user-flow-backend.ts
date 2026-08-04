'use client';

import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  addDoc as firestoreAddDoc,
  serverTimestamp,
  Timestamp,
  type Firestore,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/config';

// Safely get Firestore instance
let dbInstance: Firestore | null = null;

function getDb(): Firestore {
  if (!dbInstance) {
    const { db } = initializeFirebase();
    dbInstance = db;
  }
  return dbInstance;
}

/**
 * USER FLOW TYPES
 */

export interface UserProfile {
  uid: string;
  email?: string;
  phone?: string;
  fullName?: string;
  age?: number;
  city?: string;
  state?: string;
  bio?: string;
  profilePhoto?: string;
  status: 'active' | 'inactive';
  onboardingCompleted: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface TravelPlan {
  travel_id: string;
  user_id: string;
  source: string;
  destination: string;
  date: string;
  interests: string[];
  status: 'active' | 'inactive';
  createdAt: Timestamp | Date;
}

export interface MatchedTraveler {
  uid: string;
  fullName: string;
  city: string;
  state: string;
  bio: string;
  travelPlan: TravelPlan;
  matchScore: number;
}

/**
 * CREATE OR GET USER PROFILE AFTER LOGIN
 */
export async function createOrGetUserProfile(
  uid: string,
  email?: string,
  phone?: string
): Promise<UserProfile> {
  try {
    if (!uid) {
      throw new Error('User ID is required');
    }

    const db = getDb();
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }

    // Create new user document
    const newUser: UserProfile = {
      uid,
      email,
      phone,
      status: 'active',
      onboardingCompleted: false,
      createdAt: serverTimestamp() as unknown as Timestamp,
      updatedAt: serverTimestamp() as unknown as Timestamp,
    };

    await setDoc(userRef, newUser);
    return newUser;
  } catch (error: any) {
    console.error('Error creating/getting user profile:', error);
    throw new Error(error.message || 'Failed to create user profile');
  }
}

/**
 * UPDATE USER PROFILE (ONBOARDING)
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  try {
    if (!uid) {
      throw new Error('User ID is required');
    }

    const db = getDb();
    const userRef = doc(db, 'users', uid);

    // Add updatedAt timestamp
    const dataToUpdate = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userRef, dataToUpdate);

    // Return updated user
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      throw new Error('User profile not found after update');
    }

    return userSnap.data() as UserProfile;
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw new Error(error.message || 'Failed to update user profile');
  }
}

/**
 * MARK ONBOARDING AS COMPLETE
 */
export async function completeOnboarding(uid: string): Promise<void> {
  try {
    if (!uid) {
      throw new Error('User ID is required');
    }

    await updateUserProfile(uid, {
      onboardingCompleted: true,
    });
  } catch (error: any) {
    console.error('Error completing onboarding:', error);
    throw new Error(error.message || 'Failed to complete onboarding');
  }
}

/**
 * CHECK IF USER PROFILE IS COMPLETE
 */
export async function isProfileComplete(uid: string): Promise<boolean> {
  try {
    if (!uid) {
      return false;
    }

    const db = getDb();
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return false;
    }

    const user = userSnap.data() as UserProfile;
    return (
      user.onboardingCompleted === true &&
      !!user.fullName &&
      !!user.age &&
      !!user.city &&
      !!user.state
    );
  } catch (error) {
    console.error('Error checking profile:', error);
    return false;
  }
}

/**
 * GET USER PROFILE
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    if (!uid) {
      return null;
    }

    const db = getDb();
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return userSnap.data() as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * CREATE TRAVEL PLAN
 */
export async function createTravelPlan(
  uid: string,
  plan: Omit<TravelPlan, 'travel_id' | 'createdAt' | 'user_id'>
): Promise<TravelPlan> {
  try {
    if (!uid) {
      throw new Error('User ID is required');
    }

    if (!plan.source || !plan.destination || !plan.date) {
      throw new Error('Source, destination, and date are required');
    }

    const db = getDb();
    const travelPlansRef = collection(db, 'travelPlans');

    const newPlan = {
      ...plan,
      user_id: uid,
      status: 'active' as const,
      createdAt: serverTimestamp(),
    };

    const docRef = await firestoreAddDoc(travelPlansRef, newPlan);

    const createdPlan: TravelPlan = {
      ...newPlan,
      travel_id: docRef.id,
      createdAt: new Date(),
    } as TravelPlan;

    return createdPlan;
  } catch (error: any) {
    console.error('Error creating travel plan:', error);
    throw new Error(error.message || 'Failed to create travel plan');
  }
}

/**
 * GET USER TRAVEL PLANS
 */
export async function getUserTravelPlans(uid: string): Promise<TravelPlan[]> {
  try {
    if (!uid) {
      return [];
    }

    const db = getDb();
    const q = query(
      collection(db, 'travelPlans'),
      where('user_id', '==', uid),
      where('status', '==', 'active')
    );

    const querySnapshot = await getDocs(q);
    const plans: TravelPlan[] = [];

    querySnapshot.forEach((doc) => {
      plans.push({
        ...doc.data(),
        travel_id: doc.id,
      } as TravelPlan);
    });

    return plans;
  } catch (error) {
    console.error('Error getting travel plans:', error);
    return [];
  }
}

/**
 * FIND MATCHING TRAVELERS (REAL MATCHING LOGIC)
 */
export async function findMatchingTravelers(
  uid: string
): Promise<MatchedTraveler[]> {
  try {
    if (!uid) {
      return [];
    }

    // Get user's travel plans
    const userPlans = await getUserTravelPlans(uid);

    if (userPlans.length === 0) {
      return [];
    }

    const userPlan = userPlans[0];
    const matches: MatchedTraveler[] = [];

    // Query for plans with same source and destination
    const db = getDb();
    const q = query(
      collection(db, 'travelPlans'),
      where('source', '==', userPlan.source),
      where('destination', '==', userPlan.destination),
      where('status', '==', 'active')
    );

    const querySnapshot = await getDocs(q);
    const userIds = new Set<string>();

    querySnapshot.forEach((doc) => {
      const plan = doc.data() as TravelPlan;
      if (plan.user_id !== uid) {
        userIds.add(plan.user_id);
      }
    });

    // Fetch profiles and calculate scores
    for (const matchUserId of userIds) {
      try {
        const profile = await getUserProfile(matchUserId);
        const matchPlans = await getUserTravelPlans(matchUserId);

        if (profile && matchPlans.length > 0) {
          const matchScore = calculateMatchScore(userPlan, matchPlans[0]);

          if (matchScore > 0) {
            matches.push({
              uid: matchUserId,
              fullName: profile.fullName || 'Traveler',
              city: profile.city || '',
              state: profile.state || '',
              bio: profile.bio || '',
              travelPlan: matchPlans[0],
              matchScore,
            });
          }
        }
      } catch (err) {
        // Skip if profile fetch fails
        continue;
      }
    }

    // Sort by match score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    return matches;
  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
}

/**
 * MATCH SCORE CALCULATION
 */
function calculateMatchScore(plan1: TravelPlan, plan2: TravelPlan): number {
  let score = 0;

  // Source match (20 points)
  if (plan1.source.toLowerCase() === plan2.source.toLowerCase()) {
    score += 20;
  }

  // Destination match (30 points)
  if (plan1.destination.toLowerCase() === plan2.destination.toLowerCase()) {
    score += 30;
  }

  // Date proximity (20 points) - within 7 days
  try {
    const date1 = new Date(plan1.date);
    const date2 = new Date(plan2.date);
    const daysDiff = Math.abs(
      Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24))
    );

    if (daysDiff <= 7) {
      score += Math.max(0, 20 - daysDiff * 2);
    }
  } catch {
    // Invalid date
  }

  // Interest overlap (30 points)
  const commonInterests = plan1.interests.filter((interest) =>
    plan2.interests.includes(interest)
  );

  if (commonInterests.length > 0) {
    score += Math.min(30, commonInterests.length * 10);
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * HELPER: GET ALL USERS (for debugging)
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const db = getDb();
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: UserProfile[] = [];

    querySnapshot.forEach((doc) => {
      users.push({
        ...doc.data(),
        uid: doc.id,
      } as UserProfile);
    });

    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

/**
 * HELPER: GET ALL TRAVEL PLANS (for debugging)
 */
export async function getAllTravelPlans(): Promise<TravelPlan[]> {
  try {
    const db = getDb();
    const querySnapshot = await getDocs(collection(db, 'travelPlans'));
    const plans: TravelPlan[] = [];

    querySnapshot.forEach((doc) => {
      plans.push({
        ...doc.data(),
        travel_id: doc.id,
      } as TravelPlan);
    });

    return plans;
  } catch (error) {
    console.error('Error getting all plans:', error);
    return [];
  }
}
