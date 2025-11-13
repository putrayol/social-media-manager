import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDuplicates() {
  console.log('🔍 Checking for duplicate data...\n');

  try {
    // Get all reports
    const reports = await prisma.socialMediaReport.findMany({
      include: {
        aktivator: true,
        cyberTroops: true,
        topKomentar: true
      }
    });

    console.log(`Found ${reports.length} reports\n`);

    for (const report of reports) {
      console.log(`\n📋 Checking report: ${report.reportNo}`);

      // Check Aktivator duplicates
      const aktivatorMap = new Map();
      const aktivatorDuplicates = [];
      for (const item of report.aktivator) {
        const key = `${item.namaAkun}-${item.platform}-${item.jenisKonten}`;
        if (aktivatorMap.has(key)) {
          aktivatorDuplicates.push(item.id);
        } else {
          aktivatorMap.set(key, item.id);
        }
      }

      if (aktivatorDuplicates.length > 0) {
        console.log(
          `  ❌ Found ${aktivatorDuplicates.length} duplicate Aktivator entries`
        );
        await prisma.aktivator.deleteMany({
          where: { id: { in: aktivatorDuplicates } }
        });
        console.log(
          `  ✅ Deleted ${aktivatorDuplicates.length} duplicate Aktivator entries`
        );
      }

      // Check CyberTroops duplicates
      const cyberMap = new Map();
      const cyberDuplicates = [];
      for (const item of report.cyberTroops) {
        const key = `${item.namaAkun}-${item.platform}-${item.kategori}-${item.jenisIsu}`;
        if (cyberMap.has(key)) {
          cyberDuplicates.push(item.id);
        } else {
          cyberMap.set(key, item.id);
        }
      }

      if (cyberDuplicates.length > 0) {
        console.log(
          `  ❌ Found ${cyberDuplicates.length} duplicate CyberTroops entries`
        );
        await prisma.cyberTroops.deleteMany({
          where: { id: { in: cyberDuplicates } }
        });
        console.log(
          `  ✅ Deleted ${cyberDuplicates.length} duplicate CyberTroops entries`
        );
      }

      // Check TopKomentar duplicates
      const topMap = new Map();
      const topDuplicates = [];
      for (const item of report.topKomentar) {
        const key = `${item.namaAkun}-${item.platform}`;
        if (topMap.has(key)) {
          topDuplicates.push(item.id);
        } else {
          topMap.set(key, item.id);
        }
      }

      if (topDuplicates.length > 0) {
        console.log(
          `  ❌ Found ${topDuplicates.length} duplicate TopKomentar entries`
        );
        await prisma.topKomentar.deleteMany({
          where: { id: { in: topDuplicates } }
        });
        console.log(
          `  ✅ Deleted ${topDuplicates.length} duplicate TopKomentar entries`
        );
      }

      if (
        aktivatorDuplicates.length === 0 &&
        cyberDuplicates.length === 0 &&
        topDuplicates.length === 0
      ) {
        console.log(`  ✅ No duplicates found`);
      }
    }

    console.log('\n✅ Cleanup complete!');
  } catch (error) {
    console.error('❌ Error cleaning duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDuplicates();
