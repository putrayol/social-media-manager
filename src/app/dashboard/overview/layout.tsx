'use client';

import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { DateRangeFilter } from '@/features/overview/components/date-range-filter';

interface StatsData {
  aktivatorCount: number;
  cyberTroopsCount: number;
  topKomentarCount: number;
  totalComments: number;
  totalTopComments: number;
  totalCyberComments: number;
  platformDistribution: Array<{ platform: string; _count: number }>;
  categoryDistribution: Array<{ kategori: string; _count: number }>;
}

interface StatsCardsProps {
  startDate?: Date | null;
  endDate?: Date | null;
}

function StatsCards({ startDate, endDate }: StatsCardsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let url = '/api/social-media-manager/stats';
        if (startDate && endDate) {
          const params = new URLSearchParams({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          });
          url += `?${params.toString()}`;
        }
        const response = await fetch(url);
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
  }, [startDate, endDate]);

  if (loading || !stats) {
    return null;
  }

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Aktivator</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {stats.aktivatorCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />+
              {Math.round(
                (stats.aktivatorCount / Math.max(stats.aktivatorCount - 5, 1)) *
                  100 -
                  100
              )}
              %
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Active Aktivators <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Total aktivator accounts</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Cyber Troops</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {stats.cyberTroopsCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />+
              {Math.round(
                (stats.cyberTroopsCount /
                  Math.max(stats.cyberTroopsCount - 10, 1)) *
                  100 -
                  100
              )}
              %
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Trending up <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            Total cyber troops entries
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Komentar</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {stats.totalComments.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />+
              {Math.round(
                (stats.totalComments / Math.max(stats.totalComments - 100, 1)) *
                  100 -
                  100
              )}
              %
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Strong engagement <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Total comments tracked</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Top Komentar</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {stats.topKomentarCount.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />+
              {Math.round(
                (stats.topKomentarCount /
                  Math.max(stats.topKomentarCount - 5, 1)) *
                  100 -
                  100
              )}
              %
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            High priority <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Top comments tracked</div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats,
  org_info
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  org_info: React.ReactNode;
}) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
          <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
        </div>

        <StatsCards startDate={startDate} endDate={endDate} />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {/* sales arallel routes */}
            {sales}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
          <div className='col-span-4 md:col-span-7'>{org_info}</div>
        </div>
      </div>
    </PageContainer>
  );
}
