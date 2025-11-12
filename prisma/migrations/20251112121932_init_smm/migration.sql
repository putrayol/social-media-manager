-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('TIKTOK', 'INSTAGRAM', 'FACEBOOK', 'TWITTER', 'YOUTUBE', 'OTHER');

-- CreateTable
CREATE TABLE "Aktivator" (
    "id" TEXT NOT NULL,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "jenisKonten" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aktivator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CyberTroops" (
    "id" TEXT NOT NULL,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "kategori" TEXT NOT NULL,
    "jenisIsu" TEXT NOT NULL,
    "jumlahKomentar" INTEGER NOT NULL,
    "link" TEXT,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CyberTroops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopKomentar" (
    "id" TEXT NOT NULL,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "jumlahTopKomentar" INTEGER NOT NULL,
    "link" TEXT,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopKomentar_pkey" PRIMARY KEY ("id")
);
