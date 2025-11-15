/*
  Warnings:

  - You are about to drop the column `tanggal` on the `Request` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "no" INTEGER NOT NULL,
    "tanggalMulai" DATETIME,
    "tanggalBerakhir" DATETIME,
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
INSERT INTO "new_Request" ("bonus", "createdAt", "facebookKomen", "facebookLike", "facebookPost", "id", "instagramKomen", "instagramLike", "instagramPost", "namaPaket", "no", "organizationId", "otherKomen", "otherLike", "otherPost", "tiktokKomen", "tiktokLike", "tiktokPost", "twitterKomen", "twitterLike", "twitterPost", "updatedAt", "youtubeKomen", "youtubeLike", "youtubePost") SELECT "bonus", "createdAt", "facebookKomen", "facebookLike", "facebookPost", "id", "instagramKomen", "instagramLike", "instagramPost", "namaPaket", "no", "organizationId", "otherKomen", "otherLike", "otherPost", "tiktokKomen", "tiktokLike", "tiktokPost", "twitterKomen", "twitterLike", "twitterPost", "updatedAt", "youtubeKomen", "youtubeLike", "youtubePost" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE INDEX "Request_organizationId_idx" ON "Request"("organizationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
