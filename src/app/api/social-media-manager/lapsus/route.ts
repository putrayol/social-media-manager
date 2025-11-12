import { NextRequest, NextResponse } from 'next/server';
import { mockLapsus } from '@/features/social-media-manager/utils/mock-data';

// GET - Fetch lapsus data
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockLapsus
    });
  } catch (error) {
    console.error('Error fetching lapsus:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Create or update lapsus
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle file uploads
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    // TODO: Process file uploads and save to storage
    const documentFiles = files.map((file) => ({
      id: Date.now().toString(),
      fileName: file.name,
      fileUrl: `/uploads/${file.name}`,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date()
    }));

    const updatedLapsus = {
      ...mockLapsus,
      ...body,
      documentFiles: [...(mockLapsus.documentFiles || []), ...documentFiles],
      updatedAt: new Date()
    };

    return NextResponse.json(
      { success: true, data: updatedLapsus },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating/updating lapsus:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
