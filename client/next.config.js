/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_AI_ENGINE_URL: process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://localhost:8001',
  },
  images: {
    domains: ['localhost'],
  },
  output: 'standalone',
}

module.exports = nextConfig
