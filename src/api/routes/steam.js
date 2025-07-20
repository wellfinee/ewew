module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/api/auth/steam/callback',
      handler: 'steam.callback',
      config: { auth: false },
    },
  ],
};

