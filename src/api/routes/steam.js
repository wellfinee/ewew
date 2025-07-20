module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/auth/steam/callback',
      handler: 'steam.callback',
      config: { auth: false },
    },
  ],
};
