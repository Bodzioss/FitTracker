const { env } = require('process');

const target = env.services__apiservice__https__0 || env.services__apiservice__http__0;

const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: target,
    secure: false,
    changeOrigin: true
  }
];

module.exports = PROXY_CONFIG;
