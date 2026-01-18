const { env } = require('process');

const target = env.services__apiservice__https__0 || env.services__apiservice__http__0;
console.log('Detected Proxy Target:', target); // DEBUG LOG


const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: target,
    secure: false,
    changeOrigin: true
  }
];

module.exports = PROXY_CONFIG;
