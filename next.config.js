/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for Capacitor to find the "out" folder
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;
