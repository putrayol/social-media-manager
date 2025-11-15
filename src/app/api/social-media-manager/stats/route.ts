import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOrganization } from '@/lib/organization-utils';

// GET - Fetch aggregated statistics for dashboard
export async function GET(request: NextRequest) {
  try {
    const orgId = await requireOrganization();

    // Get date range from query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Build date filter
    const dateFilter: any = {};
    if (startDateParam && endDateParam) {
      const startDate = new Date(startDateParam);
      const endDate = new Date(endDateParam);
      dateFilter.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }

    // Get counts for each data type
    const [aktivatorCount, cyberTroopsCount, topKomentarCount] =
      await Promise.all([
        prisma.aktivator.count({
          where: { organizationId: orgId, ...dateFilter }
        }),
        prisma.cyberTroops.count({
          where: { organizationId: orgId, ...dateFilter }
        }),
        prisma.topKomentar.count({
          where: { organizationId: orgId, ...dateFilter }
        })
      ]);

    // Get total comments from cyber troops
    const cyberTroopsData = await prisma.cyberTroops.aggregate({
      where: { organizationId: orgId, ...dateFilter },
      _sum: { jumlahKomentar: true }
    });

    // Get total top comments
    const topKomentarData = await prisma.topKomentar.aggregate({
      where: { organizationId: orgId, ...dateFilter },
      _sum: { jumlahTopKomentar: true }
    });

    // Get platform distribution
    const platformDistribution = await prisma.cyberTroops.groupBy({
      by: ['platform'],
      where: { organizationId: orgId, ...dateFilter },
      _count: true
    });

    // Get category distribution (Positif/Negatif)
    const categoryDistribution = await prisma.cyberTroops.groupBy({
      by: ['kategori'],
      where: { organizationId: orgId, ...dateFilter },
      _count: true
    });

    const totalComments =
      (cyberTroopsData._sum.jumlahKomentar || 0) +
      (topKomentarData._sum.jumlahTopKomentar || 0);

    return NextResponse.json({
      success: true,
      data: {
        aktivatorCount,
        cyberTroopsCount,
        topKomentarCount,
        totalComments,
        totalTopComments: topKomentarData._sum.jumlahTopKomentar || 0,
        totalCyberComments: cyberTroopsData._sum.jumlahKomentar || 0,
        platformDistribution,
        categoryDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
