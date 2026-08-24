import React, { useState } from 'react';
import { MapPin, Volume2, VolumeX, Heart, Navigation, Globe, Check } from 'lucide-react';

export default function AttractionCard({
  place,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { name, categories = [], formatted, description, lat, lon } = place.properties || {};

  const getCategoryBadge = () => {
    const mainCat = categories[1] || categories[0] || 'tourism.sights';
    if (mainCat.includes('landmark')) return { label: 'Landmark', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    if (mainCat.includes('museum')) return { label: 'Museum & Art', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    if (mainCat.includes('viewpoint')) return { label: 'Viewpoint', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    if (mainCat.includes('historical')) return { label: 'Historical Site', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    if (mainCat.includes('park')) return { label: 'Park & Nature', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' };
    return { label: 'Tourist Attraction', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
  };

  const badge = getCategoryBadge();

  const handleToggleAudio = (e) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech narration is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `${name}. ${description || formatted || 'A popular landmark.'}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyCoords = (e) => {
    e.stopPropagation();
    if (lat && lon) {
      navigator.clipboard.writeText(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(place)}
      className={`glass-card rounded-2xl p-5 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-slate-800/90 shadow-xl shadow-indigo-500/20 border-indigo-500/50'
          : 'hover:-translate-y-1'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${badge.color}`}>
            {badge.label}
          </span>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleToggleAudio}
              className={`p-1.5 rounded-lg border transition-all ${
                isPlayingAudio
                  ? 'bg-purple-600 text-white border-purple-500 animate-bounce'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700/80 hover:bg-slate-700'
              }`}
              title={isPlayingAudio ? 'Stop Audio Guide' : 'Play Audio Narration'}
            >
              {isPlayingAudio ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite && onToggleFavorite(place);
              }}
              className={`p-1.5 rounded-lg border transition-all ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-rose-400 border-slate-700/80 hover:bg-slate-700'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2">
          {name || 'Unnamed Attraction'}
        </h3>

        {description ? (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
        ) : null}

        {formatted && (
          <div className="flex items-start space-x-1.5 text-xs text-slate-400 mb-3">
            <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{formatted}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={handleCopyCoords}
          className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-900/60 border border-slate-800 hover:bg-slate-800 transition"
          title="Click to copy coordinates"
        >
          <Globe className="h-3 w-3 text-indigo-400" />
          <span>
            {lat?.toFixed(4)}, {lon?.toFixed(4)}
          </span>
          {isCopied && <Check className="h-3 w-3 text-emerald-400 ml-1" />}
        </button>

        <span className="text-[11px] font-medium text-indigo-400 group-hover:underline flex items-center">
          Focus Map <Navigation className="h-3 w-3 ml-1" />
        </span>
      </div>
    </div>
  );
}
