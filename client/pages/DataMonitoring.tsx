import React from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Monitor,
  UserCheck,
  BarChart3,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Settings,
} from "lucide-react";

const platformMonitoring = [
  {
    id: "douyin",
    name: "抖音监控",
    emoji: "🎤",
    description: "监控抖音达人和作品数据变化",
    href: "/data-monitoring/douyin",
    color: "bg-black text-white",
    stats: { influencers: 45, content: 128 },
  },
  {
    id: "tiktok",
    name: "TikTok监控",
    emoji: "🎵",
    description: "监控TikTok创作者和视频数据",
    href: "/data-monitoring/tiktok",
    color: "bg-black text-white",
    stats: { influencers: 32, content: 89 },
  },
  {
    id: "xiaohongshu",
    name: "小红书监控",
    emoji: "📖",
    description: "监控小红书博主和笔记数据",
    href: "/data-monitoring/xiaohongshu",
    color: "bg-red-500 text-white",
    stats: { influencers: 67, content: 203 },
  },
  {
    id: "kuaishou",
    name: "快手监控",
    emoji: "⚡",
    description: "监控快手达人和作品数据",
    href: "/data-monitoring/kuaishou",
    color: "bg-orange-500 text-white",
    stats: { influencers: 23, content: 76 },
  },
  {
    id: "instagram",
    name: "Instagram监控",
    emoji: "📷",
    description: "监控Instagram用户和内容数据",
    href: "/data-monitoring/instagram",
    color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    stats: { influencers: 18, content: 54 },
  },
  {
    id: "x",
    name: "X监控",
    emoji: "🐦",
    description: "监控X(Twitter)用户和推文数据",
    href: "/data-monitoring/x",
    color: "bg-black text-white",
    stats: { influencers: 15, content: 42 },
  },
];

const otherTools = [
  {
    title: "自定义监控榜单",
    description: "创建和管理自定义的监控榜单",
    href: "/data-monitoring/custom-rankings",
    icon: BarChart3,
    badge: "工具",
  },
  {
    title: "当前任务管理",
    description: "管理所有正在进行的监控任务",
    href: "/data-monitoring/task-management",
    icon: Settings,
    badge: "管理",
  },
];

export default function DataMonitoring() {
  const totalInfluencers = platformMonitoring.reduce(
    (sum, platform) => sum + platform.stats.influencers,
    0,
  );
  const totalContent = platformMonitoring.reduce(
    (sum, platform) => sum + platform.stats.content,
    0,
  );

  return (
    <DashboardLayout
      title="数据监控"
      subtitle="实时监控各平台达人和作品数据变化"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            查看报告
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总监控达人</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInfluencers}</div>
              <p className="text-xs text-muted-foreground">+12% 与上月相比</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总监控作品</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContent}</div>
              <p className="text-xs text-muted-foreground">+8% 与上月相比</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">活跃平台</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {platformMonitoring.length}
              </div>
              <p className="text-xs text-muted-foreground">全部平台正常运行</p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Monitoring */}
        <div>
          <h2 className="text-lg font-semibold mb-4">平台监控</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformMonitoring.map((platform) => (
              <Card
                key={platform.id}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-lg`}
                      >
                        {platform.emoji}
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {platform.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {platform.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {platform.stats.influencers}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        达人监控
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {platform.stats.content}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        作品监控
                      </div>
                    </div>
                  </div>
                  <Link to={platform.href} className="block">
                    <Button className="w-full" variant="outline">
                      进入监控
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Other Tools */}
        <div>
          <h2 className="text-lg font-semibold mb-4">监控工具</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherTools.map((tool, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <tool.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {tool.title}
                          <Badge variant="secondary" className="text-xs">
                            {tool.badge}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Link to={tool.href}>
                    <Button className="w-full" variant="outline">
                      前往工具
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
