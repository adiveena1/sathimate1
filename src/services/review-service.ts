import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { ReviewDraft, TripReview } from '@/types/review';

const REVIEW_REVEAL_DAYS = 14;

/** Ek user ek group ka ek hi review de sakta hai — isliye ID predictable rakhi hai. */
const reviewId = (groupId: string, uid: string) => `${groupId}_${uid}`;

export const reviewService = {
  /**
   * Draft autosave. User photos upload karke chala jaye to kaam na jaye.
   * Draft alag collection mein hai taaki adhoora review kabhi galti se
   * public na ho jaye.
   */
  async saveDraft(groupId: string, draft: Partial<ReviewDraft>) {
    const uid = getAuth().currentUser?.uid;
    if (!uid) throw new Error('You must be logged in.');

    const db = getFirestore();
    await setDoc(
      doc(db, 'reviewDrafts', reviewId(groupId, uid)),
      { groupId, reviewerId: uid, ...draft, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },

  async loadDraft(groupId: string): Promise<Partial<ReviewDraft> | null> {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return null;

    const db = getFirestore();
    const snap = await getDoc(doc(db, 'reviewDrafts', reviewId(groupId, uid)));
    return snap.exists() ? (snap.data() as Partial<ReviewDraft>) : null;
  },

  /** User ne is trip ka review pehle hi de diya hai? */
  async hasSubmitted(groupId: string): Promise<boolean> {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return false;

    const db = getFirestore();
    const snap = await getDoc(doc(db, 'reviews', reviewId(groupId, uid)));
    return snap.exists();
  },

  async submit(groupId: string, draft: ReviewDraft, memberIds: string[]) {
    const uid = getAuth().currentUser?.uid;
    if (!uid) throw new Error('You must be logged in.');

    const db = getFirestore();
    const batch = writeBatch(db);

    const review: Omit<TripReview, 'id'> = {
      groupId,
      reviewerId: uid,
      ratings: draft.ratings,
      publicNote: draft.publicNote?.trim() || undefined,
      productFeedback: draft.productFeedback?.trim() || undefined,
      // Safety notes yahan se nikal kar alag collection mein jate hain —
      // dekho neeche.
      memberFeedback: draft.memberFeedback.map((m) => ({
        revieweeId: m.revieweeId,
        wouldTravelAgain: m.wouldTravelAgain,
        compliments: m.compliments,
      })),
      photoUrls: draft.photoUrls,
      visibility: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    batch.set(doc(db, 'reviews', reviewId(groupId, uid)), review);

    /**
     * Private safety notes reviews collection mein NAHI jate.
     * Reviews eventually group members ko dikhte hain; safety notes sirf
     * moderation ko. Alag collection = alag security rule = accident-proof.
     */
    draft.memberFeedback
      .filter((m) => m.privateSafetyNote?.trim())
      .forEach((m) => {
        batch.set(doc(collection(db, 'safetyReports')), {
          groupId,
          reporterId: uid,
          subjectId: m.revieweeId,
          note: m.privateSafetyNote!.trim(),
          source: 'post-trip-review',
          status: 'open',
          createdAt: serverTimestamp(),
        });
      });

    batch.delete(doc(db, 'reviewDrafts', reviewId(groupId, uid)));
    await batch.commit();

    // Sab log de chuke hain? Tab sabke reviews ek saath khol do.
    await this.revealIfComplete(groupId, memberIds);
  },

  /**
   * Double-blind reveal. Reviews tab tak chhupe rehte hain jab tak
   * saare members submit na kar dein — warna baad wale pehle wale ka
   * review padh kar apna badal dete hain.
   */
  async revealIfComplete(groupId: string, memberIds: string[]) {
    const db = getFirestore();
    const snap = await getDocs(
      query(collection(db, 'reviews'), where('groupId', '==', groupId))
    );

    const submitted = snap.docs.length;
    const oldest = snap.docs
      .map((d) => (d.data().createdAt as { toMillis?: () => number })?.toMillis?.() ?? Date.now())
      .sort((a, b) => a - b)[0];

    const everyoneDone = submitted >= memberIds.length;
    const deadlinePassed =
      oldest !== undefined &&
      Date.now() - oldest > REVIEW_REVEAL_DAYS * 24 * 60 * 60 * 1000;

    if (!everyoneDone && !deadlinePassed) return;

    const batch = writeBatch(db);
    snap.docs
      .filter((d) => d.data().visibility === 'pending')
      .forEach((d) => batch.update(d.ref, { visibility: 'revealed' }));
    await batch.commit();
  },

  /** Group page par dikhane ke liye — sirf revealed reviews. */
  async getRevealedReviews(groupId: string): Promise<TripReview[]> {
    const db = getFirestore();
    const snap = await getDocs(
      query(
        collection(db, 'reviews'),
        where('groupId', '==', groupId),
        where('visibility', '==', 'revealed')
      )
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TripReview);
  },
};
