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
    // Use backend API to fetch YouTube data
    const response = await fetch(`http://localhost:3001/api/youtube/video/${videoId}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch video data');
    }
    
    const data = await response.json();
    
    return {
      title: data.title || 'YouTube Video',
      description: data.description || 'No description available',
      thumbnail: data.thumbnail || getVideoThumbnail(videoId),
      duration: data.duration || '0:00',
      views: data.views || '0',
      publishedAt: data.publishedAt || new Date().toISOString(),
      channelTitle: data.channelTitle || 'Unknown Channel'
    };
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    // Return basic data with thumbnail if API fails
    return {
      title: 'YouTube Video',
      description: 'Video from YouTube',
      thumbnail: getVideoThumbnail(videoId),
      duration: '0:00',
      views: '0',
      publishedAt: new Date().toISOString(),
      channelTitle: 'YouTube'
    };
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