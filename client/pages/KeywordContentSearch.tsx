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
  FileText,
  BarChart3,
  Hash,
  Users,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import type {
  KeywordSearchParams,
  KeywordSearchResponse,
  DouyinFilters,
  TikTokFilters,
  XiaohongshuFilters,
  YouTubeFilters,
  XFilters,
  InstagramFilters,
  KuaishouFilters,
} from "@/lib/api";

const supportedPlatforms = [
  { id: "douyin", name: "抖音", emoji: "🎤" },
  { id: "xhs", name: "小红书", emoji: "📖" },
  { id: "kuaishou", name: "快手", emoji: "⚡" },
  { id: "tiktok", name: "TikTok", emoji: "🎵" },
  { id: "youtube", name: "YouTube", emoji: "📺" },
  { id: "instagram", name: "Instagram", emoji: "📷" },
  { id: "x", name: "X", emoji: "🐦" },
];

// Define the search result interface based on API response
interface SearchResult {
  id: string;
  task_id: string;
  platform: string;
  keyword: string;
  title: string;
  description: string;
  author_name: string;
  author_id: string;
  view_count: number;
  like_count: number;
  share_count: number;
  comment_count: number;
  created_time: string;
  url: string;
  created_at: string;
}

// Function to format numbers for display
function formatNumber(num: number): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿';
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + '千';
  }
  return num.toString();
}

