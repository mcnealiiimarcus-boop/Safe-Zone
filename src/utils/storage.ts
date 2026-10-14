import { EmergencyContact, MedicalProfile, HazardReport } from '../types';
import { INITIAL_HAZARDS } from './geo';

const CONTACTS_KEY = 'safezone_emergency_contacts';
const MEDICAL_KEY = 'safezone_medical_profile';
const HAZARDS_KEY = 'safezone_hazard_reports';
const SETTINGS_KEY = 'safezone_user_settings';

export const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: 'ct-1',
    name: 'Campus Police / Security Patrol',
    relationship: 'Campus Security',
    phone: '415-476-1414',
    email: 'security@university.edu',
    isPrimary: true,
    notifyOnSos: true
  },
  {
    id: 'ct-2',
    name: 'Sarah Chen (Partner / ICE)',
    relationship: 'Family / ICE',
    phone: '415-555-0199',
    email: 'sarah.chen@example.com',
    isPrimary: false,
    notifyOnSos: true
  },
  {
    id: 'ct-3',
    name: 'David Miller (Roommate)',
    relationship: 'Roommate',
    phone: '415-555-0142',
    email: 'david.m@example.com',
    isPrimary: false,
    notifyOnSos: true
  }
];

export const DEFAULT_MEDICAL_PROFILE: MedicalProfile = {
  fullName: 'Marcus McNeal',
  birthDate: '1998-05-14',
  bloodType: 'O+',
  allergies: 'Penicillin, Shellfish (severe - carries EpiPen)',
  medications: 'Albuterol inhaler PRN',
  medicalConditions: 'Mild Asthma',
  emergencyNotes: 'Contact Sarah Chen immediately. ICE phone on lock screen.',
  organDonor: true
};

export interface AppSettings {
  strobeOnSos: boolean;
  sirenOnSos: boolean;
  audioTicksOnCountdown: boolean;
  vibrateSupported: boolean;
  disguiseCode: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  strobeOnSos: true,
  sirenOnSos: true,
  audioTicksOnCountdown: true,
  vibrateSupported: typeof navigator !== 'undefined' && 'vibrate' in navigator,
  disguiseCode: '1234'
};

export const storage = {
  getContacts(): EmergencyContact[] {
    try {
      const data = localStorage.getItem(CONTACTS_KEY);
      return data ? JSON.parse(data) : DEFAULT_CONTACTS;
    } catch {
      return DEFAULT_CONTACTS;
    }
  },

  saveContacts(contacts: EmergencyContact[]): void {
    try {
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  getMedicalProfile(): MedicalProfile {
    try {
      const data = localStorage.getItem(MEDICAL_KEY);
      return data ? JSON.parse(data) : DEFAULT_MEDICAL_PROFILE;
    } catch {
      return DEFAULT_MEDICAL_PROFILE;
    }
  },

  saveMedicalProfile(profile: MedicalProfile): void {
    try {
      localStorage.setItem(MEDICAL_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  getHazards(): HazardReport[] {
    try {
      const data = localStorage.getItem(HAZARDS_KEY);
      return data ? JSON.parse(data) : INITIAL_HAZARDS;
    } catch {
      return INITIAL_HAZARDS;
    }
  },

  saveHazards(hazards: HazardReport[]): void {
    try {
      localStorage.setItem(HAZARDS_KEY, JSON.stringify(hazards));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }
};
