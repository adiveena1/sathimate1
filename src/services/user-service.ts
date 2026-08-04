
import type { User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Creates a user document in Firestore if it doesn't already exist.
 * This is useful for storing public user profile information.
 *
 * @param db The Firestore instance.
 * @param user The Firebase Auth user object.
 */
export async function createUserDocument(db: Firestore, user: User) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { uid, displayName, email, photoURL } = user;
    try {
      await setDoc(userRef, {
        uid,
        displayName,
        email,
        photoURL,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      // In a real app, you'd want to handle this error more gracefully
      // For example, by showing a notification to the user.
      throw new Error("Could not create user profile.");
    }
  }
}
