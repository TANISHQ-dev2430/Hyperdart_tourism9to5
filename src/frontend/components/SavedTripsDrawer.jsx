import React, { useEffect, useState } from 'react';
import { Bookmark, Trash2, MapPin, Calendar, X } from 'lucide-react';

export default function SavedTripsDrawer({ isOpen, onClose, onSelectTrip }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSavedTrips();
    }
  }, [isOpen]);

  const fetchSavedTrips = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      if (data.success) {
        setTrips(data.trips || []);
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async (id, e) => {
    e.stopPropagation();
    try {
      await fetch(`/api/trips/${id}`, { method: 'DELETE' });
      setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Failed to delete trip:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Saved Itineraries</h3>
              <p className="text-xs text-slate-400">Stored in MongoDB Backend</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {isLoading && (
            <div className="text-center py-12 text-slate-400 text-xs font-medium">
              Loading itineraries from MongoDB...
            </div>
          )}

          {!isLoading && trips.length === 0 && (
            <div className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-2xl">
              <Calendar className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">No saved trips yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Explore a city and use the Smart Itinerary Planner to save your first trip!
              </p>
            </div>
          )}

          {!isLoading &&
            trips.map((trip) => (
              <div
                key={trip._id}
                onClick={() => {
                  if (onSelectTrip) onSelectTrip(trip);
                  onClose();
                }}
                className="glass-card rounded-xl p-4 cursor-pointer hover:border-indigo-500/50 transition group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                      {trip.cityName}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 mt-1.5 group-hover:text-indigo-400 transition-colors">
                      {trip.title}
                    </h4>
                  </div>

                  <button
                    onClick={(e) => handleDeleteTrip(trip._id, e)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Delete trip"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-indigo-400" />
                    {trip.placesCount || trip.itinerary?.length || 0} Sights
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
