import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  Hash,
  Users,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ArrowUpIcon,
  ArrowDownIcon,
  Music,
  Award,
  Video,
  Zap,
  ShoppingBag,
  Star,
  Globe,
  Gamepad2,
} from "lucide-react";

// 直播榜单类型
const liveRankingTypes = [
  "总榜",
  "音乐",
  "舞蹈",
  "颜值",
  "国艺",
  "相亲",
  "游戏",
  "二次元",
  "故事",
  "团博",
  "九宫格",
];

// 购物榜单类型
const shoppingRankingTypes = ["热门主播榜单", "热销商品榜单"];

// 品牌榜单类型
const brandRankingTypes = [
  "美妆",
  "服饰",
  "汽车",
  "游戏",
  "医疗健康",
  "3c数码",
  "手机",
  "家电",
  "母婴",
  "食品饮料",
];

// 快手榜单标签配置
const rankingTabs = [
  { id: "hot", name: "热榜", icon: TrendingUp },
  { id: "entertainment", name: "文娱榜", icon: Star },
  { id: "society", name: "社会榜", icon: Globe },
  { id: "useful", name: "有用榜", icon: Heart },
  { id: "challenge", name: "挑战榜", icon: Hash },
  { id: "person", name: "热搜人物榜", icon: Users },
  { id: "live", name: "直播榜单", icon: Video },
  { id: "shopping", name: "购物榜单", icon: ShoppingBag },
  { id: "brand", name: "品牌榜单", icon: Award },
];

// 模拟排行榜数据
const mockRankingData = [
  {
    rank: 1,
    change: "new",
    avatar: "/api/placeholder/40/40",
    name: "快手达人",
    handle: "@kuaishou_star",
    category: "娱乐",
    followers: "1.2M",
    likes: "89K",
    comments: "12K",
    shares: "5.6K",
    views: "567K",
    engagement: "15.8%",
    growth: "+8%",
    score: "985.2",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
  },
  {
    rank: 2,
    change: "up",
    avatar: "/api/placeholder/40/40",
    name: "生活记录者",
    handle: "@life_recorder",
    category: "生活",
    followers: "890K",
    likes: "67K",
    comments: "9.8K",
    shares: "4.2K",
    views: "445K",
    engagement: "14.2%",
    growth: "+6%",
    score: "923.7",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
  },
  {
    rank: 3,
    change: "up",
    avatar: "/api/placeholder/40/40",
    name: "音乐小天才",
    handle: "@music_talent",
    category: "音乐",
    followers: "756K",
    likes: "54K",
    comments: "7.9K",
    shares: "3.8K",
    views: "389K",
    engagement: "13.5%",
    growth: "+5%",
    score: "876.4",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
  },
  {
    rank: 4,
    change: "down",
    avatar: "/api/placeholder/40/40",
    name: "搞笑王子",
    handle: "@funny_prince",
    category: "搞笑",
    followers: "623K",
    likes: "45K",
    comments: "6.7K",
    shares: "3.1K",
    views: "334K",
    engagement: "12.8%",
    growth: "+3%",
    score: "834.9",
    trendIcon: ArrowDownIcon,
    trendColor: "text-green-500",
  },
  {
    rank: 5,
    change: "up",
    avatar: "/api/placeholder/40/40",
    name: "美食探索家",
    handle: "@food_explorer",
    category: "美食",
    followers: "589K",
    likes: "41K",
    comments: "5.9K",
    shares: "2.8K",
    views: "298K",
    engagement: "12.1%",
    growth: "+4%",
    score: "798.6",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
  },
];

interface FilterState {
  type: string;
}

