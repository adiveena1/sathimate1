// Firebase service functions for Sathimate backend
// Centralized functions for all database operations

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
  addDoc,
  Timestamp,
  WriteBatch,
  writeBatch,
  Query,
  QueryConstraint,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/firebase/config-client';
import {
  UserProfile,
  TravelPlan,
  TravelPlanFormData,
  TravelGroup,
  TravelGroupFormData,
  MatchedTraveler,
  MatchCriteria,
} from '@/types/backend';

// ============================================
// USER PROFILE SERVICES
// ============================================

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    const data = userSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function createOrUpdateUserProfile(
  uid: string,
  profileData: Partial<UserProfile>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    const timestamp = Timestamp.now();
    const dataToSave = {
      ...profileData,
      uid,
      updatedAt: timestamp,
      ...(profileData.email && { email: profileData.email }),
    };
    
    if (userSnap.exists()) {
      // Update existing profile
      await updateDoc(userRef, {
        ...dataToSave,
        createdAt: userSnap.data().createdAt, // preserve original createdAt
      });
    } else {
      // Create new profile
      await setDoc(userRef, {
        ...dataToSave,
        createdAt: timestamp,
      });
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw error;
  }
}

export async function updateOnboardingStep(
  uid: string,
  step: number,
  profileData?: Partial<UserProfile>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const updateData: any = {
      onboardingStep: step,
      updatedAt: Timestamp.now(),
    };
    
    // If all steps completed, mark profile as complete
    if (step >= 4) {
      updateData.isProfileComplete = true;
    }
    
    // Merge in any additional profile data
    if (profileData) {
      Object.assign(updateData, profileData);
    }
    
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Error updating onboarding step:', error);
    throw error;
  }
}

// ============================================
// TRAVEL PLAN SERVICES
// ============================================

