/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Try adding transpilePackages for @base44/sdk
  transpilePackages: ['@base44/sdk'],
}

module.exports = nextConfig
