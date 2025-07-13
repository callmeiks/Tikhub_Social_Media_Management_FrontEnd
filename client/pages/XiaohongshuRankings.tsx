import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Hash,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ArrowUpIcon,
  ArrowDownIcon,
  Bookmark,
} from "lucide-react";

// 模拟小红书热门话题数据
const mockTopicsData = [
  {
    rank: 1,
    change: "new",
    topic: "#秋日穿搭分享",
    description: "分享秋季时尚穿搭灵感，展现个人风格",
    avatar: "/api/placeholder/40/40",
    category: "时尚",
    posts: "12.8万",
    views: "2.1亿",
    interactions: "156万",
    hotValue: "98.5",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["穿搭", "时尚", "秋装"],
  },
  {
    rank: 2,
    change: "up",
    topic: "#美食制作教程",
    description: "简单易学的家常菜制作方法",
    avatar: "/api/placeholder/40/40",
    category: "美食",
    posts: "9.6万",
    views: "1.8亿",
    interactions: "134万",
    hotValue: "95.2",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["美食", "教程", "家常菜"],
  },
  {
    rank: 3,
    change: "up",
    topic: "#护肤心得分享",
    description: "分享护肤经验和产品测评",
    avatar: "/api/placeholder/40/40",
    category: "美妆",
    posts: "8.3万",
    views: "1.5亿",
    interactions: "118万",
    hotValue: "92.7",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["护肤", "美妆", "测评"],
  },
  {
    rank: 4,
    change: "down",
    topic: "#旅行攻略推荐",
    description: "精选热门旅游目的地攻略",
    avatar: "/api/placeholder/40/40",
    category: "旅行",
    posts: "7.1万",
    views: "1.3亿",
    interactions: "95万",
    hotValue: "89.4",
    trendIcon: ArrowDownIcon,
    trendColor: "text-green-500",
    tags: ["旅行", "攻略", "景点"],
  },
  {
    rank: 5,
    change: "up",
    topic: "#家居装饰灵感",
    description: "创意家居装饰和布置技巧",
    avatar: "/api/placeholder/40/40",
    category: "家居",
    posts: "6.8万",
    views: "1.1亿",
    interactions: "87万",
    hotValue: "86.8",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["家居", "装饰", "布置"],
  },
  {
    rank: 6,
    change: "stable",
    topic: "#健身打卡日记",
    description: "健身运动心得和成果分享",
    avatar: "/api/placeholder/40/40",
    category: "运动",
    posts: "5.9万",
    views: "9800万",
    interactions: "72万",
    hotValue: "84.1",
    trendIcon: null,
    trendColor: "text-gray-500",
    tags: ["健身", "运动", "打卡"],
  },
  {
    rank: 7,
    change: "up",
    topic: "#读书笔记分享",
    description: "好书推���和读书心得交流",
    avatar: "/api/placeholder/40/40",
    category: "读书",
    posts: "4.7万",
    views: "8600万",
    interactions: "63万",
    hotValue: "81.5",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["读书", "笔记", "推荐"],
  },
  {
    rank: 8,
    change: "down",
    topic: "#职场经验分享",
    description: "职场技能和经验心得分享",
    avatar: "/api/placeholder/40/40",
    category: "职场",
    posts: "4.2万",
    views: "7800万",
    interactions: "58万",
    hotValue: "78.9",
    trendIcon: ArrowDownIcon,
    trendColor: "text-green-500",
    tags: ["职场", "经验", "技能"],
  },
];

export default function XiaohongshuRankings() {
  const [data, setData] = useState(mockTopicsData);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    console.log("导出小红书热门话题数据", data);
  };

  const getTrendIcon = (change: string) => {
    switch (change) {
      case "up":
        return <ArrowUpIcon className="w-3 h-3 text-red-500" />;
      case "down":
        return <ArrowDownIcon className="w-3 h-3 text-green-500" />;
      case "new":
        return <Badge className="text-xs bg-red-500">新</Badge>;
      case "stable":
        return <span className="w-3 h-3 text-gray-400">-</span>;
      default:
        return <span className="w-3 h-3 text-gray-400">-</span>;
    }
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      时尚: "bg-pink-100 text-pink-800",
      美食: "bg-orange-100 text-orange-800",
      美妆: "bg-purple-100 text-purple-800",
      旅行: "bg-blue-100 text-blue-800",
      家居: "bg-green-100 text-green-800",
      运动: "bg-red-100 text-red-800",
      读书: "bg-indigo-100 text-indigo-800",
      职场: "bg-gray-100 text-gray-800",
    };
    return colorMap[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout
      title="小红书热门话题"
      subtitle="实时追踪小红书平台热门话题和讨论趋势"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出数据
          </Button>
          <Button className="brand-accent" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新数据
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 热门话题榜单 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-base">
                <Hash className="mr-2 h-4 w-4" />
                热门话题榜单
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">共 {data.length} 个话题</Badge>
                <Button size="sm" variant="outline">
                  <Download className="w-3 h-3 mr-1" />
                  导出
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* 排名和趋势 */}
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      <Badge
                        variant={item.rank <= 3 ? "default" : "secondary"}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        {item.rank}
                      </Badge>
                      {getTrendIcon(item.change)}
                    </div>

                    {/* 话题信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-lg text-pink-600">
                          {item.topic}
                        </h3>
                        <Badge
                          className={`text-xs ${getCategoryColor(item.category)}`}
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 数据指标 */}
                    <div className="flex-shrink-0 grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span className="font-medium">{item.posts}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">笔记数</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span className="font-medium">{item.views}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">浏览量</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span className="font-medium">
                            {item.interactions}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">互动数</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span className="font-medium text-orange-600">
                            {item.hotValue}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">热度值</p>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex-shrink-0">
                      <Button size="sm" variant="ghost" className="text-xs">
                        <Bookmark className="w-3 h-3 mr-1" />
                        关注话题
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 话题趋势统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总话题数</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Hash className="h-8 w-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">上升话题</p>
                  <p className="text-2xl font-bold text-red-600">5</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">下降话题</p>
                  <p className="text-2xl font-bold text-green-600">2</p>
                </div>
                <TrendingDown className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">新增话题</p>
                  <p className="text-2xl font-bold text-orange-600">1</p>
                </div>
                <Badge className="h-8 w-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
                  新
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
