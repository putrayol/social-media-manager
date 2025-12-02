'use client';

import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useEffect, useState, useMemo } from 'react';

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

// Platform colors for consistent styling
const platformColors = {
  TIKTOK: '#000000',
  INSTAGRAM: '#E1306C',
  FACEBOOK: '#1877F2',
  TWITTER: '#1DA1F2',
  YOUTUBE: '#FF0000',
  OTHER: '#6B7280'
} as const;

type Platform = keyof typeof platformColors;

interface PlatformActivityData {
  date: string;
  fullDate: string;
  tiktokPosts: number;
  tiktokComments: number;
  tiktokLikes: number;
  instagramPosts: number;
  instagramComments: number;
  instagramLikes: number;
  facebookPosts: number;
  facebookComments: number;
  facebookLikes: number;
  twitterPosts: number;
  twitterComments: number;
  twitterLikes: number;
  youtubePosts: number;
  youtubeComments: number;
  youtubeLikes: number;
  otherPosts: number;
  otherComments: number;
  otherLikes: number;
}

const chartConfig = {
  tiktokPosts: { label: 'TikTok Posts', color: platformColors.TIKTOK },
  tiktokComments: { label: 'TikTok Comments', color: platformColors.TIKTOK },
  tiktokLikes: { label: 'TikTok Likes', color: platformColors.TIKTOK },
  instagramPosts: { label: 'Instagram Posts', color: platformColors.INSTAGRAM },
  instagramComments: {
    label: 'Instagram Comments',
    color: platformColors.INSTAGRAM
  },
  instagramLikes: { label: 'Instagram Likes', color: platformColors.INSTAGRAM },
  facebookPosts: { label: 'Facebook Posts', color: platformColors.FACEBOOK },
  facebookComments: {
    label: 'Facebook Comments',
    color: platformColors.FACEBOOK
  },
  facebookLikes: { label: 'Facebook Likes', color: platformColors.FACEBOOK },
  twitterPosts: { label: 'Twitter Posts', color: platformColors.TWITTER },
  twitterComments: { label: 'Twitter Comments', color: platformColors.TWITTER },
  twitterLikes: { label: 'Twitter Likes', color: platformColors.TWITTER },
  youtubePosts: { label: 'YouTube Posts', color: platformColors.YOUTUBE },
  youtubeComments: { label: 'YouTube Comments', color: platformColors.YOUTUBE },
  youtubeLikes: { label: 'YouTube Likes', color: platformColors.YOUTUBE },
  otherPosts: { label: 'Other Posts', color: platformColors.OTHER },
  otherComments: { label: 'Other Comments', color: platformColors.OTHER },
  otherLikes: { label: 'Other Likes', color: platformColors.OTHER }
} satisfies ChartConfig;

type MetricType = 'posts' | 'comments' | 'likes';

