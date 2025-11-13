/*
  Warnings:

  - The primary key for the `Aktivator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Aktivator` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `CyberTroops` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `CyberTroops` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `TopKomentar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `TopKomentar` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aktivator" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "jenisKonten" TEXT NOT NULL,
    "link" TEXT,
    "organizationId" TEXT,
    "reportId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Aktivator_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SocialMediaReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Aktivator" ("createdAt", "id", "jenisKonten", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "updatedAt") SELECT "createdAt", "id", "jenisKonten", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "updatedAt" FROM "Aktivator";
DROP TABLE "Aktivator";
ALTER TABLE "new_Aktivator" RENAME TO "Aktivator";
CREATE INDEX "Aktivator_organizationId_idx" ON "Aktivator"("organizationId");
CREATE TABLE "new_CyberTroops" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jenisIsu" TEXT NOT NULL,
    "jumlahKomentar" INTEGER NOT NULL,
    "link" TEXT,
    "keterangan" TEXT,
    "organizationId" TEXT,
    "reportId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CyberTroops_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SocialMediaReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CyberTroops" ("createdAt", "id", "jenisIsu", "jumlahKomentar", "kategori", "keterangan", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "updatedAt") SELECT "createdAt", "id", "jenisIsu", "jumlahKomentar", "kategori", "keterangan", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "updatedAt" FROM "CyberTroops";
DROP TABLE "CyberTroops";
ALTER TABLE "new_CyberTroops" RENAME TO "CyberTroops";
CREATE INDEX "CyberTroops_organizationId_idx" ON "CyberTroops"("organizationId");
CREATE TABLE "new_TopKomentar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "jumlahTopKomentar" INTEGER NOT NULL,
    "link" TEXT,
    "keterangan" TEXT,
    "documentFilesData" TEXT,
    "organizationId" TEXT,
    "reportId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TopKomentar_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SocialMediaReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TopKomentar" ("createdAt", "documentFilesData", "id", "jumlahTopKomentar", "keterangan", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "updatedAt") SELECT "createdAt", "documentFilesData", "id", "jumlahTopKomentar", "keterangan", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "updatedAt" FROM "TopKomentar";
DROP TABLE "TopKomentar";
ALTER TABLE "new_TopKomentar" RENAME TO "TopKomentar";
CREATE INDEX "TopKomentar_organizationId_idx" ON "TopKomentar"("organizationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
