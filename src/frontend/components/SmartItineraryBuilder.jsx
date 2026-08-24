import React, { useState } from 'react';
import { Sun, Sunset, Moon, Sparkles, Bookmark, Check, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SmartItineraryBuilder({ cityName, places = [], onTripSaved }) {
  const [tripTitle, setTripTitle] = useState(`${cityName} Highlights Day Trip`);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!places || places.length === 0) return null;

  const morningPlaces = places.slice(0, Math.ceil(places.length / 3));
  const afternoonPlaces = places.slice(Math.ceil(places.length / 3), Math.ceil((places.length * 2) / 3));
  const eveningPlaces = places.slice(Math.ceil((places.length * 2) / 3));

  const periods = [
    { name: 'Morning (09:00 - 12:30)', icon: Sun, color: 'text-amber-400', items: morningPlaces },
    { name: 'Afternoon (13:30 - 17:00)', icon: Sunset, color: 'text-orange-400', items: afternoonPlaces },
    { name: 'Evening (18:00 - 21:00)', icon: Moon, color: 'text-indigo-400', items: eveningPlaces }
  ];

  const handleSaveTrip = async () => {
    setIsSaving(true);
    const itineraryItems = [];
    periods.forEach((p) => {
      p.items.forEach((item) => {
        itineraryItems.push({
          period: p.name.split(' ')[0],
          placeName: item.properties?.name,
          category: item.properties?.categories?.[1] || 'tourism.sights',
          description: item.properties?.description || '',
          coordinates: [item.properties?.lon, item.properties?.lat]
        });
      });
    });

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tripTitle,
          cityName,
          itinerary: itineraryItems
        })
      });
      const data = await response.json();

      if (data.success) {
        setSavedSuccess(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (onTripSaved) onTripSaved(data.trip);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save trip itinerary:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
            <Sparkles className="h-4 w-4" />
            <span>AI Smart Itinerary Planner</span>
          </div>
          <input
            type="text"
            value={tripTitle}
            onChange={(e) => setTripTitle(e.target.value)}
            className="text-xl font-bold bg-transparent text-white focus:outline-none border-b border-dashed border-indigo-500/40 pb-0.5"
          />
        </div>

        <button
          onClick={handleSaveTrip}
          disabled={isSaving}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
            savedSuccess
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/25'
          }`}
        >
          {savedSuccess ? (
            <>
              <Check className="h-4 w-4" />
              <span>Itinerary Saved!</span>
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Itinerary (MongoDB)'}</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {periods.map((period, pIdx) => {
          const IconComp = period.icon;
          return (
            <div key={pIdx} className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80">
              <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-800">
                <IconComp className={`h-4 w-4 ${period.color}`} />
                <h4 className="text-sm font-bold text-slate-200">{period.name}</h4>
              </div>

              <div className="space-y-3">
                {period.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 transition text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-300 font-bold mb-1">
                      <span>{item.properties?.name}</span>
                      <span className="text-[10px] text-slate-400 flex items-center">
                        <Clock className="h-3 w-3 mr-0.5 text-indigo-400" /> ~1.5 hrs
                      </span>
                    </div>
                    {item.properties?.description && (
                      <p className="text-slate-400 line-clamp-2 text-[11px]">
                        {item.properties.description}
                      </p>
                    )}
                  </div>
                ))}

                {period.items.length === 0 && (
                  <p className="text-slate-500 text-xs italic py-2">No items scheduled for this period</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