export async function getTravelPlan(uid: string): Promise<TravelPlan | null> {
  try {
    const plansRef = collection(db, 'travelPlans');
    const q = query(plansRef, where('uid', '==', uid), limit(1));
    const querySnap = await getDocs(q);
    
    if (querySnap.empty) {
      return null;
    }
    
    const data = querySnap.docs[0].data();
    return {
      id: querySnap.docs[0].id,
      ...data,
      departureDate: data.departureDate?.toDate?.() || new Date(),
      returnDate: data.returnDate?.toDate?.() || undefined,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as TravelPlan;
  } catch (error) {
    console.error('Error fetching travel plan:', error);
    throw error;
  }
}

export async function createOrUpdateTravelPlan(
  uid: string,
  planData: TravelPlanFormData
): Promise<string> {
  try {
    // First, try to get existing plan
    const existingPlan = await getTravelPlan(uid);
    
    const timestamp = Timestamp.now();
    const dataToSave = {
      ...planData,
      uid,
      departureDate: planData.departureDate instanceof Date
        ? Timestamp.fromDate(planData.departureDate)
        : planData.departureDate,
      returnDate: planData.returnDate
        ? (planData.returnDate instanceof Date
          ? Timestamp.fromDate(planData.returnDate)
          : planData.returnDate)
        : null,
      updatedAt: timestamp,
    };
    
    if (existingPlan?.id) {
      // Update existing plan
      const planRef = doc(db, 'travelPlans', existingPlan.id);
      await updateDoc(planRef, {
        ...dataToSave,
        createdAt: Timestamp.fromDate(existingPlan.createdAt),
      });
      return existingPlan.id;
    } else {
      // Create new plan
      const plansRef = collection(db, 'travelPlans');
      const docRef = await addDoc(plansRef, {
        ...dataToSave,
        createdAt: timestamp,
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error creating/updating travel plan:', error);
    throw error;
  }
}

// ============================================
// TRAVEL GROUP SERVICES
// ============================================

export async function createTravelGroup(
  creatorId: string,
  groupData: TravelGroupFormData
): Promise<string> {
  try {
    const timestamp = Timestamp.now();
    const groupsRef = collection(db, 'groups');
    
    const dataToSave: any = {
      ...groupData,
      creatorId,
      members: [creatorId], // Creator is first member
      departureDate: groupData.departureDate instanceof Date
        ? Timestamp.fromDate(groupData.departureDate)
        : groupData.departureDate,
      returnDate: groupData.returnDate
        ? (groupData.returnDate instanceof Date
          ? Timestamp.fromDate(groupData.returnDate)
          : groupData.returnDate)
        : null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    const docRef = await addDoc(groupsRef, dataToSave);
    return docRef.id;
  } catch (error) {
    console.error('Error creating travel group:', error);
    throw error;
  }
}

export async function getTravelGroup(groupId: string): Promise<TravelGroup | null> {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (!groupSnap.exists()) {
      return null;
    }
    
    const data = groupSnap.data();
    return {
      id: groupSnap.id,
      ...data,
      departureDate: data.departureDate?.toDate?.() || new Date(),
      returnDate: data.returnDate?.toDate?.() || undefined,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    } as TravelGroup;
  } catch (error) {
    console.error('Error fetching travel group:', error);
    throw error;
  }
}

export async function joinTravelGroup(groupId: string, userId: string): Promise<void> {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (!groupSnap.exists()) {
      throw new Error('Group not found');
    }
    
    const groupData = groupSnap.data();
    
    // Check if user already in group
    if (groupData.members?.includes(userId)) {
      throw new Error('User already member of this group');
    }
    
    // Check max members
    if (groupData.members?.length >= groupData.maxMembers) {
      throw new Error('Group is full');
    }
    
    // Add user to members
    await updateDoc(groupRef, {
      members: arrayUnion(userId),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error joining travel group:', error);
    throw error;
  }
}

export async function leaveOrRemoveFromGroup(groupId: string, userId: string): Promise<void> {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    
    if (!groupSnap.exists()) {
      throw new Error('Group not found');
    }
    
    const groupData = groupSnap.data();
    
    // Cannot remove creator
    if (groupData.creatorId === userId && groupData.members.length > 1) {
      throw new Error('Creator cannot leave group with other members');
    }
    
    // Remove user from members
    await updateDoc(groupRef, {
      members: arrayRemove(userId),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error leaving travel group:', error);
    throw error;
  }
}

export async function getGroupsByUser(userId: string): Promise<TravelGroup[]> {
  try {
    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, where('members', 'array-contains', userId));
    const querySnap = await getDocs(q);
    
    return querySnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        departureDate: data.departureDate?.toDate?.() || new Date(),
        returnDate: data.returnDate?.toDate?.() || undefined,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as TravelGroup;
    });
  } catch (error) {
    console.error('Error fetching user groups:', error);
    throw error;
  }
}

export async function searchGroups(
  destination?: string,
  source?: string,
  startDate?: Date,
  endDate?: Date
): Promise<TravelGroup[]> {
  try {
    const groupsRef = collection(db, 'groups');
    const constraints: QueryConstraint[] = [
      where('status', '==', 'active'),
    ];
    
    if (destination) {
      constraints.push(where('destination', '==', destination));
    }
    if (source) {
      constraints.push(where('source', '==', source));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(20));
    
    const q = query(groupsRef, ...constraints);
    const querySnap = await getDocs(q);
    
    // Filter by date if needed
    let results = querySnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        departureDate: data.departureDate?.toDate?.() || new Date(),
        returnDate: data.returnDate?.toDate?.() || undefined,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as TravelGroup;
    });
    
    // Client-side date filtering
    if (startDate && endDate) {
      results = results.filter((group) => {
        const groupStart = group.departureDate.getTime();
        const groupEnd = group.returnDate ? group.returnDate.getTime() : groupStart;
        const filterStart = startDate.getTime();
        const filterEnd = endDate.getTime();
        
        // Check for date overlap
        return groupStart <= filterEnd && groupEnd >= filterStart;
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error searching groups:', error);
    throw error;
  }
}

// ============================================
// MATCHING & RECOMMENDATION SERVICES
// ============================================

export async function findMatchedTravelers(
  userUid: string,
  criteria?: MatchCriteria
): Promise<MatchedTraveler[]> {
  try {
    // Get the current user's travel plan
    const userPlan = await getTravelPlan(userUid);
    if (!userPlan) {
      return [];
    }
    
    // Get all other travel plans
    const plansRef = collection(db, 'travelPlans');
    const q = query(
      plansRef,
      where('uid', '!=', userUid),
      where('status', '==', 'active'),
      limit(50)
    );
    const querySnap = await getDocs(q);
    
    const matches: MatchedTraveler[] = [];
    const maxDateDiff = criteria?.maxDateDifferenceDays ?? 7;
    
    for (const planDoc of querySnap.docs) {
      const otherPlan = planDoc.data() as any;
      const matchScore = calculateMatchScore(userPlan, otherPlan, maxDateDiff);
      
      if (
        matchScore > (criteria?.minMatchScore ?? 50) ||
        (criteria?.budgetMatch === false && matchScore > 0)
      ) {
        const otherUser = await getUserProfile(otherPlan.uid);
        if (otherUser) {
          const matchReasons = getMatchReasons(userPlan, otherPlan);
          matches.push({
            uid: otherPlan.uid,
            fullName: otherUser.fullName,
            photoURL: otherUser.photoURL,
            city: otherUser.city,
            age: otherUser.age,
            bio: otherUser.bio,
            travelPlan: {
              ...otherPlan,
              departureDate: otherPlan.departureDate?.toDate?.() || new Date(),
              returnDate: otherPlan.returnDate?.toDate?.() || undefined,
              createdAt: otherPlan.createdAt?.toDate?.() || new Date(),
              updatedAt: otherPlan.updatedAt?.toDate?.() || new Date(),
            } as TravelPlan,
            matchScore,
            matchReasons,
          });
        }
      }
    }
    
    // Sort by match score descending
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Error finding matched travelers:', error);
    throw error;
  }
}

function calculateMatchScore(
  userPlan: TravelPlan,
  otherPlan: any,
  maxDateDiffDays: number
): number {
  let score = 0;
  
  // Same destination (50 points)
  if (userPlan.travelTo.toLowerCase() === otherPlan.travelTo?.toLowerCase()) {
    score += 50;
  }
  
  // Same source (20 points)
  if (userPlan.travelFrom?.toLowerCase() === otherPlan.travelFrom?.toLowerCase()) {
    score += 20;
  }
  
  // Close dates (15 points)
  const userDeptTime = new Date(userPlan.departureDate).getTime();
  const otherDeptTime = new Date(otherPlan.departureDate).getTime();
  const daysDiff = Math.abs(userDeptTime - otherDeptTime) / (1000 * 60 * 60 * 24);
  
  if (daysDiff <= maxDateDiffDays) {
    score += 15;
  }
  
  // Same budget (10 points)
  if (userPlan.budgetRange === otherPlan.budgetRange) {
    score += 10;
  }
  
  // Same travel types (5 points per match, max 5)
  const commonTypes = (userPlan.travelTypes || []).filter((type) =>
    (otherPlan.travelTypes || []).includes(type)
  );
  if (commonTypes.length > 0) {
    score += 5;
  }
  
  return Math.min(score, 100);
}

function getMatchReasons(userPlan: TravelPlan, otherPlan: any): string[] {
  const reasons: string[] = [];
  
  if (userPlan.travelTo.toLowerCase() === otherPlan.travelTo?.toLowerCase()) {
    reasons.push(`Same destination: ${userPlan.travelTo}`);
  }
  
  if (userPlan.travelFrom?.toLowerCase() === otherPlan.travelFrom?.toLowerCase()) {
    reasons.push(`Same source: ${userPlan.travelFrom}`);
  }
  
  const daysDiff = Math.abs(
    new Date(userPlan.departureDate).getTime() -
    new Date(otherPlan.departureDate).getTime()
  ) / (1000 * 60 * 60 * 24);
  
  if (daysDiff <= 3) {
    reasons.push('Similar travel dates');
  }
  
  if (userPlan.budgetRange === otherPlan.budgetRange) {
    reasons.push(`Same budget: ${userPlan.budgetRange}`);
  }
  
  const commonTypes = (userPlan.travelTypes || []).filter((type) =>
    (otherPlan.travelTypes || []).includes(type)
  );
  if (commonTypes.length > 0) {
    reasons.push(`Shared interests: ${commonTypes.join(', ')}`);
  }
  
  return reasons.slice(0, 3); // Return top 3 reasons
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createFirestoreTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

export function convertFirestoreTimestamp(timestamp: any): Date {
  return timestamp?.toDate?.() || new Date();
}
