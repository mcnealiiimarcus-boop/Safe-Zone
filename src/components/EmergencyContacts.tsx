import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  Star, 
  MessageSquare, 
  Edit2,
  X,
  AlertCircle
} from 'lucide-react';
import { EmergencyContact } from '../types';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onSaveContacts: (contacts: EmergencyContact[]) => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({
  contacts,
  onSaveContacts
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notifyOnSos, setNotifyOnSos] = useState(true);

  const relationships = ['Family / Parent', 'Partner / Spouse', 'Roommate', 'Friend', 'Campus Security', 'Colleague', 'Neighbor'];

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setRelationship('Friend');
    setPhone('');
    setEmail('');
    setNotifyOnSos(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setRelationship(contact.relationship);
    setPhone(contact.phone);
    setEmail(contact.email || '');
    setNotifyOnSos(contact.notifyOnSos);
    setIsModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingId) {
      onSaveContacts(contacts.map(c => c.id === editingId ? {
        ...c,
        name: name.trim(),
        relationship,
        phone: phone.trim(),
        email: email.trim(),
        notifyOnSos
      } : c));
    } else {
      const newContact: EmergencyContact = {
        id: `ct-${Date.now()}`,
        name: name.trim(),
        relationship,
        phone: phone.trim(),
        email: email.trim(),
        isPrimary: contacts.length === 0,
        notifyOnSos
      };
      onSaveContacts([...contacts, newContact]);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onSaveContacts(contacts.filter(c => c.id !== id));
  };

  const handleToggleNotify = (id: string) => {
    onSaveContacts(contacts.map(c => c.id === id ? { ...c, notifyOnSos: !c.notifyOnSos } : c));
  };

  const handleSetPrimary = (id: string) => {
    onSaveContacts(contacts.map(c => ({ ...c, isPrimary: c.id === id })));
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            In Case of Emergency (ICE) Contacts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Contacts alerted with your live GPS location and distress beacon when SOS is triggered.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shrink-0 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add ICE Contact</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          When SOS is activated, SMS messages are addressed to all contacts with the <strong className="text-white">"Notify on SOS"</strong> toggle enabled.
        </span>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-5 rounded-3xl border transition-all ${
              contact.isPrimary 
                ? 'bg-slate-900 border-indigo-500/70 shadow-lg shadow-indigo-950/30' 
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-base">{contact.name}</h3>
                  {contact.isPrimary && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                      Primary ICE
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                  {contact.relationship}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(contact)}
                  title="Edit contact"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {!contact.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(contact.id)}
                    title="Set as Primary ICE"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(contact.id)}
                  title="Remove contact"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Phone & Email Details */}
            <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono">{contact.phone}</span>
                </span>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-[11px] font-bold text-emerald-400 hover:underline"
                >
                  Call Now
                </a>
              </div>
              {contact.email && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
            </div>

            {/* Toggle Notify on SOS & Test SMS */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={contact.notifyOnSos}
                  onChange={() => handleToggleNotify(contact.id)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0 accent-indigo-500 cursor-pointer"
                />
                <span className={contact.notifyOnSos ? 'text-white font-medium' : 'text-slate-500'}>
                  Notify on SOS
                </span>
              </label>

              <a
                href={`sms:${contact.phone}?body=${encodeURIComponent(`[Safe Zone Test Alert] Hey ${contact.name}, this is a test notification to verify that you are listed as my emergency ICE contact on Safe Zone.`)}`}
                className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 p-1 rounded hover:bg-slate-800"
                title="Send a sample check-in SMS"
              >
                <MessageSquare className="w-3 h-3 text-amber-400" />
                <span>Send Test SMS</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                {editingId ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                {editingId ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-indigo-400"
                >
                  {relationships.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 415-555-0199"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. contact@example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:border-indigo-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="notifyCheck"
                  checked={notifyOnSos}
                  onChange={(e) => setNotifyOnSos(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0 accent-indigo-500 cursor-pointer"
                />
                <label htmlFor="notifyCheck" className="text-xs text-slate-300 cursor-pointer">
                  Automatically alert this contact when SOS is activated
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  {editingId ? 'Update Contact' : 'Save ICE Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
