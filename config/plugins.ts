module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        secret: env('JWT_SECRET'),
        expiresIn: '1h',
      },
      providers: {
        steam: {
          displayName: 'Steam',
          icon:        'https://steamcommunity.com/favicon.ico',
          clientId:    env('STEAM_API_KEY'),
          clientSecret:'',  // для OpenID не нужен
          callback:    `${env('BASE_URL')}/api/auth/steam/callback`,
          strategy:    require('passport-steam').Strategy,
          options: {
            returnURL: `${env('BASE_URL')}/api/auth/steam/callback`,
            realm:     env('BASE_URL'),
            apiKey:    env('STEAM_API_KEY'),
            stateless: false,
            profile:   true,
          },
        },
      },
    },
  },
});