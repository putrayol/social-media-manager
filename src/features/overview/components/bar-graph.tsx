'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'Platform distribution bar chart';

// Platform colors for consistent styling
const platformColors: Record<string, string> = {
  TIKTOK: '#000000',
  INSTAGRAM: '#E1306C',
  FACEBOOK: '#1877F2',
  TWITTER: '#1DA1F2',
  YOUTUBE: '#FF0000',
  OTHER: '#6B7280'
};

interface PlatformData {
  platform: string;
  count: number;
  fill: string;
}

const chartConfig = {
  count: {
    label: 'Count',
    color: 'var(--primary)'
  },
  TIKTOK: { label: 'TikTok', color: platformColors.TIKTOK },
  INSTAGRAM: { label: 'Instagram', color: platformColors.INSTAGRAM },
  FACEBOOK: { label: 'Facebook', color: platformColors.FACEBOOK },
  TWITTER: { label: 'Twitter', color: platformColors.TWITTER },
  YOUTUBE: { label: 'YouTube', color: platformColors.YOUTUBE },
  OTHER: { label: 'Other', color: platformColors.OTHER }
} satisfies ChartConfig;

export function BarGraph() {
  const [chartData, setChartData] = React.useState<PlatformData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/social-media-manager/stats');
        const result = await response.json();
        if (result.success && result.data.platformDistribution) {
          const data = result.data.platformDistribution.map((item: any) => ({
            platform: item.platform,
            count: item._count,
            fill: platformColors[item.platform] || platformColors.OTHER
          }));
          setChartData(data);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchData();
    }
  }, [isClient]);

  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.count, 0),
    [chartData]
  );

  if (!isClient || loading) {
    return null;
  }

  return (
    <Card className='@container/card pt-3!'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0! sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-0!'>
          <CardTitle>Platform Distribution</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              Cyber Troops by Platform
            </span>
            <span className='@[540px]/card:hidden'>By Platform</span>
          </CardDescription>
        </div>
        <div className='flex'>
          <div className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6'>
            <span className='text-muted-foreground text-xs'>Total</span>
            <span className='text-lg leading-none font-bold sm:text-3xl'>
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis
              dataKey='platform'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              content={<ChartTooltipContent className='w-[150px]' />}
            />
            <Bar dataKey='count' radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        {/* Platform Legend */}
        <div className='mt-4 flex flex-wrap justify-center gap-4'>
          {chartData.map((item) => (
            <div key={item.platform} className='flex items-center gap-2'>
              <div
                className='h-3 w-3 rounded-sm'
                style={{ backgroundColor: item.fill }}
              />
              <span className='text-muted-foreground text-xs'>
                {item.platform}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
