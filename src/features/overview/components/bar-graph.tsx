'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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

interface PlatformData {
  platform: string;
  count: number;
}

const chartConfig = {
  count: {
    label: 'Count',
    color: 'var(--primary)'
  }
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
            count: item._count
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
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
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
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--primary)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='platform'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={<ChartTooltipContent className='w-[150px]' />}
            />
            <Bar dataKey='count' fill='url(#fillBar)' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
