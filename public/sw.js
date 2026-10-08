// Service worker untuk PWA (US-13).
// Aturan: hanya simpan aset statis dan halaman katalog.
// JANGAN menyimpan rute /admin atau permintaan yang berkaitan dengan login.

const NAMA_CACHE = "katalog-v1";

const ASET_CADANGAN = [
  "/offline.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

function bolehDisimpan(url) {
  if (url.pathname.startsWith("/admin")) return false;
  if (url.pathname.includes("/login")) return false;
  if (url.pathname.startsWith("/api/")) return false;
  return true;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(NAMA_CACHE)
      .then((cache) => cache.addAll(ASET_CADANGAN))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((kunci) =>
        Promise.all(
          kunci.filter((kunciLama) => kunciLama !== NAMA_CACHE).map((kunciLama) => caches.delete(kunciLama))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!bolehDisimpan(url)) return;

  // Halaman (navigasi): coba jaringan dulu, simpan salinannya, kalau gagal pakai cache/offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((respons) => {
          const salinan = respons.clone();
          caches.open(NAMA_CACHE).then((cache) => cache.put(request, salinan));
          return respons;
        })
        .catch(() =>
          caches.match(request).then((tersimpan) => tersimpan || caches.match("/offline.html"))
        )
    );
    return;
  }

  // Aset statis: cache dulu, kalau tidak ada baru ambil dari jaringan.
  const asetStatis =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/produk/") ||
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "style" ||
    request.destination === "script";

  if (asetStatis) {
    event.respondWith(
      caches.match(request).then(
        (tersimpan) =>
          tersimpan ||
          fetch(request).then((respons) => {
            if (respons.ok) {
              const salinan = respons.clone();
              caches.open(NAMA_CACHE).then((cache) => cache.put(request, salinan));
            }
            return respons;
          })
      )
    );
  }
});
