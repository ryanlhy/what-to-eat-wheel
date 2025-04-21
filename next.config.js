/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Enable static exports for deployment
  output: 'standalone',
}

module.exports = nextConfig 