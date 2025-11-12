-- CreateTable
CREATE TABLE "Aktivator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "jenisKonten" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CyberTroops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jenisIsu" TEXT NOT NULL,
    "jumlahKomentar" INTEGER NOT NULL,
    "link" TEXT,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TopKomentar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "jumlahTopKomentar" INTEGER NOT NULL,
    "link" TEXT,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
