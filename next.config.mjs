/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    domains: [
      'img.freepik.com',
      'cloudflare-ipfs.com', 
      'loremflickr.com', 
      'picsum.photos', 
      'randomuser.me',
      'avatars.githubusercontent.com',
      'images.unsplash.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare-ipfs.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
