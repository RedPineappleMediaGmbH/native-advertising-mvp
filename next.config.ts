import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/advertorial',
        destination: '/artikel/funf-europaische-stadte-die-sie-diesen-sommer-fur-unter-50-euro-erreichen-konnen',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
