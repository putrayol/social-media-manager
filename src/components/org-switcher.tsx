'use client';

import { ChevronsUpDown, Plus, Loader2 } from 'lucide-react';
import * as React from 'react';
import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function OrgSwitcher() {
  const router = useRouter();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const {
    userMemberships,
    isLoaded: listLoaded,
    setActive
  } = useOrganizationList({
    userMemberships: { infinite: true }
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [switchingOrgId, setSwitchingOrgId] = useState<string | null>(null);

  const isLoaded = orgLoaded && listLoaded;

  // Get organizations from userMemberships
  const organizations =
    userMemberships?.data?.map((membership) => membership.organization) || [];

  const handleSelectOrganization = async (orgId: string) => {
    if (!setActive) {
      console.error('setActive function not available');
      return;
    }
    setSwitchingOrgId(orgId);
    try {
      await setActive({ organization: orgId });
      setIsOpen(false);
      // Refresh the page to update all organization-dependent data
      router.refresh();
    } catch (error) {
      console.error('Failed to switch organization:', error);
      setSwitchingOrgId(null);
    }
  };

  if (!isLoaded) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' disabled>
            <div className='bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
              <div className='h-4 w-4 animate-pulse rounded bg-gray-300' />
            </div>
            <div className='flex flex-col gap-0.5 leading-none'>
              <span className='font-semibold'>Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!organization) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' asChild>
            <Link href='/dashboard/profile'>
              <div className='bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <Plus className='size-4' />
              </div>
              <div className='flex flex-col gap-0.5 leading-none'>
                <span className='font-semibold'>Create Organization</span>
                <span className='text-xs'>Select or create an org</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage
                  src={organization.imageUrl}
                  alt={organization.name}
                />
                <AvatarFallback className='bg-primary text-sidebar-primary-foreground rounded-lg'>
                  {organization.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-0.5 leading-none'>
                <span className='font-semibold'>{organization.name}</span>
                <span className='text-muted-foreground text-xs'>
                  {organizations.length || 0} organization
                  {(organizations.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56'
            align='start'
            side='bottom'
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs font-medium'>
              Your Organizations
            </DropdownMenuLabel>
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSelectOrganization(org.id)}
                disabled={switchingOrgId !== null}
                className='cursor-pointer'
              >
                <Avatar className='mr-2 h-5 w-5 rounded-sm'>
                  <AvatarImage src={org.imageUrl} alt={org.name} />
                  <AvatarFallback className='bg-primary text-sidebar-primary-foreground rounded-sm text-xs'>
                    {org.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className='flex-1'>{org.name}</span>
                {switchingOrgId === org.id ? (
                  <Loader2 className='ml-auto h-4 w-4 animate-spin' />
                ) : org.id === organization.id ? (
                  <span className='ml-auto text-xs font-semibold'>✓</span>
                ) : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href='/dashboard/profile'>
                <Plus className='mr-2 h-4 w-4' />
                <span>Create Organization</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
