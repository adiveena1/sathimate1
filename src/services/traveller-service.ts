
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export interface TravellerDetails {
  uid: string;
  fullName: string;
  age: string;
  gender: string;
  city: string;
  country: string;
  travelDestination: string;
  travelDates: { from: Date; to: Date };
  budgetRange: string;
  travelStyle: string[];
  interests: string[];
  bio: string;
  photoURL?: string;
  languages: string[];
  onboardingComplete: boolean;
  createdAt: any;
  updatedAt: any;
  visibility?: string;
}

export const travellerService = {
  async saveProfile(uid: string, details: Partial<TravellerDetails>) {
    const db = getFirestore();
    const userRef = doc(db, 'users', uid);
    
    // Check if user exists to decide on setDoc vs updateDoc
    const snapshot = await getDoc(userRef);
    const now = new Date();

    if (snapshot.exists()) {
      await updateDoc(userRef, {
        ...details,
        updatedAt: now,
      });
    } else {
      await setDoc(userRef, {
        ...details,
        uid,
        createdAt: now,
        updatedAt: now,
        onboardingComplete: true,
      });
    }
  },

  /**
   * Photo ab hamare apne Hostinger VPS par jaati hai, Firebase Storage par nahi.
   * Firebase Storage ke liye Blaze (paid) plan chahiye hota hai — VPS ka disk
   * already paid hai, isliye ye free hai.
   * Server side: src/app/api/upload/route.ts
   */
  async uploadPhoto(uid: string, file: File): Promise<string> {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('You must be logged in to upload a photo.');
    }

    // Server ko sabit karna hai ki request sach mein isi user ki hai.
    const idToken = await currentUser.getIdToken();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'profiles');

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${idToken}` },
      body: formData,
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error || 'Photo upload failed. Please try again.');
    }

    const { url } = await res.json();
    return url as string;
  }
};
