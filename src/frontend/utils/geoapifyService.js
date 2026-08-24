import { MOCK_PLACES_DATABASE, generateDynamicMockPlaces } from './mockData';

const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v2/places';

export const fetchTourismPlaces = async ({ lat, long, city, apiKey = '' }) => {
  const activeKey = apiKey || localStorage.getItem('geoapify_api_key') || '';

  if (!activeKey) {
    console.warn('Geoapify API key not detected. Using seamless mock dataset fallback.');
    return getFallbackPlaces(city, lat, long);
  }

  try {
    const url = `${GEOAPIFY_BASE_URL}?categories=tourism.sights&filter=circle:${long},${lat},5000&limit=20&apiKey=${activeKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      return getFallbackPlaces(city, lat, long);
    }

    const filteredFeatures = data.features.filter((feature) => {
      const cats = feature.properties?.categories || [];
      const isTourism = cats.some((c) => c.startsWith('tourism'));
      const isCateringOrLodging = cats.some((c) => c.startsWith('catering') || c.startsWith('accommodation'));
      return isTourism && !isCateringOrLodging;
    });

    return filteredFeatures.length > 0 ? filteredFeatures : data.features;
  } catch (error) {
    console.error('Failed to fetch from Geoapify Places API:', error);
    return getFallbackPlaces(city, lat, long);
  }
};

const getFallbackPlaces = (city, lat, long) => {
  if (MOCK_PLACES_DATABASE[city]) {
    return MOCK_PLACES_DATABASE[city];
  }

  const cityKey = Object.keys(MOCK_PLACES_DATABASE).find(
    (k) => k.toLowerCase() === city.toLowerCase()
  );
  if (cityKey) {
    return MOCK_PLACES_DATABASE[cityKey];
  }

  return generateDynamicMockPlaces(city, lat, long);
};
