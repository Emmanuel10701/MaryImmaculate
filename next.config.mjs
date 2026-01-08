/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ignore ESLint entirely during build
  },
  typescript: {
    ignoreBuildErrors: true, // disables TS errors and auto-install
  },
};

module.exports = nextConfig;
