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
  MapPin,
  Calendar,
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
} from "lucide-react";

// 36个类型选项
const contentTypes = [
  "美食",
  "旅行",
  "休闲娱乐",
  "文化",
  "舞蹈",
  "教育校园",
  "公益",
  "艺术",
  "时尚",
  "体育",
  "动物",
  "电视剧",
  "三农",
  "二次元",
  "汽车",
  "音乐",
  "电影",
  "医疗健康",
  "明星",
  "摄影摄像",
  "生活家居",
  "随拍",
  "颜值",
  "情感",
  "人文社科",
  "科普",
  "财经",
  "科技",
  "职场",
  "生活记录",
  "母婴",
  "综艺",
  "亲子",
  "法律",
  "剧情",
  "游戏",
];

// 城市列表
const cities = [
  "北京",
  "上海",
  "广州",
  "深圳",
  "杭州",
  "南京",
  "苏州",
  "成都",
  "重庆",
  "武汉",
  "西安",
  "天津",
  "青岛",
  "大连",
  "厦门",
  "福州",
  "长沙",
  "郑州",
  "济南",
  "沈阳",
  "哈尔滨",
  "长春",
  "石家庄",
  "太原",
];

// 榜单标签配置
const rankingTabs = [
  { id: "rising", name: "上升热点榜", icon: TrendingUp },
  { id: "local", name: "同城热点榜", icon: MapPin },
  { id: "challenge", name: "挑战热点榜", icon: Hash },
  { id: "search", name: "搜索热点��", icon: Search },
  { id: "accounts", name: "热门账号榜单", icon: Users },
  { id: "video", name: "视频热点榜", icon: Play },
  { id: "lowfan", name: "低粉爆款榜", icon: TrendingUp },
  { id: "completion", name: "高完播率榜", icon: Play },
  { id: "follower", name: "高涨粉率榜", icon: Users },
  { id: "like", name: "高点赞率榜", icon: Heart },
  { id: "risingsearch", name: "热度飙升搜索榜", icon: TrendingUp },
  { id: "risingtopic", name: "热度飙升话题榜", icon: Hash },
  { id: "hotwords", name: "热门词列表", icon: MessageCircle },
  { id: "calendar", name: "抖音活动日历", icon: Calendar },
];

// 模拟排行榜数据
const mockRankingData = [
  {
    rank: 1,
    change: "new",
    avatar: "/api/placeholder/40/40",
    name: "古筝",
    handle: "@douyin664658",
    category: "音乐",
    followers: "2711万",
    likes: "76.7万+",
    comments: "20.7万+",
    shares: "6915",
    videos: "10.7万+",
    engagement: "40141",
    growth: "17万+",
    points: "5905",
    score: "995.0",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
  },
  {
    rank: 2,
    change: "up",
    avatar: "/api/placeholder/40/40",
    name: "湘妃",
    handle: "CV01225987",
    category: "情感",
    followers: "1万5",
    likes: "27.7万+",
    comments: "10.7万+",
    shares: "54933",
    videos: "10.7万+",
    engagement: "9104",
    growth: "4715",
    points: "3.7万+",
    score: "928.0",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
  },
  {
    rank: 3,
    change: "up",
    avatar: "/api/placeholder/40/40",
    name: "千货选记忆",
    handle: "@chenwu",
    category: "购物",
    followers: "1万5",
    likes: "24.7万+",
    comments: "10.7万+",
    shares: "49257",
    videos: "10.7万+",
    engagement: "2565",
    growth: "1258",
    points: "4585",
    score: "915.4",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
  },
  {
    rank: 4,
    change: "down",
    avatar: "/api/placeholder/40/40",
    name: "沃频充点",
    handle: "@woshizhade",
    category: "科技",
    followers: "4万4",
    likes: "22.7万+",
    comments: "22.7万+",
    shares: "56154",
    videos: "75182",
    engagement: "1168",
    growth: "358",
    points: "1783",
    score: "909.5",
    trendIcon: ArrowDownIcon,
    trendColor: "text-green-500",
  },
  {
    rank: 5,
    change: "up",
    avatar: "/api/placeholder/40/40",
    name: "每日宜居",
    handle: "@douyu",
    category: "生活家居",
    followers: "1万5",
    likes: "21.7万+",
    comments: "10.7万+",
    shares: "42345",
    videos: "10.7万+",
    engagement: "4812",
    growth: "536",
    points: "17万+",
    score: "907.2",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
  },
];

interface FilterState {
  type: string;
  city: string;
  keyword: string;
  sortBy: string;
  count: string;
  timeFrame: string;
  timeRange: { start: string; end: string };
}

