import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Hash,
  Search,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ArrowUpIcon,
  ArrowDownIcon,
  Flame,
  Users,
  Play,
} from "lucide-react";

// 皮皮虾榜���标签配置
const rankingTabs = [
  { id: "terms", name: "热门词条榜单", icon: Hash },
  { id: "search", name: "热门搜索榜单", icon: Search },
];

// 模拟热门词条数据
const mockTermsData = [
  {
    rank: 1,
    change: "new",
    term: "搞笑日常",
    description: "记录生活中的搞笑瞬间",
    avatar: "/api/placeholder/40/40",
    category: "搞笑",
    posts: "8.6万",
    views: "1.2亿",
    interactions: "234万",
    hotValue: "98.5",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["搞笑", "日常", "幽默"],
  },
  {
    rank: 2,
    change: "up",
    term: "奇葩新闻",
    description: "分享各种奇葩有趣的新闻事件",
    avatar: "/api/placeholder/40/40",
    category: "新闻",
    posts: "6.8万",
    views: "9800万",
    interactions: "189万",
    hotValue: "95.2",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["奇葩", "新闻", "热点"],
  },
  {
    rank: 3,
    change: "up",
    term: "沙雕动图",
    description: "精选沙雕搞笑动图集合",
    avatar: "/api/placeholder/40/40",
    category: "动图",
    posts: "5.9万",
    views: "8700万",
    interactions: "167万",
    hotValue: "92.7",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["沙雕", "动图", "表情"],
  },
  {
    rank: 4,
    change: "down",
    term: "爆笑段子",
    description: "收集网络上的爆笑段子",
    avatar: "/api/placeholder/40/40",
    category: "段子",
    posts: "4.7万",
    views: "7200万",
    interactions: "145万",
    hotValue: "89.4",
    trendIcon: ArrowDownIcon,
    trendColor: "text-green-500",
    tags: ["段子", "爆笑", "幽默"],
  },
  {
    rank: 5,
    change: "up",
    term: "网络梗",
    description: "最新最热的网络流行梗",
    avatar: "/api/placeholder/40/40",
    category: "网络梗",
    posts: "4.2万",
    views: "6500万",
    interactions: "128万",
    hotValue: "86.8",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["网络梗", "流行", "年轻人"],
  },
  {
    rank: 6,
    change: "stable",
    term: "动物搞笑",
    description: "可爱动物的搞笑瞬间",
    avatar: "/api/placeholder/40/40",
    category: "动物",
    posts: "3.8万",
    views: "5800万",
    interactions: "112万",
    hotValue: "84.1",
    trendIcon: null,
    trendColor: "text-gray-500",
    tags: ["动物", "搞笑", "萌宠"],
  },
];

// 模拟热门搜索数据
const mockSearchData = [
  {
    rank: 1,
    change: "new",
    keyword: "今日最搞笑",
    searchCount: "156万",
    relatedPosts: "2.3万",
    heatIndex: "98.5",
    category: "搞笑",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    trend: "+45%",
  },
  {
    rank: 2,
    change: "up",
    keyword: "沙雕网友",
    searchCount: "134万",
    relatedPosts: "1.8万",
    heatIndex: "95.2",
    category: "网友",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    trend: "+32%",
  },
  {
    rank: 3,
    change: "up",
    keyword: "表情包大全",
    searchCount: "128万",
    relatedPosts: "1.5万",
    heatIndex: "92.7",
    category: "表情包",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    trend: "+28%",
  },
  {
    rank: 4,
    change: "down",
    keyword: "恶搞视频",
    searchCount: "112万",
    relatedPosts: "1.2万",
    heatIndex: "89.4",
    category: "恶搞",
    trendIcon: ArrowDownIcon,
    trendColor: "text-green-500",
    trend: "-15%",
  },
  {
    rank: 5,
    change: "up",
    keyword: "网络段子手",
    searchCount: "98万",
    relatedPosts: "980",
    heatIndex: "86.8",
    category: "段子",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    trend: "+18%",
  },
  {
    rank: 6,
    change: "stable",
    keyword: "趣味测试",
    searchCount: "89万",
    relatedPosts: "756",
    heatIndex: "84.1",
    category: "测试",
    trendIcon: null,
    trendColor: "text-gray-500",
    trend: "0%",
  },
  {
    rank: 7,
    change: "up",
    keyword: "搞笑配音",
    searchCount: "76万",
    relatedPosts: "623",
    heatIndex: "81.5",
    category: "配音",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    trend: "+12%",
  },
  {
    rank: 8,
    change: "down",
    keyword: "奇葩故事",
    searchCount: "67万",
    relatedPosts: "534",
    heatIndex: "78.9",
    category: "故事",
    trendIcon: ArrowDownIcon,
    trendColor: "text-green-500",
    trend: "-8%",
  },
];

