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
import { Checkbox } from "@/components/ui/checkbox";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
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
  Zap,
  Lightbulb,
  Target,
} from "lucide-react";

// 内容类型
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

// 国家列表
const countries = [
  { value: "US", label: "美国 (US)" },
  { value: "UK", label: "英国 (UK)" },
  { value: "JP", label: "日本 (JP)" },
  { value: "KR", label: "韩国 (KR)" },
  { value: "DE", label: "德国 (DE)" },
  { value: "FR", label: "法国 (FR)" },
  { value: "CA", label: "加拿大 (CA)" },
  { value: "AU", label: "澳大利亚 (AU)" },
  { value: "IN", label: "印度 (IN)" },
  { value: "BR", label: "巴西 (BR)" },
  { value: "MX", label: "墨西哥 (MX)" },
  { value: "IT", label: "意大利 (IT)" },
  { value: "ES", label: "西班牙 (ES)" },
  { value: "NL", label: "荷兰 (NL)" },
  { value: "SG", label: "新加坡 (SG)" },
];

// 直播排行榜类型
const liveRankingTypes = [
  "每小时排行榜",
  "每周排行榜",
  "新星排行榜",
  "销售排行榜",
  "每日排行榜",
  "游戏排行榜",
  "每日游戏排行榜",
  "名人堂排行榜",
  "冠军赛排行榜",
  "每日新秀排行榜",
  "人气直播榜",
  "D5段位榜",
  "绝地求生排行榜",
  "王者荣耀排行榜",
  "Free Fire排行榜",
  "联盟竞赛排行榜",
];

// TikTok榜单标签配置
const rankingTabs = [
  { id: "dailyworks", name: "每日热门作品", icon: Play },
  { id: "dailylive", name: "每日直播排行榜", icon: Video },
  { id: "products", name: "热门产品", icon: Award },
  { id: "tags", name: "热门标签", icon: Hash },
  { id: "music", name: "热门音乐", icon: Music },
  { id: "ads", name: "热门广告聚光灯", icon: Zap },
  { id: "creative", name: "创意模式排行榜", icon: Lightbulb },
  { id: "keywords", name: "热门关键词", icon: MessageCircle },
  { id: "videos", name: "热门视频", icon: Play },
];

// 模拟排行榜数据
const mockRankingData = [
  {
    rank: 1,
    change: "new",
    avatar: "/api/placeholder/40/40",
    name: "@trending_creator",
    handle: "TikTok Creator",
    category: "Entertainment",
    followers: "2.1M",
    likes: "156K",
    comments: "23K",
    shares: "8.9K",
    views: "890K",
    engagement: "18.5%",
    growth: "+12%",
    country: "US",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
  },
  {
    rank: 2,
    change: "up",
    avatar: "/api/placeholder/40/40",
    name: "@music_viral",
    handle: "Music Viral",
    category: "Music",
    followers: "1.8M",
    likes: "134K",
    comments: "19K",
    shares: "7.2K",
    views: "723K",
    engagement: "16.8%",
    growth: "+9%",
    country: "UK",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
  },
  {
    rank: 3,
    change: "up",
    avatar: "/api/placeholder/40/40",
    name: "@dance_moves",
    handle: "Dance Moves",
    category: "Dance",
    followers: "1.5M",
    likes: "128K",
    comments: "15K",
    shares: "6.8K",
    views: "656K",
    engagement: "15.2%",
    growth: "+7%",
    country: "JP",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
  },
];

interface FilterState {
  type: string;
  period: string;
  country: string;
  sortOrder: string;
  sortMethod: string;
  keyword: string;
  onlyNew: boolean;
  onlyCommercial: boolean;
  specificDate: string;
  sortBy: string;
}

