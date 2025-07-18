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
} from "@/lib/api";
import cityList from "../../douyin_city_list.json";
import categoryList from "../../douyin_rank_category_list.json";

// 从分类列表中获取类型选项
const contentTypes = Object.keys(categoryList).map(label => ({
  label,
  value: categoryList[label as keyof typeof categoryList]
}));

// 品牌分类
const brandCategories = [
  { value: "fashion_001", label: "时尚" },
  { value: "beauty_002", label: "美妆" },
  { value: "food_003", label: "美食" },
  { value: "tech_004", label: "科技" },
  { value: "auto_005", label: "汽车" },
  { value: "home_006", label: "家居" },
  { value: "travel_007", label: "旅行" },
  { value: "health_008", label: "健康" },
];

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
          result = await apiClient.getDouyinHotBrand(filters);
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

  const renderTrendsChart = (trends: DouyinHotTrendPoint[]) => {
    if (!trends || trends.length === 0) {
      return null;
    }

    // 计算图表数据
    const maxScore = Math.max(...trends.map(t => t.hot_score));
    const minScore = Math.min(...trends.map(t => t.hot_score));
    const range = maxScore - minScore || 1;
    
    // 计算图表尺寸
    const chartWidth = 500;
    const chartHeight = 280;
    const padding = 60;
    const innerWidth = chartWidth - 2 * padding;
    const innerHeight = chartHeight - 2 * padding;
    
    // 生成坐标点
    const points = trends.map((point, index) => ({
      x: padding + (index / (trends.length - 1)) * innerWidth,
      y: padding + (1 - (point.hot_score - minScore) / range) * innerHeight,
      score: point.hot_score,
      time: point.datetime
    }));
    
    return (
      <div className="w-full bg-white rounded-lg p-2 border border-gray-200">
        <div className="flex justify-start">
          <svg width={chartWidth} height={chartHeight} className="h-auto">
          {/* 背景网格线 */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />
          
          {/* Y轴标签 */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = padding + ratio * innerHeight;
            const value = maxScore - ratio * range;
            return (
              <g key={index}>
                <line
                  x1={padding - 5}
                  y1={y}
                  x2={padding}
                  y2={y}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
                <text
                  x={padding - 15}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {formatNumber(value)}
                </text>
              </g>
            );
          })}
          
          {/* X轴标签 */}
          {points.map((point, index) => {
            if (index % Math.ceil(points.length / 6) === 0) {
              return (
                <g key={index}>
                  <line
                    x1={point.x}
                    y1={chartHeight - padding}
                    x2={point.x}
                    y2={chartHeight - padding + 5}
                    stroke="#9ca3af"
                    strokeWidth="1"
                  />
                  <text
                    x={point.x}
                    y={chartHeight - padding + 20}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#6b7280"
                  >
                    {point.time.split(' ')[1]?.slice(0, 5)}
                  </text>
                </g>
              );
            }
            return null;
          })}
          
          {/* 坐标轴 */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke="#6b7280"
            strokeWidth="1"
          />
          <line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="#6b7280"
            strokeWidth="1"
          />
          
          {/* 趋势线 */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
          />
          
          {/* 数据点 */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#3b82f6"
              stroke="#ffffff"
              strokeWidth="1"
            />
          ))}
          
          {/* 轴标题 */}
          <text
            x={chartWidth / 2}
            y={chartHeight - 8}
            textAnchor="middle"
            fontSize="13"
            fill="#6b7280"
            fontWeight="500"
          >
            时间
          </text>
          <text
            x={20}
            y={chartHeight / 2}
            textAnchor="middle"
            fontSize="13"
            fill="#6b7280"
            fontWeight="500"
            transform={`rotate(-90, 20, ${chartHeight / 2})`}
          >
            热度值
          </text>
          </svg>
        </div>
        
        {/* 统计信息 */}
        <div className="flex justify-center mt-2 text-xs text-muted-foreground">
          <span>数据点: {trends.length} | 峰值: {formatNumber(maxScore)} | 谷值: {formatNumber(minScore)}</span>
        </div>
      </div>
    );
  };

  const renderTrendsData = (trends: DouyinHotTrendPoint[], topic: DouyinHotTopic) => {
    if (!trends || trends.length === 0) {
      return <div className="text-sm text-muted-foreground">无趋势数据</div>;
    }

    return (
      <div className="space-y-3">
        {/* 基本信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 text-sm">
            <span className="text-muted-foreground">快照ID:</span>
            <div className="font-mono text-xs">{topic.snapshot_id}</div>
          </div>
          <div className="space-y-1 text-sm">
            <span className="text-muted-foreground">话题ID:</span>
            <div className="font-mono text-xs">{topic.sentence_id}</div>
          </div>
        </div>

        {/* 趋势图表 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <TrendingUpIcon className="h-4 w-4" />
            <span>热度趋势</span>
          </div>
          {renderTrendsChart(trends)}
        </div>
      </div>
    );
  };

  const renderLocalData = (topic: DouyinHotTopic) => {
    return (
      <div className="space-y-3">
        {/* 基本信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 text-sm">
            <span className="text-muted-foreground">快照ID:</span>
            <div className="font-mono text-xs">{topic.snapshot_id}</div>
          </div>
          <div className="space-y-1 text-sm">
            <span className="text-muted-foreground">话题ID:</span>
            <div className="font-mono text-xs">{topic.sentence_id}</div>
          </div>
          <div className="space-y-1 text-sm">
            <span className="text-muted-foreground">视频数量:</span>
            <div className="font-mono text-xs">{formatNumber(topic.video_count)}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderDataRow = (item: RankingData, index: number) => {
    // 根据不同类型的数据渲染不同的行
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
              <tr className="bg-muted/20">
                <td colSpan={8} className="p-0">
                  <div className="mx-2 my-2 p-2 bg-white rounded-md border border-blue-200 shadow-sm">
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
              <tr className="bg-muted/20">
                <td colSpan={9} className="p-0">
                  <div className="mx-2 my-2 p-2 bg-white rounded-md border border-blue-200 shadow-sm">
                    {renderLocalData(topic)}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      }
      
      // 其他话题榜单 (challenge, risingtopic等)
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
    } else if ('nick_name' in item) {
      // 账号类型数据
      const account = item as DouyinHotAccount;
      return (
        <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
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
                <div className="text-xs text-muted-foreground">{account.user_id}</div>
              </div>
            </div>
          </td>
          <td className="p-2 text-sm">{formatNumber(account.fans_cnt)}</td>
          <td className="p-2 text-sm">{formatNumber(account.like_cnt)}</td>
          <td className="p-2 text-sm">{formatNumber(account.publish_cnt)}</td>
        </tr>
      );
    } else if ('title' in item && 'author' in item) {
      // 视频类型数据
      const video = item as DouyinHotVideo;
      return (
        <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
          <td className="p-2">
            <span className="font-medium">{index + 1}</span>
          </td>
          <td className="p-2">
            <div className="font-medium text-sm">{video.title}</div>
            <div className="text-xs text-muted-foreground">{video.author}</div>
          </td>
          <td className="p-2 text-sm">{formatNumber(video.play_count)}</td>
          <td className="p-2 text-sm">{formatNumber(video.like_count)}</td>
          <td className="p-2 text-sm">{formatNumber(video.share_count)}</td>
          <td className="p-2 text-sm">{formatNumber(video.comment_count)}</td>
          <td className="p-2 text-sm">{video.hot_score}</td>
        </tr>
      );
    } else if ('word' in item) {
      // 词汇类型数据
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
      return (
        <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
          <td className="p-2">
            <span className="font-medium">{index + 1}</span>
          </td>
          <td className="p-2">
            <div className="text-sm">{JSON.stringify(item)}</div>
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
            <th className="text-left p-2">视频</th>
            <th className="text-left p-2">播放数</th>
            <th className="text-left p-2">点赞数</th>
            <th className="text-left p-2">分享数</th>
            <th className="text-left p-2">评论数</th>
            <th className="text-left p-2">热度分</th>
          </tr>
        );
      case 'hotwords':
        return (
          <tr className="border-b text-sm text-muted-foreground">
            <th className="text-left p-2">排名</th>
            <th className="text-left p-2">词汇</th>
            <th className="text-left p-2">热度值</th>
            <th className="text-left p-2">视频数</th>
            <th className="text-left p-2">观看数</th>
            <th className="text-left p-2">趋势</th>
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