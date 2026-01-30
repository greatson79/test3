import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
