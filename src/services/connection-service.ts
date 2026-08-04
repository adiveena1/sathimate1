
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  addDoc, 
  onSnapshot,
  Timestamp
} from 'firebase/firestore';

export interface ConnectionRequest {
  id?: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderPhoto?: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: any;
  updatedAt: any;
}

export const connectionService = {
  async sendRequest(request: Omit<ConnectionRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    const db = getFirestore();
    const q = query(
      collection(db, 'requests'),
      where('senderId', '==', request.senderId),
      where('receiverId', '==', request.receiverId)
    );
    const existing = await getDocs(q);
    if (!existing.empty) throw new Error("Connection request already exists");

    const reqRef = collection(db, 'requests');
    await addDoc(reqRef, {
      ...request,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  },

  async updateStatus(id: string, status: 'accepted' | 'rejected') {
    const db = getFirestore();
    const reqRef = doc(db, 'requests', id);
    await updateDoc(reqRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  },

  getUserRequests(uid: string, type: 'incoming' | 'outgoing', callback: (reqs: ConnectionRequest[]) => void) {
    const db = getFirestore();
    const field = type === 'incoming' ? 'receiverId' : 'senderId';
    const q = query(
      collection(db, 'requests'),
      where(field, '==', uid)
    );

    return onSnapshot(q, (snapshot) => {
      const reqs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ConnectionRequest));
      callback(reqs);
    });
  }
};
