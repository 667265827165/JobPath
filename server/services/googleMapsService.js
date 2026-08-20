import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_GEOCODING_API_KEY;

// In-memory cache for coordinates & geocoding to prevent duplicate external billing/calls
const geocodeCache = new Map();

// Known Indian Tech Hubs coordinates for high-speed fallback & instant response
const KNOWN_INDIAN_LOCATIONS = {
  'hyderabad': { lat: 17.3850, lng: 78.4867, city: 'Hyderabad', state: 'Telangana', country: 'India' },
  'hitech city': { lat: 17.4435, lng: 78.3772, city: 'Hyderabad', state: 'Telangana', country: 'India' },
  'gachibowli': { lat: 17.4401, lng: 78.3489, city: 'Hyderabad', state: 'Telangana', country: 'India' },
  'bangalore': { lat: 12.9716, lng: 77.5946, city: 'Bangalore', state: 'Karnataka', country: 'India' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, city: 'Bangalore', state: 'Karnataka', country: 'India' },
  'whitefield': { lat: 12.9698, lng: 77.7500, city: 'Bangalore', state: 'Karnataka', country: 'India' },
  'electronic city': { lat: 12.8399, lng: 77.6770, city: 'Bangalore', state: 'Karnataka', country: 'India' },
  'pune': { lat: 18.5204, lng: 73.8567, city: 'Pune', state: 'Maharashtra', country: 'India' },
  'hinjewadi': { lat: 18.5913, lng: 73.7389, city: 'Pune', state: 'Maharashtra', country: 'India' },
  'mumbai': { lat: 19.0760, lng: 72.8777, city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  'gurgaon': { lat: 28.4595, lng: 77.0266, city: 'Gurgaon', state: 'Haryana', country: 'India' },
  'cyber city': { lat: 28.4950, lng: 77.0895, city: 'Gurgaon', state: 'Haryana', country: 'India' },
  'noida': { lat: 28.5355, lng: 77.3910, city: 'Noida', state: 'Uttar Pradesh', country: 'India' },
  'delhi': { lat: 28.7041, lng: 77.1025, city: 'Delhi', state: 'Delhi NCR', country: 'India' },
  'chennai': { lat: 13.0827, lng: 80.2707, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  'omr': { lat: 12.9249, lng: 80.2297, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  'kolkata': { lat: 22.5726, lng: 88.3639, city: 'Kolkata', state: 'West Bengal', country: 'India' },
};

class GoogleMapsService {
  /**
   * Forward Geocoding: Address/City -> Lat/Lng
   */
  async geocode(address) {
    if (!address || !address.trim()) {
      return { lat: 17.3850, lng: 78.4867, formattedAddress: 'Hyderabad, Telangana, India' };
    }

    const cleanAddress = address.trim().toLowerCase();

    // Check cache
    if (geocodeCache.has(cleanAddress)) {
      return geocodeCache.get(cleanAddress);
    }

    // Check known Indian cities first
    for (const [key, coords] of Object.entries(KNOWN_INDIAN_LOCATIONS)) {
      if (cleanAddress.includes(key)) {
        const result = {
          lat: coords.lat,
          lng: coords.lng,
          city: coords.city,
          formattedAddress: `${coords.city}, ${coords.state}, India`,
        };
        geocodeCache.set(cleanAddress, result);
        return result;
      }
    }

    // If GOOGLE_MAPS_API_KEY is configured, call official Geocoding API
    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here') {
      try {
        console.log(`[Maps] Geocoding address: ${address}`);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_MAPS_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'OK' && data.results?.[0]) {
          const loc = data.results[0].geometry.location;
          const result = {
            lat: loc.lat,
            lng: loc.lng,
            formattedAddress: data.results[0].formatted_address,
          };
          geocodeCache.set(cleanAddress, result);
          return result;
        }
      } catch (err) {
        console.warn('[Maps] Geocoding API Error:', err.message);
      }
    }

    // Default fallback to Hyderabad
    const fallback = { lat: 17.3850, lng: 78.4867, formattedAddress: 'Hyderabad, Telangana, India' };
    geocodeCache.set(cleanAddress, fallback);
    return fallback;
  }

  /**
   * Reverse Geocoding: Lat/Lng -> City/Address
   */
  async reverseGeocode(lat, lng) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return { city: 'Hyderabad', state: 'Telangana', country: 'India', formattedAddress: 'Hyderabad, India' };
    }

    // Distance match to nearest known tech city
    let closestCity = 'Hyderabad';
    let closestState = 'Telangana';
    let minDistance = Infinity;

    for (const [key, coords] of Object.entries(KNOWN_INDIAN_LOCATIONS)) {
      const dist = Math.hypot(coords.lat - latNum, coords.lng - lngNum);
      if (dist < minDistance) {
        minDistance = dist;
        closestCity = coords.city;
        closestState = coords.state;
      }
    }

    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here') {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latNum},${lngNum}&key=${GOOGLE_MAPS_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === 'OK' && data.results?.[0]) {
          return {
            city: closestCity,
            state: closestState,
            country: 'India',
            formattedAddress: data.results[0].formatted_address,
          };
        }
      } catch (err) {
        console.warn('[Maps] Reverse geocoding error:', err.message);
      }
    }

    return {
      city: closestCity,
      state: closestState,
      country: 'India',
      formattedAddress: `${closestCity}, ${closestState}, India`,
    };
  }

  /**
   * Places Autocomplete
   */
  async getPlaceSuggestions(input) {
    if (!input || input.trim().length < 2) return [];

    const query = input.trim().toLowerCase();

    // Matching from known tech hubs first
    const matches = Object.entries(KNOWN_INDIAN_LOCATIONS)
      .filter(([key]) => key.includes(query) || query.includes(key))
      .map(([key, loc]) => ({
        placeId: `place_${key}`,
        description: `${loc.city}, ${loc.state}, India`,
        mainText: loc.city,
        secondaryText: `${loc.state}, India`,
        lat: loc.lat,
        lng: loc.lng,
      }));

    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here') {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&components=country:in&types=(cities)&key=${GOOGLE_MAPS_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'OK' && data.predictions) {
          const apiSuggestions = data.predictions.map((p) => ({
            placeId: p.place_id,
            description: p.description,
            mainText: p.structured_formatting?.main_text || p.description,
            secondaryText: p.structured_formatting?.secondary_text || '',
          }));
          return apiSuggestions.length > 0 ? apiSuggestions : matches;
        }
      } catch (err) {
        console.warn('[Maps] Places API Error:', err.message);
      }
    }

    return matches.length > 0
      ? matches
      : [
          { placeId: '1', description: 'Hyderabad, Telangana, India', mainText: 'Hyderabad' },
          { placeId: '2', description: 'Bangalore, Karnataka, India', mainText: 'Bangalore' },
          { placeId: '3', description: 'Pune, Maharashtra, India', mainText: 'Pune' },
          { placeId: '4', description: 'Gurgaon, Haryana, India', mainText: 'Gurgaon' },
        ];
  }

  /**
   * Distance & Travel Time Calculation (Routes / Distance Matrix)
   */
  async calculateDistance(origin, destination) {
    const originCoords = await this.geocode(origin);
    const destCoords = await this.geocode(destination);

    // Great-circle distance in kilometers (Haversine formula)
    const R = 6371; // Earth radius in km
    const dLat = ((destCoords.lat - originCoords.lat) * Math.PI) / 180;
    const dLng = ((destCoords.lng - originCoords.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((originCoords.lat * Math.PI) / 180) *
        Math.cos((destCoords.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c * 1.2 * 10) / 10; // 1.2 road factor

    // Estimated travel time in minutes (assumed average city speed 28 km/h or highway speed)
    const isInterCity = distanceKm > 50;
    const avgSpeedKmH = isInterCity ? 65 : 26;
    const durationMinutes = Math.max(8, Math.round((distanceKm / avgSpeedKmH) * 60));

    return {
      origin: originCoords.formattedAddress,
      destination: destCoords.formattedAddress,
      distanceKm,
      distanceText: `${distanceKm} km`,
      durationMinutes,
      durationText: durationMinutes >= 60
        ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
        : `${durationMinutes} min`,
      originCoordinates: { lat: originCoords.lat, lng: originCoords.lng },
      destinationCoordinates: { lat: destCoords.lat, lng: destCoords.lng },
    };
  }
}

export const googleMapsService = new GoogleMapsService();
