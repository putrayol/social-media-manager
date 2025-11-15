import { auth } from '@clerk/nextjs/server';

/**
 * Utility untuk mendapatkan organization ID dari session
 * Digunakan di server-side untuk fetch data dengan organization context
 */
export async function getOrganizationIdFromAuth(): Promise<string | null> {
  const { sessionClaims } = await auth();

  // Clerk stores organization data in nested 'o' object
  const orgData = sessionClaims?.o as
    | { id?: string; rol?: string; slg?: string }
    | undefined;

  // Try multiple sources for organization ID
  const orgId = (sessionClaims?.org_id as string) || orgData?.id || null;

  console.log('[getOrganizationIdFromAuth]', {
    org_id_direct: sessionClaims?.org_id,
    org_data: orgData,
    resolved_org_id: orgId
  });

  if (orgId) return orgId;

  const envFallback = process.env.DEFAULT_ORGANIZATION_ID || null;
  if (envFallback) return envFallback;

  if (process.env.NODE_ENV !== 'production') {
    return 'local-dev-org';
  }

  return null;
}

/**
 * Utility untuk memastikan user adalah member dari organization
 * Digunakan di server-side untuk authorization checks
 */
export async function requireOrganization(): Promise<string> {
  const orgId = await getOrganizationIdFromAuth();

  if (!orgId) {
    throw new Error(
      'User must be a member of an organization to access this resource'
    );
  }

  return orgId;
}

/**
 * Utility untuk fetch data dengan organization context
 * Menambahkan organization ID ke query parameters
 */
export async function fetchWithOrganization(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const orgId = await getOrganizationIdFromAuth();

  if (!orgId) {
    throw new Error('No organization context available');
  }

  // Add organization ID to URL
  const urlObj = new URL(
    url,
    typeof window === 'undefined' ? 'http://localhost' : window.location.origin
  );
  urlObj.searchParams.append('organizationId', orgId);

  return fetch(urlObj.toString(), options);
}

/**
 * Utility untuk membuat headers dengan organization context
 */
export async function getOrganizationHeaders(): Promise<
  Record<string, string>
> {
  const orgId = await getOrganizationIdFromAuth();

  if (!orgId) {
    throw new Error('No organization context available');
  }

  return {
    'X-Organization-ID': orgId,
    'Content-Type': 'application/json'
  };
}

/**
 * Prefer organization from request header, fallback to auth session
 */
export async function requireOrganizationFromRequest(
  req: Request
): Promise<string> {
  const headerOrg = req.headers.get('X-Organization-ID');
  if (headerOrg) return headerOrg;
  return requireOrganization();
}

/**
 * Get user's role in the current organization
 * Returns role string like 'admin', 'member', etc.
 * Returns null if user is not in an organization
 */
export async function getOrganizationRole(): Promise<string | null> {
  const { sessionClaims } = await auth();

  // Clerk stores organization data in nested 'o' object
  const orgData = sessionClaims?.o as
    | { id?: string; rol?: string; slg?: string }
    | undefined;

  // Try multiple sources for role
  const role = (sessionClaims?.org_role as string) || orgData?.rol || null;

  console.log('[getOrganizationRole] Session claims:', {
    org_id_direct: sessionClaims?.org_id,
    org_role_direct: sessionClaims?.org_role,
    org_data: orgData,
    resolved_role: role
  });

  return role;
}

/**
 * Check if user is admin in the current organization
 * Returns true if user has admin role, false otherwise
 */
export async function isOrganizationAdmin(): Promise<boolean> {
  const role = await getOrganizationRole();
  // Accept 'admin', 'org:admin', or 'administrator'
  const isAdmin =
    role === 'admin' || role === 'org:admin' || role === 'administrator';
  console.log('[isOrganizationAdmin] Role check:', { role, isAdmin });
  return isAdmin;
}

/**
 * Require admin role in the current organization
 * Throws error if user is not an admin
 */
export async function requireOrganizationAdmin(): Promise<void> {
  const { sessionClaims, orgRole } = await auth();

  // Clerk stores organization data in nested 'o' object
  const orgData = sessionClaims?.o as
    | { id?: string; rol?: string; slg?: string }
    | undefined;

  // Try to get role from multiple sources
  const role =
    orgRole || (sessionClaims?.org_role as string) || orgData?.rol || null;

  console.log('[requireOrganizationAdmin] Checking admin permission:', {
    org_id_direct: sessionClaims?.org_id,
    org_role_direct: sessionClaims?.org_role,
    orgRole: orgRole,
    org_data: orgData,
    resolved_role: role,
    isAdmin:
      role === 'admin' || role === 'org:admin' || role === 'administrator',
    allSessionClaims: Object.keys(sessionClaims || {})
  });

  // Check if user is admin (accept 'admin', 'org:admin', or 'administrator')
  const isAdmin =
    role === 'admin' || role === 'org:admin' || role === 'administrator';

  if (!isAdmin) {
    console.error('[requireOrganizationAdmin] Access denied - not an admin:', {
      currentRole: role,
      requiredRole: 'admin, org:admin, or administrator',
      availableRoles: ['admin', 'org:admin', 'administrator']
    });
    throw new Error('Only organization administrators can perform this action');
  }

  console.log('[requireOrganizationAdmin] Access granted - user is admin');
}
