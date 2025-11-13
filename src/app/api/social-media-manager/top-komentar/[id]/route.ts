import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch single top komentar
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const topKomentar = await prisma.topKomentar.findUnique({
      where: { id: resolvedParams.id }
    });
    if (!topKomentar) {
      return NextResponse.json(
        { success: false, error: 'Data not found' },
        { status: 404 }
      );
    }

    // Parse documentFilesData if it exists
    const topKomentarWithParsedData = {
      ...topKomentar,
      documentFiles: topKomentar.documentFilesData
        ? JSON.parse(topKomentar.documentFilesData)
        : null
    };

    return NextResponse.json({
      success: true,
      data: topKomentarWithParsedData
    });
  } catch (error) {
    console.error('Error fetching top komentar:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// PUT - Update top komentar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const body = await request.json();
    const updated = await prisma.topKomentar.update({
      where: { id: resolvedParams.id },
      data: {
        no: body.no !== undefined ? Number(body.no) : undefined,
        namaAkun: body.namaAkun,
        platform: body.platform
          ? (String(body.platform).toUpperCase() as any)
          : undefined,
        jumlahTopKomentar:
          body.jumlahTopKomentar !== undefined
            ? Number(body.jumlahTopKomentar)
            : undefined,
        link: body.link ?? undefined,
        keterangan: body.keterangan ?? undefined,
        documentFilesData: body.documentFiles
          ? JSON.stringify(body.documentFiles)
          : undefined
      }
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating top komentar:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete top komentar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const deleted = await prisma.topKomentar.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error deleting top komentar:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
