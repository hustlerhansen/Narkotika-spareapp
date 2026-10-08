import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NY START – Recovery Companion",
    short_name: "NY START",
    description: "Ett steg av gangen. Et nytt liv er mulig.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#101827",
    lang: "nb",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
