import type { NextConfig } from "next";
import { ProvidePlugin } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new ProvidePlugin({
          indexedDB: ["fake-indexeddb", "indexedDB"],
        })
      );
    }
    return config;
  },
};

export default nextConfig;