"use client";

import { useState } from "react";
import Tombol from "@/components/Tombol";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import { formatRupiah } from "@/lib/format";

const JUMLAH_MIN = 1;
const JUMLAH_MAKS = 99;

// Pemilih jumlah (US-12): Client Component kecil, tidak menyentuh Supabase.
export default function PilihJumlah({ produk }) {
  const [jumlah, setJumlah] = useState(JUMLAH_MIN);

  const total = produk.harga * jumlah;

  function ubahJumlah(selisih) {
    setJumlah((nilaiSaatIni) =>
      Math.min(JUMLAH_MAKS, Math.max(JUMLAH_MIN, nilaiSaatIni + selisih))
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">Jumlah</span>
        <div className="flex items-center gap-2">
          <Tombol
            type="button"
            varian="garis"
            onClick={() => ubahJumlah(-1)}
            disabled={jumlah <= JUMLAH_MIN}
            aria-label="Kurangi jumlah"
            className="px-3"
          >
            −
          </Tombol>
          <span className="w-8 text-center font-bold tabular-nums" aria-live="polite">
            {jumlah}
          </span>
          <Tombol
            type="button"
            varian="garis"
            onClick={() => ubahJumlah(1)}
            disabled={jumlah >= JUMLAH_MAKS}
            aria-label="Tambah jumlah"
            className="px-3"
          >
            +
          </Tombol>
        </div>
        <span className="text-xs text-teks-lembut">Maks. {JUMLAH_MAKS}</span>
      </div>

      <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-lg font-bold text-harga">
        <span className="mr-2 text-sm font-semibold">Total</span>
        {formatRupiah(total)}
      </p>

      <TombolWhatsApp produk={produk} jumlah={jumlah} />
    </div>
  );
}
