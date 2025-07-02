import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  Download,
  BarChart3,
  Play,
  Share2,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Zap,
  Star,
  Wand2,
  Database,
  ShoppingCart,
  Search,
  RotateCcw,
  Type,
  Shield,
  FileText,
  Video,
  AudioLines,
  Image,
  Filter,
  Calendar,
  Activity,
  Award,
  Bookmark,
  Camera,
  Gift,
  Hash,
  Headphones,
  Home,
  Link as LinkIcon,
  Mail,
  Music,
  Navigation,
  PieChart,
  Repeat,
  Settings,
  Smartphone,
  ThumbsUp,
  Trending,
  UserCheck,
  Wifi,
  Zap as ZapIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const statsCards = [
  {
    title: "总粉丝数",
    value: "2.34M",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    description: "跨平台粉丝总数统计",
  },
  {
    title: "总播放量",
    value: "15.7M",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Play,
    description: "所有平台视频播放量",
  },
  {
    title: "互动率",
    value: "4.2%",
    change: "-1.3%",
    changeType: "negative" as const,
    icon: Heart,
    description: "平均互动参与率",
  },
  {
    title: "活跃账号",
    value: "156",
    change: "+23",
    changeType: "positive" as const,
    icon: Eye,
    description: "当前管理的活跃账号数",
  },
];

const creatorTools = [
  {
    title: "文案改写",
    description: "AI智能改写，提升内容质量和原创性，支持批量处理",
    icon: RotateCcw,
    href: "/creator-tools/rewrite",
    popular: true,
    features: ["AI智能改写", "批量处理", "原创度检测", "多种风格"],
  },
  {
    title: "标题生成",
    description: "根据内容自动生成吸引人的标题，提高点击率",
    icon: Type,
    href: "/creator-tools/title-generator",
    popular: true,
    features: ["智能生成", "A/B测试", "热点融合", "平台优化"],
  },
  {
    title: "拍摄脚本生成",
    description: "智能生成视频拍摄脚本，提供完整的拍摄方案",
    icon: FileText,
    href: "/creator-tools/shooting-script",
    popular: false,
    features: ["脚本生成", "分镜头", "台词对话", "拍摄指导"],
  },
  {
    title: "AI视频生成",
    description: "使用AI技术生成原创视频内容，创新创作方式",
    icon: Zap,
    href: "/creator-tools/ai-video",
    popular: false,
    badge: "NEW",
    features: ["AI生成", "模板库", "素材管理", "一键发布"],
  },
  {
    title: "封面图制作",
    description: "AI驱动的封面图设计工具，快速生成吸引眼球的封面",
    icon: Image,
    href: "/creator-tools/image-recreation",
    popular: true,
    features: ["AI设计", "模板库", "文字添加", "风格转换"],
  },
  {
    title: "违禁词查询",
    description: "实时检测内容中的违禁词汇，确保内容合规",
    icon: Shield,
    href: "/creator-tools/forbidden-words",
    popular: false,
    features: ["实时检测", "多平台规则", "自动替换", "风险评估"],
  },
  {
    title: "视频下载",
    description: "快速下载各平台视频内容，支持批量下载",
    icon: Download,
    href: "/creator-tools/video-download",
    popular: true,
    features: ["多平台支持", "高清下载", "批量处理", "格式转换"],
  },
  {
    title: "图文提取",
    description: "从视频中提取图片和文字信息，便于二次创作",
    icon: FileText,
    href: "/creator-tools/content-extract",
    popular: false,
    features: ["智能提取", "OCR识别", "自动分类", "格式导出"],
  },
];

