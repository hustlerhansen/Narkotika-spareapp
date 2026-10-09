import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    // Neutral name on the home screen: nothing reveals what the app is about.
    name: "NY START",
    short_name: "NY START",
    description: "Ett steg av gangen. Et nytt liv er mulig.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F8FAFC",
    theme_color: "#101827",
    lang: "nb",
    dir: "ltr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    // Long-press on the home-screen icon: straight to help.
    shortcuts: [
      { name: "SOS", short_name: "SOS", url: "/sos", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Få hjelp", short_name: "Hjelp", url: "/hjelp", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
