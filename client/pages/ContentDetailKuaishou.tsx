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
  Square,
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
  author_avatar?: string;
  user_sex?: string;
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
  audio_quality?: number;
  music_probability?: number;
  dialog_probability?: number;
  background_sound_probability?: number;
  stereophonic_richness?: number;
  share_url?: string;
  video_url: string;
  created_at: string;
  updated_at: string;
}

export default function ContentDetailKuaishou() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<KuaishouPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check if content data was passed via navigation state
    if (location.state?.contentData) {
      const contentData = location.state.contentData;

      // Map the API data to KuaishouPostData format
      const mappedData: KuaishouPostData = {
        id: contentData.id || "kuaishou_" + Date.now(),
        task_id: contentData.task_id || "",
        photo_id: contentData.photo_id || "",
        reward_count: contentData.reward_count || 0,
        collect_count: contentData.collect_count || 0,
        video_duration: contentData.video_duration || 0,
        author_name: contentData.author_name || "未知作者",
        author_user_id: contentData.author_user_id || "",
        author_avatar: contentData.author_avatar || "",
        user_sex: contentData.user_sex || "unknown",
        video_caption: contentData.video_caption || "无描述",
        create_time: contentData.create_time || new Date().toISOString(),
        like_count: contentData.like_count || 0,
        view_count: contentData.view_count || 0,
        share_count: contentData.share_count || 0,
        comment_count: contentData.comment_count || 0,
        sound_track_id: contentData.sound_track_id || "",
        sound_track_audio_url: contentData.sound_track_audio_url || "",
        sound_track_artist: contentData.sound_track_artist || "",
        video_play_url:
          contentData.video_play_url || contentData.video_url || "",
        blur_probability: contentData.blur_probability || "0",
        blocky_probability: contentData.blocky_probability || "0",
        avg_entropy: contentData.avg_entropy || "0",
        mos_score: contentData.mos_score || "0",
        audio_quality: contentData.audio_quality || 0,
        music_probability: contentData.music_probability || 0,
        dialog_probability: contentData.dialog_probability || 0,
        background_sound_probability:
          contentData.background_sound_probability || 0,
        stereophonic_richness: contentData.stereophonic_richness || 0,
        share_url: contentData.share_url || "",
        video_url: contentData.video_url || "",
        created_at: contentData.created_at || new Date().toISOString(),
        updated_at: contentData.updated_at || new Date().toISOString(),
      };

      setContent(mappedData);
      setLoading(false);
    } else {
      // Fallback to mock data if no content data is passed
      setTimeout(() => {
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

  // Audio playback functions
  const handlePlayAudio = () => {
    if (content?.sound_track_audio_url) {
      if (audioPlayer) {
        audioPlayer.pause();
      }
      const audio = new Audio(content.sound_track_audio_url);
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

  const handleStopAudio = () => {
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      setAudioPlayer(null);
      setIsPlaying(false);
    }
  };

  const handleDownloadAudio = () => {
    if (content?.sound_track_audio_url) {
      fetch(content.sound_track_audio_url)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${content.sound_track_artist || "audio"}_${content.sound_track_id}.m4a`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("下载失败:", error);
          // Fallback to direct link
          const link = document.createElement("a");
          link.href = content.sound_track_audio_url;
          link.download = `${content.sound_track_artist || "audio"}_${content.sound_track_id}.m4a`;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    }
  };

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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimestamp = (timestamp: string | number) => {
    // 如果是字符串数字（timestamp），转换为数字
    const numTimestamp =
      typeof timestamp === "string" ? parseInt(timestamp) : timestamp;

    // 检查是否是毫秒级时间戳（13位）还是秒级时间戳（10位）
    const date =
      numTimestamp > 9999999999
        ? new Date(numTimestamp)
        : new Date(numTimestamp * 1000);

    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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
                  <video
                    src={content.video_play_url}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    poster=""
                  >
                    您的浏览器不支持视频播放
                  </video>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
                    {formatDuration(Math.floor(content.video_duration / 1000))}
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
                      {content.sound_track_audio_url && (
                        <div className="flex gap-2 mt-2">
                          {!isPlaying ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handlePlayAudio}
                            >
                              <Play className="mr-1 h-3 w-3" />
                              播放音频
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleStopAudio}
                            >
                              <Square className="mr-1 h-3 w-3" />
                              停止
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDownloadAudio}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            下载音频
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 其他属性 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      发布时间: {formatTimestamp(content.create_time)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      视频时长:{" "}
                      {formatDuration(
                        Math.floor(content.video_duration / 1000),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for additional information */}
        <Tabs defaultValue="quality" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quality">质量分析</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
          </TabsList>

          <TabsContent value="quality" className="mt-6">
            <div className="space-y-6">
              {/* 视频质量分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    视频质量分析
                  </CardTitle>
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
                            {parseFloat(content.mos_score).toFixed(2)}
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
                                {parseFloat(content.avg_entropy).toFixed(2)}
                              </span>
                            </div>
                            <Progress
                              value={
                                (parseFloat(content.avg_entropy) / 10) * 100
                              }
                              className="h-2"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">模糊概率</span>
                              <span className="text-sm font-medium">
                                {(
                                  parseFloat(content.blur_probability) * 100
                                ).toFixed(2)}
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
                                ).toFixed(2)}
                                %
                              </span>
                            </div>
                            <Progress
                              value={
                                parseFloat(content.blocky_probability) * 100
                              }
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                      <h4 className="font-medium mb-2">视频质量评价说明</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          • MOS (Mean Opinion Score): 主观质量评分，5.0为最高
                        </p>
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

              {/* 音频质量分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    音频质量分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">音频质量评分</h4>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600">
                            {content.audio_quality?.toFixed(2) || "0.00"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            满分 100.0
                          </div>
                          <Badge
                            variant="outline"
                            className="mt-2 text-blue-600 border-blue-600"
                          >
                            {(content.audio_quality || 0) > 80
                              ? "优秀"
                              : (content.audio_quality || 0) > 60
                                ? "良好"
                                : (content.audio_quality || 0) > 40
                                  ? "一般"
                                  : "较差"}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">音频内容分析</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">音乐占比</span>
                              <span className="text-sm font-medium">
                                {(
                                  (content.music_probability || 0) * 100
                                ).toFixed(2)}
                                %
                              </span>
                            </div>
                            <Progress
                              value={(content.music_probability || 0) * 100}
                              className="h-2"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">对话占比</span>
                              <span className="text-sm font-medium">
                                {(
                                  (content.dialog_probability || 0) * 100
                                ).toFixed(2)}
                                %
                              </span>
                            </div>
                            <Progress
                              value={(content.dialog_probability || 0) * 100}
                              className="h-2"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">背景音占比</span>
                              <span className="text-sm font-medium">
                                {(
                                  (content.background_sound_probability || 0) *
                                  100
                                ).toFixed(2)}
                                %
                              </span>
                            </div>
                            <Progress
                              value={
                                (content.background_sound_probability || 0) *
                                100
                              }
                              className="h-2"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">立体声丰富度</span>
                              <span className="text-sm font-medium">
                                {(
                                  (content.stereophonic_richness || 0) * 100
                                ).toFixed(2)}
                                %
                              </span>
                            </div>
                            <Progress
                              value={(content.stereophonic_richness || 0) * 100}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                      <h4 className="font-medium mb-2">音频质量评价说明</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• 音频质量评分: 综合音频清晰度、响度等因素的评分</p>
                        <p>• 音乐占比: 音频中音乐内容所占的比例</p>
                        <p>• 对话占比: 音频中人声对话所占的比例</p>
                        <p>• 背景音占比: 音频中背景音效所占的比例</p>
                        <p>• 立体声丰富度: 音频的立体声效果丰富程度</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
