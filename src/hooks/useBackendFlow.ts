'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/firebase';
import {
  getUserProfile,
  createOrUpdateUserProfile,
  updateOnboardingStep,
  getTravelPlan,
  createOrUpdateTravelPlan,
  findMatchedTravelers,
} from '@/lib/firebase-service';
import { UserProfile, TravelPlan, TravelPlanFormData, MatchedTraveler } from '@/types/backend';

export interface UseOnboardingState {
  currentStep: number;
  profile: UserProfile | null;
  travelPlan: TravelPlan | null;
  loading: boolean;
  error: string | null;
  isComplete: boolean;
}

export function useOnboarding(): UseOnboardingState & {
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateTravelPlan: (data: TravelPlanFormData) => Promise<void>;
  goToNextStep: () => Promise<void>;
  goToPreviousStep: () => Promise<void>;
} {
  const auth = useAuth();
  const uid = auth?.currentUser?.uid;

  const [state, setState] = useState<UseOnboardingState>({
    currentStep: 1,
    profile: null,
    travelPlan: null,
    loading: true,
    error: null,
    isComplete: false,
  });

  // Load initial data on mount
  useEffect(() => {
    if (!uid) {
      setState((prev) => ({ ...prev, loading: false, error: 'Not authenticated' }));
      return;
    }

    (async () => {
      try {
        const [profile, plan] = await Promise.all([
          getUserProfile(uid),
          getTravelPlan(uid),
        ]);

        const step = profile?.onboardingStep ?? 1;
        const isComplete = profile?.isProfileComplete ?? false;

        setState({
          currentStep: step,
          profile,
          travelPlan: plan,
          loading: false,
          error: null,
          isComplete,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load onboarding data';
        setState((prev) => ({ ...prev, error: message, loading: false }));
      }
    })();
  }, [uid]);

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!uid) throw new Error('Not authenticated');

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        await createOrUpdateUserProfile(uid, {
          ...state.profile,
          ...data,
        });
        setState((prev) => ({
          ...prev,
          profile: { ...prev.profile, ...data } as UserProfile,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update profile';
        setState((prev) => ({ ...prev, error: message }));
        throw err;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [uid, state.profile]
  );

  const updateTravelPlan = useCallback(
    async (data: TravelPlanFormData) => {
      if (!uid) throw new Error('Not authenticated');

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const planId = await createOrUpdateTravelPlan(uid, data);
        setState((prev) => ({
          ...prev,
          travelPlan: {
            id: planId,
            uid,
            ...data,
            createdAt: prev.travelPlan?.createdAt || new Date(),
            updatedAt: new Date(),
          },
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save travel plan';
        setState((prev) => ({ ...prev, error: message }));
        throw err;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [uid]
  );

  const goToNextStep = useCallback(async () => {
    if (!uid) throw new Error('Not authenticated');

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const nextStep = Math.min(state.currentStep + 1, 4);
      
      // If moving to step 4 or beyond, mark profile as complete if all required fields present
      let updateData: any = {};
      if (nextStep >= 4 && state.profile) {
        const hasRequired =
          state.profile.fullName &&
          state.profile.city &&
          state.profile.country &&
          state.travelPlan?.travelFrom &&
          state.travelPlan?.travelTo;
        
        if (hasRequired) {
          updateData.isProfileComplete = true;
        }
      }

      await updateOnboardingStep(uid, nextStep, updateData);
      setState((prev) => ({
        ...prev,
        currentStep: nextStep,
        isComplete: nextStep >= 4 && updateData.isProfileComplete,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update step';
      setState((prev) => ({ ...prev, error: message }));
      throw err;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [uid, state.currentStep, state.profile, state.travelPlan]);

  const goToPreviousStep = useCallback(async () => {
    if (!uid) throw new Error('Not authenticated');

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const prevStep = Math.max(state.currentStep - 1, 1);
      await updateOnboardingStep(uid, prevStep);
      setState((prev) => ({ ...prev, currentStep: prevStep }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update step';
      setState((prev) => ({ ...prev, error: message }));
      throw err;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [uid, state.currentStep]);

  return {
    ...state,
    updateProfile,
    updateTravelPlan,
    goToNextStep,
    goToPreviousStep,
  };
}

// ============================================
// TRAVEL PLAN HOOK
// ============================================

export interface UseTravelPlanState {
  plan: TravelPlan | null;
  loading: boolean;
  error: string | null;
}

export function useTravelPlan(): UseTravelPlanState & {
  fetchPlan: () => Promise<void>;
  savePlan: (data: TravelPlanFormData) => Promise<void>;
} {
  const auth = useAuth();
  const uid = auth?.currentUser?.uid;

  const [state, setState] = useState<UseTravelPlanState>({
    plan: null,
    loading: false,
    error: null,
  });

  const fetchPlan = useCallback(async () => {
    if (!uid) {
      setState({ plan: null, loading: false, error: 'Not authenticated' });
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const plan = await getTravelPlan(uid);
      setState({ plan, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch travel plan';
      setState({ plan: null, loading: false, error: message });
    }
  }, [uid]);

  const savePlan = useCallback(
    async (data: TravelPlanFormData) => {
      if (!uid) throw new Error('Not authenticated');

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const planId = await createOrUpdateTravelPlan(uid, data);
        setState((prev) => ({
          ...prev,
          plan: {
            id: planId,
            uid,
            ...data,
            createdAt: prev.plan?.createdAt || new Date(),
            updatedAt: new Date(),
          },
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save travel plan';
        setState((prev) => ({ ...prev, error: message }));
        throw err;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [uid]
  );

  return { ...state, fetchPlan, savePlan };
}

// ============================================
// MATCHING TRAVELERS HOOK
// ============================================

export interface UseMatchedTravelersState {
  matches: MatchedTraveler[];
  loading: boolean;
  error: string | null;
}

export function useMatchedTravelers(): UseMatchedTravelersState & {
  findMatches: () => Promise<void>;
} {
  const auth = useAuth();
  const uid = auth?.currentUser?.uid;

  const [state, setState] = useState<UseMatchedTravelersState>({
    matches: [],
    loading: false,
    error: null,
  });

  const findMatches = useCallback(async () => {
    if (!uid) {
      setState({ matches: [], loading: false, error: 'Not authenticated' });
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const matches = await findMatchedTravelers(uid, {
        maxDateDifferenceDays: 7,
        minMatchScore: 50,
      });
      setState({ matches, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to find matches';
      setState({ matches: [], loading: false, error: message });
    }
  }, [uid]);

  return { ...state, findMatches };
}
