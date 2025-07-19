import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { apiClient, type PipixiaHotSearchWord, type PipixiaHotContent } from "@/lib/api";
import { kuaishouHotRankingsCache as cache, createCacheKey, type CacheStatus } from "@/lib/cache";
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
  Zap,
  Settings,
  Trash2,
  AlertTriangle,
  Clock,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 皮皮虾榜单标签配置
const rankingTabs = [
  { id: "search-words", name: "热门搜索词", icon: Search },
  { id: "hot-content", name: "热门内容榜", icon: Play },
];

// 统一的数据类型定义
type UnifiedPipixiaData = PipixiaHotSearchWord | PipixiaHotContent;

export default function PipixiaRankings() {
  const [activeTab, setActiveTab] = useState("search-words");
  const [data, setData] = useState<UnifiedPipixiaData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({ isFromCache: false });

  // 获取对应标签的数据
  const fetchDataForTab = async (tabId: string, forceRefresh = false) => {
    const cacheKey = createCacheKey("pipixia", tabId);
    
    // 如果不是强制刷新，先检查缓存
    if (!forceRefresh) {
      const cachedData = cache.get<UnifiedPipixiaData[]>(cacheKey);
      if (cachedData) {
        const cacheInfo = cache.getCacheInfo(cacheKey);
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
      let response: UnifiedPipixiaData[] = [];
      
      console.log(`开始获取数据，标签: ${tabId}`);
      
      switch (tabId) {
        case "search-words":
          console.log("调用 getPipixiaHotSearchWords API");
          response = await apiClient.getPipixiaHotSearchWords();
          break;
        case "hot-content":
          console.log("调用 getPipixiaHotSearchList API");
          response = await apiClient.getPipixiaHotSearchList();
          break;
        default:
          console.log("未知标签，返回空数据");
          response = [];
      }
      
      console.log(`API响应数据:`, response);
      
      // 将数据存入缓存
      cache.set(cacheKey, response);
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

  // 当标签切换时获取数据
  useEffect(() => {
    console.log(`切换到标签: ${activeTab}`);
    fetchDataForTab(activeTab);
  }, [activeTab]);

  const handleRefresh = (forceRefresh = false) => {
    fetchDataForTab(activeTab, forceRefresh);
  };

  const handleClearCache = () => {
    cache.clear();
    console.log("缓存已清空");
    handleRefresh(true);
  };

  const handleExport = () => {
    console.log("导出皮皮虾数据", { tab: activeTab, data });
  };

  // 格式化时间戳
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp || isNaN(timestamp)) return "未知时间";
    try {
      return new Date(timestamp * 1000).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("时间戳格式化错误:", error);
      return "时间格式错误";
    }
  };

  // 格式化性别
  const formatGender = (gender: number) => {
    switch (gender) {
      case 1: return "男";
      case 2: return "女";
      default: return "未知";
    }
  };

  // 格式化视频时长
  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
                size: cache.size(),
                keys: cache.keys().filter(k => k.includes('pipixia'))
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            {rankingTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-sm p-3">
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 热门搜索词 */}
          <TabsContent value="search-words" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-base">
                    <Search className="mr-2 h-4 w-4" />
                    热门搜索词
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      共 {data.length} 个搜索词
                    </Badge>
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
                {!error && activeTab === "search-words" && (
                  <div className="space-y-4">
                    {(data as PipixiaHotSearchWord[]).map((item, index) => (
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
                            {item.hot_type === 1 && (
                              <Badge className="text-xs bg-red-500">热</Badge>
                            )}
                          </div>

                          {/* 搜索词信息 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-lg text-orange-600">
                                {item.word}
                              </h3>
                              {item.write_history && (
                                <Badge variant="outline" className="text-xs">
                                  记录历史
                                </Badge>
                              )}
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 热门内容榜 */}
          <TabsContent value="hot-content" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-base">
                    <Play className="mr-2 h-4 w-4" />
                    热门内容榜
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      共 {data.length} 个内容
                    </Badge>
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
                {!error && activeTab === "hot-content" && data.length > 0 && (
                  <div className="space-y-4">
                    {(data as PipixiaHotContent[]).map((item, index) => {
                      console.log(`渲染项目 ${index}:`, item);
                      return (
                      <div
                        key={index}
                        className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {/* 排名和视频预览 */}
                        <div className="lg:col-span-1">
                          <div className="flex flex-col items-center space-y-2">
                            {/* 排名 */}
                            <Badge
                              variant={index < 3 ? "default" : "secondary"}
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                            >
                              {index + 1}
                            </Badge>
                            
                            {/* 视频预览 */}
                            <div 
                              className="relative w-full aspect-[9/16] max-w-[120px] rounded-lg overflow-hidden bg-black cursor-pointer group"
                              onClick={() => {
                                if (item.video_url) {
                                  // 创建一个新的视频窗口或模态框来播放视频
                                  const video = document.createElement('video');
                                  video.src = item.video_url;
                                  video.controls = true;
                                  video.autoplay = true;
                                  video.style.cssText = 'width: 100%; height: 100%; max-width: 400px; max-height: 600px;';
                                  
                                  // 创建模态框来显示视频
                                  const modal = document.createElement('div');
                                  modal.style.cssText = `
                                    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                                    background: rgba(0,0,0,0.8); display: flex; align-items: center; 
                                    justify-content: center; z-index: 9999; padding: 20px;
                                  `;
                                  modal.appendChild(video);
                                  
                                  // 点击模态框背景关闭
                                  modal.onclick = (e) => {
                                    if (e.target === modal) {
                                      document.body.removeChild(modal);
                                    }
                                  };
                                  
                                  document.body.appendChild(modal);
                                } else {
                                  console.log('视频URL不可用');
                                }
                              }}
                            >
                              {item.video_url ? (
                                <video
                                  src={item.video_url}
                                  className="w-full h-full object-cover"
                                  controls={false}
                                  preload="metadata"
                                  poster=""
                                  muted
                                  onError={(e) => {
                                    console.error('视频加载失败:', e);
                                    (e.target as HTMLVideoElement).style.display = 'none';
                                  }}
                                >
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <Play className="h-8 w-8 text-gray-400" />
                                  </div>
                                </video>
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <Play className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                              
                              {/* 视频时长覆盖层 */}
                              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                                {formatDuration(item.duration || 0)}
                              </div>
                              
                              {/* 皮皮虾标识 */}
                              <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                                皮皮虾
                              </div>
                              
                              {/* 播放按钮覆盖层 */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                <div className="bg-white/90 rounded-full p-2">
                                  <Play className="h-4 w-4 text-black fill-black" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 作者信息和内容详情 */}
                        <div className="lg:col-span-3">
                          <div className="flex items-start space-x-4">
                            {/* 作者头像 */}
                            <div className="flex-shrink-0">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={item.author_avatar_url} />
                                <AvatarFallback>
                                  {item.author_name?.[0] || "?"}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            {/* 内容信息 */}
                            <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-lg text-orange-600">
                              {item.content || "无标题"}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              视频
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <span>@{item.author_name || "未知作者"}</span>
                            <span>{formatGender(item.author_gender || 0)}</span>
                            <span>{formatDuration(item.duration || 0)}</span>
                            <span>{formatTimestamp(item.item_create_time || 0)}</span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.video_text || "无描述"}
                          </p>

                          {/* 作者数据 */}
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span className="font-medium">
                                  {((item.author_follower_count || 0) / 10000).toFixed(1)}万
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">粉丝</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-1">
                                <Heart className="h-3 w-3" />
                                <span className="font-medium">
                                  {((item.author_like_count || 0) / 10000).toFixed(1)}万
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">获赞</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span className="font-medium">
                                  {((item.today_show_num || 0) / 10000).toFixed(1)}万
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">今日展示</p>
                            </div>
                          </div>

                              {/* 操作按钮 */}
                              <div className="flex flex-wrap gap-2 mt-3">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-xs"
                                  onClick={() => {
                                    if (item.video_url) {
                                      window.open(item.video_url, '_blank');
                                    }
                                  }}
                                >
                                  <Play className="w-3 h-3 mr-1" />
                                  播放视频
                                </Button>
                                <Button size="sm" variant="ghost" className="text-xs">
                                  <Users className="w-3 h-3 mr-1" />
                                  查看作者
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 统计面板 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "search-words" ? "热门搜索词" : "热门内容"}
                  </p>
                  <p className="text-2xl font-bold">{data.length}</p>
                </div>
                {activeTab === "search-words" ? (
                  <Search className="h-8 w-8 text-orange-500" />
                ) : (
                  <Play className="h-8 w-8 text-orange-500" />
                )}
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
