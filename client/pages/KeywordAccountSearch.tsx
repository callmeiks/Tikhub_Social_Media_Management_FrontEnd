import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import type { 
  KeywordUserSearchParams, 
  DouyinUserFilters, 
  TikTokUserFilters, 
  XiaohongshuUserFilters,
  KuaishouUserFilters,
  UserInfluencer,
  GetUserInfluencersParams
} from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  Filter,
  Eye,
  Users,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  Crown,
  Verified,
  Hash,
} from "lucide-react";

const supportedPlatforms = [
  { id: "douyin", name: "抖音", emoji: "🎤", available: true },
  { id: "tiktok", name: "TikTok", emoji: "🎵", available: true },
  { id: "xiaohongshu", name: "小红书", emoji: "📖", available: true },
  { id: "kuaishou", name: "快手", emoji: "⚡", available: true },
  { id: "instagram", name: "Instagram", emoji: "📷", available: false },
  { id: "x", name: "X", emoji: "🐦", available: false },
  { id: "youtube", name: "YouTube", emoji: "📹", available: false },
];

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + "千万";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "百万";
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export default function KeywordAccountSearch() {
  const [keyword, setKeyword] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("douyin");
  const [isSearching, setIsSearching] = useState(false);
  const [influencers, setInfluencers] = useState<UserInfluencer[]>([]);
  const [quantityFilter, setQuantityFilter] = useState("50");
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
  });
  const [searchKeyword, setSearchKeyword] = useState("");

  // Platform-specific filters
  const [douyinFilters, setDouyinFilters] = useState({
    userFans: "all",
    userType: "all",
  });

  const [tiktokFilters, setTiktokFilters] = useState({
    followerCount: "all",
    profileType: "all",
  });

  // Fetch influencers from API
  const fetchInfluencers = async (params: Partial<GetUserInfluencersParams> = {}) => {
    setIsLoading(true);
    try {
      // Map platform names for API request
      const platformMap: Record<string, string> = {
        xiaohongshu: "xhs",
      };
      
      const apiPlatform = platformMap[selectedPlatform] || selectedPlatform;

      const response = await apiClient.getUserInfluencers({
        platform: apiPlatform as "douyin" | "tiktok" | "xhs" | "kuaishou",
        keyword: searchKeyword || undefined,
        page: pagination.page,
        limit: pagination.limit,
        ...params,
      });

      setInfluencers(response.influencers);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    } catch (error) {
      console.error("Error fetching influencers:", error);
      toast({
        title: "加载失败",
        description: "无法获取搜索结果，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load influencers when platform changes
  useEffect(() => {
    const currentPlatform = supportedPlatforms.find((p) => p.id === selectedPlatform);
    if (currentPlatform?.available) {
      fetchInfluencers({ page: 1 });
    }
  }, [selectedPlatform]);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      toast({
        title: "错误",
        description: "请输入搜索关键词",
        variant: "destructive",
      });
      return;
    }

    const currentPlatform = supportedPlatforms.find((p) => p.id === selectedPlatform);
    if (!currentPlatform?.available) {
      toast({
        title: "平台不可用",
        description: `${currentPlatform?.name} 平台暂时不可用`,
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      // Build filters based on platform
      let filters: DouyinUserFilters | TikTokUserFilters | XiaohongshuUserFilters | KuaishouUserFilters = {};
      
      if (selectedPlatform === "douyin") {
        filters = {
          douyin_user_fans: douyinFilters.userFans === "all" ? "" : douyinFilters.userFans,
          douyin_user_type: douyinFilters.userType === "all" ? "" : douyinFilters.userType,
        } as DouyinUserFilters;
      } else if (selectedPlatform === "tiktok") {
        filters = {
          user_search_follower_count: tiktokFilters.followerCount === "all" ? "" : tiktokFilters.followerCount,
          user_search_profile_type: tiktokFilters.profileType === "all" ? "" : tiktokFilters.profileType,
        } as TikTokUserFilters;
      } else if (selectedPlatform === "xiaohongshu") {
        filters = {} as XiaohongshuUserFilters;
      } else if (selectedPlatform === "kuaishou") {
        filters = {} as KuaishouUserFilters;
      }

      // Map platform names for API request
      const platformMap: Record<string, string> = {
        xiaohongshu: "xhs",
      };
      
      const apiPlatform = platformMap[selectedPlatform] || selectedPlatform;

      const params: KeywordUserSearchParams = {
        keyword: keyword.trim(),
        platform: apiPlatform as "douyin" | "tiktok" | "xhs" | "kuaishou",
        user_count: parseInt(quantityFilter),
        filters,
      };

      const response = await apiClient.keywordUserSearch(params);
      
      toast({
        title: "搜索成功",
        description: `搜索任务已创建，任务ID: ${response.task_id}`,
      });

      // Clear results and show success message
      setInfluencers([]);
      
      // Fetch updated results after a delay to allow backend processing
      setTimeout(() => {
        fetchInfluencers();
      }, 3000);
      
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "搜索失败",
        description: error instanceof Error ? error.message : "搜索请求失败，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getQuantityFilterComponent = () => (
    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        <Hash className="h-4 w-4 text-indigo-500" />
        返回数量
      </label>
      <Select value={quantityFilter} onValueChange={setQuantityFilter}>
        <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-indigo-400 transition-colors w-full sm:w-48">
          <SelectValue placeholder="选择返回数量" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="50">📊 50条结果</SelectItem>
          <SelectItem value="100">📈 100条结果</SelectItem>
          <SelectItem value="500">📉 500条结果</SelectItem>
          <SelectItem value="1000">📋 1000条结果</SelectItem>
          <SelectItem value="1000+">🚀 1000+条结果</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const getPlatformFilterComponent = () => {
    switch (selectedPlatform) {
      case "douyin":
        return (
          <div className="space-y-4">
            {getQuantityFilterComponent()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Users className="h-4 w-4 text-blue-500" />
                  粉丝数量筛选
                </label>
                <Select
                  value={douyinFilters.userFans}
                  onValueChange={(value) =>
                    setDouyinFilters((prev) => ({ ...prev, userFans: value }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="选择粉丝数量范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌟 不限制</SelectItem>
                    <SelectItem value="0_1k">👤 1000以下</SelectItem>
                    <SelectItem value="1k_1w">👥 1000到1万</SelectItem>
                    <SelectItem value="1w_10w">🔥 1万到10万</SelectItem>
                    <SelectItem value="10w_100w">⭐ 10万到100万</SelectItem>
                    <SelectItem value="100w_">💎 100万以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Verified className="h-4 w-4 text-green-500" />
                  用户类型筛选
                </label>
                <Select
                  value={douyinFilters.userType}
                  onValueChange={(value) =>
                    setDouyinFilters((prev) => ({ ...prev, userType: value }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-green-400 transition-colors">
                    <SelectValue placeholder="选择用户认证类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌟 不限制</SelectItem>
                    <SelectItem value="common_user">👤 普通用户</SelectItem>
                    <SelectItem value="enterprise_user">
                      🏢 企业认证用户
                    </SelectItem>
                    <SelectItem value="personal_user">
                      ✅ 个人认证用户
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "tiktok":
        return (
          <div className="space-y-4">
            {getQuantityFilterComponent()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Users className="h-4 w-4 text-pink-500" />
                  粉丝数排序
                </label>
                <Select
                  value={tiktokFilters.followerCount}
                  onValueChange={(value) =>
                    setTiktokFilters((prev) => ({
                      ...prev,
                      followerCount: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-pink-400 transition-colors">
                    <SelectValue placeholder="选择粉丝数量范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌟 不限制</SelectItem>
                    <SelectItem value="ZERO_TO_ONE_K">👤 0-1K</SelectItem>
                    <SelectItem value="ONE_K_TO_TEN_K">👥 1K-10K</SelectItem>
                    <SelectItem value="TEN_K_TO_ONE_H_K">
                      🔥 10K-100K
                    </SelectItem>
                    <SelectItem value="ONE_H_K_PLUS">💎 100K以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  账号类型排序
                </label>
                <Select
                  value={tiktokFilters.profileType}
                  onValueChange={(value) =>
                    setTiktokFilters((prev) => ({
                      ...prev,
                      profileType: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-yellow-400 transition-colors">
                    <SelectValue placeholder="选择账号认证类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌟 不限制</SelectItem>
                    <SelectItem value="VERIFIED">✅ 认证用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "xiaohongshu":
      case "kuaishou":
        return (
          <div className="space-y-4">
            {getQuantityFilterComponent()}
          </div>
        );

      case "instagram":
      case "x":
      case "youtube":
        return (
          <div className="space-y-4">
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30">
                  <div className="text-2xl">
                    {
                      supportedPlatforms.find((p) => p.id === selectedPlatform)
                        ?.emoji
                    }
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {
                      supportedPlatforms.find((p) => p.id === selectedPlatform)
                        ?.name
                    }
                  </p>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    Currently Unavailable
                  </p>
                  <p className="text-xs text-gray-500">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Handle keyword search in results
  const handleKeywordSearch = () => {
    fetchInfluencers({ 
      keyword: searchKeyword, 
      page: 1 
    });
  };

  const getVerificationIcon = (verified: boolean) => {
    if (!verified) return null;
    return <Verified className="h-3 w-3 text-blue-500" />;
  };

  return (
    <DashboardLayout
      title="关键���账号查询"
      subtitle="通过关键词搜索各平台相关账号"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            刷新数据
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Tabs
          value={selectedPlatform}
          onValueChange={setSelectedPlatform}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-7">
            {supportedPlatforms.map((platform) => (
              <TabsTrigger
                key={platform.id}
                value={platform.id}
                disabled={!platform.available}
                className={`flex items-center gap-1 text-xs ${
                  !platform.available 
                    ? "opacity-50 cursor-not-allowed relative" 
                    : ""
                }`}
              >
                <span>{platform.emoji}</span>
                <span className="hidden sm:inline">{platform.name}</span>
                {!platform.available && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                    !
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {supportedPlatforms.map((platform) => (
            <TabsContent key={platform.id} value={platform.id} className="mt-6">
              {!platform.available ? (
                <Card className="border-2 border-dashed border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
                  <CardContent className="p-8">
                    <div className="text-center space-y-4">
                      <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto w-fit">
                        <span className="text-3xl">{platform.emoji}</span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                          {platform.name} 暂不可用
                        </h3>
                        <p className="text-sm text-red-600 dark:text-red-300 max-w-md mx-auto">
                          该平台的账号搜索功能正在开发中，敬请期待。您可以先使用其他平台的搜索功能。
                        </p>
                      </div>
                      <div className="flex justify-center gap-2">
                        <Badge variant="destructive" className="text-xs">
                          开发中
                        </Badge>
                        <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                          即将推出
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                {/* Enhanced Search Section */}
                <Card className="border-2 border-dashed border-muted bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center justify-center">
                      <div className="flex items-center gap-3 text-center">
                        <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-blue-600 text-white">
                          <Users className="h-5 w-5" />
                        </div>
                        <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-bold">
                          {platform.name} 账号搜索
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Enhanced Search Bar */}
                    <div className="relative">
                      <div className="flex gap-3 items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="relative flex-1">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder={`👤 在${platform.name}搜索您想找的账号...`}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="pl-10 pr-4 py-3 text-base border-0 bg-transparent focus:ring-0 focus:outline-none"
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleSearch()
                            }
                          />
                        </div>
                        <Button
                          onClick={handleSearch}
                          disabled={isSearching || !keyword.trim()}
                          className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                          {isSearching ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              搜索中...
                            </>
                          ) : (
                            <>
                              <Search className="mr-2 h-4 w-4" />
                              发现账号
                            </>
                          )}
                        </Button>
                      </div>
                      {/* Search suggestions hint */}
                      <div className="mt-2 text-center">
                        <p className="text-xs text-gray-500">
                          💡 试试搜索: "美妆博主"、"科技up主"、"美食达人"
                          等热门创作者
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Platform-specific filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 text-white">
                          <Filter className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          精准筛选条件
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800"></div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        {getPlatformFilterComponent()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        搜索结果 ({pagination.total})
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="关键词筛选..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-40 h-8"
                            onKeyPress={(e) => e.key === "Enter" && handleKeywordSearch()}
                          />
                          <Button
                            size="sm"
                            onClick={handleKeywordSearch}
                            disabled={isLoading}
                            className="h-8"
                          >
                            <Search className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          disabled={influencers.length === 0}
                          className="h-8 brand-accent"
                        >
                          <Download className="mr-2 h-3.5 w-3.5" />
                          导出结果
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">
                        <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
                        <p className="text-sm text-muted-foreground">正在加载搜索结果...</p>
                      </div>
                    ) : influencers.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {searchKeyword
                            ? `没有找到关键词 "${searchKeyword}" 的相关账号`
                            : "暂无搜索结果，请尝试搜索关键词获取账号数据"}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">账号</TableHead>
                              <TableHead className="w-[100px]">
                                粉丝数
                              </TableHead>
                              <TableHead className="w-[80px]">关注</TableHead>
                              <TableHead className="w-[80px]">作品</TableHead>
                              <TableHead className="w-[100px]">平台</TableHead>
                              <TableHead className="w-[150px]">认证状态</TableHead>
                              <TableHead className="w-[120px]">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {influencers.map((influencer) => (
                              <TableRow key={influencer.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                      {influencer.avatar_url ? (
                                        <img 
                                          src={influencer.avatar_url} 
                                          alt={influencer.nickname}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                          {influencer.nickname.charAt(0)}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1">
                                        <span className="font-medium text-sm">
                                          {influencer.nickname}
                                        </span>
                                        {getVerificationIcon(influencer.is_verified)}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        @{influencer.username}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="flex items-center">
                                    <Users className="h-3 w-3 mr-1 text-blue-500" />
                                    {formatNumber(influencer.follower_count)}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatNumber(influencer.following_count)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatNumber(influencer.post_count)}
                                </TableCell>
                                <TableCell className="text-sm">
                                  <Badge variant="outline" className="text-xs">
                                    {influencer.platform.toUpperCase()}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      influencer.is_verified ? "default" : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {influencer.is_verified ? "已认证" : "未认证"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() =>
                                        window.open(influencer.profile_url, "_blank")
                                      }
                                      title="访问主页"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => fetchInfluencers({ page: pagination.page })}
                                      title="刷新数据"
                                    >
                                      <RefreshCw className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
