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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  ArrowLeft,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Users,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Copy,
  Download,
  Tv,
  Film,
  Coins,
  Star,
  MessageSquare,
  BarChart3,
  Shield,
  Copyright,
  Lock,
  Unlock,
  DollarSign,
  FileText,
  Layers,
  TrendingUp,
  Activity,
  ThumbsDown,
} from "lucide-react";

interface BilibiliVideoData {
  id: string;
  task_id: string;
  bvid: string;
  aid: number;
  is_video: boolean;
  tid: number;
  tid_v2: number;
  tname: string;
  tname_v2: string;
  has_copyright: boolean;
  video_cover_url: string;
  title: string;
  publish_time: number;
  duration: number;
  allow_download: boolean;
  is_movie: boolean;
  is_pay_content: boolean;
  is_360_view: boolean;
  allow_reprint: boolean;
  allow_share: boolean;
  is_cooperation: boolean;
  is_ugc_pay: boolean;
  is_arc_pay: boolean;
  author_mid: number;
  author_name: string;
  author_avatar: string;
  view_count: number;
  danmaku_count: number;
  reply_count: number;
  favorite_count: number;
  coin_count: number;
  share_count: number;
  dislike_count: number;
  like_count: number;
  viewseo_count: number;
  cid: number;
  season_id: number;
  teenage_mode: number;
  is_story: boolean;
  is_upower_exclusive: boolean;
  is_upower_play: boolean;
  is_upower_preview: boolean;
  ugc_season_id: number;
  ugc_season_title: string;
  ugc_season_cover: string;
  season_view_count: number;
  season_danmaku_count: number;
  season_reply_count: number;
  season_favorite_count: number;
  season_coin_count: number;
  season_share_count: number;
  season_like_count: number;
  episode_count: number;
  is_pay_season: boolean;
  video_play_url: string;
  audio_play_url: string;
  created_at: string;
  updated_at: string;
}

