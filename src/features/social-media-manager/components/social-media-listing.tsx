'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import {
  SocialMediaAktivator,
  CyberTroops,
  TopKomentarPostingan
} from '../types';
import { AktivatorTable } from './tables/aktivator-table';
import { CyberTroopsTable } from './tables/cyber-troops-table';
import { TopKomentarTable } from './tables/top-komentar-table';

interface SocialMediaListingProps {
  aktivatorData: SocialMediaAktivator[];
  cyberTroopsData: CyberTroops[];
  topKomentarData: TopKomentarPostingan[];
  totalAktivator: number;
  totalCyberTroops: number;
  totalTopKomentar: number;
}

export function SocialMediaListing({
  aktivatorData,
  cyberTroopsData,
  topKomentarData,
  totalAktivator,
  totalCyberTroops,
  totalTopKomentar
}: SocialMediaListingProps) {
  return (
    <div className='space-y-6'>
      <Tabs defaultValue='aktivator' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='aktivator'>
            Social Media Aktivator ({totalAktivator})
          </TabsTrigger>
          <TabsTrigger value='cyber-troops'>
            Cyber Troops ({totalCyberTroops})
          </TabsTrigger>
          <TabsTrigger value='top-komentar'>
            Top Komentar ({totalTopKomentar})
          </TabsTrigger>
        </TabsList>

        <TabsContent value='aktivator' className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>
              Social Media Aktivator (Report Giat Konten)
            </h2>
            <Link href='/dashboard/social-media-manager/aktivator/create'>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Tambah Data
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className='pt-6'>
              <AktivatorTable
                data={aktivatorData}
                totalItems={totalAktivator}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='cyber-troops' className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>
              Cyber Troops (Report Giat Buzzer)
            </h2>
            <Link href='/dashboard/social-media-manager/cyber-troops/create'>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Tambah Data
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className='pt-6'>
              <CyberTroopsTable
                data={cyberTroopsData}
                totalItems={totalCyberTroops}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='top-komentar' className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>
              Report Giat Top Komentar Postingan
            </h2>
            <Link href='/dashboard/social-media-manager/top-komentar/create'>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Tambah Data
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className='pt-6'>
              <TopKomentarTable
                data={topKomentarData}
                totalItems={totalTopKomentar}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
