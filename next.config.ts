// next.config.js

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["firebasestorage.googleapis.com"], // ✅ Add any other domains you use
  },
};

module.exports = nextConfig;
