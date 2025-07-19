import React, { useState, useEffect } from "react";
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
  Zap,
  Settings,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient, type XiaohongshuHotRankingItem } from "@/lib/api";
import { hotRankingsCache, createCacheKey, type CacheStatus } from "@/lib/cache";

export default function XiaohongshuRankings() {
  const [data, setData] = useState<XiaohongshuHotRankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({ isFromCache: false });

  // 获取小红书热榜数据
  const fetchData = async (forceRefresh = false) => {
    const cacheKey = createCacheKey("xiaohongshu", "hot-list");
    
    // 如果不是强制刷新，先检查缓存
    if (!forceRefresh) {
      const cachedData = hotRankingsCache.get<XiaohongshuHotRankingItem[]>(cacheKey);
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
      console.log("调用小红书热榜API");
      const response = await apiClient.getXiaohongshuHotList();
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

  const handleRefresh = (forceRefresh = false) => {
    fetchData(forceRefresh);
  };

  const handleExport = () => {
    console.log("导出小红书热门话题数据", data);
  };

  const handleClearCache = () => {
    hotRankingsCache.clear();
    console.log("缓存已清空");
    handleRefresh(true);
  };

  // 根据排名变化获取趋势图标和信息
  const getTrendIcon = (rankChange: number) => {
    if (rankChange > 0) {
      return (
        <div className="flex items-center space-x-1">
          <ArrowUpIcon className="w-3 h-3 text-red-500" />
          <span className="text-xs text-red-500 font-medium">+{rankChange}</span>
        </div>
      );
    } else if (rankChange < 0) {
      return (
        <div className="flex items-center space-x-1">
          <ArrowDownIcon className="w-3 h-3 text-green-500" />
          <span className="text-xs text-green-500 font-medium">{rankChange}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 text-gray-400 flex items-center justify-center">-</span>
          <span className="text-xs text-gray-400">持平</span>
        </div>
      );
    }
  };

  // 获取排名变化的描述文本
  const getRankChangeDescription = (rankChange: number) => {
    if (rankChange > 0) {
      return `上升 ${rankChange} 位`;
    } else if (rankChange < 0) {
      return `下降 ${Math.abs(rankChange)} 位`;
    } else {
      return "排名无变化";
    }
  };

  // 根据话题类型获取徽章样式
  const getWordTypeBadge = (wordType: string) => {
    const typeMap: { [key: string]: { color: string; text: string } } = {
      "新": { color: "bg-red-500 text-white", text: "新" },
      "热": { color: "bg-orange-500 text-white", text: "热" },
      "爆": { color: "bg-red-600 text-white", text: "爆" },
      "沸": { color: "bg-purple-500 text-white", text: "沸" }
    };
    
    const config = typeMap[wordType] || { color: "bg-gray-500 text-white", text: wordType };
    
    return (
      <Badge className={`text-xs ${config.color}`}>
        {config.text}
      </Badge>
    );
  };

  // 统计数据
  const getStatistics = () => {
    const upCount = data.filter(item => item.rank_change > 0).length;
    const downCount = data.filter(item => item.rank_change < 0).length;
    const stableCount = data.filter(item => item.rank_change === 0).length;
    const newCount = data.filter(item => item.word_type === "新").length;
    const hotCount = data.filter(item => item.word_type === "热").length;
    
    // 计算平均排名变化
    const totalRankChange = data.reduce((sum, item) => sum + Math.abs(item.rank_change), 0);
    const avgRankChange = data.length > 0 ? (totalRankChange / data.length).toFixed(1) : "0";
    
    return { 
      upCount, 
      downCount, 
      stableCount, 
      newCount, 
      hotCount,
      avgRankChange,
      total: data.length 
    };
  };

  const stats = getStatistics();

  return (
    <DashboardLayout
      title="小红书热门话题"
      subtitle="实时追踪小红书平台热门话题和讨论趋势"
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
                keys: hotRankingsCache.keys().filter(k => k.includes('xiaohongshu'))
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
                {data.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {/* 排名和趋势 */}
                      <div className="flex-shrink-0 flex items-center space-x-2">
                        <Badge
                          variant={index < 3 ? "default" : "secondary"}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          {index + 1}
                        </Badge>
                        {getTrendIcon(item.rank_change)}
                      </div>

                      {/* 话题图标 */}
                      <div className="flex-shrink-0">
                        {item.icon ? (
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={item.icon} />
                            <AvatarFallback>📖</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <Hash className="w-5 h-5 text-pink-600" />
                          </div>
                        )}
                      </div>

                      {/* 话题信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-lg text-pink-600 truncate">
                            {item.title || "无标题"}
                          </h3>
                          {getWordTypeBadge(item.word_type || "")}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                          <span>话题ID: {item.id}</span>
                          <span>•</span>
                          <span>类型: {item.type || "normal"}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-muted-foreground">排名变化:</span>
                          <span className={`font-medium ${
                            item.rank_change > 0 ? 'text-red-600' : 
                            item.rank_change < 0 ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {getRankChangeDescription(item.rank_change)}
                          </span>
                        </div>
                      </div>

                      {/* 热度值和排名变化 */}
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center justify-end space-x-1 mb-1">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          <span className="font-medium text-orange-600 text-lg">
                            {item.score || "N/A"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">热度值</p>
                        
                        {/* 排名变化指示器 */}
                        <div className="flex items-center justify-end">
                          {item.rank_change !== 0 && (
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.rank_change > 0 
                                ? 'bg-red-50 text-red-700 border border-red-200' 
                                : 'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                              {item.rank_change > 0 ? (
                                <>
                                  <ArrowUpIcon className="w-3 h-3 mr-1" />
                                  {item.rank_change}
                                </>
                              ) : (
                                <>
                                  <ArrowDownIcon className="w-3 h-3 mr-1" />
                                  {Math.abs(item.rank_change)}
                                </>
                              )}
                            </div>
                          )}
                          {item.rank_change === 0 && (
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                              <span className="w-3 h-3 mr-1 flex items-center justify-center">-</span>
                              持平
                            </div>
                          )}
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
            )}
          </CardContent>
        </Card>

        {/* 话题趋势统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总话题数</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
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
                  <p className="text-2xl font-bold text-red-600">{stats.upCount}</p>
                  <p className="text-xs text-red-500">排名上升</p>
                </div>
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-6 w-6 text-red-500" />
                  <ArrowUpIcon className="h-4 w-4 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">下降话题</p>
                  <p className="text-2xl font-bold text-green-600">{stats.downCount}</p>
                  <p className="text-xs text-green-500">排名下降</p>
                </div>
                <div className="flex flex-col items-center">
                  <TrendingDown className="h-6 w-6 text-green-500" />
                  <ArrowDownIcon className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">持平话题</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.stableCount}</p>
                  <p className="text-xs text-gray-500">排名不变</p>
                </div>
                <div className="flex flex-col items-center">
                  <Hash className="h-6 w-6 text-gray-500" />
                  <span className="h-4 w-4 text-gray-500 flex items-center justify-center text-lg">-</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">新增话题</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.newCount}</p>
                  <p className="text-xs text-orange-500">新上榜</p>
                </div>
                <Badge className="h-8 w-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">
                  新
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均变化</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.avgRankChange}</p>
                  <p className="text-xs text-blue-500">平均位次</p>
                </div>
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                  <span className="text-xs text-blue-500 font-medium">变化</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}