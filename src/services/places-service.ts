
import { initializeFirebase } from '@/firebase/config';

const GOOGLE_MAPS_API_KEY = "AIzaSyB5yIRMbRq4ltiDIcym-SUkdiLcR9OB-Gs"; // Using the key from firebase config

export interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  rating?: number;
  user_ratings_total?: number;
  distance?: number;
  vicinity: string;
  imageUrl?: string;
  location: {
    lat: number;
    lng: number;
  };
}

class PlacesService {
  async getNearbyPlaces(lat: number, lng: number, radiusKm: number = 5, categories: string[] = []): Promise<NearbyPlace[]> {
    try {
      // Map categories to Google Places types
      const typeMap: Record<string, string> = {
        'temples': 'hindu_temple',
        'tourist spots': 'tourist_attraction',
        'hills': 'natural_feature',
        'waterfalls': 'natural_feature',
        'cafes': 'cafe',
        'restaurants': 'restaurant'
      };

      const radiusMeters = radiusKm * 1000;
      
      // Since we can't easily call Google Places API from client due to CORS,
      // we'll use our internal API route
      const response = await fetch(`/api/places?lat=${lat}&lng=${lng}&radius=${radiusMeters}&types=${categories.map(c => typeMap[c] || c).join(',')}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch nearby places');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  }
}

export const placesService = new PlacesService();
