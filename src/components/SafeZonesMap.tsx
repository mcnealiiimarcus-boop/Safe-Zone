import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Filter, 
  Building2, 
  HeartPulse, 
  Train, 
  School,
  ExternalLink,
  ThumbsUp,
  Search,
  X
} from 'lucide-react';
import { SafeZone, UserLocation, HazardReport, ZoneCategory, HazardType } from '../types';
import { getDistanceMiles, getWalkingMinutes, getGoogleMapsUrl } from '../utils/geo';

interface SafeZonesMapProps {
  location: UserLocation;
  zones: SafeZone[];
  hazards: HazardReport[];
  onAddHazard: (hazard: HazardReport) => void;
  onUpvoteHazard: (id: string) => void;
}

export const SafeZonesMap: React.FC<SafeZonesMapProps> = ({
  location,
  zones,
  hazards,
  onAddHazard,
  onUpvoteHazard
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<SafeZone | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // New Hazard Form state
  const [hazardTitle, setHazardTitle] = useState('');
  const [hazardType, setHazardType] = useState<HazardType>('poor_lighting');
  const [hazardDesc, setHazardDesc] = useState('');

  // Calculate distance for all zones relative to user location
  const enrichedZones = zones.map(zone => {
    const distanceMiles = getDistanceMiles(location.lat, location.lng, zone.lat, zone.lng);
    return { ...zone, distanceMiles };
  }).sort((a, b) => (a.distanceMiles ?? 0) - (b.distanceMiles ?? 0));

  const filteredZones = enrichedZones.filter(z => {
    const matchesCategory = selectedCategory === 'all' || z.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: ZoneCategory) => {
    switch (category) {
      case 'police': return <ShieldCheck className="w-4 h-4 text-sky-400" />;
      case 'hospital': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'transit': return <Train className="w-4 h-4 text-amber-400" />;
      case 'campus_haven': return <School className="w-4 h-4 text-emerald-400" />;
      case 'security_booth': return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
      default: return <Building2 className="w-4 h-4 text-purple-400" />;
    }
  };

  const getCategoryBadgeClass = (category: ZoneCategory) => {
    switch (category) {
      case 'police': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'hospital': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'transit': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'campus_haven': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  const handleCreateHazard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hazardTitle.trim()) return;

    // Small offset near user location
    const newHazard: HazardReport = {
      id: `hz-${Date.now()}`,
      title: hazardTitle.trim(),
      type: hazardType,
      description: hazardDesc.trim() || 'Reported by local community member.',
      lat: location.lat + (Math.random() - 0.5) * 0.005,
      lng: location.lng + (Math.random() - 0.5) * 0.005,
      timestamp: 'Just now',
      upvotes: 1
    };

    onAddHazard(newHazard);
    setIsReportModalOpen(false);
    setHazardTitle('');
    setHazardDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Verified Safe Zones & Safe Paths
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            24/7 staffed safe havens, campus police, well-lit public hubs, and community hazard alerts.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report Safety Hazard</span>
        </button>
      </div>

      {/* Interactive Map Visual Representation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-hidden relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            Live Perimeter Map Radar
          </div>
          <span className="text-[11px] text-slate-400">
            Center: {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
          </span>
        </div>

        {/* SVG Tactical Radar Map */}
        <div className="relative w-full h-64 sm:h-80 bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem]" />
          
          {/* Concentric radar rings */}
          <div className="absolute w-72 h-72 rounded-full border border-slate-800/60 pointer-events-none" />
          <div className="absolute w-44 h-44 rounded-full border border-slate-800/80 pointer-events-none" />
          <div className="absolute w-20 h-20 rounded-full border border-emerald-500/20 animate-pulse-ring pointer-events-none" />

          {/* User Location Pulse in Center */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-lg shadow-emerald-500/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded-full mt-1 border border-emerald-500/30">
              You are here
            </span>
          </div>

          {/* Safe Zones mapped visually relative to center */}
          {enrichedZones.slice(0, 6).map((zone, idx) => {
            // Visual position offsets
            const angles = [35, 120, 210, 290, 80, 160];
            const distRadius = [60, 85, 100, 115, 75, 95];
            const angle = (angles[idx % angles.length] * Math.PI) / 180;
            const radius = distRadius[idx % distRadius.length];
            const left = `calc(50% + ${Math.cos(angle) * radius}px)`;
            const top = `calc(50% + ${Math.sin(angle) * radius}px)`;

            const isSelected = selectedZone?.id === zone.id;

            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                style={{ left, top }}
                title={`${zone.name} (${zone.distanceMiles} mi)`}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-xl border transition-transform hover:scale-125 ${
                  isSelected 
                    ? 'bg-rose-500 border-white text-white scale-125 shadow-lg shadow-rose-500/50' 
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-emerald-400 shadow-md'
                }`}
              >
                {getCategoryIcon(zone.category)}
              </button>
            );
          })}

          {/* Hazards mapped visually */}
          {hazards.slice(0, 3).map((hazard, idx) => {
            const hAngles = [170, 250, 330];
            const angle = (hAngles[idx % hAngles.length] * Math.PI) / 180;
            const left = `calc(50% + ${Math.cos(angle) * 70}px)`;
            const top = `calc(50% + ${Math.sin(angle) * 70}px)`;

            return (
              <div
                key={hazard.id}
                style={{ left, top }}
                title={`Hazard: ${hazard.title}`}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 p-1 rounded-lg bg-amber-500/30 border border-amber-400 text-amber-300"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>
            );
          })}

          {/* Map legend */}
          <div className="absolute bottom-2 left-2 z-10 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-lg p-2 text-[10px] text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> You
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" /> Safe Haven
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Hazard Pin
            </span>
          </div>
        </div>

        {/* Selected Zone Quick Banner */}
        {selectedZone && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(selectedZone.category)}`}>
                  {selectedZone.category.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {selectedZone.distanceMiles} mi • ~{getWalkingMinutes(selectedZone.distanceMiles ?? 0.5)} min walk
                </span>
              </div>
              <h4 className="font-bold text-white text-base">{selectedZone.name}</h4>
              <p className="text-xs text-slate-400">{selectedZone.address}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${selectedZone.phone}`}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Haven</span>
              </a>
              <a
                href={getGoogleMapsUrl(selectedZone.lat, selectedZone.lng)}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </a>
              <button
                onClick={() => setSelectedZone(null)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                title="Dismiss details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search safe havens by name, facility type, or street..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {[
            { id: 'all', label: 'All Safe Havens' },
            { id: 'police', label: 'Police & Security' },
            { id: 'campus_haven', label: 'Campus Havens' },
            { id: 'hospital', label: 'Emergency Hospitals' },
            { id: 'transit', label: 'Transit Stations' },
            { id: 'open_business', label: '24/7 Stores' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold border whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Safe Zones List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredZones.map(zone => {
          const walkMins = getWalkingMinutes(zone.distanceMiles ?? 0.5);
          return (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                selectedZone?.id === zone.id 
                  ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/30' 
                  : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                    {getCategoryIcon(zone.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base leading-snug">{zone.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="truncate">{zone.address}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {zone.distanceMiles} mi
                  </span>
                  <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>~{walkMins}m walk</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                {zone.notes}
              </p>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  {zone.is24x7 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      24/7 OPEN
                    </span>
                  )}
                  {zone.verified && (
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${zone.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title={`Call ${zone.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  </a>
                  <a
                    href={getGoogleMapsUrl(zone.lat, zone.lng)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1"
                  >
                    Directions
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Hazard Reports Section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Community Safety Hazard Reports</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {hazards.length} Active Warnings
          </span>
        </div>

        <div className="space-y-3">
          {hazards.map(h => (
            <div 
              key={h.id} 
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {h.type.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400">{h.timestamp}</span>
                </div>
                <h4 className="font-bold text-sm text-white mb-1">{h.title}</h4>
                <p className="text-xs text-slate-300">{h.description}</p>
              </div>

              <button
                onClick={() => onUpvoteHazard(h.id)}
                className="shrink-0 flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-all"
                title="Upvote / confirm this hazard"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono font-bold">{h.upvotes}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Report New Safety Hazard */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Report Hazard to Community
              </h3>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHazard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hazard Type
                </label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value as HazardType)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400"
                >
                  <option value="poor_lighting">Poor / Broken Lighting</option>
                  <option value="suspicious">Suspicious Behavior / Loitering</option>
                  <option value="blocked_path">Blocked Sidewalk / Construction Blind Spot</option>
                  <option value="hazard">Physical Safety Hazard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hazard Title
                </label>
                <input
                  type="text"
                  required
                  value={hazardTitle}
                  onChange={(e) => setHazardTitle(e.target.value)}
                  placeholder="e.g. Broken lights on 5th Ave footbridge"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Details / Recommended Avoidance
                </label>
                <textarea
                  rows={3}
                  value={hazardDesc}
                  onChange={(e) => setHazardDesc(e.target.value)}
                  placeholder="Describe location details so others can choose alternative lit routes..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
