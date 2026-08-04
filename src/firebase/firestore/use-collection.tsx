'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getDocs,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';

export function useCollection(query: Query | null) {
  const [data, setData] = useState<DocumentData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const lastQueryRef = useRef<Query | null>(null);

  useEffect(() => {
    if (!query) return;
    if (query === lastQueryRef.current) return;

    const fetchData = async () => {
      setLoading(true);
      lastQueryRef.current = query;

      try {
        const snapshot = await getDocs(query);
        
        // Ensure this is still the active request
        if (query !== lastQueryRef.current) return;

        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(docs);
        setError(null);
      } catch (err: any) {
        if (query !== lastQueryRef.current) return;
        setError(err);
        console.error('Error fetching collection:', err);
      } finally {
        if (query === lastQueryRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      lastQueryRef.current = null;
    };
  }, [query]);

  return { data, loading, error };
}
