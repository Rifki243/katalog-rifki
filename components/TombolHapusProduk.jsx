"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Tombol from "@/components/Tombol";
import { hapusProduk } from "@/app/admin/actions";

// Komponen kecil: hanya memanggil Server Action hapusProduk, tidak menyentuh Supabase.
export default function TombolHapusProduk({ produk }) {
  const router = useRouter();
  const [pesan, setPesan] = useState(null);
  const [sedangHapus, mulaiTransisi] = useTransition();

  function handleHapus() {
    const konfirmasi = window.confirm(
      `Hapus ${produk.nama}? Tindakan ini tidak bisa dibatalkan`
    );
    if (!konfirmasi) return;

    setPesan(null);
    mulaiTransisi(async () => {
      try {
        const hasil = await hapusProduk(produk.id);

        if (hasil?.error) {
          setPesan({ jenis: "error", teks: hasil.error });
          return;
        }

        setPesan({ jenis: "sukses", teks: `Produk "${produk.nama}" dihapus.` });
        router.refresh();
      } catch {
        setPesan({
          jenis: "error",
          teks: "Gagal menghapus produk. Coba lagi.",
        });
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Tombol type="button" varian="bahaya" onClick={handleHapus} disabled={sedangHapus}>
        {sedangHapus ? "Menghapus..." : "Hapus"}
      </Tombol>
      {pesan && (
        <p
          className={
            pesan.jenis === "error"
              ? "max-w-[14rem] text-right text-xs text-bahaya"
              : "max-w-[14rem] text-right text-xs text-utama"
          }
        >
          {pesan.teks}
        </p>
      )}
    </div>
  );
}
