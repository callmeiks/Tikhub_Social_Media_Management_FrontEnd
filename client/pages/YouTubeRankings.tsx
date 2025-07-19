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
  Play,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ArrowUpIcon,
  ArrowDownIcon,
  Clock,
  Users,
  ThumbsUp,
  Zap,
  Settings,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { apiClient, type YouTubeHotTrendingItem } from "@/lib/api";
import { hotRankingsCache, createCacheKey, type CacheStatus } from "@/lib/cache";

// 语言代码列表
const languageCodes = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "es", label: "Español" },
  { value: "hi", label: "हिन्दी" },
  { value: "ar", label: "العربية" },
  { value: "pt", label: "Português" },
  { value: "bn", label: "বাংলা" },
  { value: "ru", label: "Русский" },
  { value: "ja", label: "日本語" },
  { value: "pa", label: "ਪੰਜਾਬੀ" },
  { value: "de", label: "Deutsch" },
  { value: "jv", label: "Javanese" },
  { value: "ms", label: "Bahasa Melayu" },
  { value: "te", label: "తెలుగు" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "ko", label: "한국어" },
  { value: "fr", label: "Français" },
  { value: "mr", label: "मराठी" },
  { value: "ta", label: "தமிழ்" },
  { value: "ur", label: "اردو" },
  { value: "tr", label: "Türkçe" },
  { value: "it", label: "Italiano" },
  { value: "th", label: "ไทย" },
  { value: "gu", label: "ગુજરાતી" },
  { value: "pl", label: "Polski" },
];

