import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  RefreshCw,
  Download,
  Filter,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Users,
  CheckCircle,
  AlertTriangle,
  Link,
  BarChart3,
  Plus,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Star,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Play,
  Image,
  User,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

const supportedPlatforms = [
  { id: "all", name: "全部平台", emoji: "🌐" },
  { id: "douyin", name: "抖音", emoji: "🎤", domain: "douyin.com" },
  { id: "tiktok", name: "TikTok", emoji: "🎵", domain: "tiktok.com" },
  { id: "kuaishou", name: "快手", emoji: "⚡", domain: "kuaishou.com" },
  { id: "youtube", name: "YouTube", emoji: "📹", domain: "youtube.com" },
  { id: "x", name: "X", emoji: "🐦", domain: "x.com" },
  { id: "weibo", name: "微博", emoji: "📝", domain: "weibo.com" },
  { id: "wechat", name: "微信公众号", emoji: "💬", domain: "mp.weixin.qq.com" },
  { id: "instagram", name: "Instagram", emoji: "📷", domain: "instagram.com" },
  { id: "bilibili", name: "哔哩哔哩", emoji: "📺", domain: "bilibili.com" },
];

// Sample data for demonstration
const sampleContentData = [
  {
    id: 1,
    title: "超火的韩式裸妆教程！新手必看",
    platform: "抖音",
    author: "美妆达人小丽",
    url: "https://www.douyin.com/video/123456",
    publishedAt: "2024-01-20",
    views: "230万",
    likes: "15.6万",
    comments: "3.2万",
    shares: "8.5千",
    collections: "12.3万",
    addedAt: "2024-01-21 10:30",
    coverUrl:
      "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=400&h=600&fit=crop",
    duration: "00:15",
    contentType: "美妆教程",
  },
  {
    id: 2,
    title: "学生党宿舍收���神器推荐",
    platform: "小红书",
    author: "生活记录家",
    url: "https://www.xiaohongshu.com/discovery/item/456789",
    publishedAt: "2024-01-19",
    views: "120万",
    likes: "8.9万",
    comments: "1.5万",
    shares: "3.2千",
    collections: "25.6万",
    addedAt: "2024-01-21 09:15",
    coverUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
    duration: "-",
    contentType: "生活分享",
  },
  {
    id: 3,
    title: "iPhone 15 Pro Max Deep Review",
    platform: "TikTok",
    author: "TechReviewer",
    url: "https://www.tiktok.com/@techreviewer/video/789012",
    publishedAt: "2024-01-21",
    views: "450万",
    likes: "25.8万",
    comments: "8.9万",
    shares: "12.5千",
    collections: "18.7万",
    addedAt: "2024-01-21 14:20",
    coverUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=600&fit=crop",
    duration: "03:25",
    contentType: "数码评测",
  },
  {
    id: 4,
    title: "创意料理：芝士焗红薯制作教程",
    platform: "哔哩哔哩",
    author: "��食up主",
    url: "https://www.bilibili.com/video/BV123456789",
    publishedAt: "2024-01-18",
    views: "89万",
    likes: "12.5万",
    comments: "2.8万",
    shares: "4.1千",
    collections: "8.9万",
    addedAt: "2024-01-21 16:45",
    coverUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop",
    duration: "05:30",
    contentType: "美食制作",
  },
];

