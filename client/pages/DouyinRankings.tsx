import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw,
  MapPin,
  Calendar,
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
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import type {
  DouyinHotTrendPoint,
  DouyinHotTopic,
  DouyinHotSearchItem,
  DouyinHotAccount,
  DouyinHotVideo,
  DouyinHotWord,
  DouyinHotMusic,
  DouyinHotBrand,
  DouyinHotLive,
  DouyinHotActivity,
  DouyinHotBrandParams,
} from "@/lib/api";
import cityList from "../../douyin_city_list.json";
import categoryList from "../../douyin_rank_category_list.json";
import brandCategoryList from "../../douyin_brand_category_list.json";

// 从分类列表中获取类型选项
const contentTypes = Object.keys(categoryList).map(label => ({
  label,
  value: categoryList[label as keyof typeof categoryList]
}));

// 品牌分类 - 从JSON文件中加载真实数据
const brandCategories = Object.keys(brandCategoryList).map(label => ({
  label,
  value: brandCategoryList[label as keyof typeof brandCategoryList].toString()
}));

// 将城市列表转换为选项数组
const cityOptions = Object.entries(cityList).map(([code, name]) => ({
  value: code,
  label: name,
}));

// 榜单标签配置
const rankingTabs = [
  { id: "rising", name: "上升热点榜", icon: TrendingUp, apiMethod: "getDouyinHotRise" },
  { id: "local", name: "同城热点榜", icon: MapPin, apiMethod: "getDouyinHotCity" },
  { id: "challenge", name: "挑战热点榜", icon: Hash, apiMethod: "getDouyinHotChallenge" },
  { id: "search", name: "搜索热点榜", icon: Search, apiMethod: "getDouyinHotSearch" },
  { id: "accounts", name: "热门账号榜单", icon: Users, apiMethod: "getDouyinHotAccount" },
  { id: "video", name: "视频热点榜", icon: Play, apiMethod: "getDouyinHotVideo" },
  { id: "lowfan", name: "低粉爆款榜", icon: TrendingUp, apiMethod: "getDouyinHotLowFan" },
  { id: "completion", name: "高完播率榜", icon: Play, apiMethod: "getDouyinHotHighCompletionRate" },
  { id: "follower", name: "高涨粉率榜", icon: Users, apiMethod: "getDouyinHotHighFanRate" },
  { id: "like", name: "高点赞率榜", icon: Heart, apiMethod: "getDouyinHotHighLikeRate" },
  { id: "risingsearch", name: "热度飙升搜索榜", icon: TrendingUp, apiMethod: "getDouyinHotSearch" },
  { id: "risingtopic", name: "热度飙升话题榜", icon: Hash, apiMethod: "getDouyinHotTopics" },
  { id: "hotwords", name: "热门词列表", icon: MessageCircle, apiMethod: "getDouyinHotWords" },
  { id: "calendar", name: "抖音活动日历", icon: Calendar, apiMethod: "getDouyinHotActivityCalendar" },
  { id: "music", name: "音乐热度榜", icon: Music, apiMethod: "getDouyinHotMusic" },
  { id: "brand", name: "品牌热度榜", icon: Award, apiMethod: "getDouyinHotBrand" },
  { id: "livestream", name: "直播热度榜", icon: Video, apiMethod: "getDouyinHotLive" },
];

interface FilterState {
  max_topics?: number;
  max_videos?: number;
  max_users?: number;
  max_words?: number;
  order?: "rank" | "rank_diff";
  sentence_tags?: string;
  city_code?: string;
  keyword?: string;
  date_window?: number;
  tags?: object;
  query_tag?: object;
  board_type?: number;
  board_sub_type?: string;
  category_id?: string;
  category_code?: string;
  start_date?: number;
  end_date?: number;
}

type RankingData = DouyinHotTopic | DouyinHotSearchItem | DouyinHotAccount | DouyinHotVideo | DouyinHotWord | DouyinHotMusic | DouyinHotBrand | DouyinHotLive | DouyinHotActivity;

