
'use server';

import { NextResponse, type NextRequest } from 'next/server';
import * as geofire from 'geofire-common';
import { headers } from 'next/headers';
import { getAdmin } from '@/lib/firebase-admin';

let admin: typeof import('firebase-admin');

interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  gender: "male" | "female" | "other" | "prefer_not";
  city?: string;
  isVerified: boolean;
  interests?: string[];
  blocked?: { [key: string]: true };
}

interface GetNearbyRequest {
    lat: number;
    lng: number;
    radiusInM: number;
    filters?: {
        verifiedOnly?: boolean;
        womenOnly?: boolean;
        interests?: string[];
    }
}

async function initializeAdmin() {
    if (!admin) {
        // Credentials come from env vars — see src/lib/firebase-admin.ts.
        // The old bare initializeApp() only worked on Google-managed hosting.
        admin = await getAdmin();
    }
    return admin;
}

export async function POST(request: NextRequest) {
    try {
        const admin = await initializeAdmin();
        const db = admin.firestore();

        const headersList = headers();
        const authorization = headersList.get('Authorization');

        if (!authorization?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing or invalid token.' }, { status: 401 });
        }
        
        const idToken = authorization.split('Bearer ')[1];
        if (!idToken || typeof idToken !== 'string' || idToken.trim() === '') {
          return NextResponse.json({ error: 'Unauthorized: Invalid token format.' }, { status: 401 });
        }

        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (error) {
            console.error('Token verification failed:', {
              message: error instanceof Error ? error.message : String(error),
              error,
            });
            return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
        }

        const requestingUid = decodedToken.uid;
        
        let body: GetNearbyRequest;
        try {
          body = await request.json();
        } catch (parseError) {
          return NextResponse.json({ error: 'Invalid request body. Expected valid JSON.' }, { status: 400 });
        }

        if (!body || typeof body !== 'object') {
          return NextResponse.json({ error: 'Request body must be a JSON object.' }, { status: 400 });
        }

        const { lat, lng, radiusInM, filters } = body;

        if (typeof lat !== 'number' || typeof lng !== 'number' || typeof radiusInM !== 'number' || lat < -90 || lat > 90 || lng < -180 || lng > 180 || radiusInM <= 0) {
            return NextResponse.json({ error: 'Invalid latitude, longitude, or radius provided.' }, { status: 400 });
        }

        const center: geofire.Geopoint = [lat, lng];
        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = [];

        for (const b of bounds) {
            const q = db.collection("liveVisibility")
                .where("isVisible", "==", true)
                .where("visibilityUntil", ">", admin.firestore.Timestamp.now())
                .orderBy("geohash")
                .startAt(b[0])
                .endAt(b[1]);
            promises.push(q.get());
        }

        const snapshots = await Promise.all(promises);
        const potentialMatches: any[] = [];
        snapshots.forEach((snap) => {
            snap.docs.forEach((doc) => {
                if (doc.id !== requestingUid) {
                    const data = doc.data();
                    if (data.lat && data.lng) {
                        potentialMatches.push({ id: doc.id, ...data });
                    }
                }
            });
        });

        if (potentialMatches.length === 0) {
            return NextResponse.json({ travellers: [] });
        }

        const uidsToFetch = [requestingUid, ...potentialMatches.map((p) => p.id)];
        const userDocs = await db.collection("users").where(admin.firestore.FieldPath.documentId(), "in", uidsToFetch).get();
        
        const userProfiles: { [key: string]: UserProfile } = {};
        userDocs.forEach((doc) => {
            userProfiles[doc.id] = doc.data() as UserProfile;
        });

        const requestingUserProfile = userProfiles[requestingUid];
        if (!requestingUserProfile) {
            return NextResponse.json({ error: 'Requesting user profile not found.' }, { status: 404 });
        }
        
        const radiusInKm = radiusInM / 1000;
        let nearbyTravellers = potentialMatches
            .map((match) => {
                const matchProfile = userProfiles[match.id];
                if (!matchProfile || typeof match.lat !== 'number' || typeof match.lng !== 'number') return null;

                if (requestingUserProfile.blocked?.[match.id] || matchProfile.blocked?.[requestingUid]) return null;
                if (filters?.verifiedOnly && !matchProfile.isVerified) return null;
                if (filters?.womenOnly && matchProfile.gender !== "female") return null;
                if (filters?.interests?.length && !filters.interests.some((interest) => matchProfile.interests?.includes(interest))) return null;
                
                const matchLocation: geofire.Geopoint = [match.lat, match.lng];
                const distanceInKm = geofire.distanceBetween(center, matchLocation);

                if (distanceInKm > radiusInKm) return null;

                return {
                    name: matchProfile.displayName,
                    city: matchProfile.city || match.areaLabel || "Unknown",
                    distance: parseFloat(distanceInKm.toFixed(1)),
                };
            })
            .filter((result): result is NonNullable<typeof result> => result !== null);

        nearbyTravellers.sort((a, b) => a.distance - b.distance);
        const finalResults = nearbyTravellers.slice(0, 20);

        return NextResponse.json({ travellers: finalResults });

    } catch (error) {
        console.error("Error in /api/nearby:", {
          message: error instanceof Error ? error.message : String(error),
          error,
        });
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Nearby API endpoint is active." });
}
