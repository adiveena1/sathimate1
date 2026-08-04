
import { addDoc, collection, doc, Firestore, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import type { User } from 'firebase/auth';

type PlanData = {
    destination: string;
    fromCity: string;
    startDate: Date;
    endDate: Date;
    budget: 'low' | 'mid' | 'premium';
    interests: string[];
    groupSizeMin: number;
    groupSizeMax: number;
    groupType: 'mixed' | 'women-only';
    description: string;
};

export async function createPlan(db: Firestore, user: User, planData: PlanData) {
    if (!user) {
        throw new Error("You must be logged in to create a plan.");
    }

    const newPlan = {
        ...planData,
        createdBy: user.uid,
        creator: {
            name: user.displayName || 'Anonymous',
            photoURL: user.photoURL || '',
        },
        status: 'open',
        createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'plans'), newPlan);
}

export async function requestToJoinPlan(db: Firestore, user: User, planId: string, toUid: string) {
    if (!user) {
        throw new Error("You must be logged in to send a request.");
    }

    if (user.uid === toUid) {
        throw new Error("You cannot request to join your own plan.");
    }

    // Prevent duplicate requests
    const requestsRef = collection(db, 'groupRequests');
    const q = query(requestsRef, where("fromUid", "==", user.uid), where("targetId", "==", planId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        throw new Error("You have already sent a request to join this plan.");
    }

    const requestData = {
        type: 'plan',
        targetId: planId,
        fromUid: user.uid,
        toUid: toUid,
        status: 'pending',
        createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'groupRequests'), requestData);
}
