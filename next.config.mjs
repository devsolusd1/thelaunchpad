/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // URLs antigas /t/<mint> -> /token/<mint> (raiz e subdominios)
    return [
      {
        source: '/s/:site/t/:mint',
        destination: '/s/:site/token/:mint',
        permanent: true,
      },
      { source: '/t/:mint', destination: '/token/:mint', permanent: true },
    ];
  },
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        os: false,
        path: false,
      };
      config.plugins.push(
        new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] })
      );
    }
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
