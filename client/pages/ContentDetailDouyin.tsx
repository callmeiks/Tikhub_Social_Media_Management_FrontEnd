import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Calendar,
  Clock,
  MapPin,
  User,
  ShoppingBag,
  AlertTriangle,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  ExternalLink,
  Copy,
  Download,
  Music,
  Bookmark,
  Sparkles,
  Video,
  Image,
  Camera,
  Pin,
  Square,
} from "lucide-react";
import douyinCityList from "../../douyin_city_list.json";

interface DouyinVideoData {
  id: string;
  task_id: string;
  aweme_id: string;
  group_id?: string;
  desc: string;
  create_time: string;
  city: string;
  ip_attribution: string;
  region: string;
  duration: number;
  share_url: string;
  digg_count: number;
  comment_count: number;
  share_count: number;
  collect_count: number;
  play_count: number;
  download_count: number;
  is_ads: boolean;
  is_warned: boolean;
  is_top: boolean;
  with_goods: boolean;
  cha_list: any[];
  author_nickname: string;
  author_unique_id: string;
  author_sec_user_id: string;
  author_uid: string;
  author_avatar: string;
  mid: string;
  music_play_url: string;
  music_duration: number;
  music_author: string;
  image_urls?: string[];
  video_url: string;
  shoot_way: string;
  created_at: string;
  updated_at: string;
}

interface TrendsData {
  likes: Array<{ date: string; value: string }>;
  shares: Array<{ date: string; value: string }>;
  comments: Array<{ date: string; value: string }>;
}

interface AudiencePortraitData {
  phone_price: {
    portrait_data: Array<{ value: number; name: string }>;
    key: string;
  };
  gender: {
    portrait_data: Array<{ value: number; name: string }>;
    key: string;
  };
  age: {
    portrait_data: Array<{ value: number; name: string }>;
    key: string;
  };
  province: {
    portrait_data: Array<{ value: number; name: string }>;
    key: string;
  };
  city: {
    portrait_data: Array<{ value: number; name: string }>;
    key: string;
  };
  city_level: {
    portrait_data: Array<{ value: number; name: string }>;
    key: string;
  };
  phone_brand: {
    portrait_data: Array<{ value: number; name: string }>;
    key: string;
  };
}

interface DouyinAuthorData {
  data: {
    author_avatar: string;
    author_nickname: string;
    author_unique_id: string;
    author_uid: string;
    author_sec_user_id: string;
  };
}

interface DouyinAnalyticsData {
  data: {
    UserID: number;
    avg_aweme_count: number;
    avg_comment_count: number;
    avg_share_count: number;
    avg_follower_count: number;
    avg_like_count: number;
    avg_aweme_count_c: number;
    avg_comment_count_c: number;
    avg_share_count_c: number;
    avg_follower_count_c: number;
    avg_like_count_c: number;
    percentile_aweme_count: number;
    percentile_comment_count: number;
    percentile_share_count: number;
    percentile_follower_count: number;
    percentile_like_count: number;
    percentile_aweme_count_c: number;
    percentile_comment_count_c: number;
    percentile_share_count_c: number;
    percentile_follower_count_c: number;
    percentile_like_count_c: number;
    BaseResp: any;
  };
}

interface CommentWordsData {
  data: Array<{
    word_seg: string;
    value: number;
    related_comment: any;
  }>;
}

interface DanmakuItem {
  danmaku_id: string;
  danmaku_logos: any;
  danmaku_type: number;
  danmaku_type_bits: number;
  digg_count: number;
  digg_type: number;
  dislike_type: number;
  extra: {
    big_thumb: any;
    style_list: any;
  };
  from_copy: boolean;
  has_emoji: boolean;
  is_ad: boolean;
  item_id: string;
  offset_time: number;
  score: number;
  show_copy: boolean;
  show_digg: boolean;
  status: number;
  text: string;
  user_id: string;
}

interface DanmakuData {
  data: Array<DanmakuItem>;
}

interface MusicDetailData {
  data: {
    id: number;
    id_str: string;
    title: string;
    author: string;
    album: string;
    cover_hd: {
      uri: string;
      url_list: string[];
      width: number;
      height: number;
    };
    cover_large: {
      uri: string;
      url_list: string[];
      width: number;
      height: number;
    };
    cover_medium: {
      uri: string;
      url_list: string[];
      width: number;
      height: number;
    };
    cover_thumb: {
      uri: string;
      url_list: string[];
      width: number;
      height: number;
    };
    play_url: {
      uri: string;
      url_list: string[];
      width: number;
      height: number;
      url_key: string;
    };
    source_platform: number;
    duration: number;
    extra: string;
    user_count: number;
    position: any;
    share_info: {
      share_url: string;
      share_weibo_desc: string;
      share_desc: string;
      share_title: string;
      bool_persist: number;
      share_title_myself: string;
      share_title_other: string;
      share_signature_url: string;
      share_signature_desc: string;
      share_quote: string;
      share_desc_info: string;
    };
    collect_stat: number;
    status: number;
    offline_desc: string;
    owner_id: string;
    owner_nickname: string;
    is_original: boolean;
    mid: string;
    binded_challenge_id: number;
    is_restricted: boolean;
    author_deleted: boolean;
    is_del_video: boolean;
    is_video_self_see: boolean;
    owner_handle: string;
    author_position: any;
    prevent_download: boolean;
    unshelve_countries: any;
    prevent_item_download_status: number;
    external_song_info: any[];
    sec_uid: string;
    avatar_thumb: {
      uri: string;
      url_list: string[];
      width: number;
      height: number;
    };
    avatar_medium: {
      uri: string;
      url_list: string[];
      width: number;
      height: number;
    };
    avatar_large: {
      uri: string;
      url_list: string[];
      width: number;
      height: number;
    };
    preview_start_time: number;
    preview_end_time: number;
    is_commerce_music: boolean;
    is_original_sound: boolean;
    audition_duration: number;
    shoot_duration: number;
    reason_type: number;
    artists: any[];
    lyric_short_position: any;
    mute_share: boolean;
    tag_list: any;
    dmv_auto_show: boolean;
    is_pgc: boolean;
    is_matched_metadata: boolean;
    is_audio_url_with_cookie: boolean;
    music_chart_ranks: any;
    can_background_play: boolean;
    music_status: number;
    video_duration: number;
    pgc_music_type: number;
    original_musician_display_name: string;
    author_status: number;
    artist_user_infos: any;
    bit_rate: any;
    dsp_status: number;
    musician_user_infos: any;
    luna_info: {
      is_luna_user: boolean;
    };
    music_collect_count: number;
    music_cover_atmosphere_color_value: string;
    show_origin_clip: boolean;
  };
}

