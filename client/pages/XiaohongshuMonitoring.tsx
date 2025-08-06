import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Monitor,
  UserCheck,
  Plus,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  Play,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Upload,
  FileText,
  Users,
  Video,
  Crown,
  Verified,
  Image,
  Bookmark,
  Clock,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { TaskQueueSection } from "@/components/shared/TaskQueueSection";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://127.0.0.1:8000/api";

const API_TOKEN = import.meta.env.VITE_BACKEND_API_TOKEN;

// API interfaces
interface CreateMonitoringTaskResponse {
  total_successful: number;
  total_failed: number;
  failed_urls: string[];
  successful_tasks: Record<string, string>;
}

interface ApiError {
  detail: string;
}

// Post history interfaces
interface PostHistoryItem {
  task_id: string;
  task_status: string;
  monitor_interval: string;
  created_at: string;
  next_execution_at: string;
  note_id: string;
  input_url: string;
  error_message: string | null;
  title: string;
  desc: string;
  create_time: string;
  share_url: string;
  images_list: string[] | null;
  video_url: string;
  author_nickname: string;
  most_recent_counts: {
    collect_count: number;
    comment_count: number;
    likes_count: number;
    share_count: number;
  };
  increment_percentages: {
    collect_count_increment: number;
    comment_count_increment: number;
    likes_count_increment: number;
    share_count_increment: number;
  };
  history: Array<{
    created_at: string;
    collect_count: number;
    comment_count: number;
    likes_count: number;
    share_count: number;
  }>;
}

