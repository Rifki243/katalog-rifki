import { toko } from "@/lib/toko";

// Manifest PWA (US-13). Warnanya sama dengan token di app/globals.css.
export default function manifest() {
  return {
    name: toko.nama,
    short_name: toko.nama,
    description: toko.tagline,
    start_url: "/",
    display: "standalone",
    theme_color: "#1f6b4f",
    background_color: "#ffffff",
    lang: "id",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
