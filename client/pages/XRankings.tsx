import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ArrowUpIcon,
  ArrowDownIcon,
  Repeat2,
  BarChart3,
} from "lucide-react";

// 国家列表
const countries = [
  { value: "UnitedStates", label: "United States" },
  { value: "China", label: "China" },
  { value: "India", label: "India" },
  { value: "Japan", label: "Japan" },
  { value: "Russia", label: "Russia" },
  { value: "Germany", label: "Germany" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Brazil", label: "Brazil" },
  { value: "France", label: "France" },
  { value: "UnitedKingdom", label: "United Kingdom" },
  { value: "Turkey", label: "Turkey" },
  { value: "Italy", label: "Italy" },
  { value: "Mexico", label: "Mexico" },
  { value: "SouthKorea", label: "South Korea" },
  { value: "Canada", label: "Canada" },
  { value: "Spain", label: "Spain" },
  { value: "SaudiArabia", label: "Saudi Arabia" },
  { value: "Egypt", label: "Egypt" },
  { value: "Australia", label: "Australia" },
  { value: "Poland", label: "Poland" },
  { value: "Iran", label: "Iran" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "Vietnam", label: "Vietnam" },
  { value: "Nigeria", label: "Nigeria" },
  { value: "Bangladesh", label: "Bangladesh" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "Argentina", label: "Argentina" },
  { value: "Philippines", label: "Philippines" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "Colombia", label: "Colombia" },
  { value: "UniteArabEmirates", label: "United Arab Emirates" },
  { value: "Romania", label: "Romania" },
  { value: "Belgium", label: "Belgium" },
  { value: "Switzerland", label: "Switzerland" },
  { value: "Singapore", label: "Singapore" },
  { value: "Sweden", label: "Sweden" },
  { value: "Norway", label: "Norway" },
  { value: "Austria", label: "Austria" },
  { value: "Kazakhstan", label: "Kazakhstan" },
  { value: "Algeria", label: "Algeria" },
  { value: "Chile", label: "Chile" },
  { value: "Czechia", label: "Czechia" },
  { value: "Peru", label: "Peru" },
  { value: "Iraq", label: "Iraq" },
  { value: "Israel", label: "Israel" },
  { value: "Ukraine", label: "Ukraine" },
  { value: "Denmark", label: "Denmark" },
  { value: "Portugal", label: "Portugal" },
  { value: "Hungary", label: "Hungary" },
  { value: "Greece", label: "Greece" },
  { value: "Finland", label: "Finland" },
  { value: "NewZealand", label: "New Zealand" },
  { value: "Belarus", label: "Belarus" },
  { value: "Slovakia", label: "Slovakia" },
  { value: "Serbia", label: "Serbia" },
  { value: "Lithuania", label: "Lithuania" },
  { value: "Luxembourg", label: "Luxembourg" },
  { value: "Estonia", label: "Estonia" },
];

// 模拟X热门话题数据
const mockTopicsData = [
  {
    rank: 1,
    change: "new",
    topic: "#ClimateAction",
    description: "Global climate change discussions and initiatives",
    avatar: "/api/placeholder/40/40",
    category: "Environment",
    tweets: "128K",
    retweets: "45K",
    likes: "289K",
    replies: "67K",
    impressions: "2.1M",
    engagement: "18.5%",
    hotValue: "98.5",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["climate", "environment", "sustainability"],
  },
  {
    rank: 2,
    change: "up",
    topic: "#TechInnovation",
    description: "Latest technology trends and breakthrough innovations",
    avatar: "/api/placeholder/40/40",
    category: "Technology",
    tweets: "96K",
    retweets: "38K",
    likes: "234K",
    replies: "52K",
    impressions: "1.8M",
    engagement: "16.8%",
    hotValue: "95.2",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["tech", "innovation", "AI"],
  },
  {
    rank: 3,
    change: "up",
    topic: "#ElectionUpdates",
    description: "Political developments and election news",
    avatar: "/api/placeholder/40/40",
    category: "Politics",
    tweets: "83K",
    retweets: "31K",
    likes: "198K",
    replies: "43K",
    impressions: "1.5M",
    engagement: "15.2%",
    hotValue: "92.7",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["politics", "election", "democracy"],
  },
  {
    rank: 4,
    change: "down",
    topic: "#SportHighlights",
    description: "Major sports events and athletic achievements",
    avatar: "/api/placeholder/40/40",
    category: "Sports",
    tweets: "71K",
    retweets: "28K",
    likes: "165K",
    replies: "39K",
    impressions: "1.3M",
    engagement: "14.1%",
    hotValue: "89.4",
    trendIcon: ArrowDownIcon,
    trendColor: "text-green-500",
    tags: ["sports", "athletics", "competition"],
  },
  {
    rank: 5,
    change: "up",
    topic: "#HealthWellness",
    description: "Health tips and wellness lifestyle discussions",
    avatar: "/api/placeholder/40/40",
    category: "Health",
    tweets: "68K",
    retweets: "25K",
    likes: "147K",
    replies: "34K",
    impressions: "1.1M",
    engagement: "13.5%",
    hotValue: "86.8",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["health", "wellness", "fitness"],
  },
  {
    rank: 6,
    change: "stable",
    topic: "#Entertainment",
    description: "Movies, music, and celebrity news",
    avatar: "/api/placeholder/40/40",
    category: "Entertainment",
    tweets: "59K",
    retweets: "22K",
    likes: "129K",
    replies: "28K",
    impressions: "980K",
    engagement: "12.8%",
    hotValue: "84.1",
    trendIcon: null,
    trendColor: "text-gray-500",
    tags: ["entertainment", "movies", "music"],
  },
  {
    rank: 7,
    change: "up",
    topic: "#FinanceNews",
    description: "Market updates and financial insights",
    avatar: "/api/placeholder/40/40",
    category: "Finance",
    tweets: "47K",
    retweets: "19K",
    likes: "112K",
    replies: "25K",
    impressions: "860K",
    engagement: "12.1%",
    hotValue: "81.5",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["finance", "markets", "economy"],
  },
  {
    rank: 8,
    change: "down",
    topic: "#Education",
    description: "Learning resources and educational discussions",
    avatar: "/api/placeholder/40/40",
    category: "Education",
    tweets: "42K",
    retweets: "16K",
    likes: "98K",
    replies: "21K",
    impressions: "780K",
    engagement: "11.5%",
    hotValue: "78.9",
    trendIcon: ArrowDownIcon,
    trendColor: "text-green-500",
    tags: ["education", "learning", "knowledge"],
  },
];

interface FilterState {
  country: string;
}

export default function XRankings() {
  const [filters, setFilters] = useState<FilterState>({
    country: "UnitedStates", // 默认为美国
  });
  const [data, setData] = useState(mockTopicsData);
  const [isLoading, setIsLoading] = useState(false);

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
    console.log("导出X热门话题数据", { filters, data });
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
      Environment: "bg-green-100 text-green-800",
      Technology: "bg-blue-100 text-blue-800",
      Politics: "bg-red-100 text-red-800",
      Sports: "bg-orange-100 text-orange-800",
      Health: "bg-pink-100 text-pink-800",
      Entertainment: "bg-purple-100 text-purple-800",
      Finance: "bg-yellow-100 text-yellow-800",
      Education: "bg-indigo-100 text-indigo-800",
    };
    return colorMap[category] || "bg-gray-100 text-gray-800";
  };

  const getSelectedCountryLabel = () => {
    return (
      countries.find((c) => c.value === filters.country)?.label ||
      "United States"
    );
  };

  return (
    <DashboardLayout
      title="X 热门话题"
      subtitle={`实时追踪 X 平台热门话题和讨论趋势 - ${getSelectedCountryLabel()}`}
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
        {/* 过滤器区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Filter className="mr-2 h-4 w-4" />
              筛选条件 - 热门话题
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">国家</Label>
                <Select
                  value={filters.country}
                  onValueChange={(value) =>
                    handleFilterChange("country", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择国家" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

        {/* 热门话题榜单 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-base">
                <Hash className="mr-2 h-4 w-4" />
                热门话题榜单 - {getSelectedCountryLabel()}
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
                        <h3 className="font-medium text-lg text-blue-600">
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
                    <div className="flex-shrink-0 grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span className="font-medium">{item.tweets}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">推文数</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Repeat2 className="h-3 w-3" />
                          <span className="font-medium">{item.retweets}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">转推数</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span className="font-medium">{item.likes}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">点赞数</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span className="font-medium">
                            {item.impressions}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">曝光量</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="h-3 w-3" />
                          <span className="font-medium">{item.engagement}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">互动率</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span className="font-medium text-blue-600">
                            {item.hotValue}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">热度值</p>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex-shrink-0">
                      <Button size="sm" variant="ghost" className="text-xs">
                        <Hash className="w-3 h-3 mr-1" />
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
                <Hash className="h-8 w-8 text-blue-500" />
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
