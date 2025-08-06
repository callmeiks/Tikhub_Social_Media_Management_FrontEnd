import React from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  RotateCcw,
  Type,
  Shield,
  Download,
  FileText,
  Video,
  AudioLines,
  Zap,
  BarChart3,
  Image,
  Search,
  Filter,
  Star,
  Clock,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const creatorTools = [
  {
    title: "文案改写",
    description: "AI智能改写，提升内容质量和原创性",
    icon: RotateCcw,
    href: "/creator-tools/rewrite",
    color: "bg-blue-500",
    usage: "234次使用",
    popular: false,
  },
  {
    title: "违禁词查询",
    description: "实时检测内容中的违禁词汇",
    icon: Shield,
    href: "/creator-tools/forbidden-words",
    color: "bg-red-500",
    usage: "189次使用",
    popular: false,
  },
  {
    title: "视频下载",
    description: "快速下载各平台视频内容",
    icon: Download,
    href: "/creator-tools/video-download",
    color: "bg-green-500",
    usage: "567次使用",
    popular: true,
  },
  {
    title: "图文提取",
    description: "从视频中提取图片和文字信息",
    icon: FileText,
    href: "/creator-tools/content-extract",
    color: "bg-orange-500",
    usage: "123次使用",
    popular: false,
  },
  {
    title: "短视频文案",
    description: "为短视频生成创意文案内容",
    icon: Video,
    href: "/creator-tools/short-video-copy",
    color: "bg-pink-500",
    usage: "345次使用",
    popular: false,
  },
  {
    title: "音视频提取文字",
    description: "AI语音识别，提取音频中的文字",
    icon: AudioLines,
    href: "/creator-tools/audio-extract",
    color: "bg-indigo-500",
    usage: "78次使用",
    popular: false,
  },
  {
    title: "AI视频生成",
    description: "使用AI技术生成原创视频内容",
    icon: Zap,
    href: "/creator-tools/ai-video",
    color: "bg-yellow-500",
    usage: "12次使用",
    popular: false,
    badge: "NEW",
  },
  {
    title: "账号分析",
    description: "深度分析账号数据和表现指标",
    icon: BarChart3,
    href: "/creator-tools/account-analysis",
    color: "bg-cyan-500",
    usage: "289次使用",
    popular: true,
  },
  {
    title: "图片二创",
    description: "AI图片编辑和创意改造",
    icon: Image,
    href: "/creator-tools/image-recreation",
    color: "bg-teal-500",
    usage: "167次使用",
    popular: false,
  },
];

const recentUsage = [
  {
    tool: "视频下载",
    content: "@foodblogger 的热门视频",
    time: "15分钟前",
    status: "completed",
  },
  {
    tool: "违禁词查询",
    content: "批量文案检测",
    time: "1小时前",
    status: "completed",
  },
  {
    tool: "AI视频生成",
    content: "产品介绍视频",
    time: "2小时前",
    status: "processing",
  },
];

export default function CreatorTools() {
  return (
    <DashboardLayout
      title="创作者工具"
      subtitle="提供全方位的内容创作辅助工具，助力您的创作之路"
      actions={
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="搜索工具..." className="pl-10 w-64" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            筛选
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Popular Tools */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-500" />
              热门工具
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creatorTools
                .filter((tool) => tool.popular)
                .map((tool) => (
                  <Link key={tool.title} to={tool.href}>
                    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`p-2 rounded-lg ${tool.color} text-white`}
                          >
                            <tool.icon className="h-5 w-5" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            <Star className="mr-1 h-3 w-3" />
                            热门
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{tool.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {tool.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {tool.usage}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* All Tools */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>所有工具</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {creatorTools.map((tool) => (
                <Link key={tool.title} to={tool.href}>
                  <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 h-full">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`p-2 rounded-lg ${tool.color} text-white`}
                        >
                          <tool.icon className="h-4 w-4" />
                        </div>
                        {tool.badge && (
                          <Badge
                            variant="default"
                            className="text-xs bg-brand-purple"
                          >
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-1">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex-1 mb-2">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {tool.usage}
                        </span>
                        {tool.popular && (
                          <Badge variant="outline" className="text-xs">
                            <Star className="mr-1 h-2 w-2" />
                            热门
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Usage */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                最近使用
              </span>
              <Button variant="ghost" size="sm">
                查看全部
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsage.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === "completed"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{item.tool}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.content}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
