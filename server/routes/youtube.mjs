import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Get YouTube video data
router.get('/video/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ message: 'YouTube API key not configured' });
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from YouTube API');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const statistics = video.statistics;
    const contentDetails = video.contentDetails;

    // Convert duration from ISO 8601 to readable format
    const formatDuration = (duration) => {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return '0:00';
      
      const hours = parseInt(match[1] || '0');
      const minutes = parseInt(match[2] || '0');
      const seconds = parseInt(match[3] || '0');
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    };

    // Format view count
    const formatViews = (views) => {
      const num = parseInt(views);
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}K`;
      }
      return num.toString();
    };

    const videoData = {
      title: snippet.title,
      description: snippet.description,
      thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
      duration: formatDuration(contentDetails.duration),
      views: formatViews(statistics.viewCount),
      publishedAt: snippet.publishedAt,
      channelTitle: snippet.channelTitle
    };

    res.json(videoData);
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    res.status(500).json({ message: 'Failed to fetch video data' });
  }
});

export default router;