import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/bibliotheque/business-plan-manioc',
        destination: '/bibliotheque/manioc',
        permanent: true, // 301
      },
    ];
  },
};

export default nextConfig;