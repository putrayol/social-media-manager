# Implementasi Filter ID yang Sudah Digunakan di Report

## Ringkasan Perubahan

Fitur ini memastikan bahwa ketika membuat report baru, hanya social media activator, cyber troops, dan top komentar yang belum digunakan di report lain yang ditampilkan dalam hasil pencarian.

## File yang Diubah/Dibuat

### 1. API Endpoint Baru
**File:** `src/app/api/social-media-manager/reports/used-ids/route.ts`

Endpoint ini mengembalikan semua ID yang sudah digunakan di report lain:
- GET `/api/social-media-manager/reports/used-ids`
- Query parameter: `excludeReportId` (opsional) - untuk exclude report tertentu saat edit

Response:
```json
{
  "success": true,
  "data": {
    "aktivatorIds": [1, 2, 3],
    "cyberTroopsIds": [10, 11, 12],
    "topKomentarIds": [100, 101, 102]
  }
}
```

### 2. Modifikasi Report Form
**File:** `src/features/social-media-manager/components/report-form.tsx`

Perubahan:
- Tambah state `usedIds` untuk menyimpan ID yang sudah digunakan
- Tambah fungsi `fetchUsedIds()` untuk fetch data dari API
- Update search effects untuk filter hasil berdasarkan `usedIds`
- Panggil `fetchUsedIds()` di useEffect saat component mount

## Cara Kerja

1. Saat halaman report form dibuka, `fetchUsedIds()` dipanggil
2. API endpoint mengembalikan semua ID yang sudah digunakan di report lain
3. Ketika user mencari aktivator/cyber troops/top komentar, hasil pencarian di-filter
4. Hanya item yang ID-nya tidak ada di `usedIds` yang ditampilkan
5. Saat edit report, `excludeReportId` dikirim untuk exclude report yang sedang diedit

## Testing Manual

### Scenario 1: Membuat Report Pertama
1. Buka http://localhost:3001/dashboard/social-media-manager/reports/
2. Klik "Buat Laporan Pertama" atau "Buat Laporan Baru"
3. Di section "A. Social Media Aktivator", klik "Add"
4. Cari aktivator - semua item harus ditampilkan (karena belum ada report lain)
5. Pilih beberapa item dan simpan report

### Scenario 2: Membuat Report Kedua
1. Buat report baru lagi
2. Di section "A. Social Media Aktivator", klik "Add"
3. Cari aktivator - item yang sudah digunakan di report pertama TIDAK ditampilkan
4. Hanya item baru yang belum digunakan yang ditampilkan

### Scenario 3: Edit Report
1. Buka report yang sudah dibuat
2. Klik "Edit"
3. Di section "A. Social Media Aktivator", klik "Add"
4. Cari aktivator - item yang digunakan di report LAIN ditampilkan, tapi item dari report ini sendiri tidak di-filter

## Verifikasi

Untuk memverifikasi implementasi:

1. **Check API Response:**
   - Buka DevTools > Network
   - Cari request ke `/api/social-media-manager/reports/used-ids`
   - Verifikasi response mengembalikan ID yang benar

2. **Check Search Results:**
   - Buka DevTools > Console
   - Saat search, lihat apakah hasil di-filter dengan benar
   - Bandingkan dengan data di database

3. **Check Database:**
   - Buka Prisma Studio: `npm run prisma:studio`
   - Lihat tabel `Aktivator`, `CyberTroops`, `TopKomentar`
   - Verifikasi `reportId` field untuk melihat item mana yang sudah digunakan

