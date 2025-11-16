// Social Media Manager Types

export type Platform =
  | 'TIKTOK'
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'TWITTER'
  | 'YOUTUBE'
  | 'OTHER';
export type ContentType = 'KONTEN_GIAT' | 'BUZZER' | 'TOP_KOMENTAR' | 'LAPSUS';
export type IssueCategory = 'Positif' | 'Negatif';

// Social Media Aktivator (Report Giat Konten)
export interface SocialMediaAktivator {
  id: number;
  no: number;
  namaAkun: string;
  platform: Platform;
  jenisKonten: string;
  link: string;
  requestId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Cyber Troops (Report Giat Buzzer)
export interface CyberTroops {
  id: number;
  no: number;
  namaAkun: string;
  platform: Platform;
  kategori: IssueCategory;
  jenisIsu: string;
  jumlahKomentar: number;
  jumlahLike: number;
  link: string;
  keterangan?: string;
  requestId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Report Giat Top Komentar Postingan
export interface TopKomentarPostingan {
  id: number;
  no: number;
  namaAkun: string;
  platform: Platform;
  jumlahTopKomentar: number;
  jumlahLike: number;
  link: string;
  keterangan?: string;
  requestId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Request entity
export interface RequestItem {
  id: number;
  no: number;
  tanggalMulai?: string | null;
  tanggalBerakhir?: string | null;
  namaPaket: string;
  tiktokPost: number;
  tiktokKomen: number;
  tiktokLike: number;
  instagramPost: number;
  instagramKomen: number;
  instagramLike: number;
  facebookPost: number;
  facebookKomen: number;
  facebookLike: number;
  twitterPost: number;
  twitterKomen: number;
  twitterLike: number;
  youtubePost: number;
  youtubeKomen: number;
  youtubeLike: number;
  otherPost: number;
  otherKomen: number;
  otherLike: number;
  bonus?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Laporan Khusus (LAPSUS)
export interface LaporanKhusus {
  id: string;
  tanggal: Date;
  jumlahKomentar: number;
  jumlahPostingan: number;
  keterangan?: string;
  documentFiles: DocumentFile[];
  createdAt: Date;
  updatedAt: Date;
}

// Document File for LAPSUS
export interface DocumentFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

// Combined Report
export interface SocialMediaReport {
  id: string;
  reportNo: string;
  namaLaporan?: string;
  tanggal: Date;
  aktivator: SocialMediaAktivator[];
  cyberTroops: CyberTroops[];
  topKomentar: TopKomentarPostingan[];
  lapsus: LaporanKhusus;
  createdAt: Date;
  updatedAt: Date;
}
