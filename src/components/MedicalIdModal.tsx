import React, { useState } from 'react';
import { 
  HeartPulse, 
  Edit3, 
  ShieldCheck,
  X
} from 'lucide-react';
import { MedicalProfile } from '../types';

interface MedicalIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MedicalProfile;
  onSaveProfile: (profile: MedicalProfile) => void;
}

export const MedicalIdModal: React.FC<MedicalIdModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MedicalProfile>(profile);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                First Responder View
              </span>
              <h3 className="font-bold text-white text-lg sm:text-xl">Emergency Medical ID</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Birth Date
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Blood Type
                </label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'].map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Known Allergies (Severe)
              </label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Peanuts (carries EpiPen)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Current Medications
              </label>
              <input
                type="text"
                value={formData.medications}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                placeholder="e.g. Albuterol inhaler, Insulin"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Chronic Medical Conditions
              </label>
              <input
                type="text"
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                placeholder="e.g. Asthma, Diabetes, Epilepsy"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Emergency Notes for First Responders
              </label>
              <textarea
                rows={3}
                value={formData.emergencyNotes}
                onChange={(e) => setFormData({ ...formData, emergencyNotes: e.target.value })}
                placeholder="Important instructions for EMT or emergency room staff..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="organDonor"
                checked={formData.organDonor}
                onChange={(e) => setFormData({ ...formData, organDonor: e.target.checked })}
                className="rounded border-slate-700 text-rose-600 focus:ring-0 accent-rose-500 cursor-pointer"
              />
              <label htmlFor="organDonor" className="text-xs text-slate-300 cursor-pointer">
                Registered Organ Donor
              </label>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Save Medical ID
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-white">{profile.fullName}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>DOB: {profile.birthDate}</span>
                  {profile.organDonor && (
                    <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      Organ Donor
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center p-3 rounded-xl bg-rose-950/60 border border-rose-500/50">
                <span className="text-[10px] uppercase font-bold text-rose-300 block">Blood</span>
                <span className="text-2xl font-black text-rose-400 font-mono">{profile.bloodType}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">Allergies:</span>
                <span className="text-amber-300 font-semibold">{profile.allergies || 'No known allergies reported'}</span>
              </div>

              <div>
                <span className="font-bold text-slate-400 block mb-0.5">Medical Conditions:</span>
                <span className="text-slate-200">{profile.medicalConditions || 'None specified'}</span>
              </div>

              <div>
                <span className="font-bold text-slate-400 block mb-0.5">Medications:</span>
                <span className="text-slate-200">{profile.medications || 'None specified'}</span>
              </div>

              <div>
                <span className="font-bold text-slate-400 block mb-0.5">Emergency Notes:</span>
                <p className="text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  {profile.emergencyNotes || 'No special notes'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>This emergency summary remains accessible offline on this device for first responders.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
