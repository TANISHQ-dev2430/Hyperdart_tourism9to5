import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Compass } from 'lucide-react';

const createCustomMarkerIcon = (isSelected) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isSelected ? '#ea580c' : '#f97316'}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 filter drop-shadow-md">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="12" r="3" fill="#ffffff"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

function MapRecenter({ center, selectedPlace }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace?.properties?.lat && selectedPlace?.properties?.lon) {
      map.flyTo(
        [selectedPlace.properties.lat, selectedPlace.properties.lon],
        15,
        { duration: 1.2 }
      );
    } else if (center && center[0] && center[1]) {
      map.flyTo(center, 13, { duration: 1.2 });
    }
  }, [center, selectedPlace, map]);

  return null;
}

export default function MapView({ places = [], cityCenter = [27.1767, 78.0081], selectedPlace, onSelectPlace }) {
  const validCenter = cityCenter && cityCenter[0] && cityCenter[1] ? cityCenter : [27.1767, 78.0081];

  return (
    <div className="w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden bg-white border border-orange-200/80 shadow-lg shadow-orange-500/5 relative">
      <MapContainer
        center={validCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        <MapRecenter center={validCenter} selectedPlace={selectedPlace} />

        {places.map((place, idx) => {
          const lat = place.properties?.lat || place.geometry?.coordinates?.[1];
          const lon = place.properties?.lon || place.geometry?.coordinates?.[0];
          const name = place.properties?.name || `Sight #${idx + 1}`;
          const formatted = place.properties?.formatted || '';
          const isSelected = selectedPlace?.properties?.name === name;

          if (!lat || !lon) return null;

          return (
            <Marker
              key={place.properties?.place_id || idx}
              position={[lat, lon]}
              icon={createCustomMarkerIcon(isSelected)}
              eventHandlers={{
                click: () => onSelectPlace && onSelectPlace(place)
              }}
            >
              <Popup className="leaflet-custom-popup">
                <div className="p-1 max-w-[220px]">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-100 text-orange-700">
                    Sight
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 mb-1">{name}</h4>
                  {formatted && (
                    <p className="text-[11px] text-slate-500 flex items-start">
                      <MapPin className="h-3 w-3 mr-1 text-orange-500 shrink-0 mt-0.5" /> 
                      <span className="line-clamp-2">{formatted}</span>
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 border border-orange-200 rounded-xl px-3 py-1.5 backdrop-blur-md flex items-center space-x-2 text-xs font-semibold text-slate-700 shadow-md">
        <Compass className="h-3.5 w-3.5 text-orange-500" />
        <span>{places.length} Sights Mapped</span>
      </div>
    </div>
  );
}
