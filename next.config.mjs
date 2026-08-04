/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone build: Next bundles only the files the server actually needs.
  // On the Hostinger VPS you run `node .next/standalone/server.js` (via PM2)
  // instead of shipping the whole node_modules folder.
  output: 'standalone',

  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  images: {
    // No image-optimization service on a self-hosted VPS by default,
    // so images are served as-is.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/**' },
    ],
  },

  experimental: {
    esmExternals: 'loose',
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
