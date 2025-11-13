import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOrganization } from '@/lib/organization-utils';

// GET - Fetch all IDs that are already used in reports
export async function GET(request: NextRequest) {
  try {
    const orgId = await requireOrganization();
    const searchParams = request.nextUrl.searchParams;
    const excludeReportId = searchParams.get('excludeReportId') || null;

    // Build where clause - exclude current report if provided
    const reportWhere = excludeReportId
      ? {
          organizationId: orgId,
          id: { not: excludeReportId }
        }
      : {
          organizationId: orgId
        };

    // Fetch all reports with their related items
    const reports = await prisma.socialMediaReport.findMany({
      where: reportWhere,
      include: {
        aktivator: { select: { id: true } },
        cyberTroops: { select: { id: true } },
        topKomentar: { select: { id: true } }
      }
    });

    // Extract all used IDs
    const usedAktivatorIds = new Set<number>();
    const usedCyberIds = new Set<number>();
    const usedTopIds = new Set<number>();

    reports.forEach((report) => {
      report.aktivator.forEach((item) => {
        usedAktivatorIds.add(item.id);
      });
      report.cyberTroops.forEach((item) => {
        usedCyberIds.add(item.id);
      });
      report.topKomentar.forEach((item) => {
        usedTopIds.add(item.id);
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        aktivatorIds: Array.from(usedAktivatorIds),
        cyberTroopsIds: Array.from(usedCyberIds),
        topKomentarIds: Array.from(usedTopIds)
      }
    });
  } catch (error) {
    console.error('Error fetching used IDs:', error);

    if (error instanceof Error && error.message.includes('organization')) {
      return NextResponse.json(
        { success: false, error: 'Please select an organization first' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch used IDs' },
      { status: 500 }
    );
  }
}
