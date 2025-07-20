'use strict';
const axios = require('axios');

module.exports = {
  async callback(ctx) {
    // 1) Стандартная passport‑логика
    const provider = 'steam';
    const profile = await strapi
      .plugin('users-permissions')
      .service('providers')
      .connect(provider, ctx);

    const steamId = profile.id;
    const key     = process.env.STEAM_API_KEY;
    const appId   = process.env.APP_ID;

    // 2) Собираем Steam Web API данные
    const [sum, owned, wish] = await Promise.all([
      axios.get('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/', {
        params: { key, steamids: steamId },
      }),
      axios.get('https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/', {
        params: { key, steamid: steamId, include_appinfo: true },
      }),
      axios.get(`https://store.steampowered.com/wishlist/profiles/${steamId}/wishlistdata/`),
    ]);

    const player     = sum.data.response.players?.[0] || {};
    const ownedGames = owned.data.response.games || [];
    const wishData   = wish.data || {};
    const inWishlist = Boolean(wishData[appId]);

    // 3) Создаём или обновляем пользователя Strapi
    const userData = {
      username:  player.personaname || `steam_${steamId}`,
      email:     `${steamId}@steam.local`,
      provider:  'steam',
      confirmed: true,
      blocked:   false,
      steamId,
      avatar:    player.avatarfull,
      metadata:  { ownedGames, inWishlist },
    };

    const existing = await strapi.entityService.findMany(
      'plugin::users-permissions.user',
      { filters: { steamId }, limit: 1 }
    );

    let user;
    if (existing.length) {
      user = await strapi.entityService.update(
        'plugin::users-permissions.user',
        existing[0].id,
        { data: userData }
      );
    } else {
      user = await strapi.entityService.create(
        'plugin::users-permissions.user',
        { data: userData }
      );
    }

    // 4) Отдаём JWT + профиль
    const jwt = strapi
      .plugin('users-permissions')
      .service('jwt')
      .issue({ id: user.id });

    ctx.send({ jwt, user: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      metadata: user.metadata,
    }});
  },
};