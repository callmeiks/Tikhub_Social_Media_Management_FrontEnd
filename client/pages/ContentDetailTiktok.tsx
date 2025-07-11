import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  MapPin,
  User,
  ShoppingBag,
  AlertTriangle,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Shield,
  ExternalLink,
  Copy,
  Star,
  Download,
  Music,
  Bookmark,
  Sparkles,
  Bot,
  Ban,
  Video,
  Image,
  Pin,
  Square,
} from "lucide-react";

interface TiktokVideoData {
  id: string;
  task_id: string;
  aweme_id: string;
  content_type: string;
  desc: string;
  group_id?: string;
  share_url: string;
  desc_language: string;
  created_by_ai: boolean;
  is_capcut?: boolean;
  is_ads: boolean;
  is_top: boolean;
  is_vr: boolean;
  support_danmaku: boolean;
  is_pgcshow: boolean;
  last_aigc_src?: string;
  first_aigc_src?: string;
  aigc_src?: string;
  has_promote_entry?: boolean;
  cha_list: any[];
  with_promotional_music: boolean;
  adv_promotable?: boolean;
  author_sec_user_id: string;
  author_uid: string;
  author_nickname: string;
  author_unique_id: string;
  mid: string;
  music_play_url: string;
  music_duration: number;
  music_author: string;
  collect_count: number;
  comment_count: number;
  digg_count: number;
  download_count: number;
  play_count: number;
  share_count: number;
  video_url: string;
  duration: number;
  create_time: number;
  created_at: string;
  updated_at: string;
}

interface TiktokAnalyticsData {
  data: {
    item_id: string;
    comments: { value: number; message: any };
    comments_14_days: { value: Array<{ value: number; message: any }>; interval: number };
    favorites: { value: number; message: any };
    favorites_14_days: { value: Array<{ value: number; message: any }>; interval: number };
    likes: { value: number; message: any };
    likes_14_days: { value: Array<{ value: number; message: any }>; interval: number };
    video_summary: { content: string; title: string; summary_type: number };
    video_views: { value: number; message: any };
    video_views_14_days: { value: Array<{ value: number; message: any }>; interval: number };
  };
}

interface TiktokCreatorData {
  data: {
    user_id: string;
    creator_info: {
      avatar_url: string;
      follower_count: number;
      like_count: number;
      nickname: string;
      sec_user_id: string;
      unique_id: string;
    };
    milestones: Array<{
      milestone: number;
      milestone_title: { value: string };
      milestone_year: { value: string };
      milestone_month_day: { value: string };
      creator_summary: { value: string };
      top_3_items?: Array<{
        value: {
          aweme_id: string;
          desc: string;
          create_time: number;
          statistics: {
            collect_count: number;
            comment_count: number;
            digg_count: number;
            play_count: number;
            share_count: number;
          };
          video: {
            cover: { url_list: string[] };
            duration: number;
            play_addr: { url_list: string[] };
          };
        };
      }>;
    }>;
  };
}

