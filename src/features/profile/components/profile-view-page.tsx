'use client';

import { UserProfile } from '@clerk/nextjs';

export default function ProfileViewPage() {
  return (
    <div className='flex w-full flex-col gap-4 p-4'>
      <div className='rounded-lg border p-4'>
        <h2 className='mb-4 text-lg font-semibold'>User Profile</h2>
        <UserProfile />
      </div>
    </div>
  );
}
