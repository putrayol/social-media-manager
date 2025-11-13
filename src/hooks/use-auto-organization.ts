'use client';

import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

/**
 * Hook untuk automatically load user's default organization
 * Jika user adalah member dari organization, automatically set yang pertama sebagai active
 * Jika user adalah member dari multiple organizations, user bisa switch
 */
export function useAutoOrganization() {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const {
    userMemberships,
    isLoaded: listLoaded,
    setActive
  } = useOrganizationList({
    userMemberships: { infinite: true }
  });
  const [isSettingOrg, setIsSettingOrg] = useState(false);

  const isLoaded = orgLoaded && listLoaded;
  const organizations = userMemberships?.data?.map((m) => m.organization) || [];

  // Automatically set first organization as active if user has organizations but none is active
  useEffect(() => {
    if (
      isLoaded &&
      !organization &&
      organizations.length > 0 &&
      !isSettingOrg
    ) {
      // Set the first organization as active
      const firstOrg = organizations[0];
      console.log(
        '[useAutoOrganization] Auto-setting first organization:',
        firstOrg.id
      );
      setIsSettingOrg(true);
      setActive({ organization: firstOrg.id })
        .then(() => {
          console.log('[useAutoOrganization] Organization set successfully');
          setIsSettingOrg(false);
        })
        .catch((error) => {
          console.error(
            '[useAutoOrganization] Failed to set organization:',
            error
          );
          setIsSettingOrg(false);
        });
    }
  }, [isLoaded, organization, organizations, setActive, isSettingOrg]);

  return {
    organization,
    organizations,
    isLoaded: isLoaded && !isSettingOrg,
    hasOrganizations: organizations.length > 0,
    canSwitchOrganizations: organizations.length > 1,
    setActive
  };
}
