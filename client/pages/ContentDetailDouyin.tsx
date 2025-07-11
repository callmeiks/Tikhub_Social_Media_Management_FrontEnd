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
  Robot,
  Ban,
  Video,
  Image,
  Camera,
  Pin,
  Award,
} from "lucide-react";

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

export default function ContentDetailDouyin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<DouyinVideoData | null>(null);
  const [loading, setLoading] = useState(true);

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
          city: "北京市",
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

  const formatDuration = (seconds: number) => {
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
                    <p className="text-muted-foreground text-sm">
                      拍摄方式: {getShootWayText(content.shoot_way)}
                    </p>
                    {content.group_id && (
                      <p className="text-muted-foreground text-sm">
                        群组ID: {content.group_id}
                      </p>
                    )}
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
                      <div>
                        <span className="text-muted-foreground">音乐ID: </span>
                        <span>{content.mid}</span>
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
                        <span>{content.city}</span>
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

                  {/* 其他属性 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
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
                    {content.with_goods && (
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        带有商品推广
                      </div>
                    )}
                  </div>

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

        {/* Tabs for additional information */}
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
                    <span className="text-muted-foreground">视频URL: </span>
                    <span className="truncate">{content.video_url}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">音乐URL: </span>
                    <span className="truncate">{content.music_play_url}</span>
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

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {(
                        (content.collect_count / content.play_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">收藏率</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">
                      {(
                        (content.download_count / content.play_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">下载率</div>
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