const dataCollectionTools = [
  {
    title: "账号互动数据采集",
    description: "深度采集账号互动数据，分析用户行为模式",
    icon: Users,
    features: ["实时采集", "数据清洗", "行为分析", "报告生成"],
  },
  {
    title: "热门话题采集",
    description: "实时抓取各平台热门话题，把握流量风口",
    icon: Hash,
    features: ["热点监控", "趋势分析", "关键词挖掘", "竞品分析"],
  },
  {
    title: "评论情感分析",
    description: "智能分析评论情感倾向，了解用户反馈",
    icon: MessageCircle,
    features: ["情感识别", "关键词提取", "舆情监控", "预警机制"],
  },
  {
    title: "粉丝画像分析",
    description: "深度分析粉丝群体特征，精准定位目标用户",
    icon: Target,
    features: ["用户画像", "兴趣分析", "地域分布", "活跃时段"],
  },
];

const hotRankings = [
  {
    title: "抖音热门账号榜",
    description: "实时更新的抖音热门账号排行榜",
    icon: Award,
    count: "500+",
  },
  {
    title: "TikTok热门产品",
    description: "海外市场热门产品实时追踪",
    icon: Gift,
    count: "1000+",
  },
  {
    title: "热门音乐榜单",
    description: "各平台热门背景音乐追踪",
    icon: Music,
    count: "200+",
  },
  {
    title: "创意模式排行",
    description: "创新内容形式和表现方式",
    icon: Camera,
    count: "300+",
  },
];

const kolAnalysisFeatures = [
  {
    title: "KOL筛选系统",
    description: "多维度筛选优质KOL，找到最适合的合作伙伴",
    icon: UserCheck,
    metrics: ["粉丝质量", "互动率", "内容质量", "商业价值"],
  },
  {
    title: "投放效果预测",
    description: "AI预测投放效果，优化营销策略",
    icon: TrendingUp,
    metrics: ["预期曝光", "转化率", "ROI预测", "风险评估"],
  },
  {
    title: "竞���KOL分析",
    description: "分析竞品的KOL合作策略",
    icon: BarChart3,
    metrics: ["合作频次", "投放成本", "效果对比", "策略洞察"],
  },
];

