// Custom hook for managing traveler profile
'use client';

import { useState, useEffect } from 'react';
import { TravelerProfile } from '@/types';
import { getTravelerProfile, saveTravelerProfile, updateTravelerProfile } from '@/firebase/firestore';
import { useUser } from '@/firebase';

export function useTravelerDetails() {
  const { user } = useUser();
  const [profile, setProfile] = useState<TravelerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing profile
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const existingProfile = await getTravelerProfile(user.uid);
        setProfile(existingProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Save or update profile
  const saveProfile = async (profileData: Omit<TravelerProfile, 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const fullProfile: Omit<TravelerProfile, 'createdAt' | 'updatedAt'> = {
        ...profileData,
        userId: user.uid,
      };

      if (profile) {
        await updateTravelerProfile(user.uid, fullProfile);
      } else {
        await saveTravelerProfile(fullProfile);
      }

      setProfile({ ...fullProfile, createdAt: new Date(), updatedAt: new Date() } as TravelerProfile);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    saveProfile,
    isProfileComplete: profile?.isProfileComplete || false,
  };
}
