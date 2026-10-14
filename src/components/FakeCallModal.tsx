import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  MicOff, 
  Volume2, 
  Grid, 
  Clock, 
  User, 
  Sparkles,
  X
} from 'lucide-react';
import { sound } from '../utils/siren';

interface FakeCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FakeCallModal: React.FC<FakeCallModalProps> = ({
  isOpen,
  onClose
}) => {
  const [callerName, setCallerName] = useState<string>('Campus Security Escort');
  const [callerNumber, setCallerNumber] = useState<string>('415-476-1414');
  const [waitingForCall, setWaitingForCall] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected'>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(false);
  const [showKeypad, setShowKeypad] = useState<boolean>(false);
  const [typedDigits, setTypedDigits] = useState<string>('');

  const durationTimerRef = useRef<any>(null);
  const countdownTimerRef = useRef<any>(null);

  const callerPresets = [
    { name: 'Campus Escort Dispatch', number: '415-476-1414' },
    { name: 'Mom', number: '415-555-0182' },
    { name: 'Roommate Alex', number: '415-555-0144' },
    { name: 'Dad', number: '415-555-0119' },
    { name: 'Dr. Harrison (Clinic)', number: '415-555-9081' },
  ];

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      sound.stopPhoneRingtone();
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  const handleStartCallTimer = (delay: number) => {
    if (delay === 0) {
      setWaitingForCall(false);
      setCallState('ringing');
      sound.startPhoneRingtone();
    } else {
      setWaitingForCall(true);
      setCountdown(delay);
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            setWaitingForCall(false);
            setCallState('ringing');
            sound.startPhoneRingtone();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleAnswer = () => {
    sound.stopPhoneRingtone();
    setCallState('connected');
    setCallDuration(0);

    durationTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const handleDeclineOrHangUp = () => {
    sound.stopPhoneRingtone();
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setCallState('idle');
    setWaitingForCall(false);
    onClose();
  };

  if (!isOpen) return null;

  const formatCallDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4">
      {/* 1. Configuration Screen (Setup Call) */}
      {callState === 'idle' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-lg">Fake Escape Call</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-5">
            Simulate an urgent incoming call to politely excuse yourself from an uncomfortable situation.
          </p>

          {waitingForCall ? (
            <div className="text-center py-8 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
              <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-spin" />
              <div className="text-2xl font-mono font-bold text-white mb-1">
                Call in {countdown}s
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Leave this tab open. Your phone will ring shortly.
              </p>
              <button
                onClick={() => {
                  if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                  setWaitingForCall(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-rose-400 text-xs font-bold"
              >
                Cancel Call
              </button>
            </div>
          ) : (
            <>
              {/* Select Caller Preset */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Choose Caller Persona
                </label>
                <div className="space-y-2">
                  {callerPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setCallerName(preset.name);
                        setCallerNumber(preset.number);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                        callerName === preset.name
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{preset.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{preset.number}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timing triggers */}
              <div className="space-y-2 mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  When Should Phone Ring?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStartCallTimer(0)}
                    className="py-3 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    Ring Right Now
                  </button>
                  <button
                    onClick={() => handleStartCallTimer(15)}
                    className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                  >
                    In 15 seconds
                  </button>
                  <button
                    onClick={() => handleStartCallTimer(45)}
                    className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                  >
                    In 45 seconds
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. Incoming Ringing Call Screen */}
      {callState === 'ringing' && (
        <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 text-center flex flex-col items-center justify-between min-h-[500px] shadow-2xl">
          <div className="pt-4">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold inline-block mb-3">
              Incoming Call
            </span>
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-emerald-500/50 mx-auto flex items-center justify-center mb-4 shadow-xl">
              <User className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{callerName}</h2>
            <p className="text-sm font-mono text-slate-400">{callerNumber}</p>
          </div>

          <div className="w-full space-y-4">
            <p className="text-xs text-slate-500 animate-pulse">
              Swipe or tap green to answer...
            </p>
            <div className="flex items-center justify-around w-full">
              {/* Decline button */}
              <button
                onClick={handleDeclineOrHangUp}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-950 transition-transform active:scale-95"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              {/* Accept button */}
              <button
                onClick={handleAnswer}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950 animate-bounce transition-transform active:scale-95"
              >
                <Phone className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Connected Call In-Progress Screen */}
      {callState === 'connected' && (
        <div className="w-full max-w-sm bg-slate-950 p-8 rounded-3xl border border-slate-800 text-center flex flex-col items-center justify-between min-h-[520px] shadow-2xl">
          <div className="pt-2">
            <h2 className="text-2xl font-bold text-white mb-1">{callerName}</h2>
            <p className="text-sm font-mono text-emerald-400 mb-2">
              {formatCallDuration(callDuration)}
            </p>
            <span className="text-[10px] text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              HD Audio Call Connected
            </span>
          </div>

          {/* Scripted Prompts helper to read out loud naturally */}
          {!showKeypad ? (
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-left w-full my-4">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Suggested Conversation Excuse:
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Hey! Yes, I’m right here. Oh, you're already parked out front? Okay, give me 30 seconds, I'm heading out to meet you right now."
              </p>
            </div>
          ) : (
            <div className="w-full my-3 p-3 bg-slate-900/95 rounded-2xl border border-slate-800">
              <div className="text-center font-mono text-lg text-emerald-400 font-bold tracking-widest h-7 overflow-hidden mb-2">
                {typedDigits || 'Tap numbers'}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      sound.playDtmfTone(k);
                      setTypedDigits((prev) => (prev + k).slice(-12));
                    }}
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-mono font-bold text-base transition-colors"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Call Controls */}
          <div className="w-full space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1 text-[11px] font-semibold border ${
                  isMuted ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <MicOff className="w-5 h-5" />
                <span>{isMuted ? 'Muted' : 'Mute'}</span>
              </button>

              <button
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1 text-[11px] font-semibold border ${
                  isSpeaker ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                <span>{isSpeaker ? 'Speaker On' : 'Speaker'}</span>
              </button>

              <button
                onClick={() => setShowKeypad(!showKeypad)}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1 text-[11px] font-semibold border ${
                  showKeypad ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Grid className="w-5 h-5" />
                <span>{showKeypad ? 'Hide Pad' : 'Keypad'}</span>
              </button>
            </div>

            {/* End Call */}
            <button
              onClick={handleDeclineOrHangUp}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-950 mx-auto"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
