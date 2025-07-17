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
  Camera,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Copy,
  Download,
  Image,
  Video,
  CheckCircle,
  Tag,
  AtSign,
  Shield,
  Lock,
  Unlock,
  ShoppingBag,
  Carousel,
  BarChart3,
  Eye,
  Users,
} from "lucide-react";

interface InstagramPostData {
  id: string;
  task_id: string;
  pk: string;
  code: string;
  taken_at: number;
  taken_at_date: string;
  media_type: number;
  is_video: boolean;
  user_id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  is_verified: boolean;
  is_private: boolean;
  caption_text: string;
  caption_created_at: number;
  mentions: string[];
  hashtags: string[];
  accessibility_caption: string;
  thumbnail_url: string;
  image_url_hd: string;
  image_url_sd: string;
  original_width: number;
  original_height: number;
  comment_count: number;
  save_count: number;
  share_count: number;
  view_count: number;
  like_count: number;
  can_save: boolean;
  can_reshare: boolean;
  can_reply: boolean;
  has_liked: boolean;
  comments_disabled: boolean;
  is_paid_partnership: boolean;
  tagged_users: Array<{
    user: {
      id: string;
      username: string;
      full_name: string;
      profile_pic_url: string;
    };
    position: number[];
  }>;
  created_at: string;
  updated_at: string;
}

