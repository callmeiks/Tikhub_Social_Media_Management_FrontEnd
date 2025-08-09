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
  ArrowLeft,
  Play,
  Heart,
  MessageCircle,
  Eye,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Copy,
  Download,
  Video,
  Shield,
  Radio,
  Globe,
  Music,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface YoutubePostData {
  id: string;
  task_id: string;
  video_id: string;
  title: string;
  description: string;
  channel_id: string;
  channel_name: string;
  is_channel_verified: boolean;
  channel_avatar: string;
  length_seconds: number;
  view_count: number;
  like_count: number;
  published_time: string;
  is_live_stream: boolean;
  is_live_now: boolean;
  is_regionally_restricted: boolean;
  comment_count: number;
  video_play_url: string;
  audio_play_url: string;
  created_at: string;
  updated_at: string;
}

export default function ContentDetailYoutube() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<YoutubePostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if content data was passed via navigation state
    if (location.state?.contentData) {
      const contentData = location.state.contentData;

      // Map the API data to YoutubePostData format
      const mappedData: YoutubePostData = {
        id: contentData.id || "youtube_" + Date.now(),
        task_id: contentData.task_id || "",
        video_id: contentData.video_id || "",
        title: contentData.title || "无标题",
        description: contentData.description || "无描述",
        channel_id: contentData.channel_id || "",
        channel_name: contentData.channel_name || "未知频道",
        is_channel_verified: contentData.is_channel_verified || false,
        channel_avatar: contentData.channel_avatar || "",
        length_seconds: contentData.length_seconds || 0,
        view_count: contentData.view_count || 0,
        like_count: contentData.like_count || 0,
        published_time: contentData.published_time || new Date().toISOString(),
        is_live_stream: contentData.is_live_stream || false,
        is_live_now: contentData.is_live_now || false,
        is_regionally_restricted: contentData.is_regionally_restricted || false,
        comment_count: contentData.comment_count || 0,
        video_play_url: contentData.video_play_url || "",
        audio_play_url: contentData.audio_play_url || "",
        created_at: contentData.created_at || new Date().toISOString(),
        updated_at: contentData.updated_at || new Date().toISOString(),
      };

      setContent(mappedData);
      setLoading(false);
    } else {
      // Fallback to mock data if no data was passed
      setTimeout(() => {
        const mockData: YoutubePostData = {
          id: "youtube_1",
          task_id: "task_001",
          video_id: "dQw4w9WgXcQ",
          title: "Amazing Technology Review 2024 - Must Watch!",
          description:
            "In this comprehensive technology review, we explore the latest innovations in AI, robotics, and consumer electronics. From breakthrough smartphones to cutting-edge laptops, this video covers everything you need to know about tech in 2024. Don't forget to like and subscribe for more tech content!",
          channel_id: "UCxxxxxxxxxxxxxxxx",
          channel_name: "TechReviewer Pro",
          is_channel_verified: true,
          channel_avatar: "https://yt3.ggpht.com/channel_avatar.jpg",
          length_seconds: 720,
          view_count: 1250000,
          like_count: 85000,
          published_time: "2024-01-01T10:00:00Z",
          is_live_stream: false,
          is_live_now: false,
          is_regionally_restricted: false,
          comment_count: 5400,
          video_play_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          audio_play_url: "https://youtube.com/audio/dQw4w9WgXcQ.mp3",
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
      <DashboardLayout title="YouTube视频详情" subtitle="加载中...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout title="YouTube视频详情" subtitle="视频不存在">
        <div className="text-center py-12">
          <p className="text-muted-foreground">找不到指定的YouTube视频</p>
          <Button
            onClick={() => navigate("/data-collection/content-interaction")}
            className="mt-4"
            variant="outline"
          >
            返回作品列表
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(content.video_play_url);
    alert("链接已复制到剪贴板");
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getEngagementRate = () => {
    return (
      ((content.like_count + content.comment_count) / content.view_count) * 100
    );
  };

  const getVideoCategory = () => {
    if (content.is_live_stream) return "直播";
    if (content.length_seconds < 60) return "短视频";
    if (content.length_seconds < 600) return "中等时长";
    if (content.length_seconds < 3600) return "长视频";
    return "超长视频";
  };

  return (
    <DashboardLayout
      title="YouTube视频详情"
      subtitle={content.title}
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
            onClick={() => window.open(content.video_play_url, "_blank")}
            className="h-8"
          >
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            查看原视频
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 作品基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5 text-red-500" />
              YouTube视频信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 视频预览 */}
              <div className="lg:col-span-1">
                <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="rounded-full w-16 h-16 p-0 bg-red-600 hover:bg-red-700"
                      onClick={() =>
                        window.open(content.video_play_url, "_blank")
                      }
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
                    {formatDuration(content.length_seconds)}
                  </div>
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    YouTube
                  </div>
                  {content.is_live_stream && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Radio className="mr-1 h-3 w-3" />
                      {content.is_live_now ? "直播中" : "直播回放"}
                    </div>
                  )}
                </div>
              </div>

              {/* 视频详情 */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{content.title}</h1>
                    <Badge variant="outline" className="text-xs">
                      {getVideoCategory()}
                    </Badge>
                    {content.is_live_stream && (
                      <Badge variant="destructive" className="text-xs">
                        <Radio className="mr-1 h-3 w-3" />
                        直播
                      </Badge>
                    )}
                    {content.is_regionally_restricted && (
                      <Badge
                        variant="outline"
                        className="text-xs border-orange-500 text-orange-600"
                      >
                        <Globe className="mr-1 h-3 w-3" />
                        地区限制
                      </Badge>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-muted-foreground text-sm mb-2">
                      视频ID: {content.video_id}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {content.description}
                    </p>
                  </div>

                  {/* 数据统计 */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="h-4 w-4 mr-1 text-blue-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.view_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        观看次数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Heart className="h-4 w-4 mr-1 text-red-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.like_count.toLocaleString()}
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
                  </div>

                  {/* 频道信息 */}
                  <div className="p-4 bg-muted/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">频道信息</h3>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={content.channel_avatar}
                          alt={content.channel_name}
                        />
                        <AvatarFallback>
                          {content.channel_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {content.channel_name}
                          </span>
                          {content.is_channel_verified && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          频道ID: {content.channel_id}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 视频属性 */}
                  <div className="p-4 bg-muted/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      视频属性
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          视频时长:{" "}
                        </span>
                        <span>{formatDuration(content.length_seconds)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          视频类型:{" "}
                        </span>
                        <span>{getVideoCategory()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">是否直播:</span>
                        <span>{content.is_live_stream ? "是" : "否"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">当前直播:</span>
                        <span>{content.is_live_now ? "是" : "否"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">地区限制:</span>
                        <span>
                          {content.is_regionally_restricted ? "是" : "否"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">频道认证:</span>
                        <span>
                          {content.is_channel_verified ? "已认证" : "未认证"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 媒体资源 */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Music className="mr-2 h-4 w-4" />
                      媒体资源
                    </h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          视频播放链接:
                        </span>
                        <span className="truncate block">
                          {content.video_play_url}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">音频链接:</span>
                        <span className="truncate block">
                          {content.audio_play_url}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 其他属性 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      发布时间:{" "}
                      {new Date(content.published_time).toLocaleString("zh-CN")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      视频时长: {formatDuration(content.length_seconds)}
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      互动率: {getEngagementRate().toFixed(2)}%
                    </div>
                    {content.is_regionally_restricted && (
                      <div className="flex items-center text-orange-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        存在地区限制
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for additional information */}
        <Tabs defaultValue="channel" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="channel">频道详情</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
          </TabsList>

          <TabsContent value="channel" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>频道详细信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={content.channel_avatar}
                        alt={content.channel_name}
                      />
                      <AvatarFallback className="text-lg">
                        {content.channel_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">
                          {content.channel_name}
                        </h3>
                        {content.is_channel_verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            已认证
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        <div>频道ID: {content.channel_id}</div>
                        <div>
                          认证状态:{" "}
                          {content.is_channel_verified
                            ? "已认证频道"
                            : "普通频道"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium mb-2">频道状态</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">认证状态</span>
                        <div className="flex items-center">
                          {content.is_channel_verified ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-sm text-green-600">
                                已认证
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-sm text-gray-600">
                                未认证
                              </span>
                            </>
                          )}
                        </div>
                      </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(
                        (content.like_count / content.view_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">点赞率</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(
                        (content.comment_count / content.view_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">评论率</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {getEngagementRate().toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      总互动率
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(content.view_count / content.length_seconds)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      每秒观看数
                    </div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {formatDuration(content.length_seconds)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      视频时长
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">互动分析</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">观看次数</span>
                        <span className="text-sm font-medium">
                          {content.view_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">点赞数</span>
                        <span className="text-sm font-medium">
                          {content.like_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (content.like_count / content.view_count) * 100 * 10
                        }
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">评论数</span>
                        <span className="text-sm font-medium">
                          {content.comment_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (content.comment_count / content.view_count) *
                          100 *
                          20
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                {content.is_regionally_restricted && (
                  <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center text-orange-600">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      地区限制提醒
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      该视频在某些地区可能无法观看，这可能会影响观看数据的准确性。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
