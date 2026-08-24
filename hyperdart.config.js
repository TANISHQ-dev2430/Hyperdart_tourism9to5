import pkg from './package.json' with { type: 'json' };

export default {
  // Component name registered on HyperDart dev platform
  name: pkg.name || '@hyperdart/tourismexplorer',
  triggers: {
    keywords: [
      'tourist attraction',
      'tourist attractions',
      'things to do',
      'places to visit',
      'landmarks',
      'sights',
      'points of interest',
      'attraction',
      'attractions',
      'famous places',
      'visit'
    ]
  },
  query_format: {
    regex: [
      '.*HD_LOCATION.*',
      '(tourist\\s+)?attractions?\\s+(in|near)?\\s*HD_LOCATION.*',
      'things\\s+to\\s+do\\s+(in|near)?\\s*HD_LOCATION.*',
      'places\\s+to\\s+visit\\s+(in|near)?\\s*HD_LOCATION.*',
      'landmarks\\s+(in|near)?\\s*HD_LOCATION.*',
      'sights\\s+(in|near)?\\s*HD_LOCATION.*',
      'points\\s+of\\s+interest\\s+(in|near)?\\s*HD_LOCATION.*',
      'famous\\s+places\\s+(in|near)?\\s*HD_LOCATION.*'
    ]
  },
  server: {
    location: 'dist/backend/index.js',
    configPath: 'dist/backend/wrangler.jsonc',
    schemaPath: 'dist/backend/schema.jsonc'
  },
  client: {
    location: pkg.module,
    moduleName: pkg.umdName || 'HD' + pkg.name,
    baseURL: '/' + pkg.name
  },
  format: {
    mainline: true,
    sidebar: true
  },
  permissions: {},
  info: {
    description: 'Surfaces popular tourist attractions, landmarks, and points of interest for a given city.'
  }
};
