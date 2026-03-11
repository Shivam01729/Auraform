/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  experimental: {
    turbopack: {
      root: '.',
    },
  },
};

module.exports = nextConfig;