interface PostHistoryResponse {
  items: PostHistoryItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Influencer history interfaces
interface InfluencerHistoryItem {
  task_id: string;
  task_status: string;
  monitor_interval: string;
  created_at: string;
  next_execution_at: string;
  user_id: string;
  input_url: string;
  error_message: string | null;
  nickname: string;
  desc: string;
  share_url: string;
  avatar_url: string;
  most_recent_counts: {
    following_count: number;
    fans_count: number;
    liked_count: number;
    post_count: number;
  };
  increment_percentages: {
    following_count_increment: number;
    fans_count_increment: number;
    liked_count_increment: number;
    post_count_increment: number;
  };
  history: Array<{
    created_at: string;
    following_count: number;
    fans_count: number;
    liked_count: number;
    post_count: number;
  }>;
}

interface InfluencerHistoryResponse {
  items: InfluencerHistoryItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Task action API interfaces
interface TaskActionRequest {
  task_ids: string[];
}

interface TaskActionResponse {
  message: string;
  task_ids: string[];
  status: string;
}

// Monitoring task interface (matches backend response)
interface MonitoringTask {
  id: string;
  task_type: string;
  platform: string;
  content_type: string;
  status: "MONITORING" | "PAUSED" | "FAILED" | "COMPLETED" | "PENDING" | "QUEUED" | "PROCESSING";
  progress: number;
  monitor_interval: string;
  input_data: {
    url: string;
    monitor_interval: string;
  };
  output_data: any;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  next_execution_at: string;
}

interface TasksResponse {
  tasks: MonitoringTask[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  platforms_included: Record<string, boolean>;
}

// Task queue interfaces
interface TaskItem {
  id: string;
  url: string;
  type: "content" | "influencer";
  status: "waiting" | "processing" | "completed" | "failed";
  addedAt: string;
  completedAt?: string;
  error?: string;
}

// Sample monitoring data for Xiaohongshu content
const mockContentData = [
  {
    id: 1,
    title: "秋日��搭分享 | 温柔知性风格搭配",
    author: "时尚博主小雅",
    url: "https://www.xiaohongshu.com/explore/63f1234567890abc",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-15 10:30",
    status: "active",
    type: "图文",
    currentStats: {
      views: "18.5万",
      likes: "12.3万",
      comments: "3.2万",
      shares: "1.8千",
    },
    initialStats: {
      views: "15.2万",
      likes: "9.8万",
      comments: "2.5万",
      shares: "1.2千",
    },
  },
  {
    id: 2,
    title: "护肤心���分享 | 敏感肌的冬日护理",
    author: "美容达人Lisa",
    url: "https://www.xiaohongshu.com/explore/63f0987654321def",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-14 16:20",
    status: "active",
    type: "视频",
    currentStats: {
      views: "25.7万",
      likes: "18.9万",
      comments: "5.4万",
      shares: "3.2千",
    },
    initialStats: {
      views: "22.1万",
      likes: "15.6万",
      comments: "4.8万",
      shares: "2.7千",
    },
  },
  {
    id: 3,
    title: "北欧风家居装修攻略 ✨",
    author: "家居生活达人",
    url: "https://www.xiaohongshu.com/explore/63f1111222333444",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-13 14:15",
    status: "active",
    type: "图文",
    currentStats: {
      views: "31.2万",
      likes: "8.7万",
      comments: "2.1万",
      shares: "4.5千",
    },
    initialStats: {
      views: "28.9万",
      likes: "7.2万",
      comments: "1.8万",
      shares: "3.8千",
    },
  },
];

// Sample monitoring data for Xiaohongshu influencers
const mockInfluencerData = [
  {
    id: 1,
    username: "时尚博主小雅",
    avatar: "/api/placeholder/60/60",
    url: "https://www.xiaohongshu.com/user/profile/5f1234567890abcd",
    addedAt: "2024-01-15 10:30",
    status: "active",
    verified: true,
    userType: "时尚博主",
    currentStats: {
      followers: "68.9万",
      following: "245",
      works: "892",
      totalLikes: "1280万",
    },
    initialStats: {
      followers: "65.2万",
      following: "240",
      works: "885",
      totalLikes: "1220万",
    },
    recentActivity: {
      postsThisWeek: 5,
      avgLikes: "12.3万",
      avgComments: "3.2万",
      engagementRate: "22.8%",
    },
  },
  {
    id: 2,
    username: "美容达人Lisa",
    avatar: "/api/placeholder/60/60",
    url: "https://www.xiaohongshu.com/user/profile/5f0987654321abcd",
    addedAt: "2024-01-14 16:20",
    status: "active",
    verified: true,
    userType: "美妆护肤博主",
    currentStats: {
      followers: "124.5万",
      following: "89",
      works: "567",
      totalLikes: "2890万",
    },
    initialStats: {
      followers: "118.7万",
      following: "87",
      works: "562",
      totalLikes: "2750万",
    },
    recentActivity: {
      postsThisWeek: 3,
      avgLikes: "18.9万",
      avgComments: "5.4万",
      engagementRate: "19.5%",
    },
  },
  {
    id: 3,
    username: "家居生活达人",
    avatar: "/api/placeholder/60/60",
    url: "https://www.xiaohongshu.com/user/profile/5f1111222333444",
    addedAt: "2024-01-13 14:15",
    status: "active",
    verified: true,
    userType: "生活方式博主",
    currentStats: {
      followers: "89.3万",
      following: "156",
      works: "723",
      totalLikes: "1650万",
    },
    initialStats: {
      followers: "85.7��",
      following: "152",
      works: "718",
      totalLikes: "1580万",
    },
    recentActivity: {
      postsThisWeek: 4,
      avgLikes: "8.7万",
      avgComments: "2.1万",
      engagementRate: "12.4%",
    },
  },
];

// API functions
const createXiaohongshuPostMonitoringTask = async (
  urls: string[],
  monitorInterval: string,
): Promise<CreateMonitoringTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/monitor/xiaohongshu/post/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      urls,
      monitor_interval: monitorInterval,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create Xiaohongshu post monitoring task";
    try {
      const error: ApiError = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const createXiaohongshuUserMonitoringTask = async (
  urls: string[],
  monitorInterval: string,
): Promise<CreateMonitoringTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/monitor/xiaohongshu/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      urls,
      monitor_interval: monitorInterval,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create Xiaohongshu user monitoring task";
    try {
      const error: ApiError = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Fetch tasks API function
const fetchTasks = async (
  platform: string = "xiaohongshu",
  taskType?: string,
  status?: string,
  page: number = 1,
  limit: number = 50,
): Promise<TasksResponse> => {
  const params = new URLSearchParams({
    platform,
    page: page.toString(),
    limit: limit.toString(),
  });

  if (taskType) params.append("task_type", taskType);
  if (status) params.append("status", status);

  const response = await fetch(`${API_BASE_URL}/monitor/tasks?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch tasks";
    try {
      const error: ApiError = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Task control API functions
const pauseTask = async (taskId: string): Promise<TaskActionResponse> => {
  const response = await fetch(`${API_BASE_URL}/monitor/pause`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      task_ids: [taskId],
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to pause task";
    try {
      const error: ApiError = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const resumeTask = async (taskId: string): Promise<TaskActionResponse> => {
  const response = await fetch(`${API_BASE_URL}/monitor/resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      task_ids: [taskId],
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to resume task";
    try {
      const error: ApiError = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const retryTask = async (taskId: string): Promise<TaskActionResponse> => {
  const response = await fetch(`${API_BASE_URL}/monitor/retry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      task_id: taskId,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to retry task";
    try {
      const error: ApiError = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Fetch post history API function
const fetchPostHistory = async (
  page: number = 1,
  limit: number = 20,
  noteId?: string,
  authorNickname?: string,
  status?: string,
): Promise<PostHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (noteId) params.append("note_id", noteId);
  if (authorNickname) params.append("author_nickname", authorNickname);
  if (status && status !== "all") params.append("status", status);

  const response = await fetch(`${API_BASE_URL}/monitor/xiaohongshu/history/posts?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch post history";
    try {
      const error: ApiError = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Fetch influencer history API function
const fetchInfluencerHistory = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
): Promise<InfluencerHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status && status !== "all") params.append("status", status);

  const response = await fetch(`${API_BASE_URL}/monitor/xiaohongshu/history/influencers?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch influencer history";
    try {
      const error: ApiError = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Chart Components
function PostTrendChart({ post }: { post: PostHistoryItem }) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    likes_count: true,
    comment_count: true,
    share_count: true,
    collect_count: true,
  });
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const toggleMetric = (metric: string) => {
    setVisibleMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
  };

  const handleMetricHighlight = (metric: string) => {
    setHighlightedMetric(prev => prev === metric ? null : metric);
  };

  const handleNotificationToggle = (enabled: boolean) => {
    setNotificationEnabled(enabled);
    if (enabled) {
      toast({
        title: "通知已开启",
        description: "当数据大幅增长时会通知您",
      });
    }
  };

  const getStatistics = (metric: string) => {
    const values = post.history.map(item => item[metric] || 0);
    return {
      max: Math.max(...values),
      min: Math.min(...values),
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    };
  };

  const chartData = post.history.map((item, index) => ({
    timestamp: new Date(item.created_at).toLocaleString('zh-CN', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    rawTimestamp: item.created_at,
    index: index,
    likes_count: item.likes_count,
    comment_count: item.comment_count,
    share_count: item.share_count,
    collect_count: item.collect_count,
  }));

  const metrics = [
    { key: 'likes_count', label: '点赞数', color: '#EF4444', icon: Heart },
    { key: 'comment_count', label: '评论数', color: '#10B981', icon: MessageCircle },
    { key: 'share_count', label: '分享数', color: '#8B5CF6', icon: Share2 },
    { key: 'collect_count', label: '收藏数', color: '#F59E0B', icon: Bookmark },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any) => {
            const metric = metrics.find(m => m.key === entry.dataKey);
            if (!metric || !visibleMetrics[entry.dataKey]) return null;
            const Icon = metric.icon;
            return (
              <div key={entry.dataKey} className="flex items-center text-xs">
                <Icon className="h-3 w-3 mr-1" style={{ color: entry.color }} />
                <span className="mr-2">{metric.label}:</span>
                <span className="font-medium">{entry.value.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium">指标控制</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">大幅增长通知</span>
            <Switch
              checked={notificationEnabled}
              onCheckedChange={handleNotificationToggle}
              className="scale-75"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <label key={metric.key} className="flex items-center space-x-1.5 cursor-pointer">
                <Checkbox
                  checked={visibleMetrics[metric.key]}
                  onCheckedChange={() => toggleMetric(metric.key)}
                />
                <Icon className="h-3 w-3" style={{ color: metric.color }} />
                <span className="text-xs" style={{ color: metric.color }}>
                  {metric.label}
                </span>
              </label>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {metrics.map((metric) => {
            if (!visibleMetrics[metric.key]) return null;
            const Icon = metric.icon;
            const isHighlighted = highlightedMetric === metric.key;
            return (
              <Button
                key={metric.key}
                variant={isHighlighted ? "default" : "outline"}
                size="sm"
                onClick={() => handleMetricHighlight(metric.key)}
                className="h-6 text-xs px-2"
                style={{
                  backgroundColor: isHighlighted ? metric.color : 'transparent',
                  borderColor: metric.color,
                  color: isHighlighted ? 'white' : metric.color,
                }}
              >
                <Icon className="h-3 w-3 mr-1" />
                {metric.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 9 }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 9 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            
            {metrics.map((metric) => {
              if (!visibleMetrics[metric.key]) return null;
              const isHighlighted = highlightedMetric === metric.key;
              const isFaded = highlightedMetric && highlightedMetric !== metric.key;
              
              return (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={isHighlighted ? 3 : 2}
                  strokeOpacity={isFaded ? 0.3 : 1}
                  dot={{ fill: metric.color, strokeWidth: 0, r: isHighlighted ? 3 : 2 }}
                  name={metric.label}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium">统计摘要</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((metric) => {
            if (!visibleMetrics[metric.key]) return null;
            const stats = getStatistics(metric.key);
            const Icon = metric.icon;
            
            return (
              <div key={metric.key} className="p-2 border rounded text-xs">
                <div className="flex items-center mb-1">
                  <Icon className="h-3 w-3 mr-1" style={{ color: metric.color }} />
                  <span className="font-medium text-xs" style={{ color: metric.color }}>
                    {metric.label}
                  </span>
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">最大:</span>
                    <span className="font-medium">{stats.max.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">最小:</span>
                    <span className="font-medium">{stats.min.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">平均:</span>
                    <span className="font-medium">{stats.avg.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function InfluencerTrendChart({ influencer }: { influencer: InfluencerHistoryItem }) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    fans_count: true,
    post_count: true,
    liked_count: true,
    following_count: true,
  });
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const toggleMetric = (metric: string) => {
    setVisibleMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
  };

  const handleMetricHighlight = (metric: string) => {
    setHighlightedMetric(prev => prev === metric ? null : metric);
  };

  const handleNotificationToggle = (enabled: boolean) => {
    setNotificationEnabled(enabled);
    if (enabled) {
      toast({
        title: "通知已开启",
        description: "当数据大幅增长时会通知您",
      });
    }
  };

  const getStatistics = (metric: string) => {
    const values = influencer.history.map(item => item[metric] || 0);
    return {
      max: Math.max(...values),
      min: Math.min(...values),
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    };
  };

  const chartData = influencer.history.map((item, index) => ({
    timestamp: new Date(item.created_at).toLocaleString('zh-CN', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    rawTimestamp: item.created_at,
    index: index,
    fans_count: item.fans_count,
    post_count: item.post_count,
    liked_count: item.liked_count,
    following_count: item.following_count,
  }));

  const metrics = [
    { key: 'fans_count', label: '粉丝数', color: '#3B82F6', icon: Users },
    { key: 'post_count', label: '笔记数', color: '#8B5CF6', icon: Video },
    { key: 'liked_count', label: '获赞总数', color: '#EF4444', icon: Heart },
    { key: 'following_count', label: '关注数', color: '#10B981', icon: UserCheck },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any) => {
            const metric = metrics.find(m => m.key === entry.dataKey);
            if (!metric || !visibleMetrics[entry.dataKey]) return null;
            const Icon = metric.icon;
            return (
              <div key={entry.dataKey} className="flex items-center text-xs">
                <Icon className="h-3 w-3 mr-1" style={{ color: entry.color }} />
                <span className="mr-2">{metric.label}:</span>
                <span className="font-medium">{entry.value.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium">指标控制</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">大幅增长通知</span>
            <Switch
              checked={notificationEnabled}
              onCheckedChange={handleNotificationToggle}
              className="scale-75"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <label key={metric.key} className="flex items-center space-x-1.5 cursor-pointer">
                <Checkbox
                  checked={visibleMetrics[metric.key]}
                  onCheckedChange={() => toggleMetric(metric.key)}
                />
                <Icon className="h-3 w-3" style={{ color: metric.color }} />
                <span className="text-xs" style={{ color: metric.color }}>
                  {metric.label}
                </span>
              </label>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {metrics.map((metric) => {
            if (!visibleMetrics[metric.key]) return null;
            const Icon = metric.icon;
            const isHighlighted = highlightedMetric === metric.key;
            return (
              <Button
                key={metric.key}
                variant={isHighlighted ? "default" : "outline"}
                size="sm"
                onClick={() => handleMetricHighlight(metric.key)}
                className="h-6 text-xs px-2"
                style={{
                  backgroundColor: isHighlighted ? metric.color : 'transparent',
                  borderColor: metric.color,
                  color: isHighlighted ? 'white' : metric.color,
                }}
              >
                <Icon className="h-3 w-3 mr-1" />
                {metric.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 9 }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 9 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            
            {metrics.map((metric) => {
              if (!visibleMetrics[metric.key]) return null;
              const isHighlighted = highlightedMetric === metric.key;
              const isFaded = highlightedMetric && highlightedMetric !== metric.key;
              
              return (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={isHighlighted ? 3 : 2}
                  strokeOpacity={isFaded ? 0.3 : 1}
                  dot={{ fill: metric.color, strokeWidth: 0, r: isHighlighted ? 3 : 2 }}
                  name={metric.label}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium">统计摘要</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((metric) => {
            if (!visibleMetrics[metric.key]) return null;
            const stats = getStatistics(metric.key);
            const Icon = metric.icon;
            
            return (
              <div key={metric.key} className="p-2 border rounded text-xs">
                <div className="flex items-center mb-1">
                  <Icon className="h-3 w-3 mr-1" style={{ color: metric.color }} />
                  <span className="font-medium text-xs" style={{ color: metric.color }}>
                    {metric.label}
                  </span>
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">最大:</span>
                    <span className="font-medium">{stats.max.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">最小:</span>
                    <span className="font-medium">{stats.min.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">平均:</span>
                    <span className="font-medium">{stats.avg.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function XiaohongshuMonitoring() {
  const [contentData, setContentData] = useState(mockContentData);
  const [influencerData, setInfluencerData] = useState(mockInfluencerData);
  const [contentUrls, setContentUrls] = useState("");
  const [influencerUrls, setInfluencerUrls] = useState("");
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [isAddingInfluencer, setIsAddingInfluencer] = useState(false);
  const [contentUploadedFile, setContentUploadedFile] = useState(null);
  const [influencerUploadedFile, setInfluencerUploadedFile] = useState(null);
  const [validContentUrls, setValidContentUrls] = useState([]);
  const [invalidContentUrls, setInvalidContentUrls] = useState([]);
  const [validInfluencerUrls, setValidInfluencerUrls] = useState([]);
  const [invalidInfluencerUrls, setInvalidInfluencerUrls] = useState([]);
  const [taskQueue, setTaskQueue] = useState<TaskItem[]>([]);
  const [contentMonitoringInterval, setContentMonitoringInterval] =
    useState("1hour");
  const [influencerMonitoringInterval, setInfluencerMonitoringInterval] =
    useState("24hours");
  
  // Real tasks state
  const [realTasks, setRealTasks] = useState<MonitoringTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>("all");
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("all");
  const [taskPage, setTaskPage] = useState(1);
  const [taskTotal, setTaskTotal] = useState(0);

  // Post history state
  const [postHistory, setPostHistory] = useState<PostHistoryItem[]>([]);
  const [postHistoryLoading, setPostHistoryLoading] = useState(false);
  const [postPage, setPostPage] = useState(1);
  const [postTotal, setPostTotal] = useState(0);
  const [postNoteIdFilter, setPostNoteIdFilter] = useState("");
  const [postAuthorFilter, setPostAuthorFilter] = useState("");
  const [postStatusFilter, setPostStatusFilter] = useState("all");

  // Influencer history state
  const [influencerHistory, setInfluencerHistory] = useState<InfluencerHistoryItem[]>([]);
  const [influencerHistoryLoading, setInfluencerHistoryLoading] = useState(false);
  const [influencerPage, setInfluencerPage] = useState(1);
  const [influencerTotal, setInfluencerTotal] = useState(0);
  const [influencerStatusFilter, setInfluencerStatusFilter] = useState("all");

  // Dialog states for trend analysis
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isInfluencerDialogOpen, setIsInfluencerDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostHistoryItem | null>(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerHistoryItem | null>(null);

  const validateUrl = (url: string) => {
    return url.includes("xiaohongshu.com");
  };

  // Load tasks from backend
  const loadTasks = async () => {
    setTasksLoading(true);
    try {
      const response = await fetchTasks(
        "xiaohongshu",
        taskTypeFilter === "all" ? undefined : taskTypeFilter,
        taskStatusFilter === "all" ? undefined : taskStatusFilter,
        taskPage,
        15,
      );
      setRealTasks(response.tasks);
      setTaskTotal(response.total);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      toast({
        title: "加载失败",
        description: `加载任务失败: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setTasksLoading(false);
    }
  };

  // Load post history from backend
  const loadPostHistory = async (showToast: boolean = true) => {
    setPostHistoryLoading(true);
    try {
      const response = await fetchPostHistory(
        postPage,
        20,
        postNoteIdFilter || undefined,
        postAuthorFilter || undefined,
        postStatusFilter === "all" ? undefined : postStatusFilter,
      );
      setPostHistory(response.items);
      setPostTotal(response.total);
      
      if (showToast && response.items.length > 0) {
        toast({
          title: "数据已更新",
          description: `加载了 ${response.items.length} 条笔记监控记录`,
          className: "bg-white border-black text-black",
        });
      }
    } catch (error) {
      console.error("Failed to load post history:", error);
      toast({
        title: "加载失败",
        description: `加载笔记数据失败: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setPostHistoryLoading(false);
    }
  };

  // Load influencer history from backend
  const loadInfluencerHistory = async (showToast: boolean = true) => {
    setInfluencerHistoryLoading(true);
    try {
      const response = await fetchInfluencerHistory(
        influencerPage,
        20,
        influencerStatusFilter === "all" ? undefined : influencerStatusFilter,
      );
      setInfluencerHistory(response.items);
      setInfluencerTotal(response.total);
      
      if (showToast && response.items.length > 0) {
        toast({
          title: "数据已更新",
          description: `加载了 ${response.items.length} 条达人监控记录`,
          className: "bg-white border-black text-black",
        });
      }
    } catch (error) {
      console.error("Failed to load influencer history:", error);
      toast({
        title: "加载失败",
        description: `加载达人数据失败: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setInfluencerHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [taskTypeFilter, taskStatusFilter, taskPage]);

  useEffect(() => {
    loadPostHistory(false);
  }, [postPage, postNoteIdFilter, postAuthorFilter, postStatusFilter]);

  useEffect(() => {
    loadInfluencerHistory(false);
  }, [influencerPage, influencerStatusFilter]);

  const isContentUrl = (url: string) => {
    return url.includes("/explore/") || url.includes("/discovery/");
  };

  const processContentUrls = (urls: string) => {
    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const valid = urlList.filter((url) => validateUrl(url));
    const invalid = urlList.filter(
      (url) => !validateUrl(url) && url.length > 0,
    );

    setValidContentUrls(valid);
    setInvalidContentUrls(invalid);
  };

  const processInfluencerUrls = (urls: string) => {
    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const valid = urlList.filter((url) => validateUrl(url));
    const invalid = urlList.filter(
      (url) => !validateUrl(url) && url.length > 0,
    );

    setValidInfluencerUrls(valid);
    setInvalidInfluencerUrls(invalid);
  };

  const handleContentFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setContentUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setContentUrls(content);
        processContentUrls(content);
      };
      reader.readAsText(file);
    }
  };

  const handleInfluencerFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setInfluencerUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInfluencerUrls(content);
        processInfluencerUrls(content);
      };
      reader.readAsText(file);
    }
  };

  const handleContentUrlsChange = (urls: string) => {
    setContentUrls(urls);
    processContentUrls(urls);
  };

  const handleInfluencerUrlsChange = (urls: string) => {
    setInfluencerUrls(urls);
    processInfluencerUrls(urls);
  };

  const processTaskQueue = async (
    tasks: TaskItem[],
    setTaskQueue: React.Dispatch<React.SetStateAction<TaskItem[]>>,
    onSuccess: (task: TaskItem, index: number) => void,
  ) => {
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      // Update task status to processing
      setTaskQueue((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: "processing" } : t,
        ),
      );

      // Simulate processing time
      await new Promise((resolve) =>
        setTimeout(resolve, 1500 + Math.random() * 1000),
      );

      try {
        // Simulate random success/failure (90% success rate)
        const success = Math.random() > 0.1;

        if (success) {
          // Call success callback
          onSuccess(task, i);

          // Mark task as completed
          setTaskQueue((prev) =>
            prev.map((t) =>
              t.id === task.id
                ? {
                    ...t,
                    status: "completed",
                    completedAt: new Date().toLocaleString("zh-CN"),
                  }
                : t,
            ),
          );
        } else {
          // Mark task as failed
          setTaskQueue((prev) =>
            prev.map((t) =>
              t.id === task.id
                ? {
                    ...t,
                    status: "failed",
                    error: "链接解析失败，请检查链接有效性",
                  }
                : t,
            ),
          );
        }
      } catch (error) {
        // Mark task as failed
        setTaskQueue((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  status: "failed",
                  error: "处理过程中发生错误",
                }
              : t,
          ),
        );
      }
    }
  };

