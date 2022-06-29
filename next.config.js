/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.ipfsbrowser.com', 'gateway.pinata.cloud'],
  },
}

module.exports = nextConfig
