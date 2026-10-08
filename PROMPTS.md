# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt: Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.**

**Hasil: **

**Perbaikan: perbaikan pada page.jsx, index.js dan server.js**

## US-02 Detail produk

**Prompt: Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.**

**Hasil:**

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt: Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.**

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt: Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt: Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt: Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

## US-07 List produk di halaman admin dari database

**Prompt: Baca AGENTS.md aturan keamanan nomor 1 dan 4, DESIGN.md, dan docs/user-stories.md bagian US-07.

Ubah halaman /admin supaya menampilkan daftar produk dari tabel produk di Supabase (ambil di Server Component, urut dari yang terbaru), bukan lagi dari lib/data-contoh.js. Tampilkan lewat komponen TabelProduk yang sudah ada. Tambahkan tampilan saat belum ada produk dan pesan error yang jelas kalau pengambilan data gagal. Hapus CatatanBelumAktif dari halaman /admin yang berkaitan dengan fitur ini.**

**Hasil:**

**Perbaikan:**

## US-08 Tambah produk (harus terkunci login)

**Prompt: Baca AGENTS.md aturan keamanan nomor 1, 3, dan 4, DESIGN.md, dan docs/user-stories.md bagian US-08.

Buat halaman /admin/produk/baru dengan komponen FormProduk (isian: nama, harga, kategori, deskripsi, foto_url). Proses lewat Server Action yang memeriksa di server bahwa admin sudah login sebelum menyimpan ke tabel produk; kalau belum, tolak dan alihkan ke /admin/login. Validasi di server tanpa paket baru (nama wajib, harga bilangan bulat lebih dari 0, kategori wajib) dan tampilkan pesan error yang menjelaskan cara memperbaiki. Setelah berhasil, revalidatePath untuk /admin dan / lalu kembali ke /admin. Tambahkan tautan "Tambah produk" di halaman /admin (pakai NavAdmin atau Tombol yang sudah ada). Hapus CatatanBelumAktif dari halaman yang fiturnya selesai.**

**Hasil: halaman /admin/produk/baru tersambung ke Server Action tambahProduk di app/admin/actions.js. Cek login di server (kalau belum, redirect ke /admin/login), validasi nama wajib, kategori wajib, harga bilangan bulat lebih dari 0, pesan error menjelaskan cara memperbaiki. Setelah simpan: revalidatePath / dan /admin lalu redirect ke /admin. FormProduk dijadikan client component (useActionState) supaya pesan error tampil di halaman. Tautan "Tambah produk" sudah ada di /admin.**

**Perbaikan: semua isian FormProduk dibuat controlled (value + onChange), karena React mereset isian yang tidak dikendalikan setelah Server Action selesai sehingga input hilang saat validasi server menolak; tombol submit diberi status "Menyimpan..." dan disabled.**

## US-09 Ubah produk (harus terkunci login)

**Prompt: Baca AGENTS.md aturan keamanan nomor 1, 3, dan 4, DESIGN.md, dan docs/user-stories.md bagian US-09.

Buat halaman /admin/produk/[id]/ubah (ingat: params adalah Promise, pakai await) yang memakai ulang FormProduk dengan data produk yang sudah terisi. Kalau id tidak ditemukan, tampilkan notFound(). Simpan lewat Server Action yang memeriksa login di server dan memakai aturan validasi yang sama dengan US-08 (taruh validasinya di satu fungsi bersama, jangan menyalin kode). Setelah berhasil, revalidatePath untuk /admin, /, dan /produk/[id], lalu kembali ke /admin. Tambahkan tautan "Ubah" per baris di TabelProduk. Hapus CatatanBelumAktif dari halaman yang fiturnya selesai.**

**Hasil: halaman /admin/produk/[id]/ubah mengambil produk dari database lewat koneksi sesi admin (params di-await, id tidak valid atau tidak ada → notFound()). Server Action ubahProduk memeriksa login, memakai fungsi validasiProduk yang sama dengan US-08, update lewat koneksi sesi admin (RLS tetap berlaku), lalu revalidatePath untuk /, /admin, dan /produk/[id] sebelum kembali ke /admin. FormProduk diisi data lama dengan key={produk.id} supaya tidak bercampur antar produk.**

**Perbaikan: id yang bukan angka (invalid input syntax) diperlakukan sebagai tidak ditemukan, bukan pesan error database.**

## US-10 Hapus produk (harus terkunci login)

**Prompt: Baca AGENTS.md aturan keamanan nomor 1, 3, dan 4, DESIGN.md, dan docs/user-stories.md bagian US-10.

