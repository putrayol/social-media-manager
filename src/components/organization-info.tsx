'use client';

import { useOrganization, useUser, useOrganizationList } from '@clerk/nextjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

/**
 * Component untuk menampilkan informasi organization dan user role
 * Berguna untuk debugging dan menampilkan context kepada user
 */
export function OrganizationInfo() {
  const { organization, isLoaded: orgLoaded, membership } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();

  const isLoaded = orgLoaded && userLoaded;

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center py-8'>
          <Loader2 className='h-4 w-4 animate-spin' />
        </CardContent>
      </Card>
    );
  }

  if (!organization) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Organization</CardTitle>
          <CardDescription>
            You are not a member of any organization yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Get user's role in organization
  const userRole = membership?.role;

  // Get role badge color
  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'member':
        return 'secondary';
      case 'guest':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-12 w-12 rounded-lg'>
              <AvatarImage
                src={organization.imageUrl}
                alt={organization.name}
              />
              <AvatarFallback className='bg-primary text-sidebar-primary-foreground rounded-lg'>
                {organization.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{organization.name}</CardTitle>
              <CardDescription>
                Organization ID: {organization.id}
              </CardDescription>
            </div>
          </div>
          <Badge variant={getRoleBadgeVariant(userRole)}>
            {userRole || 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-muted-foreground text-sm font-medium'>Members</p>
            <p className='text-2xl font-bold'>
              {organization.membersCount || 0}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground text-sm font-medium'>Created</p>
            <p className='text-sm'>
              {organization.createdAt
                ? new Date(organization.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </div>

        {user && (
          <div className='border-t pt-4'>
            <p className='text-muted-foreground mb-2 text-sm font-medium'>
              Your Profile
            </p>
            <div className='flex items-center gap-3'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
                <AvatarFallback>
                  {(user.fullName || 'U').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm font-medium'>{user.fullName}</p>
                <p className='text-muted-foreground text-xs'>
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
