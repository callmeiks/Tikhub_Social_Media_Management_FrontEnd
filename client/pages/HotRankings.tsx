import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Music,
  Hash,
  Users,
  RefreshCw,
} from "lucide-react";

// 平台相关的榜单类型定义
const platformRankings = {
  douyin: [
    { title: "抖音热门账号", icon: Users, count: "50+" },
    { title: "抖音上升热点榜", icon: TrendingUp, count: "100+" },
    { title: "抖音同城热点榜", icon: TrendingUp, count: "30+" },
    { title: "抖音挑战热点榜", icon: Hash, count: "20+" },
    { title: "抖音视频热榜", icon: Play, count: "50+" },
    { title: "抖音搜索热榜", icon: TrendingUp, count: "50+" },
    { title: "抖音热度飙升搜索榜", icon: TrendingUp, count: "30+" },
    { title: "抖音热度飙升话题榜", icon: Hash, count: "40+" },
  ],
  tiktok: [
    { title: "TikTok热门产品", icon: TrendingUp, count: "100+" },
    { title: "TikTok热门标签", icon: Hash, count: "200+" },
    { title: "TikTok创意模式排行榜", icon: Play, count: "50+" },
    { title: "TikTok热门音乐", icon: Music, count: "150+" },
    { title: "TikTok创作者排行", icon: Users, count: "100+" },
  ],
  kuaishou: [
    { title: "快手热门视频", icon: Play, count: "50+" },
    { title: "快手热门话题", icon: Hash, count: "30+" },
    { title: "快手热门音乐", icon: Music, count: "40+" },
    { title: "快手新星榜", icon: TrendingUp, count: "20+" },
  ],
  xiaohongshu: [
    { title: "小红书热门笔记", icon: TrendingUp, count: "100+" },
    { title: "小红书热门话题", icon: Hash, count: "50+" },
    { title: "小红书博主排行", icon: Users, count: "30+" },
    { title: "小红书种草榜", icon: Heart, count: "40+" },
  ],
  pipixia: [
    { title: "皮皮虾热门视频", icon: Play, count: "30+" },
    { title: "皮皮虾热门话��", icon: Hash, count: "20+" },
    { title: "皮皮虾搞笑榜", icon: MessageCircle, count: "25+" },
  ],
  x: [
    { title: "X热门话题", icon: Hash, count: "200+" },
    { title: "X趋势内容", icon: TrendingUp, count: "150+" },
    { title: "X热门用户", icon: Users, count: "100+" },
    { title: "X病毒传播榜", icon: Share2, count: "50+" },
  ],
  youtube: [
    { title: "YouTube热门视频", icon: Play, count: "500+" },
    { title: "YouTube趋势内容", icon: TrendingUp, count: "300+" },
    { title: "YouTube热门频道", icon: Users, count: "200+" },
    { title: "YouTube热门音乐", icon: Music, count: "100+" },
  ],
};

// 示例排行榜数据
const mockRankingData = [
  {
    rank: 1,
    title: "AI换脸技术教程",
    author: "@科技小达人",
    views: "2.3M",
    likes: "128K",
    growth: "+45%",
    trend: "up",
  },
  {
    rank: 2,
    title: "今日穿搭分享",
    author: "@时尚博主小美",
    views: "1.8M",
    likes: "96K",
    growth: "+32%",
    trend: "up",
  },
  {
    rank: 3,
    title: "家常菜制作教程",
    author: "@美食家老王",
    views: "1.5M",
    likes: "78K",
    growth: "+28%",
    trend: "up",
  },
  {
    rank: 4,
    title: "减肥健身��记",
    author: "@健身小姐姐",
    views: "1.2M",
    likes: "65K",
    growth: "+25%",
    trend: "up",
  },
  {
    rank: 5,
    title: "宠物搞笑日常",
    author: "@萌宠���园",
    views: "980K",
    likes: "52K",
    growth: "+18%",
    trend: "stable",
  },
];

export default function HotRankings() {
  const [activeTab, setActiveTab] = useState("douyin");
  const [selectedRanking, setSelectedRanking] = useState<string>("");
  const navigate = useNavigate();

  // Handle URL hash navigation
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && platformRankings[hash as keyof typeof platformRankings]) {
      setActiveTab(hash);
    }
  }, []);

  const handleRankingClick = (ranking: string, platform: string) => {
    if (platform === "douyin") {
      navigate("/hot-rankings/douyin");
    } else if (platform === "tiktok") {
      navigate("/hot-rankings/tiktok");
    } else if (platform === "kuaishou") {
      navigate("/hot-rankings/kuaishou");
    } else {
      setSelectedRanking(ranking);
    }
  };

  return (
    <DashboardLayout
      title="热点榜单"
      subtitle="实时追踪各平台热门内容和趋势"
      actions={
        <Button className="brand-accent">
          <RefreshCw className="mr-2 h-4 w-4" />
          刷新数据
        </Button>
      }
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="douyin" className="text-sm">
              抖音热度榜单
            </TabsTrigger>
            <TabsTrigger value="tiktok" className="text-sm">
              TikTok热度榜单
            </TabsTrigger>
            <TabsTrigger value="kuaishou" className="text-sm">
              快手热门榜单
            </TabsTrigger>
            <TabsTrigger value="xiaohongshu" className="text-sm">
              小红书热门榜单
            </TabsTrigger>
            <TabsTrigger value="pipixia" className="text-sm">
              皮皮虾热门榜单
            </TabsTrigger>
            <TabsTrigger value="x" className="text-sm">
              X趋势内容
            </TabsTrigger>
            <TabsTrigger value="youtube" className="text-sm">
              YouTube趋势内容
            </TabsTrigger>
          </TabsList>

          {Object.entries(platformRankings).map(([platform, rankings]) => (
            <TabsContent key={platform} value={platform} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {rankings.map((ranking, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleRankingClick(ranking.title, platform)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <ranking.icon className="h-5 w-5 text-brand-accent" />
                        <Badge variant="secondary">{ranking.count}</Badge>
                      </div>
                      <CardTitle className="text-sm font-medium">
                        {ranking.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {selectedRanking && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      {selectedRanking}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockRankingData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <Badge
                                variant={
                                  item.rank <= 3 ? "default" : "secondary"
                                }
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                              >
                                {item.rank}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.author}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{item.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{item.likes}</span>
                            </div>
                            <div
                              className={`flex items-center space-x-1 ${
                                item.trend === "up"
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              <TrendingUp className="h-4 w-4" />
                              <span>{item.growth}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
