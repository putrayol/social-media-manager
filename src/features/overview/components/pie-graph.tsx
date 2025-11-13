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

interface CategoryData {
  kategori: string;
  _count: number;
  fill: string;
}

const chartConfig = {
  count: {
    label: 'Count'
  },
  Positif: {
    label: 'Positif',
    color: 'hsl(142, 76%, 36%)'
  },
  Negatif: {
    label: 'Negatif',
    color: 'hsl(0, 84%, 60%)'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const [chartData, setChartData] = React.useState<CategoryData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/social-media-manager/stats');
        const result = await response.json();
        if (result.success && result.data.categoryDistribution) {
          const colors = {
            Positif: 'hsl(142, 76%, 36%)',
            Negatif: 'hsl(0, 84%, 60%)'
          };
          const data = result.data.categoryDistribution.map(
            (item: any, index: number) => ({
              kategori: item.kategori,
              _count: item._count,
              fill:
                colors[item.kategori as keyof typeof colors] || 'var(--primary)'
            })
          );
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

  const totalCount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr._count, 0);
  }, [chartData]);

  if (loading || chartData.length === 0) {
    return null;
  }

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Kategori Distribution</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Cyber Troops by Category (Positif/Negatif)
          </span>
          <span className='@[540px]/card:hidden'>Category distribution</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {chartData.map((item, index) => (
                <linearGradient
                  key={item.kategori}
                  id={`fill${item.kategori}`}
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
                fill: `url(#fill${item.kategori})`
              }))}
              dataKey='_count'
              nameKey='kategori'
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
                          Total Cyber Troops
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
          {chartData[0]?.kategori} leads with{' '}
          {((chartData[0]?._count / totalCount) * 100).toFixed(1)}%{' '}
          <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Cyber Troops category distribution
        </div>
      </CardFooter>
    </Card>
  );
}
