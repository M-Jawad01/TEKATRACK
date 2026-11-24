import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TekaTrack - Personal Finance",
    short_name: "TekaTrack",
    description: "Track your income, expenses, budgets, and financial goals.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f6f5",
    theme_color: "#0b3b2e",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}