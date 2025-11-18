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

interface ChartItem {
  label: string;
  requestedPost: number;
  requestedKomen: number;
  requestedLike: number;
  inputPost: number;
  inputKomen: number;
  inputLike: number;
}

const chartConfig = {
  requestedPost: { label: 'Req Post', color: 'hsl(221 83% 53%)' },
  requestedKomen: { label: 'Req Komen', color: 'hsl(199 89% 48%)' },
  requestedLike: { label: 'Req Like', color: 'hsl(150 83% 40%)' },
  inputPost: { label: 'Input Post', color: 'hsl(38 92% 50%)' },
  inputKomen: { label: 'Input Komen', color: 'hsl(267 85% 68%)' },
  inputLike: { label: 'Input Like', color: 'hsl(0 84% 60%)' }
} satisfies ChartConfig;

export function RequestVsInputGraph() {
  const [chartData, setChartData] = React.useState<ChartItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, aktivatorRes, cyberRes, topRes] = await Promise.all([
          fetch('/api/social-media-manager/request?limit=1000'),
          fetch('/api/social-media-manager/aktivator?limit=1000'),
          fetch('/api/social-media-manager/cyber-troops?limit=1000'),
          fetch('/api/social-media-manager/top-komentar?limit=1000')
        ]);

        const reqJson = await reqRes.json();
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

        const requestedPostAgg: Record<string, number> = Object.fromEntries(
          platforms.map((p) => [p, 0])
        );
        const requestedKomenAgg: Record<string, number> = Object.fromEntries(
          platforms.map((p) => [p, 0])
        );
        const requestedLikeAgg: Record<string, number> = Object.fromEntries(
          platforms.map((p) => [p, 0])
        );

        (reqJson?.data || []).forEach((r: any) => {
          requestedPostAgg.TIKTOK += Number(r.tiktokPost || 0);
          requestedKomenAgg.TIKTOK += Number(r.tiktokKomen || 0);
          requestedLikeAgg.TIKTOK += Number(r.tiktokLike || 0);

          requestedPostAgg.INSTAGRAM += Number(r.instagramPost || 0);
          requestedKomenAgg.INSTAGRAM += Number(r.instagramKomen || 0);
          requestedLikeAgg.INSTAGRAM += Number(r.instagramLike || 0);

          requestedPostAgg.FACEBOOK += Number(r.facebookPost || 0);
          requestedKomenAgg.FACEBOOK += Number(r.facebookKomen || 0);
          requestedLikeAgg.FACEBOOK += Number(r.facebookLike || 0);

          requestedPostAgg.TWITTER += Number(r.twitterPost || 0);
          requestedKomenAgg.TWITTER += Number(r.twitterKomen || 0);
          requestedLikeAgg.TWITTER += Number(r.twitterLike || 0);

          requestedPostAgg.YOUTUBE += Number(r.youtubePost || 0);
          requestedKomenAgg.YOUTUBE += Number(r.youtubeKomen || 0);
          requestedLikeAgg.YOUTUBE += Number(r.youtubeLike || 0);

          requestedPostAgg.OTHER += Number(r.otherPost || 0);
          requestedKomenAgg.OTHER += Number(r.otherKomen || 0);
          requestedLikeAgg.OTHER += Number(r.otherLike || 0);
        });

        const inputPosts: Record<string, number> = Object.fromEntries(
          platforms.map((p) => [p, 0])
        );
        const inputComments: Record<string, number> = Object.fromEntries(
          platforms.map((p) => [p, 0])
        );
        const inputLikes: Record<string, number> = Object.fromEntries(
          platforms.map((p) => [p, 0])
        );

        (aktivatorJson?.data || []).forEach((a: any) => {
          const p = a.platform as string;
          if (p && inputPosts[p] !== undefined) inputPosts[p] += 1;
        });

        (cyberJson?.data || []).forEach((c: any) => {
          const p = c.platform as string;
          if (p && inputComments[p] !== undefined)
            inputComments[p] += Number(c.jumlahKomentar || 0);
          if (p && inputLikes[p] !== undefined)
            inputLikes[p] += Number(c.jumlahLike || 0);
        });

        (topJson?.data || []).forEach((t: any) => {
          const p = t.platform as string;
          if (p && inputComments[p] !== undefined)
            inputComments[p] += Number(t.jumlahTopKomentar || 0);
          if (p && inputLikes[p] !== undefined)
            inputLikes[p] += Number(t.jumlahLike || 0);
        });

        const platformLabels: Record<string, string> = {
          TIKTOK: 'TikTok',
          INSTAGRAM: 'Instagram',
          FACEBOOK: 'Facebook',
          TWITTER: 'Twitter',
          YOUTUBE: 'YouTube',
          OTHER: 'Lainnya'
        };

        const data: ChartItem[] = platforms.map((p) => ({
          label: platformLabels[p],
          requestedPost: requestedPostAgg[p],
          requestedKomen: requestedKomenAgg[p],
          requestedLike: requestedLikeAgg[p],
          inputPost: inputPosts[p] || 0,
          inputKomen: inputComments[p] || 0,
          inputLike: inputLikes[p] || 0
        }));

        setChartData(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRequested = React.useMemo(
    () =>
      chartData.reduce(
        (acc, curr) =>
          acc + curr.requestedPost + curr.requestedKomen + curr.requestedLike,
        0
      ),
    [chartData]
  );
  const totalInput = React.useMemo(
    () =>
      chartData.reduce(
        (acc, curr) => acc + curr.inputPost + curr.inputKomen + curr.inputLike,
        0
      ),
    [chartData]
  );

  if (loading || chartData.length === 0) {
    return null;
  }

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>Request vs Input</CardTitle>
          <CardDescription>Perbandingan jumlah entri</CardDescription>
        </div>
        <div className='flex'>
          <div className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6'>
            <span className='text-muted-foreground text-xs'>Total Request</span>
            <span className='text-lg leading-none font-bold sm:text-3xl'>
              {totalRequested.toLocaleString()}
            </span>
          </div>
          <div className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6'>
            <span className='text-muted-foreground text-xs'>Total Input</span>
            <span className='text-lg leading-none font-bold sm:text-3xl'>
              {totalInput.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient
                id='fillRequestedPost'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop
                  offset='0%'
                  stopColor='var(--color-requestedPost)'
                  stopOpacity={0.9}
                />
                <stop
                  offset='100%'
                  stopColor='var(--color-requestedPost)'
                  stopOpacity={0.2}
                />
              </linearGradient>
              <linearGradient
                id='fillRequestedKomen'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop
                  offset='0%'
                  stopColor='var(--color-requestedKomen)'
                  stopOpacity={0.9}
                />
                <stop
                  offset='100%'
                  stopColor='var(--color-requestedKomen)'
                  stopOpacity={0.2}
                />
              </linearGradient>
              <linearGradient
                id='fillRequestedLike'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop
                  offset='0%'
                  stopColor='var(--color-requestedLike)'
                  stopOpacity={0.9}
                />
                <stop
                  offset='100%'
                  stopColor='var(--color-requestedLike)'
                  stopOpacity={0.2}
                />
              </linearGradient>
              <linearGradient id='fillInputPost' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--color-inputPost)'
                  stopOpacity={0.9}
                />
                <stop
                  offset='100%'
                  stopColor='var(--color-inputPost)'
                  stopOpacity={0.2}
                />
              </linearGradient>
              <linearGradient id='fillInputKomen' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--color-inputKomen)'
                  stopOpacity={0.9}
                />
                <stop
                  offset='100%'
                  stopColor='var(--color-inputKomen)'
                  stopOpacity={0.2}
                />
              </linearGradient>
              <linearGradient id='fillInputLike' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--color-inputLike)'
                  stopOpacity={0.9}
                />
                <stop
                  offset='100%'
                  stopColor='var(--color-inputLike)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='label'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={<ChartTooltipContent className='w-[240px]' />}
            />
            <Bar
              dataKey='requestedPost'
              stackId='requested'
              fill='url(#fillRequestedPost)'
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey='requestedKomen'
              stackId='requested'
              fill='url(#fillRequestedKomen)'
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey='requestedLike'
              stackId='requested'
              fill='url(#fillRequestedLike)'
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey='inputPost'
              stackId='input'
              fill='url(#fillInputPost)'
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey='inputKomen'
              stackId='input'
              fill='url(#fillInputKomen)'
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey='inputLike'
              stackId='input'
              fill='url(#fillInputLike)'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
