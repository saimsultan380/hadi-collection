import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enforce consistent URLs without trailing slashes (e.g. /shop instead of /shop/)
  // to avoid search engines treating them as two distinct duplicate URLs.
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Supabase Storage — used for testimonial screenshot uploads
      // Matches any Supabase project URL (*.supabase.co)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Allow Google Maps iframe embed on the /contact page only.
  // frame-src is scoped narrowly to https://www.google.com — nothing else changed.
  async headers() {
    return [
      {
        source: "/contact",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src https://www.google.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
