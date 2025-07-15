import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  env: {
    LOGIN_EMAIL: "piyushxcoder@gmail.com",
  },
  output: "standalone",
};

export default withNextIntl(nextConfig);
