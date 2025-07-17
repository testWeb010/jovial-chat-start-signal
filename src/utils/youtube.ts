export interface YouTubeVideoData {
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  channelTitle: string;
}

export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
};

export const getVideoThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export const fetchYouTubeVideoData = async (url: string): Promise<YouTubeVideoData | null> => {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  try {
    // For production, you would use YouTube Data API
    // For now, we'll return mock data with proper thumbnail
    const thumbnail = getVideoThumbnail(videoId);
    
    // You can expand this to use YouTube Data API v3
    return {
      title: 'Video Title (Auto-detected)',
      description: 'Video description will be auto-filled from YouTube',
      thumbnail,
      duration: '0:00',
      views: '0',
      publishedAt: new Date().toISOString(),
      channelTitle: 'Channel Name'
    };
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return null;
  }
};

export const formatDuration = (duration: string): string => {
  // Convert ISO 8601 duration to readable format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

export const formatViews = (views: string | number): string => {
  const num = typeof views === 'string' ? parseInt(views) : views;
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
};