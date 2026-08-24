export const MOCK_PLACES_DATABASE = {
  "New York City": [
    {
      type: "Feature",
      properties: {
        name: "Statue of Liberty National Monument",
        categories: ["tourism.sights", "tourism.attraction.landmark"],
        city: "New York City",
        state: "New York",
        country: "United States",
        formatted: "Liberty Island, New York, NY 10004, United States",
        description: "Iconic copper statue gifted by France in 1886, standing on Liberty Island as a universal symbol of freedom and democracy.",
        lon: -74.0445,
        lat: 40.6892,
        place_id: "sol_nyc_01"
      },
      geometry: {
        type: "Point",
        coordinates: [-74.0445, 40.6892]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Empire State Building",
        categories: ["tourism.sights", "tourism.attraction.viewpoint"],
        city: "New York City",
        state: "New York",
        country: "United States",
        formatted: "350 5th Ave, New York, NY 10118, United States",
        description: "Famous 102-story Art Deco skyscraper offering panoramic 360-degree views from its world-renowned observatories.",
        lon: -73.9857,
        lat: 40.7488,
        place_id: "esb_nyc_02"
      },
      geometry: {
        type: "Point",
        coordinates: [-73.9857, 40.7488]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Central Park",
        categories: ["tourism.sights", "tourism.attraction.park"],
        city: "New York City",
        state: "New York",
        country: "United States",
        formatted: "Central Park, New York, NY, United States",
        description: "Sprawling 843-acre urban oasis featuring picturesque bridges, walking trails, Bethesda Fountain, and lush meadows.",
        lon: -73.9665,
        lat: 40.7812,
        place_id: "cp_nyc_03"
      },
      geometry: {
        type: "Point",
        coordinates: [-73.9665, 40.7812]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "The Metropolitan Museum of Art (The Met)",
        categories: ["tourism.sights", "tourism.attraction.museum"],
        city: "New York City",
        state: "New York",
        country: "United States",
        formatted: "1000 5th Ave, New York, NY 10028, United States",
        description: "One of the world's largest and finest art museums, housing over two million works spanning 5,000 years of global culture.",
        lon: -73.9632,
        lat: 40.7794,
        place_id: "met_nyc_04"
      },
      geometry: {
        type: "Point",
        coordinates: [-73.9632, 40.7794]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Brooklyn Bridge",
        categories: ["tourism.sights", "tourism.attraction.landmark"],
        city: "New York City",
        state: "New York",
        country: "United States",
        formatted: "Brooklyn Bridge, New York, NY 10038, United States",
        description: "Historic hybrid cable-stayed/suspension bridge completed in 1883, connecting Manhattan and Brooklyn over the East River.",
        lon: -73.9969,
        lat: 40.7061,
        place_id: "bb_nyc_05"
      },
      geometry: {
        type: "Point",
        coordinates: [-73.9969, 40.7061]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Rockefeller Center & Top of the Rock",
        categories: ["tourism.sights", "tourism.attraction.viewpoint"],
        city: "New York City",
        state: "New York",
        country: "United States",
        formatted: "45 Rockefeller Plaza, New York, NY 10111, United States",
        description: "Famous Midtown landmark complex housing NBC Studios, Prometheus statue, and an open-air 70th-floor observation deck.",
        lon: -73.9787,
        lat: 40.7587,
        place_id: "rock_nyc_06"
      },
      geometry: {
        type: "Point",
        coordinates: [-73.9787, 40.7587]
      }
    }
  ],

  "Paris": [
    {
      type: "Feature",
      properties: {
        name: "Eiffel Tower (Tour Eiffel)",
        categories: ["tourism.sights", "tourism.attraction.landmark"],
        city: "Paris",
        country: "France",
        formatted: "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
        description: "Global cultural icon of France built in 1889 by Gustave Eiffel, offering breathtaking views over Paris.",
        lon: 2.2945,
        lat: 48.8584,
        place_id: "et_par_01"
      },
      geometry: {
        type: "Point",
        coordinates: [2.2945, 48.8584]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Louvre Museum (Musée du Louvre)",
        categories: ["tourism.sights", "tourism.attraction.museum"],
        city: "Paris",
        country: "France",
        formatted: "Rue de Rivoli, 75001 Paris, France",
        description: "The world's largest art museum and historic monument housing the Mona Lisa and Venus de Milo inside a palace with a glass pyramid.",
        lon: 2.3376,
        lat: 48.8606,
        place_id: "louv_par_02"
      },
      geometry: {
        type: "Point",
        coordinates: [2.3376, 48.8606]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Arc de Triomphe",
        categories: ["tourism.sights", "tourism.attraction.monument"],
        city: "Paris",
        country: "France",
        formatted: "Pl. Charles de Gaulle, 75008 Paris, France",
        description: "Triumphal arch standing at the western end of the Champs-Élysées, honoring those who fought for France.",
        lon: 2.2950,
        lat: 48.8738,
        place_id: "arc_par_03"
      },
      geometry: {
        type: "Point",
        coordinates: [2.2950, 48.8738]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Cathédrale Notre-Dame de Paris",
        categories: ["tourism.sights", "tourism.attraction.historical"],
        city: "Paris",
        country: "France",
        formatted: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France",
        description: "Masterpiece of French Gothic architecture situated on the Île de la Cité with famous gargoyles and rose windows.",
        lon: 2.3499,
        lat: 48.8530,
        place_id: "nd_par_04"
      },
      geometry: {
        type: "Point",
        coordinates: [2.3499, 48.8530]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Sacré-Cœur Basilica",
        categories: ["tourism.sights", "tourism.attraction.viewpoint"],
        city: "Paris",
        country: "France",
        formatted: "35 Rue du Chevalier de la Barre, 75018 Paris, France",
        description: "Travertine dome-topped basilica perched at the summit of Montmartre hill, boasting the highest view in Paris after the Eiffel Tower.",
        lon: 2.3431,
        lat: 48.8867,
        place_id: "sc_par_05"
      },
      geometry: {
        type: "Point",
        coordinates: [2.3431, 48.8867]
      }
    }
  ],

  "Kyoto": [
    {
      type: "Feature",
      properties: {
        name: "Fushimi Inari Shrine",
        categories: ["tourism.sights", "tourism.attraction.historical"],
        city: "Kyoto",
        country: "Japan",
        formatted: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto, 612-0882, Japan",
        description: "Shinto shrine famous for thousands of vermilion torii gates winding up Mount Inari through serene forest trails.",
        lon: 135.7727,
        lat: 34.9671,
        place_id: "fi_kyo_01"
      },
      geometry: {
        type: "Point",
        coordinates: [135.7727, 34.9671]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Kinkaku-ji (The Golden Pavilion)",
        categories: ["tourism.sights", "tourism.attraction.landmark"],
        city: "Kyoto",
        country: "Japan",
        formatted: "1 Kinkakujicho, Kita Ward, Kyoto, 603-8361, Japan",
        description: "Zen Buddhist temple whose top two floors are completely covered in pure gold leaf, overlooking a mirror-like pond.",
        lon: 135.7292,
        lat: 35.0394,
        place_id: "kj_kyo_02"
      },
      geometry: {
        type: "Point",
        coordinates: [135.7292, 35.0394]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Kiyomizu-dera Temple",
        categories: ["tourism.sights", "tourism.attraction.viewpoint"],
        city: "Kyoto",
        country: "Japan",
        formatted: "1-294 Kiyomizu, Higashiyama Ward, Kyoto, 605-0862, Japan",
        description: "UNESCO World Heritage site celebrated for its massive wooden stage built without a single nail, presenting sweeping views of Kyoto.",
        lon: 135.7850,
        lat: 34.9949,
        place_id: "kd_kyo_03"
      },
      geometry: {
        type: "Point",
        coordinates: [135.7850, 34.9949]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Arashiyama Bamboo Grove",
        categories: ["tourism.sights", "tourism.attraction.landmark"],
        city: "Kyoto",
        country: "Japan",
        formatted: "Ukyo Ward, Kyoto, 616-8394, Japan",
        description: "Enchanting path lined with towering bamboo stalks that rustle gently in the breeze, creating an otherworldly natural atmosphere.",
        lon: 135.6713,
        lat: 35.0170,
        place_id: "ab_kyo_04"
      },
      geometry: {
        type: "Point",
        coordinates: [135.6713, 35.0170]
      }
    }
  ],

  "Rome": [
    {
      type: "Feature",
      properties: {
        name: "Colosseum (Colosseo)",
        categories: ["tourism.sights", "tourism.attraction.historical"],
        city: "Rome",
        country: "Italy",
        formatted: "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
        description: "Ancient stone amphitheater built in 80 AD, capable of holding 50,000 spectators for gladiatorial games.",
        lon: 12.4922,
        lat: 41.8902,
        place_id: "col_rom_01"
      },
      geometry: {
        type: "Point",
        coordinates: [12.4922, 41.8902]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Pantheon",
        categories: ["tourism.sights", "tourism.attraction.monument"],
        city: "Rome",
        country: "Italy",
        formatted: "Piazza della Rotonda, 00186 Roma RM, Italy",
        description: "Best-preserved ancient Roman monument with a massive unreinforced concrete dome featuring a central open oculus.",
        lon: 12.4769,
        lat: 41.8986,
        place_id: "pan_rom_02"
      },
      geometry: {
        type: "Point",
        coordinates: [12.4769, 41.8986]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Trevi Fountain (Fontana di Trevi)",
        categories: ["tourism.sights", "tourism.attraction.landmark"],
        city: "Rome",
        country: "Italy",
        formatted: "Piazza di Trevi, 00187 Roma RM, Italy",
        description: "Breathtaking Baroque fountain designed by Nicola Salvi, famous for the tradition of throwing coins over one's shoulder.",
        lon: 12.4833,
        lat: 41.9009,
        place_id: "tf_rom_03"
      },
      geometry: {
        type: "Point",
        coordinates: [12.4833, 41.9009]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Roman Forum (Foro Romano)",
        categories: ["tourism.sights", "tourism.attraction.historical"],
        city: "Rome",
        country: "Italy",
        formatted: "Via della Salara Vecchia, 5/6, 00186 Roma RM, Italy",
        description: "Rectangular plaza surrounded by the ruins of ancient government buildings at the center of Roman civilization.",
        lon: 12.4853,
        lat: 41.8925,
        place_id: "rf_rom_04"
      },
      geometry: {
        type: "Point",
        coordinates: [12.4853, 41.8925]
      }
    }
  ]
};

