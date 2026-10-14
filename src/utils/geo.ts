import { SafeZone, UserLocation, HazardReport } from '../types';

// Default central reference point (Downtown / University Metro District)
export const DEFAULT_LOCATION: UserLocation = {
  lat: 37.7749,
  lng: -122.4194,
  accuracyMeters: 15,
  timestamp: Date.now(),
  isSimulated: true
};

// Calculate distance in miles using Haversine formula
export function getDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

// Estimate walking time in minutes (~3 mph)
export function getWalkingMinutes(distanceMiles: number): number {
  return Math.max(1, Math.round((distanceMiles / 3.0) * 60));
}

// Format coordinates nicely
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(5)}°, ${lng.toFixed(5)}°`;
}

// Google Maps link generator
export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`;
}

// Pre-seeded verified safe zones in the area
export const INITIAL_SAFE_ZONES: SafeZone[] = [
  {
    id: 'sz-1',
    name: 'Central Police Station (Precinct 1)',
    category: 'police',
    address: '850 Bryant St, Civic Center',
    lat: 37.7758,
    lng: -122.4042,
    is24x7: true,
    phone: '415-553-0123',
    verified: true,
    notes: '24/7 lobby, armed officers on duty, high-surveillance perimeter.'
  },
  {
    id: 'sz-2',
    name: 'University Campus Safety Escort Hub',
    category: 'campus_haven',
    address: '500 Parnassus Ave (Millberry Center)',
    lat: 37.7632,
    lng: -122.4581,
    is24x7: true,
    phone: '415-476-1414',
    verified: true,
    notes: 'Free walking escort service, illuminated waiting area, CCTV coverage.'
  },
  {
    id: 'sz-3',
    name: 'Metro Transit Police & Blue Light Kiosk',
    category: 'transit',
    address: 'Powell St Station Concourse',
    lat: 37.7844,
    lng: -122.4079,
    is24x7: true,
    phone: '415-989-2278',
    verified: true,
    notes: 'BART & Muni safety kiosk, direct emergency phone, station agents.'
  },
  {
    id: 'sz-4',
    name: 'General Medical Center & Trauma ER',
    category: 'hospital',
    address: '1001 Potrero Ave',
    lat: 37.7558,
    lng: -122.4048,
    is24x7: true,
    phone: '415-206-8000',
    verified: true,
    notes: '24/7 emergency entrance, security desk, triage nurse.'
  },
  {
    id: 'sz-5',
    name: 'North Point Fire Station #28',
    category: 'security_booth',
    address: '1814 Stockton St',
    lat: 37.8012,
    lng: -122.4093,
    is24x7: true,
    phone: '415-558-3200',
    verified: true,
    notes: 'Designated Safe Haven with 24/7 staff and emergency call ringbox.'
  },
  {
    id: 'sz-6',
    name: '24/7 Well-Lit Pharmacy & Convenience Haven',
    category: 'open_business',
    address: '498 Castro St',
    lat: 37.7618,
    lng: -122.4350,
    is24x7: true,
    phone: '415-861-3136',
    verified: true,
    notes: 'High illumination, staff present all night, emergency phone access.'
  },
  {
    id: 'sz-7',
    name: 'Student Union 24/7 Study Lounge & Security',
    category: 'campus_haven',
    address: '2475 Bancroft Way',
    lat: 37.7820,
    lng: -122.4210,
    is24x7: true,
    phone: '415-642-6760',
    verified: true,
    notes: 'Keycard access or security buzzer, illuminated corridor, blue call box.'
  }
];

// Pre-seeded crowdsourced hazards
export const INITIAL_HAZARDS: HazardReport[] = [
  {
    id: 'hz-1',
    title: 'Streetlights out along 4th St walkway',
    type: 'poor_lighting',
    description: '3 consecutive poles broken, pathway is completely dark after 8 PM.',
    lat: 37.7801,
    lng: -122.4035,
    timestamp: '2 hours ago',
    upvotes: 14
  },
  {
    id: 'hz-2',
    title: 'Pedestrian sidewalk barricaded / construction blind spot',
    type: 'blocked_path',
    description: 'Forces pedestrians into oncoming bike lane near scaffolding.',
    lat: 37.7720,
    lng: -122.4150,
    timestamp: 'Yesterday',
    upvotes: 8
  },
  {
    id: 'hz-3',
    title: 'Aggressive group gathering near unlit underpass',
    type: 'suspicious',
    description: 'Multiple reports of verbal harassment. Campus patrol notified.',
    lat: 37.7685,
    lng: -122.4110,
    timestamp: '4 hours ago',
    upvotes: 21
  }
];
