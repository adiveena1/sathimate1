'use client';

import { useState, useCallback } from 'react';
import { getDb } from '@/firebase/config-client';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { UserProfile, UserProfileFormData } from '@/types/profile';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches (or auto-creates) a user profile document from Firestore.
   * @param uid - The authenticated user's UID. Must be passed explicitly.
   */
  const fetchProfile = useCallback(async (uid: string) => {
    if (!uid) {
      const msg = '[useUserProfile] fetchProfile called without a UID. User may not be authenticated yet.';
      console.error(msg);
      setError('User not authenticated');
      return null;
    }

    const path = `users/${uid}`;
    console.log(`[useUserProfile] fetchProfile → Firestore path: ${path}`);

    setLoading(true);
    setError(null);
    try {
      const db = getDb();
      if (!db) {
        throw new Error('[useUserProfile] Firestore instance is null. Check NEXT_PUBLIC_FIREBASE_* environment variables.');
      }

      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log(`[useUserProfile] fetchProfile → Document found at ${path}`);
        const resolved: UserProfile = {
          uid,
          ...data,
          createdAt: data.createdAt?.toDate?.() ?? null,
          updatedAt: data.updatedAt?.toDate?.() ?? null,
        } as UserProfile;
        setProfile(resolved);
        return resolved;
      } else {
        // First-time user: auto-create a minimal document so the page doesn't crash.
        console.warn(`[useUserProfile] fetchProfile → No document at ${path}. Auto-creating skeleton profile.`);
        const newProfile = {
          uid,
          fullName: '',
          email: '',
          photoURL: '',
          visibility: 'public' as const,
          isProfileComplete: false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        await setDoc(userRef, newProfile, { merge: true });
        console.log(`[useUserProfile] fetchProfile → Skeleton profile created at ${path}`);
        setProfile(newProfile as unknown as UserProfile);
        return newProfile as unknown as UserProfile;
      }
    } catch (err: any) {
      const errorCode = err.code ?? 'UNKNOWN_CODE';
      const errorMessage = err.message ?? 'Failed to fetch profile';
      setError(errorMessage);
      console.error('[useUserProfile] fetchProfile FAILED');
      console.error('  Error Code :', errorCode);
      console.error('  Message    :', errorMessage);
      console.error('  UID        :', uid);
      console.error('  Path       :', `users/${uid}`);
      console.error('  Stack      :', err.stack);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // no deps — uid is passed as argument

  /**
   * Saves (or merges) a user profile document into Firestore.
   *
   * @param uid  - REQUIRED. The authenticated user's UID from useUser().
   * @param data - The profile form data to persist.
   *
   * WHY uid is an explicit param:
   *   The hook previously read auth?.currentUser?.uid internally via useAuth().
   *   useAuth() returns the raw Firebase Auth object, NOT the resolved React state.
   *   auth.currentUser can be null at hook-init time even when the user IS logged in,
   *   because onAuthStateChanged hasn't fired yet. The page component already owns
   *   the resolved uid via useUser() → onAuthStateChanged. Passing it in explicitly
   *   eliminates the race condition entirely.
   */
  const updateProfile = useCallback(async (uid: string, data: UserProfileFormData): Promise<boolean> => {
    if (!uid) {
      const msg = '[useUserProfile] updateProfile called without a UID. Aborting save.';
      console.error(msg);
      setError('User not authenticated');
      return false;
    }

    const path = `users/${uid}`;
    console.log(`[useUserProfile] updateProfile → Starting Firestore write to: ${path}`);
    console.log('[useUserProfile] updateProfile → Raw payload:', data);

    setLoading(true);
    setError(null);
    try {
      const db = getDb();
      if (!db) {
        throw new Error('[useUserProfile] Firestore instance is null. Check NEXT_PUBLIC_FIREBASE_* environment variables.');
      }

      const userRef = doc(db, 'users', uid);

      // Strip undefined values — Firebase rejects undefined fields
      const safeData: Record<string, unknown> = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          safeData[key] = value;
        }
      });

      const writePayload = {
        ...safeData,
        uid, // always write uid into the document for Firestore security rule verification
        updatedAt: Timestamp.now(),
      };

      console.log('[useUserProfile] updateProfile → Sanitized write payload:', writePayload);
      console.log(`[useUserProfile] updateProfile → Calling setDoc on: ${path}`);

      // setDoc with merge:true is idempotent: creates if missing, updates if present.
      // This replaces the fragile updateDoc() which fails on missing documents.
      await setDoc(userRef, writePayload, { merge: true });

      console.log(`[useUserProfile] updateProfile → ✅ Write SUCCESS at: ${path}`);

      // Immediately read back the document to confirm the write and refresh UI state.
      const confirmedDoc = await getDoc(userRef);
      if (confirmedDoc.exists()) {
        const confirmedData = confirmedDoc.data();
        console.log('[useUserProfile] updateProfile → ✅ Read-back confirmed. Document data:', confirmedData);
        setProfile({
          uid,
          ...confirmedData,
          createdAt: confirmedData.createdAt?.toDate?.() ?? null,
          updatedAt: confirmedData.updatedAt?.toDate?.() ?? null,
        } as UserProfile);
      } else {
        // Fallback: optimistic local update if read-back is delayed
        console.warn('[useUserProfile] updateProfile → Read-back returned no document. Using optimistic update.');
        setProfile((prev) => ({ ...prev, ...data, uid } as UserProfile));
      }

      return true;
    } catch (err: any) {
      const errorCode = err.code ?? 'UNKNOWN_CODE';
      const errorMessage = err.message ?? 'Failed to update profile';
      setError(errorMessage);
      console.error('[useUserProfile] updateProfile FAILED');
      console.error('  Error Code    :', errorCode);
      console.error('  Firebase Msg  :', errorMessage);
      console.error('  UID           :', uid);
      console.error('  Firestore Path:', path);
      console.error('  Write Payload :', data);
      console.error('  Stack         :', err.stack);
      return false;
    } finally {
      setLoading(false);
    }
  }, []); // no deps — uid is passed as argument

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
}
