-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CyberTroops" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jenisIsu" TEXT NOT NULL,
    "jumlahKomentar" INTEGER NOT NULL,
    "jumlahLike" INTEGER NOT NULL DEFAULT 0,
    "link" TEXT,
    "keterangan" TEXT,
    "organizationId" TEXT,
    "reportId" TEXT,
    "requestId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CyberTroops_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SocialMediaReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CyberTroops_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CyberTroops" ("createdAt", "id", "jenisIsu", "jumlahKomentar", "kategori", "keterangan", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "requestId", "updatedAt") SELECT "createdAt", "id", "jenisIsu", "jumlahKomentar", "kategori", "keterangan", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "requestId", "updatedAt" FROM "CyberTroops";
DROP TABLE "CyberTroops";
ALTER TABLE "new_CyberTroops" RENAME TO "CyberTroops";
CREATE INDEX "CyberTroops_organizationId_idx" ON "CyberTroops"("organizationId");
CREATE TABLE "new_TopKomentar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "no" INTEGER NOT NULL,
    "namaAkun" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "jumlahTopKomentar" INTEGER NOT NULL,
    "jumlahLike" INTEGER NOT NULL DEFAULT 0,
    "link" TEXT,
    "keterangan" TEXT,
    "documentFilesData" TEXT,
    "organizationId" TEXT,
    "reportId" TEXT,
    "requestId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TopKomentar_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SocialMediaReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TopKomentar_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TopKomentar" ("createdAt", "documentFilesData", "id", "jumlahTopKomentar", "keterangan", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "requestId", "updatedAt") SELECT "createdAt", "documentFilesData", "id", "jumlahTopKomentar", "keterangan", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "requestId", "updatedAt" FROM "TopKomentar";
DROP TABLE "TopKomentar";
ALTER TABLE "new_TopKomentar" RENAME TO "TopKomentar";
CREATE INDEX "TopKomentar_organizationId_idx" ON "TopKomentar"("organizationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
