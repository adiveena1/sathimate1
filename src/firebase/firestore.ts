// Firestore operations for traveler profiles and connections
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
  orderBy,
  limit,
  startAfter,
  Query,
  QueryConstraint,
} from 'firebase/firestore';
import { initializeFirebase } from './config';
import { TravelerProfile, ConnectionRequest, Chat, Message, TravelGroup } from '@/types';

// Get Firestore instance
const { db } = initializeFirebase();

// ========== TRAVELER PROFILE OPERATIONS ==========

export async function saveTravelerProfile(profile: Omit<TravelerProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
  const now = new Date();
  const profileData = {
    ...profile,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  };

  await setDoc(doc(db, 'travelerProfiles', profile.userId), profileData);
}

export async function updateTravelerProfile(userId: string, updates: Partial<TravelerProfile>): Promise<void> {
  const profileRef = doc(db, 'travelerProfiles', userId);
  await updateDoc(profileRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function getTravelerProfile(userId: string): Promise<TravelerProfile | null> {
  const docSnap = await getDoc(doc(db, 'travelerProfiles', userId));
  
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  if (!data) return null;
  
  return {
    ...data,
    createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : new Date(),
    updatedAt: data.updatedAt && typeof data.updatedAt.toDate === 'function' ? data.updatedAt.toDate() : new Date(),
    travelDates: {
      start: data.travelDates?.start && typeof data.travelDates.start.toDate === 'function' ? data.travelDates.start.toDate() : new Date(),
      end: data.travelDates?.end && typeof data.travelDates.end.toDate === 'function' ? data.travelDates.end.toDate() : new Date(),
    },
  } as TravelerProfile;
}

export async function searchTravelers(filters: {
  destination?: string;
  travelStyle?: string[];
  interests?: string[];
  country?: string;
}): Promise<TravelerProfile[]> {
  const constraints: QueryConstraint[] = [];

  if (filters.destination) {
    constraints.push(where('destination', '==', filters.destination));
  }
  if (filters.country) {
    constraints.push(where('country', '==', filters.country));
  }

  constraints.push(where('isProfileComplete', '==', true));
  constraints.push(limit(50));

  const q = query(collection(db, 'travelerProfiles'), ...constraints);
  const docs = await getDocs(q);

  return docs.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      ...data,
      createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt && typeof data.updatedAt.toDate === 'function' ? data.updatedAt.toDate() : new Date(),
      travelDates: {
        start: data.travelDates?.start && typeof data.travelDates.start.toDate === 'function' ? data.travelDates.start.toDate() : new Date(),
        end: data.travelDates?.end && typeof data.travelDates.end.toDate === 'function' ? data.travelDates.end.toDate() : new Date(),
      },
    } as TravelerProfile;
  });
}

// ========== CONNECTION REQUEST OPERATIONS ==========

export async function sendConnectionRequest(
  fromUserId: string,
  toUserId: string,
  message: string = ''
): Promise<string> {
  const requestData: Omit<ConnectionRequest, 'id'> = {
    fromUserId,
    toUserId,
    status: 'pending',
    message,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await addDoc(collection(db, 'connectionRequests'), {
    ...requestData,
    createdAt: Timestamp.fromDate(requestData.createdAt),
    updatedAt: Timestamp.fromDate(requestData.updatedAt),
  });

  return docRef.id;
}

export async function getConnectionRequests(userId: string, status?: string): Promise<ConnectionRequest[]> {
  const constraints: QueryConstraint[] = [
    where('toUserId', '==', userId),
    orderBy('createdAt', 'desc'),
  ];

  if (status) {
    constraints.push(where('status', '==', status));
  }

  const q = query(collection(db, 'connectionRequests'), ...constraints);
  const docs = await getDocs(q);

  return docs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    connectedAt: doc.data().connectedAt?.toDate(),
  } as ConnectionRequest));
}

export async function updateConnectionRequest(
  requestId: string,
  status: 'accepted' | 'rejected'
): Promise<void> {
  const requestRef = doc(db, 'connectionRequests', requestId);
  await updateDoc(requestRef, {
    status,
    updatedAt: Timestamp.now(),
    connectedAt: status === 'accepted' ? Timestamp.now() : null,
  });
}