Tambahkan tombol "Hapus" per baris di TabelProduk, memakai Tombol varian bahaya. Sebelum menghapus, minta konfirmasi ("Hapus [nama produk]? Tindakan ini tidak bisa dibatalkan") lewat Client Component kecil yang hanya memanggil Server Action dan tidak menyentuh Supabase. Server Action wajib memeriksa login di server sebelum menghapus baris di tabel produk. Setelah berhasil, revalidatePath untuk /admin dan /, dan tampilkan pesan sukses; kalau gagal, tampilkan pesan error. Hapus CatatanBelumAktif dari halaman yang fiturnya selesai.**

**Hasil: tombol "Hapus" per baris diganti komponen baru components/TombolHapusProduk.jsx (client component, hanya memanggil Server Action hapusProduk, tidak menyentuh Supabase). Konfirmasi window.confirm "Hapus [nama]? Tindakan ini tidak bisa dibatalkan". Server Action memeriksa login, hapus lewat koneksi sesi admin (RLS), revalidatePath / dan /admin; pesan sukses/error tampil di baris dan tabel disegarkan dengan router.refresh().**

**Perbaikan: tidak ada; tombol dan pesan mengikuti varian bahaya/utama dari DESIGN.md.**

## US-11 Filter kategori atau pencarian

**Prompt: Baca AGENTS.md aturan keamanan nomor 1, DESIGN.md, dan docs/user-stories.md bagian US-11.

Di halaman katalog (/), tambahkan kolom pencarian nama produk (komponen Input, form method GET) dan pilihan kategori. Daftar kategori diambil dari tabel produk, jangan ditulis manual. Simpan pilihan di URL (?q=...&kategori=...) dan lakukan penyaringan di server saat mengambil data dari Supabase (ingat searchParams adalah Promise). Tampilkan pesan "Produk tidak ditemukan" beserta tombol untuk menghapus filter kalau hasilnya kosong. Grid tetap 2 kolom di HP dan 3 kolom di layar lebar, dan cek tampilan di lebar sekitar 390 px. Hapus CatatanBelumAktif dari halaman yang fiturnya selesai.**

**Hasil: app/page.jsx membaca searchParams (Promise) lalu menyaring di server: ilike untuk q dan eq untuk kategori, pilihan disimpan di URL (?q=...&kategori=...). Form memakai method GET dengan Input (q) dan Input varian select untuk kategori; daftar kategori diambil dari tabel produk (select kategori + dedupe), bukan ditulis manual. Hasil kosong karena filter menampilkan "Produk tidak ditemukan" + tombol "Hapus filter"; tabel kosong tanpa filter tetap "Belum ada produk". Grid tetap 2 kolom HP / 3 kolom layar lebar, form menumpuk vertikal di 390 px.**

**Perbaikan: komponen Input ditambah dukungan prop select (pakai kelas yang sama) supaya tidak membuat komponen baru; karakter % dan _ di pencarian di-escape supaya tidak jadi wildcard LIKE.**

## US-12 Pilih jumlah atau varian

**Prompt: Baca DESIGN.md dan docs/user-stories.md bagian US-12.

Di halaman /produk/[id] (params adalah Promise), tambahkan pemilih jumlah (tombol kurang dan tambah, minimal 1, maksimal 99) lewat Client Component kecil yang tidak menyentuh Supabase. Tampilkan total harga (harga x jumlah) dengan format Rupiah yang sudah dipakai di situs. Pesan WhatsApp ikut berubah, misalnya "Halo, saya ingin memesan 2 Kopi Bubuk Robusta 250 g dengan total Rp 90.000." Nomor tujuan tetap dari lib/toko.js dan teks di-encode dengan encodeURIComponent. Jangan ubah skema database atau docs/schema.sql; kalau US-12 meminta varian, kerjakan bagian jumlahnya saja dan beri tahu saya bagian varian yang butuh perubahan skema. Hapus CatatanBelumAktif dari halaman yang fiturnya selesai.**

**Hasil: components/PilihJumlah.jsx (client component, tanpa Supabase) menggantikan tombol WhatsApp langsung di halaman detail: tombol kurang/tambah (min 1, maks 99, tombol disabled di batas), tampilan Total harga × jumlah dengan formatRupiah, lalu TombolWhatsApp dengan prop jumlah. Pesan WhatsApp jadi "Halo, saya ingin memesan 2 Kopi Bubuk Robusta 250 g dengan total Rp 90.000." untuk jumlah > 1; jumlah 1 memakai pesan lama. Nomor tetap dari lib/toko.js, encode tetap encodeURIComponent. Skema database tidak diubah.**

