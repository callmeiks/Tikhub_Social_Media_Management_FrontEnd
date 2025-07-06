import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

const supportedPlatforms = [
  { id: "douyin", name: "抖音", emoji: "🎤" },
  { id: "tiktok", name: "TikTok", emoji: "🎵" },
  { id: "xiaohongshu", name: "小红书", emoji: "📖" },
  { id: "kuaishou", name: "快手", emoji: "⚡" },
  { id: "instagram", name: "Instagram", emoji: "📷" },
  { id: "x", name: "X", emoji: "🐦" },
  { id: "youtube", name: "YouTube", emoji: "📹" },
];

// Sample search results
const mockResults = [
  {
    id: 1,
    username: "美妆达人小丽",
    platform: "抖音",
    followers: "156.8万",
    following: "128",
    works: "127",
    likes: "2340万",
    bio: "专业美妆博主 | 护肤分享 | 合作微信：xxxxx",
    verified: true,
    userType: "个人认证",
    avatar: "https://example.com/avatar1.jpg",
    url: "https://www.douyin.com/user/123456",
  },
  {
    id: 2,
    username: "TechReviewer",
    platform: "TikTok",
    followers: "245.7K",
    following: "89",
    works: "203",
    likes: "3.58M",
    bio: "Tech Reviews & Unboxing | Latest Gadgets | Contact: tech@email.com",
    verified: true,
    userType: "认证用户",
    avatar: "https://example.com/avatar2.jpg",
    url: "https://www.tiktok.com/@techreviewer",
  },
  {
    id: 3,
    username: "生活记录家",
    platform: "小红书",
    followers: "89.3万",
    following: "256",
    works: "89",
    likes: "1890��",
    bio: "记录美好生活 | 收纳整理达人 | 分享生活小窍门",
    verified: false,
    userType: "普通用户",
    avatar: "https://example.com/avatar3.jpg",
    url: "https://www.xiaohongshu.com/user/789012",
  },
];