// 作品详情展示组件
const ContentDetailsRow: React.FC<{ content: any }> = ({ content }) => {
  return (
    <div className="p-4 bg-muted/30 border-t">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 作品详情 */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            作品详情
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                内容类型:
              </span>
              <span className="ml-2">{content.contentType}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">时长:</span>
              <span className="ml-2">{content.duration}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                发布时间:
              </span>
              <span className="ml-2">{content.publishedAt}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                添加时间:
              </span>
              <span className="ml-2">{content.addedAt}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                作品链接:
              </span>
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:underline text-xs break-all"
              >
                {content.url.length > 60
                  ? content.url.substring(0, 60) + "..."
                  : content.url}
              </a>
            </div>
          </div>
        </div>

        {/* 作者信息 */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <User className="h-4 w-4 mr-2" />
            作者信息
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                ���者名称:
              </span>
              <span className="ml-2">{content.author}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                发布平台:
              </span>
              <span className="ml-2">{content.platform}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">作品ID:</span>
              <span className="ml-2 font-mono text-xs">{content.id}</span>
            </div>
          </div>
        </div>

        {/* 数据统计 */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            数据统计
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1 text-blue-500" />
              <span className="font-medium text-muted-foreground">播放:</span>
              <span className="ml-1">{content.views}</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-3 w-3 mr-1 text-red-500" />
              <span className="font-medium text-muted-foreground">点赞:</span>
              <span className="ml-1">{content.likes}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
              <span className="font-medium text-muted-foreground">评论:</span>
              <span className="ml-1">{content.comments}</span>
            </div>
            <div className="flex items-center">
              <Share2 className="h-3 w-3 mr-1 text-purple-500" />
              <span className="font-medium text-muted-foreground">分享:</span>
              <span className="ml-1">{content.shares}</span>
            </div>
            <div className="flex items-center col-span-2">
              <Users className="h-3 w-3 mr-1 text-orange-500" />
              <span className="font-medium text-muted-foreground">收藏:</span>
              <span className="ml-1">{content.collections}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ApiAnalysisResult {
  total_successful: number;
  total_failed: number;
  failed_urls: string[];
}

interface BaseContent {
  id: string;
  platform: string;
  like_count: number;
  task_id: string;
  created_at: string;
  updated_at: string;
}

interface TikTokContent extends BaseContent {
  platform: "tiktok";
  aweme_id: string;
  desc: string;
  author_nickname: string;
  author_unique_id: string;
  author_uid: string;
  author_sec_user_id: string;
  video_url: string;
  play_count: number;
  comment_count: number;
  share_count: number;
  collect_count: number;
  digg_count: number;
  download_count: number;
  duration: number;
  share_url: string;
  created_by_ai: boolean;
  is_ads: boolean;
  is_top: boolean;
  is_pgcshow: boolean;
  support_danmaku: boolean;
  adv_promotable: boolean;
  with_promotional_music: boolean;
  music_play_url: string;
  music_author: string;
  music_duration: number;
  mid: string;
  create_time: number;
  content_type?: string;
  desc_language?: string;
  is_capcut?: boolean;
  is_vr?: boolean;
  last_aigc_src?: string;
  first_aigc_src?: string;
  aigc_src?: string;
  has_promote_entry?: boolean;
  cha_list?: any[];
  group_id?: string;
}

interface DouyinContent extends BaseContent {
  platform: "douyin";
  aweme_id: string;
  desc: string;
  author_nickname: string;
  author_unique_id: string;
  video_url: string;
  play_count: number;
  comment_count: number;
  share_count: number;
  collect_count: number;
  digg_count: number;
  duration: number;
  share_url: string;
}

interface KuaishouContent extends BaseContent {
  platform: "kuaishou";
  photo_id: string;
  video_caption: string;
  author_name: string;
  author_avatar?: string;
  view_count: number;
  comment_count: number;
  share_count: number;
  collect_count: number;
  video_duration: number;
  video_url: string;
  video_play_url: string;
}

interface WechatContent extends BaseContent {
  platform: "wechat";
  title: string;
  author: string;
  summary: string;
  article_url: string;
  read_count: number;
  comment_count: number;
  share_count: number;
  collect_count: number;
  images_url?: string[];
}

interface WeiboContent extends BaseContent {
  platform: "weibo";
  post_id: string;
  text_raw: string;
  author_screen_name: string;
  reposts_count: number;
  comments_count: number;
  attitudes_count: number;
  images_urls: string[];
  video_play_urls: string[];
}

interface YoutubeContent extends BaseContent {
  platform: "youtube";
  video_id: string;
  title: string;
  channel_name: string;
  view_count: number;
  comment_count: number;
  video_play_url: string;
  length_seconds: number;
}

interface XContent extends BaseContent {
  platform: "x";
  tweet_id: string;
  text: string;
  author_screen_name: string;
  retweet_count: number;
  replies_count: number;
  bookmarks_count: number;
  view_count: number;
  images_url: string[];
  video_url: string;
}

interface InstagramContent extends BaseContent {
  platform: "instagram";
  post_id: string;
  caption: string;
  author_username: string;
  author_full_name: string;
  view_count: number;
  comment_count: number;
  media_type: string;
  video_url?: string;
  image_urls?: string[];
  carousel_media?: any[];
}

interface BilibiliContent extends BaseContent {
  platform: "bilibili";
  bvid: string;
  title: string;
  author_name: string;
  author_mid: string;
  view_count: number;
  danmaku_count: number;
  reply_count: number;
  favorite_count: number;
  coin_count: number;
  share_count: number;
  video_url: string;
  duration: number;
}

type ContentItem =
  | TikTokContent
  | DouyinContent
  | KuaishouContent
  | WechatContent
  | WeiboContent
  | YoutubeContent
  | XContent
  | InstagramContent
  | BilibiliContent;

interface ContentApiResponse {
  items: ContentItem[];
  total: number;
  page: number;
  limit: number;
}

export default function ContentInteraction() {
  const navigate = useNavigate();
  const [batchUrls, setBatchUrls] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contentData, setContentData] = useState(sampleContentData);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    supportedPlatforms.map((p) => p.name),
  );
  const [selectedContent, setSelectedContent] = useState<number[]>([]);
  const [expandedContent, setExpandedContent] = useState<number[]>([]);
  const [analysisResult, setAnalysisResult] =
    useState<ApiAnalysisResult | null>(null);
  const [showResultAlert, setShowResultAlert] = useState(false);

  // New states for API content
  const [apiContentData, setApiContentData] = useState<ContentItem[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortByLikes, setSortByLikes] = useState<
    "" | "ascending" | "descending"
  >("");
  const [activeTab, setActiveTab] = useState("add");

  const urlCount = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0).length;

  const validateUrl = (url: string) => {
    return supportedPlatforms.some(
      (platform) => platform.domain && url.includes(platform.domain),
    );
  };

  // Helper function to format numbers
  const formatNumber = (num: number): string => {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(1) + "亿";
    } else if (num >= 10000) {
      return (num / 10000).toFixed(1) + "万";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "千";
    }
    return num.toString();
  };

  // Helper function to get content title/description
  const getContentTitle = (content: ContentItem): string => {
    switch (content.platform) {
      case "tiktok":
      case "douyin":
        return (content as TikTokContent | DouyinContent).desc || "无描述";
      case "kuaishou":
        return (content as KuaishouContent).video_caption || "无描述";
      case "wechat":
        return (content as WechatContent).title || "无标题";
      case "weibo":
        return (content as WeiboContent).text_raw || "无内容";
      case "youtube":
        return (content as YoutubeContent).title || "无标题";
      case "x":
        return (content as XContent).text || "无内容";
      case "instagram":
        return (content as InstagramContent).caption || "无描述";
      case "bilibili":
        return (content as BilibiliContent).title || "无标题";
      default:
        return "无描述";
    }
  };

  // Helper function to get author name
  const getAuthorName = (content: ContentItem): string => {
    switch (content.platform) {
      case "tiktok":
      case "douyin":
        return (
          (content as TikTokContent | DouyinContent).author_nickname ||
          "未知作者"
        );
      case "kuaishou":
        return (content as KuaishouContent).author_name || "未知作者";
      case "wechat":
        return (content as WechatContent).author || "未知作者";
      case "weibo":
        return (content as WeiboContent).author_screen_name || "未知作者";
      case "youtube":
        return (content as YoutubeContent).channel_name || "未知频道";
      case "x":
        return (content as XContent).author_screen_name || "未知作者";
      case "instagram":
        return (content as InstagramContent).author_username || "未知作者";
      case "bilibili":
        return (content as BilibiliContent).author_name || "未知作者";
      default:
        return "未知作者";
    }
  };

  // Helper function to get view/play count
  const getViewCount = (content: ContentItem): number => {
    switch (content.platform) {
      case "tiktok":
      case "douyin":
        return (content as TikTokContent | DouyinContent).play_count || 0;
      case "kuaishou":
        return (content as KuaishouContent).view_count || 0;
      case "wechat":
        return (content as WechatContent).read_count || 0;
      case "youtube":
        return (content as YoutubeContent).view_count || 0;
      case "x":
        return (content as XContent).view_count || 0;
      case "weibo":
        return 0; // Weibo doesn't have view count in the data
      case "instagram":
        return (content as InstagramContent).view_count || 0;
      case "bilibili":
        return (content as BilibiliContent).view_count || 0;
      default:
        return 0;
    }
  };

  // Helper function to get share URL
  const getShareUrl = (content: ContentItem): string => {
    switch (content.platform) {
      case "tiktok":
      case "douyin":
        return (content as TikTokContent | DouyinContent).share_url || "";
      case "wechat":
        return (content as WechatContent).article_url || "";
      default:
        return "";
    }
  };

  // Helper function to get comment count
  const getCommentCount = (content: ContentItem): number => {
    switch (content.platform) {
      case "weibo":
        return (content as WeiboContent).comments_count || 0;
      case "x":
        return (content as XContent).replies_count || 0;
      case "bilibili":
        return (content as BilibiliContent).reply_count || 0;
      default:
        return (content as any).comment_count || 0;
    }
  };

  // Helper function to get share count
  const getShareCount = (content: ContentItem): number => {
    switch (content.platform) {
      case "weibo":
        return (content as WeiboContent).reposts_count || 0;
      case "x":
        return (content as XContent).retweet_count || 0;
      case "bilibili":
        return (content as BilibiliContent).share_count || 0;
      default:
        return (content as any).share_count || 0;
    }
  };

  // Helper function to get platform display name
  const getPlatformDisplayName = (platform: string): string => {
    const platformInfo = supportedPlatforms.find((p) => p.id === platform);
    return platformInfo?.name || platform;
  };

  // Helper function to handle content row click and navigate to appropriate detail page
  const handleContentRowClick = (content: ContentItem) => {
    const platformRoutes = {
      tiktok: "tiktok",
      douyin: "douyin",
      kuaishou: "kuaishou",
      youtube: "youtube",
      x: "x",
      weibo: "weibo",
      wechat: "wechat",
      instagram: "instagram",
      bilibili: "bilibili",
    };

    const routeName =
      platformRoutes[content.platform as keyof typeof platformRoutes] ||
      "content";

    // Navigate to platform-specific content detail page with content data
    navigate(`/data-collection/content-detail-${routeName}`, {
      state: { contentData: content },
    });
  };

  // Helper function to get preview content for different platforms
  const getPreviewContent = (content: ContentItem) => {
    console.log("Processing content:", content.platform, content);
    switch (content.platform) {
      case "tiktok":
        const video2Content = content as TikTokContent;
        console.log("TikTok video URL:", video2Content.video_url);
        return {
          type: "video",
          url: video2Content.video_url,
          duration: video2Content.duration
            ? Math.floor(video2Content.duration / 1000)
            : 0,
        };
      case "douyin":
        const videoContent = content as DouyinContent;
        console.log("TikTok video URL:", videoContent.video_url);
        return {
          type: "video",
          url: videoContent.video_url,
          duration: videoContent.duration
            ? Math.floor(videoContent.duration / 1000)
            : 0,
        };
      case "kuaishou":
        const kuaishouContent = content as KuaishouContent;
        return {
          type: "video",
          url: kuaishouContent.video_play_url || kuaishouContent.video_url,
          duration: kuaishouContent.video_duration
            ? Math.floor(kuaishouContent.video_duration / 1000)
            : 0,
        };
      case "youtube":
        const youtubeContent = content as YoutubeContent;
        return {
          type: "video",
          url: youtubeContent.video_play_url,
          duration: youtubeContent.length_seconds || 0,
        };
      case "wechat":
        const wechatContent = content as WechatContent;
        return {
          type: "image",
          urls: wechatContent.images_url || [],
        };
      case "weibo":
        const weiboContent = content as WeiboContent;
        if (
          weiboContent.video_play_urls &&
          weiboContent.video_play_urls.length > 0
        ) {
          return {
            type: "video",
            url: weiboContent.video_play_urls[0],
          };
        } else if (
          weiboContent.images_urls &&
          weiboContent.images_urls.length > 0
        ) {
          return {
            type: "image",
            urls: weiboContent.images_urls,
          };
        }
        return { type: "none" };
      case "x":
        const xContent = content as XContent;
        if (xContent.video_url && xContent.video_url.trim()) {
          return {
            type: "video",
            url: xContent.video_url,
          };
        } else if (xContent.images_url && xContent.images_url.length > 0) {
          return {
            type: "image",
            urls: xContent.images_url,
          };
        }
        return { type: "none" };
      case "instagram":
        const instagramContent = content as InstagramContent;
        if (
          instagramContent.media_type === "VIDEO" &&
          instagramContent.video_url
        ) {
          return {
            type: "video",
            url: instagramContent.video_url,
          };
        } else if (
          instagramContent.image_urls &&
          instagramContent.image_urls.length > 0
        ) {
          return {
            type: "image",
            urls: instagramContent.image_urls,
          };
        } else if (
          instagramContent.carousel_media &&
          instagramContent.carousel_media.length > 0
        ) {
          return {
            type: "image",
            urls: instagramContent.carousel_media
              .map((media: any) => media.image_url || media.video_url)
              .filter(Boolean),
          };
        }
        return { type: "none" };
      case "bilibili":
        const bilibiliContent = content as BilibiliContent;
        return {
          type: "video",
          url: bilibiliContent.video_url,
          duration: bilibiliContent.duration || 0,
        };
      default:
        return { type: "none" };
    }
  };

  // Helper function to format duration
  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const invalidUrls = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0 && !validateUrl(url));

  const hasInvalidUrls = invalidUrls.length > 0;

  // Filter content by selected platforms
  const filteredContentData = contentData.filter((content) =>
    selectedPlatforms.includes(content.platform),
  );

  // Clear selected content that are no longer visible due to platform filtering
  useEffect(() => {
    const filteredContentIds = contentData
      .filter((content) => selectedPlatforms.includes(content.platform))
      .map((content) => content.id);
    setSelectedContent((prev) =>
      prev.filter((id) => filteredContentIds.includes(id)),
    );
  }, [selectedPlatforms, contentData]);

  // Fetch content data from API
  const fetchContentData = async () => {
    setIsLoadingContent(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8002";
      const token =
        import.meta.env.VITE_BACKEND_API_TOKEN ||
        localStorage.getItem("auth_token");

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        platform: selectedPlatform,
      });

      if (sortByLikes) {
        params.append("sort_by_likes", sortByLikes);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/content-interaction/content?${params}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data: ContentApiResponse = await response.json();
      setApiContentData(data.items);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Error fetching content data:", error);
      alert("获取作品数据失败，请稍后重试");
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Trigger fetch when tab changes to "data" or when filters change
  useEffect(() => {
    if (activeTab === "data") {
      fetchContentData();
    }
  }, [activeTab, currentPage, selectedPlatform, sortByLikes]);

  const handleAnalyze = async () => {
    const urls = batchUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      alert("请输入至少一个作品链接");
      return;
    }

    if (urls.length > 50) {
      alert("最多支持50个作品链接，请减少数量");
      return;
    }

    if (hasInvalidUrls) {
      alert("存在无效链接，请检查后重试");
      return;
    }

    setIsAnalyzing(true);
    setShowResultAlert(false);
    setAnalysisResult(null);

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8002";
      const token =
        import.meta.env.VITE_BACKEND_API_TOKEN ||
        localStorage.getItem("auth_token");

      const response = await fetch(
        `${API_BASE_URL}/api/content-interaction/create-tasks`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            urls: urls,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      setAnalysisResult({
        total_successful: data.total_successful,
        total_failed: data.total_failed,
        failed_urls: data.failed_urls || [],
      });

      setShowResultAlert(true);

      // Clear the input if all successful
      if (data.total_failed === 0) {
        setBatchUrls("");
      }
    } catch (error) {
      console.error("Error analyzing content:", error);
      alert("分析失败，请稍后重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePlatform = (platformName: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformName)
        ? prev.filter((p) => p !== platformName)
        : [...prev, platformName],
    );
  };

  const selectAllPlatforms = () => {
    setSelectedPlatforms(supportedPlatforms.map((p) => p.name));
  };

  const clearAllPlatforms = () => {
    setSelectedPlatforms([]);
  };

  const toggleContentSelection = (contentId: number) => {
    setSelectedContent((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId],
    );
  };

  const selectAllContent = () => {
    setSelectedContent(filteredContentData.map((content) => content.id));
  };

  const clearAllContent = () => {
    setSelectedContent([]);
  };

  const toggleContentExpansion = (contentId: number) => {
    setExpandedContent((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId],
    );
  };

  const handleContentAction = (action: string, contentId: number) => {
    const content = contentData.find((c) => c.id === contentId);
    if (!content) return;

    switch (action) {
      case "view":
        window.open(content.url, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(content.url);
        alert("链��已复制到剪贴板");
        break;
      case "edit":
        // TODO: 实现编辑功能
        alert(`编辑作品: ${content.title}`);
        break;
      case "star":
        // TODO: 实现收藏功能
        alert(`收藏作品: ${content.title}`);
        break;

      case "delete":
        if (confirm(`确定要删除作品"${content.title}"吗？`)) {
          setContentData((prev) => prev.filter((c) => c.id !== contentId));
          setSelectedContent((prev) => prev.filter((id) => id !== contentId));
          alert("作品已删除");
        }
        break;
      default:
        break;
    }
  };

  const handleContentClick = (contentId: number) => {
    navigate(`/data-collection/content-detail/${contentId}`);
  };

  const exportContentData = () => {
    const selectedContentData = contentData.filter((content) =>
      selectedContent.includes(content.id),
    );

    if (selectedContentData.length === 0) {
      alert("请选择要导出的作���数据");
      return;
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Prepare data for export
    const exportData = [
      [
        "作品标题",
        "平台",
        "作者",
        "发布时间",
        "播放量",
        "点赞数",
        "评论数",
        "分享数",
        "收藏数",
        "添加时间",
        "链接",
      ],
      ...selectedContentData.map((content) => [
        content.title,
        content.platform,
        content.author,
        content.publishedAt,
        content.views,
        content.likes,
        content.comments,
        content.shares,
        content.collections,
        content.addedAt,
        content.url,
      ]),
    ];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);

    // Set column widths
    worksheet["!cols"] = [
      { width: 40 }, // 作品标题
      { width: 10 }, // 平台
      { width: 15 }, // 作者
      { width: 12 }, // 发布时间
      { width: 12 }, // 播放量
      { width: 10 }, // 点���数
      { width: 10 }, // 评论数
      { width: 10 }, // 分享数
      { width: 10 }, // 收藏数
      { width: 16 }, // 添加时间
      { width: 50 }, // 链接
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "作品互动数据");

    // Generate Excel file and download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `作品互动数据_${selectedContentData.length}条记录.xlsx`;
    link.click();
  };

  // Statistics calculations - use API data when available
  const displayData = activeTab === "data" ? apiContentData : contentData;
  const totalContent = displayData.length;
  const totalViews = displayData.reduce((sum, content) => {
    if ("like_count" in content) {
      // API data
      return sum + getViewCount(content);
    } else {
      // Sample data
      const views = parseInt(
        (content as any).views.replace(/[万千]/g, "").replace(/\D/g, ""),
      );
      return sum + (isNaN(views) ? 0 : views);
    }
  }, 0);
  const totalLikes = displayData.reduce((sum, content) => {
    if ("like_count" in content) {
      // API data
      return sum + content.like_count;
    } else {
      // Sample data
      const likes = parseInt(
        (content as any).likes.replace(/[万千]/g, "").replace(/\D/g, ""),
      );
      return sum + (isNaN(likes) ? 0 : likes);
    }
  }, 0);
  const avgEngagementRate =
    totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : "0";

  return (
    <DashboardLayout
      title="作品互动数查询"
      subtitle="分析作品互动数据，洞察内容表现和用户参与度"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            刷新数据
          </Button>
        </div>
      }
    >
      {/* Notice about Xiaohongshu bulk content extraction */}
      <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          小红书作品批量获取请到
          <a
            href="http://localhost:3000/creator-tools/content-extract"
            className="ml-1 font-medium text-amber-900 underline hover:text-amber-700 transition-colors"
          >
            图文提取
          </a>
          页面
        </p>
      </div>

      <div className="space-y-6">
        {/* Platform Support */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Users className="mr-2 h-4 w-4" />
              支持平台
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {supportedPlatforms.map((platform) => (
                <Badge
                  key={platform.id}
                  variant="secondary"
                  className="flex items-center space-x-1 h-7"
                >
                  <span>{platform.emoji}</span>
                  <span>{platform.name}</span>
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              添加作品
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              作品数据
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              总数据展示
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6">
            {/* Batch Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    批量添加作品链接
                  </span>
                  <Badge
                    variant={urlCount > 50 ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {urlCount}/50
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    作品链接（每行一个，最多50个链接）:
                  </label>
                  <Textarea
                    placeholder={`请粘贴作品链接，每行一个：

https://www.douyin.com/video/123456789
https://www.xiaohongshu.com/discovery/item/abcdef123
https://www.tiktok.com/@username/video/123
https://www.bilibili.com/video/BV123456789
https://www.youtube.com/watch?v=example123

支持抖音、快手、B站、微博，微信公众号，YouTube、TikTok、Instagram、X平台`}
                    value={batchUrls}
                    onChange={(e) => setBatchUrls(e.target.value)}
                    className="min-h-[200px] resize-none font-mono text-sm"
                    maxLength={15000}
                  />
                  <div className="flex items-center space-x-2 text-xs">
                    {urlCount > 0 && !hasInvalidUrls ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">
                          检测到 {urlCount} 个有效作品链接
                        </span>
                      </>
                    ) : hasInvalidUrls ? (
                      <>
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        <span className="text-red-600">
                          发现 {invalidUrls.length} 个无效链接，请检查格式
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">
                        支持视频、图文等各类作品链接
                      </span>
                    )}
                  </div>
                </div>

                {urlCount > 50 && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>链接数量超过限制，请删除多余的链��</span>
                  </div>
                )}

                {showResultAlert && analysisResult && (
                  <Alert
                    className={
                      analysisResult.total_failed > 0
                        ? "border-orange-200 bg-orange-50"
                        : "border-green-200 bg-green-50"
                    }
                  >
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">
                              成功: {analysisResult.total_successful}
                            </span>
                          </div>
                          {analysisResult.total_failed > 0 && (
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium">
                                失败: {analysisResult.total_failed}
                              </span>
                            </div>
                          )}
                        </div>
                        {analysisResult.failed_urls.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-orange-600 mb-1">
                              失败的链接:
                            </p>
                            <ul className="text-xs text-orange-600 space-y-1">
                              {analysisResult.failed_urls.map((url, index) => (
                                <li key={index} className="break-all">
                                  • {url}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleAnalyze}
                      disabled={
                        urlCount === 0 ||
                        urlCount > 50 ||
                        hasInvalidUrls ||
                        isAnalyzing
                      }
                      className="h-8"
                    >
                      {isAnalyzing ? (
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Search className="mr-2 h-3.5 w-3.5" />
                      )}
                      {isAnalyzing ? "分析中..." : "开始分析"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setBatchUrls("");
                        setShowResultAlert(false);
                        setAnalysisResult(null);
                      }}
                      className="h-8"
                    >
                      清空
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {urlCount > 0 && <span>检测到 {urlCount} 个作品链接</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            {/* Data Table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    作品互动数据 ({apiContentData.length})
                    {isLoadingContent && (
                      <RefreshCw className="ml-2 h-3 w-3 animate-spin" />
                    )}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Filter className="mr-2 h-3.5 w-3.5" />
                          平台筛选
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">选择平台</h4>
                          <div className="space-y-2">
                            {supportedPlatforms.map((platform) => (
                              <div
                                key={platform.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={platform.id}
                                  checked={selectedPlatform === platform.id}
                                  onCheckedChange={() => {
                                    setSelectedPlatform(platform.id);
                                    setCurrentPage(1);
                                  }}
                                />
                                <label
                                  htmlFor={platform.id}
                                  className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                >
                                  <span>{platform.emoji}</span>
                                  <span>{platform.name}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <BarChart3 className="mr-2 h-3.5 w-3.5" />
                          点赞排序
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48" align="end">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">排序方式</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="no-sort"
                                checked={sortByLikes === ""}
                                onCheckedChange={() => {
                                  setSortByLikes("");
                                  setCurrentPage(1);
                                }}
                              />
                              <label
                                htmlFor="no-sort"
                                className="text-sm font-medium"
                              >
                                默认排序
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="desc-sort"
                                checked={sortByLikes === "descending"}
                                onCheckedChange={() => {
                                  setSortByLikes("descending");
                                  setCurrentPage(1);
                                }}
                              />
                              <label
                                htmlFor="desc-sort"
                                className="text-sm font-medium"
                              >
                                点赞数降序
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="asc-sort"
                                checked={sortByLikes === "ascending"}
                                onCheckedChange={() => {
                                  setSortByLikes("ascending");
                                  setCurrentPage(1);
                                }}
                              />
                              <label
                                htmlFor="asc-sort"
                                className="text-sm font-medium"
                              >
                                点赞数升序
                              </label>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentPage(1);
                          fetchContentData();
                        }}
                        className="h-8"
                        disabled={isLoadingContent}
                      >
                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                        刷新
                      </Button>

                      <div className="text-xs text-muted-foreground">
                        总计: {totalItems} 条数据
                      </div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingContent ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      正在加载作品数据...
                    </p>
                  </div>
                ) : apiContentData.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      没有找到符合筛选条件的作品数据
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px]">作品展示</TableHead>
                          <TableHead className="w-[200px]">作品标题</TableHead>
                          <TableHead className="w-[80px]">平台</TableHead>
                          <TableHead className="w-[120px]">作者</TableHead>
                          <TableHead className="w-[100px]">播放量</TableHead>
                          <TableHead className="w-[80px]">点赞</TableHead>
                          <TableHead className="w-[80px]">评论</TableHead>
                          <TableHead className="w-[80px]">分享</TableHead>
                          <TableHead className="w-[100px]">创建时间</TableHead>
                          <TableHead className="w-[80px]">查看详情</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {apiContentData.map((content) => {
                          const previewContent = getPreviewContent(content);

                          return (
                            <TableRow
                              key={content.id}
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => handleContentRowClick(content)}
                            >
                              {/* 作品展示列 */}
                              <TableCell>
                                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center relative">
                                  {previewContent.type === "video" &&
                                  previewContent.url ? (
                                    <>
                                      <video
                                        src={previewContent.url}
                                        className="w-full h-full object-cover"
                                        preload="metadata"
                                        muted
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            "none";
                                          const next = e.currentTarget
                                            .nextElementSibling as HTMLElement;
                                          if (next) next.style.display = "flex";
                                        }}
                                      />
                                      <div
                                        className="w-full h-full flex items-center justify-center bg-gray-200"
                                        style={{ display: "none" }}
                                      >
                                        <Play className="h-6 w-6 text-gray-500" />
                                      </div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="h-6 w-6 text-white drop-shadow-lg" />
                                      </div>
                                      {previewContent.duration &&
                                        previewContent.duration > 0 && (
                                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                            {formatDuration(
                                              previewContent.duration,
                                            )}
                                          </div>
                                        )}
                                    </>
                                  ) : previewContent.type === "image" &&
                                    previewContent.urls &&
                                    previewContent.urls.length > 0 ? (
                                    <>
                                      <img
                                        src={previewContent.urls[0]}
                                        alt="内容预览"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            "none";
                                          const next = e.currentTarget
                                            .nextElementSibling as HTMLElement;
                                          if (next) next.style.display = "flex";
                                        }}
                                      />
                                      <div
                                        className="w-full h-full flex items-center justify-center bg-gray-200"
                                        style={{ display: "none" }}
                                      >
                                        <Image className="h-6 w-6 text-gray-500" />
                                      </div>
                                      {previewContent.urls.length > 1 && (
                                        <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                          +{previewContent.urls.length - 1}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                      <Image className="h-6 w-6 mb-1" />
                                      <span className="text-xs">无预览</span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>

                              {/* 作品标题列 */}
                              <TableCell className="font-medium">
                                <div
                                  className="max-w-[200px] truncate cursor-pointer hover:text-blue-600 transition-colors"
                                  title={getContentTitle(content)}
                                >
                                  {getContentTitle(content)}
                                </div>
                              </TableCell>

                              {/* 平台列 */}
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {getPlatformDisplayName(content.platform)}
                                </Badge>
                              </TableCell>

                              {/* 作者列 */}
                              <TableCell className="text-sm">
                                {getAuthorName(content)}
                              </TableCell>

                              {/* 播放量列 */}
                              <TableCell className="text-sm">
                                <span className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                  {formatNumber(getViewCount(content))}
                                </span>
                              </TableCell>

                              {/* 点赞列 */}
                              <TableCell className="text-sm">
                                <span className="flex items-center">
                                  <Heart className="h-3 w-3 mr-1 text-red-500" />
                                  {formatNumber(content.like_count)}
                                </span>
                              </TableCell>

                              {/* 评论列 */}
                              <TableCell className="text-sm">
                                <span className="flex items-center">
                                  <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
                                  {formatNumber(getCommentCount(content))}
                                </span>
                              </TableCell>

                              {/* 分享列 */}
                              <TableCell className="text-sm">
                                <span className="flex items-center">
                                  <Share2 className="h-3 w-3 mr-1 text-purple-500" />
                                  {formatNumber(getShareCount(content))}
                                </span>
                              </TableCell>

                              {/* 创建时间列 */}
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(
                                  content.created_at,
                                ).toLocaleDateString()}
                              </TableCell>

                              {/* 查看详情列 */}
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8"
                                  onClick={(e) => {
                                    e.stopPropagation(); // 防止触发行点击事件
                                    handleContentRowClick(content);
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {totalItems > 20 && (
                      <div className="flex items-center justify-between p-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          第 {(currentPage - 1) * 20 + 1} -{" "}
                          {Math.min(currentPage * 20, totalItems)} 条，共{" "}
                          {totalItems} 条
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1 || isLoadingContent}
                          >
                            上一页
                          </Button>
                          <span className="text-sm">
                            第 {currentPage} 页，共 {Math.ceil(totalItems / 20)}{" "}
                            页
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={
                              currentPage >= Math.ceil(totalItems / 20) ||
                              isLoadingContent
                            }
                          >
                            下一页
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            {/* Overview Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">总数据展示</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Summary Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {totalContent}
                      </div>
                      <div className="text-sm font-medium">总��品数</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        已添加的作品总数
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {totalViews}万
                      </div>
                      <div className="text-sm font-medium">总播放量</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        所有作���播放量总和
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600 mb-2">
                        {totalLikes}万
                      </div>
                      <div className="text-sm font-medium">总点赞数</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        所有作品点赞总数
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        {avgEngagementRate}%
                      </div>
                      <div className="text-sm font-medium">平均互动率</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        点赞数/播放量比例
                      </div>
                    </div>
                  </div>

                  {/* Platform Distribution */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-3">平台分布</h3>
                    <div className="space-y-2">
                      {supportedPlatforms.map((platform) => {
                        const count = filteredContentData.filter(
                          (content) => content.platform === platform.name,
                        ).length;
                        const percentage =
                          totalContent > 0 ? (count / totalContent) * 100 : 0;
                        return (
                          <div
                            key={platform.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <span>{platform.emoji}</span>
                              <span className="text-sm">{platform.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8">
                                {count}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Performing Content */}
                  {filteredContentData.length > 0 && (
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-red-500" />
                        表现最佳作品
                      </h3>
                      <div className="space-y-3">
                        {filteredContentData
                          .sort(
                            (a, b) =>
                              parseInt(b.likes.replace(/[万千]/g, "")) -
                              parseInt(a.likes.replace(/[万千]/g, "")),
                          )
                          .slice(0, 3)
                          .map((content, index) => (
                            <div
                              key={content.id}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                  {index + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium truncate max-w-[300px]">
                                    {content.title}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span>{content.platform}</span>
                                    <span>{content.author}</span>
                                    <span>{content.publishedAt}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-red-600">
                                  {content.likes}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  点赞数
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
