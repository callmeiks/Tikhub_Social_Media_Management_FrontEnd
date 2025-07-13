import React, { useState } from "react";
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
} from "lucide-react";

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

// 模拟YouTube热门视频数据
const mockVideosData = [
  {
    rank: 1,
    change: "new",
    title: "Amazing AI Technology Demo 2024",
    channel: "Tech Insider",
    channelAvatar: "/api/placeholder/40/40",
    thumbnail: "/api/placeholder/120/90",
    views: "2.1M",
    likes: "156K",
    comments: "23K",
    duration: "10:45",
    publishedAt: "2 hours ago",
    category: "Technology",
    engagement: "18.5%",
    hotValue: "98.5",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["AI", "Technology", "Innovation"],
  },
  {
    rank: 2,
    change: "up",
    title: "Epic Gaming Moments Compilation",
    channel: "Gaming Central",
    channelAvatar: "/api/placeholder/40/40",
    thumbnail: "/api/placeholder/120/90",
    views: "1.8M",
    likes: "134K",
    comments: "19K",
    duration: "15:23",
    publishedAt: "5 hours ago",
    category: "Gaming",
    engagement: "16.8%",
    hotValue: "95.2",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["Gaming", "Compilation", "Epic"],
  },
  {
    rank: 3,
    change: "up",
    title: "Top 10 Movie Trailers This Week",
    channel: "Movie Hub",
    channelAvatar: "/api/placeholder/40/40",
    thumbnail: "/api/placeholder/120/90",
    views: "1.5M",
    likes: "128K",
    comments: "15K",
    duration: "12:18",
    publishedAt: "8 hours ago",
    category: "Entertainment",
    engagement: "15.2%",
    hotValue: "92.7",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["Movies", "Trailers", "Entertainment"],
  },
  {
    rank: 4,
    change: "down",
    title: "Viral Dance Challenge 2024",
    channel: "Dance Studio",
    channelAvatar: "/api/placeholder/40/40",
    thumbnail: "/api/placeholder/120/90",
    views: "1.3M",
    likes: "112K",
    comments: "12K",
    duration: "3:45",
    publishedAt: "12 hours ago",
    category: "Music",
    engagement: "14.1%",
    hotValue: "89.4",
    trendIcon: ArrowDownIcon,
    trendColor: "text-green-500",
    tags: ["Dance", "Challenge", "Viral"],
  },
  {
    rank: 5,
    change: "up",
    title: "Cooking Master Class: Italian Pasta",
    channel: "Chef's Kitchen",
    channelAvatar: "/api/placeholder/40/40",
    thumbnail: "/api/placeholder/120/90",
    views: "1.1M",
    likes: "98K",
    comments: "8.5K",
    duration: "18:30",
    publishedAt: "1 day ago",
    category: "Food",
    engagement: "13.5%",
    hotValue: "86.8",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["Cooking", "Italian", "Tutorial"],
  },
  {
    rank: 6,
    change: "stable",
    title: "Breaking News: Global Climate Summit",
    channel: "News Network",
    channelAvatar: "/api/placeholder/40/40",
    thumbnail: "/api/placeholder/120/90",
    views: "980K",
    likes: "67K",
    comments: "15K",
    duration: "25:12",
    publishedAt: "1 day ago",
    category: "News",
    engagement: "12.8%",
    hotValue: "84.1",
    trendIcon: null,
    trendColor: "text-gray-500",
    tags: ["News", "Climate", "Global"],
  },
  {
    rank: 7,
    change: "up",
    title: "Fitness Transformation in 30 Days",
    channel: "Fit Life",
    channelAvatar: "/api/placeholder/40/40",
    thumbnail: "/api/placeholder/120/90",
    views: "860K",
    likes: "78K",
    comments: "6.2K",
    duration: "14:55",
    publishedAt: "2 days ago",
    category: "Sports",
    engagement: "12.1%",
    hotValue: "81.5",
    trendIcon: ArrowUpIcon,
    trendColor: "text-red-500",
    tags: ["Fitness", "Transformation", "Health"],
  },
  {
    rank: 8,
    change: "down",
    title: "DIY Home Renovation Tips",
    channel: "Home Improvement",
    channelAvatar: "/api/placeholder/40/40",
    thumbnail: "/api/placeholder/120/90",
    views: "720K",
    likes: "52K",
    comments: "4.8K",
    duration: "22:07",
    publishedAt: "2 days ago",
    category: "Lifestyle",
    engagement: "11.5%",
    hotValue: "78.9",
    trendIcon: ArrowDownIcon,
    trendColor: "text-green-500",
    tags: ["DIY", "Home", "Renovation"],
  },
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
  const [data, setData] = useState(mockVideosData);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    console.log("导出YouTube热门视频数据", { filters, data });
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
      Technology: "bg-blue-100 text-blue-800",
      Gaming: "bg-purple-100 text-purple-800",
      Entertainment: "bg-pink-100 text-pink-800",
      Music: "bg-green-100 text-green-800",
      Food: "bg-orange-100 text-orange-800",
      News: "bg-red-100 text-red-800",
      Sports: "bg-yellow-100 text-yellow-800",
      Lifestyle: "bg-indigo-100 text-indigo-800",
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
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出数据
          </Button>
          <Button className="brand-accent" onClick={handleSearch}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新数据
          </Button>
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
              <Button variant="outline">重置</Button>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "搜索中..." : "搜索"}
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
                <Button size="sm" variant="outline">
                  <Download className="w-3 h-3 mr-1" />
                  导出
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* 排名和趋势 */}
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      <Badge
                        variant={item.rank <= 3 ? "default" : "secondary"}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        {item.rank}
                      </Badge>
                      {getTrendIcon(item.change)}
                    </div>

                    {/* 视频缩略图 */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-20 h-15 object-cover rounded"
                        />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                          {item.duration}
                        </div>
                      </div>
                    </div>

                    {/* 视频信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-base text-red-600 truncate">
                          {item.title}
                        </h3>
                        <Badge
                          className={`text-xs ${getCategoryColor(item.category)}`}
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={item.channelAvatar} />
                          <AvatarFallback>{item.channel[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {item.channel}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {item.publishedAt}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, tagIndex) => (
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
                    <div className="flex-shrink-0 grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span className="font-medium">{item.views}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">观看量</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span className="font-medium">{item.likes}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">点赞数</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span className="font-medium">{item.comments}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">评论数</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span className="font-medium text-red-600">
                            {item.hotValue}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">热度值</p>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex-shrink-0">
                      <Button size="sm" variant="ghost" className="text-xs">
                        <Play className="w-3 h-3 mr-1" />
                        观看视频
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 视频趋势统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总视频数</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Play className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">上升视频</p>
                  <p className="text-2xl font-bold text-red-600">5</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">下降视频</p>
                  <p className="text-2xl font-bold text-green-600">2</p>
                </div>
                <TrendingDown className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">新增视频</p>
                  <p className="text-2xl font-bold text-orange-600">1</p>
                </div>
                <Badge className="h-8 w-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
                  新
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