export default function KeywordAccountSearch() {
  const [keyword, setKeyword] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("douyin");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(mockResults);

  // Platform-specific filters
  const [douyinFilters, setDouyinFilters] = useState({
    userFans: "all",
    userType: "all",
  });

  const [tiktokFilters, setTiktokFilters] = useState({
    followerCount: "all",
    profileType: "all",
  });

  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert("请输入搜索关键词");
      return;
    }

    setIsSearching(true);
    // 模拟API调用
    setTimeout(() => {
      setIsSearching(false);
      alert(
        `正在搜索关键词 "${keyword}" 在 ${supportedPlatforms.find((p) => p.id === selectedPlatform)?.name} 平台的账号`,
      );
    }, 2000);
  };

  const getPlatformFilterComponent = () => {
    switch (selectedPlatform) {
      case "douyin":
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">
                粉丝数量筛选
              </label>
              <Select
                value={douyinFilters.userFans}
                onValueChange={(value) =>
                  setDouyinFilters((prev) => ({ ...prev, userFans: value }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="不限" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">不限</SelectItem>
                  <SelectItem value="0_1k">1000以下</SelectItem>
                  <SelectItem value="1k_1w">1000到1万</SelectItem>
                  <SelectItem value="1w_10w">1万到10万</SelectItem>
                  <SelectItem value="10w_100w">10万到100万</SelectItem>
                  <SelectItem value="100w_">100万以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">
                用户类型筛选
              </label>
              <Select
                value={douyinFilters.userType}
                onValueChange={(value) =>
                  setDouyinFilters((prev) => ({ ...prev, userType: value }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="不限" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">不限</SelectItem>
                  <SelectItem value="common_user">普通用户</SelectItem>
                  <SelectItem value="enterprise_user">企业认证用户</SelectItem>
                  <SelectItem value="personal_user">个人认证用户</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "tiktok":
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">
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
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="不限制" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">不限制</SelectItem>
                  <SelectItem value="ZERO_TO_ONE_K">0-1K</SelectItem>
                  <SelectItem value="ONE_K_TO_TEN_K">1K-10K</SelectItem>
                  <SelectItem value="TEN_K_TO_ONE_H_K">10K-100K</SelectItem>
                  <SelectItem value="ONE_H_K_PLUS">100K以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">
                账号类型排序
              </label>
              <Select
                value={tiktokFilters.profileType}
                onValueChange={(value) =>
                  setTiktokFilters((prev) => ({ ...prev, profileType: value }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="不限制" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">不限制</SelectItem>
                  <SelectItem value="VERIFIED">认证用户</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "xiaohongshu":
      case "kuaishou":
      case "instagram":
      case "x":
      case "youtube":
        return (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              {supportedPlatforms.find((p) => p.id === selectedPlatform)?.name}{" "}
              平台暂无额外筛选条件
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const filteredResults = searchResults.filter((result) => {
    const platformMap = {
      douyin: "抖音",
      tiktok: "TikTok",
      xiaohongshu: "小红书",
      kuaishou: "快手",
      instagram: "Instagram",
      x: "X",
      youtube: "YouTube",
    };
    return result.platform === platformMap[selectedPlatform];
  });

  const getVerificationIcon = (verified: boolean, userType: string) => {
    if (!verified) return null;

    return userType.includes("企业") ? (
      <Crown className="h-3 w-3 text-yellow-500" />
    ) : (
      <Verified className="h-3 w-3 text-blue-500" />
    );
  };

  return (
    <DashboardLayout
      title="关键词账号查询"
      subtitle="通过���键词搜索各平台相关账号"
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
        {/* Platform Support */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Users className="mr-2 h-4 w-4" />
              支持平台
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {supportedPlatforms.map((platform) => (
                <Badge
                  key={platform.id}
                  variant="secondary"
                  className="flex items-center space-x-1 h-7"
                >
                  <span>{platform.emoji}</span>
                  <span>{platform.name}</span>
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

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
                className="flex items-center gap-1 text-xs"
              >
                <span>{platform.emoji}</span>
                <span className="hidden sm:inline">{platform.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {supportedPlatforms.map((platform) => (
            <TabsContent key={platform.id} value={platform.id} className="mt-6">
              <div className="space-y-4">
                {/* Search Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Search className="mr-2 h-4 w-4" />
                      {platform.name} 账号搜索
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <Input
                        placeholder={`在${platform.name}搜索账号关键词...`}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching || !keyword.trim()}
                        className="px-6"
                      >
                        {isSearching ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="mr-2 h-4 w-4" />
                        )}
                        搜索
                      </Button>
                    </div>

                    {/* Platform-specific filters */}
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Filter className="h-4 w-4" />
                        <span className="text-sm font-medium">搜索筛选</span>
                      </div>
                      {getPlatformFilterComponent()}
                    </div>
                  </CardContent>
                </Card>

                {/* Results Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        搜索结果 ({filteredResults.length})
                      </span>
                      <Button
                        size="sm"
                        disabled={filteredResults.length === 0}
                        className="h-8 brand-accent"
                      >
                        <Download className="mr-2 h-3.5 w-3.5" />
                        导出结果
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredResults.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {keyword
                            ? `没有找到关键词 "${keyword}" 的相关账号`
                            : "请输入关键词开始搜索"}
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
                              <TableHead className="w-[100px]">获赞</TableHead>
                              <TableHead className="w-[300px]">简介</TableHead>
                              <TableHead className="w-[100px]">认证</TableHead>
                              <TableHead className="w-[60px]">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredResults.map((result) => (
                              <TableRow key={result.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                      {result.username.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1">
                                        <span className="font-medium text-sm">
                                          {result.username}
                                        </span>
                                        {getVerificationIcon(
                                          result.verified,
                                          result.userType,
                                        )}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="text-xs mt-1"
                                      >
                                        {result.platform}
                                      </Badge>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="flex items-center">
                                    <Users className="h-3 w-3 mr-1 text-blue-500" />
                                    {result.followers}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {result.following}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {result.works}
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="flex items-center">
                                    <Eye className="h-3 w-3 mr-1 text-red-500" />
                                    {result.likes}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm">
                                  <div
                                    className="max-w-[280px] truncate"
                                    title={result.bio}
                                  >
                                    {result.bio}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      result.verified ? "default" : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {result.userType}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      window.open(result.url, "_blank")
                                    }
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
