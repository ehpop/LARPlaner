/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "github.githubassets.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn0.iconfinder.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn1.iconfinder.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn2.iconfinder.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn3.iconfinder.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn4.iconfinder.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
