/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
}
const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
}
module.exports = nextConfig;