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
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

const supportedPlatforms = [
  { id: "douyin", name: "抖音", emoji: "🎤" },
  { id: "xiaohongshu", name: "小红书", emoji: "📖" },
  { id: "bilibili", name: "哔哩哔哩", emoji: "📺" },
  { id: "tiktok", name: "TikTok", emoji: "🎵" },
  { id: "instagram", name: "Instagram", emoji: "📷" },
  { id: "x", name: "X", emoji: "🐦" },
];

// Sample search results
const mockResults = [
  {
    id: 1,
    title: "超火的韩式裸妆教程！新手必看",
    platform: "抖音",
    author: "美妆达人小丽",
    publishTime: "2024-01-20",
    views: "230万",
    likes: "15.6万",
    comments: "3.2万",
    shares: "8.5千",
    url: "https://www.douyin.com/video/123456",
  },
  {
    id: 2,
    title: "学生党宿舍收纳神器推荐",
    platform: "小红书",
    author: "生活记录家",
    publishTime: "2024-01-19",
    views: "120万",
    likes: "8.9万",
    comments: "1.5万",
    shares: "3.2千",
    url: "https://www.xiaohongshu.com/discovery/item/456789",
  },
  {
    id: 3,
    title: "Creative Cooking: Cheese Baked Sweet Potato",
    platform: "TikTok",
    author: "TechReviewer",
    publishTime: "2024-01-21",
    views: "450万",
    likes: "25.8万",
    comments: "8.9万",
    shares: "12.5千",
    url: "https://www.tiktok.com/@techreviewer/video/789012",
  },
];

