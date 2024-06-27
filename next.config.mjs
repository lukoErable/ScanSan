/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'anime-sama.fr',
        pathname: '/s2/scans/**',
      },

      {
        protocol: 'https',
        hostname: 'cdn.statically.io',
        pathname: '/gh/Anime-Sama/IMG/img/contenu/**',
      },
    ],
  },
};

export default nextConfig;
