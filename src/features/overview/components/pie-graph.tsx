'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

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

interface PlatformData {
  platform: string;
  _count: number;
  fill: string;
}

const platformColors: Record<string, string> = {
  TIKTOK: 'hsl(0, 0%, 0%)',
  INSTAGRAM: 'hsl(330, 100%, 55%)',
  FACEBOOK: 'hsl(221, 83%, 53%)',
  TWITTER: 'hsl(207, 89%, 60%)',
  YOUTUBE: 'hsl(0, 100%, 50%)',
  OTHER: 'hsl(0, 0%, 60%)'
};

const chartConfig = {
  count: {
    label: 'Count'
  },
  TIKTOK: {
    label: 'TikTok',
    color: platformColors.TIKTOK
  },
  INSTAGRAM: {
    label: 'Instagram',
    color: platformColors.INSTAGRAM
  },
  FACEBOOK: {
    label: 'Facebook',
    color: platformColors.FACEBOOK
  },
  TWITTER: {
    label: 'Twitter',
    color: platformColors.TWITTER
  },
  YOUTUBE: {
    label: 'YouTube',
    color: platformColors.YOUTUBE
  },
  OTHER: {
    label: 'Other',
    color: platformColors.OTHER
  }
} satisfies ChartConfig;

export function PieGraph() {
  const [chartData, setChartData] = React.useState<PlatformData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [aktivatorRes, cyberRes, topRes] = await Promise.all([
          fetch('/api/social-media-manager/aktivator?limit=1000'),
          fetch('/api/social-media-manager/cyber-troops?limit=1000'),
          fetch('/api/social-media-manager/top-komentar?limit=1000')
        ]);

        const aktivatorJson = await aktivatorRes.json();
        const cyberJson = await cyberRes.json();
        const topJson = await topRes.json();

        const platforms = [
          'TIKTOK',
          'INSTAGRAM',
          'FACEBOOK',
          'TWITTER',
          'YOUTUBE',
          'OTHER'
        ] as const;

        const agg: Record<string, number> = Object.fromEntries(
          platforms.map((p) => [p, 0])
        );

        (aktivatorJson?.data || []).forEach((a: any) => {
          const p = a.platform as string;
          if (p && agg[p] !== undefined) agg[p] += 1;
        });

        (cyberJson?.data || []).forEach((c: any) => {
          const p = c.platform as string;
          const val = Number(c.jumlahKomentar || 0) + Number(c.jumlahLike || 0);
          if (p && agg[p] !== undefined) agg[p] += val;
        });

        (topJson?.data || []).forEach((t: any) => {
          const p = t.platform as string;
          const val =
            Number(t.jumlahTopKomentar || 0) + Number(t.jumlahLike || 0);
          if (p && agg[p] !== undefined) agg[p] += val;
        });

        const data = platforms
          .map((p) => ({
            platform: p,
            _count: agg[p],
            fill: platformColors[p] || 'var(--primary)'
          }))
          .filter((d) => d._count > 0);

        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalCount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr._count, 0);
  }, [chartData]);

  if (loading || chartData.length === 0) {
    return null;
  }

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Platform Distribution</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            All Inputs by Platform
          </span>
          <span className='@[540px]/card:hidden'>Platform distribution</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {chartData.map((item) => (
                <linearGradient
                  key={item.platform}
                  id={`fill${item.platform}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop offset='0%' stopColor={item.fill} stopOpacity={1} />
                  <stop offset='100%' stopColor={item.fill} stopOpacity={0.8} />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((item) => ({
                ...item,
                fill: `url(#fill${item.platform})`
              }))}
              dataKey='_count'
              nameKey='platform'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Input
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          {chartData[0]?.platform} leads with{' '}
          {((chartData[0]?._count / totalCount) * 100).toFixed(1)}%{' '}
          <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          All inputs platform distribution
        </div>
      </CardFooter>
    </Card>
  );
}
