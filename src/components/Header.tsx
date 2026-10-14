import React, { useState, useEffect } from 'react';
import { ShieldAlert, Navigation, Battery, EyeOff, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { UserLocation } from '../types';
import { sound } from '../utils/siren';

interface HeaderProps {
  location: UserLocation;
  onEnterDisguise: () => void;
  onTriggerSos: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  location,
  onEnterDisguise,
  onTriggerSos,
}) => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(82);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [soundTesting, setSoundTesting] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      }).catch(() => {
        // Fallback already set
      });
    }
  }, []);

  const toggleSoundTest = () => {
    if (soundTesting) {
      sound.stopSiren();
      setSoundTesting(false);
    } else {
      sound.startSiren();
      setSoundTesting(true);
      setTimeout(() => {
        sound.stopSiren();
        setSoundTesting(false);
      }, 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 text-slate-100">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-lg shadow-rose-950/50">
            <ShieldAlert className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-white">Safe Zone</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Live Guard
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-emerald-400" />
              <span>
                {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">GPS Active</span>
            </p>
          </div>
        </div>

        {/* Quick action buttons & status */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Battery Status */}
          {batteryLevel !== null && (
            <div 
              title={isCharging ? "Charging" : "Battery Level"}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300"
            >
              <Battery className={`w-3.5 h-3.5 ${batteryLevel < 20 ? 'text-rose-400' : 'text-emerald-400'}`} />
              <span>{batteryLevel}%</span>
              {isCharging && <span className="text-[10px] text-amber-400 font-bold">⚡</span>}
            </div>
          )}

          {/* Audio Siren Tester */}
          <button
            onClick={toggleSoundTest}
            title="Test 2-second siren audio pulse"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              soundTesting 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {soundTesting ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{soundTesting ? 'Testing Siren...' : 'Test Siren'}</span>
          </button>

          {/* Discreet Stealth Disguise Button */}
          <button
            onClick={onEnterDisguise}
            title="Instantly disguise app as a standard calculator"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all hover:border-slate-500 shadow-sm"
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Disguise Mode</span>
          </button>

          {/* Quick SOS Trigger in Header */}
          <button
            onClick={onTriggerSos}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-rose-900/50 uppercase"
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
