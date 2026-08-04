
'use client';

import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { NearbyPlace } from '@/services/places-service';
import { NearbyTraveler } from '@/services/nearby-service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, MessageCircle, Star, Compass, User } from 'lucide-react';
import Image from 'next/image';

const containerStyle = {
  width: '100%',
  height: 'clamp(300px, 70vh, 600px)',
  borderRadius: '1.5rem',
  overflow: 'hidden',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
};

interface NearbyMapProps {
  lat: number;
  lng: number;
  places: NearbyPlace[];
  travelers: NearbyTraveler[];
  onSelectTraveler: (traveler: NearbyTraveler) => void;
  onConnect: (traveler: NearbyTraveler) => void;
}

// API key loaded from environment variable to prevent exposure
const MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export function NearbyMap({ lat, lng, places, travelers, onSelectTraveler, onConnect }: NearbyMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MAP_KEY
  });

  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [selectedTraveler, setSelectedTraveler] = useState<NearbyTraveler | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const center = useMemo(() => ({ lat, lng }), [lat, lng]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  // Check configuration after all hooks
  if (!MAP_KEY) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Google Maps API key not configured</p>
      </div>
    );
  }

  if (!isLoaded) return <div className="w-full h-[clamp(300px,70vh,600px)] bg-muted animate-pulse rounded-3xl flex items-center justify-center font-bold">Warming up the Radar...</div>;

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: [
            { "featureType": "administrative", "elementType": "all", "stylers": [{ "visibility": "simplified" }] },
            { "featureType": "landscape", "elementType": "all", "stylers": [{ "visibility": "on" }] },
            { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
            { "featureType": "road", "elementType": "all", "stylers": [{ "visibility": "on" }] },
            { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] },
            { "featureType": "water", "elementType": "all", "stylers": [{ "visibility": "on" }] }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        }}
      >
        {/* User Location */}
        <Marker 
          position={center} 
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2,
            scale: 8
          }}
          title="You are here"
        />

        {/* Places */}
        {places.map(place => (
          <Marker
            key={place.id}
            position={{ lat: place.location.lat, lng: place.location.lng }}
            onClick={() => setSelectedPlace(place)}
            icon={{
              url: 'https://cdn-icons-png.flaticon.com/512/149/149059.png', // Generic location icon
              scaledSize: new google.maps.Size(32, 32)
            }}
          />
        ))}

        {/* Travelers */}
        {travelers.map(t => (
          t.location && (
            <Marker
              key={t.uid}
              position={t.location}
              onClick={() => setSelectedTraveler(t)}
              icon={{
                url: t.profilePhoto || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Default user icon
                scaledSize: new google.maps.Size(32, 32)
              }}
            />
          )
        ))}

        {/* Traveler InfoWindow */}
        {selectedTraveler && selectedTraveler.location && (
          <InfoWindow
            position={selectedTraveler.location}
            onCloseClick={() => setSelectedTraveler(null)}
          >
            <div className="p-1 max-w-xs sm:max-w-[200px]">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                 <div className="relative w-8 sm:w-10 h-8 sm:h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {selectedTraveler.profilePhoto && <Image src={selectedTraveler.profilePhoto} alt={selectedTraveler.name} fill className="object-cover" />}
                 </div>
                 <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm leading-tight truncate">{selectedTraveler.name}</h4>
                    <p className="text-xs text-muted-foreground">{selectedTraveler.distanceKm} km away</p>
                 </div>
              </div>
              <p className="text-xs line-clamp-2 mb-2 italic">"{selectedTraveler.shortBio || 'Wanderer'}"</p>
              <Button size="sm" className="w-full h-6 text-xs font-bold rounded-md bg-green-600 hover:bg-green-700" onClick={() => onConnect(selectedTraveler)}>Say Hi 👋</Button>
            </div>
          </InfoWindow>
        )}

        {/* Place InfoWindow */}
        {selectedPlace && (
          <InfoWindow
            position={{ lat: selectedPlace.location.lat, lng: selectedPlace.location.lng }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="p-1 max-w-xs sm:max-w-[200px]">
              {selectedPlace.imageUrl && (
                <div className="relative h-16 sm:h-24 w-full mb-2 rounded-lg overflow-hidden">
                   <Image src={selectedPlace.imageUrl} alt={selectedPlace.name} fill className="object-cover" />
                </div>
              )}
              <h4 className="font-bold text-xs sm:text-sm leading-tight mb-1">{selectedPlace.name}</h4>
              <p className="text-xs text-muted-foreground uppercase mb-1">{selectedPlace.category}</p>
              {selectedPlace.rating && (
                 <div className="flex items-center gap-1 text-xs bg-yellow-400/10 text-yellow-700 px-1 py-0.5 rounded w-fit">
                    <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" /> {selectedPlace.rating}
                 </div>
              )}
              <Button size="sm" className="w-full mt-2 h-6 text-xs font-bold rounded-md" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.location.lat},${selectedPlace.location.lng}`, '_blank')}>Directions</Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
