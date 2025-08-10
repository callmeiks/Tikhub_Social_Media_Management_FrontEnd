import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Users,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Globe,
  ExternalLink,
  ChevronDown,
  Eye,
  Heart,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { AvatarImage } from "@/components/ui/avatar-image";

// 缓存管理器
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SearchDataCache {
  private defaultTTL = 15 * 60 * 1000; // 15 minutes
  
  set<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
      ttl: this.defaultTTL
    }));
  }
  
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    try {
      const parsed = JSON.parse(item);
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data as T;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }
}

// 创建全局缓存实例
const searchCache = new SearchDataCache();

// 工具函数
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// API 响应接口
interface TikTokCreatorItem {
  item_id: string;
  cover_url: string;
  tt_link: string;
  vv: number;
  liked_cnt: number;
  create_time: number;
}

interface TikTokCreatorResult {
  tcm_id: string;
  user_id: string;
  nick_name: string;
  avatar_url: string;
  country_code: string;
  follower_cnt: number;
  liked_cnt: number;
  tt_link: string;
  tcm_link: string;
  items: TikTokCreatorItem[];
}

interface TikTokSearchResponse {
  results: TikTokCreatorResult[];
  total: number;
  saved_count: number;
}

// 搜索表单接口
interface SearchFilters {
  max_creators: number;
  sort_by: string;
  creator_country: string;
}

