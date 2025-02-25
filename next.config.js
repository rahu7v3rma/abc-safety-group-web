/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'abc-api-dev.doitsolutions.io',
            port: '',
            pathname: '/**',
         },
      ],
   },
};

module.exports = nextConfig;
