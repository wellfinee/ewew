export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
   {
    name: 'strapi::cors',
    config: {
      origin: ['http://127.0.0.1:5500'],
      methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
];

