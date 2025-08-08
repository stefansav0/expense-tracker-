// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // 👈 Required for using the app/ directory
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["firebasestorage.googleapis.com"], // ✅ Add more domains if needed
  },
};

module.exports = nextConfig;
