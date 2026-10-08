"use client";

import { useEffect } from "react";

// Mendaftarkan service worker (US-13). Hanya berjalan di production
// supaya pengembangan lokal tidak terganggu cache.
export default function DaftarkanServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // PWA bersifat pelengkap: gagal mendaftar tidak mengganggu situs.
    });
  }, []);

  return null;
}
