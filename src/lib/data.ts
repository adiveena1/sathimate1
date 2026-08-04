
import { Timestamp } from "firebase/firestore";

export type User = {
  uid: string;
  displayName: string;
  photoURL: string;
  isVerified?: boolean;
};

export type Comment = {
  id: string;
  text: string;
  user: User;
  createdAt: string;
};

export type TravelPlan = {
  id: string;
  destination: string;
  dateFrom: Timestamp;
  dateTo: Timestamp;
  budget: number;
  travelStyle: 'relaxed' | 'fast-paced' | 'flexible';
  groupSize: number;
  notes: string;
  creator: User;
  participants: User[];
  comments?: Comment[];
  isGroupFormed: boolean;
  isWomenOnly: boolean;
  imageUrl?: string;
  discussionCount: number;
  createdAt: Timestamp;
};
