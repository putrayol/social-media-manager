'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface RecentActivity {
  id: number;
  namaAkun: string;
  platform: string;
  jumlahKomentar?: number;
  jumlahTopKomentar?: number;
  createdAt: string;
}

const platformColors: Record<string, string> = {
  TIKTOK: 'bg-black text-white',
  INSTAGRAM: 'bg-pink-500 text-white',
  FACEBOOK: 'bg-blue-600 text-white',
  TWITTER: 'bg-sky-400 text-white',
  YOUTUBE: 'bg-red-600 text-white',
  OTHER: 'bg-gray-500 text-white'
};

export function RecentSales() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cyber troops
        const cyberResponse = await fetch(
          '/api/social-media-manager/cyber-troops?limit=5'
        );
        const cyberResult = await cyberResponse.json();

        if (cyberResult.success) {
          const data = cyberResult.data.map((item: any) => ({
            id: item.id,
            namaAkun: item.namaAkun,
            platform: item.platform,
            jumlahKomentar: item.jumlahKomentar,
            createdAt: item.createdAt
          }));
          setActivities(data);
        }
      } catch (error) {
        console.error('Failed to fetch recent activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Cyber Troops</CardTitle>
        <CardDescription>
          Latest {activities.length} cyber troops activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {activities.map((activity) => (
            <div key={activity.id} className='flex items-center'>
              <Avatar
                className={`h-9 w-9 ${platformColors[activity.platform] || 'bg-gray-500'}`}
              >
                <AvatarFallback>
                  {activity.platform.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='ml-4 space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {activity.namaAkun}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {activity.platform}
                </p>
              </div>
              <div className='ml-auto font-medium'>
                {activity.jumlahKomentar} komentar
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