export const generateDynamicMockPlaces = (cityName, lat, lon) => {
  const genericSights = [
    {
      name: `${cityName} Historic Old Town`,
      category: "tourism.attraction.historical",
      description: `Charming historic core of ${cityName} featuring cobblestone streets, traditional architecture, and vibrant public squares.`,
      latOffset: 0.005,
      lonOffset: 0.003
    },
    {
      name: `${cityName} National Museum & Cultural Center`,
      category: "tourism.attraction.museum",
      description: `Comprehensive museum showcasing the rich heritage, archaeological discoveries, and fine arts of ${cityName}.`,
      latOffset: -0.008,
      lonOffset: 0.006
    },
    {
      name: `${cityName} Panoramic Viewpoint Observatory`,
      category: "tourism.attraction.viewpoint",
      description: `Scenic vantage point offering magnificent 360-degree vistas over the ${cityName} skyline and surrounding landscape.`,
      latOffset: 0.012,
      lonOffset: -0.009
    },
    {
      name: `${cityName} Memorial Plaza & Monument`,
      category: "tourism.attraction.monument",
      description: `Grand public monument and plaza commemorating key historic moments in ${cityName}'s history.`,
      latOffset: -0.004,
      lonOffset: -0.007
    },
    {
      name: `${cityName} Botanical Gardens & Promenade`,
      category: "tourism.attraction.park",
      description: `Lush green sanctuary with exotic flora, shaded walking trails, and serene water features in ${cityName}.`,
      latOffset: 0.009,
      lonOffset: 0.011
    }
  ];

  return genericSights.map((sight, index) => {
    const sightLat = Number((lat + sight.latOffset).toFixed(5));
    const sightLon = Number((lon + sight.lonOffset).toFixed(5));
    return {
      type: "Feature",
      properties: {
        name: sight.name,
        categories: ["tourism.sights", sight.category],
        city: cityName,
        formatted: `${sight.name}, ${cityName}`,
        description: sight.description,
        lon: sightLon,
        lat: sightLat,
        place_id: `dyn_${cityName.toLowerCase().replace(/\s+/g, '_')}_${index}`
      },
      geometry: {
        type: "Point",
        coordinates: [sightLon, sightLat]
      }
    };
  });
};