export default function DouyinRankings() {
  const [activeTab, setActiveTab] = useState("rising");
  const [filters, setFilters] = useState<FilterState>({});
  const [data, setData] = useState<RankingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedVideoRows, setExpandedVideoRows] = useState<Set<number>>(new Set());

  // 获取当前标签的过滤器配置
  const getFiltersForTab = (tabId: string) => {
    switch (tabId) {
      case "rising":
        return [
          { type: "select", key: "sentence_tags", label: "话题标签", options: contentTypes },
          {
            type: "select",
            key: "order",
            label: "排序方式",
            options: [
              { value: "rank", label: "按排名" },
              { value: "rank_diff", label: "按排名变化" },
            ],
          },
          {
            type: "number",
            key: "max_topics",
            label: "最大话题数",
            min: 1,
            max: 1000,
            defaultValue: 50,
          },
        ];

      case "local":
        return [
          { type: "select", key: "sentence_tags", label: "话题标签", options: contentTypes },
          { type: "select", key: "city_code", label: "城市", options: cityOptions },
          {
            type: "select",
            key: "order",
            label: "排序方式",
            options: [
              { value: "rank", label: "按排名" },
              { value: "rank_diff", label: "按排名变化" },
            ],
          },
          {
            type: "number",
            key: "max_topics",
            label: "最大话题数",
            min: 1,
            max: 1000,
            defaultValue: 50,
          },
        ];

      case "challenge":
        return [
          { type: "input", key: "keyword", label: "关键词" },
          {
            type: "number",
            key: "max_topics",
            label: "最大话题数",
            min: 1,
            max: 1000,
            defaultValue: 50,
          },
        ];

      case "search":
        return [
          {
            type: "select",
            key: "board_type",
            label: "板块类型",
            options: [
              { value: "0", label: "热点话题" },
              { value: "2", label: "其他板块" },
            ],
          },
          { type: "input", key: "board_sub_type", label: "子板块类型" },
        ];

      case "accounts":
        return [
          {
            type: "select",
            key: "date_window",
            label: "时间窗口",
            options: [
              { value: "1", label: "按小时" },
              { value: "2", label: "按天" },
            ],
          },
          {
            type: "number",
            key: "max_users",
            label: "最大用户数",
            min: 1,
            max: 1000,
            defaultValue: 50,
          },
        ];

      case "video":
      case "lowfan":
      case "completion":
      case "follower":
      case "like":
      case "risingtopic":
        return [
          {
            type: "select",
            key: "date_window",
            label: "时间窗口",
            options: [
              { value: "1", label: "按小时" },
              { value: "2", label: "按天" },
            ],
          },
          {
            type: "number",
            key: "max_videos",
            label: "最大视频数",
            min: 1,
            max: 1000,
            defaultValue: 50,
          },
        ];

      case "hotwords":
        return [
          { type: "input", key: "keyword", label: "关键词" },
          {
            type: "select",
            key: "date_window",
            label: "时间窗口",
            options: [
              { value: "1", label: "按小时" },
              { value: "2", label: "按天" },
            ],
          },
          {
            type: "number",
            key: "max_words",
            label: "最大词汇数",
            min: 1,
            max: 1000,
            defaultValue: 50,
          },
        ];

      case "brand":
        return [
          {
            type: "select",
            key: "category_id",
            label: "品牌分类",
            options: brandCategories,
            required: true,
          },
        ];

      case "calendar":
        return [
          { type: "select", key: "city_code", label: "城市", options: cityOptions },
          { type: "input", key: "category_code", label: "分类代码" },
          { type: "daterange", key: "dateRange", label: "时间区间" },
        ];

      case "music":
      case "livestream":
        return [];

      default:
        return [];
    }
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (start: string, end: string) => {
    const startTimestamp = start ? new Date(start).getTime() / 1000 : undefined;
    const endTimestamp = end ? new Date(end).getTime() / 1000 : undefined;
    setFilters((prev) => ({ 
      ...prev, 
      start_date: startTimestamp, 
      end_date: endTimestamp 
    }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch (activeTab) {
        case 'rising':
          result = await apiClient.getDouyinHotRise(filters);
          break;
        case 'local':
          result = await apiClient.getDouyinHotCity(filters);
          break;
        case 'challenge':
          result = await apiClient.getDouyinHotChallenge(filters);
          break;
        case 'search':
        case 'risingsearch':
          result = await apiClient.getDouyinHotSearch(filters);
          break;
        case 'accounts':
          result = await apiClient.getDouyinHotAccount(filters);
          break;
        case 'video':
          result = await apiClient.getDouyinHotVideo(filters);
          break;
        case 'lowfan':
          result = await apiClient.getDouyinHotLowFan(filters);
          break;
        case 'completion':
          result = await apiClient.getDouyinHotHighCompletionRate(filters);
          break;
        case 'follower':
          result = await apiClient.getDouyinHotHighFanRate(filters);
          break;
        case 'like':
          result = await apiClient.getDouyinHotHighLikeRate(filters);
          break;
        case 'risingtopic':
          result = await apiClient.getDouyinHotTopics(filters);
          break;
        case 'hotwords':
          result = await apiClient.getDouyinHotWords(filters);
          break;
        case 'music':
          result = await apiClient.getDouyinHotMusic();
          break;
        case 'brand':
          if (!filters.category_id) {
            throw new Error('品牌热度榜需要选择品牌分类');
          }
          result = await apiClient.getDouyinHotBrand(filters as DouyinHotBrandParams);
          break;
        case 'livestream':
          result = await apiClient.getDouyinHotLive();
          break;
        case 'calendar':
          result = await apiClient.getDouyinHotActivityCalendar(filters);
          break;
        default:
          throw new Error('未支持的榜单类型');
      }
      
      setData(result || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取数据失败';
      setError(errorMessage);
      console.error('API调用失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 自动加载数据
  useEffect(() => {
    handleSearch();
  }, [activeTab]);


  const resetFilters = () => {
    setFilters({});
  };

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const toggleVideoExpanded = (rowIndex: number) => {
    setExpandedVideoRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  };

  const handleExport = () => {
    console.log("导出数据", { tab: activeTab, filters, data });
  };

  const renderFilterComponent = (filter: any) => {
    const key = filter.key;

    switch (filter.type) {
      case "select":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {filter.label}
              {filter.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={filters[key as keyof FilterState]?.toString() || ""}
              onValueChange={(value) => handleFilterChange(key, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`选择${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                {(Array.isArray(filter.options) ? filter.options : []).map(
                  (option) => (
                    <SelectItem
                      key={typeof option === "string" ? option : option.value}
                      value={typeof option === "string" ? option : option.value}
                    >
                      {typeof option === "string" ? option : option.label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        );

      case "input":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{filter.label}</Label>
            <Input
              id={key}
              placeholder={`请输入${filter.label}`}
              value={filters[key as keyof FilterState]?.toString() || ""}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            />
          </div>
        );

      case "number":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{filter.label}</Label>
            <Input
              id={key}
              type="number"
              min={filter.min}
              max={filter.max}
              placeholder={filter.defaultValue?.toString() || ""}
              value={filters[key as keyof FilterState]?.toString() || ""}
              onChange={(e) => handleFilterChange(key, parseInt(e.target.value) || filter.defaultValue)}
            />
          </div>
        );

      case "daterange":
        return (
          <div key={key} className="space-y-2">
            <Label>{filter.label}</Label>
            <div className="flex space-x-2">
              <Input
                type="date"
                placeholder="开始日期"
                onChange={(e) => handleDateRangeChange(e.target.value, "")}
              />
              <Input
                type="date"
                placeholder="结束日期"
                onChange={(e) => handleDateRangeChange("", e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getTrendIcon = (rankDiff?: number) => {
    if (!rankDiff) return <span className="w-3 h-3 text-gray-400">-</span>;
    
    if (rankDiff > 0) {
      return <ArrowUpIcon className="w-3 h-3 text-red-500" />;
    } else if (rankDiff < 0) {
      return <ArrowDownIcon className="w-3 h-3 text-green-500" />;
    } else {
      return <Badge className="text-xs bg-blue-500">新</Badge>;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toLocaleString();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const renderLocalTrendsChart = (trends: DouyinHotTrendPoint[]) => {
    if (!trends || trends.length === 0) {
      return null;
    }

    // 从详细的时间数据中提取每天最早的数据点
    const dailyEarliestData = new Map<string, DouyinHotTrendPoint>();
    
    trends.forEach((point) => {
      // 从 "20250717175500" 格式中提取日期部分 "20250717"
      const dateKey = point.datetime.substring(0, 8);
      
      // 如果这个日期还没有记录，或者当前时间更早，则更新
      if (!dailyEarliestData.has(dateKey) || 
          point.datetime < dailyEarliestData.get(dateKey)!.datetime) {
        dailyEarliestData.set(dateKey, point);
      }
    });

    // 转换为数组并排序
    const chartData = Array.from(dailyEarliestData.values())
      .sort((a, b) => a.datetime.localeCompare(b.datetime))
      .map((point) => ({
        // 格式化日期显示为 "07-17" 格式
        time: `${point.datetime.substring(4, 6)}-${point.datetime.substring(6, 8)}`,
        value: point.hot_score,
        fullDateTime: point.datetime, // 保留完整时间用于tooltip
      }));

    const maxScore = Math.max(...chartData.map((d) => d.value));
    const minScore = Math.min(...chartData.map((d) => d.value));

    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              fontSize={12}
            />
            <YAxis
              fontSize={12}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              formatter={(value: number) => [
                formatNumber(value),
                "热度值",
              ]}
              labelFormatter={(label, payload) => {
                if (payload && payload[0] && payload[0].payload) {
                  const fullDateTime = payload[0].payload.fullDateTime;
                  // 格式化完整时间显示
                  return `${fullDateTime.substring(0, 4)}-${fullDateTime.substring(4, 6)}-${fullDateTime.substring(6, 8)} ${fullDateTime.substring(8, 10)}:${fullDateTime.substring(10, 12)}`;
                }
                return label;
              }}
              labelStyle={{ color: "#000" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* 统计信息 */}
        <div className="flex justify-center mt-2 text-xs text-muted-foreground">
          <span>
            数据点: {chartData.length} 天 | 峰值: {formatNumber(maxScore)} | 谷值:{" "}
            {formatNumber(minScore)}
          </span>
        </div>
      </div>
    );
  };

  const renderTrendsChart = (trends: DouyinHotTrendPoint[]) => {
    if (!trends || trends.length === 0) {
      return null;
    }

    // 准备图表数据 - 直接使用原始datetime字符串
    const chartData = trends.map((point) => ({
      time: point.datetime,
      value: point.hot_score,
    }));

    const maxScore = Math.max(...trends.map((t) => t.hot_score));
    const minScore = Math.min(...trends.map((t) => t.hot_score));

    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis
              fontSize={12}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              formatter={(value: number) => [
                formatNumber(value),
                "热度值",
              ]}
              labelStyle={{ color: "#000" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* 统计信息 */}
        <div className="flex justify-center mt-2 text-xs text-muted-foreground">
          <span>
            数据点: {trends.length} | 峰值: {formatNumber(maxScore)} | 谷值:{" "}
            {formatNumber(minScore)}
          </span>
        </div>
      </div>
    );
  };

  const renderTrendsData = (trends: DouyinHotTrendPoint[], topic: DouyinHotTopic) => {
    if (!trends || trends.length === 0) {
      return <div className="text-sm text-muted-foreground">无趋势数据</div>;
    }

    return (
      <div className="space-y-4">
        {/* 基本信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">快照ID</span>
            <div className="font-mono text-xs">{topic.snapshot_id}</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">话题ID</span>
            <div className="font-mono text-xs">{topic.sentence_id}</div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">视频数量</span>
            <div className="text-sm font-medium">{formatNumber(topic.video_count)}</div>
          </div>
        </div>

        {/* 趋势图表 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-blue-500" />
              热度趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderTrendsChart(trends)}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLocalData = (topic: DouyinHotTopic) => {
    return (
      <div className="space-y-4">
        {/* 基本信息 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              话题详情
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">快照ID</span>
                <div className="font-mono text-xs">{topic.snapshot_id}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">话题ID</span>
                <div className="font-mono text-xs">{topic.sentence_id}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">视频数量</span>
                <div className="text-sm font-medium">{formatNumber(topic.video_count)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">热度分数</span>
                <div className="text-sm font-medium">{formatNumber(topic.hot_score)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">话题类型</span>
                <div className="text-sm">
                  <Badge variant="outline" className="text-xs">
                    {topic.sentence_tag_name || topic.sentence_tag}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">城市</span>
                <div className="text-sm">{topic.city_name || '-'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">创建时间</span>
                <div className="text-sm">{formatDate(topic.create_at)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">排名变化</span>
                <div className="text-sm">
                  {topic.rank_diff !== undefined ? (
                    <div className="flex items-center space-x-1">
                      {topic.rank_diff > 0 ? (
                        <ArrowUpIcon className="w-3 h-3 text-green-500" />
                      ) : topic.rank_diff < 0 ? (
                        <ArrowDownIcon className="w-3 h-3 text-red-500" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                      <span className={
                        topic.rank_diff > 0 ? "text-green-500" : 
                        topic.rank_diff < 0 ? "text-red-500" : 
                        "text-gray-400"
                      }>
                        {topic.rank_diff > 0 ? `+${topic.rank_diff}` : topic.rank_diff}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 趋势图表 - 如果有trends数据 */}
        {topic.trends && topic.trends.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4 text-blue-500" />
                热度趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderLocalTrendsChart(topic.trends)}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderChallengeData = (topic: DouyinHotTopic) => {
    return (
      <div className="space-y-4">
        {/* 基本信息 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              挑战话题详情
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">快照ID</span>
                <div className="font-mono text-xs">{topic.snapshot_id}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">话题ID</span>
                <div className="font-mono text-xs">{topic.sentence_id}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">视频数量</span>
                <div className="text-sm font-medium">{formatNumber(topic.video_count)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">热度分数</span>
                <div className="text-sm font-medium">{formatNumber(topic.hot_score)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">话题类型</span>
                <div className="text-sm">
                  <Badge variant="outline" className="text-xs">
                    {topic.sentence_tag_name || topic.sentence_tag}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">城市</span>
                <div className="text-sm">{topic.city_name || '-'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">创建时间</span>
                <div className="text-sm">{formatDate(topic.create_at)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">排名变化</span>
                <div className="text-sm">
                  {topic.rank_diff !== undefined ? (
                    <div className="flex items-center space-x-1">
                      {topic.rank_diff > 0 ? (
                        <ArrowUpIcon className="w-3 h-3 text-green-500" />
                      ) : topic.rank_diff < 0 ? (
                        <ArrowDownIcon className="w-3 h-3 text-red-500" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                      <span className={
                        topic.rank_diff > 0 ? "text-green-500" : 
                        topic.rank_diff < 0 ? "text-red-500" : 
                        "text-gray-400"
                      }>
                        {topic.rank_diff > 0 ? `+${topic.rank_diff}` : topic.rank_diff}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 趋势图表 - 如果有trends数据 */}
        {topic.trends && topic.trends.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4 text-blue-500" />
                挑战热度趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 根据数据格式选择合适的图表渲染方法 */}
              {topic.trends[0]?.datetime.length > 10 ? 
                renderLocalTrendsChart(topic.trends) : 
                renderTrendsChart(topic.trends)
              }
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderSearchData = (searchItem: DouyinHotSearchItem) => {
    return (
      <div className="space-y-4">
        {/* 基本信息 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              搜索热点详情
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Group ID</span>
                <div className="font-mono text-xs">{searchItem.group_id}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Sentence ID</span>
                <div className="font-mono text-xs">{searchItem.sentence_id}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Is N1</span>
                <div className="text-sm">
                  <Badge variant={searchItem.is_n1 ? "default" : "secondary"} className="text-xs">
                    {searchItem.is_n1 ? "是" : "否"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">最高排名</span>
                <div className="text-sm font-medium">{searchItem.max_rank}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">搜索词</span>
                <div className="text-sm font-medium">{searchItem.word}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">当前排名</span>
                <div className="text-sm font-medium">{searchItem.position}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">热度值</span>
                <div className="text-sm font-medium">{formatNumber(searchItem.hot_value)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">视频数量</span>
                <div className="text-sm font-medium">{formatNumber(searchItem.video_count)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">观看数量</span>
                <div className="text-sm font-medium">{formatNumber(searchItem.view_count)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">讨论视频数量</span>
                <div className="text-sm font-medium">{formatNumber(searchItem.discuss_video_count)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">事件时间</span>
                <div className="text-sm">{formatDate(searchItem.event_time)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">标签</span>
                <div className="text-sm">
                  {searchItem.label ? (
                    <Badge variant="outline" className="text-xs">
                      {searchItem.label}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 扩展信息 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-500" />
              扩展信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">热榜参数</span>
                <div className="font-mono text-xs break-all">{searchItem.hotlist_param || '-'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">标签URL</span>
                <div className="text-xs break-all">
                  {searchItem.label_url ? (
                    <a 
                      href={searchItem.label_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 underline"
                    >
                      {searchItem.label_url}
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">可扩展详情</span>
                <div className="text-sm">
                  <Badge variant={searchItem.can_extend_detail ? "default" : "secondary"} className="text-xs">
                    {searchItem.can_extend_detail ? "可扩展" : "不可扩展"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFansTrendsChart = (fansTrends: any[]) => {
    if (!fansTrends || fansTrends.length === 0) {
      return null;
    }

    // 准备图表数据 - 处理不同格式的数据
    let chartData;
    if (typeof fansTrends[0] === 'object' && fansTrends[0].DateTime) {
      // 新格式: [{DateTime: "2025-07-12", Value: 29101}, ...]
      chartData = fansTrends.map((point) => ({
        time: point.DateTime,
        value: point.Value,
      }));
    } else {
      // 旧格式: [29101, 52746, ...] 或其他格式
      chartData = fansTrends.map((value, index) => ({
        time: `Day ${index + 1}`,
        value: typeof value === 'number' ? value : value.value || value,
      }));
    }

    const maxFans = Math.max(...chartData.map((t) => t.value));
    const minFans = Math.min(...chartData.map((t) => t.value));

    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis
              fontSize={12}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              formatter={(value: number) => [
                formatNumber(value),
                "粉丝数",
              ]}
              labelStyle={{ color: "#000" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* 统计信息 */}
        <div className="flex justify-center mt-2 text-xs text-muted-foreground">
          <span>
            数据点: {fansTrends.length} | 峰值: {formatNumber(maxFans)} | 谷值:{" "}
            {formatNumber(minFans)}
          </span>
        </div>
      </div>
    );
  };

  const renderChallengeRisingData = (challenge: any) => {
    return (
      <div className="space-y-4">
        {/* 基本信息 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              挑战话题详情
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">挑战ID</span>
                <div className="font-mono text-xs">{challenge.challenge_id}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">播放数</span>
                <div className="text-sm font-medium">{formatNumber(challenge.play_cnt)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">发布数</span>
                <div className="text-sm font-medium">{formatNumber(challenge.publish_cnt)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">热度分数</span>
                <div className="text-sm font-medium">{formatNumber(challenge.score)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">平均播放数</span>
                <div className="text-sm font-medium">{formatNumber(challenge.avg_play_cnt)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">挑战类型</span>
                <div className="text-sm">
                  <Badge variant="outline" className="text-xs">
                    {challenge.challenge_type === 1 ? "热门挑战" : "普通挑战"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">创建时间</span>
                <div className="text-sm">{formatDate(challenge.create_time)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">排名</span>
                <div className="text-sm font-medium">#{challenge.show_rank}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 趋势图表 - 如果有trends数据 */}
        {challenge.trends && challenge.trends.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4 text-blue-500" />
                热度飙升趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderChallengeRisingTrendsChart(challenge.trends)}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderMusicData = (music: any) => {
    return (
      <div className="space-y-4">
        {/* 音乐详情 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              音乐详情
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">音乐ID</span>
                <div className="font-mono text-xs">{music.id}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">标题</span>
                <div className="text-sm font-medium">{music.title}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">艺术家</span>
                <div className="text-sm">{music.author}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">专辑</span>
                <div className="text-sm">{music.album}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">时长</span>
                <div className="text-sm">{music.duration}秒</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">热度值</span>
                <div className="text-sm font-medium">{formatNumber(music.heat)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">使用人数</span>
                <div className="text-sm">{formatNumber(music.user_count)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">峰值</span>
                <div className="text-sm">{music.peak}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">响度</span>
                <div className="text-sm">{music.loudness} dB</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">语言</span>
                <div className="text-sm">{music.languages?.join(', ') || '-'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">情绪</span>
                <div className="text-sm">{music.moods?.join(', ') || '-'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">类型</span>
                <div className="text-sm">{music.genres?.join(', ') || '-'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">主题</span>
                <div className="text-sm">{music.themes?.join(', ') || '-'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">音频特征</span>
                <div className="text-sm">{music.aeds?.join(', ') || '-'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">状态</span>
                <div className="text-sm">
                  <Badge variant={music.status === 1 ? "default" : "destructive"} className="text-xs">
                    {music.status === 1 ? "可用" : "不可用"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">原创</span>
                <div className="text-sm">
                  <Badge variant={music.is_original ? "default" : "secondary"} className="text-xs">
                    {music.is_original ? "原创" : "非原创"}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* 音乐封面和播放器 */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground">专辑封面</span>
                <div className="mt-2">
                  <img
                    src={music.cover_large || "/api/placeholder/200/200"}
                    alt="专辑封面"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              </div>
              {music.play_url && (
                <div>
                  <span className="text-xs text-muted-foreground">音频播放</span>
                  <div className="mt-2">
                    <audio
                      src={music.play_url}
                      controls
                      className="w-full"
                      preload="metadata"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderActivityData = (activity: any) => {
    return (
      <div className="space-y-4">
        {/* 活动详情 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              活动详情
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">活动ID</span>
                <div className="font-mono text-xs">{activity.id}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">父级ID</span>
                <div className="text-sm">{activity.parent_id || '0'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">活动标题</span>
                <div className="text-sm font-medium">{activity.hot_title}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">分类</span>
                <div className="text-sm">{activity.category_name || '未分类'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">城市</span>
                <div className="text-sm">{activity.city_name || '全国'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">级别代码</span>
                <div className="text-sm">{activity.level_code}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">事件状态</span>
                <div className="text-sm">
                  <Badge variant={activity.event_status === -1 ? "destructive" : "default"} className="text-xs">
                    {activity.event_status === -1 ? "已结束" : "进行中"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">句子ID</span>
                <div className="text-sm">{activity.sentence_id}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">句子类型</span>
                <div className="text-sm">{activity.sentence_type}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">句子排名</span>
                <div className="text-sm">{activity.sentence_rank === -1 ? '无排名' : activity.sentence_rank}</div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">开始时间</span>
                <div className="text-sm">
                  {activity.start_date ? new Date(activity.start_date * 1000).toLocaleString() : '未知'}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">结束时间</span>
                <div className="text-sm">
                  {activity.end_date ? new Date(activity.end_date * 1000).toLocaleString() : '未知'}
                </div>
              </div>
            </div>
            
            {/* 活动封面 */}
            <div className="mt-4">
              <span className="text-xs text-muted-foreground">活动封面</span>
              <div className="mt-2">
                <img
                  src={activity.cover_url || "/api/placeholder/200/200"}
                  alt="活动封面"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderHotWordData = (hotWord: any) => {
    return (
      <div className="space-y-4">
        {/* 趋势图表 - 如果有trends数据 */}
        {hotWord.trends && hotWord.trends.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4 text-blue-500" />
                热门词趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderHotWordTrendsChart(hotWord.trends)}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderHotWordTrendsChart = (trends: any[]) => {
    if (!trends || trends.length === 0) {
      return null;
    }

    // 准备图表数据 - trends格式: [{date: "20250614", value: 16033.575145840723}, ...]
    const chartData = trends.map((point) => ({
      time: point.date,
      value: point.value,
    }));

    const maxValue = Math.max(...chartData.map((t) => t.value));
    const minValue = Math.min(...chartData.map((t) => t.value));

    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis
              fontSize={12}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              formatter={(value: number) => [
                formatNumber(value),
                "热度值",
              ]}
              labelStyle={{ color: "#000" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* 统计信息 */}
        <div className="flex justify-center mt-2 text-xs text-muted-foreground">
          <span>
            数据点: {trends.length} | 峰值: {formatNumber(maxValue)} | 谷值:{" "}
            {formatNumber(minValue)}
          </span>
        </div>
      </div>
    );
  };

  const renderChallengeRisingTrendsChart = (trends: any[]) => {
    if (!trends || trends.length === 0) {
      return null;
    }

    // 准备图表数据 - trends格式: [{date: "20250704", value: 13452}, ...]
    const chartData = trends.map((point) => ({
      time: point.date,
      value: point.value,
    }));

    const maxValue = Math.max(...chartData.map((t) => t.value));
    const minValue = Math.min(...chartData.map((t) => t.value));

    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis
              fontSize={12}
              tickFormatter={(value) => formatNumber(value)}
            />
            <Tooltip
              formatter={(value: number) => [
                formatNumber(value),
                "热度值",
              ]}
              labelStyle={{ color: "#000" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* 统计信息 */}
        <div className="flex justify-center mt-2 text-xs text-muted-foreground">
          <span>
            数据点: {trends.length} | 峰值: {formatNumber(maxValue)} | 谷值:{" "}
            {formatNumber(minValue)}
          </span>
        </div>
      </div>
    );
  };

  const renderAccountData = (account: DouyinHotAccount) => {
    return (
      <div className="space-y-4">
        {/* User ID 信息 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              User ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm">{account.user_id}</div>
          </CardContent>
        </Card>

        {/* 粉丝趋势图表 - 如果有fans_trends数据 */}
        {account.fans_trends && account.fans_trends.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                粉丝增长趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderFansTrendsChart(account.fans_trends)}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderDataRow = (item: RankingData, index: number) => {
    // 根据不同类型的数据渲染不同的行
    
    // 热度飙升话题榜数据 (challenge_name + challenge_id)
    if ('challenge_name' in item && 'challenge_id' in item) {
      const challenge = item as any;
      const rowId = `${challenge.challenge_id}-${index}`;
      const isExpanded = expandedRows.has(rowId);
      
      return (
        <React.Fragment key={index}>
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-2">
              <div className="flex items-center space-x-1">
                <span className={`font-medium ${challenge.show_rank <= 3 ? "text-yellow-600" : ""}`}>
                  {challenge.show_rank || index + 1}
                </span>
                {/* 暂时使用静态图标，因为没有rank_diff字段 */}
                <ArrowUpIcon className="w-3 h-3 text-green-500" />
              </div>
            </td>
            <td className="p-2">
              <div className="flex items-center space-x-2">
                <img
                  src={challenge.cover_url || "/api/placeholder/32/32"}
                  alt="话题封面"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{challenge.challenge_name}</div>
                </div>
              </div>
            </td>
            <td className="p-2">
              <Badge variant="outline" className="text-xs">
                {challenge.challenge_type === 1 ? "热门挑战" : "普通挑战"}
              </Badge>
            </td>
            <td className="p-2 text-sm">{formatNumber(challenge.score)}</td>
            <td className="p-2 text-sm">{formatNumber(challenge.publish_cnt)}</td>
            <td className="p-2 text-sm">
              <div className="flex items-center space-x-1">
                <ArrowUpIcon className="w-3 h-3 text-green-500" />
                <span className="text-green-500">飙升</span>
              </div>
            </td>
            <td className="p-2 text-sm">{formatDate(challenge.create_time)}</td>
            <td className="p-2">
              {/* 详情按钮 - 如果有trends数据 */}
              {challenge.trends && challenge.trends.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRowExpansion(rowId)}
                  className="flex items-center space-x-1"
                >
                  <Info className="h-3 w-3" />
                  <span className="text-xs">详情</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              )}
            </td>
          </tr>
          {/* 展开的趋势数据行 */}
          {isExpanded && challenge.trends && (
            <tr className="bg-gray-50/50">
              <td colSpan={8} className="p-4">
                <div className="max-w-4xl mx-auto">
                  {renderChallengeRisingData(challenge)}
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    }
    
    if ('sentence' in item) {
      // 话题类型数据
      const topic = item as DouyinHotTopic;
      const rowId = `${topic.sentence_id}-${index}`;
      const isExpanded = expandedRows.has(rowId);
      
      // 上升热点榜
      if (activeTab === 'rising') {
        return (
          <React.Fragment key={index}>
            <tr className="border-b hover:bg-muted/50 transition-colors">
              <td className="p-2">
                <div className="flex items-center space-x-1">
                  <span className={`font-medium ${topic.rank <= 3 ? "text-yellow-600" : ""}`}>
                    {topic.rank}
                  </span>
                  {getTrendIcon(topic.rank_diff)}
                </div>
              </td>
              <td className="p-2">
                <div className="font-medium text-sm">{topic.sentence}</div>
                <div className="text-xs text-muted-foreground">{topic.sentence_id}</div>
              </td>
              <td className="p-2">
                <Badge variant="outline" className="text-xs">{topic.sentence_tag_name || topic.sentence_tag}</Badge>
              </td>
              <td className="p-2 text-sm">{formatNumber(topic.hot_score)}</td>
              <td className="p-2 text-sm">{formatNumber(topic.video_count)}</td>
              <td className="p-2 text-sm">
                {topic.rank_diff !== undefined ? (
                  <div className="flex items-center space-x-1">
                    {topic.rank_diff > 0 ? (
                      <ArrowUpIcon className="w-3 h-3 text-green-500" />
                    ) : topic.rank_diff < 0 ? (
                      <ArrowDownIcon className="w-3 h-3 text-red-500" />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                    <span className={
                      topic.rank_diff > 0 ? "text-green-500" : 
                      topic.rank_diff < 0 ? "text-red-500" : 
                      "text-gray-400"
                    }>
                      {topic.rank_diff > 0 ? `+${topic.rank_diff}` : topic.rank_diff}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="p-2 text-sm">{formatDate(topic.create_at)}</td>
              <td className="p-2">
                {/* 详情按钮 - 只在上升热点榜显示 */}
                {topic.trends && topic.trends.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRowExpansion(rowId)}
                    className="flex items-center space-x-1"
                  >
                    <Info className="h-3 w-3" />
                    <span className="text-xs">详情</span>
                    {isExpanded ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </td>
            </tr>
            {/* 展开的趋势数据行 */}
            {isExpanded && topic.trends && (
              <tr className="bg-gray-50/50">
                <td colSpan={8} className="p-4">
                  <div className="max-w-4xl mx-auto">
                    {renderTrendsData(topic.trends, topic)}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      }
      
      // 同城热点榜
      if (activeTab === 'local') {
        return (
          <React.Fragment key={index}>
            <tr className="border-b hover:bg-muted/50 transition-colors">
              <td className="p-2">
                <div className="flex items-center space-x-1">
                  <span className={`font-medium ${topic.rank <= 3 ? "text-yellow-600" : ""}`}>
                    {topic.rank}
                  </span>
                  {getTrendIcon(topic.rank_diff)}
                </div>
              </td>
              <td className="p-2">
                <div className="font-medium text-sm">{topic.sentence}</div>
                <div className="text-xs text-muted-foreground">{topic.sentence_id}</div>
              </td>
              <td className="p-2">
                <Badge variant="outline" className="text-xs">{topic.sentence_tag_name || topic.sentence_tag}</Badge>
              </td>
              <td className="p-2 text-sm">{formatNumber(topic.hot_score)}</td>
              <td className="p-2 text-sm">{formatNumber(topic.video_count)}</td>
              <td className="p-2 text-sm">{topic.city_name || '-'}</td>
              <td className="p-2 text-sm">
                {topic.rank_diff !== undefined ? (
                  <div className="flex items-center space-x-1">
                    {topic.rank_diff > 0 ? (
                      <ArrowUpIcon className="w-3 h-3 text-green-500" />
                    ) : topic.rank_diff < 0 ? (
                      <ArrowDownIcon className="w-3 h-3 text-red-500" />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                    <span className={
                      topic.rank_diff > 0 ? "text-green-500" : 
                      topic.rank_diff < 0 ? "text-red-500" : 
                      "text-gray-400"
                    }>
                      {topic.rank_diff > 0 ? `+${topic.rank_diff}` : topic.rank_diff}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="p-2 text-sm">{formatDate(topic.create_at)}</td>
              <td className="p-2">
                {/* 详情按钮 - 同城热点榜 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRowExpansion(rowId)}
                  className="flex items-center space-x-1"
                >
                  <Info className="h-3 w-3" />
                  <span className="text-xs">详情</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </td>
            </tr>
            {/* 展开的同城数据行 */}
            {isExpanded && (
              <tr className="bg-gray-50/50">
                <td colSpan={9} className="p-4">
                  <div className="max-w-4xl mx-auto">
                    {renderLocalData(topic)}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      }
      
      // 挑战热点榜
      if (activeTab === 'challenge') {
        return (
          <React.Fragment key={index}>
            <tr className="border-b hover:bg-muted/50 transition-colors">
              <td className="p-2">
                <div className="flex items-center space-x-1">
                  <span className={`font-medium ${topic.rank <= 3 ? "text-yellow-600" : ""}`}>
                    {topic.rank}
                  </span>
                  {getTrendIcon(topic.rank_diff)}
                </div>
              </td>
              <td className="p-2">
                <div className="font-medium text-sm">{topic.sentence}</div>
                <div className="text-xs text-muted-foreground">{topic.sentence_id}</div>
              </td>
              <td className="p-2">
                <Badge variant="outline" className="text-xs">{topic.sentence_tag_name || topic.sentence_tag}</Badge>
              </td>
              <td className="p-2 text-sm">{formatNumber(topic.hot_score)}</td>
              <td className="p-2 text-sm">{formatNumber(topic.video_count)}</td>
              <td className="p-2 text-sm">{topic.city_name || '-'}</td>
              <td className="p-2 text-sm">{formatDate(topic.create_at)}</td>
              <td className="p-2">
                {/* 详情按钮 - 挑战热点榜 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRowExpansion(rowId)}
                  className="flex items-center space-x-1"
                >
                  <Info className="h-3 w-3" />
                  <span className="text-xs">详情</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </td>
            </tr>
            {/* 展开的挑战数据行 */}
            {isExpanded && (
              <tr className="bg-gray-50/50">
                <td colSpan={8} className="p-4">
                  <div className="max-w-4xl mx-auto">
                    {renderChallengeData(topic)}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      }
      
      // 其他话题榜单 (risingtopic等)
      return (
        <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
          <td className="p-2">
            <div className="flex items-center space-x-1">
              <span className={`font-medium ${topic.rank <= 3 ? "text-yellow-600" : ""}`}>
                {topic.rank}
              </span>
              {getTrendIcon(topic.rank_diff)}
            </div>
          </td>
          <td className="p-2">
            <div className="font-medium text-sm">{topic.sentence}</div>
            <div className="text-xs text-muted-foreground">{topic.sentence_id}</div>
          </td>
          <td className="p-2">
            <Badge variant="outline" className="text-xs">{topic.sentence_tag_name || topic.sentence_tag}</Badge>
          </td>
          <td className="p-2 text-sm">{formatNumber(topic.hot_score)}</td>
          <td className="p-2 text-sm">{formatNumber(topic.video_count)}</td>
          <td className="p-2 text-sm">{topic.city_name || '-'}</td>
          <td className="p-2 text-sm">{formatDate(topic.create_at)}</td>
        </tr>
      );
    } else if ('word' in item) {
      // 搜索热点数据
      const searchItem = item as DouyinHotSearchItem;
      const rowId = `${searchItem.sentence_id}-${index}`;
      const isExpanded = expandedRows.has(rowId);
      
      return (
        <React.Fragment key={index}>
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-2">
              <span className="font-medium">{searchItem.position}</span>
            </td>
            <td className="p-2">
              <div className="font-medium text-sm">{searchItem.word}</div>
              <div className="text-xs text-muted-foreground">{searchItem.sentence_id}</div>
            </td>
            <td className="p-2">
              <Badge variant="outline" className="text-xs">搜索热点</Badge>
            </td>
            <td className="p-2 text-sm">{formatNumber(searchItem.hot_value)}</td>
            <td className="p-2 text-sm">{formatNumber(searchItem.video_count)}</td>
            <td className="p-2 text-sm">{formatNumber(searchItem.view_count)}</td>
            <td className="p-2 text-sm">{formatDate(searchItem.event_time)}</td>
            <td className="p-2">
              {/* 详情按钮 - 搜索热点榜 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleRowExpansion(rowId)}
                className="flex items-center space-x-1"
              >
                <Info className="h-3 w-3" />
                <span className="text-xs">详情</span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </td>
          </tr>
          {/* 展开的搜索热点数据行 */}
          {isExpanded && (
            <tr className="bg-gray-50/50">
              <td colSpan={8} className="p-4">
                <div className="max-w-4xl mx-auto">
                  {renderSearchData(searchItem)}
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    } else if ('nick_name' in item && 'user_id' in item) {
      // 账号类型数据 - 确保是账号数据而不是视频数据
      const account = item as DouyinHotAccount;
      const rowId = `${account.user_id}-${index}`;
      const isExpanded = expandedRows.has(rowId);
      
      return (
        <React.Fragment key={index}>
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-2">
              <span className="font-medium">{index + 1}</span>
            </td>
            <td className="p-2">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={account.avatar_url} />
                  <AvatarFallback>{account.nick_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{account.nick_name}</div>
                </div>
              </div>
            </td>
            <td className="p-2 text-sm">{formatNumber(account.fans_cnt)}</td>
            <td className="p-2 text-sm">{formatNumber(account.like_cnt)}</td>
            <td className="p-2 text-sm">{formatNumber(account.publish_cnt)}</td>
            <td className="p-2">
              {/* 详情按钮 - 热门账号榜单 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleRowExpansion(rowId)}
                className="flex items-center space-x-1"
              >
                <Info className="h-3 w-3" />
                <span className="text-xs">详情</span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </td>
          </tr>
          {/* 展开的账号数据行 */}
          {isExpanded && (
            <tr className="bg-gray-50/50">
              <td colSpan={6} className="p-4">
                <div className="max-w-4xl mx-auto">
                  {renderAccountData(account)}
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    } else if ('item_title' in item && 'item_id' in item) {
      // 视频类型数据 - 修正字段映射以匹配实际API响应
      const video = item as any; // 使用any类型因为实际API字段与接口定义不同
      return (
        <React.Fragment key={index}>
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-2">
              <span className="font-medium">{index + 1}</span>
            </td>
            <td className="p-2">
              {video.item_url ? (
                <video
                  src={video.item_url}
                  className="w-20 h-16 object-cover rounded"
                  controls
                  muted
                  preload="metadata"
                />
              ) : (
                <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">无视频</span>
                </div>
              )}
            </td>
            <td className="p-2">
              <div className="font-medium text-sm">{video.item_title}</div>
            </td>
            <td className="p-2">
              <div className="flex items-center space-x-2">
                <img
                  src={video.avatar_url || "/api/placeholder/32/32"}
                  alt="作者头像"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{video.nick_name}</span>
              </div>
            </td>
            <td className="p-2 text-sm">{formatNumber(video.play_cnt || 0)}</td>
            <td className="p-2 text-sm">{formatNumber(video.like_cnt || 0)}</td>
            <td className="p-2 text-sm">{video.like_rate || '0.00%'}</td>
            <td className="p-2 text-sm">{formatNumber(video.score || 0)}</td>
            <td className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleVideoExpanded(index)}
              >
                {expandedVideoRows.has(index) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </td>
          </tr>
          {expandedVideoRows.has(index) && (
            <tr>
              <td colSpan={9} className="p-0">
                <div className="bg-gray-50 p-4">
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">作者昵称:</span>
                          <p className="text-sm text-gray-900">{video.nick_name || '未知'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">粉丝数:</span>
                          <p className="text-sm text-gray-900">{formatNumber(video.fans_cnt || 0)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">关注数:</span>
                          <p className="text-sm text-gray-900">{formatNumber(video.follow_cnt || 0)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">关注率:</span>
                          <p className="text-sm text-gray-900">{video.follow_rate || '0'}%</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">媒体类型:</span>
                          <p className="text-sm text-gray-900">{video.media_type || '未知'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">发布时间:</span>
                          <p className="text-sm text-gray-900">
                            {video.publish_time ? new Date(video.publish_time * 1000).toLocaleString() : '未知'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">视频时长:</span>
                          <p className="text-sm text-gray-900">
                            {video.item_duration ? `${Math.floor(video.item_duration / 60)}:${(video.item_duration % 60).toString().padStart(2, '0')}` : '未知'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    } else if ('title' in item && 'author' in item && 'album' in item && 'heat' in item) {
      // 音乐数据 (title + author + album + heat)
      const music = item as any;
      const rowId = `${music.id}-${index}`;
      const isExpanded = expandedRows.has(rowId);
      
      return (
        <React.Fragment key={index}>
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-2">
              <span className="font-medium">{index + 1}</span>
            </td>
            <td className="p-2">
              <div className="flex items-center space-x-2">
                <img
                  src={music.cover_large || "/api/placeholder/32/32"}
                  alt="音乐封面"
                  className="w-8 h-8 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{music.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {music.duration}s • {music.languages?.join(', ')}
                  </div>
                </div>
              </div>
            </td>
            <td className="p-2">
              <div className="text-sm">{music.author}</div>
            </td>
            <td className="p-2">
              <div className="text-sm">{music.album}</div>
            </td>
            <td className="p-2 text-sm">{formatNumber(music.heat)}</td>
            <td className="p-2 text-sm">{formatNumber(music.user_count)}</td>
            <td className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleRowExpansion(rowId)}
                className="flex items-center space-x-1"
              >
                <Info className="h-3 w-3" />
                <span className="text-xs">详情</span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </td>
          </tr>
          {/* 展开的音乐详情行 */}
          {isExpanded && (
            <tr className="bg-gray-50/50">
              <td colSpan={7} className="p-4">
                <div className="max-w-4xl mx-auto">
                  {renderMusicData(music)}
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    } else if ('hot_title' in item && 'cover_url' in item && 'start_date' in item) {
      // 活动日历数据 (hot_title + cover_url + start_date)
      const activity = item as any;
      const rowId = `${activity.id}-${index}`;
      const isExpanded = expandedRows.has(rowId);
      
      return (
        <React.Fragment key={index}>
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-2">
              <span className="font-medium">{index + 1}</span>
            </td>
            <td className="p-2">
              <div className="flex items-center space-x-2">
                <img
                  src={activity.cover_url || "/api/placeholder/32/32"}
                  alt="活动封面"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.hot_title}</div>
                </div>
              </div>
            </td>
            <td className="p-2">
              <Badge variant="outline" className="text-xs">
                {activity.category_name || '未分类'}
              </Badge>
            </td>
            <td className="p-2 text-sm">
              {activity.start_date ? new Date(activity.start_date * 1000).toLocaleDateString() : '-'}
            </td>
            <td className="p-2 text-sm">
              {activity.end_date ? new Date(activity.end_date * 1000).toLocaleDateString() : '-'}
            </td>
            <td className="p-2">
              <Badge variant={activity.event_status === -1 ? "destructive" : "default"} className="text-xs">
                {activity.event_status === -1 ? "已结束" : "进行中"}
              </Badge>
            </td>
            <td className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleRowExpansion(rowId)}
                className="flex items-center space-x-1"
              >
                <Info className="h-3 w-3" />
                <span className="text-xs">详情</span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>
            </td>
          </tr>
          {/* 展开的活动详情行 */}
          {isExpanded && (
            <tr className="bg-gray-50/50">
              <td colSpan={7} className="p-4">
                <div className="max-w-4xl mx-auto">
                  {renderActivityData(activity)}
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    } else if ('title' in item && 'score' in item && 'trends' in item) {
      // 热门词数据 (title + score + trends)
      const hotWord = item as any;
      const rowId = `${hotWord.id}-${index}`;
      const isExpanded = expandedRows.has(rowId);
      
      return (
        <React.Fragment key={index}>
          <tr className="border-b hover:bg-muted/50 transition-colors">
            <td className="p-2">
              <span className="font-medium">{index + 1}</span>
            </td>
            <td className="p-2">
              <div className="font-medium text-sm">{hotWord.title}</div>
            </td>
            <td className="p-2">
              <div className="font-mono text-xs">{hotWord.id}</div>
            </td>
            <td className="p-2 text-sm">{formatNumber(hotWord.score)}</td>
            <td className="p-2">
              {/* 详情按钮 - 如果有trends数据 */}
              {hotWord.trends && hotWord.trends.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleRowExpansion(rowId)}
                  className="flex items-center space-x-1"
                >
                  <Info className="h-3 w-3" />
                  <span className="text-xs">详情</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              )}
            </td>
          </tr>
          {/* 展开的趋势数据行 */}
          {isExpanded && hotWord.trends && (
            <tr className="bg-gray-50/50">
              <td colSpan={5} className="p-4">
                <div className="max-w-4xl mx-auto">
                  {renderHotWordData(hotWord)}
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    } else if ('word' in item && 'hot_score' in item && 'trend' in item) {
      // 词汇类型数据 (旧格式)
      const word = item as DouyinHotWord;
      return (
        <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
          <td className="p-2">
            <span className="font-medium">{index + 1}</span>
          </td>
          <td className="p-2">
            <div className="font-medium text-sm">{word.word}</div>
            <div className="text-xs text-muted-foreground">{word.category}</div>
          </td>
          <td className="p-2 text-sm">{formatNumber(word.hot_score)}</td>
          <td className="p-2 text-sm">{formatNumber(word.video_count)}</td>
          <td className="p-2 text-sm">{formatNumber(word.view_count)}</td>
          <td className="p-2 text-sm">{word.trend}</td>
        </tr>
      );
    } else {
      // 其他类型数据的通用显示
      console.log('Unmatched data type:', item); // 调试日志
      return (
        <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
          <td className="p-2">
            <span className="font-medium">{index + 1}</span>
          </td>
          <td className="p-2">
            <div className="text-sm">数据类型未识别: {Object.keys(item).join(', ')}</div>
          </td>
        </tr>
      );
    }
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'rising':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">话题</th>
            <th className="text-left p-2">分类</th>
            <th className="text-left p-2">热度值</th>
            <th className="text-left p-2">视频数</th>
            <th className="text-left p-2">排名变化</th>
            <th className="text-left p-2">创建时间</th>
            <th className="text-left p-2">详情</th>
          </tr>
        );
      case 'local':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">话题</th>
            <th className="text-left p-2">分类</th>
            <th className="text-left p-2">热度值</th>
            <th className="text-left p-2">视频数</th>
            <th className="text-left p-2">城市</th>
            <th className="text-left p-2">排名变化</th>
            <th className="text-left p-2">创建时间</th>
            <th className="text-left p-2">详情</th>
          </tr>
        );
      case 'challenge':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">话题</th>
            <th className="text-left p-2">分类</th>
            <th className="text-left p-2">热度值</th>
            <th className="text-left p-2">视频数</th>
            <th className="text-left p-2">城市</th>
            <th className="text-left p-2">创建时间</th>
            <th className="text-left p-2">详情</th>
          </tr>
        );
      case 'risingtopic':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">话题</th>
            <th className="text-left p-2">分类</th>
            <th className="text-left p-2">热度值</th>
            <th className="text-left p-2">视频数</th>
            <th className="text-left p-2">城市</th>
            <th className="text-left p-2">创建时间</th>
          </tr>
        );
      case 'accounts':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">账号</th>
            <th className="text-left p-2">粉丝数</th>
            <th className="text-left p-2">点赞数</th>
            <th className="text-left p-2">发布数</th>
            <th className="text-left p-2">详情</th>
          </tr>
        );
      case 'video':
      case 'lowfan':
      case 'completion':
      case 'follower':
      case 'like':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">视频预览</th>
            <th className="text-left p-2">视频</th>
            <th className="text-left p-2">作者</th>
            <th className="text-left p-2">播放数</th>
            <th className="text-left p-2">点赞数</th>
            <th className="text-left p-2">点赞率</th>
            <th className="text-left p-2">热度分</th>
            <th className="text-left p-2">详情</th>
          </tr>
        );
      case 'hotwords':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">词汇</th>
            <th className="text-left p-2">词汇ID</th>
            <th className="text-left p-2">热度值</th>
            <th className="text-left p-2">详情</th>
          </tr>
        );
      case 'search':
      case 'risingsearch':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">搜索词</th>
            <th className="text-left p-2">类型</th>
            <th className="text-left p-2">热度值</th>
            <th className="text-left p-2">视频数</th>
            <th className="text-left p-2">观看数</th>
            <th className="text-left p-2">事件时间</th>
            <th className="text-left p-2">详情</th>
          </tr>
        );
      case 'calendar':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">活动</th>
            <th className="text-left p-2">分类</th>
            <th className="text-left p-2">开始时间</th>
            <th className="text-left p-2">结束时间</th>
            <th className="text-left p-2">状态</th>
            <th className="text-left p-2">详情</th>
          </tr>
        );
      case 'music':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">音乐</th>
            <th className="text-left p-2">艺术家</th>
            <th className="text-left p-2">专辑</th>
            <th className="text-left p-2">热度值</th>
            <th className="text-left p-2">使用人数</th>
            <th className="text-left p-2">详情</th>
          </tr>
        );
      case 'brand':
      case 'livestream':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">名称</th>
            <th className="text-left p-2">分类</th>
            <th className="text-left p-2">热度值</th>
            <th className="text-left p-2">相关数据</th>
          </tr>
        );
      default:
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">内容</th>
          </tr>
        );
    }
  };

  return (
    <DashboardLayout
      title="抖音热度榜单"
      subtitle="实时追踪抖音平台各类热门内容和趋势数据"
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 h-auto p-1">
            {rankingTabs.slice(0, 7).map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs p-2">
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsList className="grid w-full grid-cols-7 h-auto p-1 mt-2">
            {rankingTabs.slice(7, 14).map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs p-2">
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsList className="grid w-full grid-cols-3 h-auto p-1 mt-2">
            {rankingTabs.slice(14).map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs p-2">
                <tab.icon className="w-3 h-3 mr-1" />
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {rankingTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              {/* 过滤器区域 */}
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
                    <Button variant="outline" onClick={resetFilters}>重置</Button>
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

              {/* 错误信息 */}
              {error && (
                <Card className="border-red-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
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
                      <Badge variant="secondary">共 {data.length} 条数据</Badge>
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
                        {renderTableHeaders()}
                      </thead>
                      <tbody>
                        {data.map((item, index) => renderDataRow(item, index))}
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