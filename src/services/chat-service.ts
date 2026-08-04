
import { collection, query, orderBy, getDocs, setDoc, addDoc, doc, where, Timestamp, onSnapshot, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { db, auth } = initializeFirebase();

export interface ChatMessage {
  id?: string;
  senderUid: string;
  text: string;
  timestamp: Timestamp;
}

export interface ChatThread {
  id: string;
  participants: string[];
  lastMessageText: string;
  lastMessageAt: Timestamp;
}

export const chatService = {
  // Create or get existing chat ID between two users
  getChatId(uid1: string, uid2: string) {
    return [uid1, uid2].sort().join('_');
  },

  async sendMessage(receiverUid: string, text: string) {
    const senderUid = auth.currentUser?.uid;
    if (!senderUid) throw new Error("Must be logged in");
    if (!db) throw new Error("Firebase database not initialized");

    const chatId = this.getChatId(senderUid, receiverUid);
    const chatRef = doc(db, 'chats', chatId);
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    try {
      await addDoc(messagesRef, {
        senderUid,
        text,
        timestamp: Timestamp.now()
      });

      await setDoc(chatRef, {
        participants: [senderUid, receiverUid].sort(),
        lastMessageText: text,
        lastMessageAt: Timestamp.now()
      }, { merge: true });
    } catch (error) {
      console.error('Send message failed:', {
        message: error instanceof Error ? error.message : String(error),
        error,
      });
      throw error;
    }
  },

  subscribeToMessages(receiverUid: string, callback: (messages: ChatMessage[]) => void) {
    const senderUid = auth.currentUser?.uid;
    if (!senderUid) {
      console.warn('Cannot subscribe to messages: user not logged in');
      return () => {};
    }
    
    if (!db) {
      console.warn('Cannot subscribe to messages: Firebase not initialized');
      return () => {};
    }

    const chatId = this.getChatId(senderUid, receiverUid);
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    try {
      return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as ChatMessage[];
        callback(messages);
      }, (error) => {
        console.error('Subscribe to messages failed:', {
          message: error instanceof Error ? error.message : String(error),
          error,
        });
      });
    } catch (error) {
      console.error('Failed to set up message subscription:', {
        message: error instanceof Error ? error.message : String(error),
        error,
      });
      return () => {};
    }
  }
};