export default function ContentDetailInstagram() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<InstagramPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if content data was passed via navigation state
    if (location.state?.contentData) {
      const contentData = location.state.contentData;

      // Map the API data to InstagramPostData format
      const mappedData: InstagramPostData = {
        id: contentData.id || "instagram_" + Date.now(),
        task_id: contentData.task_id || "",
        pk: contentData.pk || contentData.post_id || "",
        code: contentData.code || "",
        taken_at: contentData.taken_at || Date.now() / 1000,
        taken_at_date: contentData.taken_at_date || new Date().toISOString(),
        media_type: contentData.media_type || 1,
        is_video: contentData.is_video || false,
        user_id: contentData.user_id || "",
        username:
          contentData.username || contentData.author_username || "未知用户",
        full_name:
          contentData.full_name || contentData.author_full_name || "未知用户",
        profile_pic_url: contentData.profile_pic_url || "",
        is_verified: contentData.is_verified || false,
        is_private: contentData.is_private || false,
        caption_text:
          contentData.caption_text || contentData.caption || "无描述",
        caption_created_at: contentData.caption_created_at || Date.now() / 1000,
        mentions: contentData.mentions || [],
        hashtags: contentData.hashtags || [],
        accessibility_caption: contentData.accessibility_caption || "",
        thumbnail_url: contentData.thumbnail_url || "",
        image_url_hd:
          contentData.image_url_hd || contentData.image_urls?.[0] || "",
        image_url_sd:
          contentData.image_url_sd || contentData.image_urls?.[0] || "",
        original_width: contentData.original_width || 0,
        original_height: contentData.original_height || 0,
        comment_count: contentData.comment_count || 0,
        save_count: contentData.save_count || 0,
        share_count: contentData.share_count || 0,
        view_count: contentData.view_count || 0,
        like_count: contentData.like_count || 0,
        can_save:
          contentData.can_save !== undefined ? contentData.can_save : true,
        can_reshare:
          contentData.can_reshare !== undefined
            ? contentData.can_reshare
            : true,
        can_reply:
          contentData.can_reply !== undefined ? contentData.can_reply : true,
        has_liked: contentData.has_liked || false,
        comments_disabled: contentData.comments_disabled || false,
        is_paid_partnership: contentData.is_paid_partnership || false,
        tagged_users: contentData.tagged_users || [],
        created_at: contentData.created_at || new Date().toISOString(),
        updated_at: contentData.updated_at || new Date().toISOString(),
      };

      setContent(mappedData);
      setLoading(false);
    } else {
      // Fallback to mock data if no data was passed
      setTimeout(() => {
        const mockData: InstagramPostData = {
          id: "instagram_1",
          task_id: "task_123",
          pk: "3195374938890887354",
          code: "CxYQJO8xuC6",
          taken_at: 1695138398,
          taken_at_date: "2023-09-19T15:46:38+00:00",
          media_type: 1,
          is_video: false,
          user_id: "25025320",
          username: "instagram",
          full_name: "Instagram",
          profile_pic_url:
            "https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/281440578_1088265838702675_6233856337905829714_n.jpg",
          is_verified: true,
          is_private: false,
          caption_text:
            '"We heal and reclaim our identity through the act of creation," says @adinasdoodles (Adina Farinango), a Kichwa artist of Ecuadorian heritage who now lives in the Indigenous territory Lenapehoking, which includes New York City.',
          caption_created_at: 1695138398,
          mentions: ["@adinasdoodles", "@keyraarroyo", "@design"],
          hashtags: [],
          accessibility_caption:
            "Artwork of two faceless people standing side by side wearing necklaces, earrings and colorful tops.",
          thumbnail_url:
            "https://scontent-vie1-1.cdninstagram.com/v/t51.29350-15/379560024_1762628070832824_3765573901785981843_n.jpg",
          image_url_hd:
            "https://scontent-vie1-1.cdninstagram.com/v/t51.29350-15/379560024_1762628070832824_3765573901785981843_n.jpg",
          image_url_sd:
            "https://scontent-vie1-1.cdninstagram.com/v/t51.29350-15/379560024_1762628070832824_3765573901785981843_n.jpg",
          original_width: 1440,
          original_height: 1440,
          comment_count: 4316,
          save_count: 15234,
          share_count: 892,
          view_count: 2456789,
          like_count: 189486,
          can_save: true,
          can_reshare: true,
          can_reply: false,
          has_liked: false,
          comments_disabled: false,
          is_paid_partnership: false,
          tagged_users: [
            {
              user: {
                id: "455765941",
                username: "keyraarroyo",
                full_name: "Keyra Espinoza Arroyo",
                profile_pic_url:
                  "https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/483290532_1057408086427488_1988972788570270888_n.jpg",
              },
              position: [0.5196580936, 0.9059828929],
            },
          ],
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper function to get media type name
  const getMediaTypeName = (mediaType: number): string => {
    switch (mediaType) {
      case 1:
        return "图片";
      case 2:
        return "视频";
      case 8:
        return "轮播";
      default:
        return "未知";
    }
  };

  const handleCopyUrl = () => {
    if (content) {
      const postUrl = `https://www.instagram.com/p/${content.code}/`;
      navigator.clipboard.writeText(postUrl);
      alert("链接已复制到剪贴板");
    }
  };

  const handleOpenOriginal = () => {
    if (content) {
      const postUrl = `https://www.instagram.com/p/${content.code}/`;
      window.open(postUrl, "_blank");
    }
  };

  const exportData = () => {
    if (!content) return;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([
      {
        帖子ID: content.pk,
        帖子代码: content.code,
        作者用户名: content.username,
        作者全名: content.full_name,
        是否认证: content.is_verified ? "是" : "否",
        是否私密账号: content.is_private ? "是" : "否",
        媒体类型: getMediaTypeName(content.media_type),
        是否视频: content.is_video ? "是" : "否",
        内容描述: content.caption_text,
        点赞数: content.like_count,
        评论数: content.comment_count,
        收藏数: content.save_count,
        分享数: content.share_count,
        观看数: content.view_count,
        发布时间: content.taken_at_date,
        "@提及": content.mentions.join(", "),
        话题标签: content.hashtags.join(", "),
        是否付费合作: content.is_paid_partnership ? "是" : "否",
        原始宽度: content.original_width,
        原始高度: content.original_height,
      },
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Instagram帖子数据");
    XLSX.writeFile(workbook, `instagram_post_${content.code}_data.xlsx`);
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
    { name: "评论", value: content.comment_count, color: "#4ECDC4" },
    { name: "收藏", value: content.save_count, color: "#45B7D1" },
    { name: "分享", value: content.share_count, color: "#FFA07A" },
  ];

  const overviewStats = [
    {
      title: "总互动量",
      value:
        content.like_count +
        content.comment_count +
        content.save_count +
        content.share_count,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "互动率",
      value:
        content.view_count > 0
          ? (
              ((content.like_count + content.comment_count) /
                content.view_count) *
              100
            ).toFixed(2) + "%"
          : "0%",
      icon: BarChart3,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "观看数",
      value: content.view_count,
      icon: Eye,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "媒体类型",
      value: getMediaTypeName(content.media_type),
      icon: content.is_video ? Video : Image,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

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
              <h1 className="text-2xl font-bold">Instagram 帖子详情</h1>
              <p className="text-sm text-muted-foreground mt-1">
                帖子代码: {content.code}
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
              查看原帖
            </Button>
            <Button onClick={exportData} size="sm" className="h-8">
              <Download className="mr-2 h-3.5 w-3.5" />
              导出数据
            </Button>
          </div>
        </div>

        {/* Author Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="mr-2 h-4 w-4" />
              作者信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={content.profile_pic_url} />
                <AvatarFallback>
                  {content.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-semibold">{content.full_name}</h3>
                  {content.is_verified && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                  {content.is_private && (
                    <Lock className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  @{content.username}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="outline">用户ID: {content.user_id}</Badge>
                  {content.is_paid_partnership && (
                    <Badge variant="secondary">
                      <ShoppingBag className="mr-1 h-3 w-3" />
                      付费合作
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {overviewStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {typeof stat.value === "number"
                        ? formatNumber(stat.value)
                        : stat.value}
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
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">内容详情</TabsTrigger>
            <TabsTrigger value="engagement">互动数据</TabsTrigger>
            <TabsTrigger value="media">媒体信息</TabsTrigger>
            <TabsTrigger value="tags">标签与提及</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">帖子内容</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Media Preview */}
                <div className="rounded-lg overflow-hidden bg-gray-100 max-w-2xl mx-auto">
                  {content.is_video ? (
                    <div className="relative aspect-square bg-black flex items-center justify-center">
                      <Video className="h-16 w-16 text-white/50" />
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant="secondary"
                          className="bg-black/50 text-white"
                        >
                          视频内容
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={content.image_url_hd || content.thumbnail_url}
                      alt="Instagram post"
                      className="w-full h-auto"
                      onError={(e) => {
                        e.currentTarget.src =
                          content.image_url_sd || content.thumbnail_url;
                      }}
                    />
                  )}
                </div>

                {/* Caption */}
                <div>
                  <h4 className="font-medium mb-2">内容描述</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {content.caption_text}
                  </p>
                </div>

                {/* Accessibility Caption */}
                {content.accessibility_caption && (
                  <div>
                    <h4 className="font-medium mb-2">辅助功能描述</h4>
                    <p className="text-sm text-gray-600">
                      {content.accessibility_caption}
                    </p>
                  </div>
                )}

                {/* Post Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      发布时间:
                    </span>
                    <p className="font-medium">
                      {new Date(content.taken_at * 1000).toLocaleString(
                        "zh-CN",
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      创建时间:
                    </span>
                    <p className="font-medium">
                      {new Date(content.created_at).toLocaleString("zh-CN")}
                    </p>
                  </div>
                </div>

                {/* Permissions */}
                <div className="flex items-center space-x-4">
                  <Badge variant={content.can_save ? "default" : "secondary"}>
                    {content.can_save ? (
                      <Unlock className="mr-1 h-3 w-3" />
                    ) : (
                      <Lock className="mr-1 h-3 w-3" />
                    )}
                    {content.can_save ? "可保存" : "不可保存"}
                  </Badge>
                  <Badge
                    variant={content.can_reshare ? "default" : "secondary"}
                  >
                    {content.can_reshare ? (
                      <Unlock className="mr-1 h-3 w-3" />
                    ) : (
                      <Lock className="mr-1 h-3 w-3" />
                    )}
                    {content.can_reshare ? "可分享" : "不可分享"}
                  </Badge>
                  <Badge variant={content.can_reply ? "default" : "secondary"}>
                    {content.can_reply ? (
                      <Unlock className="mr-1 h-3 w-3" />
                    ) : (
                      <Lock className="mr-1 h-3 w-3" />
                    )}
                    {content.can_reply ? "可回复" : "不可回复"}
                  </Badge>
                  <Badge
                    variant={
                      content.comments_disabled ? "secondary" : "default"
                    }
                  >
                    {content.comments_disabled ? (
                      <Lock className="mr-1 h-3 w-3" />
                    ) : (
                      <Unlock className="mr-1 h-3 w-3" />
                    )}
                    {content.comments_disabled ? "评论已关闭" : "评论开放"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">互动分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatNumber(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Detailed Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">详细数据</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>点赞数</span>
                      </div>
                      <span className="font-bold">
                        {formatNumber(content.like_count)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span>评论数</span>
                      </div>
                      <span className="font-bold">
                        {formatNumber(content.comment_count)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bookmark className="h-4 w-4 text-green-500" />
                        <span>收藏数</span>
                      </div>
                      <span className="font-bold">
                        {formatNumber(content.save_count)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Share2 className="h-4 w-4 text-purple-500" />
                        <span>分享数</span>
                      </div>
                      <span className="font-bold">
                        {formatNumber(content.share_count)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-orange-500" />
                        <span>观看数</span>
                      </div>
                      <span className="font-bold">
                        {formatNumber(content.view_count)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">媒体信息</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">媒体类型</TableCell>
                      <TableCell>
                        <Badge>{getMediaTypeName(content.media_type)}</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">是否视频</TableCell>
                      <TableCell>{content.is_video ? "是" : "否"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">原始尺寸</TableCell>
                      <TableCell>
                        {content.original_width} × {content.original_height}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">宽高比</TableCell>
                      <TableCell>
                        {content.original_height > 0
                          ? (
                              content.original_width / content.original_height
                            ).toFixed(2)
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">高清图片</TableCell>
                      <TableCell>
                        {content.image_url_hd ? (
                          <a
                            href={content.image_url_hd}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center"
                          >
                            查看高清图片{" "}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        ) : (
                          "无"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">标清图片</TableCell>
                      <TableCell>
                        {content.image_url_sd ? (
                          <a
                            href={content.image_url_sd}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center"
                          >
                            查看标清图片{" "}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        ) : (
                          "无"
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mentions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <AtSign className="mr-2 h-4 w-4" />
                    @提及 ({content.mentions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {content.mentions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {content.mentions.map((mention, index) => (
                        <Badge key={index} variant="secondary">
                          {mention}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">无@提及</p>
                  )}
                </CardContent>
              </Card>

              {/* Hashtags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    话题标签 ({content.hashtags.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {content.hashtags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {content.hashtags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">无话题标签</p>
                  )}
                </CardContent>
              </Card>

              {/* Tagged Users */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    标记用户 ({content.tagged_users.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {content.tagged_users.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>用户</TableHead>
                          <TableHead>用户名</TableHead>
                          <TableHead>位置</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {content.tagged_users.map((taggedUser, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={taggedUser.user.profile_pic_url}
                                  />
                                  <AvatarFallback>
                                    {taggedUser.user.username[0]?.toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{taggedUser.user.full_name}</span>
                              </div>
                            </TableCell>
                            <TableCell>@{taggedUser.user.username}</TableCell>
                            <TableCell>
                              {(taggedUser.position[0] * 100).toFixed(1)}%,{" "}
                              {(taggedUser.position[1] * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">无标记用户</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
