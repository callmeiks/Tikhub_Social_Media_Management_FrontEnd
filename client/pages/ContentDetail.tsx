import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";

// Sample data - in a real app this would come from an API
const sampleContentData: Record<number, any> = {
  1: {
    id: 1,
    title: "超火的韩式裸妆教程！新手必看",
    platform: "抖音",
    author: "美妆达人小丽",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b332c44c?w=100&h=100&fit=crop&crop=face",
    authorFollowers: "128.5万",
    authorVerified: true,
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
    videoUrl: "https://player.vimeo.com/video/31991243",
    duration: "00:15",
    contentType: "美妆教程",
    description:
      "新手必看的韩式裸妆教程，简单易学，让你轻松拥有清透自然的妆容效果。视频详细展示了底妆、眉毛、眼妆、唇妆等各个步骤。",
    tags: ["美妆", "教程", "韩式", "裸妆", "新手"],
    location: "上海市",
    musicTitle: "Sweet Dreams",
    engagement: 18.2,
    trendData: [
      { time: "00:00", views: 1000, likes: 50, comments: 10 },
      { time: "01:00", views: 5000, likes: 250, comments: 48 },
      { time: "02:00", views: 12000, likes: 800, comments: 120 },
      { time: "03:00", views: 25000, likes: 1800, comments: 280 },
      { time: "06:00", views: 45000, likes: 3200, comments: 520 },
      { time: "12:00", views: 89000, likes: 6800, comments: 1200 },
      { time: "24:00", views: 156000, likes: 12800, comments: 2800 },
    ],
    audienceGender: [
      { name: "女性", value: 78, color: "#ff6b9d" },
      { name: "男性", value: 22, color: "#4dabf7" },
    ],
    audienceAge: [
      { age: "18-24", percentage: 45, color: "#ff9f43" },
      { age: "25-30", percentage: 32, color: "#10ac84" },
      { age: "31-35", percentage: 15, color: "#54a0ff" },
      { age: "36+", percentage: 8, color: "#a55eea" },
    ],
    wordCloud: [
      { text: "美妆", size: 100 },
      { text: "教程", size: 85 },
      { text: "韩式", size: 70 },
      { text: "裸妆", size: 65 },
      { text: "新手", size: 60 },
      { text: "自然", size: 55 },
      { text: "简单", size: 50 },
      { text: "清透", size: 45 },
      { text: "眼妆", size: 40 },
      { text: "底妆", size: 38 },
      { text: "唇妆", size: 35 },
      { text: "眉毛", size: 32 },
    ],
    relatedProducts: [
      {
        name: "兰蔻粉底液",
        price: "¥359",
        sales: "2.3万",
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop",
      },
      {
        name: "YSL口红",
        price: "¥320",
        sales: "1.8万",
        image:
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop",
      },
      {
        name: "美妆蛋",
        price: "¥29",
        sales: "5.6万",
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=100&fit=crop",
      },
    ],
    trafficAnalysis: {
      suspiciousLevel: "低风险",
      suspiciousPercentage: 8,
      realEngagement: 92,
      botComments: 12,
      spamLikes: 156,
      qualityScore: 94,
      riskFactors: [
        { factor: "机器人评论", level: "低", percentage: 3.8 },
        { factor: "虚假点赞", level: "低", percentage: 1.2 },
        { factor: "异常分享", level: "极低", percentage: 0.5 },
      ],
    },
  },
  2: {
    id: 2,
    title: "学生党宿舍收纳神器推荐",
    platform: "小红书",
    author: "生活记录家",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    authorFollowers: "86.2万",
    authorVerified: true,
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
    description:
      "专为学生党设计的宿舍收纳神器推荐，超实用的收纳技巧和产品分享，让你的宿舍变得整洁有序。",
    tags: ["收纳", "宿舍", "学生党", "整理", "神器"],
    location: "北京市",
    musicTitle: "轻音乐",
    engagement: 12.8,
    trendData: [
      { time: "00:00", views: 800, likes: 40, comments: 8 },
      { time: "01:00", views: 3500, likes: 180, comments: 35 },
      { time: "02:00", views: 8900, likes: 520, comments: 89 },
      { time: "03:00", views: 18500, likes: 1200, comments: 180 },
      { time: "06:00", views: 35000, likes: 2800, comments: 420 },
      { time: "12:00", views: 68000, likes: 5200, comments: 950 },
      { time: "24:00", views: 120000, likes: 8900, comments: 1500 },
    ],
    audienceGender: [
      { name: "女性", value: 85, color: "#ff6b9d" },
      { name: "男性", value: 15, color: "#4dabf7" },
    ],
    audienceAge: [
      { age: "18-24", percentage: 68, color: "#ff9f43" },
      { age: "25-30", percentage: 22, color: "#10ac84" },
      { age: "31-35", percentage: 8, color: "#54a0ff" },
      { age: "36+", percentage: 2, color: "#a55eea" },
    ],
    wordCloud: [
      { text: "收纳", size: 95 },
      { text: "宿舍", size: 88 },
      { text: "学生党", size: 75 },
      { text: "整理", size: 68 },
      { text: "神器", size: 62 },
      { text: "实用", size: 55 },
      { text: "推荐", size: 50 },
      { text: "技巧", size: 45 },
    ],
    relatedProducts: [
      {
        name: "折叠收纳箱",
        price: "¥39",
        sales: "8.5万",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
      },
      {
        name: "桌面整理架",
        price: "¥59",
        sales: "5.2万",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
      },
    ],
    trafficAnalysis: {
      suspiciousLevel: "低风险",
      suspiciousPercentage: 5,
      realEngagement: 95,
      botComments: 8,
      spamLikes: 89,
      qualityScore: 96,
      riskFactors: [
        { factor: "机器人评论", level: "极低", percentage: 2.1 },
        { factor: "虚假点赞", level: "低", percentage: 0.8 },
        { factor: "异常分享", level: "极低", percentage: 0.2 },
      ],
    },
  },
  3: {
    id: 3,
    title: "iPhone 15 Pro Max Deep Review",
    platform: "TikTok",
    author: "TechReviewer",
    authorAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    authorFollowers: "205.8万",
    authorVerified: true,
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
    description:
      "全面深度评测iPhone 15 Pro Max，从性能、拍照、续航等多个维度详细分析，为购买决策提供参考。",
    tags: ["iPhone", "评测", "数码", "科技", "深度"],
    location: "深圳市",
    musicTitle: "Tech Beat",
    engagement: 16.5,
    trendData: [
      { time: "00:00", views: 2000, likes: 120, comments: 25 },
      { time: "01:00", views: 8500, likes: 580, comments: 125 },
      { time: "02:00", views: 22000, likes: 1800, comments: 380 },
      { time: "03:00", views: 58000, likes: 4200, comments: 890 },
      { time: "06:00", views: 125000, likes: 8900, comments: 2200 },
      { time: "12:00", views: 280000, likes: 18500, comments: 5800 },
      { time: "24:00", views: 450000, likes: 25800, comments: 8900 },
    ],
    audienceGender: [
      { name: "男性", value: 72, color: "#4dabf7" },
      { name: "女性", value: 28, color: "#ff6b9d" },
    ],
    audienceAge: [
      { age: "18-24", percentage: 35, color: "#ff9f43" },
      { age: "25-30", percentage: 42, color: "#10ac84" },
      { age: "31-35", percentage: 18, color: "#54a0ff" },
      { age: "36+", percentage: 5, color: "#a55eea" },
    ],
    wordCloud: [
      { text: "iPhone", size: 100 },
      { text: "评测", size: 90 },
      { text: "深度", size: 78 },
      { text: "性能", size: 70 },
      { text: "拍照", size: 65 },
      { text: "续航", size: 58 },
      { text: "科技", size: 52 },
      { text: "分析", size: 48 },
    ],
    relatedProducts: [
      {
        name: "iPhone 15 Pro Max",
        price: "¥9999",
        sales: "12.8万",
        image:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop",
      },
      {
        name: "苹果手机壳",
        price: "¥199",
        sales: "25.6万",
        image:
          "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=100&h=100&fit=crop",
      },
    ],
    trafficAnalysis: {
      suspiciousLevel: "低风险",
      suspiciousPercentage: 12,
      realEngagement: 88,
      botComments: 52,
      spamLikes: 380,
      qualityScore: 91,
      riskFactors: [
        { factor: "机器人评论", level: "低", percentage: 5.8 },
        { factor: "虚假点赞", level: "低", percentage: 1.5 },
        { factor: "异常分享", level: "极低", percentage: 0.3 },
      ],
    },
  },
  4: {
    id: 4,
    title: "创意料理：芝士焗红薯制作教程",
    platform: "哔哩哔哩",
    author: "美食up主",
    authorAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    authorFollowers: "156.8万",
    authorVerified: true,
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
    description:
      "创意美食制作教程，教你如何制作美味的芝士焗红薯，简单易学，营养丰富，适合居家制作。",
    tags: ["美食", "料理", "芝士", "红薯", "教程"],
    location: "广州市",
    musicTitle: "Cooking Music",
    engagement: 20.2,
    trendData: [
      { time: "00:00", views: 1500, likes: 85, comments: 18 },
      { time: "01:00", views: 6800, likes: 420, comments: 95 },
      { time: "02:00", views: 15600, likes: 1200, comments: 285 },
      { time: "03:00", views: 32000, likes: 2800, comments: 680 },
      { time: "06:00", views: 52000, likes: 5200, comments: 1200 },
      { time: "12:00", views: 71000, likes: 8900, comments: 1980 },
      { time: "24:00", views: 89000, likes: 12500, comments: 2800 },
    ],
    audienceGender: [
      { name: "女性", value: 68, color: "#ff6b9d" },
      { name: "男性", value: 32, color: "#4dabf7" },
    ],
    audienceAge: [
      { age: "18-24", percentage: 28, color: "#ff9f43" },
      { age: "25-30", percentage: 38, color: "#10ac84" },
      { age: "31-35", percentage: 24, color: "#54a0ff" },
      { age: "36+", percentage: 10, color: "#a55eea" },
    ],
    wordCloud: [
      { text: "美食", size: 95 },
      { text: "芝士", size: 88 },
      { text: "红薯", size: 82 },
      { text: "料理", size: 75 },
      { text: "教程", size: 68 },
      { text: "创意", size: 62 },
      { text: "制作", size: 55 },
      { text: "简单", size: 48 },
    ],
    relatedProducts: [
      {
        name: "芝士片",
        price: "¥25",
        sales: "18.5万",
        image:
          "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=100&h=100&fit=crop",
      },
      {
        name: "烤箱",
        price: "¥899",
        sales: "2.8万",
        image:
          "https://images.unsplash.com/photo-1585515656892-6b8a62a65889?w=100&h=100&fit=crop",
      },
    ],
    trafficAnalysis: {
      suspiciousLevel: "低风险",
      suspiciousPercentage: 6,
      realEngagement: 94,
      botComments: 15,
      spamLikes: 125,
      qualityScore: 95,
      riskFactors: [
        { factor: "机器人评论", level: "极低", percentage: 1.8 },
        { factor: "虚假点赞", level: "极低", percentage: 1.0 },
        { factor: "异常分享", level: "极低", percentage: 0.1 },
      ],
    },
  },
};

