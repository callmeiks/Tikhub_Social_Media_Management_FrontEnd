import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { apiClient, type KuaishouHotRankingItem, type KuaishouHotUser, type KuaishouHotLive, type KuaishouHotProduct, type KuaishouHotBrandParams, type KuaishouHotLiveParams } from "@/lib/api";
import { kuaishouHotRankingsCache, createCacheKey, type CacheStatus } from "@/lib/cache";
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
  AlertTriangle,
  Settings,
  Trash2,
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

// 统一的数据类型定义
type UnifiedRankingData = KuaishouHotRankingItem | KuaishouHotUser | KuaishouHotLive | KuaishouHotProduct;

interface FilterState {
  type: string;
}

export default function KuaishouRankings() {
  const [activeTab, setActiveTab] = useState("hot");
  const [filters, setFilters] = useState<FilterState>({
    type: "",
  });
  const [data, setData] = useState<UnifiedRankingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({ isFromCache: false });

  // 获取对应标签的数据
  const fetchDataForTab = async (tabId: string, filterType?: string, forceRefresh = false) => {
    const cacheKey = createCacheKey("kuaishou", tabId, filterType);
    
    // 如果不是强制刷新，先检查缓存
    if (!forceRefresh) {
      const cachedData = kuaishouHotRankingsCache.get<UnifiedRankingData[]>(cacheKey);
      if (cachedData) {
        const cacheInfo = kuaishouHotRankingsCache.getCacheInfo(cacheKey);
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
      let response: UnifiedRankingData[] = [];
      
      switch (tabId) {
        case "hot":
          response = await apiClient.getKuaishouHotBoard();
          break;
        case "entertainment":
          response = await apiClient.getKuaishouHotEntertainmentBoard();
          break;
        case "society":
          response = await apiClient.getKuaishouHotSocialBoard();
          break;
        case "useful":
          response = await apiClient.getKuaishouHotUsefulBoard();
          break;
        case "challenge":
          response = await apiClient.getKuaishouHotChallengeBoard();
          break;
        case "person":
          response = await apiClient.getKuaishouHotSearchUsersRank();
          break;
        case "live":
          const liveParams: KuaishouHotLiveParams = {
            sub_tab_id: filterType ? liveRankingTypes.indexOf(filterType) : 0,
            sub_tab_name: filterType || null,
          };
          response = await apiClient.getKuaishouHotLiveRank(liveParams);
          break;
        case "shopping":
          if (filterType === "热销商品榜单" || !filterType) {
            response = await apiClient.getKuaishouHotShoppingRank();
          } else {
            // 热门主播榜单暂时使用空数据
            response = [];
          }
          break;
        case "brand":
          if (filterType) {
            const brandParams: KuaishouHotBrandParams = {
              sub_tab_id: brandRankingTypes.indexOf(filterType) + 1,
              sub_tab_name: filterType,
            };
            response = await apiClient.getKuaishouHotBrandRank(brandParams);
          } else {
            response = [];
          }
          break;
        default:
          response = [];
      }
      
      // 将数据存入缓存
      kuaishouHotRankingsCache.set(cacheKey, response);
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
    fetchDataForTab(activeTab, filters.type);
  }, [activeTab]);

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

  const handleSearch = (forceRefresh = false) => {
    fetchDataForTab(activeTab, filters.type, forceRefresh);
  };

  const handleExport = () => {
    console.log("导出数据", { tab: activeTab, filters, data });
  };

  const handleClearCache = () => {
    kuaishouHotRankingsCache.clear();
    console.log("缓存已清空");
    // 清空缓存后重新获取数据
    handleSearch(true);
  };

  // 根据不同的数据类型转换为统一的表格数据
  const getTableData = () => {
    if (!data || data.length === 0) return [];
    
    return data.map((item, index) => {
      const baseData = {
        rank: index + 1,
        change: "stable",
        avatar: "",
        name: "",
        handle: "",
        category: "",
        followers: "",
        likes: "",
        comments: "",
        shares: "",
        views: "",
        engagement: "",
        growth: "",
        score: "",
      };

      // 处理关键词热榜数据 (hot, entertainment, society, useful, challenge)
      if ('keyword' in item && 'hotValue' in item) {
        const rankingItem = item as KuaishouHotRankingItem;
        return {
          ...baseData,
          name: rankingItem.keyword,
          handle: `ID: ${rankingItem.id}`,
          category: rankingItem.is_tophot ? "置顶" : "热门",
          score: rankingItem.hotValue.toLocaleString(),
          avatar: rankingItem.is_tophot ? "🔥" : "📈",
        };
      }

      // 处理用户热榜数据 (person)
      if ('order_index' in item && 'author_id' in item) {
        const userItem = item as KuaishouHotUser;
        return {
          ...baseData,
          rank: userItem.order_index,
          name: userItem.title,
          handle: `ID: ${userItem.author_id}`,
          category: "用户",
          score: userItem.hotValue.toLocaleString(),
          avatar: userItem.avatar,
        };
      }

      // 处理直播榜数据 (live)
      if ('viewType' in item && 'authorid' in item && 'param_type' in item) {
        const liveItem = item as KuaishouHotLive;
        return {
          ...baseData,
          name: liveItem.title,
          handle: `@${liveItem.authorid}`,
          category: "直播",
          score: liveItem.hot_score,
          avatar: liveItem.avatar_url,
        };
      }

      // 处理商品榜数据 (shopping)
      if ('product_price' in item && 'product_review' in item) {
        const productItem = item as KuaishouHotProduct;
        return {
          ...baseData,
          name: productItem.title,
          handle: `价格: ¥${productItem.product_price}`,
          category: "商品",
          score: productItem.hot_score,
          avatar: productItem.avatar_url,
          engagement: productItem.product_review,
        };
      }

      return baseData;
    });
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
            onClick={() => handleSearch(false)}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? '加载中...' : '刷新数据'}
          </Button>
          <Button 
            className="brand-accent" 
            onClick={() => handleSearch(true)}
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
                size: kuaishouHotRankingsCache.size(),
                keys: kuaishouHotRankingsCache.keys()
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
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setFilters({ type: "" });
                          setTimeout(() => fetchDataForTab(activeTab, ""), 100);
                        }}
                      >
                        重置
                      </Button>
                      <Button onClick={() => handleSearch(false)} disabled={isLoading}>
                        {isLoading ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? "搜索中..." : "搜索"}
                      </Button>
                      <Button 
                        onClick={() => handleSearch(true)} 
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
                      <Badge variant="secondary">共 {getTableData().length} 条数据</Badge>
                      {cacheStatus.isFromCache && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Zap className="w-3 h-3 mr-1" />
                          缓存
                        </Badge>
                      )}
                      {!cacheStatus.isFromCache && !isLoading && getTableData().length > 0 && (
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
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-sm text-muted-foreground">
                          <th className="text-left p-2">#</th>
                          <th className="text-left p-2">名称/内容</th>
                          <th className="text-left p-2">类型</th>
                          <th className="text-left p-2">详情</th>
                          <th className="text-left p-2">热度值</th>
                          <th className="text-left p-2">附加信息</th>
                          <th className="text-left p-2">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {error && (
                          <tr>
                            <td colSpan={7} className="p-8 text-center">
                              <div className="text-red-500 flex items-center justify-center space-x-2">
                                <AlertTriangle className="h-5 w-5" />
                                <span>{error}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSearch(true)}
                                className="mt-2"
                              >
                                重试
                              </Button>
                            </td>
                          </tr>
                        )}
                        {!error && !isLoading && getTableData().length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-muted-foreground">
                              暂无数据
                            </td>
                          </tr>
                        )}
                        {!error && getTableData().map((item, index) => (
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
                                {item.avatar && item.avatar.startsWith('http') ? (
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={item.avatar} />
                                    <AvatarFallback>
                                      {item.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <div className="w-8 h-8 flex items-center justify-center text-lg">
                                    {item.avatar || "📊"}
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-sm">
                                    {item.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            </td>
                            <td className="p-2 text-sm text-muted-foreground">
                              {item.handle}
                            </td>
                            <td className="p-2 text-sm font-medium text-orange-600">
                              {item.score}
                            </td>
                            <td className="p-2 text-sm">
                              {item.engagement || "-"}
                            </td>
                            <td className="p-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs"
                              >
                                查看详情
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
