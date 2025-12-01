'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RotateCw } from 'lucide-react';
import Link from 'next/link';
import {
  SocialMediaAktivator,
  CyberTroops,
  TopKomentarPostingan,
  RequestItem
} from '../types';
import { AktivatorTable } from './tables/aktivator-table';
import { CyberTroopsTable } from './tables/cyber-troops-table';
import { TopKomentarTable } from './tables/top-komentar-table';
import { RequestTable } from './tables/request-table';
import { useState, useEffect } from 'react';
import { useOrganizationAuth } from '@/hooks/use-organization-auth';

interface SocialMediaListingProps {
  aktivatorData: SocialMediaAktivator[];
  cyberTroopsData: CyberTroops[];
  topKomentarData: TopKomentarPostingan[];
  requestData: RequestItem[];
  totalAktivator: number;
  totalCyberTroops: number;
  totalTopKomentar: number;
  totalRequest: number;
  onRefresh?: () => void;
}

const validTabs = ['aktivator', 'cyber-troops', 'top-komentar', 'request'];

export function SocialMediaListing({
  aktivatorData,
  cyberTroopsData,
  topKomentarData,
  requestData,
  totalAktivator,
  totalCyberTroops,
  totalTopKomentar,
  totalRequest,
  onRefresh
}: SocialMediaListingProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('aktivator');
  const { isAdmin } = useOrganizationAuth();

  // Read hash from URL on mount and on hash change
  useEffect(() => {
    const getTabFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      return validTabs.includes(hash) ? hash : 'aktivator';
    };

    setActiveTab(getTabFromHash());

    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.history.replaceState(null, '', `#${value}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    // Reset after a short delay to show the animation
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* ✅ Tabs with proper spacing */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className='w-full'
      >
        {/* ✅ Tab List - Use default shadcn styling */}
        <TabsList className='w-fit'>
          <TabsTrigger value='aktivator'>
            <span className='hidden sm:inline'>Aktivator</span>
            <span className='sm:hidden'>Aktivator</span>
            <span className='ml-1 text-xs'>({totalAktivator})</span>
          </TabsTrigger>
          <TabsTrigger value='cyber-troops'>
            <span className='hidden sm:inline'>Cyber Troops</span>
            <span className='sm:hidden'>Cyber</span>
            <span className='ml-1 text-xs'>({totalCyberTroops})</span>
          </TabsTrigger>
          <TabsTrigger value='top-komentar'>
            <span className='hidden sm:inline'>Top Komentar</span>
            <span className='sm:hidden'>Top</span>
            <span className='ml-1 text-xs'>({totalTopKomentar})</span>
          </TabsTrigger>
          <TabsTrigger value='request'>
            <span className='hidden sm:inline'>Request</span>
            <span className='sm:hidden'>Request</span>
            <span className='ml-1 text-xs'>({totalRequest})</span>
          </TabsTrigger>
        </TabsList>

        {/* ✅ Aktivator Tab */}
        <TabsContent value='aktivator' className='mt-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>
              Aktivator (Report Giat Konten)
            </h2>
            {/* ✅ Button Group */}
            <div className='bg-background flex gap-1 rounded-lg border p-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleRefresh}
                disabled={isRefreshing}
                className='gap-2'
              >
                <RotateCw
                  className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              {isAdmin && (
                <Link
                  href='/dashboard/social-media-manager/aktivator/create'
                  prefetch={false}
                >
                  <Button variant='ghost' size='sm' className='gap-2'>
                    <Plus className='h-4 w-4' />
                    Tambah Data
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <AktivatorTable data={aktivatorData} totalItems={totalAktivator} />
        </TabsContent>

        {/* ✅ Cyber Troops Tab */}
        <TabsContent value='cyber-troops' className='mt-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>
              Cyber Troops (Report Giat Buzzer)
            </h2>
            {/* ✅ Button Group */}
            <div className='bg-background flex gap-1 rounded-lg border p-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleRefresh}
                disabled={isRefreshing}
                className='gap-2'
              >
                <RotateCw
                  className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              {isAdmin && (
                <Link
                  href='/dashboard/social-media-manager/cyber-troops/create'
                  prefetch={false}
                >
                  <Button variant='ghost' size='sm' className='gap-2'>
                    <Plus className='h-4 w-4' />
                    Tambah Data
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <CyberTroopsTable
            data={cyberTroopsData}
            totalItems={totalCyberTroops}
          />
        </TabsContent>

        {/* ✅ Top Komentar Tab */}
        <TabsContent value='top-komentar' className='mt-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>
              Report Giat Top Komentar Postingan
            </h2>
            {/* ✅ Button Group */}
            <div className='bg-background flex gap-1 rounded-lg border p-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleRefresh}
                disabled={isRefreshing}
                className='gap-2'
              >
                <RotateCw
                  className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              {isAdmin && (
                <Link
                  href='/dashboard/social-media-manager/top-komentar/create'
                  prefetch={false}
                >
                  <Button variant='ghost' size='sm' className='gap-2'>
                    <Plus className='h-4 w-4' />
                    Tambah Data
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <TopKomentarTable
            data={topKomentarData}
            totalItems={totalTopKomentar}
          />
        </TabsContent>

        {/* Request Tab */}
        <TabsContent value='request' className='mt-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Request</h2>
            <div className='bg-background flex gap-1 rounded-lg border p-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleRefresh}
                disabled={isRefreshing}
                className='gap-2'
              >
                <RotateCw
                  className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              {isAdmin && (
                <Link
                  href='/dashboard/social-media-manager/request/create'
                  prefetch={false}
                >
                  <Button variant='ghost' size='sm' className='gap-2'>
                    <Plus className='h-4 w-4' />
                    Tambah Data
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <RequestTable data={requestData} totalItems={totalRequest} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