export default function ContentDetail() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const contentData =
        sampleContentData[
          parseInt(contentId || "1") as keyof typeof sampleContentData
        ];
      setContent(contentData);
      setLoading(false);
    }, 500);
  }, [contentId]);

  if (loading) {
    return (
      <DashboardLayout title="作品详情" subtitle="加载中...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout title="作品详情" subtitle="作品不存在">
        <div className="text-center py-12">
          <p className="text-muted-foreground">找不到指定的作品</p>
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
    navigator.clipboard.writeText(content.url);
    alert("链接已复制到剪贴板");
  };

  return (
    <DashboardLayout
      title="作品详情"
      subtitle={content.title}
      actions={
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            返回列表
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
            onClick={() => window.open(content.url, "_blank")}
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
              <Eye className="mr-2 h-5 w-5" />
              作品信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 视频预览 */}
              <div className="lg:col-span-1">
                <div className="aspect-[9/16] rounded-lg overflow-hidden bg-black relative max-w-sm mx-auto">
                  {content.coverUrl ? (
                    <img
                      src={content.coverUrl}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="rounded-full w-16 h-16 p-0 brand-accent"
                      onClick={() => window.open(content.url, "_blank")}
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
                    {content.duration}
                  </div>
                </div>
              </div>

              {/* 作品详情 */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
                  <p className="text-muted-foreground mb-4">
                    {content.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {content.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="h-4 w-4 mr-1 text-blue-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.views}
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
                        {content.likes}
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
                        {content.comments}
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
                        {content.shares}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        分享数
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      发布时间: {content.publishedAt}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      视频时长: {content.duration}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      发布地点: {content.location}
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      ���动率: {content.engagement}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
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
            <TabsTrigger value="audience" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              观众画像
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              关联产品
            </TabsTrigger>
            <TabsTrigger value="traffic" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              流量分析
            </TabsTrigger>
          </TabsList>

          {/* 数据趋势 */}
          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>作品数据趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={content.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="播放量"
                      />
                      <Line
                        type="monotone"
                        dataKey="likes"
                        stroke="#ef4444"
                        strokeWidth={2}
                        name="点赞数"
                      />
                      <Line
                        type="monotone"
                        dataKey="comments"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="评论数"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 作者信息 */}
          <TabsContent value="author" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>作者信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={content.authorAvatar}
                      alt={content.author}
                    />
                    <AvatarFallback>{content.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">
                        {content.author}
                      </h3>
                      {content.authorVerified && (
                        <Badge variant="secondary" className="text-xs">
                          已认证
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground mb-4">
                      <div className="flex items-center space-x-4">
                        <span>{content.authorFollowers} 粉丝</span>
                        <span>{content.platform}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          230
                        </div>
                        <div className="text-sm text-muted-foreground">
                          总作品数
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          4.2万
                        </div>
                        <div className="text-sm text-muted-foreground">
                          平均播放量
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          15.8%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          平均互动率
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 词云分析 */}
          <TabsContent value="wordcloud" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>作品词云分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {content.wordCloud.map((word: any, index: number) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-muted/30 rounded-lg"
                      style={{
                        fontSize: `${word.size / 100 + 0.8}rem`,
                        opacity: word.size / 100,
                      }}
                    >
                      <div className="font-medium">{word.text}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        权重: {word.size}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">高频关键词</h4>
                  <div className="flex flex-wrap gap-2">
                    {content.wordCloud
                      .slice(0, 8)
                      .map((word: any, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm"
                        >
                          {word.text}
                        </Badge>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 观众画像 */}
          <TabsContent value="audience" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>性别分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={content.audienceGender}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {content.audienceGender.map(
                            (entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ),
                          )}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>年龄分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {content.audienceAge.map((age: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            {age.age}岁
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {age.percentage}%
                          </span>
                        </div>
                        <Progress value={age.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 关联产品 */}
          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>视频关联产品</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {content.relatedProducts.map(
                    (product: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{product.name}</h4>
                            <div className="text-lg font-bold text-red-600 mb-1">
                              {product.price}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              销量: {product.sales}
                            </div>
                          </div>
                        </div>
                        <Button className="w-full mt-3" size="sm">
                          查看详情
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 虚假流量分析 */}
          <TabsContent value="traffic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>虚假流量分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                        <div
                          className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent"
                          style={{
                            transform: `rotate(${(content.trafficAnalysis.realEngagement / 100) * 360}deg)`,
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {content.trafficAnalysis.realEngagement}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              真实度
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          content.trafficAnalysis.suspiciousLevel === "低风险"
                            ? "secondary"
                            : "destructive"
                        }
                        className="mb-2"
                      >
                        {content.trafficAnalysis.suspiciousLevel}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        质量评分: {content.trafficAnalysis.qualityScore}/100
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      <h4 className="font-medium">风险因素分析</h4>
                      {content.trafficAnalysis.riskFactors.map(
                        (risk: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">{risk.factor}</span>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    risk.level === "低"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {risk.level}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {risk.percentage}%
                                </span>
                              </div>
                            </div>
                            <Progress value={risk.percentage} className="h-2" />
                          </div>
                        ),
                      )}

                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-lg font-bold text-red-600">
                            {content.trafficAnalysis.botComments}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            机器人评论
                          </div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="text-lg font-bold text-yellow-600">
                            {content.trafficAnalysis.spamLikes}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            虚假点赞
                          </div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {content.trafficAnalysis.realEngagement}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            真实互动
                          </div>
                        </div>
                      </div>
                    </div>
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
