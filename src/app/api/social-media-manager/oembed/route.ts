import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch oEmbed data for social media URLs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const platform = searchParams.get('platform')?.toLowerCase();

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    let oembedUrl: string;

    // Determine oEmbed endpoint based on platform or URL
    if (
      platform === 'twitter' ||
      platform === 'x' ||
      url.includes('twitter.com') ||
      url.includes('x.com')
    ) {
      oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true&dnt=true`;
    } else if (platform === 'instagram' || url.includes('instagram.com')) {
      oembedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}&omitscript=true`;
    } else if (platform === 'tiktok' || url.includes('tiktok.com')) {
      oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    } else if (platform === 'facebook' || url.includes('facebook.com')) {
      oembedUrl = `https://www.facebook.com/plugins/post/oembed.json/?url=${encodeURIComponent(url)}`;
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported platform' },
        { status: 400 }
      );
    }

    const response = await fetch(oembedUrl, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      console.error(
        'oEmbed fetch failed:',
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { success: false, error: 'Failed to fetch embed data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        html: data.html,
        author_name: data.author_name,
        author_url: data.author_url,
        provider_name: data.provider_name,
        type: data.type,
        width: data.width,
        height: data.height
      }
    });
  } catch (error) {
    console.error('Error in oEmbed API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