// 国家代码列表
const countryCodes = [
  { value: "us", label: "United States" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "jp", label: "Japan" },
  { value: "gb", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "kr", label: "South Korea" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "mx", label: "Mexico" },
  { value: "es", label: "Spain" },
  { value: "it", label: "Italy" },
  { value: "ru", label: "Russia" },
  { value: "nl", label: "Netherlands" },
  { value: "tr", label: "Turkey" },
  { value: "id", label: "Indonesia" },
  { value: "th", label: "Thailand" },
  { value: "ph", label: "Philippines" },
  { value: "my", label: "Malaysia" },
  { value: "sg", label: "Singapore" },
  { value: "vn", label: "Vietnam" },
  { value: "tw", label: "Taiwan" },
  { value: "hk", label: "Hong Kong" },
  { value: "pk", label: "Pakistan" },
  { value: "bd", label: "Bangladesh" },
  { value: "eg", label: "Egypt" },
  { value: "sa", label: "Saudi Arabia" },
  { value: "ae", label: "United Arab Emirates" },
  { value: "za", label: "South Africa" },
  { value: "ng", label: "Nigeria" },
  { value: "ke", label: "Kenya" },
  { value: "ar", label: "Argentina" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colombia" },
  { value: "pe", label: "Peru" },
  { value: "ve", label: "Venezuela" },
];

// 分类选项
const sections = [
  { value: "Now", label: "Now (热门)" },
  { value: "Music", label: "Music (音乐)" },
  { value: "Gaming", label: "Gaming (游戏)" },
  { value: "Movies", label: "Movies (电影)" },
];


interface FilterState {
  languageCode: string;
  countryCode: string;
  section: string;
}

export default function YouTubeRankings() {
  const [filters, setFilters] = useState<FilterState>({
    languageCode: "en", // 默认英语
    countryCode: "us", // 默认美国
    section: "Now", // 默认热门
  });
  const [data, setData] = useState<YouTubeHotTrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({ isFromCache: false });

  // 获取YouTube热门视频数据
  const fetchData = async (forceRefresh = false) => {
    const cacheKey = createCacheKey("youtube", "trending", `${filters.languageCode}_${filters.countryCode}_${filters.section}`);
    
    // 如果不是强制刷新，先检查缓存
    if (!forceRefresh) {
      const cachedData = hotRankingsCache.get<YouTubeHotTrendingItem[]>(cacheKey);
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
      console.log("调用YouTube热门视频API", { 
        language_code: filters.languageCode,
        country_code: filters.countryCode,
        section: filters.section
      });
      const response = await apiClient.getYouTubeHotTrending({ 
        language_code: filters.languageCode,
        country_code: filters.countryCode,
        section: filters.section
      });
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

  // 当筛选条件改变时重新获取数据
  useEffect(() => {
    fetchData();
  }, [filters.languageCode, filters.countryCode, filters.section]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRefresh = (forceRefresh = false) => {
    fetchData(forceRefresh);
  };

  const handleExport = () => {
    console.log("导出YouTube热门视频数据", { filters, data });
  };

  const handleClearCache = () => {
    hotRankingsCache.clear();
    console.log("缓存已清空");
    handleRefresh(true);
  };

  // 格式化观看次数
  const formatViewCount = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // 获取最佳缩略图
  const getBestThumbnail = (thumbnails: Array<{url: string, width: number, height: number}>) => {
    if (!thumbnails || thumbnails.length === 0) {
      return "/api/placeholder/210/118"; // 默认缩略图
    }
    
    // 优先选择宽度在200-300之间的缩略图
    const preferredThumbnail = thumbnails.find(t => t.width >= 200 && t.width <= 300);
    if (preferredThumbnail) {
      return preferredThumbnail.url;
    }
    
    // 否则选择最大的缩略图
    return thumbnails.reduce((best, current) => 
      current.width > best.width ? current : best
    ).url;
  };

  // 生成视频标签
  const generateVideoTags = (keywords: string[], category: string | null, type: string) => {
    const tags = [];
    
    // 添加关键词标签（最多3个）
    if (keywords && keywords.length > 0) {
      tags.push(...keywords.slice(0, 3));
    }
    
    // 添加分类标签
    if (category) {
      tags.push(category.toLowerCase());
    }
    
    // 添加类型标签
    if (type === "NORMAL") {
      tags.push("video");
    } else {
      tags.push(type.toLowerCase());
    }
    
    return tags.slice(0, 5); // 最多5个标签
  };

  const getCategoryColor = (category: string | null) => {
    if (!category) return "bg-gray-100 text-gray-800";
    
    const colorMap: { [key: string]: string } = {
      Technology: "bg-blue-100 text-blue-800",
      Gaming: "bg-purple-100 text-purple-800",
      Entertainment: "bg-pink-100 text-pink-800",
      Music: "bg-green-100 text-green-800",
      Food: "bg-orange-100 text-orange-800",
      News: "bg-red-100 text-red-800",
      Sports: "bg-yellow-100 text-yellow-800",
      Lifestyle: "bg-indigo-100 text-indigo-800",
      Education: "bg-teal-100 text-teal-800",
      Science: "bg-cyan-100 text-cyan-800",
    };
    return colorMap[category] || "bg-gray-100 text-gray-800";
  };

  const getSelectedLabels = () => {
    const language =
      languageCodes.find((l) => l.value === filters.languageCode)?.label ||
      "English";
    const country =
      countryCodes.find((c) => c.value === filters.countryCode)?.label ||
      "United States";
    const section =
      sections.find((s) => s.value === filters.section)?.label || "Now (热门)";
    return { language, country, section };
  };

  const labels = getSelectedLabels();

  return (
    <DashboardLayout
      title="YouTube 热门视频"
      subtitle={`实时追踪 YouTube 热门视频和趋势内容 - ${labels.country} | ${labels.language} | ${labels.section}`}
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
                keys: hotRankingsCache.keys().filter(k => k.includes('youtube'))
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
              筛选条件 - YouTube 热门视频
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="languageCode">语言代码</Label>
                <Select
                  value={filters.languageCode}
                  onValueChange={(value) =>
                    handleFilterChange("languageCode", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageCodes.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label} ({lang.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="countryCode">国家代码</Label>
                <Select
                  value={filters.countryCode}
                  onValueChange={(value) =>
                    handleFilterChange("countryCode", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择国家" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label} ({country.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">类型</Label>
                <Select
                  value={filters.section}
                  onValueChange={(value) =>
                    handleFilterChange("section", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.value} value={section.value}>
                        {section.label}
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
                  setFilters({
                    languageCode: "en",
                    countryCode: "us", 
                    section: "Now"
                  });
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

        {/* 热门视频榜单 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-base">
                <Play className="mr-2 h-4 w-4" />
                热门视频榜单 - {labels.section}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">共 {data.length} 个视频</Badge>
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
                  const thumbnail = getBestThumbnail(item.thumbnails);
                  const tags = generateVideoTags(item.keywords, item.category, item.type);
                  const videoUrl = `https://www.youtube.com/watch?v=${item.video_id}`;
                  
                  return (
                    <div
                      key={item.video_id}
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
                            <TrendingUp className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-500 font-medium">热门</span>
                          </div>
                        </div>

                        {/* 视频缩略图 */}
                        <div className="flex-shrink-0">
                          <div className="relative cursor-pointer" onClick={() => window.open(videoUrl, '_blank')}>
                            <img
                              src={thumbnail}
                              alt={item.title}
                              className="w-24 h-18 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/api/placeholder/210/118";
                              }}
                            />
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                              {item.video_length}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30 rounded">
                              <div className="bg-red-500 rounded-full p-2">
                                <Play className="h-4 w-4 text-white fill-white" />
                              </div>
                            </div>
                            {item.is_live_content && (
                              <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                                直播
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 视频信息 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-base text-red-600 truncate">
                              {item.title}
                            </h3>
                            {item.category && (
                              <Badge
                                className={`text-xs ${getCategoryColor(item.category)}`}
                              >
                                {item.category}
                              </Badge>
                            )}
                            {item.type !== "NORMAL" && (
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback>{item.author[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {item.author}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              • {item.published_time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {item.description && item.description.length > 100 
                              ? `${item.description.substring(0, 100)}...` 
                              : item.description || "暂无描述"}
                          </p>
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

                        {/* 数据指标 */}
                        <div className="flex-shrink-0 text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Eye className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-red-600 text-lg">
                              {formatViewCount(item.number_of_views)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">观看量</p>
                          
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {item.video_length}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">时长</p>
                          
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            #{index + 1}
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex-shrink-0">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs"
                            onClick={() => window.open(videoUrl, '_blank')}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            观看视频
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

        {/* 视频趋势统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总视频数</p>
                  <p className="text-2xl font-bold">{data.length}</p>
                </div>
                <Play className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">当前分类</p>
                  <p className="text-2xl font-bold text-red-600">{labels.section}</p>
                  <p className="text-xs text-red-500">热门分类</p>
                </div>
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-6 w-6 text-red-500" />
                  <span className="text-xs text-red-500 font-medium">分类</span>
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
