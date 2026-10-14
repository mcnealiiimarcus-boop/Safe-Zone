import React, { useState } from 'react';
import { 
  BookOpen, 
  PhoneCall, 
  Sparkles, 
  Eye, 
  Hand, 
  Volume2, 
  Flame, 
  Coffee, 
  CheckCircle2, 
  RotateCcw,
  AlertOctagon,
  Heart,
  Droplet
} from 'lucide-react';

export const SafetyGuides: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hotlines' | 'grounding' | 'firstaid'>('hotlines');

  // Grounding Tool State
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const hotlines = [
    {
      name: 'Emergency Services (Police, Fire, EMS)',
      number: '911',
      desc: 'Immediate life-threatening emergency response.',
      badge: 'Immediate Response',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      desc: 'Free, confidential support for anyone in emotional distress or suicidal crisis 24/7.',
      badge: '24/7 Free & Confidential',
      color: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
    },
    {
      name: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      desc: 'Advocacy, safety planning, and resources for survivors of relationship violence.',
      badge: 'Confidential Support',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      name: 'Poison Control Center',
      number: '1-800-222-1222',
      desc: 'Immediate medical toxicologist advice for ingestion or hazardous exposure.',
      badge: '24/7 Medical Staff',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      name: 'The Trevor Project (LGBTQ+ Crisis)',
      number: '1-866-488-7386',
      desc: 'Crisis intervention and suicide prevention services for LGBTQ young people.',
      badge: '24/7 Support',
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      name: 'Campus Safety & SafeWalk Dispatch',
      number: '415-476-1414',
      desc: 'Campus safety officer walking escort and blue-light dispatch.',
      badge: 'Campus Security',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  ];

  const groundingSteps = [
    {
      count: 5,
      icon: <Eye className="w-5 h-5 text-sky-400" />,
      title: '5 Things You Can SEE',
      prompt: 'Look around you. Notice 5 distinct objects: a streetlight, your shoes, a tree branch, the pattern on a wall, a car license plate.',
      items: ['Object 1', 'Object 2', 'Object 3', 'Object 4', 'Object 5']
    },
    {
      count: 4,
      icon: <Hand className="w-5 h-5 text-amber-400" />,
      title: '4 Things You Can TOUCH',
      prompt: 'Feel physical sensations: the texture of your keys in your pocket, the cold breeze on your face, the firmness of the ground beneath your feet.',
      items: ['Texture 1', 'Texture 2', 'Texture 3', 'Texture 4']
    },
    {
      count: 3,
      icon: <Volume2 className="w-5 h-5 text-emerald-400" />,
      title: '3 Things You Can HEAR',
      prompt: 'Tune into distant or ambient audio: traffic humming, footsteps, your own breath, the rustle of wind.',
      items: ['Sound 1', 'Sound 2', 'Sound 3']
    },
    {
      count: 2,
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      title: '2 Things You Can SMELL',
      prompt: 'Notice any scent in the air: rain on pavement, your jacket, hand sanitizer, fresh outdoor air.',
      items: ['Scent 1', 'Scent 2']
    },
    {
      count: 1,
      icon: <Coffee className="w-5 h-5 text-purple-400" />,
      title: '1 Thing You Can TASTE (or Affirm)',
      prompt: 'Notice the taste in your mouth, or speak a grounding truth out loud: "I am in this moment. I am taking care of myself right now."',
      items: ['Grounded Affirmation']
    }
  ];

  const toggleGroundingItem = (stepIndex: number, itemIndex: number) => {
    const key = `${stepIndex}-${itemIndex}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetGrounding = () => {
    setCheckedItems({});
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Emergency Resources & First Aid</h2>
            <p className="text-xs text-slate-400">
              Crisis hotlines, panic grounding tools, and quick medical first aid flashcards.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('hotlines')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              activeTab === 'hotlines'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            Emergency Hotlines
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              activeTab === 'grounding'
                ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            5-4-3-2-1 Panic Grounding
          </button>
          <button
            onClick={() => setActiveTab('firstaid')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              activeTab === 'firstaid'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            First Aid & Active Threat
          </button>
        </div>
      </div>

      {/* 1. Hotlines Tab */}
      {activeTab === 'hotlines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotlines.map(h => (
            <div
              key={h.number}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${h.color}`}>
                    {h.badge}
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-300">{h.number}</span>
                </div>
                <h3 className="font-bold text-white text-base mb-1">{h.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{h.desc}</p>
              </div>

              <a
                href={`tel:${h.number.replace(/-/g, '')}`}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>One-Touch Dial ({h.number})</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* 2. Panic Grounding Tab (5-4-3-2-1) */}
      {activeTab === 'grounding' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-white text-lg">5-4-3-2-1 Sensory Grounding Tool</h3>
            </div>
            <button
              onClick={resetGrounding}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1 rounded"
              title="Reset checkmarks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-6">
            If you feel overwhelmed, panicking, or in shock, follow this clinically proven sensory reconnection exercise to steady your nervous system.
          </p>

          <div className="space-y-4">
            {groundingSteps.map((step, sIdx) => {
              const allCheckedInStep = step.items.every((_, iIdx) => checkedItems[`${sIdx}-${iIdx}`]);

              return (
                <div
                  key={step.title}
                  className={`p-5 rounded-2xl border transition-all ${
                    allCheckedInStep
                      ? 'bg-slate-950/80 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        {step.icon}
                      </div>
                      <h4 className="font-bold text-white text-base">{step.title}</h4>
                    </div>
                    {allCheckedInStep && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-4 pl-11">{step.prompt}</p>

                  <div className="flex flex-wrap gap-2 pl-11">
                    {step.items.map((item, iIdx) => {
                      const isChecked = !!checkedItems[`${sIdx}-${iIdx}`];
                      return (
                        <button
                          key={item}
                          onClick={() => toggleGroundingItem(sIdx, iIdx)}
                          className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                            isChecked
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                            isChecked ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-slate-600'
                          }`}>
                            {isChecked ? '✓' : ''}
                          </span>
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. First Aid & Active Threat Tab */}
      {activeTab === 'firstaid' && (
        <div className="space-y-4">
          {/* Hands-Only CPR Flashcard */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Hands-Only CPR (Cardiac Arrest)</h3>
                <span className="text-[11px] text-slate-400">Call 911 first, put phone on speaker, then begin immediately</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 mt-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">1. Hand Placement</span>
                Interlock fingers, heel of one hand in the dead center of chest (breastbone). Keep elbows locked.
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">2. Push Hard & Fast</span>
                Compress chest at least 2 inches deep at 100-120 beats per minute (rhythm of the song "Stayin' Alive").
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">3. Don't Stop</span>
                Allow full chest recoil between compressions. Continue until EMS or an AED arrives.
              </div>
            </div>
          </div>

          {/* Severe Bleeding Flashcard */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Severe Bleeding Control</h3>
                <span className="text-[11px] text-slate-400">Stop the Bleed protocol</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 mt-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-red-400 block mb-1">1. Firm Direct Pressure</span>
                Apply clean cloth or sterile gauze directly onto the wound using full body weight. Do NOT remove soaked cloth; add more on top.
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-red-400 block mb-1">2. Wound Packing</span>
                For deep open wounds in groin or armpit, pack cloth tightly into the wound cavity and hold sustained direct pressure.
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-red-400 block mb-1">3. Tourniquet (Limb)</span>
                If limb bleeding is uncontrolled, place tourniquet 2-3 inches above the wound (never on a joint). Tighten windlass until bleeding ceases.
              </div>
            </div>
          </div>

          {/* Active Threat / Run Hide Fight */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Active Threat Protocol: Run. Hide. Fight.</h3>
                <span className="text-[11px] text-slate-400">Federal Department of Homeland Security safety guideline</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 mt-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">RUN (First Choice)</span>
                Have an escape route in mind. Leave belongings behind. Keep hands visible when approaching law enforcement.
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">HIDE (If Escaping Impossible)</span>
                Lock and barricade doors with heavy furniture. Turn off lights, silence cell phone ringer & vibration completely.
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">FIGHT (Absolute Last Resort)</span>
                Act with aggressive physical commitment. Improvise weapons (fire extinguisher, chair). Swarm threat in unison.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
