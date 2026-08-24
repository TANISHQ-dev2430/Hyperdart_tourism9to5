import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());

const devDomain = process.env.DEV_DOMAIN;
const stagingDomain = process.env.STAGING_DOMAIN;
const prodDomain = process.env.PROD_DOMAIN;

const allowedOrigins = [
  'http://localhost:5173',

  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  devDomain,
  stagingDomain,
  prodDomain
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);

// In-memory fallback database for trips & favorites
let memoryTrips = [
  {
    _id: 'trip_demo_1',
    title: 'Historic Paris Exploration',
    cityName: 'Paris',
    placesCount: 4,
    itinerary: [
      { period: 'Morning', placeName: 'Eiffel Tower (Tour Eiffel)', category: 'tourism.sights', description: 'Global cultural icon of France built in 1889 by Gustave Eiffel.', coordinates: [2.2945, 48.8584] },
      { period: 'Afternoon', placeName: 'Louvre Museum (Musée du Louvre)', category: 'tourism.attraction.museum', description: 'World largest art museum housing Mona Lisa.', coordinates: [2.3376, 48.8606] },
      { period: 'Evening', placeName: 'Sacré-Cœur Basilica', category: 'tourism.attraction.viewpoint', description: 'Travertine dome-topped basilica with views of Paris.', coordinates: [2.3431, 48.8867] }
    ],
    createdAt: new Date().toISOString()
  }
];

let memoryFavorites = [];

// GET /api/trips
app.get('/api/trips', (req, res) => {
  res.json({ success: true, trips: memoryTrips });
});

// POST /api/trips
app.post('/api/trips', (req, res) => {
  const { title, cityName, itinerary } = req.body;
  if (!cityName || !itinerary) {
    return res.status(400).json({ success: false, message: 'City name and itinerary are required' });
  }

  const newTrip = {
    _id: `trip_hd_${Date.now()}`,
    title: title || `Trip to ${cityName}`,
    cityName,
    placesCount: itinerary.length,
    itinerary,
    createdAt: new Date().toISOString()
  };

  memoryTrips.unshift(newTrip);
  return res.status(201).json({ success: true, trip: newTrip });
});

// DELETE /api/trips/:id
app.delete('/api/trips/:id', (req, res) => {
  const { id } = req.params;
  memoryTrips = memoryTrips.filter((t) => t._id !== id);
  return res.json({ success: true, message: 'Trip deleted' });
});

// GET /api/favorites
app.get('/api/favorites', (req, res) => {
  res.json({ success: true, favorites: memoryFavorites });
});

// POST /api/favorites/toggle
app.post('/api/favorites/toggle', (req, res) => {
  const place = req.body;
  if (!place || !place.placeId) {
    return res.status(400).json({ success: false, message: 'placeId is required' });
  }

  const idx = memoryFavorites.findIndex((f) => f.placeId === place.placeId);
  if (idx !== -1) {
    memoryFavorites.splice(idx, 1);
    return res.json({ success: true, isFavorite: false, placeId: place.placeId });
  } else {
    memoryFavorites.push(place);
    return res.json({ success: true, isFavorite: true, favorite: place });
  }
});

app.listen(3000, () => console.log('Backend server listening on port 3000'));