export async function getConnectionStatus(fromUserId: string, toUserId: string): Promise<string | null> {
  const q = query(
    collection(db, 'connectionRequests'),
    where('fromUserId', '==', fromUserId),
    where('toUserId', '==', toUserId)
  );

  const docs = await getDocs(q);
  if (docs.empty) return null;

  return docs.docs[0].data().status;
}

// ========== CHAT OPERATIONS ==========

export async function createOrGetChat(connectionId: string, participants: string[]): Promise<string> {
  const q = query(
    collection(db, 'chats'),
    where('connectionId', '==', connectionId)
  );

  const existing = await getDocs(q);
  if (!existing.empty) {
    return existing.docs[0].id;
  }

  const chatRef = await addDoc(collection(db, 'chats'), {
    connectionId,
    participants,
    lastMessage: '',
    lastMessageTime: Timestamp.now(),
    createdAt: Timestamp.now(),
  });

  return chatRef.id;
}

export async function sendMessage(chatId: string, senderId: string, text: string): Promise<void> {
  const messageRef = collection(db, 'chats', chatId, 'messages');
  
  await addDoc(messageRef, {
    senderId,
    text,
    timestamp: Timestamp.now(),
    read: false,
  });

  // Update last message
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: text,
    lastMessageTime: Timestamp.now(),
  });
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc'),
    limit(100)
  );

  const docs = await getDocs(q);

  return docs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate(),
  } as Message));
}

// ========== TRAVEL GROUP OPERATIONS ==========

export async function createTravelGroup(
  group: Omit<TravelGroup, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = new Date();
  const groupData = {
    ...group,
    dateRange: {
      from: Timestamp.fromDate(group.dateRange.from),
      to: Timestamp.fromDate(group.dateRange.to),
    },
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  };

  const docRef = await addDoc(collection(db, 'travelGroups'), groupData);
  return docRef.id;
}

export async function getTravelGroup(groupId: string): Promise<TravelGroup | null> {
  const docSnap = await getDoc(doc(db, 'travelGroups', groupId));
  
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    dateRange: {
      from: data.dateRange?.from?.toDate() || new Date(),
      to: data.dateRange?.to?.toDate() || new Date(),
    },
  } as TravelGroup;
}

export async function getTravelGroups(filters?: {
  destination?: string;
  creatorId?: string;
  status?: string;
}): Promise<TravelGroup[]> {
  const constraints: QueryConstraint[] = [];

  if (filters?.destination) {
    constraints.push(where('destination', '==', filters.destination));
  }
  if (filters?.creatorId) {
    constraints.push(where('creatorId', '==', filters.creatorId));
  }
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }

  // Simplified query to avoid index requirement for now
  const q = query(collection(db, 'travelGroups'), limit(100));
  const docs = await getDocs(q);

  return docs.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      dateRange: {
        from: doc.data().dateRange?.from?.toDate() || new Date(),
        to: doc.data().dateRange?.to?.toDate() || new Date(),
      },
    } as TravelGroup))
    .filter(g => g.status !== 'cancelled')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function addMemberToGroup(groupId: string, userId: string): Promise<void> {
  const groupRef = doc(db, 'travelGroups', groupId);
  const groupSnap = await getDoc(groupRef);
  
  if (!groupSnap.exists()) {
    throw new Error('Group not found');
  }

  const currentMembers = groupSnap.data().members || [];
  if (currentMembers.includes(userId)) {
    throw new Error('User already a member');
  }

  await updateDoc(groupRef, {
    members: [...currentMembers, userId],
    groupSize: (currentMembers.length + 1),
    updatedAt: Timestamp.now(),
  });
}

export async function updateTravelGroup(groupId: string, updates: Partial<TravelGroup>): Promise<void> {
  const groupRef = doc(db, 'travelGroups', groupId);
  const updateData: Record<string, Timestamp | string | number | boolean | unknown> = {
    updatedAt: Timestamp.now(),
  };

  // Only include fields from updates, skip dateRange for now
  for (const key in updates) {
    if (key === 'dateRange') continue;
    if (key === 'createdAt' || key === 'updatedAt') continue;
    const value = updates[key as keyof TravelGroup];
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  if (updates.dateRange) {
    updateData.dateRange = {
      from: Timestamp.fromDate(updates.dateRange.from),
      to: Timestamp.fromDate(updates.dateRange.to),
    } as unknown;
  }

  await updateDoc(groupRef, updateData as any);
}
