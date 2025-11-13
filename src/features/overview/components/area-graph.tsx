'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface TimelineData {
  date: string;
  cyberTroops: number;
  topKomentar: number;
}

const chartConfig = {
  cyberTroops: {
    label: 'Cyber Troops',
    color: 'var(--primary)'
  },
  topKomentar: {
    label: 'Top Komentar',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  const [chartData, setChartData] = useState<TimelineData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cyber troops data
        const cyberResponse = await fetch(
          '/api/social-media-manager/cyber-troops?limit=100'
        );
        const cyberResult = await cyberResponse.json();

        // Fetch top komentar data
        const topResponse = await fetch(
          '/api/social-media-manager/top-komentar?limit=100'
        );
        const topResult = await topResponse.json();

        if (cyberResult.success && topResult.success) {
          // Group by date
          const dateMap = new Map<string, TimelineData>();

          cyberResult.data.forEach((item: any) => {
            const date = new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
            if (!dateMap.has(date)) {
              dateMap.set(date, { date, cyberTroops: 0, topKomentar: 0 });
            }
            const entry = dateMap.get(date)!;
            entry.cyberTroops += 1;
          });

          topResult.data.forEach((item: any) => {
            const date = new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
            if (!dateMap.has(date)) {
              dateMap.set(date, { date, cyberTroops: 0, topKomentar: 0 });
            }
            const entry = dateMap.get(date)!;
            entry.topKomentar += 1;
          });

          const data = Array.from(dateMap.values()).slice(-6);
          setChartData(data);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || chartData.length === 0) {
    return null;
  }

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>
          Cyber Troops and Top Komentar activity over time
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillCyberTroops' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--primary)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='95%'
                  stopColor='var(--primary)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillTopKomentar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--primary)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='topKomentar'
              type='natural'
              fill='url(#fillTopKomentar)'
              stroke='var(--primary)'
              stackId='a'
            />
            <Area
              dataKey='cyberTroops'
              type='natural'
              fill='url(#fillCyberTroops)'
              stroke='var(--primary)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Trending up by 5.2% this month{' '}
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
