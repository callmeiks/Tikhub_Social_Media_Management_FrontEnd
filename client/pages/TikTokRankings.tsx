import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  Construction,
} from "lucide-react";

// ORIGINAL CODE PRESERVED FOR FUTURE DEVELOPMENT - COMMENTED OUT
/*
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  "时尚",
  "体育",
  "游戏",
  "科技",
  "生活",
  "音乐",
  "动物",
  "汽车",
  "搞笑",
  "美妆",
  "家居",
  "母婴",
  "健身",
  "商业",
];

// 国家列表
const countries = [
  { value: "all", label: "全球" },
  { value: "US", label: "美国" },
  { value: "UK", label: "英国" },
  { value: "CA", label: "加拿大" },
  { value: "AU", label: "澳大利亚" },
  { value: "DE", label: "德国" },
  { value: "FR", label: "法国" },
  { value: "IT", label: "意大利" },
  { value: "ES", label: "西班牙" },
  { value: "BR", label: "巴西" },
  { value: "MX", label: "墨西哥" },
  { value: "IN", label: "印度" },
  { value: "JP", label: "日本" },
  { value: "KR", label: "韩国" },
  { value: "ID", label: "印度尼西亚" },
  { value: "TH", label: "泰国" },
  { value: "VN", label: "越南" },
  { value: "PH", label: "菲律宾" },
  { value: "SG", label: "新加坡" },
  { value: "MY", label: "马来西亚" },
];

// 模拟数据
const mockData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `Creator ${index + 1}`,
  handle: `@creator${index + 1}`,
  avatar: `/api/placeholder/40/40`,
  category: contentTypes[index % contentTypes.length],
  followers: `${(Math.random() * 10 + 1).toFixed(1)}M`,
  likes: `${(Math.random() * 100 + 10).toFixed(1)}M`,
  comments: `${(Math.random() * 10 + 1).toFixed(1)}M`,
  shares: `${(Math.random() * 5 + 0.5).toFixed(1)}M`,
  views: `${(Math.random() * 500 + 50).toFixed(1)}M`,
  engagement: `${(Math.random() * 10 + 2).toFixed(1)}%`,
  growth: `${(Math.random() * 50 + 5).toFixed(1)}%`,
  country: countries[Math.floor(Math.random() * countries.length)].label,
  trend: Math.random() > 0.5 ? "up" : Math.random() > 0.3 ? "down" : "stable",
}));

// 筛选状态类型
interface FilterState {
  type: string;
  period: string;
  country: string;
  sortMethod: string;
  sortBy: string;
  sortOrder: string;
  keyword: string;
  specificDate: string;
  verified: boolean;
  minFollowers: string;
  maxFollowers: string;
  [key: string]: string | boolean;
}

// 榜单标签配置
const rankingTabs = [
  { id: "dailyworks", name: "每日爆款", icon: TrendingUp },
  { id: "weeklyworks", name: "每周爆款", icon: Calendar },
  { id: "creators", name: "创作者榜", icon: Users },
  { id: "trending", name: "趋势榜", icon: Zap },
  { id: "music", name: "音乐榜", icon: Music },
  { id: "hashtag", name: "话题榜", icon: Hash },
  { id: "creative", name: "创意榜", icon: Lightbulb },
  { id: "keywords", name: "关键词榜", icon: Target },
  { id: "rising", name: "飙升榜", icon: ArrowUpIcon },
];

export default function TikTokRankings() {
  const [activeTab, setActiveTab] = useState("dailyworks");
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    period: "",
    country: "",
    sortMethod: "",
    sortBy: "",
    sortOrder: "",
    keyword: "",
    specificDate: "",
    verified: false,
    minFollowers: "",
    maxFollowers: "",
  });
  const [data, setData] = useState(mockData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setIsLoading(true);
    setError(null);
    // 模拟API调用
    setTimeout(() => {
      setData(mockData.slice(0, Math.floor(Math.random() * 30) + 20));
      setIsLoading(false);
    }, 1000);
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      period: "",
      country: "",
      sortMethod: "",
      sortBy: "",
      sortOrder: "",
      keyword: "",
      specificDate: "",
      verified: false,
      minFollowers: "",
      maxFollowers: "",
    });
  };

  const handleExport = () => {
    console.log("导出数据", { tab: activeTab, filters, data });
  };

  // 获取标签页对应的筛选器
  const getFiltersForTab = (tabId: string) => {
    switch (tabId) {
      case "dailyworks":
      case "weeklyworks":
        return []; // 无filter

      case "creators":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          {
            type: "select",
            key: "period",
            label: "周期",
            options: [
              { value: "24h", label: "过去24小时" },
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
              { value: "followers", label: "粉丝数" },
              { value: "likes", label: "点赞数" },
              { value: "comments", label: "评论数" },
              { value: "shares", label: "转发数" },
              { value: "engagement", label: "互动率" },
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
          { type: "checkbox", key: "verified", label: "仅认证账号" },
          { type: "input", key: "minFollowers", label: "最少粉丝数" },
          { type: "input", key: "maxFollowers", label: "最多粉丝数" },
        ];

      case "trending":
      case "rising":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          {
            type: "select",
            key: "period",
            label: "周期",
            options: [
              { value: "1h", label: "过去1小时" },
              { value: "6h", label: "过去6小时" },
              { value: "24h", label: "过去24小时" },
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
        ];

      case "music":
      case "hashtag":
        return [
          { type: "select", key: "type", label: "类型", options: contentTypes },
          {
            type: "select",
            key: "period",
            label: "周期",
            options: [
              { value: "24h", label: "过去24小时" },
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
              { value: "usage", label: "使用量" },
              { value: "growth", label: "增长率" },
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

      default:
        return [];
    }
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
                {filter.options?.map((option: any) => (
                  <SelectItem
                    key={typeof option === "string" ? option : option.value}
                    value={typeof option === "string" ? option : option.value}
                  >
                    {typeof option === "string" ? option : option.label}
                  </SelectItem>
                ))}
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

  // 自动加载数据
  useEffect(() => {
    handleSearch();
  }, [activeTab]);

  // ORIGINAL RETURN STATEMENT - COMMENTED OUT FOR FUTURE USE
  /*
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
                      {getFiltersForTab(tab.id).map((filter, index) =>
                        renderFilterComponent(filter),
                      )}
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="outline" onClick={resetFilters}>
                        重置
                      </Button>
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

              {error && (
                <Card className="border-red-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <tab.icon className="mr-2 h-4 w-4" />
                      {tab.name}数据
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      共 {data.length} 条记录
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-sm text-muted-foreground">
                          <th className="text-left p-2">排名</th>
                          <th className="text-left p-2">创作者</th>
                          <th className="text-left p-2">分类</th>
                          <th className="text-left p-2">粉丝数</th>
                          <th className="text-left p-2">点赞数</th>
                          <th className="text-left p-2">评论数</th>
                          <th className="text-left p-2">分享数</th>
                          <th className="text-left p-2">观看数</th>
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
                                  className={`font-medium ${
                                    index < 3 ? "text-yellow-600" : ""
                                  }`}
                                >
                                  {index + 1}
                                </span>
                                {item.trend === "up" ? (
                                  <ArrowUpIcon className="w-3 h-3 text-green-500" />
                                ) : item.trend === "down" ? (
                                  <ArrowDownIcon className="w-3 h-3 text-red-500" />
                                ) : null}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={item.avatar}
                                    alt={item.name}
                                  />
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
  END OF ORIGINAL CODE */

export default function TikTokRankings() {
  // Under development message (same as DataCollection page)
  return (
    <DashboardLayout
      title="TikTok热度榜单"
      subtitle="实时追踪TikTok平台热门内容和趋势数据"
      actions={<Button className="brand-gradient">新建采集任务</Button>}
    >
      <div className="flex items-center justify-center h-96">
        <Card className="border-0 shadow-md max-w-md">
          <CardContent className="p-8 text-center">
            <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">数据采集功能开发中</h3>
            <p className="text-muted-foreground mb-4">
              我们正在开发强大的数据采集工具，敬请期待！
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Construction className="h-4 w-4" />
              <span>即将上线</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}