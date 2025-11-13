import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check Clerk session claims
 * Access: GET /api/debug/session
 */
export async function GET() {
  try {
    const { sessionClaims, userId, orgRole } = await auth();

    // Clerk stores organization data in nested 'o' object
    const orgData = sessionClaims?.o as
      | { id?: string; rol?: string; slg?: string }
      | undefined;

    return NextResponse.json({
      success: true,
      data: {
        userId,
        sessionClaims: sessionClaims || null,
        // Direct fields (may be null)
        org_id: sessionClaims?.org_id || null,
        org_role: sessionClaims?.org_role || null,
        org_slug: sessionClaims?.org_slug || null,
        org_permissions: sessionClaims?.org_permissions || null,
        // Nested organization data (Clerk's actual format)
        org_data_nested: orgData || null,
        // From auth() function
        orgRole: orgRole || null,
        // Resolved values
        resolved: {
          org_id: (sessionClaims?.org_id as string) || orgData?.id || null,
          org_role:
            (sessionClaims?.org_role as string) ||
            orgData?.rol ||
            orgRole ||
            null,
          org_slug: (sessionClaims?.org_slug as string) || orgData?.slg || null,
          is_admin:
            orgData?.rol === 'admin' ||
            orgData?.rol === 'org:admin' ||
            orgRole === 'admin'
        },
        allClaims: Object.keys(sessionClaims || {})
      }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}
