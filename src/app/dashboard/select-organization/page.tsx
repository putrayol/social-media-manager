'use client';

import { useOrganizationList, useUser, useOrganization } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Building2, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function SelectOrganizationPage() {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const {
    userMemberships,
    isLoaded: listLoaded,
    setActive
  } = useOrganizationList({
    userMemberships: { infinite: true }
  });
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [hasOrganization, setHasOrganization] = useState(false);

  const isLoaded = userLoaded && listLoaded && orgLoaded;

  // Get organizations from userMemberships
  const organizations =
    userMemberships?.data?.map((membership) => membership.organization) || [];

  // Show current organization if user has one
  useEffect(() => {
    if (isLoaded && organization) {
      console.log('User already has active organization:', organization.id);
      setHasOrganization(true);
    }
  }, [isLoaded, organization]);

  const handleSelectOrganization = async (orgId: string) => {
    setSelectedOrgId(orgId);
    setIsSelecting(true);
    try {
      console.log('Setting active organization:', orgId);
      await setActive({ organization: orgId });
      console.log('Organization set successfully, redirecting...');
      // Wait a moment for the session to update
      setTimeout(() => {
        router.push('/dashboard/overview');
      }, 500);
    } catch (error) {
      console.error('Failed to select organization:', error);
      setIsSelecting(false);
    }
  };

  const handleCreateOrganization = () => {
    router.push('/dashboard/profile');
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='text-primary h-8 w-8 animate-spin' />
          <p className='text-muted-foreground text-sm'>
            Loading organizations...
          </p>
        </div>
      </div>
    );
  }

  // No user
  if (!user) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Not Authenticated</h1>
          <p className='text-muted-foreground mt-2'>
            Please sign in to continue.
          </p>
        </div>
      </div>
    );
  }

  // If organization is being loaded, show loading state
  if (hasOrganization) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2 className='text-primary h-8 w-8 animate-spin' />
          <p className='text-muted-foreground text-sm'>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // No organizations
  if (!organizations || organizations.length === 0) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100'>
        <div className='mx-auto w-full max-w-md px-4'>
          <div className='rounded-lg bg-white p-8 text-center shadow-lg'>
            <Building2 className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h1 className='mb-2 text-2xl font-bold'>No Organization Access</h1>
            <p className='text-muted-foreground mb-6'>
              You don&apos;t have access to any organization yet. Please ask an
              admin to invite you to an organization.
            </p>
            <Button onClick={handleCreateOrganization} className='w-full'>
              Create Organization
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show organization selection
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='mx-auto w-full max-w-md px-4'>
        <div className='rounded-lg bg-white p-8 shadow-lg'>
          <h1 className='mb-2 text-2xl font-bold'>Select Organization</h1>
          <p className='text-muted-foreground mb-6'>
            Choose an organization to continue
          </p>

          <div className='mb-6 space-y-3'>
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelectOrganization(org.id)}
                disabled={isSelecting && selectedOrgId !== org.id}
                className='flex w-full items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={org.imageUrl} alt={org.name} />
                  <AvatarFallback className='bg-primary text-primary-foreground'>
                    {org.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 text-left'>
                  <p className='font-semibold'>{org.name}</p>
                  <p className='text-muted-foreground text-xs'>
                    {org.membersCount} member{org.membersCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {isSelecting && selectedOrgId === org.id && (
                  <Loader2 className='text-primary h-5 w-5 animate-spin' />
                )}
              </button>
            ))}
          </div>

          <Button
            onClick={handleCreateOrganization}
            variant='outline'
            className='w-full'
          >
            <Plus className='mr-2 h-4 w-4' />
            Create New Organization
          </Button>
        </div>
      </div>
    </div>
  );
}
