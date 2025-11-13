-- AlterTable
ALTER TABLE "Aktivator" ADD COLUMN "organizationId" TEXT;

-- AlterTable
ALTER TABLE "CyberTroops" ADD COLUMN "organizationId" TEXT;

-- AlterTable
ALTER TABLE "LaporanKhusus" ADD COLUMN "organizationId" TEXT;

-- AlterTable
ALTER TABLE "SocialMediaReport" ADD COLUMN "organizationId" TEXT;

-- AlterTable
ALTER TABLE "TopKomentar" ADD COLUMN "organizationId" TEXT;

-- CreateIndex
CREATE INDEX "Aktivator_organizationId_idx" ON "Aktivator"("organizationId");

-- CreateIndex
CREATE INDEX "CyberTroops_organizationId_idx" ON "CyberTroops"("organizationId");

-- CreateIndex
CREATE INDEX "LaporanKhusus_organizationId_idx" ON "LaporanKhusus"("organizationId");

-- CreateIndex
CREATE INDEX "SocialMediaReport_organizationId_idx" ON "SocialMediaReport"("organizationId");

-- CreateIndex
CREATE INDEX "TopKomentar_organizationId_idx" ON "TopKomentar"("organizationId");
