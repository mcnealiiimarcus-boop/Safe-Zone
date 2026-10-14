import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Footprints, 
  Users, 
  BookOpen, 
  Phone, 
  HeartPulse, 
  Sun, 
  Radio, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { UserLocation, EmergencyContact, HazardReport, MedicalProfile } from './types';
import { DEFAULT_LOCATION, INITIAL_SAFE_ZONES } from './utils/geo';
import { storage } from './utils/storage';
import { Header } from './components/Header';
import { SosModal } from './components/SosModal';
import { SafeZonesMap } from './components/SafeZonesMap';
import { WalkWithMe } from './components/WalkWithMe';
import { EmergencyContacts } from './components/EmergencyContacts';
import { SafetyGuides } from './components/SafetyGuides';
import { FakeCallModal } from './components/FakeCallModal';
import { MedicalIdModal } from './components/MedicalIdModal';
import { DisguiseMode } from './components/DisguiseMode';

export const App: React.FC = () => {
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [contacts, setContacts] = useState<EmergencyContact[]>(storage.getContacts());
  const [hazards, setHazards] = useState<HazardReport[]>(storage.getHazards());
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfile>(storage.getMedicalProfile());

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'map' | 'walk' | 'contacts' | 'guides'>('map');

  // Modals
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isMedicalIdOpen, setIsMedicalIdOpen] = useState(false);
  const [isDisguiseMode, setIsDisguiseMode] = useState(false);
  const [isScreenFlashlight, setIsScreenFlashlight] = useState(false);
  const [isSosMorse, setIsSosMorse] = useState(false);

  // Watch real geolocation if available
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracyMeters: Math.round(pos.coords.accuracy),
            timestamp: pos.timestamp,
            isSimulated: false,
          });
        },
        (err) => {
          console.warn('Geolocation notice (using default central coordinates):', err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Save contacts whenever updated
  const handleSaveContacts = (newContacts: EmergencyContact[]) => {
    setContacts(newContacts);
    storage.saveContacts(newContacts);
  };

  // Save hazards whenever updated
  const handleAddHazard = (hazard: HazardReport) => {
    const updated = [hazard, ...hazards];
    setHazards(updated);
    storage.saveHazards(updated);
  };

  const handleUpvoteHazard = (id: string) => {
    const updated = hazards.map(h => h.id === id ? { ...h, upvotes: h.upvotes + 1 } : h);
    setHazards(updated);
    storage.saveHazards(updated);
  };

  // Save medical profile
  const handleSaveMedicalProfile = (profile: MedicalProfile) => {
    setMedicalProfile(profile);
    storage.saveMedicalProfile(profile);
  };

  // If disguise mode active, render calculator
  if (isDisguiseMode) {
    return <DisguiseMode onExit={() => setIsDisguiseMode(false)} />;
  }

  // If high-beam screen torch active
  if (isScreenFlashlight) {
    return (
      <div 
        onClick={() => setIsScreenFlashlight(false)}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 select-none transition-colors duration-100 ${
          isSosMorse ? 'animate-strobe' : 'bg-white text-slate-900'
        }`}
      >
        <div className="w-full text-center pt-4">
          <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full">
            High-Beam Screen Light
          </span>
        </div>

        <div className="text-center">
          <Zap className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-pulse" />
          <h2 className="text-2xl font-black text-slate-950 mb-1">Illumination Active</h2>
          <p className="text-xs text-slate-700 font-medium">
            Turn your screen toward dark pathways to illuminate your surroundings or signal passersby.
          </p>
        </div>

        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSosMorse(!isSosMorse);
            }}
            className="w-full py-3 rounded-2xl bg-rose-600 text-white font-extrabold text-xs shadow-lg"
          >
            {isSosMorse ? 'Stop SOS Morse Strobe' : 'Activate SOS Morse Signal (... --- ...)'}
          </button>
          <button
            onClick={() => setIsScreenFlashlight(false)}
            className="w-full py-3 rounded-2xl bg-black text-white font-bold text-xs"
          >
            Tap Anywhere to Turn Off
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <Header
        location={location}
        onEnterDisguise={() => setIsDisguiseMode(true)}
        onTriggerSos={() => setIsSosOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Hero SOS Action Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 border-2 border-rose-600/40 p-6 sm:p-8 shadow-2xl shadow-rose-950/40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="text-center md:text-left space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
                Personal Safety Guardian
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                In an Unsafe Situation? Instant Response Ready.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                One tap initiates distress countdown, sounds high-volume police siren, alerts {contacts.filter(c => c.notifyOnSos).length} emergency contacts with exact GPS coordinates, and provides direct 911 dispatch.
              </p>
            </div>

            {/* Tactical SOS Beacon Button */}
            <div className="flex flex-col items-center shrink-0">
              <button
                onClick={() => setIsSosOpen(true)}
                className="group relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 hover:from-rose-600 hover:to-red-400 active:scale-95 transition-all shadow-2xl shadow-rose-600/60 flex flex-col items-center justify-center border-4 border-rose-400/80 cursor-pointer"
              >
                <span className="absolute inset-0 rounded-full border-4 border-rose-500/30 animate-pulse-ring pointer-events-none" />
                <AlertTriangle className="w-9 h-9 text-white group-hover:animate-bounce mb-1" />
                <span className="text-2xl font-black tracking-widest text-white uppercase drop-shadow-md">
                  SOS
                </span>
                <span className="text-[10px] font-bold text-rose-100 uppercase tracking-wider">
                  Hold / Tap
                </span>
              </button>
              <span className="text-[11px] text-slate-400 mt-2 font-medium">
                3-second cancel protection
              </span>
            </div>
          </div>

          {/* Quick Tools Row (Flashlight, Escape Call, Medical ID) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 pt-5 border-t border-rose-500/20 text-xs">
            <button
              onClick={() => setIsFakeCallOpen(true)}
              className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition-all hover:border-emerald-500/50 shadow-sm"
            >
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Fake Escape Call</span>
            </button>

            <button
              onClick={() => setIsScreenFlashlight(true)}
              className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition-all hover:border-amber-500/50 shadow-sm"
            >
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">Screen Torch / Light</span>
            </button>

            <button
              onClick={() => setIsMedicalIdOpen(true)}
              className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition-all hover:border-rose-500/50 shadow-sm"
            >
              <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="truncate">Medical ID</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'map'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Safe Zones & Havens</span>
          </button>

          <button
            onClick={() => setActiveTab('walk')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'walk'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>Walk With Me Guardian</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'contacts'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ICE Contacts ({contacts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guides')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'guides'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Crisis Guides & Hotlines</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'map' && (
          <SafeZonesMap
            location={location}
            zones={INITIAL_SAFE_ZONES}
            hazards={hazards}
            onAddHazard={handleAddHazard}
            onUpvoteHazard={handleUpvoteHazard}
          />
        )}

        {activeTab === 'walk' && (
          <WalkWithMe
            location={location}
            contacts={contacts}
            onTriggerSos={() => setIsSosOpen(true)}
          />
        )}

        {activeTab === 'contacts' && (
          <EmergencyContacts
            contacts={contacts}
            onSaveContacts={handleSaveContacts}
          />
        )}

        {activeTab === 'guides' && (
          <SafetyGuides />
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span className="font-bold text-slate-400">Safe Zone Personal Safety Engine</span>
          </div>
          <p>
            Always dial 911 directly in an emergency. In-browser positioning works with GPS and offline local storage.
          </p>
        </div>
      </footer>

      {/* SOS Distress Beacon Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        location={location}
        contacts={contacts}
      />

      {/* Escape Phone Call Modal */}
      <FakeCallModal
        isOpen={isFakeCallOpen}
        onClose={() => setIsFakeCallOpen(false)}
      />

      {/* First Responder Medical ID Modal */}
      <MedicalIdModal
        isOpen={isMedicalIdOpen}
        onClose={() => setIsMedicalIdOpen(false)}
        profile={medicalProfile}
        onSaveProfile={handleSaveMedicalProfile}
      />
    </div>
  );
};