export default function TikTokCreatorSearch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<TikTokCreatorResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    max_creators: 50,
    sort_by: "follower",
    creator_country: "all",
  });

  // 生成缓存键
  const generateCacheKey = (filters: SearchFilters): string => {
    const params = new URLSearchParams();
    params.append('max_creators', filters.max_creators.toString());
    params.append('sort_by', filters.sort_by);
    if (filters.creator_country && filters.creator_country !== 'all') {
      params.append('creator_country', filters.creator_country);
    }
    return `tiktok-creator-search:${params.toString()}`;
  };

  useEffect(() => {
    // 页面加载时恢复缓存的搜索结果
    const cacheKey = generateCacheKey(filters);
    const cachedData = searchCache.get<{
      results: TikTokCreatorResult[];
      total: number;
      saved_count: number;
      filters: SearchFilters;
    }>(cacheKey);
    
    if (cachedData) {
      setSearchResults(cachedData.results);
      setTotalResults(cachedData.total);
      setSavedCount(cachedData.saved_count);
      setFilters(cachedData.filters);
      setHasSearched(true);
    }
  }, []);

  const handleSearch = async () => {
    if (loading) return;
    
    setLoading(true);
    setHasSearched(true);

    try {
      // 检查缓存
      const cacheKey = generateCacheKey(filters);
      const cachedData = searchCache.get<{
        results: TikTokCreatorResult[];
        total: number;
        saved_count: number;
        filters: SearchFilters;
      }>(cacheKey);
      
      if (cachedData) {
        setSearchResults(cachedData.results);
        setTotalResults(cachedData.total);
        setSavedCount(cachedData.saved_count);
        setLoading(false);
        return;
      }

      // 调用API
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api`
        : "http://127.0.0.1:8000/api";
        
      const token = import.meta.env.VITE_BACKEND_API_TOKEN || localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/kol/tiktok/search-creators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          max_creators: filters.max_creators,
          sort_by: filters.sort_by,
          ...(filters.creator_country && filters.creator_country !== 'all' && { creator_country: filters.creator_country })
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TikTokSearchResponse = await response.json();
      
      setSearchResults(data.results);
      setTotalResults(data.total);
      setSavedCount(data.saved_count);
      
      // 缓存结果
      searchCache.set(cacheKey, {
        results: data.results,
        total: data.total,
        saved_count: data.saved_count,
        filters: { ...filters }
      });
      
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setTotalResults(0);
      setSavedCount(0);
    } finally {
      setLoading(false);
    }
  };


  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      max_creators: 50,
      sort_by: "follower",
      creator_country: "all",
    });
  };

  const getCreatorLevel = (creator: TikTokCreatorResult): string => {
    if (creator.follower_cnt > 5000000) return "Diamond";
    if (creator.follower_cnt > 2000000) return "Gold";
    if (creator.follower_cnt > 1000000) return "Silver";
    if (creator.follower_cnt > 100000) return "Bronze";
    return "Rising";
  };

  const getCreatorLevelColor = (level: string): string => {
    switch (level) {
      case "Diamond":
        return "bg-purple-100 text-purple-800";
      case "Gold":
        return "bg-yellow-100 text-yellow-800";
      case "Silver":
        return "bg-gray-100 text-gray-800";
      case "Bronze":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getCountryName = (countryCode: string): string => {
    const countryNames: Record<string, string> = {
      'US': 'United States',
      'GB': 'United Kingdom', 
      'CA': 'Canada',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'JP': 'Japan',
      'KR': 'South Korea',
      'CN': 'China',
      'IN': 'India',
      'BR': 'Brazil',
      'MX': 'Mexico',
      'ES': 'Spain',
      'IT': 'Italy',
      'NL': 'Netherlands'
    };
    return countryNames[countryCode] || countryCode;
  };

  return (
    <DashboardLayout
      title="TikTok Creator Search"
      subtitle="Discover and analyze top TikTok creators for your marketing campaigns"
    >
      <div className="space-y-6">
        {/* Service Unavailable Notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">服务暂不可用</h3>
                <p className="text-amber-700 mb-4">
                  TikTok创作者搜索功能目前暂时不可用。我们正在努力恢复此功能，请稍后再试。
                </p>
                <p className="text-sm text-amber-600">
                  如有紧急需求，请联系客服或使用其他平台的创作者搜索功能。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 搜索区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Search className="mr-2 h-4 w-4" />
              TikTok Creator Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 搜索参数 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Max Creators</Label>
                <Select
                  value={filters.max_creators.toString()}
                  onValueChange={(value) => handleFilterChange("max_creators", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Sort By</Label>
                <Select
                  value={filters.sort_by}
                  onValueChange={(value) => handleFilterChange("sort_by", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follower">Followers</SelectItem>
                    <SelectItem value="avg_views">Average Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Creator Country</Label>
                <Select
                  value={filters.creator_country}
                  onValueChange={(value) => handleFilterChange("creator_country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="JP">Japan</SelectItem>
                    <SelectItem value="KR">South Korea</SelectItem>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="BR">Brazil</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                    <SelectItem value="ES">Spain</SelectItem>
                    <SelectItem value="IT">Italy</SelectItem>
                    <SelectItem value="NL">Netherlands</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <Button
                  onClick={handleSearch}
                  disabled={true}
                  className="flex-1 opacity-50 cursor-not-allowed"
                >
                  <Search className="mr-2 h-4 w-4" />
                  搜索暂不可用
                </Button>
                <Button variant="outline" onClick={clearFilters} disabled={true} className="opacity-50 cursor-not-allowed">
                  清除
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* 搜索结果 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Search Results {hasSearched && `(${totalResults} total, ${savedCount} saved)`}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Searching creators...
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">
                          Creator Info
                        </TableHead>
                        <TableHead className="w-[100px]">Followers</TableHead>
                        <TableHead className="w-[100px]">Total Likes</TableHead>
                        <TableHead className="w-[100px]">Avg Views</TableHead>
                        <TableHead className="w-[80px]">Level</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="text-muted-foreground">
                              {hasSearched ? (
                                <>
                                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                                  <p className="text-sm">Try different search parameters</p>
                                </>
                              ) : (
                                <>
                                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                  <h3 className="text-lg font-medium mb-2">Ready to Search</h3>
                                  <p className="text-sm">Click "Search" to find TikTok creators</p>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        searchResults.map((creator) => {
                          const avgViews = creator.items.length > 0 
                            ? creator.items.reduce((sum, item) => sum + item.vv, 0) / creator.items.length
                            : 0;
                          return (
                          <TableRow
                            key={creator.tcm_id}
                            className="cursor-pointer hover:bg-gray-50"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <AvatarImage
                                  src={creator.avatar_url || ""}
                                  alt={creator.nick_name}
                                  fallbackText={creator.nick_name.charAt(0)}
                                  size="md"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">
                                    {creator.nick_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    @{creator.user_id}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1 flex items-center">
                                    <Globe className="h-3 w-3 mr-1" />
                                    {getCountryName(creator.country_code)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatNumber(creator.follower_cnt)}
                            </TableCell>
                            <TableCell>
                              {formatNumber(creator.liked_cnt)}
                            </TableCell>
                            <TableCell>
                              {formatNumber(Math.round(avgViews))}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getCreatorLevelColor(
                                  getCreatorLevel(creator),
                                )}
                              >
                                {getCreatorLevel(creator)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      title="View Videos"
                                    >
                                      <ChevronDown className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-80">
                                    <div className="p-2">
                                      <div className="font-medium text-sm mb-2">Recent Videos</div>
                                      {creator.items.length === 0 ? (
                                        <div className="text-center text-muted-foreground py-4">
                                          No videos available
                                        </div>
                                      ) : (
                                        <div className="space-y-2 max-h-80 overflow-y-auto">
                                          {creator.items.slice(0, 10).map((video, index) => (
                                            <div key={video.item_id} className="border rounded-lg p-2 hover:bg-gray-50">
                                              <div className="flex space-x-2">
                                                <img 
                                                  src={video.cover_url} 
                                                  alt="Video cover"
                                                  className="w-16 h-12 object-cover rounded"
                                                />
                                                <div className="flex-1 min-w-0">
                                                  <div className="text-xs text-muted-foreground mb-1">
                                                    {new Date(video.create_time * 1000).toLocaleDateString()}
                                                  </div>
                                                  <div className="flex items-center space-x-3 text-xs">
                                                    <div className="flex items-center space-x-1">
                                                      <Eye className="h-3 w-3" />
                                                      <span>{formatNumber(video.vv)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                      <Heart className="h-3 w-3" />
                                                      <span>{formatNumber(video.liked_cnt)}</span>
                                                    </div>
                                                  </div>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2 mt-1 text-xs"
                                                    onClick={() => window.open(video.tt_link, "_blank")}
                                                  >
                                                    <ExternalLink className="h-2 w-2 mr-1" />
                                                    View
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    window.open(creator.tt_link, "_blank")
                                  }
                                  title="Visit Profile"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )})
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 搜索统计 */}
        {hasSearched && searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Search Results Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatNumber(
                      Math.round(
                        searchResults.reduce(
                          (sum, creator) => sum + creator.follower_cnt,
                          0,
                        ) / searchResults.length,
                      ),
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg Followers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(
                      searchResults.reduce(
                        (sum, creator) => sum + creator.items.length,
                        0,
                      ) / searchResults.length,
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg Videos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatNumber(
                      Math.round(
                        searchResults.reduce(
                          (sum, creator) => sum + creator.liked_cnt,
                          0,
                        ) / searchResults.length,
                      ),
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {searchResults.reduce(
                      (sum, creator) => sum + creator.items.length,
                      0,
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Videos
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}