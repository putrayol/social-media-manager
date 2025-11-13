import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireOrganization,
  requireOrganizationAdmin
} from '@/lib/organization-utils';

// GET - Fetch single aktivator
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orgId = await requireOrganization();
    const aktivator = await prisma.aktivator.findUnique({
      where: { id: params.id }
    });

    if (!aktivator || aktivator.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: aktivator });
  } catch (error) {
    console.error('Error fetching aktivator:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// PUT - Update aktivator
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permission first
    await requireOrganizationAdmin();

    const orgId = await requireOrganization();
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.aktivator.findUnique({
      where: { id: params.id }
    });

    if (!existing || existing.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updated = await prisma.aktivator.update({
      where: { id: params.id },
      data: {
        no: body.no !== undefined ? Number(body.no) : undefined,
        namaAkun: body.namaAkun,
        platform: body.platform
          ? (String(body.platform).toUpperCase() as any)
          : undefined,
        jenisKonten: body.jenisKonten,
        link: body.link ?? undefined
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating aktivator:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

// DELETE - Delete aktivator
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permission first
    await requireOrganizationAdmin();

    const orgId = await requireOrganization();

    // Verify ownership
    const existing = await prisma.aktivator.findUnique({
      where: { id: params.id }
    });

    if (!existing || existing.organizationId !== orgId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const deleted = await prisma.aktivator.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Error deleting aktivator:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
