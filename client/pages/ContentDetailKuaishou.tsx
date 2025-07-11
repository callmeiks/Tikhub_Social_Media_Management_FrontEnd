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
  ArrowLeft,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Copy,
  Download,
  Music,
  Video,
  Gift,
  Bookmark,
  Award,
  BarChart3,
} from "lucide-react";

interface KuaishouPostData {
  id: string;
  task_id: string;
  photo_id: string;
  reward_count: number;
  collect_count: number;
  video_duration: number;
  author_name: string;
  author_user_id: string;
  video_caption: string;
  create_time: string;
  like_count: number;
  view_count: number;
  share_count: number;
  comment_count: number;
  sound_track_id: string;
  sound_track_audio_url: string;
  sound_track_artist: string;
  video_play_url: string;
  blur_probability: string;
  blocky_probability: string;
  avg_entropy: string;
  mos_score: string;
  video_url: string;
  created_at: string;
  updated_at: string;
}

export default function ContentDetailKuaishou() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<KuaishouPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      // Mock data for Kuaishou post
      const mockData: KuaishouPostData = {
        id: "kuaishou_1",
        task_id: "task_001",
        photo_id: "3xf6t2345678901",
        reward_count: 1250,
        collect_count: 5670,
        video_duration: 32,
        author_name: "生活记录者",
        author_user_id: "3x123456789",
        video_caption:
          "今天的日常生活记录，分享一些有趣的瞬间 #生活 #记录 #分享",
        create_time: "2024-01-01 14:30:00",
        like_count: 18900,
        view_count: 234567,
        share_count: 890,
        comment_count: 1456,
        sound_track_id: "audio_123",
        sound_track_audio_url: "https://music.kuaishou.com/123.mp3",
        sound_track_artist: "背景音乐",
        video_play_url: "https://video.kuaishou.com/video.mp4",
        blur_probability: "0.12",
        blocky_probability: "0.08",
        avg_entropy: "7.85",
        mos_score: "4.2",
        video_url: "https://video.kuaishou.com/video.mp4",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };
      setContent(mockData);
      setLoading(false);
    }, 500);
  }, [contentId]);

  if (loading) {
    return (
      <DashboardLayout title="快手作品详情" subtitle="加载中...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout title="快手作品详情" subtitle="作品不存在">
        <div className="text-center py-12">
          <p className="text-muted-foreground">找不到指定的快手作品</p>
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
    navigator.clipboard.writeText(content.video_play_url);
    alert("链接已复制到剪贴板");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getQualityScore = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 4.0) return { level: "优秀", color: "text-green-600" };
    if (numScore >= 3.0) return { level: "良好", color: "text-blue-600" };
    if (numScore >= 2.0) return { level: "一般", color: "text-yellow-600" };
    return { level: "较差", color: "text-red-600" };
  };

  const qualityInfo = getQualityScore(content.mos_score);

  return (
    <DashboardLayout
      title="快手作品详情"
      subtitle={content.video_caption}
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
              快手作品信息
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
                      onClick={() =>
                        window.open(content.video_play_url, "_blank")
                      }
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
                    {formatDuration(content.video_duration)}
                  </div>
                  <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    快手
                  </div>
                </div>
              </div>

              {/* 作品详情 */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {content.video_caption}
                  </h1>

                  <div className="mb-4">
                    <p className="text-muted-foreground text-sm">
                      作品ID: {content.photo_id}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      视频质量评分:{" "}
                      <span className={qualityInfo.color}>
                        {content.mos_score}/5.0 ({qualityInfo.level})
                      </span>
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
                        观看量
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
                        <Gift className="h-4 w-4 mr-1 text-yellow-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.reward_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        打赏数
                      </div>
                    </div>
                  </div>

                  {/* 作者信息 */}
                  <div className="p-4 bg-muted/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">作者信息</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">昵称: </span>
                        <span>{content.author_name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">用户ID: </span>
                        <span>{content.author_user_id}</span>
                      </div>
                    </div>
                  </div>

                  {/* 音频信息 */}
                  <div className="p-4 bg-muted/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Music className="mr-2 h-4 w-4" />
                      音频信息
                    </h3>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          音频作者:{" "}
                        </span>
                        <span>{content.sound_track_artist}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">音频ID: </span>
                        <span>{content.sound_track_id}</span>
                      </div>
                    </div>
                  </div>

                  {/* 视频质量分析 */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      视频质量分析
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">MOS评分: </span>
                        <span className={qualityInfo.color}>
                          {content.mos_score}/5.0
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          平均熵值:{" "}
                        </span>
                        <span>{content.avg_entropy}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          模糊概率:{" "}
                        </span>
                        <span>
                          {(parseFloat(content.blur_probability) * 100).toFixed(
                            1,
                          )}
                          %
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          块状失真概率:{" "}
                        </span>
                        <span>
                          {(
                            parseFloat(content.blocky_probability) * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        质量等级
                      </div>
                      <Badge
                        variant="outline"
                        className={`${qualityInfo.color} border-current`}
                      >
                        {qualityInfo.level}
                      </Badge>
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
                      视频时长: {formatDuration(content.video_duration)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for additional information */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="quality">质量分析</TabsTrigger>
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
                    <span className="text-muted-foreground">作品ID: </span>
                    <span>{content.photo_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">音频ID: </span>
                    <span>{content.sound_track_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">视频播放URL: </span>
                    <span className="truncate">{content.video_play_url}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">音频URL: </span>
                    <span className="truncate">
                      {content.sound_track_audio_url}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">视频URL: </span>
                    <span className="truncate">{content.video_url}</span>
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

          <TabsContent value="quality" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>视频质量详细分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">MOS质量评分</h4>
                      <div className="text-center">
                        <div
                          className={`text-4xl font-bold ${qualityInfo.color}`}
                        >
                          {content.mos_score}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          满分 5.0
                        </div>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${qualityInfo.color} border-current`}
                        >
                          {qualityInfo.level}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">视频质量指标</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">平均熵值</span>
                            <span className="text-sm font-medium">
                              {content.avg_entropy}
                            </span>
                          </div>
                          <Progress
                            value={(parseFloat(content.avg_entropy) / 10) * 100}
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">模糊概率</span>
                            <span className="text-sm font-medium">
                              {(
                                parseFloat(content.blur_probability) * 100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <Progress
                            value={parseFloat(content.blur_probability) * 100}
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">块状失真概率</span>
                            <span className="text-sm font-medium">
                              {(
                                parseFloat(content.blocky_probability) * 100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <Progress
                            value={parseFloat(content.blocky_probability) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium mb-2">质量评价说明</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• MOS (Mean Opinion Score): 主观质量评分，5.0为最高</p>
                      <p>• 平均熵值: 反映图像信息量，数值越高信息越丰富</p>
                      <p>• 模糊概率: 视频模糊程度，数值越低越清晰</p>
                      <p>
                        • 块状失真概率: 压缩造成的块状效应，数值越低质量越好
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                      {(
                        (content.share_count / content.view_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">分享率</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {(
                        (content.collect_count / content.view_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">收藏率</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {(
                        (content.reward_count / content.view_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">打赏率</div>
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
