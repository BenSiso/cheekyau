module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/popular',
        permanent: false,
      },
    ];
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  swcMinify: true,
};
