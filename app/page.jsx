import KartuProduk from "@/components/KartuProduk";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { createServerClient } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const parameter = await searchParams;
  const q = parameter?.q?.toString().trim() || "";
  const kategori = parameter?.kategori?.toString().trim() || "";
  const adaFilter = Boolean(q || kategori);

  let daftarProduk = [];
  let daftarKategori = [];
  let error = null;

  try {
    const supabase = createServerClient();

    let query = supabase.from("produk").select("*").order("id", { ascending: true });

    if (q) {
      const pola = `%${q.replace(/[\\%_]/g, (karakter) => `\\${karakter}`)}%`;
      query = query.ilike("nama", pola);
    }
    if (kategori) {
      query = query.eq("kategori", kategori);
    }

    const [hasilProduk, hasilKategori] = await Promise.all([
      query,
      supabase.from("produk").select("kategori").order("kategori", { ascending: true }),
    ]);

    if (hasilProduk.error) {
      error =
        hasilProduk.error.message || "Terjadi kesalahan saat mengambil data produk.";
    } else {
      daftarProduk = hasilProduk.data || [];
    }

    if (!hasilKategori.error && hasilKategori.data) {
      daftarKategori = [
        ...new Set(hasilKategori.data.map((baris) => baris.kategori).filter(Boolean)),
      ];
    }
  } catch (err) {
    error = err.message || "Terjadi kesalahan saat menghubungkan ke database.";
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        <form
          method="GET"
          className="flex flex-col gap-3 rounded-2xl border border-garis bg-permukaan p-4 sm:flex-row sm:items-end"
        >
          <div className="sm:flex-1">
            <Input
              label="Cari produk"
              name="q"
              defaultValue={q}
              placeholder="Nama produk"
            />
          </div>
          <div className="sm:w-56">
            <Input label="Kategori" name="kategori" select defaultValue={kategori}>
              <option value="">Semua kategori</option>
              {daftarKategori.map((namaKategori) => (
                <option key={namaKategori} value={namaKategori}>
                  {namaKategori}
                </option>
              ))}
            </Input>
          </div>
          <Tombol type="submit">Terapkan filter</Tombol>
        </form>

        {error ? (
          <div className="rounded-xl border border-garis bg-permukaan p-4 text-bahaya">
            <p className="font-semibold">Gagal memuat produk</p>
            <p className="mt-1 text-sm text-teks-lembut">{error}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-garis py-12 text-center">
            <p className="text-teks-lembut">
              {adaFilter ? "Produk tidak ditemukan" : "Belum ada produk"}
            </p>
            {adaFilter && (
              <Tombol href="/" varian="garis">
                Hapus filter
              </Tombol>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
