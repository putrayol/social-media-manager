import { NextRequest, NextResponse } from 'next/server';
import { mockReports } from '@/features/social-media-manager/utils/mock-reports';

// GET - Fetch single report
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = mockReports.find((item) => item.id === params.id);

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// PUT - Update report
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const index = mockReports.findIndex((item) => item.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const updatedReport = {
      ...mockReports[index],
      ...body,
      updatedAt: new Date()
    };

    return NextResponse.json({ success: true, data: updatedReport });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete report
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const index = mockReports.findIndex((item) => item.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const deletedReport = mockReports[index];

    return NextResponse.json({ success: true, data: deletedReport });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
