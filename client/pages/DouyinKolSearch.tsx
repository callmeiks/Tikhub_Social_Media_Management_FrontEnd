import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Users,
  Heart,
  Play,
  Star,
  Filter,
  ChevronRight,
  Eye,
  MessageCircle,
  Share2,
  RefreshCw,
  BarChart3,
  TrendingUp,
  MapPin,
  Calendar,
  UserCheck,
  Award,
  ExternalLink,
} from "lucide-react";
import { apiClient, type DouyinInfluencer } from "@/lib/api";
import { AvatarImage } from "@/components/ui/avatar-image";

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}千`;
  }
  return num.toString();
};

// 搜索表单接口
interface SearchFilters {
  keyword: string;
  followerRange: string;
  region: string;
  gender: string;
  ageRange: string;
  category: string;
  hasCommerce: boolean;
  isXingtuKol: boolean;
  sortBy: string;
}

export default function DouyinKolSearch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<DouyinInfluencer[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const resultsPerPage = 20;

  const [filters, setFilters] = useState<SearchFilters>({
    keyword: "",
    followerRange: "",
    region: "",
    gender: "",
    ageRange: "",
    category: "",
    hasCommerce: false,
    isXingtuKol: false,
    sortBy: "follower_count",
  });

  // 模拟搜索结果数据
  const mockResults: DouyinInfluencer[] = [
    {
      id: "1",
      sec_user_id: "MS4wLjABAAAA1",
      unique_id: "fashionista_lily",
      nickname: "时尚达人Lily",
      avatar_url: "/placeholder.svg",
      signature: "分享时尚穿搭，传递美好生活 ✨",
      follower_count: 1580000,
      following_count: 1200,
      aweme_count: 456,
      total_favorited: 25800000,
      gender: 2,
      age: 28,
      ip_location: "北京",
      is_star: false,
      is_effect_artist: false,
      is_gov_media_vip: false,
      is_live_commerce: true,
      is_xingtu_kol: true,
      with_commerce_entry: true,
      with_fusion_shop_entry: true,
      with_new_goods: true,
      max_follower_count: 1600000,
      platform: "douyin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_url: "https://www.douyin.com/user/1",
    },
    {
      id: "2",
      sec_user_id: "MS4wLjABAAAA2",
      unique_id: "beauty_queen",
      nickname: "美妆女王Mia",
      avatar_url: "/placeholder.svg",
      signature: "专业美妆博主 | 护肤达人 💄",
      follower_count: 2350000,
      following_count: 890,
      aweme_count: 623,
      total_favorited: 45600000,
      gender: 2,
      age: 25,
      ip_location: "上海",
      is_star: false,
      is_effect_artist: false,
      is_gov_media_vip: false,
      is_live_commerce: true,
      is_xingtu_kol: true,
      with_commerce_entry: true,
      with_fusion_shop_entry: false,
      with_new_goods: true,
      max_follower_count: 2400000,
      platform: "douyin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_url: "https://www.douyin.com/user/2",
    },
    {
      id: "3",
      sec_user_id: "MS4wLjABAAAA3",
      unique_id: "fitness_coach",
      nickname: "健身教练Max",
      avatar_url: "/placeholder.svg",
      signature: "专业健身指导 | 健康生活方式推广者 💪",
      follower_count: 980000,
      following_count: 650,
      aweme_count: 345,
      total_favorited: 15200000,
      gender: 1,
      age: 32,
      ip_location: "广州",
      is_star: false,
      is_effect_artist: false,
      is_gov_media_vip: false,
      is_live_commerce: false,
      is_xingtu_kol: true,
      with_commerce_entry: false,
      with_fusion_shop_entry: false,
      with_new_goods: false,
      max_follower_count: 1000000,
      platform: "douyin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_url: "https://www.douyin.com/user/3",
    },
  ];

  useEffect(() => {
    handleSearch();
  }, [currentPage]);

  const handleSearch = async () => {
    setLoading(true);

    // 模拟API搜索
    setTimeout(() => {
      setSearchResults(mockResults);
      setTotalResults(mockResults.length);
      setLoading(false);
    }, 1000);
  };

  const handleKolClick = (kol: DouyinInfluencer) => {
    // 保存KOL数据到sessionStorage以便分析页面使用
    sessionStorage.setItem("selectedKol", JSON.stringify(kol));
    navigate(`/kol-search-analysis/douyin-analysis/${kol.id}`);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      followerRange: "",
      region: "",
      gender: "",
      ageRange: "",
      category: "",
      hasCommerce: false,
      isXingtuKol: false,
      sortBy: "follower_count",
    });
  };

  const getEngagementRate = (kol: DouyinInfluencer): string => {
    // 简单的互动率计算公式
    const avgLikes = kol.total_favorited / kol.aweme_count;
    const engagementRate = (avgLikes / kol.follower_count) * 100;
    return `${engagementRate.toFixed(1)}%`;
  };

  const getStarLevel = (kol: DouyinInfluencer): string => {
    if (kol.follower_count > 2000000) return "S";
    if (kol.follower_count > 1000000) return "A+";
    if (kol.follower_count > 500000) return "A";
    if (kol.follower_count > 100000) return "B+";
    return "B";
  };

  return (
    <DashboardLayout
      title="抖音KOL搜索"
      subtitle="搜索和发现优质抖音KOL，精准匹配营销需求"
    >
      <div className="space-y-6">
        {/* 搜索区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                KOL搜索
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "隐藏筛选" : "高级筛选"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 基础搜索 */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索KOL昵称、抖音号或关键词..."
                  value={filters.keyword}
                  onChange={(e) =>
                    handleFilterChange("keyword", e.target.value)
                  }
                  className="h-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="h-10"
              >
                {loading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                搜索
              </Button>
            </div>

            {/* 高级筛选 */}
            {showFilters && (
              <>
                <Separator />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">粉丝数量</Label>
                    <Select
                      value={filters.followerRange}
                      onValueChange={(value) =>
                        handleFilterChange("followerRange", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择粉丝数量" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-10w">10万以下</SelectItem>
                        <SelectItem value="10w-50w">10万-50万</SelectItem>
                        <SelectItem value="50w-100w">50万-100万</SelectItem>
                        <SelectItem value="100w-500w">100万-500万</SelectItem>
                        <SelectItem value="500w+">500万以上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">地区</Label>
                    <Select
                      value={filters.region}
                      onValueChange={(value) =>
                        handleFilterChange("region", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择地区" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="北京">北京</SelectItem>
                        <SelectItem value="上海">上海</SelectItem>
                        <SelectItem value="广州">广州</SelectItem>
                        <SelectItem value="深圳">深圳</SelectItem>
                        <SelectItem value="杭州">杭州</SelectItem>
                        <SelectItem value="成都">成都</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">性别</Label>
                    <Select
                      value={filters.gender}
                      onValueChange={(value) =>
                        handleFilterChange("gender", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">男</SelectItem>
                        <SelectItem value="2">女</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">年龄段</Label>
                    <Select
                      value={filters.ageRange}
                      onValueChange={(value) =>
                        handleFilterChange("ageRange", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择年龄段" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-25">18-25岁</SelectItem>
                        <SelectItem value="26-35">26-35岁</SelectItem>
                        <SelectItem value="36-45">36-45岁</SelectItem>
                        <SelectItem value="45+">45岁以上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasCommerce"
                      checked={filters.hasCommerce}
                      onCheckedChange={(checked) =>
                        handleFilterChange("hasCommerce", checked)
                      }
                    />
                    <Label htmlFor="hasCommerce" className="text-sm">
                      带货达人
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isXingtuKol"
                      checked={filters.isXingtuKol}
                      onCheckedChange={(checked) =>
                        handleFilterChange("isXingtuKol", checked)
                      }
                    />
                    <Label htmlFor="isXingtuKol" className="text-sm">
                      星图达人
                    </Label>
                  </div>

                  <div className="flex-1" />

                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    清除筛选
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 搜索结果 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                搜索结果 ({totalResults})
              </span>
              <div className="flex items-center space-x-2">
                <Label className="text-sm">排序:</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follower_count">粉丝数</SelectItem>
                    <SelectItem value="total_favorited">获赞数</SelectItem>
                    <SelectItem value="aweme_count">作品数</SelectItem>
                    <SelectItem value="engagement_rate">互动率</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
                <p className="text-sm text-muted-foreground">正在搜索KOL...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">暂无搜索结果</h3>
                <p className="text-muted-foreground">
                  请调整搜索条件或筛选条件后重试
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">KOL信息</TableHead>
                        <TableHead className="w-[100px]">粉丝数</TableHead>
                        <TableHead className="w-[100px]">作品数</TableHead>
                        <TableHead className="w-[100px]">获赞总数</TableHead>
                        <TableHead className="w-[100px]">互动率</TableHead>
                        <TableHead className="w-[80px]">等级</TableHead>
                        <TableHead className="w-[120px]">标签</TableHead>
                        <TableHead className="w-[80px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((kol) => (
                        <TableRow
                          key={kol.id}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <AvatarImage
                                src={kol.avatar_url || ""}
                                alt={kol.nickname}
                                fallbackText={kol.nickname.charAt(0)}
                                size="md"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">
                                  {kol.nickname}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  @{kol.unique_id}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {kol.ip_location} ·{" "}
                                  {kol.gender === 2 ? "女" : "男"} · {kol.age}岁
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatNumber(kol.follower_count)}
                          </TableCell>
                          <TableCell>{kol.aweme_count}</TableCell>
                          <TableCell>
                            {formatNumber(kol.total_favorited)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {getEngagementRate(kol)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                getStarLevel(kol) === "S"
                                  ? "default"
                                  : getStarLevel(kol).startsWith("A")
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {getStarLevel(kol)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {kol.is_xingtu_kol && (
                                <Badge variant="default" className="text-xs">
                                  <Star className="mr-1 h-2 w-2" />
                                  星图
                                </Badge>
                              )}
                              {kol.is_live_commerce && (
                                <Badge variant="secondary" className="text-xs">
                                  🛍️ 带货
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleKolClick(kol)}
                                title="查看详情"
                              >
                                <BarChart3 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() =>
                                  window.open(kol.share_url, "_blank")
                                }
                                title="访问主页"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* 分页 */}
                {totalResults > resultsPerPage && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      显示第 {(currentPage - 1) * resultsPerPage + 1} 到{" "}
                      {Math.min(currentPage * resultsPerPage, totalResults)}{" "}
                      项，共 {totalResults} 项
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1 || loading}
                      >
                        上一页
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={
                          currentPage * resultsPerPage >= totalResults ||
                          loading
                        }
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* 搜索统计 */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                搜索结果统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(
                      searchResults.reduce(
                        (sum, kol) => sum + kol.follower_count,
                        0,
                      ) /
                        searchResults.length /
                        10000,
                    )}
                    万
                  </div>
                  <div className="text-sm text-muted-foreground">
                    平均粉丝数
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(
                      searchResults.reduce(
                        (sum, kol) => sum + kol.aweme_count,
                        0,
                      ) / searchResults.length,
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    平均作品数
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {searchResults.filter((kol) => kol.is_xingtu_kol).length}
                  </div>
                  <div className="text-sm text-muted-foreground">星图达人</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {searchResults.filter((kol) => kol.is_live_commerce).length}
                  </div>
                  <div className="text-sm text-muted-foreground">带货达人</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