const platformData = [
  {
    platform: "抖音",
    emoji: "🎤",
    accounts: 234,
    videos: 1205,
    engagement: 4.2,
    growth: "+15.3%",
  },
  {
    platform: "TikTok",
    emoji: "🎵",
    accounts: 156,
    videos: 892,
    engagement: 3.8,
    growth: "+22.1%",
  },
  {
    platform: "小红书",
    emoji: "📖",
    accounts: 89,
    videos: 456,
    engagement: 5.1,
    growth: "+8.7%",
  },
  {
    platform: "B站",
    emoji: "📺",
    accounts: 67,
    videos: 234,
    engagement: 3.2,
    growth: "+12.4%",
  },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <DashboardLayout
      title="TikHub 社交媒体管理平台"
      subtitle="全平台社交媒体内容创作、数据分析、运营管理一体化解决方案"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Download className="mr-2 h-3.5 w-3.5" />
            导出报告
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <Zap className="mr-2 h-3.5 w-3.5" />
            开始创作
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Hero Section with Search */}
        <Card className="border border-border bg-gradient-to-r from-background to-muted/30">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">智能化社交媒体管理平台</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              支持抖音、TikTok、小红书、B站、公众号等主流平台，提供内容创作、数据分析、运营管理全方位服务
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜索功能、工具、教程..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="border border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <div className="flex items-center">
                      {stat.changeType === "positive" ? (
                        <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          stat.changeType === "positive"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Feature Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="creator">创作工具</TabsTrigger>
            <TabsTrigger value="data">数据分析</TabsTrigger>
            <TabsTrigger value="trends">热点榜单</TabsTrigger>
            <TabsTrigger value="kol">KOL管理</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Platform Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">平台数据概览</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platformData.map((platform) => (
                    <div
                      key={platform.platform}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-foreground" />
                        <span className="text-base">{platform.emoji}</span>
                        <div>
                          <p className="font-medium text-sm">
                            {platform.platform}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {platform.accounts}个账号 · {platform.videos}个视频
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {platform.engagement}%
                        </p>
                        <p className="text-xs text-green-600">
                          {platform.growth}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">功能使用统计</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI内容生成</span>
                      <span className="text-sm font-medium">2,456次</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">数据采集</span>
                      <span className="text-sm font-medium">1,234次</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">热点分析</span>
                      <span className="text-sm font-medium">856次</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">KOL分析</span>
                      <span className="text-sm font-medium">645次</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="creator" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-base">
                  <Wand2 className="mr-2 h-4 w-4" />
                  创作者工具 - AI驱动的内容创作助手
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {creatorTools.map((tool) => (
                    <Link key={tool.title} to={tool.href}>
                      <Card className="hover:bg-muted/50 transition-colors duration-200 cursor-pointer border border-border h-full">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="p-2 rounded-md bg-foreground text-background">
                              <tool.icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex gap-1">
                              {tool.badge && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs h-5 brand-accent"
                                >
                                  {tool.badge}
                                </Badge>
                              )}
                              {tool.popular && (
                                <Badge
                                  variant="outline"
                                  className="text-xs h-5"
                                >
                                  <Star className="mr-1 h-2 w-2" />
                                  热门
                                </Badge>
                              )}
                            </div>
                          </div>
                          <h3 className="font-medium text-sm mb-2">
                            {tool.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                            {tool.description}
                          </p>
                          <div className="space-y-1">
                            {tool.features.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center text-xs text-muted-foreground"
                              >
                                <div className="w-1 h-1 rounded-full bg-muted-foreground mr-2" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-base">
                  <Database className="mr-2 h-4 w-4" />
                  数据采集与分析 - 深度洞察用户行为
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataCollectionTools.map((tool) => (
                    <Card
                      key={tool.title}
                      className="border border-border hover:bg-muted/30 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-md bg-foreground text-background">
                            <tool.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm mb-1">
                              {tool.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-3">
                              {tool.description}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {tool.features.map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-center text-xs text-muted-foreground"
                                >
                                  <div className="w-1 h-1 rounded-full bg-brand-accent mr-2" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-base">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  热点榜单 - 实时追踪行业趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {hotRankings.map((ranking) => (
                    <Card
                      key={ranking.title}
                      className="border border-border hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <CardContent className="p-4 text-center">
                        <div className="p-3 rounded-lg bg-muted mx-auto w-fit mb-3">
                          <ranking.icon className="h-5 w-5 text-foreground" />
                        </div>
                        <h3 className="font-medium text-sm mb-2">
                          {ranking.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {ranking.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {ranking.count} 数据
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kol" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-base">
                  <Users className="mr-2 h-4 w-4" />
                  KOL分析与管理 - 精准匹配营销资源
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {kolAnalysisFeatures.map((feature) => (
                    <Card
                      key={feature.title}
                      className="border border-border hover:bg-muted/30 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 rounded-md bg-foreground text-background">
                            <feature.icon className="h-4 w-4" />
                          </div>
                          <h3 className="font-medium text-sm">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {feature.description}
                        </p>
                        <div className="space-y-2">
                          {feature.metrics.map((metric, index) => (
                            <div
                              key={index}
                              className="flex items-center text-xs"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mr-2" />
                              <span className="text-muted-foreground">
                                {metric}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Access Footer */}
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
              <Link
                to="/creator-tools/ai-video"
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <ZapIcon className="h-5 w-5" />
                <span className="text-xs font-medium">AI视频生成</span>
              </Link>
              <Link
                to="/hot-rankings"
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="text-xs font-medium">热点分析</span>
              </Link>
              <Link
                to="/data-collection"
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Database className="h-5 w-5" />
                <span className="text-xs font-medium">数据采集</span>
              </Link>
              <Link
                to="/kol-analysis"
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <UserCheck className="h-5 w-5" />
                <span className="text-xs font-medium">KOL分析</span>
              </Link>
              <Link
                to="/creator-tools/video-download"
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span className="text-xs font-medium">视频下载</span>
              </Link>
              <Link
                to="/data-monitoring"
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs font-medium">数据监控</span>
              </Link>
              <Link
                to="/ads-products"
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="text-xs font-medium">广告分析</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
