import { NextRequest, NextResponse } from 'next/server';
import { mockReports } from '@/features/social-media-manager/utils/mock-reports';

// GET - Fetch all reports
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Filter data based on search
    let filteredData = mockReports;
    if (search) {
      filteredData = mockReports.filter(
        (item) =>
          item.reportNo.toLowerCase().includes(search.toLowerCase()) ||
          item.tanggal.toLocaleDateString().includes(search)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      total: filteredData.length,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Create new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate report number
    const lastReportNo =
      mockReports[mockReports.length - 1]?.reportNo || '#087';
    const lastNumber = parseInt(lastReportNo.replace('#', ''));
    const newReportNo = `#${String(lastNumber + 1).padStart(3, '0')}`;

    const newReport = {
      id: Date.now().toString(),
      reportNo: newReportNo,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json(
      { success: true, data: newReport },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create data' },
      { status: 500 }
    );
  }
}
