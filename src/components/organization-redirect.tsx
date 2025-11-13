'use client';

import { useOrganization } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Component yang redirect ke select-organization jika user tidak memiliki active organization
 * Digunakan di dashboard pages untuk memastikan user memiliki organization sebelum akses page
 */
export function OrganizationRedirect() {
  const router = useRouter();
  const { organization, isLoaded } = useOrganization();

  useEffect(() => {
    if (isLoaded && !organization) {
      console.log('No active organization, redirecting to select-organization');
      router.push('/dashboard/select-organization');
    }
  }, [isLoaded, organization, router]);

  // If no organization, show loading state while redirecting
  if (isLoaded && !organization) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='text-primary h-8 w-8 animate-spin' />
          <p className='text-muted-foreground text-sm'>
            Redirecting to organization selection...
          </p>
        </div>
      </div>
    );
  }

  // If organization is loaded, render nothing (let parent component render)
  return null;
}
