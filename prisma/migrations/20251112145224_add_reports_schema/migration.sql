-- CreateTable
CREATE TABLE "SocialMediaReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportNo" TEXT NOT NULL,
    "tanggal" DATETIME NOT NULL,
    "lapsusData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LaporanKhusus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "tanggal" DATETIME NOT NULL,
    "jumlahKomentar" INTEGER NOT NULL,
    "jumlahPostingan" INTEGER NOT NULL,
    "keterangan" TEXT,
    "documentFilesData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aktivator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "jenisKonten" TEXT NOT NULL,
    "link" TEXT,
    "reportId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Aktivator_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SocialMediaReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Aktivator" ("createdAt", "id", "jenisKonten", "link", "namaAkun", "no", "platform", "updatedAt") SELECT "createdAt", "id", "jenisKonten", "link", "namaAkun", "no", "platform", "updatedAt" FROM "Aktivator";
DROP TABLE "Aktivator";
ALTER TABLE "new_Aktivator" RENAME TO "Aktivator";
CREATE TABLE "new_CyberTroops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jenisIsu" TEXT NOT NULL,
    "jumlahKomentar" INTEGER NOT NULL,
    "link" TEXT,
    "keterangan" TEXT,
    "reportId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CyberTroops_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SocialMediaReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CyberTroops" ("createdAt", "id", "jenisIsu", "jumlahKomentar", "kategori", "keterangan", "link", "namaAkun", "no", "platform", "updatedAt") SELECT "createdAt", "id", "jenisIsu", "jumlahKomentar", "kategori", "keterangan", "link", "namaAkun", "no", "platform", "updatedAt" FROM "CyberTroops";
DROP TABLE "CyberTroops";
ALTER TABLE "new_CyberTroops" RENAME TO "CyberTroops";
CREATE TABLE "new_TopKomentar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "jumlahTopKomentar" INTEGER NOT NULL,
    "link" TEXT,
    "keterangan" TEXT,
    "reportId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TopKomentar_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SocialMediaReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TopKomentar" ("createdAt", "id", "jumlahTopKomentar", "keterangan", "link", "namaAkun", "no", "platform", "updatedAt") SELECT "createdAt", "id", "jumlahTopKomentar", "keterangan", "link", "namaAkun", "no", "platform", "updatedAt" FROM "TopKomentar";
DROP TABLE "TopKomentar";
ALTER TABLE "new_TopKomentar" RENAME TO "TopKomentar";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaReport_reportNo_key" ON "SocialMediaReport"("reportNo");

-- CreateIndex
CREATE UNIQUE INDEX "LaporanKhusus_reportId_key" ON "LaporanKhusus"("reportId");
