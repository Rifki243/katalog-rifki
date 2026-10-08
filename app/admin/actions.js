"use server";

import { createSessionClient } from "@/lib/supabase/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function lewatkanNavigasi(err) {
  return (
    err?.message === "NEXT_REDIRECT" ||
    String(err?.digest || "").startsWith("NEXT_")
  );
}

// Koneksi sesi admin. Jika belum login, langsung dialihkan ke halaman login.
async function koneksiSesiAdmin() {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return supabase;
}

// Satu aturan validasi untuk tambah (US-08) dan ubah (US-09) produk.
function validasiProduk(formData) {
  const nama = formData.get("nama")?.toString().trim() || "";
  const kategori = formData.get("kategori")?.toString().trim() || "";
  const hargaMentah = formData.get("harga")?.toString().trim() || "";
  const foto_url = formData.get("foto_url")?.toString().trim() || "";
  const deskripsi = formData.get("deskripsi")?.toString().trim() || "";

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (!kategori) {
    return { error: "Kategori wajib diisi. Contoh: Minuman atau Camilan." };
  }

  if (!/^\d+$/.test(hargaMentah)) {
    return {
      error:
        "Harga harus berupa bilangan bulat tanpa titik atau koma, misalnya 25000.",
    };
  }

  const harga = Number(hargaMentah);
  if (!Number.isSafeInteger(harga) || harga <= 0) {
    return { error: "Harga harus berupa bilangan bulat lebih dari 0." };
  }

  return { values: { nama, harga, kategori, foto_url, deskripsi } };
}

export async function tambahProduk(prevState, formData) {
  try {
    const supabase = await koneksiSesiAdmin();

    const hasil = validasiProduk(formData);
    if (hasil.error) {
      return { error: hasil.error };
    }

    const { error } = await supabase.from("produk").insert([hasil.values]);
    if (error) {
      return { error: `Gagal menyimpan produk. ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
  } catch (err) {
    if (lewatkanNavigasi(err)) throw err;
    return { error: err?.message || "Terjadi kesalahan saat menyimpan produk." };
  }
}

export async function login(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  const email = data?.get("email")?.toString()?.trim();
  const password = data?.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: "Email atau password salah. Silakan coba lagi." };
    }
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat masuk. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function logout() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch {
    // Abaikan error jika sesi sudah tidak ada
  }

  redirect("/admin/login");
}

export const keluar = logout;

export async function gantiPassword(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  const passwordBaru = data?.get("password_baru")?.toString();
  const konfirmasiPassword = data?.get("konfirmasi_password")?.toString();

  if (!passwordBaru || passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password harus sama." };
  }

  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Sesi login telah berakhir. Silakan masuk kembali." };
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (error) {
      return { error: error.message || "Gagal mengganti password." };
    }

    return { success: true, message: "Password berhasil diganti." };
  } catch (err) {
    return {
      error: err.message || "Terjadi kesalahan saat mengganti password.",
    };
  }
}

export const changePassword = gantiPassword;

export async function ubahProduk(prevState, formData) {
  try {
    const supabase = await koneksiSesiAdmin();

    const id = formData.get("id")?.toString().trim();
    if (!id) {
      return {
        error: "Produk tidak ditemukan. Kembali ke daftar produk lalu pilih produk yang mau diubah.",
      };
    }

    const hasil = validasiProduk(formData);
    if (hasil.error) {
      return { error: hasil.error };
    }

    const { data: produkLama, error: errorCari } = await supabase
      .from("produk")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (errorCari) {
      return { error: `Gagal membaca produk. ${errorCari.message}` };
    }

    if (!produkLama) {
      return { error: "Produk tidak ditemukan. Produk mungkin sudah dihapus." };
    }

    const { error } = await supabase
      .from("produk")
      .update(hasil.values)
      .eq("id", id);

    if (error) {
      return { error: `Gagal menyimpan perubahan. ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/produk/${id}`);
    redirect("/admin");
  } catch (err) {
    if (lewatkanNavigasi(err)) throw err;
    return {
      error: err?.message || "Terjadi kesalahan saat menyimpan perubahan.",
    };
  }
}

export async function hapusProduk(id) {
  try {
    const supabase = await koneksiSesiAdmin();

    const idProduk = id?.toString().trim();
    if (!idProduk) {
      return { error: "Produk tidak ditemukan." };
    }

    const { error } = await supabase.from("produk").delete().eq("id", idProduk);
    if (error) {
      return { error: `Gagal menghapus produk. ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Produk berhasil dihapus." };
  } catch (err) {
    if (lewatkanNavigasi(err)) throw err;
    return { error: err?.message || "Terjadi kesalahan saat menghapus produk." };
  }
}

const PANJANG_NAMA_MAKS = 200;
const PANJANG_KATEGORI_MAKS = 100;
const MAX_TOKENS = 400;
const BATAS_WAKTU_AI = 20000;

export async function buatDeskripsiAI(input) {
  try {
    const supabase = await koneksiSesiAdmin();

    const nama = input?.nama?.toString().trim().slice(0, PANJANG_NAMA_MAKS) || "";
    const kategori =
      input?.kategori?.toString().trim().slice(0, PANJANG_KATEGORI_MAKS) || "";

    if (!nama) {
      return {
        error: "Isi nama produk dulu, lalu tekan tombol lagi.",
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL;

    if (!apiKey || !model) {
      return {
        error:
          "Fitur AI belum diatur. Minta pemilik proyek mengisi ANTHROPIC_API_KEY dan ANTHROPIC_MODEL di environment variable lalu deploy ulang.",
      };
    }

    const instruksi = [
      "Tulis deskripsi produk untuk katalog toko kecil dalam bahasa Indonesia.",
      `Nama produk: ${nama}.`,
      `Kategori: ${kategori || "-"}.`,
      "Tulis 1 sampai 2 kalimat, singkat dan jelas, gaya bahasa Indonesia sehari-hari.",
      "Jangan mengarang klaim yang tidak ada di informasi di atas, misalnya halal, BPOM, bahan, atau asal-usul produk.",
      "Balas hanya dengan teks deskripsi, tanpa judul atau tanda kutip.",
    ].join("\n");

    const pengendali = new AbortController();
    const batas = setTimeout(() => pengendali.abort(), BATAS_WAKTU_AI);

    try {
      const respons = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: MAX_TOKENS,
          messages: [{ role: "user", content: instruksi }],
        }),
        signal: pengendali.signal,
      });

      if (!respons.ok) {
        return {
          error: `Gagal membuat deskripsi (kode ${respons.status}). Coba lagi nanti.`,
        };
      }

      const data = await respons.json();
      const teks = data?.content?.[0]?.text?.trim();

      if (!teks) {
        return { error: "AI tidak mengembalikan teks. Coba lagi." };
      }

      return { deskripsi: teks };
    } finally {
      clearTimeout(batas);
    }
  } catch (err) {
    if (lewatkanNavigasi(err)) throw err;
    if (err?.name === "AbortError") {
      return { error: "Waktu tunggu habis. Coba lagi." };
    }
    return {
      error: err?.message || "Gagal menghubungi layanan AI. Coba lagi nanti.",
    };
  }
}