export default function TikTokRankings() {
  const [activeTab, setActiveTab] = useState("dailyworks");
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    period: "",
    country: "",
    sortOrder: "",
    sortMethod: "",
    keyword: "",
    onlyNew: false,
    onlyCommercial: false,
    specificDate: "",
    sortBy: "",
  });
  const [data, setData] = useState(mockRankingData);
  const [isLoading, setIsLoading] = useState(false);

  // 获取当前标签的过滤器配置
  const getFiltersForTab = (tabId: string) => {
    switch (tabId) {
      case "dailyworks":
        return []; // 无filter

      case "dailylive":
        return [
          {
            type: "select",
            key: "type",
            label: "类型",
            options: liveRankingTypes,
          },
        ];

      case "products":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          {
            type: "select",
            key: "period",
            label: "周期",
            options: [
              { value: "1day", label: "过去1天" },
              { value: "7days", label: "过去7天" },
              { value: "30days", label: "过去30天" },
            ],
          },
          {
            type: "select",
            key: "country",
            label: "国家",
            options: countries,
          },
          {
            type: "select",
            key: "sortOrder",
            label: "排序顺序",
            options: [
              { value: "publish", label: "发布量" },
              { value: "click", label: "点击率" },
              { value: "conversion", label: "转换率" },
            ],
          },
          {
            type: "select",
            key: "sortMethod",
            label: "排序方式",
            options: [
              { value: "desc", label: "降序" },
              { value: "asc", label: "升序" },
            ],
          },
        ];

      case "tags":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          {
            type: "select",
            key: "period",
            label: "周期",
            options: [
              { value: "1day", label: "过去1天" },
              { value: "7days", label: "过去7天" },
              { value: "30days", label: "过去30天" },
            ],
          },
          {
            type: "select",
            key: "country",
            label: "国家",
            options: countries,
          },
          {
            type: "select",
            key: "sortMethod",
            label: "排序方式",
            options: [
              { value: "hot", label: "热门" },
              { value: "latest", label: "最新" },
            ],
          },
        ];

      case "music":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          {
            type: "select",
            key: "period",
            label: "周期",
            options: [
              { value: "1day", label: "过去1天" },
              { value: "7days", label: "过去7天" },
              { value: "30days", label: "过去30天" },
            ],
          },
          {
            type: "select",
            key: "country",
            label: "国家",
            options: countries,
          },
          {
            type: "select",
            key: "sortMethod",
            label: "排序方式",
            options: [
              { value: "hot", label: "热门" },
              { value: "rising", label: "上升最快" },
            ],
          },
          { type: "checkbox", key: "onlyNew", label: "是否只看新上榜" },
          {
            type: "checkbox",
            key: "onlyCommercial",
            label: "是否只看商业音乐",
          },
        ];

      case "ads":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
        ];

      case "creative":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          {
            type: "select",
            key: "period",
            label: "周期",
            options: [
              { value: "7days", label: "过去7天" },
              { value: "30days", label: "过去30天" },
            ],
          },
          {
            type: "select",
            key: "country",
            label: "国家",
            options: countries,
          },
          {
            type: "select",
            key: "sortMethod",
            label: "排序方式",
            options: [
              { value: "hot", label: "热门" },
              { value: "rising", label: "上升最快" },
            ],
          },
          {
            type: "select",
            key: "sortBy",
            label: "排序",
            options: [
              { value: "views", label: "观看量" },
              { value: "likes", label: "点赞数" },
              { value: "comments", label: "评论数" },
              { value: "shares", label: "转发数" },
            ],
          },
          {
            type: "select",
            key: "sortOrder",
            label: "排序方式",
            options: [
              { value: "desc", label: "降序" },
              { value: "asc", label: "升序" },
            ],
          },
          { type: "date", key: "specificDate", label: "指定周期数据" },
        ];

      case "keywords":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          { type: "input", key: "keyword", label: "关键词" },
          {
            type: "select",
            key: "period",
            label: "周期",
            options: [
              { value: "7days", label: "过去7天" },
              { value: "30days", label: "过去30天" },
            ],
          },
          {
            type: "select",
            key: "country",
            label: "国家",
            options: countries,
          },
          {
            type: "select",
            key: "sortMethod",
            label: "排序方式",
            options: [
              { value: "hot", label: "热门" },
              { value: "rising", label: "上升最快" },
            ],
          },
          {
            type: "select",
            key: "sortBy",
            label: "排序",
            options: [
              { value: "publish", label: "发布率" },
              { value: "click", label: "点击率" },
              { value: "trend", label: "趋势" },
            ],
          },
          {
            type: "select",
            key: "sortOrder",
            label: "排序方式",
            options: [
              { value: "desc", label: "降序" },
              { value: "asc", label: "升序" },
            ],
          },
        ];

      case "videos":
        return [
          {
            type: "select",
            key: "period",
            label: "周期",
            options: [
              { value: "1day", label: "过去1天" },
              { value: "7days", label: "过去7天" },
              { value: "30days", label: "过去30天" },
            ],
          },
          {
            type: "select",
            key: "sortBy",
            label: "排序",
            options: [
              { value: "views", label: "观看量" },
              { value: "likes", label: "点赞数" },
              { value: "comments", label: "评论数" },
              { value: "shares", label: "转发数" },
            ],
          },
          {
            type: "select",
            key: "country",
            label: "国家",
            options: countries,
          },
        ];

      default:
        return [];
    }
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
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
              value={filters[key as keyof FilterState] as string}
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

      case "date":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{filter.label}</Label>
            <Input
              id={key}
              type="date"
              value={filters[key as keyof FilterState] as string}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={filters[key as keyof FilterState] as boolean}
              onCheckedChange={(checked) => handleFilterChange(key, checked)}
            />
            <Label htmlFor={key}>{filter.label}</Label>
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
      title="TikTok热度榜单"
      subtitle="实时追踪TikTok平台各类热门内容和趋势数据"
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
                          <th className="text-left p-2">国家</th>
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
                            <td className="p-2 text-sm">{item.country}</td>
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
