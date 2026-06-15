/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:date(\\d{4}-\\d{2}-\\d{2})',
        destination: '/',
      },
    ]
  },
};

export default nextConfig;
