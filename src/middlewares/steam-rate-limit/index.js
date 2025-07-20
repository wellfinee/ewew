'use strict';

// Вот что Strapi ждёт от файла в src/middlewares/<name>/index.js
const { RateLimit } = require('koa2-ratelimit');

module.exports = (config, { strapi }) => {
  // создаём реальный ограничитель
  const limiter = RateLimit.middleware({
    interval: config.interval, // e.g. { min: 1 }
    max:      config.max,      // e.g. 5
    headers:  config.headers,  // true/false
  });

  // возвращаем функцию-обёртку, которую Strapi подцепит
  return async (ctx, next) => {
    // применяем только к вашему пути
    if (ctx.path === config.path) {
      return limiter(ctx, next);
    }
    return next();
  };
};
