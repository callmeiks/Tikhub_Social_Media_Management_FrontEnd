import React, { useState, useEffect } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Zap,
  Settings,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { apiClient, type XHotTrendingItem } from "@/lib/api";
import { hotRankingsCache, createCacheKey, type CacheStatus } from "@/lib/cache";

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


interface FilterState {
  country: string;
}

export default function XRankings() {
  const [filters, setFilters] = useState<FilterState>({
    country: "UnitedStates", // 默认为美国
  });
  const [data, setData] = useState<XHotTrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({ isFromCache: false });

  // 获取X热门话题数据
  const fetchData = async (forceRefresh = false) => {
    const cacheKey = createCacheKey("x", "trending", filters.country);
    
    // 如果不是强制刷新，先检查缓存
    if (!forceRefresh) {
      const cachedData = hotRankingsCache.get<XHotTrendingItem[]>(cacheKey);
      if (cachedData) {
        const cacheInfo = hotRankingsCache.getCacheInfo(cacheKey);
        setData(cachedData);
        setCacheStatus({
          isFromCache: true,
          cacheAge: cacheInfo.age,
          remainingTTL: cacheInfo.remainingTTL,
        });
        console.log(`使用缓存数据: ${cacheKey}`, {
          age: Math.round((cacheInfo.age || 0) / 1000) + '秒前',
          remaining: Math.round((cacheInfo.remainingTTL || 0) / 1000) + '秒后过期'
        });
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setCacheStatus({ isFromCache: false });
    
    try {
      console.log("调用X热门话题API", { country: filters.country });
      const response = await apiClient.getXHotTrending({ country: filters.country });
      console.log("API响应数据:", response);
      
      // 将数据存入缓存
      hotRankingsCache.set(cacheKey, response);
      console.log(`数据已缓存: ${cacheKey}`, response.length + ' 条数据');
      
      setData(response);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err instanceof Error ? err.message : "获取数据失败");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchData();
  }, []);

  // 当国家切换时重新获取数据
  useEffect(() => {
    fetchData();
  }, [filters.country]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRefresh = (forceRefresh = false) => {
    fetchData(forceRefresh);
  };

  const handleExport = () => {
    console.log("导出X热门话题数据", { filters, data });
  };

  const handleClearCache = () => {
    hotRankingsCache.clear();
    console.log("缓存已清空");
    handleRefresh(true);
  };

  // 解析上下文信息获取分类
  const parseContext = (context: string) => {
    const parts = context.split(' · ');
    return {
      category: parts[0] || "General",
      status: parts[1] || "Trending"
    };
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      Rap: "bg-purple-100 text-purple-800",
      News: "bg-red-100 text-red-800",
      Lifestyle: "bg-green-100 text-green-800",
      Technology: "bg-blue-100 text-blue-800",
      Sports: "bg-orange-100 text-orange-800",
      Politics: "bg-red-100 text-red-800",
      Entertainment: "bg-purple-100 text-purple-800",
      Finance: "bg-yellow-100 text-yellow-800",
      Health: "bg-pink-100 text-pink-800",
      Music: "bg-indigo-100 text-indigo-800",
      General: "bg-gray-100 text-gray-800",
    };
    return colorMap[category] || "bg-gray-100 text-gray-800";
  };

  // 生成话题标签
  const generateTopicTags = (name: string, context: string) => {
    const tags = [];
    
    // 如果是hashtag，添加主题标签
    if (name.startsWith('#')) {
      tags.push(name.substring(1).toLowerCase());
    } else {
      // 普通话题，从名称中提取关键词
      const words = name.toLowerCase().split(' ').filter(word => word.length > 2);
      tags.push(...words.slice(0, 2));
    }
    
    // 从上下文中添加分类标签
    const { category } = parseContext(context);
    if (category !== "General") {
      tags.push(category.toLowerCase());
    }
    
    return tags.slice(0, 3); // 最多3个标签
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
          {cacheStatus.isFromCache && (
            <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-md border border-green-200">
              <Zap className="mr-1 h-3 w-3" />
              缓存数据 ({Math.round((cacheStatus.cacheAge || 0) / 1000)}秒前)
            </div>
          )}
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出数据
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleRefresh(false)}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? '加载中...' : '刷新数据'}
          </Button>
          <Button 
            className="brand-accent" 
            onClick={() => handleRefresh(true)}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? '强制刷新中...' : '强制刷新'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleClearCache}>
                <Trash2 className="mr-2 h-4 w-4" />
                清空缓存
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('缓存信息:', {
                size: hotRankingsCache.size(),
                keys: hotRankingsCache.keys().filter(k => k.includes('x'))
              })}>
                <Eye className="mr-2 h-4 w-4" />
                查看缓存信息
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <Button 
                variant="outline"
                onClick={() => {
                  setFilters({ country: "UnitedStates" });
                }}
              >
                重置
              </Button>
              <Button onClick={() => handleRefresh(false)} disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "搜索中..." : "搜索"}
              </Button>
              <Button 
                onClick={() => handleRefresh(true)} 
                disabled={isLoading}
                variant="secondary"
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "强制刷新中..." : "强制刷新"}
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
                {cacheStatus.isFromCache && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Zap className="w-3 h-3 mr-1" />
                    缓存
                  </Badge>
                )}
                {!cacheStatus.isFromCache && !isLoading && data.length > 0 && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    最新
                  </Badge>
                )}
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="w-3 h-3 mr-1" />
                  导出
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-center py-8">
                <div className="text-red-500 flex items-center justify-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRefresh(true)}
                  className="mt-2"
                >
                  重试
                </Button>
              </div>
            )}
            {!error && !isLoading && data.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                暂无数据
              </div>
            )}
            {!error && (
              <div className="space-y-4">
                {data.map((item, index) => {
                  const { category, status } = parseContext(item.context);
                  const tags = generateTopicTags(item.name, item.context);
                  
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        {/* 排名 */}
                        <div className="flex-shrink-0 flex items-center space-x-2">
                          <Badge
                            variant={index < 3 ? "default" : "secondary"}
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            {index + 1}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-blue-500 font-medium">{status}</span>
                          </div>
                        </div>

                        {/* 话题信息 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-lg text-blue-600">
                              {item.name}
                            </h3>
                            <Badge
                              className={`text-xs ${getCategoryColor(category)}`}
                            >
                              {category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description || "暂无描述"}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                            <span>上下文: {item.context}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {tags.map((tag, tagIndex) => (
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

                        {/* 趋势状态 */}
                        <div className="flex-shrink-0 text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-blue-600 text-lg">
                              #{index + 1}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">排名</p>
                          
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            <Hash className="w-3 h-3 mr-1" />
                            {status}
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
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 话题趋势统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总话题数</p>
                  <p className="text-2xl font-bold">{data.length}</p>
                </div>
                <Hash className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">当前国家</p>
                  <p className="text-2xl font-bold text-blue-600">{getSelectedCountryLabel()}</p>
                  <p className="text-xs text-blue-500">数据来源地区</p>
                </div>
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                  <span className="text-xs text-blue-500 font-medium">地区</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">缓存状态</p>
                  <p className="text-2xl font-bold">
                    {cacheStatus.isFromCache ? "缓存" : "最新"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {cacheStatus.isFromCache 
                      ? `${Math.round((cacheStatus.cacheAge || 0) / 1000)}秒前` 
                      : "实时数据"
                    }
                  </p>
                </div>
                <Zap className={`h-8 w-8 ${cacheStatus.isFromCache ? "text-green-500" : "text-blue-500"}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">数据更新</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? "刷新中" : "已完成"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? "正在获取" : "准备就绪"}
                  </p>
                </div>
                <RefreshCw className={`h-8 w-8 ${isLoading ? "animate-spin text-blue-500" : "text-gray-500"}`} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