export default function KuaishouRankings() {
  const [activeTab, setActiveTab] = useState("hot");
  const [filters, setFilters] = useState<FilterState>({
    type: "",
  });
  const [data, setData] = useState(mockRankingData);
  const [isLoading, setIsLoading] = useState(false);

  // 获取当前标签的过滤器配置
  const getFiltersForTab = (tabId: string) => {
    switch (tabId) {
      case "hot":
      case "entertainment":
      case "society":
      case "useful":
      case "challenge":
      case "person":
        return []; // 无filter

      case "live":
        return [
          {
            type: "select",
            key: "type",
            label: "类型",
            options: liveRankingTypes,
          },
        ];

      case "shopping":
        return [
          {
            type: "select",
            key: "type",
            label: "类型",
            options: shoppingRankingTypes,
          },
        ];

      case "brand":
        return [
          {
            type: "select",
            key: "type",
            label: "类型",
            options: brandRankingTypes,
          },
        ];

      default:
        return [];
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    console.log("导出数据", { tab: activeTab, filters, data });
  };

  const renderFilterComponent = (filter: any) => {
    const key = filter.key;

    switch (filter.type) {
      case "select":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{filter.label}</Label>
            <Select
              value={filters[key as keyof FilterState]}
              onValueChange={(value) => handleFilterChange(key, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`选择${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                {(Array.isArray(filter.options) ? filter.options : []).map(
                  (option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  const getTrendIcon = (change: string) => {
    switch (change) {
      case "up":
        return <ArrowUpIcon className="w-3 h-3 text-red-500" />;
      case "down":
        return <ArrowDownIcon className="w-3 h-3 text-green-500" />;
      case "new":
        return <Badge className="text-xs bg-red-500">新</Badge>;
      default:
        return <span className="w-3 h-3 text-gray-400">-</span>;
    }
  };

  return (
    <DashboardLayout
      title="快手热度榜单"
      subtitle="实时追踪快手平台各类热门内容和趋势数据"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出数据
          </Button>
          <Button className="brand-accent" onClick={handleSearch}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新数据
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            {rankingTabs.slice(0, 5).map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs p-2">
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsList className="grid w-full grid-cols-4 h-auto p-1 mt-2">
            {rankingTabs.slice(5).map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs p-2">
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {rankingTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              {/* 过滤器区域 */}
              {getFiltersForTab(tab.id).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <Filter className="mr-2 h-4 w-4" />
                      筛选条件 - {tab.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {getFiltersForTab(tab.id).map((filter) =>
                        renderFilterComponent(filter),
                      )}
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="outline">重置</Button>
                      <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? "搜索中..." : "搜索"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 数据表格区域 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center text-base">
                      <tab.icon className="mr-2 h-4 w-4" />
                      {tab.name}数据
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">共 {data.length} 条数据</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        导出
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-sm text-muted-foreground">
                          <th className="text-left p-2">#</th>
                          <th className="text-left p-2">创作者</th>
                          <th className="text-left p-2">分类</th>
                          <th className="text-left p-2">粉丝数</th>
                          <th className="text-left p-2">点赞数</th>
                          <th className="text-left p-2">评论数</th>
                          <th className="text-left p-2">分享数</th>
                          <th className="text-left p-2">观看量</th>
                          <th className="text-left p-2">互动率</th>
                          <th className="text-left p-2">增长率</th>
                          <th className="text-left p-2">热度值</th>
                          <th className="text-left p-2">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="p-2">
                              <div className="flex items-center space-x-1">
                                <span
                                  className={`font-medium ${index < 3 ? "text-yellow-600" : ""}`}
                                >
                                  {item.rank}
                                </span>
                                {getTrendIcon(item.change)}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={item.avatar} />
                                  <AvatarFallback>
                                    {item.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.handle}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            </td>
                            <td className="p-2 text-sm">{item.followers}</td>
                            <td className="p-2 text-sm">{item.likes}</td>
                            <td className="p-2 text-sm">{item.comments}</td>
                            <td className="p-2 text-sm">{item.shares}</td>
                            <td className="p-2 text-sm">{item.views}</td>
                            <td className="p-2 text-sm">{item.engagement}</td>
                            <td className="p-2 text-sm">{item.growth}</td>
                            <td className="p-2 text-sm font-medium text-orange-600">
                              {item.score}
                            </td>
                            <td className="p-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs"
                              >
                                添加监控
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
