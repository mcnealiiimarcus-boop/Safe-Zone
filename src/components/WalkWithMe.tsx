import React, { useState, useEffect } from 'react';
import { 
  Footprints, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Share2, 
  Play, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { UserLocation, EmergencyContact } from '../types';
import { sound } from '../utils/siren';
import { getGoogleMapsUrl } from '../utils/geo';

interface WalkWithMeProps {
  location: UserLocation;
  contacts: EmergencyContact[];
  onTriggerSos: () => void;
}

export const WalkWithMe: React.FC<WalkWithMeProps> = ({
  location,
  contacts,
  onTriggerSos
}) => {
  const [destination, setDestination] = useState<string>('Home / Apartment');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [checkInMinutes, setCheckInMinutes] = useState<number>(5);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [needsCheckIn, setNeedsCheckIn] = useState<boolean>(false);
  const [checkInDeadlineSec, setCheckInDeadlineSec] = useState<number>(60);
  const [journeySummary, setJourneySummary] = useState<string | null>(null);

  // Common quick destinations
  const presetDestinations = [
    'Home / Apartment',
    'Campus Dormitory',
    'University Library',
    'Metro Station / BART',
    'Parking Garage (Level 3)',
    'Gym / Fitness Center'
  ];

  // Journey countdown timer
  useEffect(() => {
    let timer: any = null;
    if (isActive && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Timer expired! Trigger check-in urgency
            setNeedsCheckIn(true);
            sound.playCountdownTick();
            return 0;
          }

          // Check if intermediate check-in is due
          const elapsed = totalSeconds - prev;
          if (checkInMinutes > 0 && elapsed > 0 && elapsed % (checkInMinutes * 60) === 0) {
            setNeedsCheckIn(true);
            sound.playCountdownTick();
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, secondsRemaining, totalSeconds, checkInMinutes]);

  // Check-in grace countdown (60 seconds to confirm safety before escalation)
  useEffect(() => {
    let checkInTimer: any = null;
    if (needsCheckIn && isActive) {
      checkInTimer = setInterval(() => {
        setCheckInDeadlineSec(prev => {
          if (prev <= 1) {
            clearInterval(checkInTimer);
            // User failed to check in! Escalation triggered
            onTriggerSos();
            return 0;
          }
          if (prev <= 10) {
            sound.playCountdownTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCheckInDeadlineSec(60);
    }

    return () => {
      if (checkInTimer) clearInterval(checkInTimer);
    };
  }, [needsCheckIn, isActive, onTriggerSos]);

  const startJourney = () => {
    const sec = durationMinutes * 60;
    setTotalSeconds(sec);
    setSecondsRemaining(sec);
    setIsActive(true);
    setNeedsCheckIn(false);
    setJourneySummary(null);
    sound.playSafeChime();
  };

  const handleSafeArrival = () => {
    setIsActive(false);
    setNeedsCheckIn(false);
    setSecondsRemaining(0);
    sound.playSafeChime();
    setJourneySummary(`You arrived safely at ${destination}! Walk Guardian completed.`);
  };

  const handleAcknowledgeCheckIn = () => {
    setNeedsCheckIn(false);
    setCheckInDeadlineSec(60);
    sound.playSafeChime();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalSeconds > 0 
    ? Math.min(100, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100))
    : 0;

  const mapsUrl = getGoogleMapsUrl(location.lat, location.lng);
  const shareText = `🛡️ I'm using Safe Zone "Walk With Me". I'm walking to ${destination}. Expected arrival in ${durationMinutes} mins. Last location: ${mapsUrl}`;
  const shareSmsHref = `sms:${contacts.filter(c => c.notifyOnSos).map(c => c.phone).join(',')}?body=${encodeURIComponent(shareText)}`;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/60 p-5 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Footprints className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Walk With Me (Journey Guardian)</h2>
            <p className="text-xs text-slate-400">
              Dead man's switch timer that automatically raises an alert if you do not check in safely.
            </p>
          </div>
        </div>
      </div>

      {/* Success Banner if just finished */}
      {journeySummary && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="text-sm font-semibold">{journeySummary}</span>
          </div>
          <button 
            onClick={() => setJourneySummary(null)}
            className="text-xs text-emerald-400 hover:text-white underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Walk State */}
      {isActive ? (
        <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle pulse background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Urgent Check-in Required banner */}
          {needsCheckIn && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-white animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-400 animate-bounce" />
                  <span className="font-bold text-base">Check-In Required!</span>
                </div>
                <span className="font-mono text-sm bg-rose-600 px-2 py-0.5 rounded-full font-bold">
                  {checkInDeadlineSec}s remaining
                </span>
              </div>
              <p className="text-xs text-rose-200 mb-4">
                Confirm you are safe now. If you don't respond, the SOS alarm will automatically trigger!
              </p>
              <button
                onClick={handleAcknowledgeCheckIn}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-rose-800 font-extrabold text-sm shadow-md transition-all uppercase"
              >
                ✓ I Am Safe & OK
              </button>
            </div>
          )}

          {/* Destination and Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping inline-block" />
              Active Guardian Walk
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Progress: {progressPercent}%
            </span>
          </div>

          <div className="flex items-center gap-2 text-white font-bold text-lg mb-6">
            <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
            <span className="truncate">{destination}</span>
          </div>

          {/* Big countdown timer display */}
          <div className="text-center py-6 bg-slate-950/60 rounded-2xl border border-slate-800 mb-6">
            <div className="text-5xl sm:text-6xl font-mono font-black text-white tracking-wider mb-2">
              {formatTime(secondsRemaining)}
            </div>
            <p className="text-xs text-slate-400">
              {secondsRemaining === 0 ? 'Expected arrival time reached' : 'Estimated time remaining until destination'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleSafeArrival}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-base transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50"
            >
              <ShieldCheck className="w-5 h-5" />
              I'VE ARRIVED SAFELY (DISARM)
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={shareSmsHref}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>Text Status to Friend</span>
              </a>

              <button
                onClick={onTriggerSos}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 text-xs font-semibold text-rose-300 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Instant SOS Alarm</span>
              </button>
            </div>

            <button
              onClick={() => {
                setIsActive(false);
                setNeedsCheckIn(false);
                setSecondsRemaining(0);
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-1.5"
            >
              Cancel Walk Without Escalation
            </button>
          </div>
        </div>
      ) : (
        /* Configuration Form to Start Walk */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Set Up Your Safe Walk
          </h3>

          {/* Destination picker */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Where are you heading?
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. 542 Elm St, Dormitory, Subway"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors mb-3"
            />

            {/* Quick destination tags */}
            <div className="flex flex-wrap gap-2">
              {presetDestinations.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDestination(p)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                    destination === p 
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' 
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated walk duration */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Estimated Walk Duration
              </label>
              <span className="text-indigo-400 font-bold text-sm">{durationMinutes} Minutes</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    durationMinutes === mins
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            <input
              type="range"
              min="3"
              max="60"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Check-in frequency */}
          <div className="mb-8 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Dead Man's Check-In Prompts
              </span>
              <span className="text-xs font-medium text-amber-400">
                {checkInMinutes === 0 ? 'Only at end' : `Every ${checkInMinutes} mins`}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              App will chime asking if you're safe. If you don't respond in 60s, your emergency contacts are warned.
            </p>
            <div className="flex gap-2">
              {[0, 3, 5, 10].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCheckInMinutes(val)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    checkInMinutes === val
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {val === 0 ? 'Off' : `${val}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={startJourney}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-extrabold text-base transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/60"
          >
            <Play className="w-5 h-5 fill-current" />
            START "WALK WITH ME" GUARDIAN
          </button>
        </div>
      )}
    </div>
  );
};
