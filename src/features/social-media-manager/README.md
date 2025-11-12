# Social Media Manager Feature

Fitur Social Media Manager adalah modul CRUD lengkap untuk mengelola laporan aktivitas media sosial dengan empat kategori utama.

## Struktur Fitur

```
social-media-manager/
├── components/
│   ├── aktivator-form.tsx          # Form untuk Social Media Aktivator
│   ├── cyber-troops-form.tsx       # Form untuk Cyber Troops
│   ├── top-komentar-form.tsx       # Form untuk Top Komentar Postingan
│   ├── lapsus-form.tsx             # Form untuk Laporan Khusus dengan file upload
│   ├── social-media-listing.tsx    # Komponen listing dengan tabs
│   └── tables/
│       ├── aktivator-table.tsx
│       ├── aktivator-columns.tsx
│       ├── aktivator-cell-action.tsx
│       ├── cyber-troops-table.tsx
│       ├── cyber-troops-columns.tsx
│       ├── cyber-troops-cell-action.tsx
│       ├── top-komentar-table.tsx
│       ├── top-komentar-columns.tsx
│       └── top-komentar-cell-action.tsx
├── schemas/
│   └── form-schema.ts              # Zod validation schemas
├── types/
│   └── index.ts                    # TypeScript interfaces
└── utils/
    └── mock-data.ts                # Mock data untuk development
```

## Fitur Utama

### 1. Social Media Aktivator (Report Giat Konten)
- Nama Akun
- Platform (TikTok, Instagram, Facebook, Twitter, YouTube, Other)
- Jenis Konten
- Link Postingan

### 2. Cyber Troops (Report Giat Buzzer)
- Nama Akun
- Platform
- Kategori (Positif/Negatif)
- Jenis Isu
- Jumlah Komentar
- Link Postingan
- Keterangan

### 3. Top Komentar Postingan
- Nama Akun
- Platform
- Jumlah Top Komentar
- Link Postingan
- Keterangan

### 4. Laporan Khusus (LAPSUS)
- Tanggal Laporan
- Jumlah Komentar
- Jumlah Postingan
- Keterangan
- Upload Multiple Files (PDF, Word, Excel, Images)
- Max 10 files per upload, 10MB per file

## API Endpoints

### Aktivator
- `GET /api/social-media-manager/aktivator` - List dengan pagination & search
- `POST /api/social-media-manager/aktivator` - Create
- `GET /api/social-media-manager/aktivator/[id]` - Get detail
- `PUT /api/social-media-manager/aktivator/[id]` - Update
- `DELETE /api/social-media-manager/aktivator/[id]` - Delete

### Cyber Troops
- `GET /api/social-media-manager/cyber-troops` - List dengan pagination & search
- `POST /api/social-media-manager/cyber-troops` - Create
- `GET /api/social-media-manager/cyber-troops/[id]` - Get detail
- `PUT /api/social-media-manager/cyber-troops/[id]` - Update
- `DELETE /api/social-media-manager/cyber-troops/[id]` - Delete

### Top Komentar
- `GET /api/social-media-manager/top-komentar` - List dengan pagination & search
- `POST /api/social-media-manager/top-komentar` - Create
- `GET /api/social-media-manager/top-komentar/[id]` - Get detail
- `PUT /api/social-media-manager/top-komentar/[id]` - Update
- `DELETE /api/social-media-manager/top-komentar/[id]` - Delete

### Laporan Khusus
- `GET /api/social-media-manager/lapsus` - Get laporan
- `POST /api/social-media-manager/lapsus` - Create/Update dengan file upload

## Pages

- `/dashboard/social-media-manager` - Main listing page
- `/dashboard/social-media-manager/aktivator/create` - Create aktivator
- `/dashboard/social-media-manager/aktivator/edit/[id]` - Edit aktivator
- `/dashboard/social-media-manager/cyber-troops/create` - Create cyber troops
- `/dashboard/social-media-manager/cyber-troops/edit/[id]` - Edit cyber troops
- `/dashboard/social-media-manager/top-komentar/create` - Create top komentar
- `/dashboard/social-media-manager/top-komentar/edit/[id]` - Edit top komentar
- `/dashboard/social-media-manager/lapsus` - View laporan khusus
- `/dashboard/social-media-manager/lapsus/edit` - Edit laporan khusus

## Teknologi yang Digunakan

- **Framework**: Next.js 15 dengan App Router
- **Form Management**: React Hook Form + Zod
- **UI Components**: Shadcn UI
- **Data Tables**: TanStack Table
- **File Upload**: react-dropzone
- **Styling**: Tailwind CSS

## TODO - Database Integration

Saat ini menggunakan mock data. Untuk production, perlu:

1. Setup database (PostgreSQL/MongoDB)
2. Create database models/schemas
3. Replace mock data dengan database queries
4. Implement file storage (S3/Cloud Storage)
5. Add authentication & authorization
6. Add error handling & validation
7. Add logging & monitoring

## Catatan

- Semua form menggunakan Zod untuk validasi
- Pagination default 10 items per page
- Search functionality tersedia untuk Aktivator, Cyber Troops, dan Top Komentar
- File upload support untuk Laporan Khusus
- Responsive design untuk mobile & desktop

