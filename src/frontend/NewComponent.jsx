import React, { useEffect, useState } from "react";
import { MapPin, Info, Key, Compass, Map, Columns, Languages, Heart } from 'lucide-react';
import MapView from './components/MapView';
import './index.css'; // CRITICAL: Import Tailwind CSS!

function NewComponent(props) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'map'
  const [translations, setTranslations] = useState({}); // cache: { originalName: translatedName }
  const [translating, setTranslating] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [radius, setRadius] = useState(20000); // default 20km in meters
  const [weather, setWeather] = useState(null);
  const [savedPlaces, setSavedPlaces] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tourism_saved') || '[]'); } catch { return []; }
  });

  const toggleSave = (place, e) => {
    e.stopPropagation();
    const id = place.properties?.place_id || place.properties?.name;
    const alreadySaved = savedPlaces.some(s => (s.properties?.place_id || s.properties?.name) === id);
    const updated = alreadySaved
      ? savedPlaces.filter(s => (s.properties?.place_id || s.properties?.name) !== id)
      : [...savedPlaces, place];
    setSavedPlaces(updated);
    localStorage.setItem('tourism_saved', JSON.stringify(updated));
  };

  const isSaved = (place) => {
    const id = place.properties?.place_id || place.properties?.name;
    return savedPlaces.some(s => (s.properties?.place_id || s.properties?.name) === id);
  };
  
  // Hardcoded default API Key as requested by user
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('geoapify_key') || '05e107f00d4c4d64afed71f19687fa44');
  const [inputKey, setInputKey] = useState('');

  // Extract location data from props.searchData — no fallback
  const getSearchData = () => {
    if (props.searchData && Array.isArray(props.searchData) && props.searchData.length > 0) return props.searchData[0];
    if (props.searchData && !Array.isArray(props.searchData) && Object.keys(props.searchData).length > 0) return props.searchData;
    return null;
  };

  const data = getSearchData();
  const hasData = Boolean(data);
  const entity = data?.entities?.[0];
  const geoInfo = entity?.entityInfo?.geo;
  
  const lat = geoInfo?.lat || geoInfo?.latitude || null;
  const lon = geoInfo?.long || geoInfo?.lon || geoInfo?.lng || geoInfo?.longitude || null;
  
  // Smart city extractor: Extract exact place name from entity.word or search query
  const resolveHeading = () => {
    if (!hasData) return null;
    if (entity?.word && entity.word.toLowerCase() !== 'india') {
      return entity.word;
    }
    if (entity?.matchedText && entity.matchedText.toLowerCase() !== 'india') {
      return entity.matchedText;
    }
    if (geoInfo?.city && geoInfo.city.toLowerCase() !== 'india') {
      return geoInfo.city;
    }
    
    const query = data?.query || (typeof props?.searchData === 'string' ? props.searchData : '');
    if (query) {
      const match = query.match(/(?:in|near|visit|around|for)\s+([A-Za-z\s]+)$/i);
      if (match && match[1]) {
        return match[1].trim();
      }
      const clean = query.replace(/tourist attractions|attractions|things to do|places to visit|sights|points of interest|famous places/gi, '').trim();
      if (clean) return clean;
    }
    
    return geoInfo?.city || entity?.word || geoInfo?.name || geoInfo?.country || "Unknown";
  };

  const rawCity = resolveHeading();
  const cityName = rawCity && typeof rawCity === 'string' 
    ? rawCity.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') 
    : null;

  useEffect(() => {
    // Notify HyperDart once on initial mount
    if (props?.messageHandlers?.componentLoaded) {
      props.messageHandlers.componentLoaded();
    }
  }, []);

  useEffect(() => {
    if (lat && lon && apiKey) {
      fetchPlaces(lat, lon, apiKey, radius);
    }
  }, [lat, lon, apiKey, radius]);

  useEffect(() => {
    if (lat && lon) {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
          if (data.current_weather) {
            setWeather(data.current_weather);
          }
        })
        .catch(() => {});
    }
  }, [lat, lon]);

  const getWeatherInfo = (code) => {
    if (code === 0) return { label: 'Clear Sky', icon: '☀️' };
    if ([1, 2].includes(code)) return { label: 'Partly Cloudy', icon: '⛅' };
    if (code === 3) return { label: 'Overcast', icon: '☁️' };
    if ([45, 48].includes(code)) return { label: 'Foggy', icon: '🌫️' };
    if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', icon: '🌦️' };
    if ([61, 63, 65, 66, 67].includes(code)) return { label: 'Rain', icon: '🌧️' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snow', icon: '❄️' };
    if ([80, 81, 82].includes(code)) return { label: 'Showers', icon: '🌧️' };
    if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: '⛈️' };
    return { label: 'Clear', icon: '☀️' };
  };

  const fetchPlaces = async (targetLat, targetLon, key, targetRadius) => {
    setLoading(true);
    setError(null);
    try {
      // Use verified categories for genuine landmarks — no tourism.attraction (returns random artworks)
      const url = `https://api.geoapify.com/v2/places?categories=tourism.sights,heritage,entertainment.museum,religion&filter=circle:${targetLon},${targetLat},${targetRadius}&limit=50&lang=en&apiKey=${key}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch places from Geoapify.");
      
      const result = await response.json();
      
      // Smart filter: keep genuine places, skip garbage entries
      const isGenuineName = (name) => {
        if (!name || name.length < 2) return false;           // Too short
        if (/^\d+$/.test(name)) return false;                 // Just a number like "46"
        if (/^(no name|unnamed|unknown)$/i.test(name)) return false;
        return true;
      };
      
      const genuinePlaces = (result.features || []).filter(p => {
        const name = p.properties?.name;
        return isGenuineName(name);
      });
      
      // Prioritize places with Wikipedia/Wikidata entries (more famous)
      const withWiki = genuinePlaces.filter(p => p.properties?.wiki_and_media || (p.properties?.details || '').includes('wiki_and_media'));
      const withoutWiki = genuinePlaces.filter(p => !p.properties?.wiki_and_media && !(p.properties?.details || '').includes('wiki_and_media'));
      
      // Show wiki places first, then the rest
      const finalPlaces = [...withWiki, ...withoutWiki].slice(0, 30);
      setPlaces(finalPlaces);
      if (finalPlaces.length > 0) {
        setSelectedPlace(finalPlaces[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (inputKey.trim()) {
      localStorage.setItem('geoapify_key', inputKey.trim());
      setApiKey(inputKey.trim());
    }
  };

  // If no search data, show empty state asking user to search
  if (!hasData) {
    return (
      <div className="w-full bg-gradient-to-b from-orange-50/40 via-white to-slate-50 text-slate-800 font-sans flex flex-col items-center justify-center p-8 sm:p-12 space-y-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-10 sm:p-14 border border-orange-200/70 shadow-lg shadow-orange-500/5 text-center w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-300/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-5">
              <Compass className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Explore Tourist Attractions</h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Search for any city or place in the search bar above to discover famous sights, landmarks, and attractions nearby.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Try searching: <strong className="text-orange-600">Agra</strong>, <strong className="text-orange-600">Paris</strong>, <strong className="text-orange-600">Tokyo</strong>, <strong className="text-orange-600">London</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-orange-50/40 via-white to-slate-50 text-slate-800 font-sans selection:bg-orange-500 selection:text-white flex flex-col max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="p-4 sm:p-6 pb-2">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-orange-200/70 shadow-lg shadow-orange-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center text-orange-600 mb-1 font-semibold text-xs tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
              <span>Resolved Location</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {cityName}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <p className="text-slate-400 font-mono text-xs">
                Lat: {lat ? Number(lat).toFixed(4) : '--'}, Lon: {lon ? Number(lon).toFixed(4) : '--'}
              </p>
              {weather && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-orange-50 border border-orange-200/80 rounded-full text-xs text-orange-900 font-medium">
                  <span>{getWeatherInfo(weather.weathercode).icon}</span>
                  <span className="font-bold">{Math.round(weather.temperature)}°C</span>
                  <span className="text-orange-700/80">({getWeatherInfo(weather.weathercode).label})</span>
                  <span className="text-slate-400 text-[11px]">· 💨 {Math.round(weather.windspeed)} km/h</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-orange-50/80 p-1 rounded-2xl border border-orange-200/60 shadow-inner">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  viewMode === 'split' 
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30' 
                    : 'text-slate-600 hover:text-orange-600'
                }`}
                title="Split View (List + Map)"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  viewMode === 'map' 
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30' 
                    : 'text-slate-600 hover:text-orange-600'
                }`}
                title="Full Map View"
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>

              <button
                onClick={() => setViewMode('saved')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  viewMode === 'saved' 
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30' 
                    : 'text-slate-600 hover:text-orange-600'
                }`}
                title="Saved Places"
              >
                <Heart className={`w-3.5 h-3.5 ${viewMode === 'saved' ? 'fill-white' : ''}`} />
                <span>Saved</span>
                {savedPlaces.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    viewMode === 'saved' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'
                  }`}>{savedPlaces.length}</span>
                )}
              </button>
            </div>

            {/* Translate Toggle */}
            <button
              onClick={async () => {
                if (Object.keys(translations).length > 0) {
                  setTranslations({});
                  return;
                }
                setTranslating(true);
                const newTranslations = {};
                const toTranslate = places.filter(p => Boolean(p.properties?.name));
                
                // Translate in parallel batches of 5 for speed
                const batchSize = 5;
                for (let i = 0; i < Math.min(toTranslate.length, 30); i += batchSize) {
                  const batch = toTranslate.slice(i, i + batchSize);
                  await Promise.all(batch.map(async (p) => {
                    try {
                      const name = p.properties.name;
                      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(name)}&langpair=autodetect|en`);
                      const data = await res.json();
                      if (data.responseData?.translatedText && data.responseData.translatedText.toLowerCase() !== name.toLowerCase()) {
                        newTranslations[name] = data.responseData.translatedText;
                      }
                    } catch (e) { /* skip failed */ }
                  }));
                }
                setTranslations(newTranslations);
                setTranslating(false);
              }}
              disabled={translating}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition ${
                Object.keys(translations).length > 0
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/30'
                  : 'bg-white text-slate-600 border-orange-200 hover:border-orange-400 hover:text-orange-600'
              }`}
              title="Translate non-English names to English"
            >
              <Languages className="w-4 h-4" />
              <span>{translating ? 'Translating...' : Object.keys(translations).length > 0 ? 'Original' : 'Translate'}</span>
            </button>

            <div className="p-3 bg-orange-500 rounded-2xl shadow-md shadow-orange-500/20 text-white hidden md:block">
              <Compass className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Main Responsive Body */}
      <div className="px-4 sm:px-6 pb-6 space-y-6">
        {/* API Key Box */}
        {!apiKey && (
          <form onSubmit={handleSaveKey} className="bg-white rounded-2xl p-6 border border-orange-200 shadow-md shadow-orange-500/5 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
              <Key className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-900 font-bold">Geoapify API Key Required</h3>
              <p className="text-sm text-slate-500">Please provide your key to fetch tourism sights.</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <input 
                type="text" 
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter API Key" 
                className="bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 w-full"
              />
              <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold shadow-md shadow-orange-600/20 transition">
                Save
              </button>
            </div>
          </form>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-center font-medium">
            Error: {error}
          </div>
        )}

        {/* Responsive Content + Minimap Layout */}
        {!loading && !error && places.length > 0 && (
          <div className="space-y-4">
            
            {/* Category Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {['All', 'Sights', 'Museums', 'Heritage', 'Religion'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Found <strong className="text-orange-600 font-bold">
                {places.filter(p => {
                  if (activeCategory === 'All') return true;
                  const catStr = p.properties?.categories?.join(' ') || '';
                  if (activeCategory === 'Sights') return catStr.includes('tourism.sights');
                  if (activeCategory === 'Museums') return catStr.includes('entertainment.museum');
                  if (activeCategory === 'Heritage') return catStr.includes('heritage');
                  if (activeCategory === 'Religion') return catStr.includes('religion');
                  return true;
                }).length}
              </strong> sights & attractions</span>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-medium text-xs focus:outline-none focus:border-orange-400 cursor-pointer"
              >
                <option value={5000}>5km radius</option>
                <option value={10000}>10km radius</option>
                <option value={20000}>20km radius</option>
                <option value={50000}>50km radius</option>
              </select>
            </div>
            
            {/* Split View Mode */}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Places Grid Column */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-0">
                  {places.filter(p => {
                    if (activeCategory === 'All') return true;
                    const catStr = Array.isArray(p.properties?.categories) 
                      ? p.properties.categories.join(' ') 
                      : (typeof p.properties?.categories === 'string' ? p.properties.categories : '');
                    if (activeCategory === 'Sights') return catStr.includes('tourism.sights');
                    if (activeCategory === 'Museums') return catStr.includes('entertainment.museum');
                    if (activeCategory === 'Heritage') return catStr.includes('heritage');
                    if (activeCategory === 'Religion') return catStr.includes('religion');
                    return true;
                  }).map((place, index) => {
                    const { name, categories, formatted, description, lon: pLon, lat: pLat } = place.properties;
                    const displayName = translations[name] || name || "Unnamed Sight";
                    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${pLat},${pLon}`;
                    const isSelected = selectedPlace?.properties?.name === name;
                    
                    const catList = Array.isArray(categories) 
                      ? categories 
                      : typeof categories === 'string' 
                        ? categories.split(' ').filter(c => c !== 'tourism' && c !== 'sights')
                        : [];
                    
                    return (
                      <div 
                        key={index} 
                        onClick={() => setSelectedPlace(place)}
                        className={`bg-white border rounded-2xl p-5 hover:shadow-lg hover:shadow-orange-500/10 transition duration-300 flex flex-col justify-between cursor-pointer ${
                          isSelected ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md' : 'border-slate-200/90 hover:border-orange-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-1">
                              {displayName}
                            </h3>
                            {translations[name] && (
                              <span className="text-[10px] text-slate-400 italic shrink-0">translated</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1.5 mt-2 mb-2.5 flex-wrap">
                            {catList.slice(0, 2).map((cat, i) => (
                              <span key={i} className="text-[11px] font-semibold px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full border border-orange-200/80">
                                {cat.split('.').pop()}
                              </span>
                            ))}
                          </div>
                          
                          {Boolean(description?.trim()) && (
                            <p className="text-slate-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                              {description}
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1 text-slate-700 text-[11px]">{formatted || "Address not provided"}</span>
                            </div>
                            
                            <div className="flex items-center justify-between pt-1">
                              <button
                                onClick={(e) => toggleSave(place, e)}
                                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition group/heart"
                                title={isSaved(place) ? 'Remove from saved' : 'Save to wishlist'}
                              >
                                <Heart className={`w-4 h-4 transition ${isSaved(place) ? 'fill-red-500 text-red-500' : 'text-slate-300 group-hover/heart:text-red-400'}`} />
                                <span className={`text-[11px] font-medium ${isSaved(place) ? 'text-red-500' : 'text-slate-400 group-hover/heart:text-red-400'}`}>
                                  {isSaved(place) ? 'Saved' : 'Save'}
                                </span>
                              </button>
                              
                              <a
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11px] text-orange-600 hover:text-orange-700 hover:underline font-bold"
                              >
                                Maps →
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sticky Minimap Column */}
                <div className="lg:col-span-5 sticky top-6">
                  <MapView 
                    places={places}
                    cityCenter={[Number(lat), Number(lon)]}
                    selectedPlace={selectedPlace}
                    onSelectPlace={(p) => setSelectedPlace(p)}
                  />
                </div>
              </div>
            )}

            {/* Map Only Mode */}
            {viewMode === 'map' && (
              <div className="w-full">
                <MapView 
                  places={places.filter(p => {
                    if (activeCategory === 'All') return true;
                    const catStr = Array.isArray(p.properties?.categories) 
                      ? p.properties.categories.join(' ') 
                      : (typeof p.properties?.categories === 'string' ? p.properties.categories : '');
                    if (activeCategory === 'Sights') return catStr.includes('tourism.sights');
                    if (activeCategory === 'Museums') return catStr.includes('entertainment.museum');
                    if (activeCategory === 'Heritage') return catStr.includes('heritage');
                    if (activeCategory === 'Religion') return catStr.includes('religion');
                    return true;
                  })}
                  cityCenter={[Number(lat), Number(lon)]}
                  selectedPlace={selectedPlace}
                  onSelectPlace={(p) => setSelectedPlace(p)}
                />
              </div>
            )}
          </div>
        )}

        {/* Saved Places View */}
        {viewMode === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span><strong className="text-orange-600 font-bold">{savedPlaces.length}</strong> saved places</span>
              {savedPlaces.length > 0 && (
                <button 
                  onClick={() => { setSavedPlaces([]); localStorage.removeItem('tourism_saved'); }}
                  className="text-red-400 hover:text-red-500 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {savedPlaces.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-orange-200/70 text-center">
                <Heart className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Saved Places Yet</h3>
                <p className="text-sm text-slate-400">Click the heart icon on any place to save it to your wishlist.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPlaces.map((place, index) => {
                  const { name, categories, formatted, lon: pLon, lat: pLat } = place.properties;
                  const displayName = translations[name] || name || "Unnamed Sight";
                  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${pLat},${pLon}`;
                  
                  const catList = Array.isArray(categories) 
                    ? categories 
                    : typeof categories === 'string' 
                      ? categories.split(' ').filter(c => c !== 'tourism' && c !== 'sights')
                      : [];
                  
                  return (
                    <div key={index} className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-300 transition duration-300 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">{displayName}</h3>
                        <div className="flex items-center gap-1.5 mt-2 mb-2.5 flex-wrap">
                          {catList.slice(0, 2).map((cat, i) => (
                            <span key={i} className="text-[11px] font-semibold px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full border border-orange-200/80">
                              {cat.split('.').pop()}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1 text-slate-700 text-[11px]">{formatted || "Address not provided"}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={(e) => toggleSave(place, e)}
                              className="flex items-center gap-1 text-red-400 hover:text-red-500 font-medium"
                            >
                              <Heart className="w-3.5 h-3.5 fill-red-500" />
                              <span className="text-[11px]">Remove</span>
                            </button>
                            <a
                              href={mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-orange-600 hover:text-orange-700 hover:underline font-bold"
                            >
                              Maps →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewComponent;