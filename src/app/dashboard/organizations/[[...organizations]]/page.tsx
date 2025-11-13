import { OrganizationProfile } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organizations',
  description: 'Manage your organizations'
};

export default function OrganizationsPage() {
  return (
    <div className='flex h-full w-full p-4'>
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: 'w-full max-w-4xl',
            card: 'shadow-none border'
          }
        }}
      />
    </div>
  );
}