export default function DouyinRankings() {
  const [activeTab, setActiveTab] = useState("rising");
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    city: "",
    keyword: "",
    sortBy: "heat",
    count: "50",
    timeFrame: "daily",
    timeRange: { start: "", end: "" },
  });
  const [data, setData] = useState(mockRankingData);
  const [isLoading, setIsLoading] = useState(false);

  // 获取当前标签的过滤器配置
  const getFiltersForTab = (tabId: string) => {
    const baseFilters = [];

    switch (tabId) {
      case "rising":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          { type: "input", key: "keyword", label: "关键词" },
          {
            type: "select",
            key: "sortBy",
            label: "排序",
            options: [
              { value: "heat", label: "按热度排序" },
              { value: "change", label: "按排名变化" },
            ],
          },
          {
            type: "select",
            key: "count",
            label: "采集数量",
            options: [
              { value: "50", label: "50" },
              { value: "100", label: "100" },
              { value: "150", label: "150" },
            ],
          },
        ];

      case "local":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          { type: "select", key: "city", label: "城市名字", options: cities },
          { type: "input", key: "keyword", label: "关键词" },
          {
            type: "select",
            key: "sortBy",
            label: "排序",
            options: [
              { value: "heat", label: "按热度排序" },
              { value: "change", label: "按排名变化" },
            ],
          },
          {
            type: "select",
            key: "count",
            label: "���集数量",
            options: [
              { value: "50", label: "50" },
              { value: "100", label: "100" },
              { value: "150", label: "150" },
            ],
          },
        ];

      case "challenge":
        return [
          { type: "input", key: "keyword", label: "关键词" },
          {
            type: "select",
            key: "count",
            label: "采集数量",
            options: [
              { value: "50", label: "50" },
              { value: "100", label: "100" },
              { value: "150", label: "150" },
            ],
          },
        ];

      case "calendar":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          { type: "daterange", key: "timeRange", label: "时间区间" },
          { type: "select", key: "city", label: "城市名字", options: cities },
        ];

      default:
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          {
            type: "select",
            key: "timeFrame",
            label: "时间",
            options: [
              { value: "hourly", label: "按小时" },
              { value: "daily", label: "按天" },
            ],
          },
          {
            type: "select",
            key: "count",
            label: "采集数量",
            options: [
              { value: "50", label: "50" },
              { value: "100", label: "100" },
              { value: "150", label: "150" },
            ],
          },
        ];
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setIsLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setIsLoading(false);
      // 这里可以根据filters参数过滤数据
    }, 1000);
  };

  const handleExport = () => {
    // 导出功能
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
                    <SelectItem
                      key={typeof option === "string" ? option : option.value}
                      value={typeof option === "string" ? option : option.value}
                    >
                      {typeof option === "string" ? option : option.label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        );

      case "input":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{filter.label}</Label>
            <Input
              id={key}
              placeholder={`请输入${filter.label}`}
              value={filters[key as keyof FilterState] as string}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            />
          </div>
        );

      case "daterange":
        return (
          <div key={key} className="space-y-2">
            <Label>{filter.label}</Label>
            <div className="flex space-x-2">
              <Input
                type="date"
                value={filters.timeRange.start}
                onChange={(e) =>
                  handleFilterChange(
                    "timeRange",
                    JSON.stringify({
                      ...filters.timeRange,
                      start: e.target.value,
                    }),
                  )
                }
              />
              <Input
                type="date"
                value={filters.timeRange.end}
                onChange={(e) =>
                  handleFilterChange(
                    "timeRange",
                    JSON.stringify({
                      ...filters.timeRange,
                      end: e.target.value,
                    }),
                  )
                }
              />
            </div>
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
      title="抖音热度榜单"
      subtitle="实时追踪抖音平台各类热门内容和趋势数据"
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
          <TabsList className="grid w-full grid-cols-7 h-auto p-1">
            {rankingTabs.slice(0, 7).map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs p-2">
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsList className="grid w-full grid-cols-7 h-auto p-1 mt-2">
            {rankingTabs.slice(7).map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs p-2">
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {rankingTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              {/* 过滤器区域 */}
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
                          <th className="text-left p-2">公众号</th>
                          <th className="text-left p-2">某类型</th>
                          <th className="text-left p-2">总粉丝量</th>
                          <th className="text-left p-2">进击</th>
                          <th className="text-left p-2">平均</th>
                          <th className="text-left p-2">总点赞数</th>
                          <th className="text-left p-2">总点赞数</th>
                          <th className="text-left p-2">总转发数</th>
                          <th className="text-left p-2">新增粉丝数</th>
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
                            <td className="p-2 text-sm">{item.videos}</td>
                            <td className="p-2 text-sm">{item.engagement}</td>
                            <td className="p-2 text-sm">{item.growth}</td>
                            <td className="p-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs"
                              >
                                加入清单号 ...
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