**Perbaikan: HTML entity &minus; di JSX tombol kurang diganti karakter − langsung; tombol dapat gaya disabled (disabled:cursor-not-allowed disabled:opacity-60) di komponen Tombol.**

## US-13 Bisa di-install di HP (PWA)

**Prompt: Baca AGENTS.md aturan keamanan nomor 4, DESIGN.md, dan docs/user-stories.md bagian US-13.

Buat app/manifest.js (name dan short_name dari lib/toko.js, start_url "/", display "standalone", theme_color sama dengan warna token utama di app/globals.css, background_color sama dengan latar) beserta ikon PNG 192x192 dan 512x512 di public/icons/. Buat public/sw.js yang menyimpan aset statis dan halaman katalog dengan strategi sederhana, serta halaman cadangan saat offline. Service worker TIDAK boleh menyimpan rute /admin atau permintaan yang berkaitan dengan login. Daftarkan service worker lewat Client Component kecil, hanya di production. Tanpa paket npm baru. Kalau ikon PNG tidak bisa dibuat, buat placeholder dan beri tahu saya supaya saya ganti dengan logo toko.**

**Hasil: app/manifest.js dibuat (name/short_name dari lib/toko.js, start_url "/", display "standalone", theme_color #1f6b4f = token utama, background_color #ffffff = latar) dan ikon PNG 192/512 yang sudah ada di public/icons dipakai (termasuk purpose maskable). public/sw.js menyimpan aset statis dengan cache-first dan halaman dengan network-first + fallback cache lalu /offline.html; rute /admin, /login, dan /api dilewati (tidak pernah disimpan). Pendaftaran lewat components/DaftarkanServiceWorker.jsx hanya saat NODE_ENV production, dipasang di app/layout.jsx. Tanpa paket npm baru.**

**Perbaikan: tidak ada; ikon PNG ternyata sudah valid (magic byte dicek), jadi tidak perlu placeholder.**

## US-14 Deskripsi produk dibuat AI

**Prompt: Baca AGENTS.md aturan keamanan nomor 1, 2, 3, dan 5, DESIGN.md, dan docs/user-stories.md bagian US-14.

Di FormProduk, tambahkan tombol "Buat deskripsi dengan AI" di dekat isian deskripsi. Tombol memanggil Server Action yang memeriksa di server bahwa admin sudah login, lalu memanggil Claude API lewat fetch langsung (tanpa SDK atau paket baru) dengan input nama dan kategori produk. Instruksi ke AI: tulis deskripsi 1-2 kalimat dalam bahasa Indonesia yang singkat dan jelas, jangan mengarang klaim (halal, BPOM, bahan) yang tidak ada di input. API key dibaca dari ANTHROPIC_API_KEY dan nama model dari ANTHROPIC_MODEL (tanpa awalan NEXT_PUBLIC_); tambahkan keduanya ke .env.example dengan nilai kosong, jangan tulis key asli di kode. Batasi panjang input dan max_tokens, beri batas waktu, tampilkan status "Sedang membuat deskripsi...", dan tangani error dengan pesan yang jelas. Hasilnya masuk ke isian deskripsi sebagai draf yang masih bisa diedit, dan baru tersimpan saat admin menekan "Simpan produk". Hapus CatatanBelumAktif dari halaman yang fiturnya selesai.**

**Hasil: tombol "Buat deskripsi dengan AI" di FormProduk (type button, dekat isian deskripsi) memanggil Server Action buatDeskripsiAI: cek login dulu, baca ANTHROPIC_API_KEY dan ANTHROPIC_MODEL dari environment variable (ditambahkan ke .env.example dengan nilai kosong), fetch langsung https://api.anthropic.com/v1/messages tanpa SDK. Instruksi AI: 1-2 kalimat bahasa Indonesia, jangan mengarang klaim halal/BPOM/bahan. Input dibatasi (nama 200, kategori 100 karakter), max_tokens 400, timeout 20 detik, status "Sedang membuat deskripsi..." tampil saat proses, error ditampilkan dengan pesan jelas. Hasil masuk isian deskripsi sebagai draf yang bisa diedit dan baru tersimpan saat "Simpan produk".**

**Perbaikan: US-14 di docs/user-stories.md menyebut Gemini API tetapi prompt meminta Claude API; dikonfirmasi pakai Claude API. Tombol AI dinonaktifkan selama form sedang dikirim supaya tidak bentrok.**

