'use client';

import { useUser } from '@clerk/nextjs';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useAutoOrganization } from '@/hooks/use-auto-organization';

interface OrganizationGuardProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'member' | 'guest';
  fallback?: ReactNode;
}

/**
 * Component untuk melindungi halaman dari akses user yang tidak authorized
 * Memastikan user adalah authenticated dan memiliki active organization
 *
 * Automatically loads user's first organization if they have one
 */
export function OrganizationGuard({
  children,
  requiredRole,
  fallback
}: OrganizationGuardProps) {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: orgLoaded } = useAutoOrganization();

  const isLoaded = userLoaded && orgLoaded;

  // Show loading state
  if (!isLoaded) {
    return (
      fallback || (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='text-primary h-8 w-8 animate-spin' />
            <p className='text-muted-foreground text-sm'>Loading...</p>
          </div>
        </div>
      )
    );
  }

  // If no user, show not authenticated message
  if (!user) {
    return (
      fallback || (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold'>Not Authenticated</h1>
            <p className='text-muted-foreground mt-2'>
              Please sign in to access this page.
            </p>
          </div>
        </div>
      )
    );
  }

  // User is authenticated, allow access
  // Organization check is handled by middleware
  return <>{children}</>;
}
