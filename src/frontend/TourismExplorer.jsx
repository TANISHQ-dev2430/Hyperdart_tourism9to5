import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import QuerySearchBar from './components/QuerySearchBar';
import AttractionCard from './components/AttractionCard';
import MapView from './components/MapView';
import SmartItineraryBuilder from './components/SmartItineraryBuilder';
import HyperDartInspector from './components/HyperDartInspector';
import ApiKeyModal from './components/ApiKeyModal';
import SavedTripsDrawer from './components/SavedTripsDrawer';
import { fetchTourismPlaces } from './utils/geoapifyService';
import { parseHyperDartQuery } from './utils/nerParser';
import { MapPin, Columns, Grid, Map, Filter, AlertCircle, Compass } from 'lucide-react';
import './index.css';

export default function TourismExplorer(props) {
  // Extract initial searchData from props or fallback to default NYC payload
  const initialSearchData = Array.isArray(props?.searchData)
    ? props.searchData[0]
    : props?.searchData || parseHyperDartQuery('Tourist attractions in NYC');

  const [activeSearchData, setActiveSearchData] = useState(initialSearchData);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [viewMode, setViewMode] = useState('split');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('geoapify_api_key') || '');
  const [showInspector, setShowInspector] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showTripsDrawer, setShowTripsDrawer] = useState(false);
  const [savedTripsCount, setSavedTripsCount] = useState(0);

  // Extract resolved city entity as per HyperDart Spec
  const cityEntity = activeSearchData?.entities?.[0]?.entityInfo?.geo || {};
  const cityName = cityEntity.city || 'New York City';
  const lat = cityEntity.lat || 40.71427;
  const long = cityEntity.long || -74.00597;

  useEffect(() => {
    fetchSavedTripsCount();
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [cityName, lat, long, apiKey]);

  const fetchSavedTripsCount = async () => {
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      if (data.success && data.trips) {
        setSavedTripsCount(data.trips.length);
      }
    } catch (e) {
      console.error('Saved trips count fetch error:', e);
    }
  };

  const loadPlaces = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSelectedPlace(null);

    try {
      const results = await fetchTourismPlaces({
        lat,
        long,
        city: cityName,
        apiKey
      });

      setPlaces(results || []);
      if (results && results.length > 0) {
        setSelectedPlace(results[0]);
      }
    } catch (err) {
      console.error('Error loading tourism places:', err);
      setErrorMsg('Failed to load tourist attractions for this location.');
    } finally {
      setIsLoading(false);


      // Notify HyperDart container that component is ready to render!
      if (props?.messageHandlers?.componentLoaded) {
        props.messageHandlers.componentLoaded();
      }
    }
  };

  const handleSearchQuery = (newQuery) => {
    const parsedData = parseHyperDartQuery(newQuery);
    setActiveSearchData(parsedData);
  };

  const handleToggleFavorite = async (place) => {
    const pId = place.properties?.place_id || place.properties?.name;
    const isFav = favorites.includes(pId);

    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== pId) : [...prev, pId]
    );

    try {
      await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: pId,
          name: place.properties?.name,
          category: place.properties?.categories?.[1] || 'tourism.sights',
          city: cityName,
          description: place.properties?.description || '',
          formattedAddress: place.properties?.formatted || '',
          coordinates: [place.properties?.lon, place.properties?.lat]
        })
      });
    } catch (e) {
      console.error('Failed to sync favorite with backend:', e);
    }
  };

  const filteredPlaces = places.filter((p) => {
    if (categoryFilter === 'all') return true;
    const cats = (p.properties?.categories || []).join(' ');
    return cats.includes(categoryFilter);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar
        hasApiKey={Boolean(apiKey)}
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        showInspector={showInspector}
        onToggleInspector={() => setShowInspector((prev) => !prev)}
        onOpenTripsDrawer={() => setShowTripsDrawer(true)}
        savedTripsCount={savedTripsCount}
      />

      <main className="flex-1 pt-8 px-4 max-w-7xl mx-auto w-full pb-16">
        <QuerySearchBar
          currentQuery={activeSearchData.query || 'Tourist attractions in NYC'}
          onSearch={handleSearchQuery}
        />

        {/* Location Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-2">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span>Resolved Location: {cityEntity.country || 'Global'}</span>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-slate-400">
                  Coords: [{long.toFixed(4)}, {lat.toFixed(4)}]
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Sights & Landmarks in <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{cityName}</span>
              </h2>

              <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Surfacing popular tourist attractions, landmarks, and points of interest filtered strictly to sights (excluding eats & hotels) using Geoapify Places API.
              </p>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner self-start md:self-auto">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  viewMode === 'split'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Split View (Grid + Map)"
              >
                <Columns className="h-4 w-4" />
                <span className="hidden sm:inline">Split View</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View Only"
              >
                <Grid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid Only</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  viewMode === 'map'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Full Map View"
              >
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Full Map</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center flex-wrap gap-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center mr-2">
              <Filter className="h-3.5 w-3.5 mr-1 text-indigo-400" /> Category Filter:
            </span>
            {[
              { id: 'all', label: 'All Sights' },
              { id: 'landmark', label: 'Landmarks' },
              { id: 'museum', label: 'Museums' },
              { id: 'viewpoint', label: 'Viewpoints' },
              { id: 'historical', label: 'Historical' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  categoryFilter === cat.id
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card rounded-2xl p-6 h-56 animate-pulse bg-slate-900/60 border border-slate-800">
                <div className="h-5 w-24 bg-slate-800 rounded mb-4"></div>
                <div className="h-6 w-3/4 bg-slate-800 rounded mb-3"></div>
                <div className="h-4 w-full bg-slate-800 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && errorMsg && (
          <div className="glass-panel rounded-2xl p-8 text-center my-8 border border-amber-500/30">
            <AlertCircle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-100">{errorMsg}</h3>
            <button
              onClick={loadPlaces}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition"
            >
              Retry Loading
            </button>
          </div>
        )}

        {!isLoading && !errorMsg && (
          <>
            {filteredPlaces.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center my-8">
                <p className="text-base text-slate-300 font-semibold">No sights found matching this filter.</p>
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="mt-3 text-xs text-indigo-400 underline font-medium"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div>
                {viewMode === 'split' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[720px] overflow-y-auto pr-2">
                      {filteredPlaces.map((place, idx) => (
                        <AttractionCard
                          key={place.properties?.place_id || idx}
                          place={place}
                          isSelected={selectedPlace?.properties?.name === place.properties?.name}
                          onSelect={(p) => setSelectedPlace(p)}
                          isFavorite={favorites.includes(place.properties?.place_id || place.properties?.name)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </div>

                    <div className="lg:col-span-5 h-[720px] sticky top-24">
                      <MapView
                        places={filteredPlaces}
                        cityCenter={[lat, long]}
                        selectedPlace={selectedPlace}
                        onSelectPlace={(p) => setSelectedPlace(p)}
                      />
                    </div>
                  </div>
                )}

                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlaces.map((place, idx) => (
                      <AttractionCard
                        key={place.properties?.place_id || idx}
                        place={place}
                        isSelected={selectedPlace?.properties?.name === place.properties?.name}
                        onSelect={(p) => setSelectedPlace(p)}
                        isFavorite={favorites.includes(place.properties?.place_id || place.properties?.name)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                )}

                {viewMode === 'map' && (
                  <div className="h-[750px] w-full">
                    <MapView
                      places={filteredPlaces}
                      cityCenter={[lat, long]}
                      selectedPlace={selectedPlace}
                      onSelectPlace={(p) => setSelectedPlace(p)}
                    />
                  </div>
                )}

                <SmartItineraryBuilder
                  cityName={cityName}
                  places={filteredPlaces}
                  onTripSaved={fetchSavedTripsCount}
                />
              </div>
            )}
          </>
        )}
      </main>

      <HyperDartInspector
        searchData={activeSearchData}
        isOpen={showInspector}
        onClose={() => setShowInspector(false)}
      />

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSaveApiKey={(key) => setApiKey(key)}
      />

      <SavedTripsDrawer
        isOpen={showTripsDrawer}
        onClose={() => setShowTripsDrawer(false)}
        onSelectTrip={(trip) => {
          if (trip && trip.cityName) {
            handleSearchQuery(`Tourist attractions in ${trip.cityName}`);
          }
        }}
      />

      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Compass className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">HyperDart Tourism Explorer</span>
            <span>• Standalone Component</span>
          </div>

          <p className="text-slate-400">
            Powered by Geoapify Places API, React, Tailwind CSS, Leaflet JS & Express/MongoDB.
          </p>
        </div>
      </footer>
    </div>
  );
}
