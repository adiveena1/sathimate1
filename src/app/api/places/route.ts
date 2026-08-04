
import { NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || '5000';
  const types = searchParams.get('types') || '';

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
  }

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured');
    // Return mock data when API key is missing for development
    const mockPlaces = [
      {
        id: 'mock1',
        name: 'Hilltop Temple Viewpoint',
        category: 'temple',
        rating: 4.8,
        user_ratings_total: 1250,
        distance: 1.2,
        vicinity: 'Sunset Point Road, Rishikesh',
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        location: { lat: 30.1, lng: 78.3 }
      },
    ];
    return NextResponse.json(mockPlaces);
  }

  try {
    // We'll make multiple requests for different types if needed, or just one with nearbysearch
    // For simplicity, we'll try one first. Note: Google Nearby Search allows only one 'type' parameter.
    // To support multiple types, we'd need multiple calls.
    
    const typeList = types.split(',').filter(Boolean);
    let allResults: any[] = [];

    // If no type specified, we use 'tourist_attraction' as a catch-all
    if (typeList.length === 0) typeList.push('tourist_attraction');

    // Make concurrent requests for different categories
    const results = await Promise.all(typeList.map(async (type) => {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Google Maps API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'REQUEST_DENIED') {
        throw new Error(data.error_message || 'API access denied. Check your Google Maps API key.');
      }
      
      return data.results || [];
    }));

    // Flatten and deduplicate
    allResults = results.flat();
    const uniqueResults = Array.from(new Map(allResults.map(item => [item.place_id, item])).values());

    // Map to our cleaner interface
    const formattedResults = uniqueResults.map(place => ({
      id: place.place_id,
      name: place.name,
      category: place.types?.[0]?.replace(/_/g, ' ') || 'Place',
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      vicinity: place.vicinity,
      location: place.geometry?.location,
      imageUrl: place.photos?.[0] 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
        : null
    }));

    return NextResponse.json(formattedResults);
  } catch (error: any) {
    console.error('Places API Error:', {
      message: error instanceof Error ? error.message : String(error),
      error,
    });
    
    // FALLBACK: Mock Data if API fails (development mode)
    const mockPlaces = [
      {
        id: 'mock1',
        name: 'Hilltop Temple Viewpoint',
        category: 'temple',
        rating: 4.8,
        user_ratings_total: 1250,
        distance: 1.2,
        vicinity: 'Sunset Point Road, Rishikesh',
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        location: { lat: 30.1, lng: 78.3 }
      },
      {
        id: 'mock2',
        name: 'The River Side Cafe',
        category: 'cafe',
        rating: 4.5,
        user_ratings_total: 890,
        distance: 0.8,
        vicinity: 'Ghat Street, Laxman Jhula',
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        location: { lat: 30.12, lng: 78.33 }
      },
    ];
    
    return NextResponse.json(mockPlaces);
  }
}
