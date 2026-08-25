export const CITY_COORDINATES_MAP = {
  "nyc": { city: "New York City", lat: 40.71427, long: -74.00597, state: "New York", country: "United States", countryCode: "US", tz: "America/New_York", wikiQID: "Q60" },
  "new york": { city: "New York City", lat: 40.71427, long: -74.00597, state: "New York", country: "United States", countryCode: "US", tz: "America/New_York", wikiQID: "Q60" },
  "new york city": { city: "New York City", lat: 40.71427, long: -74.00597, state: "New York", country: "United States", countryCode: "US", tz: "America/New_York", wikiQID: "Q60" },
  "paris": { city: "Paris", lat: 48.85341, long: 2.3488, state: "Île-de-France", country: "France", countryCode: "FR", tz: "Europe/Paris", wikiQID: "Q90" },
  "kyoto": { city: "Kyoto", lat: 35.02107, long: 135.75385, state: "Kyoto Prefecture", country: "Japan", countryCode: "JP", tz: "Asia/Tokyo", wikiQID: "Q34651" },
  "rome": { city: "Rome", lat: 41.89193, long: 12.51133, state: "Lazio", country: "Italy", countryCode: "IT", tz: "Europe/Rome", wikiQID: "Q220" },
  "tokyo": { city: "Tokyo", lat: 35.6895, long: 139.6917, state: "Tokyo", country: "Japan", countryCode: "JP", tz: "Asia/Tokyo", wikiQID: "Q1490" },
  "london": { city: "London", lat: 51.5074, long: -0.1278, state: "England", country: "United Kingdom", countryCode: "GB", tz: "Europe/London", wikiQID: "Q84" }
};

export const parseHyperDartQuery = (rawQuery) => {
  const query = (rawQuery || "Tourist attractions in NYC").trim();
  const lowerQuery = query.toLowerCase();

  const keywords = ['tourist attraction', 'tourist attractions', 'things to do', 'places to visit', 'landmarks', 'sights', 'points of interest'];
  let matchedKeyword = "tourist attractions";
  for (const kw of keywords) {
    if (lowerQuery.includes(kw)) {
      matchedKeyword = kw;
      break;
    }
  }

  let extractedCity = "New York City";
  let resolvedGeo = CITY_COORDINATES_MAP["nyc"];

  for (const key of Object.keys(CITY_COORDINATES_MAP)) {
    if (lowerQuery.includes(key)) {
      resolvedGeo = CITY_COORDINATES_MAP[key];
      extractedCity = resolvedGeo.city;
      break;
    }
  }

  if (!resolvedGeo) {
    const cityMatch = query.match(/(?:in|near|visit)\s+([A-Za-z\s]+)$/i);
    if (cityMatch && cityMatch[1]) {
      extractedCity = cityMatch[1].trim();
      resolvedGeo = {
        city: extractedCity,
        lat: 48.85341,
        long: 2.3488,
        state: "Region",
        country: "Explore",
        countryCode: "EX",
        tz: "UTC",
        wikiQID: "Q0000"
      };
    }
  }

  return {
    component: "@tanishq1741/tourism",
    componentID: 0,
    componentPrimaryName: "Tourism Explorer",
    templateID: 0,
    entities: [
      {
        word: extractedCity,
        wgID: 1000,
        wgName: "CITIES",
        collectionName: "CITIES",
        collectionType: "HD_LOCATION",
        wgUGC: 0,
        templateID: 0,
        entityInfo: {
          geo: {
            tz: resolvedGeo.tz,
            lat: resolvedGeo.lat,
            city: resolvedGeo.city,
            long: resolvedGeo.long,
            state: resolvedGeo.state,
            country: resolvedGeo.country,
            district: null,
            stateAbb: resolvedGeo.state.substring(0, 2).toUpperCase(),
            stateCode: `${resolvedGeo.countryCode}.${resolvedGeo.state.substring(0, 2).toUpperCase()}`,
            countryQID: "Q30",
            countryCode: resolvedGeo.countryCode,
            districtCode: ""
          },
          manual: 1,
          labelSource: "wiki"
        },
        compInfo: null,
        entityType: "LOCATION",
        sourceID: "5128581",
        IDs: {
          wikiQID: resolvedGeo.wikiQID,
          TPcityID: 20857,
          geonameID: 5128581
        },
        componentName: "@tanishq1741/tourism",
        componentID: 0,
        info: {
          Type: "cities"
        },
        description: `Popular tourism location: ${resolvedGeo.city}`,
        qualifierReqd: 0,
        priority: 3,
        isEnabled: 1,
        keywordRequired: 0,
        primaryText: "",
        relevanceScore: 100,
        sourceValue: 9454995,
        index: query.indexOf(extractedCity) !== -1 ? query.indexOf(extractedCity) : 23,
        wgInfo: {
          Type: "cities"
        },
        primaryID: "5128581"
      }
    ],
    query: query,
    componentEnabled: true,
    keyword: [
      {
        word: matchedKeyword,
        description: ""
      }
    ],
    compInfo: null,
    queryTerm: query.toLowerCase(),
    disambiguationType: 3,
    userLocation: {
      position: {
        coords: {
          latitude: 26.4631,
          longitude: 80.3479
        },
        city: "Kanpur",
        country: "India",
        countryCode: "IN",
        place: "Uttar Pradesh",
        timezone: ["Asia/Kolkata"]
      },
      source: "ip",
      time: Date.now()
    },
    ugc: false,
    time: new Date().toISOString(),
    qualifierReqd: false,
    genericQuery: `${matchedKeyword} in HD_LOCATION__CITIES`,
    unambiguous: true,
    unresolvedQuery: "",
    queryRegex: "tourist\\s+attractions?\\s+(in|near)\\s+HD_LOCATION__([^\\s]+)(__\\w+)?.*",
    explain: {
      tC: 26,
      uC: 0,
      tW: 4,
      uW: 0,
      pR: 100
    },
    wgUGC: false,
    quickView: 3,
    suggestedPlace: "sidebar",
    _processedQuery: query.toLowerCase(),
    _disambiguationType: 3,
    componentType: "internal"
  };
};
