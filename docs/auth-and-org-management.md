# Sistem Manajemen User dan Organisasi (Multi-tenancy)

Proyek ini menggunakan kombinasi **Clerk** (sebagai penyedia layanan autentikasi dan manajemen user/organisasi) dan **Prisma** (sebagai ORM ke database SQLite) untuk menerapkan arsitektur *multi-tenant*. Artinya, data satu organisasi benar-benar dipisahkan dan tidak bisa diakses oleh organisasi lain.

Berikut adalah penjelasan detail cara kerjanya secara bertahap:

## 1. Autentikasi dan Manajemen User dengan Clerk
Clerk menangani seluruh proses registrasi, login, dan manajemen organisasi (seperti mengundang anggota ke organisasi, memberikan *role*, dll).
- **File Konfigurasi Utama:** `src/components/layout/providers.tsx`
  Di file ini, aplikasi dibungkus oleh komponen `<ClerkProvider>`, yang memungkinkan seluruh aplikasi Next.js menggunakan *hooks* dan komponen bawaan Clerk.
- **Tampilan UI Autentikasi:** `src/features/auth/components/`
  File seperti `sign-in-view.tsx` dan `sign-up-view.tsx` mengatur tampilan form login dan registrasi.

## 2. Pengaturan Organisasi Aktif (Auto-Organization)
Berbeda dengan beberapa aplikasi di mana user bisa saja belum memilih organisasi, proyek ini secara **otomatis** memilih organisasi pertama milik user tersebut sebagai organisasi aktif ketika login, untuk menghindari error saat mengakses *dashboard*.
- **Hook Custom:** `src/hooks/use-auto-organization.ts`
  Hook ini memanfaatkan `useOrganization` dan `useOrganizationList` dari Clerk. Jika user login, memiliki daftar organisasi, namun belum ada yang ditetapkan sebagai yang 'aktif', maka hook ini akan memanggil `setActive({ organization: firstOrg.id })` untuk memaksa organisasi pertama menjadi aktif.

## 3. Proteksi Halaman (Routes Protection)
Tidak semua halaman bisa diakses publik. *Dashboard* harus dikunci agar hanya user dengan organisasi yang aktif yang bisa masuk.
- **Middleware:** `src/middleware.ts`
  Mengecek *request*. Jika user mengakses halaman di bawah path `/dashboard(.*)`, maka fungsi `auth.protect()` dari Clerk akan dipanggil agar request tersebut diperiksa token loginnya.
- **Komponen Guard:** `src/components/organization-guard.tsx`
  Guard ini memastikan user harus memenuhi dua syarat sebelum render UI:
  1. Status *User* sudah ter-*load*.
  2. Status *Organization* sudah ditetapkan secara otomatis lewat hook `useAutoOrganization`.
  Jika belum selesai *loading*, akan muncul "Loading...". Jika ternyata tidak ada *user*, akan tampil layar "Not Authenticated". Guard ini diimplementasikan di `src/app/dashboard/layout.tsx` untuk memayungi semua struktur halaman *dashboard*.

## 4. Isolasi Data di Database (Multi-tenancy via Prisma)
Untuk memastikan user di "Organisasi A" tidak bisa melihat laporan "Organisasi B", database dirancang sedemikian rupa dengan menyertakan atribut organisasi.
- **Skema Database:** `prisma/schema.prisma`
  Pada seluruh tabel inti seperti `Aktivator`, `CyberTroops`, `TopKomentar`, `Request`, `SocialMediaReport`, dan `LaporanKhusus`, masing-masing model memiliki satu kolom wajib:
  ```prisma
  organizationId String?  // Clerk organization ID
  ```
  Serta ditambahkan direktif `@@index([organizationId])` untuk mempercepat query berdasarkan organisasi.

## 5. Keamanan Data di Backend (API Routes)
Proteksi tak hanya di sisi UI, tetapi juga di *Route Handler* (API) yang berkomunikasi dengan Prisma.
- **File API:** Contoh pada `src/app/api/social-media-manager/reports/[id]/route.ts` atau endpoint lain di `src/app/api/social-media-manager/...`
- Setiap kali ada permintaan `GET`, `POST`, `PUT`, atau `DELETE`, API akan mengambil `orgId` dari *session* Clerk (lewat fungsi `auth()`). Apabila `orgId` ini kosong, maka *request* akan ditolak (Unauthorized 401).
- Saat melakukan *query* ke Prisma (seperti metode `.findMany()` atau `.create()`), backend **selalu menyertakan filter** `where: { organizationId: orgId }`. Aturan mutlak ini mencegah pencampuran data antar lembaga atau kebocoran akses data lintas entitas.

## Rangkuman File dan Script Kunci 📂:
- **`package.json`**: Menentukan dependensi utama seperti `@clerk/nextjs` dan `@prisma/client`.
- **`src/components/layout/providers.tsx`**: Tempat registrasi `<ClerkProvider>`.
- **`src/middleware.ts`**: Skrip Edge untuk mencegah akses tak diizinkan ke `/dashboard`.
- **`prisma/schema.prisma`**: Kerangka tabel data, semua menyematkan `organizationId`.
- **`src/hooks/use-auto-organization.ts`**: *Script* penentu _default active organization_ secara otomatis.
- **`src/components/organization-guard.tsx`**: Pintu gerbang proteksi komponen React sebelum data *dashboard* dimuat.
- **`src/app/api/social-media-manager/...`**: Beragam *script backend* penyaring *database queries* memakai klausul `where: { organizationId }` di prisma client.
