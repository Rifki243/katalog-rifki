import { notFound, redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { createSessionClient } from "@/lib/supabase/session";
import { ubahProduk } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

function lewatkanNavigasi(err) {
  return (
    err?.message === "NEXT_REDIRECT" || String(err?.digest || "").startsWith("NEXT_")
  );
}

// US-09 (bonus): ubah produk.
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  let produk = null;
  let error = null;

  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }

    const { data, error: queryError } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (queryError) {
      if (/invalid input syntax/i.test(queryError.message || "")) {
        produk = null;
      } else {
        error = queryError.message || "Terjadi kesalahan saat mengambil data produk.";
      }
    } else {
      produk = data || null;
    }
  } catch (err) {
    if (lewatkanNavigasi(err)) throw err;
    error = err.message || "Terjadi kesalahan saat menghubungkan ke database.";
  }

  if (!error && !produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      {error ? (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-bahaya">
          <p className="font-semibold">Gagal memuat produk</p>
          <p className="mt-1 text-sm text-teks-lembut">{error}</p>
        </div>
      ) : (
        <FormProduk
          key={produk.id}
          produk={produk}
          labelTombol="Simpan perubahan"
          action={ubahProduk}
        />
      )}
    </div>
  );
}
