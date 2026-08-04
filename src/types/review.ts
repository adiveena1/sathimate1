/**
 * Post-trip review types.
 *
 * DESIGN NOTE — peer reviews double-blind hain.
 * Chhote group (4-6 log) mein "anonymous rating" kabhi anonymous nahi hoti.
 * Agar 5 mein se 4 ne 5-star diye aur ek ne 2-star, to sabko pata chal jata
 * hai kisne diya. Isliye:
 *   - reviews tab tak kisi ko dikhte nahi jab tak saare members submit na
 *     kar dein, ya 14 din na guzar jayein (jo pehle ho)
 *   - safety flag KABHI reviewee ko nahi dikhta, sirf moderation ko
 */

export type ReviewVisibility = 'pending' | 'revealed';

/** Positive-only tags. Negative tags gaali dene ka tool ban jaate hain. */
export const COMPLIMENT_TAGS = [
  'Great organiser',
  'Always on time',
  'Helped when it mattered',
  'Great with a camera',
  'Kept money transparent',
  'Made everyone comfortable',
] as const;

export type ComplimentTag = (typeof COMPLIMENT_TAGS)[number];

export interface MemberFeedback {
  /** Jiske baare mein feedback hai */
  revieweeId: string;
  /**
   * Star rating jaan-boojh kar nahi hai — dekho upar wala note.
   * Sirf ek sawaal, jiska jawab binary hai.
   */
  wouldTravelAgain: boolean | null;
  compliments: ComplimentTag[];
  /**
   * Private safety concern. Reviewee ko kabhi nahi dikhta, sirf moderation
   * queue mein jata hai. Isi wajah se log sach likhte hain.
   */
  privateSafetyNote?: string;
}

export interface TripReview {
  id?: string;
  groupId: string;
  reviewerId: string;

  /** 1-5. Teen hi hain — 8 dimensions bharne se pehle log page chhod dete hain. */
  ratings: {
    overall: number;
    safety: number;
    organisation: number;
  };

  /** "What made this trip special?" — public, group page par dikhta hai */
  publicNote?: string;

  /** Sirf Sathimate team ke liye — product feedback */
  productFeedback?: string;

  memberFeedback: MemberFeedback[];

  /** VPS par upload ki gayi photos ke URLs (/uploads/...) */
  photoUrls: string[];

  visibility: ReviewVisibility;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface ReviewDraft {
  ratings: TripReview['ratings'];
  publicNote: string;
  productFeedback: string;
  memberFeedback: MemberFeedback[];
  photoUrls: string[];
}

export const RATING_LABELS: Record<keyof TripReview['ratings'], string> = {
  overall: 'How was the trip overall?',
  safety: 'How safe did you feel?',
  organisation: 'Did it run to plan?',
};
