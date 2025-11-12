import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');

    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles = [];

    for (const file of files) {
      try {
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, error: `File ${file.name} exceeds 10MB limit` },
            { status: 400 }
          );
        }

        // Validate file type by extension and MIME type
        const allowedExtensions = [
          'pdf',
          'doc',
          'docx',
          'xls',
          'xlsx',
          'jpg',
          'jpeg',
          'png',
          'webp',
          'gif'
        ];

        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

        if (!allowedExtensions.includes(fileExtension)) {
          return NextResponse.json(
            {
              success: false,
              error: `File type .${fileExtension} not allowed`
            },
            { status: 400 }
          );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const filename = `${timestamp}-${random}.${fileExtension}`;

        // Save file
        const buffer = await file.arrayBuffer();
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, Buffer.from(buffer));

        uploadedFiles.push({
          id: `${timestamp}-${random}`,
          fileName: file.name,
          fileUrl: `/uploads/${filename}`,
          fileType: file.type || `application/${fileExtension}`,
          fileSize: file.size,
          uploadedAt: new Date().toISOString()
        });
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
        return NextResponse.json(
          { success: false, error: `Failed to process file ${file.name}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: true, data: uploadedFiles },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
