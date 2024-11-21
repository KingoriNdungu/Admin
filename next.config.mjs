import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol:"https",
        hostname:"tailwindui.com",
        port:"",

      },{
        protocol:"https",
        hostname:"images.unsplash.com",
        port:"",
        
      }

    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Updated to match all paths under /api
        destination: `${baseUrl}/:path*`, // Adjusted to include the path after /api
      },
    ];
  },
};

export default nextConfig;