export default function KeywordContentSearch() {
  const [keyword, setKeyword] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("douyin");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(mockResults);

  // Platform-specific filters
  const [douyinFilters, setDouyinFilters] = useState({
    sortType: "0",
    publishTime: "0",
    filterDuration: "0",
    contentType: "0",
  });

  const [tiktokFilters, setTiktokFilters] = useState({
    sortType: "0",
    publishTime: "0",
  });

  const [xiaohongshuFilters, setXiaohongshuFilters] = useState({
    sortType: "general",
    filterNoteType: "不限",
    filterNoteTime: "不限",
  });

  const [bilibiliFilters, setBilibiliFilters] = useState({
    order: "totalrank",
  });

  const [instagramFilters, setInstagramFilters] = useState({
    feedType: "top",
  });

  const [xFilters, setXFilters] = useState({
    searchType: "Top",
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
        `正在搜索关键词 "${keyword}" 在 ${supportedPlatforms.find((p) => p.id === selectedPlatform)?.name} 平台的内容`,
      );
    }, 2000);
  };

  const getPlatformFilterComponent = () => {
    switch (selectedPlatform) {
      case "douyin":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">排序方式</label>
              <Select
                value={douyinFilters.sortType}
                onValueChange={(value) =>
                  setDouyinFilters((prev) => ({ ...prev, sortType: value }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">综合排序</SelectItem>
                  <SelectItem value="1">最多点赞</SelectItem>
                  <SelectItem value="2">最新发布</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">发布时间</label>
              <Select
                value={douyinFilters.publishTime}
                onValueChange={(value) =>
                  setDouyinFilters((prev) => ({ ...prev, publishTime: value }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">不限</SelectItem>
                  <SelectItem value="1">最近一天</SelectItem>
                  <SelectItem value="7">最近一周</SelectItem>
                  <SelectItem value="180">最近半年</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">视频时长</label>
              <Select
                value={douyinFilters.filterDuration}
                onValueChange={(value) =>
                  setDouyinFilters((prev) => ({
                    ...prev,
                    filterDuration: value,
                  }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">不限</SelectItem>
                  <SelectItem value="0-1">1分钟以内</SelectItem>
                  <SelectItem value="1-5">1-5分钟</SelectItem>
                  <SelectItem value="5-10000">5分钟以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">内容类型</label>
              <Select
                value={douyinFilters.contentType}
                onValueChange={(value) =>
                  setDouyinFilters((prev) => ({ ...prev, contentType: value }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">不限</SelectItem>
                  <SelectItem value="1">视频</SelectItem>
                  <SelectItem value="2">图片</SelectItem>
                  <SelectItem value="3">文章</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "tiktok":
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">排序方式</label>
              <Select
                value={tiktokFilters.sortType}
                onValueChange={(value) =>
                  setTiktokFilters((prev) => ({ ...prev, sortType: value }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">相关度</SelectItem>
                  <SelectItem value="1">最多点赞</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">发布时间</label>
              <Select
                value={tiktokFilters.publishTime}
                onValueChange={(value) =>
                  setTiktokFilters((prev) => ({ ...prev, publishTime: value }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">不限制</SelectItem>
                  <SelectItem value="1">最近一天</SelectItem>
                  <SelectItem value="7">最近一周</SelectItem>
                  <SelectItem value="30">最近一个月</SelectItem>
                  <SelectItem value="90">最近三个月</SelectItem>
                  <SelectItem value="180">最近半年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "xiaohongshu":
        return (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">排序规则</label>
              <Select
                value={xiaohongshuFilters.sortType}
                onValueChange={(value) =>
                  setXiaohongshuFilters((prev) => ({
                    ...prev,
                    sortType: value,
                  }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">综合排序</SelectItem>
                  <SelectItem value="time_descending">最新发布</SelectItem>
                  <SelectItem value="popularity_descending">
                    最多点赞
                  </SelectItem>
                  <SelectItem value="comment_descending">最多评论</SelectItem>
                  <SelectItem value="collect_descending">最多收藏</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">笔记类型</label>
              <Select
                value={xiaohongshuFilters.filterNoteType}
                onValueChange={(value) =>
                  setXiaohongshuFilters((prev) => ({
                    ...prev,
                    filterNoteType: value,
                  }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="不限">不限</SelectItem>
                  <SelectItem value="视频笔记">视频笔记</SelectItem>
                  <SelectItem value="普通笔记">普通笔记</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">发布时间</label>
              <Select
                value={xiaohongshuFilters.filterNoteTime}
                onValueChange={(value) =>
                  setXiaohongshuFilters((prev) => ({
                    ...prev,
                    filterNoteTime: value,
                  }))
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="不限">不限</SelectItem>
                  <SelectItem value="一天内">一天内</SelectItem>
                  <SelectItem value="一周内">一周内</SelectItem>
                  <SelectItem value="半年内">半年内</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "bilibili":
        return (
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">排序方式</label>
              <Select
                value={bilibiliFilters.order}
                onValueChange={(value) =>
                  setBilibiliFilters((prev) => ({ ...prev, order: value }))
                }
              >
                <SelectTrigger className="h-8 text-xs w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="totalrank">综合排序</SelectItem>
                  <SelectItem value="click">最多播放</SelectItem>
                  <SelectItem value="pubdate">最新发布</SelectItem>
                  <SelectItem value="dm">最多弹幕</SelectItem>
                  <SelectItem value="stow">最多收藏</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "instagram":
        return (
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Feed类型</label>
              <Select
                value={instagramFilters.feedType}
                onValueChange={(value) =>
                  setInstagramFilters((prev) => ({ ...prev, feedType: value }))
                }
              >
                <SelectTrigger className="h-8 text-xs w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">热门</SelectItem>
                  <SelectItem value="recent">最新</SelectItem>
                  <SelectItem value="clips">快拍</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "x":
        return (
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">搜索类型</label>
              <Select
                value={xFilters.searchType}
                onValueChange={(value) =>
                  setXFilters((prev) => ({ ...prev, searchType: value }))
                }
              >
                <SelectTrigger className="h-8 text-xs w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Top">Top</SelectItem>
                  <SelectItem value="Latest">Latest</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Lists">Lists</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const filteredResults = searchResults.filter((result) => {
    const platformMap = {
      douyin: "抖音",
      xiaohongshu: "小红书",
      bilibili: "哔哩哔哩",
      tiktok: "TikTok",
      instagram: "Instagram",
      x: "X",
    };
    return result.platform === platformMap[selectedPlatform];
  });

  return (
    <DashboardLayout
      title="关键词作品查询"
      subtitle="通过关键词搜索各平台相关作品内容"
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
              <Search className="mr-2 h-4 w-4" />
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
          <TabsList className="grid w-full grid-cols-6">
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
                {/* Enhanced Search Section */}
                <Card className="border-2 border-dashed border-muted bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center justify-center">
                      <div className="flex items-center gap-3 text-center">
                        <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          <Search className="h-5 w-5" />
                        </div>
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                          {platform.name} 关键词搜索
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Enhanced Search Bar */}
                    <div className="relative">
                      <div className="flex gap-3 items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder={`🔍 在${platform.name}搜索您感兴趣的内容...`}
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
                          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                          {isSearching ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              搜索中...
                            </>
                          ) : (
                            <>
                              <Search className="mr-2 h-4 w-4" />
                              开始搜索
                            </>
                          )}
                        </Button>
                      </div>
                      {/* Search suggestions hint */}
                      <div className="mt-2 text-center">
                        <p className="text-xs text-gray-500">
                          💡 试试搜索: "美妆教程"、"科技评测"、"美食制作"
                          等热门关键词
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Platform-specific filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-1.5 rounded-lg bg-gradient-to-r from-orange-400 to-pink-500 text-white">
                          <Filter className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          高级筛选选项
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-pink-200 dark:from-orange-800 dark:to-pink-800"></div>
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
                        <Eye className="mr-2 h-4 w-4" />
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
                        <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {keyword
                            ? `没有找到关键词 "${keyword}" 的相关内容`
                            : "请输入关键词开始搜索"}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[300px]">
                                作品标题
                              </TableHead>
                              <TableHead className="w-[120px]">作者</TableHead>
                              <TableHead className="w-[100px]">
                                发布时间
                              </TableHead>
                              <TableHead className="w-[100px]">
                                播放量
                              </TableHead>
                              <TableHead className="w-[80px]">点赞</TableHead>
                              <TableHead className="w-[80px]">评论</TableHead>
                              <TableHead className="w-[80px]">分享</TableHead>
                              <TableHead className="w-[60px]">操作</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredResults.map((result) => (
                              <TableRow key={result.id}>
                                <TableCell className="font-medium">
                                  <div
                                    className="max-w-[280px] truncate"
                                    title={result.title}
                                  >
                                    {result.title}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                  {result.author}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {result.publishTime}
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="flex items-center">
                                    <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                    {result.views}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="flex items-center">
                                    <Heart className="h-3 w-3 mr-1 text-red-500" />
                                    {result.likes}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="flex items-center">
                                    <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
                                    {result.comments}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="flex items-center">
                                    <Share2 className="h-3 w-3 mr-1 text-purple-500" />
                                    {result.shares}
                                  </span>
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
