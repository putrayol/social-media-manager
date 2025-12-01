import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOrganization } from '@/lib/organization-utils';

// Helper to get start and end of a day
function getDayRange(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

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

    // Get today and yesterday date ranges
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayRange = getDayRange(today);
    const yesterdayRange = getDayRange(yesterday);

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

    // Get today's counts
    const [todayAktivator, todayCyber, todayTop] = await Promise.all([
      prisma.aktivator.count({
        where: {
          organizationId: orgId,
          createdAt: { gte: todayRange.start, lte: todayRange.end }
        }
      }),
      prisma.cyberTroops.count({
        where: {
          organizationId: orgId,
          createdAt: { gte: todayRange.start, lte: todayRange.end }
        }
      }),
      prisma.topKomentar.count({
        where: {
          organizationId: orgId,
          createdAt: { gte: todayRange.start, lte: todayRange.end }
        }
      })
    ]);

    // Get yesterday's counts
    const [yesterdayAktivator, yesterdayCyber, yesterdayTop] =
      await Promise.all([
        prisma.aktivator.count({
          where: {
            organizationId: orgId,
            createdAt: { gte: yesterdayRange.start, lte: yesterdayRange.end }
          }
        }),
        prisma.cyberTroops.count({
          where: {
            organizationId: orgId,
            createdAt: { gte: yesterdayRange.start, lte: yesterdayRange.end }
          }
        }),
        prisma.topKomentar.count({
          where: {
            organizationId: orgId,
            createdAt: { gte: yesterdayRange.start, lte: yesterdayRange.end }
          }
        })
      ]);

    // Get total comments from cyber troops
    const cyberTroopsData = await prisma.cyberTroops.aggregate({
      where: { organizationId: orgId, ...dateFilter },
      _sum: { jumlahKomentar: true, jumlahLike: true }
    });

    // Get total top comments
    const topKomentarData = await prisma.topKomentar.aggregate({
      where: { organizationId: orgId, ...dateFilter },
      _sum: { jumlahTopKomentar: true, jumlahLike: true }
    });

    // Get today's aggregates
    const [todayCyberAgg, todayTopAgg] = await Promise.all([
      prisma.cyberTroops.aggregate({
        where: {
          organizationId: orgId,
          createdAt: { gte: todayRange.start, lte: todayRange.end }
        },
        _sum: { jumlahKomentar: true, jumlahLike: true }
      }),
      prisma.topKomentar.aggregate({
        where: {
          organizationId: orgId,
          createdAt: { gte: todayRange.start, lte: todayRange.end }
        },
        _sum: { jumlahTopKomentar: true, jumlahLike: true }
      })
    ]);

    // Get yesterday's aggregates
    const [yesterdayCyberAgg, yesterdayTopAgg] = await Promise.all([
      prisma.cyberTroops.aggregate({
        where: {
          organizationId: orgId,
          createdAt: { gte: yesterdayRange.start, lte: yesterdayRange.end }
        },
        _sum: { jumlahKomentar: true, jumlahLike: true }
      }),
      prisma.topKomentar.aggregate({
        where: {
          organizationId: orgId,
          createdAt: { gte: yesterdayRange.start, lte: yesterdayRange.end }
        },
        _sum: { jumlahTopKomentar: true, jumlahLike: true }
      })
    ]);

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
    const totalLikes =
      (cyberTroopsData._sum.jumlahLike || 0) +
      (topKomentarData._sum.jumlahLike || 0);

    // Calculate today vs yesterday
    const todayComments =
      (todayCyberAgg._sum.jumlahKomentar || 0) +
      (todayTopAgg._sum.jumlahTopKomentar || 0);
    const yesterdayComments =
      (yesterdayCyberAgg._sum.jumlahKomentar || 0) +
      (yesterdayTopAgg._sum.jumlahTopKomentar || 0);
    const todayLikes =
      (todayCyberAgg._sum.jumlahLike || 0) + (todayTopAgg._sum.jumlahLike || 0);
    const yesterdayLikes =
      (yesterdayCyberAgg._sum.jumlahLike || 0) +
      (yesterdayTopAgg._sum.jumlahLike || 0);

    return NextResponse.json({
      success: true,
      data: {
        aktivatorCount,
        cyberTroopsCount,
        topKomentarCount,
        totalComments,
        totalLikes,
        totalTopComments: topKomentarData._sum.jumlahTopKomentar || 0,
        totalCyberComments: cyberTroopsData._sum.jumlahKomentar || 0,
        platformDistribution,
        categoryDistribution,
        // Today vs Yesterday comparison
        comparison: {
          aktivator: { today: todayAktivator, yesterday: yesterdayAktivator },
          cyberTroops: { today: todayCyber, yesterday: yesterdayCyber },
          topKomentar: { today: todayTop, yesterday: yesterdayTop },
          comments: { today: todayComments, yesterday: yesterdayComments },
          likes: { today: todayLikes, yesterday: yesterdayLikes }
        }
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
