import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, 
  MessageSquareWarning, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Share2, 
  Zap, 
  MapPin, 
  Copy, 
  Check, 
  X,
  Radio
} from 'lucide-react';
import { UserLocation, EmergencyContact } from '../types';
import { sound } from '../utils/siren';
import { getGoogleMapsUrl } from '../utils/geo';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: UserLocation;
  contacts: EmergencyContact[];
}

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  location,
  contacts,
}) => {
  const [countdown, setCountdown] = useState<number | null>(3);
  const [isAlarmActive, setIsAlarmActive] = useState<boolean>(false);
  const [isSirenMuted, setIsSirenMuted] = useState<boolean>(false);
  const [isStrobeActive, setIsStrobeActive] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Initialize countdown when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(3);
      setIsAlarmActive(false);
      setIsSirenMuted(false);
      setIsStrobeActive(true);
      sound.playCountdownTick();

      let currentCount = 3;
      timerRef.current = setInterval(() => {
        currentCount -= 1;
        if (currentCount > 0) {
          setCountdown(currentCount);
          sound.playCountdownTick();
        } else {
          clearInterval(timerRef.current);
          setCountdown(null);
          setIsAlarmActive(true);
          sound.startSiren();
          // Try vibration if supported
          if ('vibrate' in navigator) {
            navigator.vibrate([400, 200, 400, 200, 800]);
          }
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      sound.stopSiren();
      setIsAlarmActive(false);
      setCountdown(null);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      sound.stopSiren();
    };
  }, [isOpen]);

  const toggleSiren = () => {
    if (isSirenMuted) {
      sound.startSiren();
      setIsSirenMuted(false);
    } else {
      sound.stopSiren();
      setIsSirenMuted(true);
    }
  };

  const handleDeactivate = () => {
    sound.stopSiren();
    sound.playSafeChime();
    setIsAlarmActive(false);
    onClose();
  };

  if (!isOpen) return null;

  const mapsUrl = getGoogleMapsUrl(location.lat, location.lng);
  const sosMessage = `🚨 EMERGENCY ALERT via Safe Zone!\nI need immediate assistance at this location:\nCoordinates: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}\nMap: ${mapsUrl}\nTime: ${new Date().toLocaleTimeString()}`;
  
  const notifyContacts = contacts.filter(c => c.notifyOnSos);
  const phoneList = notifyContacts.map(c => c.phone).join(',');
  const smsHref = `sms:${phoneList}?body=${encodeURIComponent(sosMessage)}`;

  const copyEmergencyMessage = () => {
    navigator.clipboard.writeText(sosMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareEmergency = () => {
    if (navigator.share) {
      navigator.share({
        title: 'EMERGENCY SOS ALERT',
        text: sosMessage,
        url: mapsUrl,
      }).catch(() => {});
    } else {
      copyEmergencyMessage();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${
      isAlarmActive && isStrobeActive ? 'animate-strobe bg-rose-600' : 'bg-slate-950/95 backdrop-blur-xl'
    }`}>
      {/* Abort Countdown Screen */}
      {countdown !== null && (
        <div className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl shadow-rose-950/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 animate-pulse" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Radio className="w-4 h-4 animate-ping text-rose-500" />
            SOS Beacon Activating
          </div>

          <h2 className="text-2xl font-black text-white mb-2">Emergency Beacon</h2>
          <p className="text-slate-400 text-sm mb-6">
            Loud alarm will sound and emergency contacts will be prepared. Cancel now if this was accidental!
          </p>

          {/* Big countdown digit */}
          <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 animate-pulse-ring" />
            <div className="w-28 h-28 rounded-full bg-rose-950/80 border-4 border-rose-500 flex items-center justify-center shadow-inner shadow-rose-900">
              <span className="text-6xl font-black text-white tracking-tight">{countdown}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white font-extrabold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <X className="w-5 h-5 text-rose-400" />
            CANCEL (I'M SAFE)
          </button>
        </div>
      )}

      {/* Activated Emergency Command Screen */}
      {isAlarmActive && (
        <div className="bg-slate-900/95 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl shadow-rose-950/90 relative max-h-[90vh] overflow-y-auto">
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b border-rose-500/30 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/50 animate-bounce">
                <Radio className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="inline-block text-xs font-black tracking-widest text-rose-400 uppercase">
                  ACTIVE DISTRESS BEACON
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">Emergency Mode Active</h2>
              </div>
            </div>

            <button
              onClick={toggleSiren}
              className={`p-3 rounded-xl border transition-all ${
                isSirenMuted 
                  ? 'bg-slate-800 border-slate-700 text-slate-400' 
                  : 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
              }`}
              title={isSirenMuted ? 'Unmute Siren' : 'Mute Siren'}
            >
              {isSirenMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Current GPS Coordinates Card */}
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 mb-5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Current Incident Location
              </span>
              <span className="text-emerald-400 font-mono">Accuracy ±{location.accuracyMeters}m</span>
            </div>
            <p className="font-mono text-sm sm:text-base font-bold text-amber-300">
              {location.lat.toFixed(5)}°, {location.lng.toFixed(5)}°
            </p>
            <p className="text-xs text-slate-400 mt-1 truncate">
              {mapsUrl}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 mb-6">
            {/* Call 911 directly */}
            <a
              href="tel:911"
              className="flex items-center justify-between p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-extrabold text-lg transition-all shadow-xl shadow-rose-950/60"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <PhoneCall className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-base sm:text-lg">DIAL 911 NOW</div>
                  <div className="text-xs text-rose-200 font-normal">Immediate Police, Fire & Medical dispatch</div>
                </div>
              </div>
              <span className="text-xs font-black uppercase px-2.5 py-1 rounded-md bg-white text-rose-700">
                Call
              </span>
            </a>

            {/* Broadcast SMS to Contacts */}
            <a
              href={smsHref}
              className="flex items-center justify-between p-4 rounded-2xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-extrabold text-base transition-all shadow-xl shadow-amber-950/60"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageSquareWarning className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-base">ALERT ICE CONTACTS ({notifyContacts.length})</div>
                  <div className="text-xs text-amber-200 font-normal">Send pre-formatted GPS coordinates via SMS</div>
                </div>
              </div>
              <span className="text-xs font-black uppercase px-2.5 py-1 rounded-md bg-white text-amber-800">
                Send
              </span>
            </a>

            {/* Secondary Actions Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={shareEmergency}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold transition-all text-slate-200"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>Share Location</span>
              </button>

              <button
                onClick={copyEmergencyMessage}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold transition-all text-slate-200"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{copied ? 'Copied!' : 'Copy Info'}</span>
              </button>
            </div>

            {/* Strobe screen toggle */}
            <button
              onClick={() => setIsStrobeActive(!isStrobeActive)}
              className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                isStrobeActive
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Screen Strobe Light: {isStrobeActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Stand Down / Safe Arrival */}
          <button
            onClick={handleDeactivate}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60"
          >
            <ShieldCheck className="w-5 h-5" />
            STAND DOWN (I AM NOW SAFE)
          </button>
        </div>
      )}
    </div>
  );
};
