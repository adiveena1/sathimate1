import { collection, query, orderBy, startAt, endAt, getDocs, setDoc, doc, deleteDoc, getDoc, where, Timestamp } from 'firebase/firestore';
import * as geofire from 'geofire-common';
import { initializeFirebase } from '@/firebase';

const { db, auth } = initializeFirebase();

export interface NearbyTraveler {
  uid: string;
  name: string;
  profilePhoto: string;
  shortBio: string;
  gender: string;
  interests: string[];
  distanceKm: string;
  city?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export const nearbyService = {
  // Go live on the map
  async goLive(lat: number, lng: number, interests: string[], privacyMode: 'public' | 'matched_only' | 'hidden' = 'public') {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Must be logged in");

    if (privacyMode === 'hidden') {
      await this.hideLocation();
      return;
    }

    // Add 100m random offset for privacy
    const offsetLat = lat + (Math.random() - 0.5) * 0.002;
    const offsetLng = lng + (Math.random() - 0.5) * 0.002;
    const hash = geofire.geohashForLocation([offsetLat, offsetLng]);

    // TTL for 8 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);

    await setDoc(doc(db, 'live_locations', uid), {
      geohash: hash,
      lat: offsetLat,
      lng: offsetLng,
      interests,
      privacyMode,
      lastActive: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt)
    });
  },

  async hideLocation() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await deleteDoc(doc(db, 'live_locations', uid));
  },

  async findNearbyTravelers(centerLat: number, centerLng: number, radiusInKm: number, selectedInterests: string[] = []): Promise<NearbyTraveler[]> {
    const center = [centerLat, centerLng] as [number, number];
    const radiusInM = radiusInKm * 1000;
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];

    for (const b of bounds) {
      // Build base query with geohash constraints
      const baseConstraints = [
        orderBy('geohash'),
        startAt(b[0]),
        endAt(b[1])
      ];
      
      // IMPORTANT: If you filter on interests, you'll need a composite index on geohash + interests
      // For a massive app, it's better to fetch by geohash and filter the arrays client-side to save index limits
      // Note: Firestore doesn't support mixing 'where' with range queries on different fields efficiently
      // So we fetch all and filter client-side instead
      const q = query(collection(db, 'live_locations'), ...baseConstraints);
      promises.push(getDocs(q));
    }

    const snapshots = await Promise.all(promises);
    const matchingUids: { uid: string; distanceKm: string; privacyMode: string; location: { lat: number; lng: number } }[] = [];

    for (const snap of snapshots) {
      for (const d of snap.docs) {
        const data = d.data();
        if (d.id === auth.currentUser?.uid) continue; // skip self
        
        // Client-side interest filtering if specified
        if (selectedInterests.length > 0) {
          const userInterests = data.interests || [];
          const hasMatchingInterest = selectedInterests.some(interest => userInterests.includes(interest));
          if (!hasMatchingInterest) continue;
        }
        
        const distanceInKm = geofire.distanceBetween([data.lat, data.lng], center);
        const distanceInM = distanceInKm * 1000;
        
        if (distanceInM <= radiusInM) {
          matchingUids.push({
            uid: d.id,
            distanceKm: distanceInKm.toFixed(1),
            privacyMode: data.privacyMode || 'public',
            location: { lat: data.lat, lng: data.lng }
          });
        }
      }
    }

    // Batch fetch user profiles instead of N+1 queries
    const travelers: NearbyTraveler[] = [];
    if (matchingUids.length === 0) {
      return travelers;
    }

    try {
      // Split into batches of 30 (Firestore 'in' clause limit)
      const batchSize = 30;
      for (let i = 0; i < matchingUids.length; i += batchSize) {
        const batch = matchingUids.slice(i, i + batchSize);
        const uids = batch.map(m => m.uid);
        
        const userDocs = await getDocs(
          query(collection(db, 'users'), where(doc(db, 'users', 'dummy').id, 'in', uids))
        );
        
        // Better approach: use direct doc fetches in parallel for each batch
        const userDocPromises = batch.map(match => getDoc(doc(db, 'users', match.uid)));
        const userDocsResults = await Promise.all(userDocPromises);

        for (let j = 0; j < batch.length; j++) {
          const match = batch[j];
          const userDoc = userDocsResults[j];
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            let name = userData.name || 'Traveler';
            let profilePhoto = userData.photoURL || '';
            
            // Apply privacy logic
            if (match.privacyMode === 'matched_only') {
              name = 'Hidden Traveler';
              profilePhoto = '';
            }

            travelers.push({
              uid: match.uid,
              name,
              profilePhoto,
              shortBio: userData.shortBio || userData.bio || '',
              gender: userData.gender || 'Unknown',
              interests: userData.interests || [],
              distanceKm: match.distanceKm,
              location: match.location
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      // Return partial results if batch fetch fails
    }

    // Sort nearest first
    return travelers.sort((a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm));
  },

  async sendConnectRequest(receiverUid: string, message: string) {
    const senderUid = auth.currentUser?.uid;
    if (!senderUid) throw new Error("Must be logged in");

    const requestId = `${senderUid}_${receiverUid}`;
    await setDoc(doc(db, 'connect_requests', requestId), {
      senderUid,
      receiverUid,
      message,
      status: 'pending',
      timestamp: Timestamp.now()
    });
  }
};
