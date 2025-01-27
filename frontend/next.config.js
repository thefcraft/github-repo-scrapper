module.exports = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true, // Enable the app directory feature (if using Next.js 13+)
  },
  trailingSlash: true,
};