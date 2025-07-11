import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Robot,
  Ban,
  Video,
  Image,
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

export default function ContentDetailTiktok() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<TiktokVideoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      // Mock data for TikTok video
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
  }, [contentId]);

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
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="rounded-full w-16 h-16 p-0 brand-accent"
                      onClick={() => window.open(content.share_url, "_blank")}
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
                    {formatDuration(content.duration)}
                  </div>
                  {content.is_top && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
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
                      {content.with_promotional_music && (
                        <Badge variant="outline" className="w-fit">
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
                    {content.support_danmaku && (
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        支持弹幕
                      </div>
                    )}
                    {content.is_pgcshow && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        专业内容
                      </div>
                    )}
                    {content.adv_promotable && (
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        可推广
                      </div>
                    )}
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
                        <Robot className="mr-2 h-4 w-4" />
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

        {/* 可以添加其他tabs，如数据趋势、观众画像等 */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="author">作者详情</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>技术信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">任务ID: </span>
                    <span>{content.task_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">群组ID: </span>
                    <span>{content.group_id || "无"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">音乐ID: </span>
                    <span>{content.mid}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">用户安全ID: </span>
                    <span className="truncate">
                      {content.author_sec_user_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">创建时间: </span>
                    <span>
                      {new Date(content.created_at).toLocaleString("zh-CN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">更新时间: </span>
                    <span>
                      {new Date(content.updated_at).toLocaleString("zh-CN")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="author" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>作者详细信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">作者昵称</label>
                      <p className="text-lg">{content.author_nickname}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">用户唯一ID</label>
                      <p className="text-lg">{content.author_unique_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">用户UID</label>
                      <p className="text-lg">{content.author_uid}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">安全用户ID</label>
                      <p className="text-sm text-muted-foreground break-all">
                        {content.author_sec_user_id}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>数据分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(
                        (content.digg_count / content.play_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">点赞率</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(
                        (content.comment_count / content.play_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">评论率</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(
                        (content.share_count / content.play_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">分享率</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
