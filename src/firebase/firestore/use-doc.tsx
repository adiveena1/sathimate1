'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getDoc,
  DocumentReference,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';

export function useDoc(ref: DocumentReference | null) {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const activePathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!ref) return;
    if (ref.path === activePathRef.current) return;

    const fetchData = async () => {
      setLoading(true);
      activePathRef.current = ref.path;

      try {
        console.log("🛠️ FETCHING PROFILE DATA (getDoc):", ref.path);
        const snapshot = await getDoc(ref);
        
        // Ensure we only update state if this is still the active request
        if (ref.path !== activePathRef.current) return;

        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
        } else {
          setData(null);
        }
        setError(null);
      } catch (err: any) {
        if (ref.path !== activePathRef.current) return;
        setError(err);
        console.error('Error fetching document:', err);
      } finally {
        if (ref.path === activePathRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      activePathRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.path]);

  return { data, loading, error };
}
