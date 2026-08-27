const path = require('path');
const packageRoot = path.resolve(__dirname, '..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ai-created/ui'],
  images: {
    qualities: [75, 85],
  },
  turbopack: {
    root: packageRoot,
    resolveAlias: {
      '@ai-created/ui': '..',
    },
  },
  webpack(config) {
    config.resolve.alias['@ai-created/ui'] = packageRoot;
    return config;
  },
};

module.exports = nextConfig;
