export type ZoneCategory = 
  | 'police' 
  | 'hospital' 
  | 'security_booth' 
  | 'transit' 
  | 'campus_haven' 
  | 'open_business';

export interface SafeZone {
  id: string;
  name: string;
  category: ZoneCategory;
  address: string;
  lat: number;
  lng: number;
  is24x7: boolean;
  phone: string;
  verified: boolean;
  notes: string;
  distanceMiles?: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  notifyOnSos: boolean;
}

export type HazardType = 'poor_lighting' | 'hazard' | 'suspicious' | 'blocked_path';

export interface HazardReport {
  id: string;
  title: string;
  type: HazardType;
  description: string;
  lat: number;
  lng: number;
  timestamp: string;
  upvotes: number;
}

export interface WalkJourney {
  isActive: boolean;
  destinationName: string;
  startTime: number;
  durationMinutes: number;
  expectedArrivalTime: number;
  lastCheckInTime: number;
  checkInIntervalMinutes: number;
  isAlertTriggered: boolean;
}

export interface MedicalProfile {
  fullName: string;
  birthDate: string;
  bloodType: string;
  allergies: string;
  medications: string;
  medicalConditions: string;
  emergencyNotes: string;
  organDonor: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracyMeters: number;
  timestamp: number;
  isSimulated?: boolean;
}
