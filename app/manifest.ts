import type { MetadataRoute } from "next";

/**
 * Web Application Manifest for Hadi Collection.
 * Defines site identity, theme colors, and display mode for mobile browsers
 * and home-screen bookmarks.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hadi Collection | Unstitched Suits",
    short_name: "Hadi Collection",
    description:
      "Ladies unstitched lawn, embroidered and festive suits. Elegance in every thread.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#2C2118",
    icons: [
      {
        src: "/hadi-favicon.png",
        sizes: "64x64",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
