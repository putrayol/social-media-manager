-- CreateTable
CREATE TABLE "Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "no" INTEGER NOT NULL,
    "tanggal" DATETIME NOT NULL,
    "namaPaket" TEXT NOT NULL,
    "tiktokPost" INTEGER NOT NULL DEFAULT 0,
    "tiktokKomen" INTEGER NOT NULL DEFAULT 0,
    "tiktokLike" INTEGER NOT NULL DEFAULT 0,
    "instagramPost" INTEGER NOT NULL DEFAULT 0,
    "instagramKomen" INTEGER NOT NULL DEFAULT 0,
    "instagramLike" INTEGER NOT NULL DEFAULT 0,
    "facebookPost" INTEGER NOT NULL DEFAULT 0,
    "facebookKomen" INTEGER NOT NULL DEFAULT 0,
    "facebookLike" INTEGER NOT NULL DEFAULT 0,
    "twitterPost" INTEGER NOT NULL DEFAULT 0,
    "twitterKomen" INTEGER NOT NULL DEFAULT 0,
    "twitterLike" INTEGER NOT NULL DEFAULT 0,
    "youtubePost" INTEGER NOT NULL DEFAULT 0,
    "youtubeKomen" INTEGER NOT NULL DEFAULT 0,
    "youtubeLike" INTEGER NOT NULL DEFAULT 0,
    "otherPost" INTEGER NOT NULL DEFAULT 0,
    "otherKomen" INTEGER NOT NULL DEFAULT 0,
    "otherLike" INTEGER NOT NULL DEFAULT 0,
    "bonus" TEXT,
    "organizationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

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
    "requestId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Aktivator_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SocialMediaReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Aktivator_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "requestId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CyberTroops_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SocialMediaReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CyberTroops_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "requestId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TopKomentar_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SocialMediaReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TopKomentar_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TopKomentar" ("createdAt", "documentFilesData", "id", "jumlahTopKomentar", "keterangan", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "updatedAt") SELECT "createdAt", "documentFilesData", "id", "jumlahTopKomentar", "keterangan", "link", "namaAkun", "no", "organizationId", "platform", "reportId", "updatedAt" FROM "TopKomentar";
DROP TABLE "TopKomentar";
ALTER TABLE "new_TopKomentar" RENAME TO "TopKomentar";
CREATE INDEX "TopKomentar_organizationId_idx" ON "TopKomentar"("organizationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Request_organizationId_idx" ON "Request"("organizationId");