export default function ContentDetailTiktok() {
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<TiktokVideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<TiktokAnalyticsData | null>(null);
  const [creatorData, setCreatorData] = useState<TiktokCreatorData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [creatorLoading, setCreatorLoading] = useState(false);
  const [wordCloudData, setWordCloudData] = useState<any | null>(null);
  const [wordCloudLoading, setWordCloudLoading] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check if content data was passed via navigation state
    if (location.state?.contentData) {
      const contentData = location.state.contentData;
      
      // Map the API data to TiktokVideoData format
      const mappedData: TiktokVideoData = {
        id: contentData.id,
        task_id: contentData.task_id,
        aweme_id: contentData.aweme_id,
        content_type: contentData.content_type || "video",
        desc: contentData.desc,
        group_id: contentData.group_id,
        share_url: contentData.share_url,
        desc_language: contentData.desc_language || "en",
        created_by_ai: contentData.created_by_ai || false,
        is_capcut: contentData.is_capcut,
        is_ads: contentData.is_ads || false,
        is_top: contentData.is_top || false,
        is_vr: contentData.is_vr || false,
        support_danmaku: contentData.support_danmaku || false,
        is_pgcshow: contentData.is_pgcshow || false,
        last_aigc_src: contentData.last_aigc_src,
        first_aigc_src: contentData.first_aigc_src,
        aigc_src: contentData.aigc_src,
        has_promote_entry: contentData.has_promote_entry,
        cha_list: contentData.cha_list || [],
        with_promotional_music: contentData.with_promotional_music || false,
        adv_promotable: contentData.adv_promotable,
        author_sec_user_id: contentData.author_sec_user_id,
        author_uid: contentData.author_uid,
        author_nickname: contentData.author_nickname,
        author_unique_id: contentData.author_unique_id,
        mid: contentData.mid,
        music_play_url: contentData.music_play_url,
        music_duration: contentData.music_duration,
        music_author: contentData.music_author,
        collect_count: contentData.collect_count,
        comment_count: contentData.comment_count,
        digg_count: contentData.digg_count || contentData.like_count,
        download_count: contentData.download_count,
        play_count: contentData.play_count,
        share_count: contentData.share_count,
        video_url: contentData.video_url,
        duration: contentData.duration,
        create_time: contentData.create_time,
        created_at: contentData.created_at,
        updated_at: contentData.updated_at,
      };
      
      setContent(mappedData);
      setLoading(false);
    } else {
      // Fallback to mock data if no data was passed
      setTimeout(() => {
        const mockData: TiktokVideoData = {
          id: "tiktok_1",
          task_id: "task_001",
          aweme_id: "7234567890123456789",
          content_type: "video",
          desc: "Amazing dance moves! #dance #viral #trending",
          group_id: "group_123",
          share_url: "https://www.tiktok.com/@user/video/7234567890123456789",
          desc_language: "en",
          created_by_ai: false,
          is_capcut: false,
          is_ads: false,
          is_top: true,
          is_vr: false,
          support_danmaku: false,
          is_pgcshow: false,
          last_aigc_src: null,
          first_aigc_src: null,
          aigc_src: null,
          has_promote_entry: false,
          cha_list: [
            { cid: "123", cha_name: "dance" },
            { cid: "456", cha_name: "viral" },
          ],
          with_promotional_music: false,
          adv_promotable: true,
          author_sec_user_id: "MS4wLjABAAAA...",
          author_uid: "123456789",
          author_nickname: "DanceQueen",
          author_unique_id: "dancequeen2024",
          mid: "music_123",
          music_play_url: "https://music.tiktok.com/123.mp3",
          music_duration: 30,
          music_author: "Trending Beat",
          collect_count: 15000,
          comment_count: 2800,
          digg_count: 45000,
          download_count: 1200,
          play_count: 850000,
          share_count: 3500,
          video_url: "https://video.tiktok.com/video.mp4",
          duration: 15,
          create_time: 1704067200,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        };
        setContent(mockData);
        setLoading(false);
      }, 500);
    }
  }, [location.state]);

  // Cleanup audio player on component unmount
  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
    };
  }, [audioPlayer]);

  // Music playback functions
  const handlePlayMusic = () => {
    if (content?.music_play_url) {
      if (audioPlayer) {
        audioPlayer.pause();
      }
      const audio = new Audio(content.music_play_url);
      audio.play().then(() => {
        setAudioPlayer(audio);
        setIsPlaying(true);
      }).catch(e => console.error('无法播放音频:', e));
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setAudioPlayer(null);
      });
    }
  };

  const handleStopMusic = () => {
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      setAudioPlayer(null);
      setIsPlaying(false);
    }
  };

  const handleDownloadMusic = () => {
    if (content?.music_play_url) {
      fetch(content.music_play_url)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${content.music_author || 'music'}_${content.mid}.mp3`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('下载失败:', error);
          // Fallback to direct link
          const link = document.createElement('a');
          link.href = content.music_play_url;
          link.download = `${content.music_author || 'music'}_${content.mid}.mp3`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
        setAudioPlayer(null);
      }
    };
  }, [audioPlayer]);

  // Fetch analytics data
  const fetchAnalyticsData = async (awemeId: string) => {
    if (!awemeId) return;
    
    setAnalyticsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8002";
      const token = import.meta.env.VITE_BACKEND_API_TOKEN || localStorage.getItem("auth_token");
      
      const response = await fetch(
        `${API_BASE_URL}/api/content-interaction/tiktok/analytics/video-metrics/${awemeId}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        console.error('Failed to fetch analytics data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch creator data
  const fetchCreatorData = async (userId: string) => {
    if (!userId) return;
    
    setCreatorLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8002";
      const token = import.meta.env.VITE_BACKEND_API_TOKEN || localStorage.getItem("auth_token");
      
      const response = await fetch(
        `${API_BASE_URL}/api/content-interaction/tiktok/analytics/creator-info/${userId}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setCreatorData(data);
      } else {
        console.error('Failed to fetch creator data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching creator data:', error);
    } finally {
      setCreatorLoading(false);
    }
  };

  // Fetch word cloud data
  const fetchWordCloudData = async (awemeId: string) => {
    if (!awemeId) return;
    
    setWordCloudLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8002";
      const token = import.meta.env.VITE_BACKEND_API_TOKEN || localStorage.getItem("auth_token");
      
      const response = await fetch(
        `${API_BASE_URL}/api/content-interaction/tiktok/analytics/comment-keywords/${awemeId}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setWordCloudData(data);
      } else {
        console.error('Failed to fetch word cloud data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching word cloud data:', error);
    } finally {
      setWordCloudLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="TikTok作品详情" subtitle="加载中...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout title="TikTok作品详情" subtitle="作品不存在">
        <div className="text-center py-12">
          <p className="text-muted-foreground">找不到指定的TikTok作品</p>
          <Button
            onClick={() => navigate(-1)}
            className="mt-4"
            variant="outline"
          >
            返回
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(content.share_url);
    alert("链接已复制到剪贴板");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("zh-CN");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <DashboardLayout
      title="TikTok作品详情"
      subtitle={content.desc}
      actions={
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/data-collection/content-interaction")}
            className="h-8"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            返回作品列表
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className="h-8"
          >
            <Copy className="mr-2 h-3.5 w-3.5" />
            复制链接
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(content.share_url, "_blank")}
            className="h-8"
          >
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            查看原作品
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 作品基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5" />
              TikTok作品信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 视频预览 */}
              <div className="lg:col-span-1">
                <div className="aspect-[9/16] rounded-lg overflow-hidden bg-black relative max-w-sm mx-auto">
                  {content.video_url ? (
                    <video
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                      poster={content.video_url.replace('.mp4', '.jpg')}
                    >
                      <source src={content.video_url} type="video/mp4" />
                      您的浏览器不支持视频播放
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {!content.video_url && (
                      <Button
                        size="lg"
                        className="rounded-full w-16 h-16 p-0 brand-accent pointer-events-auto"
                        onClick={() => window.open(content.share_url, "_blank")}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
                    {formatDuration(content.duration)}
                  </div>
                  {content.is_top && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Pin className="mr-1 h-3 w-3" />
                      置顶
                    </div>
                  )}
                </div>
              </div>

              {/* 作品详情 */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{content.desc}</h1>
                    {content.created_by_ai && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="mr-1 h-3 w-3" />
                        AI生成
                      </Badge>
                    )}
                    {content.is_ads && (
                      <Badge variant="destructive" className="text-xs">
                        广告
                      </Badge>
                    )}
                    {content.is_vr && (
                      <Badge variant="outline" className="text-xs">
                        VR
                      </Badge>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-muted-foreground text-sm">
                      内容类型:{" "}
                      {content.content_type === "video" ? "视频" : "图片"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      作品ID: {content.aweme_id}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      描述语言: {content.desc_language}
                    </p>
                  </div>

                  {/* 标签显示 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {content.cha_list.map((tag: any, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        #{tag.cha_name}
                      </Badge>
                    ))}
                  </div>

                  {/* 数据统计 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="h-4 w-4 mr-1 text-blue-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.play_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        播放量
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Heart className="h-4 w-4 mr-1 text-red-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.digg_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        点赞数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <MessageCircle className="h-4 w-4 mr-1 text-green-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.comment_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        评论数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Share2 className="h-4 w-4 mr-1 text-purple-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.share_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        分享数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Bookmark className="h-4 w-4 mr-1 text-orange-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.collect_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        收藏数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Download className="h-4 w-4 mr-1 text-gray-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.download_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        下载数
                      </div>
                    </div>
                  </div>

                  {/* 作者信息 */}
                  <div className="p-4 bg-muted/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">作者信息</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">昵称: </span>
                        <span>{content.author_nickname}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">用户ID: </span>
                        <span>{content.author_unique_id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">UID: </span>
                        <span>{content.author_uid}</span>
                      </div>
                    </div>
                  </div>

                  {/* 音乐信息 */}
                  <div className="p-4 bg-muted/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Music className="mr-2 h-4 w-4" />
                      音乐信息
                    </h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          音乐作者:{" "}
                        </span>
                        <span>{content.music_author}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          音乐时长:{" "}
                        </span>
                        <span>{formatDuration(content.music_duration)}</span>
                      </div>
                      {content.music_play_url && (
                        <div className="flex gap-2 mt-2">
                          {!isPlaying ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handlePlayMusic}
                            >
                              <Play className="mr-1 h-3 w-3" />
                              播放
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleStopMusic}
                            >
                              <Square className="mr-1 h-3 w-3" />
                              停止
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDownloadMusic}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            下载
                          </Button>
                        </div>
                      )}
                      {content.with_promotional_music && (
                        <Badge variant="outline" className="w-fit">
                          推广音乐
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* TikTok特性信息 */}
                  <div className="p-4 bg-muted/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">TikTok特性</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {content.created_by_ai && (
                        <Badge variant="secondary" className="text-xs">
                          <Bot className="mr-1 h-3 w-3" />
                          AI生成
                        </Badge>
                      )}
                      {content.is_ads && (
                        <Badge variant="destructive" className="text-xs">
                          <Target className="mr-1 h-3 w-3" />
                          广告内容
                        </Badge>
                      )}
                      {content.is_top && (
                        <Badge variant="default" className="text-xs bg-red-500">
                          <Pin className="mr-1 h-3 w-3" />
                          置顶作品
                        </Badge>
                      )}
                      {content.is_pgcshow && (
                        <Badge variant="outline" className="text-xs">
                          <Star className="mr-1 h-3 w-3" />
                          专业内容
                        </Badge>
                      )}
                      {content.support_danmaku && (
                        <Badge variant="outline" className="text-xs">
                          <MessageCircle className="mr-1 h-3 w-3" />
                          支持弹幕
                        </Badge>
                      )}
                      {content.adv_promotable && (
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          可推广
                        </Badge>
                      )}
                      {content.with_promotional_music && (
                        <Badge variant="outline" className="text-xs">
                          <Music className="mr-1 h-3 w-3" />
                          推广音乐
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* 其他属性 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      发布时间: {formatDate(content.create_time)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      视频时长: {formatDuration(content.duration)}
                    </div>
                    {content.has_promote_entry && (
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        有推广入口
                      </div>
                    )}
                  </div>

                  {/* AI相关信息 */}
                  {(content.aigc_src ||
                    content.first_aigc_src ||
                    content.last_aigc_src) && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Bot className="mr-2 h-4 w-4" />
                        AI信息
                      </h3>
                      <div className="text-sm space-y-1">
                        {content.aigc_src && (
                          <div>
                            <span className="text-muted-foreground">
                              AIGC源:{" "}
                            </span>
                            <span>{content.aigc_src}</span>
                          </div>
                        )}
                        {content.first_aigc_src && (
                          <div>
                            <span className="text-muted-foreground">
                              首次AIGC源:{" "}
                            </span>
                            <span>{content.first_aigc_src}</span>
                          </div>
                        )}
                        {content.last_aigc_src && (
                          <div>
                            <span className="text-muted-foreground">
                              最新AIGC源:{" "}
                            </span>
                            <span>{content.last_aigc_src}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TikTok作品分析Tabs */}
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              数据趋势
            </TabsTrigger>
            <TabsTrigger value="author" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              作者信息
            </TabsTrigger>
            <TabsTrigger value="wordcloud" className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              词云分析
            </TabsTrigger>
            <TabsTrigger value="traffic" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              流量分析
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              关联产品
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  数据趋势分析
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchAnalyticsData(content.aweme_id)}
                    disabled={analyticsLoading}
                  >
                    {analyticsLoading ? "加载中..." : "刷新数据"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : analyticsData ? (
                  <div className="space-y-6">
                    {/* 概览信息 */}
                    {analyticsData.data.video_summary && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 className="font-semibold mb-2">{analyticsData.data.video_summary.title}</h3>
                        <p className="text-sm text-muted-foreground">{analyticsData.data.video_summary.content}</p>
                      </div>
                    )}

                    {/* 当前数据概览 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {analyticsData.data.video_views?.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">视频播放量</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {analyticsData.data.likes?.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">点赞数</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {analyticsData.data.comments?.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">评论数</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {analyticsData.data.favorites?.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">收藏数</div>
                      </div>
                    </div>

                    {/* 14天趋势图表 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">播放量趋势 (14天)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analyticsData.data.video_views_14_days?.value.map((item, index) => ({
                              day: `第${index + 1}天`,
                              value: item.value,
                              timestamp: item.message.timestamp
                            }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">点赞趋势 (14天)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analyticsData.data.likes_14_days?.value.map((item, index) => ({
                              day: `第${index + 1}天`,
                              value: item.value,
                              timestamp: item.message.timestamp
                            }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">评论趋势 (14天)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analyticsData.data.comments_14_days?.value.map((item, index) => ({
                              day: `第${index + 1}天`,
                              value: item.value,
                              timestamp: item.message.timestamp
                            }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">收藏趋势 (14天)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analyticsData.data.favorites_14_days?.value.map((item, index) => ({
                              day: `第${index + 1}天`,
                              value: item.value,
                              timestamp: item.message.timestamp
                            }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">暂无数据趋势信息</p>
                    <Button onClick={() => fetchAnalyticsData(content.aweme_id)}>
                      加载数据趋势
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="author" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  作者详细信息
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchCreatorData(content.author_uid)}
                    disabled={creatorLoading}
                  >
                    {creatorLoading ? "加载中..." : "刷新数据"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {creatorLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : creatorData ? (
                  <div className="space-y-6">
                    {/* 作者基本信息 */}
                    <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={creatorData.data.creator_info.avatar_url} alt={creatorData.data.creator_info.nickname} />
                        <AvatarFallback>{creatorData.data.creator_info.nickname.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{creatorData.data.creator_info.nickname}</h3>
                        <p className="text-muted-foreground">@{creatorData.data.creator_info.unique_id}</p>
                        <div className="flex gap-4 mt-2">
                          <div className="text-sm">
                            <span className="font-medium">{creatorData.data.creator_info.follower_count.toLocaleString()}</span>
                            <span className="text-muted-foreground ml-1">粉丝</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{creatorData.data.creator_info.like_count.toLocaleString()}</span>
                            <span className="text-muted-foreground ml-1">获赞</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 里程碑信息 */}
                    <div>
                      <h4 className="font-semibold mb-4">成长里程碑</h4>
                      <div className="space-y-4">
                        {creatorData.data.milestones.map((milestone, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                {milestone.milestone}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium">{milestone.milestone_title.value}</h5>
                                  <Badge variant="outline" className="text-xs">
                                    {milestone.milestone_year.value}/{milestone.milestone_month_day.value}
                                  </Badge>
                                </div>
                                {milestone.creator_summary.value && (
                                  <p className="text-sm text-muted-foreground">{milestone.creator_summary.value}</p>
                                )}
                                {milestone.top_3_items && milestone.top_3_items.length > 0 && (
                                  <div className="mt-3">
                                    <h6 className="text-sm font-medium mb-2">代表作品</h6>
                                    <div className="grid grid-cols-1 gap-2">
                                      {milestone.top_3_items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                                          <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                                            <img 
                                              src={item.value.video.cover.url_list[0]} 
                                              alt="视频封面"
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-sm font-medium line-clamp-1">{item.value.desc}</p>
                                            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                                              <span>{item.value.statistics.play_count.toLocaleString()}播放</span>
                                              <span>{item.value.statistics.digg_count.toLocaleString()}点赞</span>
                                              <span>{item.value.statistics.comment_count.toLocaleString()}评论</span>
                                            </div>
                                          </div>
                                          <div className="flex gap-1">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="h-8 px-2"
                                              onClick={() => {
                                                if (item.value.video.play_addr.url_list[0]) {
                                                  const videoUrl = item.value.video.play_addr.url_list[0];
                                                  fetch(videoUrl)
                                                    .then(response => response.blob())
                                                    .then(blob => {
                                                      const url = window.URL.createObjectURL(blob);
                                                      const link = document.createElement('a');
                                                      link.href = url;
                                                      link.download = `milestone_video_${item.value.aweme_id}.mp4`;
                                                      document.body.appendChild(link);
                                                      link.click();
                                                      document.body.removeChild(link);
                                                      window.URL.revokeObjectURL(url);
                                                    })
                                                    .catch(error => {
                                                      console.error('下载失败:', error);
                                                      // Fallback: open in new tab
                                                      window.open(videoUrl, '_blank');
                                                    });
                                                }
                                              }}
                                            >
                                              <Download className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">暂无作者详细信息</p>
                    <Button onClick={() => fetchCreatorData(content.author_uid)}>
                      加载作者信息
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wordcloud" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  词云分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wordCloudLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : wordCloudData ? (
                  <div className="space-y-6">
                    {/* 关键词列表 */}
                    <div>
                      <h3 className="font-semibold mb-4">热门关键词</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {wordCloudData.data.key_words.comment_key_words.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="font-medium">{item.key_word}</span>
                            <Badge variant="secondary" className="text-xs">
                              {item.comments.length}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 关键词统计图表 */}
                    <div>
                      <h3 className="font-semibold mb-4">关键词频次分布</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={wordCloudData.data.key_words.comment_key_words.slice(0, 10).map((item: any) => ({
                          word: item.key_word,
                          count: item.comments.length
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="word" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* 评论详情 */}
                    <div>
                      <h3 className="font-semibold mb-4">关键词评论详情</h3>
                      <div className="space-y-4">
                        {wordCloudData.data.key_words.comment_key_words.slice(0, 5).map((item: any, index: number) => (
                          <div key={index} className="p-4 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline">{item.key_word}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {item.comments.length} 条评论
                              </span>
                            </div>
                            <div className="space-y-2">
                              {item.comments.slice(0, 2).map((comment: any, commentIndex: number) => (
                                <div key={commentIndex} className="flex items-start gap-3 p-2 bg-background rounded">
                                  <img 
                                    src={comment.comment_author.cover.url_list[0]} 
                                    alt={comment.comment_author.nick_name}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm">{comment.comment_author.nick_name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        👍 {comment.digg_count}
                                      </span>
                                    </div>
                                    <p className="text-sm">{comment.text}</p>
                                  </div>
                                </div>
                              ))}
                              {item.comments.length > 2 && (
                                <div className="text-xs text-muted-foreground text-center">
                                  还有 {item.comments.length - 2} 条评论...
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <PieChartIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">暂无词云分析数据</p>
                    <Button onClick={() => fetchWordCloudData(content.aweme_id)}>
                      加载词云分析
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  流量分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">流量分析功能开发中...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  关联产品
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">关联产品功能开发中...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
