/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "github.githubassets.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: ""
      }
    ]
  }
}

module.exports = nextConfig
