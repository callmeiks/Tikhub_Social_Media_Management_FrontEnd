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
  Globe,
  Calendar,
  UserCheck,
  Award,
  ExternalLink,
  Languages,
} from "lucide-react";
import { apiClient, type TikTokInfluencer } from "@/lib/api";
import { AvatarImage } from "@/components/ui/avatar-image";

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// 搜索表单接口
interface SearchFilters {
  keyword: string;
  followerRange: string;
  region: string;
  language: string;
  category: string;
  isVerified: boolean;
  hasLiveOpen: boolean;
  sortBy: string;
}

export default function TikTokCreatorSearch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<TikTokInfluencer[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const resultsPerPage = 20;

  const [filters, setFilters] = useState<SearchFilters>({
    keyword: "",
    followerRange: "",
    region: "",
    language: "",
    category: "",
    isVerified: false,
    hasLiveOpen: false,
    sortBy: "follower_count",
  });

  // 模拟搜索结果数据
  const mockResults: TikTokInfluencer[] = [
    {
      id: "1",
      task_id: "task-001",
      sec_user_id: "MS4wLjABAAAA1",
      unique_id: "lifestyle_sarah",
      nickname: "Sarah Johnson",
      avatar_url: "/placeholder.svg",
      signature: "Lifestyle creator sharing daily inspiration ✨ NYC 🗽",
      follower_count: 4800000,
      following_count: 892,
      aweme_count: 1245,
      total_favorited: 128000000,
      region: "United States",
      language: "English",
      is_verified: true,
      is_live_open: true,
      platform: "tiktok",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_url: "https://www.tiktok.com/@lifestyle_sarah",
    },
    {
      id: "2",
      task_id: "task-002",
      sec_user_id: "MS4wLjABAAAA2",
      unique_id: "techreview_mike",
      nickname: "Mike Chen",
      avatar_url: "/placeholder.svg",
      signature: "Tech reviews & gadget unboxing 📱 Future is now!",
      follower_count: 3200000,
      following_count: 567,
      aweme_count: 892,
      total_favorited: 89500000,
      region: "United States",
      language: "English",
      is_verified: true,
      is_live_open: false,
      platform: "tiktok",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_url: "https://www.tiktok.com/@techreview_mike",
    },
    {
      id: "3",
      task_id: "task-003",
      sec_user_id: "MS4wLjABAAAA3",
      unique_id: "dancing_queen",
      nickname: "Emma Rodriguez",
      avatar_url: "/placeholder.svg",
      signature: "Professional dancer 💃 Choreographer | LA based",
      follower_count: 6700000,
      following_count: 1234,
      aweme_count: 2156,
      total_favorited: 245000000,
      region: "United States",
      language: "English",
      is_verified: true,
      is_live_open: true,
      platform: "tiktok",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_url: "https://www.tiktok.com/@dancing_queen",
    },
    {
      id: "4",
      task_id: "task-004",
      sec_user_id: "MS4wLjABAAAA4",
      unique_id: "foodie_adventures",
      nickname: "James Wilson",
      avatar_url: "/placeholder.svg",
      signature: "Food adventures around the world 🍜 Michelin guide hunter",
      follower_count: 2800000,
      following_count: 445,
      aweme_count: 678,
      total_favorited: 67800000,
      region: "United Kingdom",
      language: "English",
      is_verified: false,
      is_live_open: true,
      platform: "tiktok",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_url: "https://www.tiktok.com/@foodie_adventures",
    },
  ];

  useEffect(() => {
    handleSearch();
  }, [currentPage]);

  const handleSearch = async () => {
    setLoading(true);

    // 模拟API搜索
    setTimeout(() => {
      let filteredResults = mockResults;

      // Apply filters
      if (filters.isVerified) {
        filteredResults = filteredResults.filter(
          (creator) => creator.is_verified,
        );
      }
      if (filters.hasLiveOpen) {
        filteredResults = filteredResults.filter(
          (creator) => creator.is_live_open,
        );
      }
      if (filters.region) {
        filteredResults = filteredResults.filter(
          (creator) => creator.region === filters.region,
        );
      }

      setSearchResults(filteredResults);
      setTotalResults(filteredResults.length);
      setLoading(false);
    }, 1000);
  };

  const handleCreatorClick = (creator: TikTokInfluencer) => {
    // 保存Creator数据到sessionStorage以便分析页面使用
    sessionStorage.setItem("selectedCreator", JSON.stringify(creator));
    navigate(`/kol-search-analysis/tiktok-analysis/${creator.id}`);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      followerRange: "",
      region: "",
      language: "",
      category: "",
      isVerified: false,
      hasLiveOpen: false,
      sortBy: "follower_count",
    });
  };

  const getEngagementRate = (creator: TikTokInfluencer): string => {
    // 简单的互动率计算公式
    const avgLikes = creator.total_favorited / creator.aweme_count;
    const engagementRate = (avgLikes / creator.follower_count) * 100;
    return `${engagementRate.toFixed(1)}%`;
  };

  const getCreatorLevel = (creator: TikTokInfluencer): string => {
    if (creator.follower_count > 5000000) return "Diamond";
    if (creator.follower_count > 2000000) return "Gold";
    if (creator.follower_count > 1000000) return "Silver";
    if (creator.follower_count > 100000) return "Bronze";
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

  return (
    <DashboardLayout
      title="TikTok Creator Search"
      subtitle="Discover and analyze top TikTok creators for your marketing campaigns"
    >
      <div className="space-y-6">
        {/* 搜索区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                Creator Search
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Advanced Filters"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 基础搜索 */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search creator name, username, or keywords..."
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
                Search
              </Button>
            </div>

            {/* 高级筛选 */}
            {showFilters && (
              <>
                <Separator />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Followers</Label>
                    <Select
                      value={filters.followerRange}
                      onValueChange={(value) =>
                        handleFilterChange("followerRange", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select follower range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-100k">Under 100K</SelectItem>
                        <SelectItem value="100k-500k">100K - 500K</SelectItem>
                        <SelectItem value="500k-1m">500K - 1M</SelectItem>
                        <SelectItem value="1m-5m">1M - 5M</SelectItem>
                        <SelectItem value="5m+">5M+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Region</Label>
                    <Select
                      value={filters.region}
                      onValueChange={(value) =>
                        handleFilterChange("region", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">
                          United States
                        </SelectItem>
                        <SelectItem value="United Kingdom">
                          United Kingdom
                        </SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Brazil">Brazil</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Language</Label>
                    <Select
                      value={filters.language}
                      onValueChange={(value) =>
                        handleFilterChange("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Portuguese">Portuguese</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) =>
                        handleFilterChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="fashion">
                          Fashion & Beauty
                        </SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="food">Food & Cooking</SelectItem>
                        <SelectItem value="fitness">
                          Fitness & Health
                        </SelectItem>
                        <SelectItem value="entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isVerified"
                      checked={filters.isVerified}
                      onCheckedChange={(checked) =>
                        handleFilterChange("isVerified", checked)
                      }
                    />
                    <Label htmlFor="isVerified" className="text-sm">
                      Verified Only
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasLiveOpen"
                      checked={filters.hasLiveOpen}
                      onCheckedChange={(checked) =>
                        handleFilterChange("hasLiveOpen", checked)
                      }
                    />
                    <Label htmlFor="hasLiveOpen" className="text-sm">
                      Live Streaming Available
                    </Label>
                  </div>

                  <div className="flex-1" />

                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear Filters
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
                Search Results ({totalResults})
              </span>
              <div className="flex items-center space-x-2">
                <Label className="text-sm">Sort by:</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follower_count">Followers</SelectItem>
                    <SelectItem value="total_favorited">Total Likes</SelectItem>
                    <SelectItem value="aweme_count">Video Count</SelectItem>
                    <SelectItem value="engagement_rate">Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
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
                        <TableHead className="w-[100px]">Videos</TableHead>
                        <TableHead className="w-[100px]">Total Likes</TableHead>
                        <TableHead className="w-[100px]">Engagement</TableHead>
                        <TableHead className="w-[80px]">Level</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((creator) => (
                        <TableRow
                          key={creator.id}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <AvatarImage
                                src={creator.avatar_url || ""}
                                alt={creator.nickname}
                                fallbackText={creator.nickname.charAt(0)}
                                size="md"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">
                                  {creator.nickname}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  @{creator.unique_id}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                                  <Globe className="h-3 w-3 mr-1" />
                                  {creator.region}
                                  <Languages className="h-3 w-3 ml-2 mr-1" />
                                  {creator.language}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatNumber(creator.follower_count)}
                          </TableCell>
                          <TableCell>{creator.aweme_count}</TableCell>
                          <TableCell>
                            {formatNumber(creator.total_favorited)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {getEngagementRate(creator)}
                            </Badge>
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
                            <div className="flex flex-wrap gap-1">
                              {creator.is_verified && (
                                <Badge variant="default" className="text-xs">
                                  <UserCheck className="mr-1 h-2 w-2" />
                                  Verified
                                </Badge>
                              )}
                              {creator.is_live_open && (
                                <Badge variant="secondary" className="text-xs">
                                  🔴 Live
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
                                onClick={() => handleCreatorClick(creator)}
                                title="View Analysis"
                              >
                                <BarChart3 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() =>
                                  window.open(creator.share_url, "_blank")
                                }
                                title="Visit Profile"
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
                      Showing {(currentPage - 1) * resultsPerPage + 1} to{" "}
                      {Math.min(currentPage * resultsPerPage, totalResults)} of{" "}
                      {totalResults} results
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
                        Previous
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
                        Next
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
                          (sum, creator) => sum + creator.follower_count,
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
                        (sum, creator) => sum + creator.aweme_count,
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
                    {
                      searchResults.filter((creator) => creator.is_verified)
                        .length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {
                      searchResults.filter((creator) => creator.is_live_open)
                        .length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Live Enabled
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