// Function to format timestamp to date
function formatDate(timestamp: string): string {
  const date = new Date(parseInt(timestamp) * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function KeywordContentSearch() {
  const [keyword, setKeyword] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("douyin");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [quantityFilter, setQuantityFilter] = useState("50");
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  // Platform-specific filters
  const [douyinFilters, setDouyinFilters] = useState<DouyinFilters>({
    sort_type: "0",
    publish_time: "0",
    filter_duration: "0",
    content_type: "0",
  });

  const [tiktokFilters, setTiktokFilters] = useState<TikTokFilters>({
    sort_type: "0",
    publish_time: "0",
  });

  const [xiaohongshuFilters, setXiaohongshuFilters] =
    useState<XiaohongshuFilters>({
      sort_type: "general",
      filter_note_type: "不限",
      filter_note_time: "不限",
    });

  const [youtubeFilters, setYoutubeFilters] = useState<YouTubeFilters>({
    order_by: "relevance",
    country_code: "us",
  });

  const [instagramFilters, setInstagramFilters] = useState<InstagramFilters>({
    feed_type: "top",
  });

  const [xFilters, setXFilters] = useState<XFilters>({
    search_type: "Top",
  });

  const [kuaishouFilters, setKuaishouFilters] = useState<KuaishouFilters>({});

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError("请输入搜索关键词");
      return;
    }

    setIsSearching(true);
    setError(null);
    setTaskId(null);

    try {
      // Get current filters based on platform
      let filters = {};
      switch (selectedPlatform) {
        case "douyin":
          filters = douyinFilters;
          break;
        case "tiktok":
          filters = tiktokFilters;
          break;
        case "xhs":
          filters = xiaohongshuFilters;
          break;
        case "youtube":
          filters = youtubeFilters;
          break;
        case "instagram":
          filters = instagramFilters;
          break;
        case "x":
          filters = xFilters;
          break;
        case "kuaishou":
          filters = kuaishouFilters;
          break;
        default:
          filters = {};
      }

      const searchParams: KeywordSearchParams = {
        keyword: keyword.trim(),
        platform: selectedPlatform as any,
        content_count: parseInt(quantityFilter),
        filters,
      };

      const response = await apiClient.keywordSearch(searchParams);
      setTaskId(response.task_id);

      // Show success message
      const platformName = supportedPlatforms.find(
        (p) => p.id === selectedPlatform,
      )?.name;
      
      // Note: Search results will be available after the backend processes the task
      // Users can click the refresh button to check for results
    } catch (error) {
      console.error("Search failed:", error);
      setError(error instanceof Error ? error.message : "搜索失败，请重试");
    } finally {
      setIsSearching(false);
    }
  };

  // Function to fetch search results from API
  const fetchSearchResults = async () => {
    if (!keyword.trim()) return;
    
    setIsLoadingResults(true);
    setError(null);
    
    try {
      // Get the API base URL from environment or use default
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      const token = localStorage.getItem('authToken') || import.meta.env.VITE_BACKEND_API_TOKEN || '';
      
      const url = `${apiBaseUrl}/api/keyword-search-post/posts?platform=${selectedPlatform}&keyword=${encodeURIComponent(keyword)}&page=1&limit=${quantityFilter}`;
      console.log('Fetching search results from:', url);
      
      // Call the API endpoint directly
      const response = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.posts && Array.isArray(data.posts)) {
        console.log(`Setting ${data.posts.length} search results`);
        setSearchResults(data.posts);
      } else {
        console.log('No posts found in response');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Failed to fetch search results:', error);
      setError('获取搜索结果失败，请稍后重试');
    } finally {
      setIsLoadingResults(false);
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  排序方式
                </label>
                <Select
                  value={douyinFilters.sort_type}
                  onValueChange={(value) =>
                    setDouyinFilters((prev) => ({
                      ...prev,
                      sort_type: value as "0" | "1" | "2",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="选择排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">🎯 综合排序</SelectItem>
                    <SelectItem value="1">❤️ 最多点赞</SelectItem>
                    <SelectItem value="2">⏰ 最新发布</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar className="h-4 w-4 text-green-500" />
                  发布时间
                </label>
                <Select
                  value={douyinFilters.publish_time}
                  onValueChange={(value) =>
                    setDouyinFilters((prev) => ({
                      ...prev,
                      publish_time: value as "0" | "1" | "7" | "30",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-green-400 transition-colors">
                    <SelectValue placeholder="选择时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">🌟 不限</SelectItem>
                    <SelectItem value="1">📅 最近一天</SelectItem>
                    <SelectItem value="7">🗓️ 最近一周</SelectItem>
                    <SelectItem value="180">📆 最近半年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Eye className="h-4 w-4 text-purple-500" />
                  视频时长
                </label>
                <Select
                  value={douyinFilters.filter_duration}
                  onValueChange={(value) =>
                    setDouyinFilters((prev) => ({
                      ...prev,
                      filter_duration: value as "0" | "1" | "2" | "3",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="选择时长范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">🌟 不限</SelectItem>
                    <SelectItem value="0-1">⚡ 1分钟以内</SelectItem>
                    <SelectItem value="1-5">🎬 1-5分钟</SelectItem>
                    <SelectItem value="5-10000">🎭 5分钟以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FileText className="h-4 w-4 text-orange-500" />
                  内容类型
                </label>
                <Select
                  value={douyinFilters.content_type}
                  onValueChange={(value) =>
                    setDouyinFilters((prev) => ({
                      ...prev,
                      content_type: value as "0" | "1" | "2" | "3",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-orange-400 transition-colors">
                    <SelectValue placeholder="选择内容类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">🌟 不限</SelectItem>
                    <SelectItem value="1">🎥 视频</SelectItem>
                    <SelectItem value="2">🖼️ 图片</SelectItem>
                    <SelectItem value="3">📝 文章</SelectItem>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  排序方式
                </label>
                <Select
                  value={tiktokFilters.sort_type}
                  onValueChange={(value) =>
                    setTiktokFilters((prev) => ({
                      ...prev,
                      sort_type: value as "0" | "1",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="选择排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">🎯 相关度</SelectItem>
                    <SelectItem value="1">❤️ 最多点赞</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar className="h-4 w-4 text-green-500" />
                  发布时间
                </label>
                <Select
                  value={tiktokFilters.publish_time}
                  onValueChange={(value) =>
                    setTiktokFilters((prev) => ({
                      ...prev,
                      publish_time: value as "0" | "1" | "7" | "30",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-green-400 transition-colors">
                    <SelectValue placeholder="选择时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">🌟 不限制</SelectItem>
                    <SelectItem value="1">📅 最近一天</SelectItem>
                    <SelectItem value="7">🗓️ 最近一周</SelectItem>
                    <SelectItem value="30">📊 最近一个月</SelectItem>
                    <SelectItem value="90">📈 最近三个月</SelectItem>
                    <SelectItem value="180">📆 最近半年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "xhs":
        return (
          <div className="space-y-4">
            {getQuantityFilterComponent()}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  排序规则
                </label>
                <Select
                  value={xiaohongshuFilters.sort_type}
                  onValueChange={(value) =>
                    setXiaohongshuFilters((prev) => ({
                      ...prev,
                      sort_type: value as
                        | "general"
                        | "time_descending"
                        | "popularity_descending",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="选���排序规则" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">🎯 综合排序</SelectItem>
                    <SelectItem value="time_descending">⏰ 最新发布</SelectItem>
                    <SelectItem value="popularity_descending">
                      ❤️ 最多点赞
                    </SelectItem>
                    <SelectItem value="comment_descending">
                      💬 最多评论
                    </SelectItem>
                    <SelectItem value="collect_descending">
                      ⭐ 最多收藏
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FileText className="h-4 w-4 text-orange-500" />
                  笔记类型
                </label>
                <Select
                  value={xiaohongshuFilters.filter_note_type}
                  onValueChange={(value) =>
                    setXiaohongshuFilters((prev) => ({
                      ...prev,
                      filter_note_type: value as "不限" | "视频" | "图文",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-orange-400 transition-colors">
                    <SelectValue placeholder="选择笔记类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="不限">🌟 不限</SelectItem>
                    <SelectItem value="视频笔记">🎥 视频笔记</SelectItem>
                    <SelectItem value="普通笔记">🖼️ 普通笔记</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar className="h-4 w-4 text-green-500" />
                  发布时间
                </label>
                <Select
                  value={xiaohongshuFilters.filter_note_time}
                  onValueChange={(value) =>
                    setXiaohongshuFilters((prev) => ({
                      ...prev,
                      filter_note_time: value as
                        | "不限"
                        | "一周内"
                        | "一月内"
                        | "三月内",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-green-400 transition-colors">
                    <SelectValue placeholder="选择时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="不限">🌟 不限</SelectItem>
                    <SelectItem value="一天内">📅 一天内</SelectItem>
                    <SelectItem value="一周内">🗓️ 一周内</SelectItem>
                    <SelectItem value="半年内">📆 半年内</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "youtube":
        return (
          <div className="space-y-4">
            {getQuantityFilterComponent()}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  排序方式
                </label>
                <Select
                  value={youtubeFilters.order_by}
                  onValueChange={(value) =>
                    setYoutubeFilters((prev) => ({
                      ...prev,
                      order_by: value as
                        | "relevance"
                        | "this_month"
                        | "this_week"
                        | "today",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="选择排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">🎯 相关度</SelectItem>
                    <SelectItem value="this_month">📅 本月</SelectItem>
                    <SelectItem value="this_week">🗓️ 本周</SelectItem>
                    <SelectItem value="today">⏰ 今天</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Users className="h-4 w-4 text-green-500" />
                  国家/地区
                </label>
                <Select
                  value={youtubeFilters.country_code}
                  onValueChange={(value) =>
                    setYoutubeFilters((prev) => ({
                      ...prev,
                      country_code: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-green-400 transition-colors">
                    <SelectValue placeholder="选择国家/地区" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">🇺🇸 美国</SelectItem>
                    <SelectItem value="cn">🇨🇳 中国</SelectItem>
                    <SelectItem value="jp">🇯🇵 日本</SelectItem>
                    <SelectItem value="uk">🇬🇧 英国</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "kuaishou":
        return (
          <div className="space-y-4">
            {getQuantityFilterComponent()}
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">快手平台暂无特殊筛选选项</p>
            </div>
          </div>
        );

      case "instagram":
        return (
          <div className="space-y-4">
            {getQuantityFilterComponent()}
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  Feed类型
                </label>
                <Select
                  value={instagramFilters.feed_type}
                  onValueChange={(value) =>
                    setInstagramFilters((prev) => ({
                      ...prev,
                      feed_type: value as "top" | "recent",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors w-32">
                    <SelectValue placeholder="选择Feed类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">🔥 热门</SelectItem>
                    <SelectItem value="recent">⏰ 最新</SelectItem>
                    <SelectItem value="clips">🎬 快拍</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "x":
        return (
          <div className="space-y-4">
            {getQuantityFilterComponent()}
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  搜索类型
                </label>
                <Select
                  value={xFilters.search_type}
                  onValueChange={(value) =>
                    setXFilters((prev) => ({
                      ...prev,
                      search_type: value as
                        | "Top"
                        | "Latest"
                        | "Media"
                        | "People"
                        | "Lists",
                    }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors w-32">
                    <SelectValue placeholder="选择搜索类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Top">🔝 Top</SelectItem>
                    <SelectItem value="Latest">⏰ Latest</SelectItem>
                    <SelectItem value="Media">🖼️ Media</SelectItem>
                    <SelectItem value="Lists">📋 Lists</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Since results are already filtered by platform from API, we use them directly
  const filteredResults = searchResults;

  return (
    <DashboardLayout
      title="关键词作品查询"
      subtitle="通过关键词搜索各平台相关作品内容"
      actions={
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={fetchSearchResults}
            disabled={!keyword.trim() || isLoadingResults}
          >
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

                      {/* Error display */}
                      {error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-600">❌ {error}</p>
                        </div>
                      )}

                      {/* Task ID display */}
                      {taskId && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-600">
                            ✅ 任务已创建，ID: {taskId}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-green-500">
                              💡 请稍等片刻，然后点击"获取结果"按钮
                            </p>
                            <Button
                              size="sm"
                              onClick={fetchSearchResults}
                              disabled={isLoadingResults}
                              className="h-6 text-xs"
                            >
                              {isLoadingResults ? (
                                <>
                                  <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                                  获取中...
                                </>
                              ) : (
                                <>
                                  <Download className="mr-1 h-3 w-3" />
                                  获取结果
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Loading results indicator */}
                      {isLoadingResults && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-600 flex items-center">
                            <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                            正在加载搜索结果...
                          </p>
                        </div>
                      )}
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
                        {keyword && <span className="ml-2 text-sm text-gray-500">关键词: "{keyword}"</span>}
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
                                    title={result.title || result.description}
                                  >
                                    {result.title || result.description}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                  {result.author_name}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(result.created_time)}
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="flex items-center">
                                    <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                    {formatNumber(result.view_count)}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="flex items-center">
                                    <Heart className="h-3 w-3 mr-1 text-red-500" />
                                    {formatNumber(result.like_count)}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="flex items-center">
                                    <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
                                    {formatNumber(result.comment_count)}
                                  </span>
                                </TableCell>
                                <TableCell className="text-sm">
                                  <span className="flex items-center">
                                    <Share2 className="h-3 w-3 mr-1 text-purple-500" />
                                    {formatNumber(result.share_count)}
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