export default function ContentDetailBilibili() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<BilibiliVideoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if content data was passed via navigation state
    if (location.state?.contentData) {
      const contentData = location.state.contentData;
      
      // Map the API data to BilibiliVideoData format
      const mappedData: BilibiliVideoData = {
        id: contentData.id || "bilibili_" + Date.now(),
        task_id: contentData.task_id || "",
        bvid: contentData.bvid || "",
        aid: contentData.aid || 0,
        is_video: contentData.is_video !== undefined ? contentData.is_video : true,
        tid: contentData.tid || 0,
        tid_v2: contentData.tid_v2 || 0,
        tname: contentData.tname || "未知分类",
        tname_v2: contentData.tname_v2 || "未知分类",
        has_copyright: contentData.has_copyright || false,
        video_cover_url: contentData.video_cover_url || "",
        title: contentData.title || "无标题",
        publish_time: contentData.publish_time || Date.now() / 1000,
        duration: contentData.duration || 0,
        allow_download: contentData.allow_download || false,
        is_movie: contentData.is_movie || false,
        is_pay_content: contentData.is_pay_content || false,
        is_360_view: contentData.is_360_view || false,
        allow_reprint: contentData.allow_reprint || false,
        allow_share: contentData.allow_share !== undefined ? contentData.allow_share : true,
        is_cooperation: contentData.is_cooperation || false,
        is_ugc_pay: contentData.is_ugc_pay || false,
        is_arc_pay: contentData.is_arc_pay || false,
        author_mid: contentData.author_mid || 0,
        author_name: contentData.author_name || "未知UP主",
        author_avatar: contentData.author_avatar || "",
        view_count: contentData.view_count || 0,
        danmaku_count: contentData.danmaku_count || 0,
        reply_count: contentData.reply_count || 0,
        favorite_count: contentData.favorite_count || 0,
        coin_count: contentData.coin_count || 0,
        share_count: contentData.share_count || 0,
        dislike_count: contentData.dislike_count || 0,
        like_count: contentData.like_count || 0,
        viewseo_count: contentData.viewseo_count || contentData.view_count || 0,
        cid: contentData.cid || 0,
        season_id: contentData.season_id || 0,
        teenage_mode: contentData.teenage_mode || 0,
        is_story: contentData.is_story || false,
        is_upower_exclusive: contentData.is_upower_exclusive || false,
        is_upower_play: contentData.is_upower_play || false,
        is_upower_preview: contentData.is_upower_preview || false,
        ugc_season_id: contentData.ugc_season_id || 0,
        ugc_season_title: contentData.ugc_season_title || "",
        ugc_season_cover: contentData.ugc_season_cover || "",
        season_view_count: contentData.season_view_count || 0,
        season_danmaku_count: contentData.season_danmaku_count || 0,
        season_reply_count: contentData.season_reply_count || 0,
        season_favorite_count: contentData.season_favorite_count || 0,
        season_coin_count: contentData.season_coin_count || 0,
        season_share_count: contentData.season_share_count || 0,
        season_like_count: contentData.season_like_count || 0,
        episode_count: contentData.episode_count || 0,
        is_pay_season: contentData.is_pay_season || false,
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
        const mockData: BilibiliVideoData = {
          id: "bilibili_1",
          task_id: "task_123",
          bvid: "BV1TQGuzXEr1",
          aid: 114827578120747,
          is_video: true,
          tid: 228,
          tid_v2: 2153,
          tname: "人文历史",
          tname_v2: "美食综合",
          has_copyright: true,
          video_cover_url: "http://i1.hdslb.com/bfs/archive/3fc237e9822c44ab7db62a4c01701ae457d14f86.jpg",
          title: "简单+粗暴=美国人的饮食 ——美国人的疯狂餐桌",
          publish_time: 1752199200,
          duration: 602,
          allow_download: true,
          is_movie: false,
          is_pay_content: false,
          is_360_view: false,
          allow_reprint: false,
          allow_share: true,
          is_cooperation: false,
          is_ugc_pay: false,
          is_arc_pay: false,
          author_mid: 53737196,
          author_name: "食事史馆",
          author_avatar: "https://i2.hdslb.com/bfs/face/caa9d6afe048e20f2fc706ae43323da16c3e4241.jpg",
          view_count: 650839,
          danmaku_count: 1260,
          reply_count: 619,
          favorite_count: 7186,
          coin_count: 2216,
          share_count: 357,
          dislike_count: 0,
          like_count: 25457,
          viewseo_count: 650839,
          cid: 30953374095,
          season_id: 557462,
          teenage_mode: 0,
          is_story: false,
          is_upower_exclusive: false,
          is_upower_play: false,
          is_upower_preview: false,
          ugc_season_id: 557462,
          ugc_season_title: "连播哄睡合集",
          ugc_season_cover: "https://archive.biliimg.com/bfs/archive/e6f76c188fc7a431d6a8c63de038992f0533d2a1.jpg",
          season_view_count: 195991584,
          season_danmaku_count: 434446,
          season_reply_count: 135759,
          season_favorite_count: 1344835,
          season_coin_count: 969371,
          season_share_count: 174334,
          season_like_count: 6032481,
          episode_count: 125,
          is_pay_season: false,
          video_play_url: "https://xy120x196x203x226xy.mcdn.bilivideo.cn:8082/v1/resource/30953374095-1-100050.m4s",
          audio_play_url: "https://xy122x191x18x180xy.mcdn.bilivideo.cn:8082/v1/resource/30953374095-1-30232.m4s",
          created_at: "2024-01-20T10:30:00",
          updated_at: "2024-01-20T10:30:00",
        };
        setContent(mockData);
        setLoading(false);
      }, 1000);
    }
  }, [contentId, location.state]);

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

  // Helper function to format duration
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyUrl = () => {
    if (content) {
      const videoUrl = `https://www.bilibili.com/video/${content.bvid}`;
      navigator.clipboard.writeText(videoUrl);
      alert("链接已复制到剪贴板");
    }
  };

  const handleOpenOriginal = () => {
    if (content) {
      const videoUrl = `https://www.bilibili.com/video/${content.bvid}`;
      window.open(videoUrl, "_blank");
    }
  };

  const exportData = () => {
    if (!content) return;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([
      {
        "视频BV号": content.bvid,
        "视频AV号": content.aid,
        "视频标题": content.title,
        "UP主": content.author_name,
        "UP主ID": content.author_mid,
        "一级分区": content.tname,
        "二级分区": content.tname_v2,
        "播放量": content.view_count,
        "点赞数": content.like_count,
        "投币数": content.coin_count,
        "收藏数": content.favorite_count,
        "弹幕数": content.danmaku_count,
        "评论数": content.reply_count,
        "分享数": content.share_count,
        "踩数": content.dislike_count,
        "时长(秒)": content.duration,
        "发布时间": new Date(content.publish_time * 1000).toLocaleString('zh-CN'),
        "是否原创": content.has_copyright ? "是" : "否",
        "是否付费": content.is_pay_content ? "是" : "否",
        "允许下载": content.allow_download ? "是" : "否",
        "允许转载": content.allow_reprint ? "是" : "否",
        "合集名称": content.ugc_season_title || "无",
        "合集总集数": content.episode_count || 0,
      },
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheet, "B站视频数据");
    XLSX.writeFile(workbook, `bilibili_video_${content.bvid}_data.xlsx`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-500">加载中...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-500">未找到内容</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              返回
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Prepare chart data
  const engagementData = [
    { name: "点赞", value: content.like_count, color: "#FF6B6B" },
    { name: "投币", value: content.coin_count, color: "#FFD93D" },
    { name: "收藏", value: content.favorite_count, color: "#6BCF7F" },
    { name: "分享", value: content.share_count, color: "#4ECDC4" },
  ];

  const interactionData = [
    { name: "弹幕", value: content.danmaku_count, color: "#45B7D1" },
    { name: "评论", value: content.reply_count, color: "#96CEB4" },
    { name: "踩", value: content.dislike_count, color: "#DDA0DD" },
  ];

  // Radar chart data for comprehensive stats
  const radarData = [
    {
      metric: "播放量",
      value: Math.min((content.view_count / 1000000) * 10, 100), // Scale to 0-100
      fullMark: 100,
    },
    {
      metric: "点赞率",
      value: content.view_count > 0 ? (content.like_count / content.view_count) * 100 : 0,
      fullMark: 100,
    },
    {
      metric: "投币率",
      value: content.view_count > 0 ? (content.coin_count / content.view_count) * 100 : 0,
      fullMark: 100,
    },
    {
      metric: "收藏率",
      value: content.view_count > 0 ? (content.favorite_count / content.view_count) * 100 : 0,
      fullMark: 100,
    },
    {
      metric: "弹幕密度",
      value: content.duration > 0 ? Math.min((content.danmaku_count / content.duration) * 10, 100) : 0,
      fullMark: 100,
    },
    {
      metric: "评论活跃度",
      value: content.view_count > 0 ? Math.min((content.reply_count / content.view_count) * 1000, 100) : 0,
      fullMark: 100,
    },
  ];

  const overviewStats = [
    {
      title: "播放量",
      value: content.view_count,
      icon: Eye,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "点赞数",
      value: content.like_count,
      icon: Heart,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
    },
    {
      title: "投币数",
      value: content.coin_count,
      icon: Coins,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "收藏数",
      value: content.favorite_count,
      icon: Star,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ];

  // Calculate engagement rate
  const engagementRate = content.view_count > 0
    ? ((content.like_count + content.coin_count + content.favorite_count + content.share_count) / content.view_count * 100).toFixed(2)
    : "0";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              className="h-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Button>
            <div>
              <h1 className="text-2xl font-bold">B站视频详情</h1>
              <p className="text-sm text-muted-foreground mt-1">
                BV号: {content.bvid} | AV号: {content.aid}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleCopyUrl}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <Copy className="mr-2 h-3.5 w-3.5" />
              复制链接
            </Button>
            <Button
              onClick={handleOpenOriginal}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              查看原视频
            </Button>
            <Button onClick={exportData} size="sm" className="h-8">
              <Download className="mr-2 h-3.5 w-3.5" />
              导出数据
            </Button>
          </div>
        </div>

        {/* Video Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Cover */}
              <div className="lg:col-span-1">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  {content.video_cover_url ? (
                    <img
                      src={content.video_cover_url}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tv className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">时长</span>
                    <span className="font-medium">{formatDuration(content.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">发布时间</span>
                    <span className="font-medium">
                      {new Date(content.publish_time * 1000).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Details */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">{content.title}</h2>
                  <div className="flex items-center space-x-4">
                    <Badge>{content.tname}</Badge>
                    <Badge variant="outline">{content.tname_v2}</Badge>
                    {content.has_copyright && (
                      <Badge variant="secondary">
                        <Copyright className="mr-1 h-3 w-3" />
                        原创
                      </Badge>
                    )}
                    {content.is_cooperation && (
                      <Badge variant="secondary">
                        <Users className="mr-1 h-3 w-3" />
                        合作
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={content.author_avatar} />
                    <AvatarFallback>{content.author_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{content.author_name}</p>
                    <p className="text-sm text-muted-foreground">UID: {content.author_mid}</p>
                  </div>
                </div>

                {/* Permissions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Badge variant={content.allow_download ? "default" : "secondary"}>
                    {content.allow_download ? <Unlock className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}
                    {content.allow_download ? "允许下载" : "禁止下载"}
                  </Badge>
                  <Badge variant={content.allow_share ? "default" : "secondary"}>
                    {content.allow_share ? <Unlock className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}
                    {content.allow_share ? "允许分享" : "禁止分享"}
                  </Badge>
                  <Badge variant={content.allow_reprint ? "default" : "secondary"}>
                    {content.allow_reprint ? <Unlock className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}
                    {content.allow_reprint ? "允许转载" : "禁止转载"}
                  </Badge>
                  <Badge variant={content.is_pay_content ? "destructive" : "default"}>
                    {content.is_pay_content ? <DollarSign className="mr-1 h-3 w-3" /> : <Unlock className="mr-1 h-3 w-3" />}
                    {content.is_pay_content ? "付费内容" : "免费观看"}
                  </Badge>
                </div>

                {/* Special Tags */}
                {(content.is_movie || content.is_360_view || content.is_story) && (
                  <div className="flex items-center space-x-2">
                    {content.is_movie && (
                      <Badge variant="outline">
                        <Film className="mr-1 h-3 w-3" />
                        电影
                      </Badge>
                    )}
                    {content.is_360_view && (
                      <Badge variant="outline">360°全景</Badge>
                    )}
                    {content.is_story && (
                      <Badge variant="outline">
                        <FileText className="mr-1 h-3 w-3" />
                        故事
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {overviewStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {formatNumber(stat.value)}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="data">数据分析</TabsTrigger>
            <TabsTrigger value="interaction">互动数据</TabsTrigger>
            <TabsTrigger value="season">合集信息</TabsTrigger>
            <TabsTrigger value="advanced">高级数据</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">三连数据分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatNumber(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Interaction Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">互动数据</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={interactionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatNumber(value)} />
                      <Bar dataKey="value" fill="#8884d8">
                        {interactionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interaction" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Detailed Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">详细数据统计</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4 text-red-500" />
                            <span>播放量</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatNumber(content.view_count)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4 text-pink-500" />
                            <span>点赞数</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatNumber(content.like_count)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Coins className="h-4 w-4 text-yellow-500" />
                            <span>投币数</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatNumber(content.coin_count)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-blue-500" />
                            <span>收藏数</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatNumber(content.favorite_count)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4 text-green-500" />
                            <span>弹幕数</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatNumber(content.danmaku_count)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="h-4 w-4 text-purple-500" />
                            <span>评论数</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatNumber(content.reply_count)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Share2 className="h-4 w-4 text-cyan-500" />
                            <span>分享数</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatNumber(content.share_count)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <ThumbsDown className="h-4 w-4 text-gray-500" />
                            <span>踩数</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatNumber(content.dislike_count)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Performance Radar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">视频表现雷达图</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="表现指标"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Metrics */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">互动率分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">总互动率</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{engagementRate}%</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">点赞率</p>
                    <p className="text-xl font-bold mt-1">
                      {content.view_count > 0 ? ((content.like_count / content.view_count) * 100).toFixed(2) : 0}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">投币率</p>
                    <p className="text-xl font-bold mt-1">
                      {content.view_count > 0 ? ((content.coin_count / content.view_count) * 100).toFixed(2) : 0}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">收藏率</p>
                    <p className="text-xl font-bold mt-1">
                      {content.view_count > 0 ? ((content.favorite_count / content.view_count) * 100).toFixed(2) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="season" className="mt-6">
            {content.ugc_season_id ? (
              <div className="space-y-6">
                {/* Season Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">合集信息</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <img
                          src={content.ugc_season_cover}
                          alt={content.ugc_season_title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-bold text-lg">{content.ugc_season_title}</h3>
                          <p className="text-sm text-muted-foreground">
                            合集ID: {content.ugc_season_id}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">
                            <Layers className="mr-1 h-3 w-3" />
                            共 {content.episode_count} 集
                          </Badge>
                          {content.is_pay_season && (
                            <Badge variant="destructive">
                              <DollarSign className="mr-1 h-3 w-3" />
                              付费合集
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Season Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">合集数据统计</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Eye className="h-6 w-6 text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">总播放量</p>
                        <p className="text-xl font-bold">{formatNumber(content.season_view_count)}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Heart className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">总点赞数</p>
                        <p className="text-xl font-bold">{formatNumber(content.season_like_count)}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Coins className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">总投币数</p>
                        <p className="text-xl font-bold">{formatNumber(content.season_coin_count)}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Star className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">总收藏数</p>
                        <p className="text-xl font-bold">{formatNumber(content.season_favorite_count)}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">总弹幕数</p>
                        <p className="text-xl font-bold">{formatNumber(content.season_danmaku_count)}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <MessageCircle className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">总评论数</p>
                        <p className="text-xl font-bold">{formatNumber(content.season_reply_count)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>该视频不属于任何合集</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">高级信息</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">CID</TableCell>
                      <TableCell>{content.cid}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">SEO播放量</TableCell>
                      <TableCell>{formatNumber(content.viewseo_count)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">青少年模式</TableCell>
                      <TableCell>{content.teenage_mode === 0 ? "关闭" : "开启"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">UP主充电</TableCell>
                      <TableCell>
                        {content.is_upower_exclusive ? (
                          <Badge variant="secondary">充电专属</Badge>
                        ) : content.is_upower_play ? (
                          <Badge variant="secondary">充电可看</Badge>
                        ) : (
                          <Badge variant="outline">无限制</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">UGC付费</TableCell>
                      <TableCell>
                        <Badge variant={content.is_ugc_pay ? "destructive" : "outline"}>
                          {content.is_ugc_pay ? "付费内容" : "免费内容"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">ARC付费</TableCell>
                      <TableCell>
                        <Badge variant={content.is_arc_pay ? "destructive" : "outline"}>
                          {content.is_arc_pay ? "付费内容" : "免费内容"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">视频播放链接</TableCell>
                      <TableCell>
                        {content.video_play_url ? (
                          <a
                            href={content.video_play_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center"
                          >
                            查看视频源 <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        ) : (
                          "无"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">音频播放链接</TableCell>
                      <TableCell>
                        {content.audio_play_url ? (
                          <a
                            href={content.audio_play_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center"
                          >
                            查看音频源 <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        ) : (
                          "无"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">创建时间</TableCell>
                      <TableCell>{new Date(content.created_at).toLocaleString('zh-CN')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">更新时间</TableCell>
                      <TableCell>{new Date(content.updated_at).toLocaleString('zh-CN')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}