interface RelatedVideosData {
  data: {
    aweme_list: Array<{
      aweme_id: string;
      desc: string;
      duration: number;
      create_time: number;
      author_nickname: string;
      author_unique_id: string;
      author_avatar: string;
      digg_count: number;
      comment_count: number;
      share_count: number;
      collect_count: number;
      video_url: string;
      share_url: string;
    }>;
    total: number;
  };
}

export default function ContentDetailDouyin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<DouyinVideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [audienceData, setAudienceData] = useState<AudiencePortraitData | null>(
    null,
  );
  const [authorData, setAuthorData] = useState<DouyinAuthorData | null>(null);
  const [analyticsData, setAnalyticsData] =
    useState<DouyinAnalyticsData | null>(null);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [audienceLoading, setAudienceLoading] = useState(false);
  const [authorLoading, setAuthorLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [commentWordsData, setCommentWordsData] =
    useState<CommentWordsData | null>(null);
  const [danmakuData, setDanmakuData] = useState<DanmakuData | null>(null);
  const [commentWordsLoading, setCommentWordsLoading] = useState(false);
  const [danmakuLoading, setDanmakuLoading] = useState(false);
  const [musicDetailData, setMusicDetailData] =
    useState<MusicDetailData | null>(null);
  const [musicDetailLoading, setMusicDetailLoading] = useState(false);
  const [relatedVideosData, setRelatedVideosData] =
    useState<RelatedVideosData | null>(null);
  const [relatedVideosLoading, setRelatedVideosLoading] = useState(false);

  useEffect(() => {
    // Check if content data was passed via navigation state
    if (location.state?.contentData) {
      const contentData = location.state.contentData;

      // Map the API data to DouyinVideoData format (assuming similar structure to TikTok)
      const mappedData: DouyinVideoData = {
        id: contentData.id,
        task_id: contentData.task_id,
        aweme_id: contentData.aweme_id,
        group_id: contentData.group_id,
        desc: contentData.desc,
        create_time: contentData.create_time,
        city: contentData.city,
        ip_attribution: contentData.ip_attribution,
        region: contentData.region,
        duration: contentData.duration,
        share_url: contentData.share_url,
        digg_count: contentData.digg_count || contentData.like_count,
        comment_count: contentData.comment_count,
        share_count: contentData.share_count,
        collect_count: contentData.collect_count,
        play_count: contentData.play_count,
        download_count: contentData.download_count,
        is_ads: contentData.is_ads || false,
        is_warned: contentData.is_warned || false,
        is_top: contentData.is_top || false,
        with_goods: contentData.with_goods || false,
        cha_list: contentData.cha_list || [],
        author_nickname: contentData.author_nickname,
        author_unique_id: contentData.author_unique_id,
        author_sec_user_id: contentData.author_sec_user_id,
        author_uid: contentData.author_uid,
        author_avatar: contentData.author_avatar,
        mid: contentData.mid,
        music_play_url: contentData.music_play_url,
        music_duration: contentData.music_duration,
        music_author: contentData.music_author,
        image_urls: contentData.image_urls || [],
        video_url: contentData.video_url,
        shoot_way: contentData.shoot_way,
        created_at: contentData.created_at,
        updated_at: contentData.updated_at,
      };

      setContent(mappedData);
      setLoading(false);
    } else {
      // Fallback to mock data if no data was passed
      setTimeout(() => {
        const mockData: DouyinVideoData = {
          id: "douyin_1",
          task_id: "task_001",
          aweme_id: "7234567890123456789",
          group_id: "group_123",
          desc: "超级好吃的家常菜制作教程 #美食 #家常菜 #教程",
          create_time: "2024-01-01 10:30:00",
          city: "110000",
          ip_attribution: "北京",
          region: "华北",
          duration: 45,
          share_url: "https://www.douyin.com/video/7234567890123456789",
          digg_count: 25680,
          comment_count: 3456,
          share_count: 1234,
          collect_count: 8900,
          play_count: 456789,
          download_count: 567,
          is_ads: false,
          is_warned: false,
          is_top: true,
          with_goods: true,
          cha_list: [
            { cid: "123", cha_name: "美食" },
            { cid: "456", cha_name: "家常菜" },
            { cid: "789", cha_name: "教程" },
          ],
          author_nickname: "美食达人小张",
          author_unique_id: "cooking_master",
          author_sec_user_id: "MS4wLjABAAAA...",
          author_uid: "123456789",
          author_avatar:
            "https://p3.douyinpic.com/aweme/1080x1080/aweme-avatar/mock-avatar.webp",
          mid: "music_123",
          music_play_url: "https://music.douyin.com/123.mp3",
          music_duration: 60,
          music_author: "轻音乐",
          video_url: "https://video.douyin.com/video.mp4",
          shoot_way: "normal",
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
      audio
        .play()
        .then(() => {
          setAudioPlayer(audio);
          setIsPlaying(true);
        })
        .catch((e) => console.error("无法播放音频:", e));

      audio.addEventListener("ended", () => {
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
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${content.music_author || "music"}_${content.mid}.mp3`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("下载失败:", error);
          // Fallback to direct link
          const link = document.createElement("a");
          link.href = content.music_play_url;
          link.download = `${content.music_author || "music"}_${content.mid}.mp3`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    }
  };

  // Get city name from city code
  const getCityName = (cityCode: string) => {
    // 如果cityCode为空或undefined，返回"未知"
    if (!cityCode) {
      return "未知";
    }

    // 如果cityCode已经是城市名（包含"市"或"省"），直接返回
    if (
      cityCode.includes("市") ||
      cityCode.includes("省") ||
      cityCode.includes("区")
    ) {
      return cityCode;
    }

    // 从映射表中查找，如果找不到返回原始code
    const cityName = (douyinCityList as Record<string, string>)[cityCode];
    console.log(`City code: ${cityCode}, City name: ${cityName}`);
    return cityName || cityCode;
  };

  // Fetch trends data
  const fetchTrendsData = async (awemeId: string) => {
    setTrendsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/content-interaction/douyin/analytics/item-trends/${awemeId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_BACKEND_API_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        setTrendsData(result.data);
      } else {
        console.error("Failed to fetch trends data");
      }
    } catch (error) {
      console.error("Error fetching trends data:", error);
    } finally {
      setTrendsLoading(false);
    }
  };

  // Fetch audience portrait data
  const fetchAudienceData = async (awemeId: string) => {
    setAudienceLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/content-interaction/douyin/analytics/post-audience-portrait/${awemeId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_BACKEND_API_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Audience data received:", result.data);
        setAudienceData(result.data);
      } else {
        console.error("Failed to fetch audience data");
      }
    } catch (error) {
      console.error("Error fetching audience data:", error);
    } finally {
      setAudienceLoading(false);
    }
  };

  // Fetch author data
  const fetchAuthorData = async (secUserId: string) => {
    setAuthorLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/douyin/profile/${secUserId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_BACKEND_API_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Author data received:", result);
        setAuthorData(result);
      } else {
        console.error("Failed to fetch author data");
      }
    } catch (error) {
      console.error("Error fetching author data:", error);
    } finally {
      setAuthorLoading(false);
    }
  };

  // Fetch analytics data
  const fetchAnalyticsData = async (secUserId: string) => {
    setAnalyticsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/content-interaction/douyin/analytics/account-analysis/${secUserId}?day=7`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_BACKEND_API_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Analytics data received:", result);
        setAnalyticsData(result);
      } else {
        console.error("Failed to fetch analytics data");
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch comment words data
  const fetchCommentWordsData = async (awemeId: string) => {
    setCommentWordsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/content-interaction/douyin/analytics/comment-words/${awemeId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_BACKEND_API_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Comment words data received:", result);
        setCommentWordsData(result);
      } else {
        console.error("Failed to fetch comment words data");
      }
    } catch (error) {
      console.error("Error fetching comment words data:", error);
    } finally {
      setCommentWordsLoading(false);
    }
  };

  // Fetch danmaku data
  const fetchDanmakuData = async (
    itemId: string,
    duration: number,
    startTime: number = 0,
    endTime?: number,
  ) => {
    setDanmakuLoading(true);
    try {
      const endTimeParam = endTime || duration - 1;
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/content-interaction/douyin/video/${itemId}/danmaku?duration=${duration}&end_time=${endTimeParam}&start_time=${startTime}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_BACKEND_API_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Danmaku data received:", result);
        setDanmakuData(result);
      } else {
        console.error("Failed to fetch danmaku data");
      }
    } catch (error) {
      console.error("Error fetching danmaku data:", error);
    } finally {
      setDanmakuLoading(false);
    }
  };

  // Fetch music detail data
  const fetchMusicDetailData = async (musicId: string) => {
    setMusicDetailLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/content-interaction/douyin/music/${musicId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_BACKEND_API_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Music detail data received:", result);
        setMusicDetailData(result);
      } else {
        console.error("Failed to fetch music detail data");
      }
    } catch (error) {
      console.error("Error fetching music detail data:", error);
    } finally {
      setMusicDetailLoading(false);
    }
  };

  // Fetch related videos data
  const fetchRelatedVideosData = async (awemeId: string) => {
    setRelatedVideosLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/content-interaction/douyin/video/${awemeId}/related-posts?max_posts=20`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_BACKEND_API_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Related videos data received:", result);
        setRelatedVideosData(result);
      } else {
        console.error("Failed to fetch related videos data");
      }
    } catch (error) {
      console.error("Error fetching related videos data:", error);
    } finally {
      setRelatedVideosLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="抖音作品详情" subtitle="加载中...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout title="抖音作品详情" subtitle="作品不存在">
        <div className="text-center py-12">
          <p className="text-muted-foreground">找不到指定的抖音作品</p>
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

  const formatDuration = (duration: number) => {
    // 如果duration很大（超过3600），很可能是毫秒单位，需要转换为秒
    // 抖音视频一般不会超过10分钟（600秒），所以大于1000的值可能是毫秒
    let seconds = duration;
    if (duration > 1000) {
      seconds = Math.floor(duration / 1000);
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getShootWayText = (shootWay: string) => {
    const shootWayMap: { [key: string]: string } = {
      normal: "普通拍摄",
      live: "直播",
      camera: "相机拍摄",
    };
    return shootWayMap[shootWay] || shootWay;
  };

  return (
    <DashboardLayout
      title="抖音作品详情"
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
              抖音作品信息
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
                      poster={content.video_url.replace(".mp4", ".jpg")}
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
                        onClick={() =>
                          window.open(
                            content.video_url || content.share_url,
                            "_blank",
                          )
                        }
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
                  {content.with_goods && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded flex items-center">
                      <ShoppingBag className="mr-1 h-3 w-3" />
                      商品
                    </div>
                  )}
                </div>

                {/* 查看作品按钮 */}
                <div className="mt-4">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => window.open(content.share_url, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    查看作品
                  </Button>
                </div>

                {/* 基本信息 */}
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    发布时间: {content.create_time}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    视频时长: {formatDuration(content.duration)}
                  </div>
                  <div className="flex items-center">
                    <Camera className="h-4 w-4 mr-2" />
                    拍摄方式: {getShootWayText(content.shoot_way)}
                  </div>
                </div>
              </div>

              {/* 作品详情 */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{content.desc}</h1>
                    {content.is_ads && (
                      <Badge variant="destructive" className="text-xs">
                        广告
                      </Badge>
                    )}
                    {content.is_warned && (
                      <Badge
                        variant="outline"
                        className="text-xs border-yellow-500 text-yellow-600"
                      >
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        警告
                      </Badge>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-muted-foreground text-sm">
                      作品ID: {content.aweme_id}
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
                    <h3 className="font-semibold mb-3 flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      作者信息
                    </h3>

                    <div className="flex items-center gap-4 mb-3">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={
                            authorData?.data?.author_avatar ||
                            content.author_avatar
                          }
                          alt={content.author_nickname}
                        />
                        <AvatarFallback>
                          {content.author_nickname.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="space-y-1">
                          <h4 className="font-medium text-lg">
                            {content.author_nickname}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            UID: {content.author_uid}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 地理位置信息 */}
                  <div className="p-4 bg-muted/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      地理位置信息
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">城市: </span>
                        <span>{getCityName(content.city)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          IP归属地:{" "}
                        </span>
                        <span>{content.ip_attribution}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">地区: </span>
                        <span>{content.region}</span>
                      </div>
                    </div>
                  </div>

                  {/* 音乐信息和抖音特性 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* 音乐信息 */}
                    <div className="p-4 bg-muted/20 rounded-lg">
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
                        <div>
                          <span className="text-muted-foreground">
                            音乐ID:{" "}
                          </span>
                          <span>{content.mid}</span>
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
                      </div>
                    </div>

                    {/* 抖音特性 */}
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Sparkles className="mr-2 h-4 w-4" />
                        抖音特性
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-green-500" />
                          <span className="text-sm">广告标识:</span>
                          <Badge
                            variant={content.is_ads ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {content.is_ads ? "是" : "否"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">警告标识:</span>
                          <Badge
                            variant={
                              content.is_warned ? "secondary" : "outline"
                            }
                            className="text-xs"
                          >
                            {content.is_warned ? "是" : "否"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Pin className="h-4 w-4 text-red-500" />
                          <span className="text-sm">置顶:</span>
                          <Badge
                            variant={content.is_top ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {content.is_top ? "是" : "否"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">商品:</span>
                          <Badge
                            variant={
                              content.with_goods ? "secondary" : "outline"
                            }
                            className="text-xs"
                          >
                            {content.with_goods ? "是" : "否"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 其他属性 */}
                  {content.with_goods && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      带有商品推广
                    </div>
                  )}

                  {/* 图片资源（如果有） */}
                  {content.image_urls && content.image_urls.length > 0 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Image className="mr-2 h-4 w-4" />
                        图片资源
                      </h3>
                      <div className="text-sm">
                        <span>共 {content.image_urls.length} 张图片</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 抖音作品分析Tabs */}
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              数据趋势
            </TabsTrigger>
            <TabsTrigger value="author" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              作者信息
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              评论&弹幕
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              音乐详情
            </TabsTrigger>
            <TabsTrigger value="similar" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              同行作品
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              相关产品
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-6">
            <div className="space-y-6">
              {/* 视频数据趋势 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    视频数据趋势
                    <Badge variant="outline" className="text-xs">
                      仅限过去30天发布内视频
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        content && fetchTrendsData(content.aweme_id)
                      }
                      disabled={trendsLoading}
                    >
                      {trendsLoading ? "加载中..." : "刷新数据"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {trendsLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : trendsData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* 点赞量趋势 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            点赞量趋势
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart
                              data={trendsData.likes.map((item) => ({
                                date: new Date(item.date).toLocaleDateString(
                                  "zh-CN",
                                  { month: "short", day: "numeric" },
                                ),
                                value: parseInt(item.value),
                              }))}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" fontSize={12} />
                              <YAxis fontSize={12} />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#ef4444"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* 分享量趋势 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-purple-500" />
                            分享量趋势
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart
                              data={trendsData.shares.map((item) => ({
                                date: new Date(item.date).toLocaleDateString(
                                  "zh-CN",
                                  { month: "short", day: "numeric" },
                                ),
                                value: parseInt(item.value),
                              }))}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" fontSize={12} />
                              <YAxis fontSize={12} />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* 评论量趋势 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            评论量趋势
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <LineChart
                              data={trendsData.comments.map((item) => ({
                                date: new Date(item.date).toLocaleDateString(
                                  "zh-CN",
                                  { month: "short", day: "numeric" },
                                ),
                                value: parseInt(item.value),
                              }))}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" fontSize={12} />
                              <YAxis fontSize={12} />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#10b981"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          点击刷新数据按钮获取视频数据趋势
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 观众画像 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    观众画像分析
                    <Badge variant="outline" className="text-xs">
                      仅限热门内容
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        content && fetchAudienceData(content.aweme_id)
                      }
                      disabled={audienceLoading}
                    >
                      {audienceLoading ? "加载中..." : "刷新数据"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {audienceLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : audienceData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* 手机价格分布 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">
                            手机价格分布
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={audienceData.phone_price.portrait_data.map(
                                  (item) => ({
                                    name: item.name,
                                    value: parseFloat(
                                      (item.value * 100).toFixed(1),
                                    ),
                                  }),
                                )}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#8884d8"
                                label={({ name, value }) =>
                                  `${name}: ${value}%`
                                }
                              >
                                {audienceData.phone_price.portrait_data.map(
                                  (_, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={`hsl(${index * 45}, 70%, 50%)`}
                                    />
                                  ),
                                )}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* 性别分布 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">性别分布</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={audienceData.gender.portrait_data.map(
                                  (item) => ({
                                    name:
                                      item.name === "female" ? "女性" : "男性",
                                    value: parseFloat(
                                      (item.value * 100).toFixed(1),
                                    ),
                                  }),
                                )}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#82ca9d"
                                label={({ name, value }) =>
                                  `${name}: ${value}%`
                                }
                              >
                                {audienceData.gender.portrait_data.map(
                                  (_, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={index === 0 ? "#ff69b4" : "#4169e1"}
                                    />
                                  ),
                                )}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* 年龄分布 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">年龄分布</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={audienceData.age.portrait_data.map(
                                  (item) => ({
                                    name: item.name,
                                    value: parseFloat(
                                      (item.value * 100).toFixed(1),
                                    ),
                                  }),
                                )}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#ffc658"
                                label={({ name, value }) =>
                                  `${name}: ${value}%`
                                }
                              >
                                {audienceData.age.portrait_data.map(
                                  (_, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={`hsl(${index * 60}, 70%, 50%)`}
                                    />
                                  ),
                                )}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* 地域分布-省份 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">
                            地域分布-省份
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={audienceData.province.portrait_data
                                  .slice(0, 8)
                                  .map((item) => ({
                                    name: item.name,
                                    value: parseFloat(
                                      (item.value * 100).toFixed(1),
                                    ),
                                  }))}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#8dd1e1"
                                label={({ name, value }) =>
                                  `${name}: ${value}%`
                                }
                              >
                                {audienceData.province.portrait_data
                                  .slice(0, 8)
                                  .map((_, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={`hsl(${index * 45}, 70%, 50%)`}
                                    />
                                  ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* 地域分布-城市 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">
                            地域分布-城市
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={audienceData.city.portrait_data
                                  .slice(0, 8)
                                  .map((item) => ({
                                    name: item.name,
                                    value: parseFloat(
                                      (item.value * 100).toFixed(1),
                                    ),
                                  }))}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#d084d0"
                                label={({ name, value }) =>
                                  `${name}: ${value}%`
                                }
                              >
                                {audienceData.city.portrait_data
                                  .slice(0, 8)
                                  .map((_, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={`hsl(${index * 45}, 70%, 50%)`}
                                    />
                                  ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* 城市等级 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">城市等级</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={audienceData.city_level.portrait_data.map(
                                  (item) => ({
                                    name: item.name,
                                    value: parseFloat(
                                      (item.value * 100).toFixed(1),
                                    ),
                                  }),
                                )}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#ffb347"
                                label={({ name, value }) =>
                                  `${name}: ${value}%`
                                }
                              >
                                {audienceData.city_level.portrait_data.map(
                                  (_, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={`hsl(${index * 50}, 70%, 50%)`}
                                    />
                                  ),
                                )}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* 手机品牌分布 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">
                            手机品牌分布
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={audienceData.phone_brand.portrait_data.map(
                                  (item) => ({
                                    name: item.name,
                                    value: parseFloat(
                                      (item.value * 100).toFixed(1),
                                    ),
                                  }),
                                )}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#90ee90"
                                label={({ name, value }) =>
                                  `${name}: ${value}%`
                                }
                              >
                                {audienceData.phone_brand.portrait_data.map(
                                  (_, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={`hsl(${index * 40}, 70%, 50%)`}
                                    />
                                  ),
                                )}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <PieChartIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          点击刷新数据按钮获取观众画像分析
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="author" className="mt-6">
            <div className="space-y-6">
              {/* 作者基本信息 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    作者详细信息
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        fetchAuthorData(content.author_sec_user_id)
                      }
                      disabled={authorLoading}
                    >
                      {authorLoading ? "加载中..." : "刷新数据"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {authorLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : authorData ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                        <Avatar className="w-20 h-20">
                          <AvatarImage
                            src={authorData.data.author_avatar}
                            alt={authorData.data.author_nickname}
                          />
                          <AvatarFallback>
                            {authorData.data.author_nickname.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">
                            {authorData.data.author_nickname}
                          </h3>
                          <p className="text-muted-foreground">
                            @{authorData.data.author_unique_id}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            UID: {authorData.data.author_uid}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                        <Avatar className="w-20 h-20">
                          <AvatarImage
                            src={content.author_avatar}
                            alt={content.author_nickname}
                          />
                          <AvatarFallback>
                            {content.author_nickname.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">
                            {content.author_nickname}
                          </h3>
                          <p className="text-muted-foreground">
                            @{content.author_unique_id}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            UID: {content.author_uid}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 用户发布作品数据分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    用户发布作品数据分析
                    <Badge variant="outline" className="text-xs">
                      过去7天
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        fetchAnalyticsData(content.author_sec_user_id)
                      }
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
                      {/* 平均数据概览 */}
                      <div>
                        <h4 className="font-medium mb-4">平均数据概览</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {analyticsData.data.avg_aweme_count.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              平均作品数
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              变化率:{" "}
                              {(
                                analyticsData.data.avg_aweme_count_c * 100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {analyticsData.data.avg_comment_count.toFixed(0)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              平均评论数
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              变化率:{" "}
                              {(
                                analyticsData.data.avg_comment_count_c * 100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {analyticsData.data.avg_share_count.toFixed(0)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              平均分享数
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              变化率:{" "}
                              {(
                                analyticsData.data.avg_share_count_c * 100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                              {analyticsData.data.avg_follower_count.toFixed(0)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              平均粉丝数
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              变化率:{" "}
                              {(
                                analyticsData.data.avg_follower_count_c * 100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                              {analyticsData.data.avg_like_count.toFixed(0)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              平均点赞数
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              变化率:{" "}
                              {(
                                analyticsData.data.avg_like_count_c * 100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 百分位数据 */}
                      <div>
                        <h4 className="font-medium mb-4">百分位数据</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                            <div className="text-lg font-bold">
                              {analyticsData.data.percentile_aweme_count}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              百分位作品数
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              变化率:{" "}
                              {(
                                analyticsData.data.percentile_aweme_count_c *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                            <div className="text-lg font-bold">
                              {analyticsData.data.percentile_comment_count}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              百分位评论数
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              变化率:{" "}
                              {(
                                analyticsData.data.percentile_comment_count_c *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                            <div className="text-lg font-bold">
                              {analyticsData.data.percentile_share_count}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              百分位分享数
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              变化率:{" "}
                              {(
                                analyticsData.data.percentile_share_count_c *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                            <div className="text-lg font-bold">
                              {analyticsData.data.percentile_follower_count}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              百分位粉丝数
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              变化率:{" "}
                              {(
                                analyticsData.data.percentile_follower_count_c *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                            <div className="text-lg font-bold">
                              {analyticsData.data.percentile_like_count}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              百分位点赞数
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              变化率:{" "}
                              {(
                                analyticsData.data.percentile_like_count_c * 100
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 数据对比图表 */}
                      <div>
                        <h4 className="font-medium mb-4">数据对比图表</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">
                                平均数据对比
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                  data={[
                                    {
                                      name: "作品数",
                                      value: analyticsData.data.avg_aweme_count,
                                    },
                                    {
                                      name: "评论数",
                                      value:
                                        analyticsData.data.avg_comment_count,
                                    },
                                    {
                                      name: "分享数",
                                      value: analyticsData.data.avg_share_count,
                                    },
                                    {
                                      name: "粉丝数",
                                      value:
                                        analyticsData.data.avg_follower_count,
                                    },
                                    {
                                      name: "点赞数",
                                      value: analyticsData.data.avg_like_count,
                                    },
                                  ]}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">
                                变化率对比
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                  data={[
                                    {
                                      name: "作品数",
                                      value:
                                        analyticsData.data.avg_aweme_count_c *
                                        100,
                                    },
                                    {
                                      name: "评论数",
                                      value:
                                        analyticsData.data.avg_comment_count_c *
                                        100,
                                    },
                                    {
                                      name: "分享数",
                                      value:
                                        analyticsData.data.avg_share_count_c *
                                        100,
                                    },
                                    {
                                      name: "粉丝数",
                                      value:
                                        analyticsData.data
                                          .avg_follower_count_c * 100,
                                    },
                                    {
                                      name: "点赞数",
                                      value:
                                        analyticsData.data.avg_like_count_c *
                                        100,
                                    },
                                  ]}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip
                                    formatter={(value) =>
                                      `${Number(value).toFixed(1)}%`
                                    }
                                  />
                                  <Bar dataKey="value" fill="#82ca9d" />
                                </BarChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        暂无用户数据分析
                      </p>
                      <Button
                        onClick={() =>
                          fetchAnalyticsData(content.author_sec_user_id)
                        }
                      >
                        加载数据分析
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <div className="space-y-6">
              {/* 评论分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    评论词汇分析
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fetchCommentWordsData(content.aweme_id)}
                      disabled={commentWordsLoading}
                    >
                      {commentWordsLoading ? "加载中..." : "获取评论分析"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {commentWordsLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : commentWordsData ? (
                    <div className="space-y-6">
                      {/* 词汇统计图表 */}
                      <div>
                        <h4 className="font-medium mb-4">热门评论词汇统计</h4>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart
                            data={commentWordsData.data
                              .slice(0, 20)
                              .map((item) => ({
                                word: item.word_seg,
                                count: item.value,
                              }))}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="word"
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              fontSize={12}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* 词汇列表 */}
                      <div>
                        <h4 className="font-medium mb-4">评论词汇详情</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {commentWordsData.data
                            .slice(0, 20)
                            .map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                              >
                                <span className="font-medium text-sm">
                                  {item.word_seg}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {item.value}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* 完整词汇表格 */}
                      <div>
                        <h4 className="font-medium mb-4">所有评论词汇</h4>
                        <div className="max-h-96 overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>排名</TableHead>
                                <TableHead>词汇</TableHead>
                                <TableHead>出现次数</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {commentWordsData.data.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell className="font-medium">
                                    {item.word_seg}
                                  </TableCell>
                                  <TableCell>{item.value}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        暂无评论词汇分析数据
                      </p>
                      <Button
                        onClick={() => fetchCommentWordsData(content.aweme_id)}
                      >
                        获取评论分析
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 弹幕数据 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Square className="w-5 h-5" />
                    视频弹幕列表
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        fetchDanmakuData(content.aweme_id, content.duration)
                      }
                      disabled={danmakuLoading}
                    >
                      {danmakuLoading ? "加载中..." : "获取弹幕数据"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {danmakuLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : danmakuData ? (
                    <div className="space-y-4">
                      {/* 弹幕统计概览 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {danmakuData.data.length}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            弹幕总数
                          </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {danmakuData.data.reduce(
                              (sum, item) => sum + item.digg_count,
                              0,
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            总点赞数
                          </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {
                              danmakuData.data.filter((item) => item.has_emoji)
                                .length
                            }
                          </div>
                          <div className="text-sm text-muted-foreground">
                            表情弹幕
                          </div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {Math.max(
                              ...danmakuData.data.map(
                                (item) => item.offset_time,
                              ),
                              0,
                            )}
                            ms
                          </div>
                          <div className="text-sm text-muted-foreground">
                            最晚弹幕时间
                          </div>
                        </div>
                      </div>

                      {/* 弹幕列表 */}
                      <div>
                        <h4 className="font-medium mb-4">弹幕详情列表</h4>
                        <div className="max-h-96 overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>时间</TableHead>
                                <TableHead>弹幕内容</TableHead>
                                <TableHead>点赞数</TableHead>
                                <TableHead>用户ID</TableHead>
                                <TableHead>状态</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {danmakuData.data.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {Math.floor(item.offset_time / 1000)}s
                                  </TableCell>
                                  <TableCell className="max-w-xs">
                                    <div className="flex items-center gap-2">
                                      <span>{item.text}</span>
                                      {item.has_emoji && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          😊
                                        </Badge>
                                      )}
                                      {item.is_ad && (
                                        <Badge
                                          variant="destructive"
                                          className="text-xs"
                                        >
                                          广告
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>{item.digg_count}</TableCell>
                                  <TableCell className="text-xs text-muted-foreground">
                                    {item.user_id.substring(0, 8)}...
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        item.status === 1
                                          ? "secondary"
                                          : "outline"
                                      }
                                      className="text-xs"
                                    >
                                      {item.status === 1 ? "正常" : "异常"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Square className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">暂无弹幕数据</p>
                      <Button
                        onClick={() =>
                          fetchDanmakuData(content.aweme_id, content.duration)
                        }
                      >
                        获取弹幕数据
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  相关产品
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      相关产品功能即将推出
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="music" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  音乐详情
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchMusicDetailData(content.mid)}
                    disabled={musicDetailLoading}
                  >
                    {musicDetailLoading ? "加载中..." : "获取详细信息"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {musicDetailLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : musicDetailData ? (
                  <div className="space-y-6">
                    {/* 音乐基本信息 */}
                    <div className="flex items-start gap-6">
                      {/* 音乐封面 */}
                      <div className="w-48 h-48 rounded-lg overflow-hidden bg-muted">
                        {musicDetailData.data.cover_large?.url_list?.[0] ? (
                          <img
                            src={musicDetailData.data.cover_large.url_list[0]}
                            alt={musicDetailData.data.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music className="w-16 h-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* 音乐信息 */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold">
                            {musicDetailData.data.title}
                          </h3>
                          <p className="text-lg text-muted-foreground mt-1">
                            {musicDetailData.data.author}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {musicDetailData.data.is_original && (
                            <Badge variant="secondary">原创音乐</Badge>
                          )}
                          {musicDetailData.data.is_original_sound && (
                            <Badge variant="secondary">原声</Badge>
                          )}
                          {musicDetailData.data.is_commerce_music && (
                            <Badge variant="outline">商业音乐</Badge>
                          )}
                          {musicDetailData.data.is_pgc && (
                            <Badge variant="outline">PGC</Badge>
                          )}
                        </div>

                        {/* 播放控制 */}
                        {musicDetailData.data.play_url?.url_list?.[0] && (
                          <div className="flex gap-2">
                            {!isPlaying ? (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => {
                                  if (audioPlayer) {
                                    audioPlayer.pause();
                                  }
                                  const audio = new Audio(
                                    musicDetailData.data.play_url.url_list[0],
                                  );
                                  audio
                                    .play()
                                    .then(() => {
                                      setAudioPlayer(audio);
                                      setIsPlaying(true);
                                    })
                                    .catch((e) =>
                                      console.error("无法播放音频:", e),
                                    );

                                  audio.addEventListener("ended", () => {
                                    setIsPlaying(false);
                                    setAudioPlayer(null);
                                  });
                                }}
                              >
                                <Play className="mr-1 h-3 w-3" />
                                播放音乐
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={handleStopMusic}
                              >
                                <Square className="mr-1 h-3 w-3" />
                                停止播放
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const url =
                                  musicDetailData.data.play_url.url_list[0];
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = `${musicDetailData.data.title}_${musicDetailData.data.mid}.mp3`;
                                link.target = "_blank";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <Download className="mr-1 h-3 w-3" />
                              下载音乐
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(
                                  musicDetailData.data.share_info.share_url,
                                  "_blank",
                                )
                              }
                            >
                              <ExternalLink className="mr-1 h-3 w-3" />
                              查看原音乐
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 详细信息网格 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted/20 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          音乐ID
                        </div>
                        <div className="font-medium">
                          {musicDetailData.data.mid}
                        </div>
                      </div>
                      <div className="p-4 bg-muted/20 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          音乐时长
                        </div>
                        <div className="font-medium">
                          {formatDuration(musicDetailData.data.duration)}
                        </div>
                      </div>
                      <div className="p-4 bg-muted/20 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          使用人数
                        </div>
                        <div className="font-medium">
                          {musicDetailData.data.user_count.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4 bg-muted/20 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          收藏数
                        </div>
                        <div className="font-medium">
                          {musicDetailData.data.music_collect_count.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4 bg-muted/20 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          音乐状态
                        </div>
                        <div className="font-medium">
                          <Badge
                            variant={
                              musicDetailData.data.status === 1
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {musicDetailData.data.status === 1
                              ? "正常"
                              : "异常"}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 bg-muted/20 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          平台来源
                        </div>
                        <div className="font-medium">
                          平台 {musicDetailData.data.source_platform}
                        </div>
                      </div>
                    </div>

                    {/* 作者信息 */}
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        音乐作者信息
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            {musicDetailData.data.avatar_thumb
                              ?.url_list?.[0] ? (
                              <AvatarImage
                                src={
                                  musicDetailData.data.avatar_thumb.url_list[0]
                                }
                                alt={musicDetailData.data.owner_nickname}
                              />
                            ) : null}
                            <AvatarFallback>
                              {musicDetailData.data.owner_nickname.substring(
                                0,
                                2,
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {musicDetailData.data.owner_nickname}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              @{musicDetailData.data.owner_handle}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            作者ID
                          </div>
                          <div className="font-medium">
                            {musicDetailData.data.owner_id}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 分享信息 */}
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center">
                        <Share2 className="mr-2 h-4 w-4" />
                        分享信息
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            分享标题:{" "}
                          </span>
                          <span>
                            {musicDetailData.data.share_info.share_title}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            分享描述:{" "}
                          </span>
                          <span>
                            {musicDetailData.data.share_info.share_desc}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            分享链接:{" "}
                          </span>
                          <a
                            href={musicDetailData.data.share_info.share_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {musicDetailData.data.share_info.share_url}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* 附加信息 */}
                    {musicDetailData.data.album && (
                      <div className="p-4 bg-muted/20 rounded-lg">
                        <h4 className="font-medium mb-2">专辑信息</h4>
                        <p>{musicDetailData.data.album}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* 基础音乐信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">音乐作者</label>
                        <p className="text-lg">{content.music_author}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">音乐ID</label>
                        <p className="text-lg">{content.mid}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">音乐时长</label>
                        <p className="text-lg">
                          {formatDuration(content.music_duration)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">音乐URL</label>
                        <p className="text-sm text-muted-foreground break-all">
                          {content.music_play_url}
                        </p>
                      </div>
                    </div>

                    {content.music_play_url && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">音乐播放控制</h4>
                        <div className="flex gap-2">
                          {!isPlaying ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handlePlayMusic}
                            >
                              <Play className="mr-1 h-3 w-3" />
                              播放音乐
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleStopMusic}
                            >
                              <Square className="mr-1 h-3 w-3" />
                              停止播放
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDownloadMusic}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            下载音乐
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="text-center mt-4">
                      <Button onClick={() => fetchMusicDetailData(content.mid)}>
                        获取音乐详细信息
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="similar" className="mt-6">
            <div className="space-y-6">
              {/* 相关推荐视频 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    相关推荐视频
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <Button
                        onClick={() =>
                          content && fetchRelatedVideosData(content.aweme_id)
                        }
                        disabled={relatedVideosLoading}
                      >
                        {relatedVideosLoading
                          ? "加载中..."
                          : "获取相关推荐视频"}
                      </Button>
                    </div>

                    {relatedVideosData &&
                    relatedVideosData.data.aweme_list.length > 0 ? (
                      <div className="h-96 overflow-y-auto space-y-3 pr-2">
                        {relatedVideosData.data.aweme_list.map(
                          (video, index) => (
                            <div
                              key={video.aweme_id}
                              className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() =>
                                window.open(video.share_url, "_blank")
                              }
                            >
                              {/* 视频预览 */}
                              <div className="flex-shrink-0">
                                <div className="relative w-16 h-16 bg-black rounded-lg overflow-hidden">
                                  <video
                                    className="w-full h-full object-cover"
                                    poster={video.author_avatar}
                                    preload="metadata"
                                    muted
                                    onMouseEnter={(e) => {
                                      const videoElement =
                                        e.target as HTMLVideoElement;
                                      videoElement.currentTime = 0;
                                      videoElement.play().catch(() => {});
                                    }}
                                    onMouseLeave={(e) => {
                                      const videoElement =
                                        e.target as HTMLVideoElement;
                                      videoElement.pause();
                                      videoElement.currentTime = 0;
                                    }}
                                  >
                                    <source
                                      src={video.video_url}
                                      type="video/mp4"
                                    />
                                  </video>

                                  {/* 播放按钮 */}
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Play className="h-4 w-4 text-white" />
                                  </div>

                                  {/* 时长 */}
                                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                                    {Math.floor(video.duration / 1000)}s
                                  </div>
                                </div>
                              </div>

                              {/* 内容信息 */}
                              <div className="flex-1 min-w-0 space-y-1">
                                {/* 作者信息 */}
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={video.author_avatar} />
                                    <AvatarFallback className="text-xs">
                                      {video.author_nickname[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-xs truncate">
                                      {video.author_nickname}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      @{video.author_unique_id}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {new Date(
                                      video.create_time * 1000,
                                    ).toLocaleDateString()}
                                  </Badge>
                                </div>

                                {/* 视频描述和互动数据在同一行 */}
                                <div className="flex items-start gap-3">
                                  <p className="text-xs text-gray-700 line-clamp-1 flex-1">
                                    {video.desc || "无描述"}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                                    <div className="flex items-center gap-1">
                                      <Heart className="h-3 w-3 text-red-500" />
                                      <span>
                                        {(video.digg_count / 10000).toFixed(1)}w
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MessageCircle className="h-3 w-3 text-blue-500" />
                                      <span>{video.comment_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Share2 className="h-3 w-3 text-green-500" />
                                      <span>{video.share_count}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* 打开按钮 */}
                              <div className="flex-shrink-0 flex items-center">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  打开
                                </Button>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    ) : relatedVideosData ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                          <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            暂无相关推荐视频
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                          <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            点击上方按钮获取相关推荐视频
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 相关挑战视频 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    相关挑战视频
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <h4 className="font-medium mb-3">当前作品话题</h4>
                      <div className="flex flex-wrap gap-2">
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
                    </div>

                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          相关挑战视频分析功能即将推出
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
