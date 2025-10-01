/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // appDir: true, // Remove this line since it’s not supported in 15.5.3
  },
  output: 'standalone', // ✅ Fixes the Vercel deployment issue
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