export function AreaGraph() {
  const [chartData, setChartData] = useState<PlatformActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<MetricType>('posts');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get date range for last 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);

        // Fetch cyber troops and top komentar data
        const [cyberResponse, topResponse] = await Promise.all([
          fetch('/api/social-media-manager/cyber-troops?limit=1000'),
          fetch('/api/social-media-manager/top-komentar?limit=1000')
        ]);

        const cyberResult = await cyberResponse.json();
        const topResult = await topResponse.json();

        if (cyberResult.success && topResult.success) {
          // Initialize data for last 7 days
          const dateMap = new Map<string, PlatformActivityData>();

          for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateKey = date.toISOString().split('T')[0];
            const displayDate = date.toLocaleDateString('id-ID', {
              weekday: 'short',
              day: 'numeric'
            });

            dateMap.set(dateKey, {
              date: displayDate,
              fullDate: dateKey,
              tiktokPosts: 0,
              tiktokComments: 0,
              tiktokLikes: 0,
              instagramPosts: 0,
              instagramComments: 0,
              instagramLikes: 0,
              facebookPosts: 0,
              facebookComments: 0,
              facebookLikes: 0,
              twitterPosts: 0,
              twitterComments: 0,
              twitterLikes: 0,
              youtubePosts: 0,
              youtubeComments: 0,
              youtubeLikes: 0,
              otherPosts: 0,
              otherComments: 0,
              otherLikes: 0
            });
          }

          // Process cyber troops data (posts with comments and likes)
          cyberResult.data.forEach((item: any) => {
            const itemDate = new Date(item.createdAt);
            const dateKey = itemDate.toISOString().split('T')[0];

            if (dateMap.has(dateKey)) {
              const entry = dateMap.get(dateKey)!;
              const platform = (
                item.platform || 'OTHER'
              ).toUpperCase() as Platform;

              const platformKey = platform.toLowerCase() as Lowercase<Platform>;
              const postsKey =
                `${platformKey}Posts` as keyof PlatformActivityData;
              const commentsKey =
                `${platformKey}Comments` as keyof PlatformActivityData;
              const likesKey =
                `${platformKey}Likes` as keyof PlatformActivityData;

              if (postsKey in entry) {
                (entry[postsKey] as number) += 1;
                (entry[commentsKey] as number) += item.jumlahKomentar || 0;
                (entry[likesKey] as number) += item.jumlahLike || 0;
              }
            }
          });

          // Process top komentar data (adds to comments and likes)
          topResult.data.forEach((item: any) => {
            const itemDate = new Date(item.createdAt);
            const dateKey = itemDate.toISOString().split('T')[0];

            if (dateMap.has(dateKey)) {
              const entry = dateMap.get(dateKey)!;
              const platform = (
                item.platform || 'OTHER'
              ).toUpperCase() as Platform;

              const platformKey = platform.toLowerCase() as Lowercase<Platform>;
              const commentsKey =
                `${platformKey}Comments` as keyof PlatformActivityData;
              const likesKey =
                `${platformKey}Likes` as keyof PlatformActivityData;

              if (commentsKey in entry) {
                (entry[commentsKey] as number) += item.jumlahTopKomentar || 0;
                (entry[likesKey] as number) += item.jumlahLike || 0;
              }
            }
          });

          const sortedData = Array.from(dateMap.values()).sort(
            (a, b) =>
              new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
          );
          setChartData(sortedData);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate totals for summary
  const totals = useMemo(() => {
    const result = {
      posts: {
        tiktok: 0,
        instagram: 0,
        facebook: 0,
        twitter: 0,
        youtube: 0,
        other: 0
      },
      comments: {
        tiktok: 0,
        instagram: 0,
        facebook: 0,
        twitter: 0,
        youtube: 0,
        other: 0
      },
      likes: {
        tiktok: 0,
        instagram: 0,
        facebook: 0,
        twitter: 0,
        youtube: 0,
        other: 0
      }
    };

    chartData.forEach((day) => {
      result.posts.tiktok += day.tiktokPosts;
      result.posts.instagram += day.instagramPosts;
      result.posts.facebook += day.facebookPosts;
      result.posts.twitter += day.twitterPosts;
      result.posts.youtube += day.youtubePosts;
      result.posts.other += day.otherPosts;

      result.comments.tiktok += day.tiktokComments;
      result.comments.instagram += day.instagramComments;
      result.comments.facebook += day.facebookComments;
      result.comments.twitter += day.twitterComments;
      result.comments.youtube += day.youtubeComments;
      result.comments.other += day.otherComments;

      result.likes.tiktok += day.tiktokLikes;
      result.likes.instagram += day.instagramLikes;
      result.likes.facebook += day.facebookLikes;
      result.likes.twitter += day.twitterLikes;
      result.likes.youtube += day.youtubeLikes;
      result.likes.other += day.otherLikes;
    });

    return result;
  }, [chartData]);

  const totalForMetric = useMemo(() => {
    const metricTotals = totals[activeMetric];
    return Object.values(metricTotals).reduce((a, b) => a + b, 0);
  }, [totals, activeMetric]);

  // Get the bar keys based on active metric
  const getBarKeys = () => {
    const suffix = activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1);
    return [
      { key: `tiktok${suffix}`, color: platformColors.TIKTOK, name: 'TikTok' },
      {
        key: `instagram${suffix}`,
        color: platformColors.INSTAGRAM,
        name: 'Instagram'
      },
      {
        key: `facebook${suffix}`,
        color: platformColors.FACEBOOK,
        name: 'Facebook'
      },
      {
        key: `twitter${suffix}`,
        color: platformColors.TWITTER,
        name: 'Twitter'
      },
      {
        key: `youtube${suffix}`,
        color: platformColors.YOUTUBE,
        name: 'YouTube'
      },
      { key: `other${suffix}`, color: platformColors.OTHER, name: 'Other' }
    ];
  };

  if (loading || chartData.length === 0) {
    return null;
  }

  const metricLabels = {
    posts: 'Postingan',
    comments: 'Komentar',
    likes: 'Like'
  };

  return (
    <Card className='@container/card'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0! sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>
            Aktivitas per platform dalam 7 hari terakhir
          </CardDescription>
        </div>
        <div className='flex'>
          {(['posts', 'comments', 'likes'] as MetricType[]).map((metric) => (
            <button
              key={metric}
              data-active={activeMetric === metric}
              className='data-[active=true]:bg-muted/50 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
              onClick={() => setActiveMetric(metric)}
            >
              <span className='text-muted-foreground text-xs'>
                {metricLabels[metric]}
              </span>
              <span className='text-lg leading-none font-bold sm:text-3xl'>
                {Object.values(totals[metric])
                  .reduce((a, b) => a + b, 0)
                  .toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[280px] w-full'
        >
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              width={40}
            />
            <ChartTooltip
              cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
              content={<ChartTooltipContent indicator='dot' />}
            />
            {getBarKeys().map(({ key, color, name }) => (
              <Line
                key={key}
                type='monotone'
                dataKey={key}
                name={name}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
        {/* Platform Legend */}
        <div className='mt-4 flex flex-wrap justify-center gap-4'>
          {getBarKeys().map(({ name, color }) => (
            <div key={name} className='flex items-center gap-2'>
              <div
                className='h-3 w-3 rounded-sm'
                style={{ backgroundColor: color }}
              />
              <span className='text-muted-foreground text-xs'>{name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
