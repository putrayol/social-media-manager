'use client';

import { useOrganization, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Hook untuk mengecek dan melindungi akses berdasarkan organization membership
 * Memastikan hanya user yang di-invite sebagai member dalam organization dapat mengakses
 */
export function useOrganizationAuth() {
  const { organization, membership, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  const isLoaded = orgLoaded && userLoaded;

  // Check if user is member of current organization
  // If organization exists, user is a member (Clerk handles this)
  const isMember = !!organization;

  // Get user role from organization
  // Default to 'member' if organization exists but role not explicitly set
  const userRole = membership?.role || (organization ? 'member' : undefined);

  // Check if user is admin (handles both 'admin' and 'org:admin' formats)
  const isAdmin =
    userRole === 'admin' ||
    userRole === 'org:admin' ||
    userRole === 'administrator';

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!userRole) return false;

    // Define role-based permissions
    const rolePermissions: Record<string, string[]> = {
      admin: ['read', 'write', 'delete', 'manage_members', 'manage_settings'],
      'org:admin': [
        'read',
        'write',
        'delete',
        'manage_members',
        'manage_settings'
      ],
      administrator: [
        'read',
        'write',
        'delete',
        'manage_members',
        'manage_settings'
      ],
      member: ['read', 'write'],
      'org:member': ['read', 'write'],
      guest: ['read']
    };

    return rolePermissions[userRole]?.includes(permission) ?? false;
  };

  // Redirect if no organization selected
  useEffect(() => {
    if (isLoaded && !organization && user) {
      router.push('/dashboard/profile');
    }
  }, [isLoaded, organization, user, router]);

  return {
    organization,
    user,
    isLoaded,
    isMember,
    userRole,
    isAdmin,
    hasPermission,
    canRead: hasPermission('read'),
    canWrite: hasPermission('write'),
    canDelete: hasPermission('delete'),
    canManageMembers: hasPermission('manage_members'),
    canManageSettings: hasPermission('manage_settings')
  };
}
