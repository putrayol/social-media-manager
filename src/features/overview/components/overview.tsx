'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { RecentSales } from './recent-sales';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface StatsData {
  aktivatorCount: number;
  cyberTroopsCount: number;
  topKomentarCount: number;
  totalComments: number;
  totalTopComments: number;
  totalCyberComments: number;
}

export default function OverViewPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/social-media-manager/stats');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
          <div className='hidden items-center space-x-2 md:flex'>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='analytics' disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value='overview' className='space-y-4'>
            <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
              <Card className='@container/card'>
                <CardHeader>
                  <CardDescription>Total Aktivator</CardDescription>
                  <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                    <span
                      className='cursor-pointer hover:underline'
                      onClick={() =>
                        router.push('/dashboard/social-media-manager/aktivator')
                      }
                    >
                      {loading ? '-' : stats?.aktivatorCount || 0}
                    </span>
                  </CardTitle>
                  <CardAction>
                    <Badge variant='outline'>
                      <IconTrendingUp />
                      +12.5%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                  <div className='line-clamp-1 flex gap-2 font-medium'>
                    Konten Giat <IconTrendingUp className='size-4' />
                  </div>
                  <div className='text-muted-foreground'>
                    Total aktivator konten
                  </div>
                </CardFooter>
              </Card>
              <Card className='@container/card'>
                <CardHeader>
                  <CardDescription>Cyber Troops</CardDescription>
                  <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                    <span
                      className='cursor-pointer hover:underline'
                      onClick={() =>
                        router.push(
                          '/dashboard/social-media-manager/cyber-troops'
                        )
                      }
                    >
                      {loading ? '-' : stats?.cyberTroopsCount || 0}
                    </span>
                  </CardTitle>
                  <CardAction>
                    <Badge variant='outline'>
                      <IconTrendingUp />
                      +8.2%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                  <div className='line-clamp-1 flex gap-2 font-medium'>
                    Buzzer Activity <IconTrendingUp className='size-4' />
                  </div>
                  <div className='text-muted-foreground'>
                    Total cyber troops
                  </div>
                </CardFooter>
              </Card>
              <Card className='@container/card'>
                <CardHeader>
                  <CardDescription>Total Komentar</CardDescription>
                  <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                    {loading
                      ? '-'
                      : (stats?.totalComments || 0).toLocaleString()}
                  </CardTitle>
                  <CardAction>
                    <Badge variant='outline'>
                      <IconTrendingUp />
                      +15.3%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                  <div className='line-clamp-1 flex gap-2 font-medium'>
                    Engagement tinggi <IconTrendingUp className='size-4' />
                  </div>
                  <div className='text-muted-foreground'>
                    Total komentar cyber + top
                  </div>
                </CardFooter>
              </Card>
              <Card className='@container/card'>
                <CardHeader>
                  <CardDescription>Top Komentar</CardDescription>
                  <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                    <span
                      className='cursor-pointer hover:underline'
                      onClick={() =>
                        router.push(
                          '/dashboard/social-media-manager/top-komentar'
                        )
                      }
                    >
                      {loading
                        ? '-'
                        : (stats?.totalComments || 0).toLocaleString()}
                    </span>
                  </CardTitle>
                  <CardAction>
                    <Badge variant='outline'>
                      <IconTrendingUp />
                      +5.1%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                  <div className='line-clamp-1 flex gap-2 font-medium'>
                    Top Comments <IconTrendingUp className='size-4' />
                  </div>
                  <div className='text-muted-foreground'>
                    Total top komentar postingan
                  </div>
                </CardFooter>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
              <div className='col-span-4'>
                <BarGraph />
              </div>
              <Card className='col-span-4 md:col-span-3'>
                <RecentSales />
              </Card>
              <div className='col-span-4'>
                <AreaGraph />
              </div>
              <div className='col-span-4 md:col-span-3'>
                <PieGraph />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
