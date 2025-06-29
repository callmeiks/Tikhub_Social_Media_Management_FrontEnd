import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Clock,
  Target,
  BarChart3,
  Zap,
  Search,
  Settings,
} from "lucide-react";

const supportedPlatforms = [
  {
    id: "xiaohongshu",
    name: "小红书",
    emoji: "📖",
    color: "bg-red-500",
    active: true,
  },
  { id: "douyin", name: "抖音", emoji: "🎤", color: "bg-black", active: false },
  {
    id: "tiktok",
    name: "TikTok",
    emoji: "🎵",
    color: "bg-black",
    active: false,
  },
  {
    id: "bilibili",
    name: "B站",
    emoji: "📺",
    color: "bg-blue-500",
    active: false,
  },
];

const comparisonMetrics = [
  { key: "followers", name: "粉丝数", icon: Users },
  { key: "views", name: "播放量", icon: Eye },
  { key: "likes", name: "点赞数", icon: Heart },
  { key: "comments", name: "评论数", icon: MessageCircle },
  { key: "shares", name: "分享数", icon: Share2 },
  { key: "engagement", name: "互动率", icon: TrendingUp },
];

const mockAccountData = {
  account1: {
    name: "美食博主小王",
    avatar: "👩‍🍳",
    followers: "128.5K",
    views: "2.3M",
    likes: "456.7K",
    comments: "12.3K",
    shares: "8.9K",
    engagement: "4.2%",
    recentPosts: 15,
    growthRate: "+12.5%",
  },
  account2: {
    name: "料理达人李师傅",
    avatar: "👨‍🍳",
    followers: "95.2K",
    views: "1.8M",
    likes: "312.4K",
    comments: "9.7K",
    shares: "6.1K",
    engagement: "3.8%",
    recentPosts: 12,
    growthRate: "+8.3%",
  },
};

export default function AccountPK() {
  const [selectedPlatform, setSelectedPlatform] = useState("xiaohongshu");
  const [account1, setAccount1] = useState("");
  const [account2, setAccount2] = useState("");
  const [isComparing, setIsComparing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleCompare = () => {
    if (!account1.trim() || !account2.trim()) {
      alert("请输入两个账号进行对比");
      return;
    }
    setIsComparing(true);
    setTimeout(() => {
      setShowResults(true);
      setIsComparing(false);
    }, 3000);
  };

  const getWinner = (metric: string) => {
    const data1 = parseFloat(
      mockAccountData.account1[metric as keyof typeof mockAccountData.account1]
        .toString()
        .replace(/[^\d.]/g, ""),
    );
    const data2 = parseFloat(
      mockAccountData.account2[metric as keyof typeof mockAccountData.account2]
        .toString()
        .replace(/[^\d.]/g, ""),
    );
    return data1 > data2 ? 1 : data1 < data2 ? 2 : 0;
  };

  return (
    <DashboardLayout
      title="账号PK"
      subtitle="对比分析不同账号的数据表现，找出优势和差距"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <BarChart3 className="mr-2 h-3.5 w-3.5" />
            对比报告
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Platform Selection */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Target className="mr-2 h-4 w-4" />
              支持平台
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {supportedPlatforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant={
                    selectedPlatform === platform.id ? "default" : "outline"
                  }
                  size="sm"
                  className={`h-8 ${
                    selectedPlatform === platform.id
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  <span className="mr-1">{platform.emoji}</span>
                  {platform.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* VS Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Account 1 */}
          <div className="lg:col-span-3">
            <Card className="border border-border h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-center">账号A</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="请输入账号链接或用户名"
                    value={account1}
                    onChange={(e) => setAccount1(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center justify-center py-8 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50/30">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      点击添加账号或输入账号信息
                    </p>
                  </div>
                </div>

                {showResults && (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl">
                          {mockAccountData.account1.avatar}
                        </span>
                      </div>
                      <h3 className="font-medium text-sm">
                        {mockAccountData.account1.name}
                      </h3>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {mockAccountData.account1.growthRate}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* VS Section */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                <span className="text-xl font-bold text-muted-foreground">
                  VS
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                点击添加需要对比的两个账号
              </p>
            </div>
          </div>

          {/* Account 2 */}
          <div className="lg:col-span-3">
            <Card className="border border-border h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-center">账号B</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="请输入账号链接或用户名"
                    value={account2}
                    onChange={(e) => setAccount2(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center justify-center py-8 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50/30">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                      <Plus className="h-8 w-8 text-orange-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      点击添加账号或输入账号信息
                    </p>
                  </div>
                </div>

                {showResults && (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl">
                          {mockAccountData.account2.avatar}
                        </span>
                      </div>
                      <h3 className="font-medium text-sm">
                        {mockAccountData.account2.name}
                      </h3>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {mockAccountData.account2.growthRate}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparison Results */}
        {showResults && (
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                对比结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparisonMetrics.map((metric) => {
                  const winner = getWinner(metric.key);
                  return (
                    <div
                      key={metric.key}
                      className="grid grid-cols-7 gap-4 items-center"
                    >
                      {/* Account 1 Data */}
                      <div
                        className={`col-span-3 text-right ${winner === 1 ? "text-green-600 font-semibold" : ""}`}
                      >
                        {
                          mockAccountData.account1[
                            metric.key as keyof typeof mockAccountData.account1
                          ]
                        }
                      </div>

                      {/* Metric Name */}
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <metric.icon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {metric.name}
                          </span>
                        </div>
                      </div>

                      {/* Account 2 Data */}
                      <div
                        className={`col-span-3 text-left ${winner === 2 ? "text-green-600 font-semibold" : ""}`}
                      >
                        {
                          mockAccountData.account2[
                            metric.key as keyof typeof mockAccountData.account2
                          ]
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Section */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <Clock className="inline h-4 w-4 mr-1" />
            对比历史
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-xs">
              今日剩余 5 次
            </Badge>
            <Button
              onClick={handleCompare}
              disabled={!account1.trim() || !account2.trim() || isComparing}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isComparing ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-spin" />
                  对比中...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  开始对比
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Comparison History */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              对比历史
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  account1: "美食博主A",
                  account2: "美食博主B",
                  platform: "小红书",
                  time: "2小时前",
                  winner: "账号A",
                },
                {
                  account1: "旅行达人C",
                  account2: "旅行达人D",
                  platform: "抖音",
                  time: "1天前",
                  winner: "账号B",
                },
                {
                  account1: "时尚博主E",
                  account2: "时尚博主F",
                  platform: "小红书",
                  time: "3天前",
                  winner: "账号A",
                },
              ].map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-sm">
                      <span className="font-medium">{record.account1}</span>
                      <span className="text-muted-foreground"> VS </span>
                      <span className="font-medium">{record.account2}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {record.platform}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="text-green-600 font-medium">
                      胜出: {record.winner}
                    </span>
                    <span>•</span>
                    <span>{record.time}</span>
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
