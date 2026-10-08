"use client";

import { useActionState, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// Nama field sama dengan kolom tabel "produk".
// Semua isian dikendalikan supaya tidak hilang saat validasi server menolak.
// Tombol AI (US-14) hanya membuat draf di isian deskripsi; data baru tersimpan saat form disimpan.
export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [state, sedangKirim, formAction] = useActionState(action, null);
  const [nilai, setNilai] = useState(() => ({
    nama: produk.nama ?? "",
    harga: produk.harga ?? "",
    kategori: produk.kategori ?? "",
    foto_url: produk.foto_url ?? "",
    deskripsi: produk.deskripsi ?? "",
  }));
  const [statusAI, setStatusAI] = useState(null);

  const memprosesAI = statusAI?.status === "memproses";

  function ubahNilai(namaField) {
    return (event) => {
      const nilaiBaru = event.target.value;
      setNilai((sebelumnya) => ({ ...sebelumnya, [namaField]: nilaiBaru }));
    };
  }

  async function handleDeskripsiAI() {
    setStatusAI({ status: "memproses" });

    try {
      const hasil = await buatDeskripsiAI({
        nama: nilai.nama,
        kategori: nilai.kategori,
      });

      if (hasil?.error) {
        setStatusAI({ status: "error", pesan: hasil.error });
        return;
      }

      if (hasil?.deskripsi) {
        setNilai((sebelumnya) => ({ ...sebelumnya, deskripsi: hasil.deskripsi }));
        setStatusAI({
          status: "sukses",
          pesan: "Draf dibuat. Periksa lalu tekan Simpan produk.",
        });
      }
    } catch {
      setStatusAI({
        status: "error",
        pesan: "Gagal membuat deskripsi. Periksa koneksi lalu coba lagi.",
      });
    }
  }

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {produk.id ? <input type="hidden" name="id" defaultValue={produk.id} /> : null}
      <Input
        label="Nama produk"
        name="nama"
        value={nilai.nama}
        onChange={ubahNilai("nama")}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="1"
        step="1"
        value={nilai.harga}
        onChange={ubahNilai("harga")}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={nilai.kategori}
        onChange={ubahNilai("kategori")}
        required
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        value={nilai.foto_url}
        onChange={ubahNilai("foto_url")}
      />
      <div className="flex flex-col gap-2">
        <Input
          label="Deskripsi"
          name="deskripsi"
          textarea
          value={nilai.deskripsi}
          onChange={ubahNilai("deskripsi")}
        />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Tombol
            type="button"
            varian="garis"
            onClick={handleDeskripsiAI}
            disabled={memprosesAI || sedangKirim}
          >
            {memprosesAI ? "Sedang membuat deskripsi..." : "Buat deskripsi dengan AI"}
          </Tombol>
          {statusAI && statusAI.status !== "memproses" && (
            <p
              className={
                statusAI.status === "error"
                  ? "text-sm text-bahaya"
                  : "text-sm text-utama"
              }
            >
              {statusAI.pesan}
            </p>
          )}
        </div>
      </div>
      {state?.error && (
        <p className="rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </p>
      )}
      <div className="flex gap-3">
        <Tombol type="submit" disabled={sedangKirim}>
          {sedangKirim ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
