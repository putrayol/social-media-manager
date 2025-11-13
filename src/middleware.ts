import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isPublicRoute = createRouteMatcher(['/auth(.*)', '/']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Protect dashboard routes - require authentication only
  if (isProtectedRoute(req)) {
    await auth.protect();

    // Organization is automatically loaded by useAutoOrganization hook in OrganizationGuard
    // No need to check or redirect here
  }

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