  const handleAddContentBatch = async () => {
    if (validContentUrls.length === 0) {
      toast({
        title: "输入错误",
        description: "请输入有效的小红书作品链接",
        variant: "destructive",
      });
      return;
    }

    setIsAddingContent(true);

    try {
      const response = await createXiaohongshuPostMonitoringTask(
        validContentUrls,
        contentMonitoringInterval,
      );

      toast({
        title: "监控任务创建成功",
        description: `成功创建 ${response.total_successful} 个作品监控任务${
          response.total_failed > 0
            ? `，${response.total_failed} 个任务创建失败`
            : ""
        }`,
        className: "bg-white border-black text-black",
      });

      if (response.failed_urls.length > 0) {
        console.warn("Failed URLs:", response.failed_urls);
      }

      // Reset form
      setContentUrls("");
      setValidContentUrls([]);
      setInvalidContentUrls([]);
      setContentUploadedFile(null);
      
      // Reload tasks to show new ones
      loadTasks();
    } catch (error) {
      console.error("Failed to create content monitoring tasks:", error);
      toast({
        title: "创建失败",
        description: `创建监控任务失败: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsAddingContent(false);
    }
  };

  const handleAddInfluencerBatch = async () => {
    if (validInfluencerUrls.length === 0) {
      toast({
        title: "输入错误",
        description: "请输入有效的小红书达人链接",
        variant: "destructive",
      });
      return;
    }

    setIsAddingInfluencer(true);

    try {
      const response = await createXiaohongshuUserMonitoringTask(
        validInfluencerUrls,
        influencerMonitoringInterval,
      );

      toast({
        title: "监控任务创建成功",
        description: `成功创建 ${response.total_successful} 个达人监控任务${
          response.total_failed > 0
            ? `，${response.total_failed} 个任务创建失败`
            : ""
        }`,
        className: "bg-white border-black text-black",
      });

      if (response.failed_urls.length > 0) {
        console.warn("Failed URLs:", response.failed_urls);
      }

      // Reset form
      setInfluencerUrls("");
      setValidInfluencerUrls([]);
      setInvalidInfluencerUrls([]);
      setInfluencerUploadedFile(null);
      
      // Reload tasks to show new ones
      loadTasks();
    } catch (error) {
      console.error("Failed to create influencer monitoring tasks:", error);
      toast({
        title: "创建失败",
        description: `创建监控任务失败: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsAddingInfluencer(false);
    }
  };

  const handleRemoveContent = (id: number) => {
    if (confirm("确停止要停止监控这个笔记吗？")) {
      setContentData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleRemoveInfluencer = (id: number) => {
    if (confirm("确定要停止监控这个博主吗？")) {
      setInfluencerData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Task action handlers
  const handlePauseTask = async (taskId: string) => {
    try {
      const response = await pauseTask(taskId);
      toast({
        title: "任务已暂停",
        description: `任务${taskId}已成功暂停`,
        className: "bg-white border-black text-black",
      });
      // Refresh the task list to show updated status
      loadTasks();
    } catch (error) {
      console.error("Failed to pause task:", error);
      toast({
        title: "暂停失败",
        description: `暂停任务失败: ${error.message}`,
        variant: "destructive",
        className: "bg-white border-black text-black",
      });
    }
  };

  const handleResumeTask = async (taskId: string) => {
    try {
      const response = await resumeTask(taskId);
      toast({
        title: "任务已恢复",
        description: `任务${taskId}已重新开启`,
        className: "bg-white border-black text-black",
      });
      // Refresh the task list to show updated status
      loadTasks();
    } catch (error) {
      console.error("Failed to resume task:", error);
      toast({
        title: "恢复失败",
        description: `恢复任务失败: ${error.message}`,
        variant: "destructive",
        className: "bg-white border-black text-black",
      });
    }
  };

  const handleRetryTask = async (taskId: string) => {
    try {
      const response = await retryTask(taskId);
      toast({
        title: "任务已重试",
        description: `任务${taskId}已重新开启`,
        className: "bg-white border-black text-black",
      });
      // Refresh the task list to show updated status
      loadTasks();
    } catch (error) {
      console.error("Failed to retry task:", error);
      toast({
        title: "重试失败",
        description: `重试任务失败: ${error.message}`,
        variant: "destructive",
        className: "bg-white border-black text-black",
      });
    }
  };

  const handleClearCompletedTasks = () => {
    setTaskQueue((prev) => prev.filter((task) => task.status !== "completed"));
  };

  // Helper functions for real tasks display
  const getRealTaskStatusBadge = (status: MonitoringTask['status']) => {
    switch (status) {
      case "MONITORING":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs h-6 px-2 whitespace-nowrap">
            <CheckCircle className="h-3 w-3 mr-1" />
            监控中
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs h-6 px-2 whitespace-nowrap">
            <AlertTriangle className="h-3 w-3 mr-1" />
            已暂停
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs h-6 px-2 whitespace-nowrap">
            <X className="h-3 w-3 mr-1" />
            失败
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs h-6 px-2 whitespace-nowrap">
            <CheckCircle className="h-3 w-3 mr-1" />
            已完成
          </Badge>
        );
      case "PENDING":
      case "QUEUED":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs h-6 px-2 whitespace-nowrap">
            <Clock className="h-3 w-3 mr-1" />
            等待中
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs h-6 px-2 whitespace-nowrap">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            处理中
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="text-xs h-6 px-2 whitespace-nowrap">{status}</Badge>;
    }
  };

  const getRealTaskTypeLabel = (taskType: string) => {
    switch (taskType) {
      case "XIAOHONGSHU_POST_MONITOR":
        return "作品";
      case "XIAOHONGSHU_INFLUENCER_MONITOR":
        return "达人";
      default:
        return taskType;
    }
  };

  const formatDateTime = (dateString: string | undefined | null) => {
    if (!dateString) {
      return '未知时间';
    }
    try {
      return new Date(dateString).toLocaleString("zh-CN", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '无效时间';
    }
  };

  const getActionButton = (task: MonitoringTask) => {
    switch (task.status) {
      case "MONITORING":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePauseTask(task.id)}
            className="h-7 text-xs px-3 bg-white border-black text-black hover:bg-black hover:text-white"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            暂停
          </Button>
        );
      case "FAILED":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRetryTask(task.id)}
            className="h-7 text-xs px-3 bg-white border-black text-black hover:bg-black hover:text-white"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            重试
          </Button>
        );
      case "PENDING":
      case "QUEUED":
      case "PROCESSING":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePauseTask(task.id)}
            className="h-7 text-xs px-3 bg-white border-black text-black hover:bg-black hover:text-white"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            暂停
          </Button>
        );
      case "PAUSED":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleResumeTask(task.id)}
            className="h-7 text-xs px-3 bg-white border-black text-black hover:bg-black hover:text-white"
          >
            <Play className="h-3 w-3 mr-1" />
            恢复
          </Button>
        );
      default:
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(task.input_data.url, "_blank")}
            className="h-7 text-xs"
            title="查看链接"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        );
    }
  };

  // Pagination helpers
  const totalPages = Math.ceil(taskTotal / 15);
  const canGoPrev = taskPage > 1;
  const canGoNext = taskPage < totalPages;

  const handlePrevPage = () => {
    if (canGoPrev) {
      setTaskPage(taskPage - 1);
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      setTaskPage(taskPage + 1);
    }
  };

  const handleClearAllTasks = () => {
    if (confirm("确定定要清空所有任务吗？")) {
      setTaskQueue([]);
    }
  };

  const handleRetryFailedTask = (taskId: string) => {
    setTaskQueue((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: "waiting", error: undefined }
          : task,
      ),
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            监控中
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            已暂停
          </Badge>
        );
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  const getContentTypeIcon = (type: string) => {
    return type === "视频" ? (
      <Video className="h-3 w-3 text-red-500" />
    ) : (
      <Image className="h-3 w-3 text-blue-500" />
    );
  };

  const getVerificationIcon = (verified: boolean, userType: string) => {
    if (!verified) return null;

    return userType.includes("官方") || userType.includes("品牌") ? (
      <Crown className="h-3 w-3 text-yellow-500" />
    ) : (
      <Verified className="h-3 w-3 text-red-500" />
    );
  };

  const calculateGrowth = (current: string, initial: string) => {
    const currentNum = parseInt(
      current.replace(/[万千]/g, "").replace(/\D/g, ""),
    );
    const initialNum = parseInt(
      initial.replace(/[万千]/g, "").replace(/\D/g, ""),
    );

    if (initialNum === 0) return "0%";
    const growth = ((currentNum - initialNum) / initialNum) * 100;
    return `${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`;
  };

  // Format number for display
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}千`;
    }
    return num.toString();
  };

  // Get post status badge
  const getPostStatusBadge = (status: string) => {
    switch (status) {
      case "MONITORING":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs h-6 px-2">
            <CheckCircle className="h-3 w-3 mr-1" />
            监控中
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs h-6 px-2">
            <AlertTriangle className="h-3 w-3 mr-1" />
            已暂停
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs h-6 px-2">
            <X className="h-3 w-3 mr-1" />
            失败
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs h-6 px-2">
            <CheckCircle className="h-3 w-3 mr-1" />
            已完成
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs h-6 px-2">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  return (
    <>
      <DashboardLayout
        title="小红书监控"
        subtitle="实时监控小红书平台的博主和笔记数据变化"
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
        {/* Platform Info */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              📖 小红书平台监控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="text-sm">笔记监控: {contentData.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  博主监控: {influencerData.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">状态: 正常运行</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              添加监控
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              任务队列 ({taskTotal})
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              笔记监控 ({contentData.length})
            </TabsTrigger>
            <TabsTrigger value="influencer" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              博主监控 ({influencerData.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左侧：批量添加作品监控 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Video className="mr-2 h-4 w-4" />
                    批量添加作品监控
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 监控间隔设置 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">监控间隔</label>
                    <Select
                      value={contentMonitoringInterval}
                      onValueChange={setContentMonitoringInterval}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1minute">1 分钟</SelectItem>
                        <SelectItem value="1hour">1 小时</SelectItem>
                        <SelectItem value="4hours">4 小时</SelectItem>
                        <SelectItem value="24hours">24 小时</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-gray-500">
                      ⏰ 设置数据采集的时间间隔
                    </div>
                  </div>

                  {/* 手动输入 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">手动输入</label>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="请输入小红书作品链接，每行一个链接&#10;作品链接示例：&#10;https://www.xiaohongshu.com/explore/64a5b2c8000000001e03456f&#10;https://www.xiaohongshu.com/explore/64a5b3d9000000001e034890"
                        value={contentUrls}
                        onChange={(e) =>
                          handleContentUrlsChange(e.target.value)
                        }
                        className="min-h-[180px]"
                      />
                      <div className="text-xs text-gray-500">
                        💡 仅支持小红书作品链接
                      </div>
                    </div>
                  </div>

                  {/* 上传文件在��方 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">上传文件</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-600 mb-2">
                        选择包含小红书链接的文本文件（每行一个链接）
                      </p>
                      <Input
                        type="file"
                        accept=".txt,.csv"
                        onChange={handleContentFileUpload}
                        className="max-w-xs mx-auto"
                      />
                      {contentUploadedFile && (
                        <div className="mt-2 flex items-center justify-center text-sm text-green-600">
                          <FileText className="h-4 w-4 mr-1" />
                          已上传：{contentUploadedFile.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* URL Validation Summary */}
                  {(validContentUrls.length > 0 ||
                    invalidContentUrls.length > 0) && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      {validContentUrls.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-green-800">
                              有效作品链接 ({validContentUrls.length} 个)
                            </div>
                          </div>
                        </div>
                      )}

                      {invalidContentUrls.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-red-800">
                              无效链接 ({invalidContentUrls.length} 个)
                            </div>
                            <div className="text-xs text-red-600 mt-1">
                              请确保链接包含 "xiaohongshu.com"
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddContentBatch}
                      disabled={
                        isAddingContent || validContentUrls.length === 0
                      }
                      className="px-8"
                    >
                      {isAddingContent ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      {isAddingContent
                        ? "批量添加中..."
                        : `批量添加作品 (${validContentUrls.length})`}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 右侧：批量添加达人监控 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <UserCheck className="mr-2 h-4 w-4" />
                    批量添加达人监控
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 监控间隔设置 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">监控间隔</label>
                    <Select
                      value={influencerMonitoringInterval}
                      onValueChange={setInfluencerMonitoringInterval}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1minute">1 分钟</SelectItem>
                        <SelectItem value="1hour">1 小时</SelectItem>
                        <SelectItem value="4hours">4 小时</SelectItem>
                        <SelectItem value="24hours">24 小时</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-gray-500">
                      ⏰ 设置数据采集的时间间隔
                    </div>
                  </div>

                  {/* 手动输入 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">手动输入</label>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="请输入小红书达人链接，每行一个链接&#10;达人主页链接示例：&#10;https://www.xiaohongshu.com/user/profile/5e8a7b5c0000000001000123&#10;https://www.xiaohongshu.com/user/profile/5e8a7c8d0000000001000456"
                        value={influencerUrls}
                        onChange={(e) =>
                          handleInfluencerUrlsChange(e.target.value)
                        }
                        className="min-h-[180px]"
                      />
                      <div className="text-xs text-gray-500">
                        💡 仅支持小红书达人主页链接
                      </div>
                    </div>
                  </div>

                  {/* 上传文件在下方 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">上传文件</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-600 mb-2">
                        选择包含小红书达人链接的文本文件（每行一个链接）
                      </p>
                      <Input
                        type="file"
                        accept=".txt,.csv"
                        onChange={handleInfluencerFileUpload}
                        className="max-w-xs mx-auto"
                      />
                      {influencerUploadedFile && (
                        <div className="mt-2 flex items-center justify-center text-sm text-green-600">
                          <FileText className="h-4 w-4 mr-1" />
                          已上传：{influencerUploadedFile.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* URL Validation Summary */}
                  {(validInfluencerUrls.length > 0 ||
                    invalidInfluencerUrls.length > 0) && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      {validInfluencerUrls.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-green-800">
                              有效达人链接 ({validInfluencerUrls.length} 个)
                            </div>
                          </div>
                        </div>
                      )}

                      {invalidInfluencerUrls.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-red-800">
                              无效链接 ({invalidInfluencerUrls.length} 个)
                            </div>
                            <div className="text-xs text-red-600 mt-1">
                              请确保链接包含 "xiaohongshu.com"
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddInfluencerBatch}
                      disabled={
                        isAddingInfluencer || validInfluencerUrls.length === 0
                      }
                      className="px-8"
                    >
                      {isAddingInfluencer ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      {isAddingInfluencer
                        ? "批量添加中..."
                        : `批量添加达人 (${validInfluencerUrls.length})`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <TaskQueueSection
              taskQueue={taskQueue}
              onClearCompleted={handleClearCompletedTasks}
              onClearAll={handleClearAllTasks}
              onRetryFailed={handleRetryFailedTask}
            />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    任务队列 ({taskTotal})
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadTasks}
                      className="h-8"
                    >
                      <RefreshCw className="mr-2 h-3.5 w-3.5" />
                      刷新
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">监控中: {realTasks.filter(task => task.status === 'MONITORING').length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">已暂停: {realTasks.filter(task => task.status === 'PAUSED').length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">已完成: {realTasks.filter(task => task.status === 'COMPLETED').length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-sm">失败: {realTasks.filter(task => task.status === 'FAILED').length}</span>
                    </div>
                  </div>
                  
                  {/* Filters */}
                  <div className="grid grid-cols-3 gap-4">
                    <Select
                      value={taskTypeFilter}
                      onValueChange={(value) => {
                        setTaskTypeFilter(value);
                        setTaskPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="XIAOHONGSHU_POST_MONITOR">作品监控</SelectItem>
                        <SelectItem value="XIAOHONGSHU_INFLUENCER_MONITOR">达人监控</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={taskStatusFilter}
                      onValueChange={(value) => {
                        setTaskStatusFilter(value);
                        setTaskPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="MONITORING">监控中</SelectItem>
                        <SelectItem value="PAUSED">已暂停</SelectItem>
                        <SelectItem value="FAILED">失败</SelectItem>
                        <SelectItem value="COMPLETED">已完成</SelectItem>
                      </SelectContent>
                    </Select>

                    <div></div>
                  </div>

                  {/* Real Tasks Table */}
                  {tasksLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 mx-auto animate-spin" />
                      <p className="text-sm text-muted-foreground mt-2">加载任务中...</p>
                    </div>
                  ) : realTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        暂无监控任务
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>监控链接</TableHead>
                            <TableHead className="w-[100px]">类型</TableHead>
                            <TableHead className="w-[100px]">监控间隔</TableHead>
                            <TableHead className="w-[100px]">状态</TableHead>
                            <TableHead className="w-[180px]">创建时间</TableHead>
                            <TableHead className="w-[180px]">下次执行</TableHead>
                            <TableHead className="w-[100px]">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {realTasks.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell className="text-sm">
                                <a
                                  href={task.input_data.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline truncate block max-w-[300px]"
                                  title={task.input_data.url}
                                >
                                  {task.input_data.url}
                                </a>
                                {task.error_message && (
                                  <div className="text-xs text-red-600 mt-1">
                                    错误: {task.error_message}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {getRealTaskTypeLabel(task.task_type)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {task.monitor_interval}
                              </TableCell>
                              <TableCell>
                                {getRealTaskStatusBadge(task.status)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDateTime(task.created_at)}
                              </TableCell>
                              <TableCell className="text-sm">
                                {task.next_execution_at ? formatDateTime(task.next_execution_at) : '-'}
                              </TableCell>
                              <TableCell>
                                {getActionButton(task)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Pagination */}
                  {taskTotal > 0 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-600">
                        显示第 {((taskPage - 1) * 15) + 1} - {Math.min(taskPage * 15, taskTotal)} 条，共 {taskTotal} 条
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevPage}
                          disabled={!canGoPrev}
                          className="h-8"
                        >
                          上一页
                        </Button>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">
                            第 {taskPage} / {totalPages} 页
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={!canGoNext}
                          className="h-8"
                        >
                          下一页
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Monitor className="mr-2 h-4 w-4" />
                    笔记监控列表 ({postTotal})
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPostHistory(true)}
                      disabled={postHistoryLoading}
                      className="h-7 text-xs bg-white border-black text-black hover:bg-black hover:text-white"
                    >
                      {postHistoryLoading ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-1 h-3 w-3" />
                      )}
                      刷新
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Input
                        placeholder="搜索笔记ID (note_id)"
                        value={postNoteIdFilter}
                        onChange={(e) => {
                          setPostNoteIdFilter(e.target.value);
                          setPostPage(1);
                        }}
                        className="h-8"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="搜索作者名称"
                        value={postAuthorFilter}
                        onChange={(e) => {
                          setPostAuthorFilter(e.target.value);
                          setPostPage(1);
                        }}
                        className="h-8"
                      />
                    </div>
                    <div className="flex-1">
                      <Select
                        value={postStatusFilter}
                        onValueChange={(value) => {
                          setPostStatusFilter(value);
                          setPostPage(1);
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部状态</SelectItem>
                          <SelectItem value="MONITORING">监控中</SelectItem>
                          <SelectItem value="PAUSED">已暂停</SelectItem>
                          <SelectItem value="FAILED">失败</SelectItem>
                          <SelectItem value="COMPLETED">已完成</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {postHistoryLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 mx-auto animate-spin" />
                      <p className="text-sm text-muted-foreground mt-2">加载笔记数据中...</p>
                    </div>
                  ) : postHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Monitor className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      暂无监控笔记，请先添加笔记链接
                    </p>
                  </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {postHistory.map((post) => (
                        <Card
                          key={post.task_id}
                          className="group hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
                          onClick={() => {
                            setSelectedPost(post);
                            setIsPostDialogOpen(true);
                          }}
                        >
                        {/* Content Header */}
                        <div className="relative h-48 bg-gradient-to-br from-red-400 via-pink-400 to-orange-400">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Bookmark className="h-12 w-12 text-white/80" />
                          </div>
                          
                          {/* Type Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge
                              variant="secondary"
                              className="bg-white/90 text-xs flex items-center gap-1"
                            >
                              {post.video_url && post.video_url.trim() !== "" ? (
                                <Video className="h-3 w-3 text-red-500" />
                              ) : (
                                <Image className="h-3 w-3 text-blue-500" />
                              )}
                              {post.video_url && post.video_url.trim() !== "" ? "视频" : "图文"}
                            </Badge>
                          </div>
                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            {getPostStatusBadge(post.task_status)}
                          </div>
                          {/* Trending Indicator */}
                          <div className="absolute bottom-3 right-3">
                            <div className="bg-white/90 rounded-full px-2 py-1 text-xs font-medium text-green-600">
                              ↗️ 增长中
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          {/* Content Info */}
                          <div className="space-y-3">
                            <div>
                              <h3
                                className="font-medium text-sm line-clamp-2 leading-tight"
                                title={post.title || "无标题"}
                              >
                                {post.title || "无标题"}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                by {post.author_nickname || "未知作者"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                发布于: {post.create_time ? new Date(parseInt(post.create_time) * 1000).toLocaleDateString("zh-CN") : "未知时间"}
                              </p>
                              {post.error_message && (
                                <p className="text-xs text-red-600 mt-1">
                                  错误: {post.error_message}
                                </p>
                              )}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-4 gap-2 text-xs">
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Heart className="h-3 w-3 text-red-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(post.most_recent_counts.likes_count)}
                                </div>
                                <div className="text-green-600 text-xs">
                                  +{post.increment_percentages.likes_count_increment.toFixed(1)}%
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <MessageCircle className="h-3 w-3 text-green-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(post.most_recent_counts.comment_count)}
                                </div>
                                <div className="text-green-600 text-xs">
                                  +{post.increment_percentages.comment_count_increment.toFixed(1)}%
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Bookmark className="h-3 w-3 text-blue-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(post.most_recent_counts.collect_count)}
                                </div>
                                <div className="text-green-600 text-xs">
                                  +{post.increment_percentages.collect_count_increment.toFixed(1)}%
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Share2 className="h-3 w-3 text-purple-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(post.most_recent_counts.share_count)}
                                </div>
                                <div className="text-green-600 text-xs">
                                  +{post.increment_percentages.share_count_increment.toFixed(1)}%
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      title="查看趋势"
                                      onClick={() => {
                                        setSelectedPost(post);
                                        setIsPostDialogOpen(true);
                                      }}
                                    >
                                      <BarChart3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="打开原链接"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(post.input_url, "_blank");
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {postTotal > 20 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-600">
                        显示第 {((postPage - 1) * 20) + 1} - {Math.min(postPage * 20, postTotal)} 条，共 {postTotal} 条
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPostPage(Math.max(1, postPage - 1))}
                          disabled={postPage <= 1}
                          className="h-8"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          上一页
                        </Button>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">
                            第 {postPage} / {Math.ceil(postTotal / 20)} 页
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPostPage(postPage + 1)}
                          disabled={postPage >= Math.ceil(postTotal / 20)}
                          className="h-8"
                        >
                          下一页
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="influencer" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <UserCheck className="mr-2 h-4 w-4" />
                    博主监控列表 ({influencerTotal})
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadInfluencerHistory(true)}
                      disabled={influencerHistoryLoading}
                      className="h-7 text-xs bg-white border-black text-black hover:bg-black hover:text-white"
                    >
                      {influencerHistoryLoading ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-1 h-3 w-3" />
                      )}
                      刷新
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Select
                        value={influencerStatusFilter}
                        onValueChange={(value) => {
                          setInfluencerStatusFilter(value);
                          setInfluencerPage(1);
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部状态</SelectItem>
                          <SelectItem value="MONITORING">监控中</SelectItem>
                          <SelectItem value="PAUSED">已暂停</SelectItem>
                          <SelectItem value="FAILED">失败</SelectItem>
                          <SelectItem value="COMPLETED">已完成</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-2"></div>
                  </div>

                  {influencerHistoryLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 mx-auto animate-spin" />
                      <p className="text-sm text-muted-foreground mt-2">加载达人数据中...</p>
                    </div>
                  ) : influencerHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      暂无监控博主，请先添加博主链接
                    </p>
                  </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {influencerHistory.map((influencer) => (
                      <Card
                        key={influencer.task_id}
                        className="group hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
                        onClick={() => {
                          setSelectedInfluencer(influencer);
                          setIsInfluencerDialogOpen(true);
                        }}
                      >
                        {/* User Profile Header */}
                        <div className="relative h-32 bg-gradient-to-br from-red-400 via-pink-400 to-orange-400">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden flex items-center justify-center text-white text-lg font-bold">
                              {influencer.avatar_url ? (
                                <img
                                  src={influencer.avatar_url}
                                  alt={influencer.nickname || "用户头像"}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div
                                className="w-full h-full flex items-center justify-center text-white text-lg font-bold"
                                style={{ display: influencer.avatar_url ? 'none' : 'flex' }}
                              >
                                {influencer.nickname ? influencer.nickname.charAt(0) : "?"}
                              </div>
                            </div>
                          </div>
                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            {getPostStatusBadge(influencer.task_status)}
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* User Info */}
                            <div className="text-center">
                              <h3 className="font-medium text-sm flex items-center justify-center gap-1">
                                {influencer.nickname || "未知用户"}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {influencer.desc || "暂无简介"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                监控开始: {new Date(influencer.created_at).toLocaleDateString("zh-CN")}
                              </p>
                              {influencer.error_message && (
                                <p className="text-xs text-red-600 mt-1">
                                  错误: {influencer.error_message}
                                </p>
                              )}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Users className="h-3 w-3 text-blue-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(influencer.most_recent_counts.fans_count)}
                                </div>
                                <div className="text-green-600 text-xs">
                                  +{(influencer.increment_percentages.fans_count_increment * 100).toFixed(1)}%
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Video className="h-3 w-3 text-purple-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(influencer.most_recent_counts.post_count)}
                                </div>
                                <div className="text-green-600 text-xs">
                                  +{(influencer.increment_percentages.post_count_increment * 100).toFixed(1)}%
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Heart className="h-3 w-3 text-red-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(influencer.most_recent_counts.liked_count)}
                                </div>
                                <div className="text-green-600 text-xs">
                                  +{(influencer.increment_percentages.liked_count_increment * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>

                            {/* Engagement Rate */}
                            <div className="text-center pt-2 border-t">
                              <div className="text-sm font-medium text-blue-600">
                                互动率: {((influencer.most_recent_counts.liked_count / influencer.most_recent_counts.fans_count) * 100).toFixed(1)}%
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="查看趋势"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInfluencer(influencer);
                                    setIsInfluencerDialogOpen(true);
                                  }}
                                >
                                  <BarChart3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="打开原链接"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(influencer.input_url, "_blank");
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {influencerTotal > 20 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-600">
                        显示第 {((influencerPage - 1) * 20) + 1} - {Math.min(influencerPage * 20, influencerTotal)} 条，共 {influencerTotal} 条
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInfluencerPage(Math.max(1, influencerPage - 1))}
                          disabled={influencerPage <= 1}
                          className="h-8"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          上一页
                        </Button>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">
                            第 {influencerPage} / {Math.ceil(influencerTotal / 20)} 页
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInfluencerPage(influencerPage + 1)}
                          disabled={influencerPage >= Math.ceil(influencerTotal / 20)}
                          className="h-8"
                        >
                          下一页
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </DashboardLayout>


      {/* Post Trend Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-4 w-4" />
              笔记趋势分析
            </DialogTitle>
            <DialogDescription className="text-sm">
              笔记数据趋势变化分析
            </DialogDescription>
          </DialogHeader>
          {selectedPost && <PostTrendChart post={selectedPost} />}
        </DialogContent>
      </Dialog>

      {/* Influencer Trend Dialog */}
      <Dialog open={isInfluencerDialogOpen} onOpenChange={setIsInfluencerDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-4 w-4" />
              达人趋势分析
            </DialogTitle>
            <DialogDescription className="text-sm">
              达人数据趋势变化分析
            </DialogDescription>
          </DialogHeader>
          {selectedInfluencer && <InfluencerTrendChart influencer={selectedInfluencer} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
