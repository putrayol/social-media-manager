import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch single cyber troops
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cyberTroops = await prisma.cyberTroops.findUnique({
      where: { id: params.id }
    });
    if (!cyberTroops) {
      return NextResponse.json(
        { success: false, error: 'Data not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: cyberTroops });
  } catch (error) {
    console.error('Error fetching cyber troops:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// PUT - Update cyber troops
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await prisma.cyberTroops.update({
      where: { id: params.id },
      data: {
        no: body.no !== undefined ? Number(body.no) : undefined,
        namaAkun: body.namaAkun,
        platform: body.platform
          ? (String(body.platform).toUpperCase() as any)
          : undefined,
        kategori: body.kategori,
        jenisIsu: body.jenisIsu,
        jumlahKomentar:
          body.jumlahKomentar !== undefined
            ? Number(body.jumlahKomentar)
            : undefined,
        link: body.link ?? undefined,
        keterangan: body.keterangan ?? undefined
      }
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating cyber troops:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete cyber troops
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await prisma.cyberTroops.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error deleting cyber troops:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
