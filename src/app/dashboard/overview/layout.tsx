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
import {
  IconTrendingDown,
  IconTrendingUp,
  IconMinus
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { DateRangeFilter } from '@/features/overview/components/date-range-filter';
import Link from 'next/link';

interface ComparisonData {
  today: number;
  yesterday: number;
}

interface StatsData {
  aktivatorCount: number;
  cyberTroopsCount: number;
  topKomentarCount: number;
  totalComments: number;
  totalTopComments: number;
  totalCyberComments: number;
  platformDistribution: Array<{ platform: string; _count: number }>;
  categoryDistribution: Array<{ kategori: string; _count: number }>;
  totalLikes: number;
  comparison?: {
    aktivator: ComparisonData;
    cyberTroops: ComparisonData;
    topKomentar: ComparisonData;
    comments: ComparisonData;
    likes: ComparisonData;
  };
}

interface StatsCardsProps {
  startDate?: Date | null;
  endDate?: Date | null;
}

// Helper component for comparison badge
function ComparisonBadge({
  today,
  yesterday
}: {
  today: number;
  yesterday: number;
}) {
  const diff = today - yesterday;
  const isUp = diff > 0;
  const isDown = diff < 0;
  const isEqual = diff === 0;

  // Calculate percentage change
  const percentChange =
    yesterday === 0
      ? today > 0
        ? 100
        : 0
      : Math.round((diff / yesterday) * 100);

  if (isEqual) {
    return (
      <Badge variant='outline' className='text-muted-foreground'>
        <IconMinus className='size-3' />
        0%
      </Badge>
    );
  }

  if (isUp) {
    return (
      <Badge
        variant='outline'
        className='border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
      >
        <IconTrendingUp className='size-3' />+{percentChange}%
      </Badge>
    );
  }

  return (
    <Badge
      variant='outline'
      className='border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
    >
      <IconTrendingDown className='size-3' />
      {percentChange}%
    </Badge>
  );
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

  const comparison = stats.comparison || {
    aktivator: { today: 0, yesterday: 0 },
    cyberTroops: { today: 0, yesterday: 0 },
    topKomentar: { today: 0, yesterday: 0 },
    comments: { today: 0, yesterday: 0 },
    likes: { today: 0, yesterday: 0 }
  };

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
      <Link href='/dashboard/social-media-manager#aktivator' className='block'>
        <Card className='@container/card cursor-pointer transition-shadow hover:shadow-md'>
          <CardHeader>
            <CardDescription>Total Aktivator</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
              {stats.aktivatorCount.toLocaleString()}
            </CardTitle>
            <CardAction>
              <ComparisonBadge
                today={comparison.aktivator.today}
                yesterday={comparison.aktivator.yesterday}
              />
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              vs kemarin
            </div>
            <div className='text-muted-foreground'>
              Hari ini: {comparison.aktivator.today} • Kemarin:{' '}
              {comparison.aktivator.yesterday}
            </div>
          </CardFooter>
        </Card>
      </Link>
      <Link
        href='/dashboard/social-media-manager#cyber-troops'
        className='block'
      >
        <Card className='@container/card cursor-pointer transition-shadow hover:shadow-md'>
          <CardHeader>
            <CardDescription>Cyber Troops</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
              {stats.cyberTroopsCount.toLocaleString()}
            </CardTitle>
            <CardAction>
              <ComparisonBadge
                today={comparison.cyberTroops.today}
                yesterday={comparison.cyberTroops.yesterday}
              />
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              vs kemarin
            </div>
            <div className='text-muted-foreground'>
              Hari ini: {comparison.cyberTroops.today} • Kemarin:{' '}
              {comparison.cyberTroops.yesterday}
            </div>
          </CardFooter>
        </Card>
      </Link>
      <Link
        href='/dashboard/social-media-manager#top-komentar'
        className='block'
      >
        <Card className='@container/card cursor-pointer transition-shadow hover:shadow-md'>
          <CardHeader>
            <CardDescription>Total Komentar</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
              {stats.totalComments.toLocaleString()}
            </CardTitle>
            <CardAction>
              <ComparisonBadge
                today={comparison.comments.today}
                yesterday={comparison.comments.yesterday}
              />
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              vs kemarin
            </div>
            <div className='text-muted-foreground'>
              Hari ini: {comparison.comments.today} • Kemarin:{' '}
              {comparison.comments.yesterday}
            </div>
          </CardFooter>
        </Card>
      </Link>
      <Link
        href='/dashboard/social-media-manager#cyber-troops'
        className='block'
      >
        <Card className='@container/card cursor-pointer transition-shadow hover:shadow-md'>
          <CardHeader>
            <CardDescription>Total Like</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
              {stats.totalLikes.toLocaleString()}
            </CardTitle>
            <CardAction>
              <ComparisonBadge
                today={comparison.likes.today}
                yesterday={comparison.likes.yesterday}
              />
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium'>
              vs kemarin
            </div>
            <div className='text-muted-foreground'>
              Hari ini: {comparison.likes.today} • Kemarin:{' '}
              {comparison.likes.yesterday}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats,
  org_info,
  req_vs_input
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  org_info: React.ReactNode;
  req_vs_input: React.ReactNode;
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
        <div className='mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
          <div className='flex items-center'>
            <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
          </div>
        </div>

        <div className='mb-4'>{org_info}</div>

        <StatsCards startDate={startDate} endDate={endDate} />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{req_vs_input}</div>
          <div className='col-span-4 md:col-span-3'>{sales}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
