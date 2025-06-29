import React from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";
import { Link } from "react-router-dom";

const statsCards = [
  {
    title: "总粉丝数",
    value: "2.34M",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "总播放量",
    value: "15.7M",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Play,
    color: "text-purple-600",
  },
  {
    title: "互动率",
    value: "4.2%",
    change: "-1.3%",
    changeType: "negative" as const,
    icon: Heart,
    color: "text-pink-600",
  },
  {
    title: "视频数量",
    value: "1,284",
    change: "+23",
    changeType: "positive" as const,
    icon: Eye,
    color: "text-green-600",
  },
];

const quickActions = [
  {
    title: "AI视频生成",
    description: "使用AI快速生成创意视频内容",
    icon: Zap,
    badge: "NEW",
    href: "/creator-tools/ai-video",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    title: "热点分析",
    description: "实时监控各平台热点趋势",
    icon: TrendingUp,
    href: "/hot-rankings",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
  {
    title: "账号分析",
    description: "深度分析账号表现和增长潜力",
    icon: BarChart3,
    href: "/creator-tools/account-analysis",
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
  },
  {
    title: "KOL搜索",
    description: "找到最适合的KOL合作伙伴",
    icon: Target,
    href: "/kol-analysis",
    color: "bg-gradient-to-r from-orange-500 to-red-500",
  },
];

const recentActivity = [
  {
    action: "视频下载",
    target: "@user123 的热门视频",
    time: "2分钟前",
    status: "completed",
  },
  {
    action: "数据采集",
    target: "抖音热门话题 #美食探店",
    time: "15分钟前",
    status: "processing",
  },
  {
    action: "账号分析",
    target: "@foodblogger_zh",
    time: "1小时前",
    status: "completed",
  },
  {
    action: "违禁词检测",
    target: "批量文案检测 (125条)",
    time: "2小时前",
    status: "completed",
  },
];

const platformData = [
  {
    platform: "抖音",
    emoji: "🎤",
    accounts: 234,
    videos: 1205,
    engagement: 4.2,
    color: "bg-red-500",
  },
  {
    platform: "TikTok",
    emoji: "🎵",
    accounts: 156,
    videos: 892,
    engagement: 3.8,
    color: "bg-black",
  },
  {
    platform: "小红书",
    emoji: "📖",
    accounts: 89,
    videos: 456,
    engagement: 5.1,
    color: "bg-red-400",
  },
  {
    platform: "B站",
    emoji: "📺",
    accounts: 67,
    videos: 234,
    engagement: 3.2,
    color: "bg-blue-500",
  },
];

export default function Index() {
  return (
    <DashboardLayout
      title="工作台"
      subtitle="欢迎使用 TikHub 社交媒体管理平台"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
          <Button size="sm" className="brand-gradient">
            <Zap className="mr-2 h-4 w-4" />
            新建任务
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
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
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-base">
              <Zap className="mr-2 h-4 w-4" />
              快捷操作
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.href}>
                  <Card className="hover:bg-muted/50 transition-colors duration-200 cursor-pointer border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-md bg-foreground text-background">
                          <action.icon className="h-3.5 w-3.5" />
                        </div>
                        {action.badge && (
                          <Badge
                            variant="secondary"
                            className="text-xs h-5 brand-accent"
                          >
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm mb-1">
                        {action.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Platform Overview */}
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
                      <p className="font-medium text-sm">{platform.platform}</p>
                      <p className="text-xs text-muted-foreground">
                        {platform.accounts}个账号 · {platform.videos}个视频
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {platform.engagement}%
                    </p>
                    <p className="text-xs text-muted-foreground">互动率</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <span>最近活动</span>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  查看全部
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 py-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-2 ${
                      activity.status === "completed"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.target}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <Card className="border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">数据趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-md border border-dashed border-border">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  数据图表将在这里显示
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
