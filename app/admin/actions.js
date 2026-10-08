"use server";

import { createSessionClient } from "@/lib/supabase/session";
import { redirect } from "next/navigation";

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
