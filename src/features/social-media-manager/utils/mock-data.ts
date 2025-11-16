import {
  SocialMediaAktivator,
  CyberTroops,
  TopKomentarPostingan,
  LaporanKhusus,
  SocialMediaReport
} from '../types';

export const mockAktivator: SocialMediaAktivator[] = [
  {
    id: 1,
    no: 1,
    namaAkun: 'janganpanikinya_',
    platform: 'TIKTOK',
    jenisKonten: 'Dr Reza Bag - Bag Makanan Gratis',
    link: 'https://tiktok.com/@janganpanikinya_',
    createdAt: new Date('2025-11-11'),
    updatedAt: new Date('2025-11-11')
  }
];

export const mockCyberTroops: CyberTroops[] = [
  {
    id: 1,
    no: 1,
    namaAkun: 'janganpanikinya_',
    platform: 'TIKTOK',
    kategori: 'Positif',
    jenisIsu: 'Nikita Mirzani',
    jumlahKomentar: 160,
    jumlahLike: 50,
    link: 'https://tiktok.com/@janganpanikinya_/video/1',
    keterangan: '',
    createdAt: new Date('2025-11-11'),
    updatedAt: new Date('2025-11-11')
  },
  {
    id: 2,
    no: 2,
    namaAkun: 'tessa_mariaelya',
    platform: 'TIKTOK',
    kategori: 'Positif',
    jenisIsu: 'Nikita Mirzani',
    jumlahKomentar: 160,
    jumlahLike: 50,
    link: 'https://tiktok.com/@tessa_mariaelya/video/1',
    keterangan: '',
    createdAt: new Date('2025-11-11'),
    updatedAt: new Date('2025-11-11')
  }
];

export const mockTopKomentar: TopKomentarPostingan[] = [
  {
    id: 1,
    no: 1,
    namaAkun: 'cumicumi.com_insta',
    platform: 'INSTAGRAM',
    jumlahTopKomentar: 50,
    link: 'https://instagram.com/cumicumi.com_insta',
    keterangan: '1 Top Komen 50 Reply',
    createdAt: new Date('2025-11-11'),
    updatedAt: new Date('2025-11-11')
  },
  {
    id: 2,
    no: 2,
    namaAkun: 'likunjuk.sak01',
    platform: 'TIKTOK',
    jumlahTopKomentar: 100,
    link: 'https://tiktok.com/@likunjuk.sak01',
    keterangan: '1 Top Komen 50 Reply',
    createdAt: new Date('2025-11-11'),
    updatedAt: new Date('2025-11-11')
  }
];

export const mockLapsus: LaporanKhusus = {
  id: 1,
  tanggal: new Date('2025-11-11'),
  jumlahKomentar: 1500,
  jumlahPostingan: 1,
  keterangan:
    'Report Komentar Cyber Troops mencapai 1.500 Komentar, 1 Postingan Konten Video, 2 Top Komen 100 Reply',
  documentFiles: [
    {
      id: 1,
      fileName: 'Cyber Troops (Daily Reports, Screenshot Komentar)',
      fileUrl: '/documents/cyber-troops.pdf',
      fileType: 'application/pdf',
      fileSize: 2048000,
      uploadedAt: new Date('2025-11-11')
    },
    {
      id: 2,
      fileName: 'Laporan Komentar',
      fileUrl: '/documents/laporan-komentar.xlsx',
      fileType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      fileSize: 1024000,
      uploadedAt: new Date('2025-11-11')
    }
  ],
  createdAt: new Date('2025-11-11'),
  updatedAt: new Date('2025-11-11')
};

export const mockReport: SocialMediaReport = {
  id: 1,
  reportNo: '#088',
  tanggal: new Date('2025-11-11'),
  aktivator: mockAktivator,
  cyberTroops: mockCyberTroops,
  topKomentar: mockTopKomentar,
  lapsus: mockLapsus,
  createdAt: new Date('2025-11-11'),
  updatedAt: new Date('2025-11-11')
};
