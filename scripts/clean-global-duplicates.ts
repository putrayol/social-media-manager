import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanGlobalDuplicates() {
  console.log('🧹 Starting global duplicate cleanup...\n');

  try {
    // Find all Aktivator records
    const aktivators = await prisma.aktivator.findMany({
      orderBy: { createdAt: 'asc' }
    });

    console.log(`Found ${aktivators.length} Aktivator records`);

    // Group by unique combination
    const aktivatorGroups = new Map<string, typeof aktivators>();
    for (const item of aktivators) {
      const key = `${item.namaAkun}-${item.platform}-${item.jenisKonten}`;
      if (!aktivatorGroups.has(key)) {
        aktivatorGroups.set(key, []);
      }
      aktivatorGroups.get(key)!.push(item);
    }

    // Delete duplicates (keep the first one)
    let aktivatorDeleted = 0;
    for (const [key, items] of aktivatorGroups) {
      if (items.length > 1) {
        console.log(
          `\n📦 Found ${items.length} Aktivator duplicates for: ${key}`
        );
        // Keep the first, delete the rest
        const toDelete = items.slice(1);
        for (const item of toDelete) {
          console.log(
            `  ❌ Deleting duplicate ID: ${item.id} (reportId: ${item.reportId})`
          );
          await prisma.aktivator.delete({ where: { id: item.id } });
          aktivatorDeleted++;
        }
      }
    }

    // Find all CyberTroops records
    const cyberTroops = await prisma.cyberTroops.findMany({
      orderBy: { createdAt: 'asc' }
    });

    console.log(`\nFound ${cyberTroops.length} CyberTroops records`);

    // Group by unique combination
    const cyberGroups = new Map<string, typeof cyberTroops>();
    for (const item of cyberTroops) {
      const key = `${item.namaAkun}-${item.platform}-${item.jenisIsu}`;
      if (!cyberGroups.has(key)) {
        cyberGroups.set(key, []);
      }
      cyberGroups.get(key)!.push(item);
    }

    // Delete duplicates
    let cyberDeleted = 0;
    for (const [key, items] of cyberGroups) {
      if (items.length > 1) {
        console.log(
          `\n📦 Found ${items.length} CyberTroops duplicates for: ${key}`
        );
        const toDelete = items.slice(1);
        for (const item of toDelete) {
          console.log(
            `  ❌ Deleting duplicate ID: ${item.id} (reportId: ${item.reportId})`
          );
          await prisma.cyberTroops.delete({ where: { id: item.id } });
          cyberDeleted++;
        }
      }
    }

    // Find all TopKomentar records
    const topKomentars = await prisma.topKomentar.findMany({
      orderBy: { createdAt: 'asc' }
    });

    console.log(`\nFound ${topKomentars.length} TopKomentar records`);

    // Group by unique combination
    const topGroups = new Map<string, typeof topKomentars>();
    for (const item of topKomentars) {
      const key = `${item.namaAkun}-${item.platform}-${item.jumlahTopKomentar}`;
      if (!topGroups.has(key)) {
        topGroups.set(key, []);
      }
      topGroups.get(key)!.push(item);
    }

    // Delete duplicates
    let topDeleted = 0;
    for (const [key, items] of topGroups) {
      if (items.length > 1) {
        console.log(
          `\n📦 Found ${items.length} TopKomentar duplicates for: ${key}`
        );
        const toDelete = items.slice(1);
        for (const item of toDelete) {
          console.log(
            `  ❌ Deleting duplicate ID: ${item.id} (reportId: ${item.reportId})`
          );
          await prisma.topKomentar.delete({ where: { id: item.id } });
          topDeleted++;
        }
      }
    }

    console.log('\n\n✅ Cleanup complete!');
    console.log(`   Aktivator deleted: ${aktivatorDeleted}`);
    console.log(`   CyberTroops deleted: ${cyberDeleted}`);
    console.log(`   TopKomentar deleted: ${topDeleted}`);
    console.log(
      `   Total deleted: ${aktivatorDeleted + cyberDeleted + topDeleted}`
    );
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanGlobalDuplicates();