export default function PipixiaRankings() {
  const [activeTab, setActiveTab] = useState("terms");
  const [termsData, setTermsData] = useState(mockTermsData);
  const [searchData, setSearchData] = useState(mockSearchData);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    const currentData = activeTab === "terms" ? termsData : searchData;
    console.log("导出皮皮虾数据", { tab: activeTab, data: currentData });
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
      搞笑: "bg-yellow-100 text-yellow-800",
      新闻: "bg-red-100 text-red-800",
      动图: "bg-blue-100 text-blue-800",
      段子: "bg-green-100 text-green-800",
      网络梗: "bg-purple-100 text-purple-800",
      动物: "bg-orange-100 text-orange-800",
      网友: "bg-pink-100 text-pink-800",
      表情包: "bg-indigo-100 text-indigo-800",
      恶搞: "bg-red-100 text-red-800",
      测试: "bg-gray-100 text-gray-800",
      配音: "bg-green-100 text-green-800",
      故事: "bg-blue-100 text-blue-800",
    };
    return colorMap[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout
      title="皮皮虾热门榜单"
      subtitle="实时追踪皮皮虾平台热门词条和搜索趋势"
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            {rankingTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-sm p-3">
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 热门词条榜单 */}
          <TabsContent value="terms" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-base">
                    <Hash className="mr-2 h-4 w-4" />
                    热门词条榜单
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      共 {termsData.length} 个词条
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3 mr-1" />
                      导出
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {termsData.map((item, index) => (
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

                        {/* 词条信息 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-lg text-orange-600">
                              #{item.term}
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
                            <p className="text-xs text-muted-foreground">
                              内容数
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span className="font-medium">{item.views}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              浏览量
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center space-x-1">
                              <Heart className="h-3 w-3" />
                              <span className="font-medium">
                                {item.interactions}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              互动数
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center space-x-1">
                              <Flame className="h-3 w-3" />
                              <span className="font-medium text-orange-600">
                                {item.hotValue}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              热度值
                            </p>
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex-shrink-0">
                          <Button size="sm" variant="ghost" className="text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            关注词条
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 热门搜索榜单 */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-base">
                    <Search className="mr-2 h-4 w-4" />
                    热门搜索榜单
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      共 {searchData.length} 个关键词
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3 mr-1" />
                      导出
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchData.map((item, index) => (
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

                        {/* 搜索关键词信息 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-lg text-orange-600">
                              {item.keyword}
                            </h3>
                            <Badge
                              className={`text-xs ${getCategoryColor(item.category)}`}
                            >
                              {item.category}
                            </Badge>
                            <div
                              className={`flex items-center space-x-1 text-sm ${
                                item.trend.startsWith("+")
                                  ? "text-red-600"
                                  : item.trend.startsWith("-")
                                    ? "text-green-600"
                                    : "text-gray-500"
                              }`}
                            >
                              <TrendingUp className="h-3 w-3" />
                              <span className="font-medium">{item.trend}</span>
                            </div>
                          </div>
                        </div>

                        {/* 数据指标 */}
                        <div className="flex-shrink-0 grid grid-cols-3 gap-6 text-sm">
                          <div className="text-center">
                            <div className="flex items-center space-x-1">
                              <Search className="h-3 w-3" />
                              <span className="font-medium">
                                {item.searchCount}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              搜索量
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-3 w-3" />
                              <span className="font-medium">
                                {item.relatedPosts}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              相关内容
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center space-x-1">
                              <Flame className="h-3 w-3" />
                              <span className="font-medium text-orange-600">
                                {item.heatIndex}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              热度指数
                            </p>
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex-shrink-0">
                          <Button size="sm" variant="ghost" className="text-xs">
                            <Search className="w-3 h-3 mr-1" />
                            查看内容
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 趋势统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "terms" ? "总词条数" : "总关键词数"}
                  </p>
                  <p className="text-2xl font-bold">
                    {activeTab === "terms"
                      ? termsData.length
                      : searchData.length}
                  </p>
                </div>
                {activeTab === "terms" ? (
                  <Hash className="h-8 w-8 text-orange-500" />
                ) : (
                  <Search className="h-8 w-8 text-orange-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">上升项目</p>
                  <p className="text-2xl font-bold text-red-600">
                    {activeTab === "terms"
                      ? termsData.filter((item) => item.change === "up").length
                      : searchData.filter((item) => item.change === "up")
                          .length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">下降项目</p>
                  <p className="text-2xl font-bold text-green-600">
                    {activeTab === "terms"
                      ? termsData.filter((item) => item.change === "down")
                          .length
                      : searchData.filter((item) => item.change === "down")
                          .length}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">新增项目</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {activeTab === "terms"
                      ? termsData.filter((item) => item.change === "new").length
                      : searchData.filter((item) => item.change === "new")
                          .length}
                  </p>
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
