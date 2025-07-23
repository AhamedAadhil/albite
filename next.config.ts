import type {NextConfig} from 'next';

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['george-fx.github.io'],
  },
};

module.exports = withPWA(nextConfig);
