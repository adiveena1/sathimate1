import { redirect } from 'next/navigation';
import { initializeFirebase } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

/**
 * BACKEND ARCHITECTURE FLOW
 * ===========================
 * This middleware manages the user onboarding flow after authentication
 * 
 * FLOW:
 * 1. User logs in via Firebase Auth
 * 2. Middleware checks if profile exists and is complete
 * 3. If incomplete → redirect to /onboarding with step indicator
 * 4. User fills profile (Step 1-2)
 * 5. User fills travel plan (Step 3)
 * 6. Backend marks profile as complete
 * 7. User redirected to /dashboard
 * 8. Dashboard shows matched travelers and groups
 */

export async function checkOnboardingStatus(uid: string): Promise<{
  isComplete: boolean;
  currentStep: number;
  needsRedirect: boolean;
  redirectTo?: string;
}> {
  try {
    const { db } = initializeFirebase();
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return {
        isComplete: false,
        currentStep: 1,
        needsRedirect: true,
        redirectTo: '/onboarding?step=1',
      };
    }

    const userData = userSnap.data();
    const currentStep = userData.onboardingStep ?? 1;
    const isComplete = userData.isProfileComplete ?? false;

    if (!isComplete) {
      return {
        isComplete: false,
        currentStep,
        needsRedirect: true,
        redirectTo: `/onboarding?step=${currentStep}`,
      };
    }

    return {
      isComplete: true,
      currentStep: 4,
      needsRedirect: false,
    };
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return {
      isComplete: false,
      currentStep: 1,
      needsRedirect: true,
      redirectTo: '/onboarding?step=1',
    };
  }
}

/**
 * BACKEND DATA FLOW EXPLANATION
 * ===============================
 * 
 * STEP 1: USER REGISTRATION
 * ├─ User signs up via /signup
 * ├─ Firebase Auth creates account
 * ├─ Middleware detects incomplete profile
 * └─ Redirects to /onboarding?step=1
 * 
 * STEP 2: PROFILE CREATION (Step 1-2)
 * ├─ User fills basic info (fullName, age, city, etc.)
 * ├─ Frontend calls: updateProfile(step1Data)
 * ├─ Backend: Updates users/{uid} with step 1 data
 * ├─ Sets onboardingStep = 1
 * ├─ User clicks "Next"
 * ├─ Frontend calls: updateProfile(step2Data)
 * ├─ Backend: Updates users/{uid} with step 2 data
 * └─ Sets onboardingStep = 2
 * 
 * STEP 3: TRAVEL PLAN CREATION (Step 3)
 * ├─ User fills travel details (from, to, dates, budget, etc.)
 * ├─ Frontend calls: updateTravelPlan(travelData)
 * ├─ Backend: Creates/Updates travelPlans/{docId} with user's UID
 * ├─ Links to users/{uid} via uid field
 * └─ Sets onboardingStep = 3
 * 
 * STEP 4: REVIEW & COMPLETE (Step 4)
 * ├─ User reviews all entered data
 * ├─ System validates all required fields present
 * ├─ User clicks "Complete"
 * ├─ Backend: Sets isProfileComplete = true
 * ├─ Sets onboardingStep = 4
 * └─ Redirects to /dashboard
 * 
 * STEP 5: DASHBOARD SETUP
 * ├─ Frontend: Calls findMatches()
 * ├─ Backend: Queries all other active travelPlans
 * ├─ Compares destination, dates, budget, travel types
 * ├─ Calculates match scores (0-100)
 * ├─ Returns top 20 matches sorted by score
 * ├─ Frontend: Calls searchGroups(destination, dates)
 * ├─ Backend: Queries groups/{groupId} with filters
 * └─ Shows recommended groups
 * 
 * STEP 6: GROUP CREATION/JOINING
 * ├─ User creates group via /groups/create
 * ├─ Backend: Creates groups/{newId}
 * ├─ Sets creatorId, members = [creatorUid]
 * ├─ User browses groups via /groups
 * ├─ Clicks "Join Group"
 * ├─ Backend: Adds user uid to members array
 * ├─ Validates: not duplicate, not full
 * └─ Updates updatedAt timestamp
 * 
 * STEP 7: DATA CONNECTIONS
 * 
 * User Document (users/{uid})
 * ├─ uid: "user123"
 * ├─ fullName: "John Doe"
 * ├─ email: "john@example.com"
 * ├─ age: 28
 * ├─ city: "Delhi"
 * ├─ country: "India"
 * ├─ onboardingStep: 4
 * ├─ isProfileComplete: true
 * └─ createdAt: Timestamp
 * 
 * Travel Plan Document (travelPlans/{docId})
 * ├─ id: "plan123"
 * ├─ uid: "user123" ← Links to user
 * ├─ travelFrom: "Delhi"
 * ├─ travelTo: "Goa"
 * ├─ departureDate: 2026-04-10
 * ├─ returnDate: 2026-04-17
 * ├─ budgetRange: "mid-range"
 * ├─ travelTypes: ["Beach", "Adventure"]
 * └─ createdAt: Timestamp
 * 
 * Group Document (groups/{groupId})
 * ├─ id: "group123"
 * ├─ creatorId: "user123" ← Who created
 * ├─ destination: "Goa"
 * ├─ source: "Delhi"
 * ├─ members: ["user123", "user456", "user789"]
 * ├─ maxMembers: 5
 * ├─ departureDate: 2026-04-10
 * ├─ budgetRange: "mid-range"
 * ├─ status: "active"
 * └─ createdAt: Timestamp
 * 
 * STEP 8: MATCHING ALGORITHM
 * 
 * When finding matches for user with plan:
 * ├─ From: Delhi, To: Goa, Dates: 10-17 Apr, Budget: mid-range
 * 
 * Query: all travelPlans where status = "active" (except own)
 * 
 * For each plan, calculate score:
 * ├─ Same destination? +50
 * ├─ Same source? +20
 * ├─ Dates within 7 days? +15
 * ├─ Same budget? +10
 * ├─ Shared travel types? +5
 * └─ Max = 100
 * 
 * Return: Top 20 by score (≥50)
 * With reasons: "Same destination", "Similar dates", etc.
 * 
 * STEP 9: ERROR HANDLING
 * 
 * All functions must handle:
 * ├─ Authentication errors → "Not authenticated"
 * ├─ Validation errors → "Required fields missing"
 * ├─ Firestore errors → "Database error"
 * ├─ Network errors → "Connection lost"
 * └─ Show user-friendly messages, never raw errors
 * 
 * STEP 10: DATA QUERIES
 * 
 * getUserProfile(uid)
 * └─ Get doc from users/{uid}
 * 
 * getTravelPlan(uid)
 * └─ Query travelPlans where uid == uid LIMIT 1
 * 
 * findMatchedTravelers(uid, criteria)
 * └─ Query travelPlans where uid != uid AND status = "active"
 * └─ Client-side matching algorithm
 * └─ Return top results
 * 
 * searchGroups(destination, dates)
 * └─ Query groups where destination == dest AND status = "active"
 * └─ Client-side date overlap check
 * └─ Return results
 * 
 * getGroupsByUser(uid)
 * └─ Query groups where members array-contains uid
 * └─ Return all user's groups
 */
