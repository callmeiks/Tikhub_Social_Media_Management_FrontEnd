import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import {
  TaskItem,
  createTaskQueueItems,
  processTaskQueue,
} from "@/lib/taskQueue";
import { TaskQueueSection } from "@/components/shared/TaskQueueSection";
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
import { Clock } from "lucide-react";
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
  Zap,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Bookmark,
} from "lucide-react";

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

// Post history interfaces
interface PostHistoryItem {
  created_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  reward_count: number;
  collect_count: number;
}

interface PostHistoryData {
  task_id: string;
  task_status: "MONITORING" | "PAUSED" | "FAILED" | "COMPLETED" | "PENDING" | "QUEUED" | "PROCESSING";
  monitor_interval: string;
  created_at: string;
  next_execution_at: string;
  photo_id: string;
  input_url: string;
  error_message: string | null;
  video_caption: string;
  create_time: string;
  share_url: string;
  video_play_url: string;
  author_name: string;
  author_avatar: string;
  most_recent_counts: {
    view_count: number;
    like_count: number;
    comment_count: number;
    share_count: number;
    reward_count: number;
    collect_count: number;
  };
  increment_percentages: {
    view_count_increment: number;
    like_count_increment: number;
    comment_count_increment: number;
    share_count_increment: number;
    reward_count_increment: number;
    collect_count_increment: number;
  };
  history: PostHistoryItem[];
}

interface PostHistoryResponse {
  items: PostHistoryData[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Influencer history interfaces
interface InfluencerHistoryItem {
  created_at: string;
  follower_count: number;
  following_count: number;
  post_count: number;
  moment_count: number;
}

interface InfluencerHistoryData {
  task_id: string;
  task_status: "MONITORING" | "PAUSED" | "FAILED" | "COMPLETED" | "PENDING" | "QUEUED" | "PROCESSING";
  monitor_interval: string;
  created_at: string;
  next_execution_at: string;
  user_id: string;
  user_name: string;
  user_text: string;
  user_avatar: string;
  city_name: string;
  user_sex: string;
  input_url: string;
  error_message: string | null;
  most_recent_counts: {
    follower_count: number;
    following_count: number;
    post_count: number;
    moment_count: number;
  };
  increment_percentages: {
    follower_count_increment: number;
    following_count_increment: number;
    post_count_increment: number;
    moment_count_increment: number;
  };
  history: InfluencerHistoryItem[];
}

interface InfluencerHistoryResponse {
  items: InfluencerHistoryData[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Sample monitoring data for Kuaishou content
const mockContentData = [
  {
    id: 1,
    title: "农村生活vlog | 秋收季节的忙碌日常",
    author: "乡村小哥",
    url: "https://www.kuaishou.com/short-video/3xfhb2k3jgn8qxt",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-15 10:30",
    status: "active",
    currentStats: {
      views: "145.6万",
      likes: "23.8万",
      comments: "8.9万",
      shares: "4.2千",
    },
    initialStats: {
      views: "128.3万",
      likes: "19.5万",
      comments: "6.7万",
      shares: "3.1千",
    },
  },
  {
    id: 2,
    title: "东北话搞笑短剧 | 媳妇回娘家",
    author: "东北二人转",
    url: "https://www.kuaishou.com/short-video/3xfhb2k3jgn8abc",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-14 16:20",
    status: "active",
    currentStats: {
      views: "298.7万",
      likes: "45.6万",
      comments: "18.9万",
      shares: "12.3千",
    },
    initialStats: {
      views: "275.2万",
      likes: "38.9万",
      comments: "15.2万",
      shares: "9.8千",
    },
  },
];

// Sample monitoring data for Kuaishou influencers
const mockInfluencerData = [
  {
    id: 1,
    username: "乡村小哥",
    avatar: "/api/placeholder/60/60",
    url: "https://www.kuaishou.com/profile/3xfhb2k3jgn8",
    addedAt: "2024-01-15 10:30",
    status: "active",
    verified: true,
    userType: "三农创作者",
    currentStats: {
      followers: "187.5万",
      following: "156",
      works: "342",
      totalLikes: "3890万",
    },
    initialStats: {
      followers: "182.1万",
      following: "152",
      works: "338",
      totalLikes: "3720万",
    },
    recentActivity: {
      postsThisWeek: 4,
      avgLikes: "23.8万",
      avgComments: "8.9万",
      engagementRate: "17.5%",
    },
  },
  {
    id: 2,
    username: "东北二人转",
    avatar: "/api/placeholder/60/60",
    url: "https://www.kuaishou.com/profile/3xfhb2k3abcd",
    addedAt: "2024-01-14 16:20",
    status: "active",
    verified: true,
    userType: "搞笑博主",
    currentStats: {
      followers: "423.8万",
      following: "78",
      works: "567",
      totalLikes: "8920万",
    },
    initialStats: {
      followers: "415.2万",
      following: "76",
      works: "562",
      totalLikes: "8650万",
    },
    recentActivity: {
      postsThisWeek: 6,
      avgLikes: "45.6万",
      avgComments: "18.9万",
      engagementRate: "15.2%",
    },
  },
];

// API functions
const fetchTasks = async (
  platform: string = "kuaishou",
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

// Create Post Monitoring Task
const createPostMonitoringTask = async (
  urls: string[],
  monitorInterval: string,
): Promise<CreateMonitoringTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/monitor/kuaishou/post/create`, {
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
    let errorMessage = "Failed to create post monitoring task";
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

// Create User Monitoring Task
const createUserMonitoringTask = async (
  urls: string[],
  monitorInterval: string,
): Promise<CreateMonitoringTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/monitor/kuaishou/user/create`, {
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
    let errorMessage = "Failed to create user monitoring task";
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

// Fetch Post History  
const fetchPostHistory = async (
  page: number = 1,
  limit: number = 20,
  photoId?: string,
  authorNickname?: string,
  status?: string,
): Promise<PostHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (photoId) params.append("photo_id", photoId);
  if (authorNickname) params.append("author_nickname", authorNickname);
  if (status) params.append("status", status);

  const response = await fetch(`${API_BASE_URL}/monitor/kuaishou/history/posts?${params}`, {
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

// Fetch Influencer History
const fetchInfluencerHistory = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
  userName?: string,
): Promise<InfluencerHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) params.append("status", status);
  if (userName) params.append("user_name", userName);

  const response = await fetch(`${API_BASE_URL}/monitor/kuaishou/history/influencers?${params}`, {
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

// PostTrendChart Component for Kuaishou
function PostTrendChart({ post }: { post: PostHistoryData }) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    view_count: true,
    like_count: true, 
    comment_count: true,
    share_count: true,
    reward_count: true,
    collect_count: true,
  });
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  // Prepare chart data from history
  const chartData = post.history.map((item, index) => ({
    timestamp: new Date(item.created_at).toLocaleString('zh-CN', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    rawTimestamp: item.created_at,
    index: index,
    view_count: item.view_count,
    like_count: item.like_count,
    comment_count: item.comment_count,
    share_count: item.share_count,
    reward_count: item.reward_count,
    collect_count: item.collect_count,
  }));

  // Metric configurations
  const metrics = [
    { key: 'view_count', label: '播放量', color: '#3B82F6', icon: Eye },
    { key: 'like_count', label: '点赞数', color: '#EF4444', icon: Heart },
    { key: 'comment_count', label: '评论数', color: '#10B981', icon: MessageCircle },
    { key: 'share_count', label: '分享数', color: '#8B5CF6', icon: Share2 },
    { key: 'reward_count', label: '打赏数', color: '#F59E0B', icon: Zap },
    { key: 'collect_count', label: '收藏数', color: '#6B7280', icon: Bookmark },
  ];

  // Calculate statistics
  const getStatistics = (metricKey: string) => {
    const values = chartData.map(item => item[metricKey]);
    return {
      max: Math.max(...values),
      min: Math.min(...values),
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    };
  };

  // Toggle metric visibility
  const toggleMetric = (metricKey: string) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metricKey]: !prev[metricKey]
    }));
  };

  // Highlight specific metric
  const handleMetricHighlight = (metricKey: string) => {
    if (highlightedMetric === metricKey) {
      setHighlightedMetric(null);
    } else {
      setHighlightedMetric(metricKey);
    }
  };

  // Custom tooltip
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

  // Handle notification toggle
  const handleNotificationToggle = (checked: boolean) => {
    setNotificationEnabled(checked);
    if (checked) {
      alert("📢 大幅增长通知功能即将上线，敬请期待！");
    }
  };

  if (!chartData.length) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          暂无历史数据，监控数据将在下次采集后显示
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Metric Controls */}
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
        
        {/* Checkboxes */}
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

        {/* Highlight Buttons */}
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
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

// InfluencerTrendChart Component for Kuaishou
function InfluencerTrendChart({ influencer }: { influencer: InfluencerHistoryData }) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    follower_count: true,
    following_count: true, 
    post_count: true,
    moment_count: true,
  });
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  // Prepare chart data from history
  const chartData = influencer.history.map((item, index) => ({
    timestamp: new Date(item.created_at).toLocaleString('zh-CN', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    rawTimestamp: item.created_at,
    index: index,
    follower_count: item.follower_count,
    following_count: item.following_count,
    post_count: item.post_count,
    moment_count: item.moment_count,
  }));

  // Metric configurations
  const metrics = [
    { key: 'follower_count', label: '粉丝数', color: '#3B82F6', icon: Users },
    { key: 'following_count', label: '关注数', color: '#10B981', icon: UserCheck },
    { key: 'post_count', label: '作品数', color: '#8B5CF6', icon: Video },
    { key: 'moment_count', label: '瞬间数', color: '#EF4444', icon: Heart },
  ];

  // Calculate statistics
  const getStatistics = (metricKey: string) => {
    const values = chartData.map(item => item[metricKey]);
    return {
      max: Math.max(...values),
      min: Math.min(...values),
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    };
  };

  // Toggle metric visibility
  const toggleMetric = (metricKey: string) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metricKey]: !prev[metricKey]
    }));
  };

  // Highlight specific metric
  const handleMetricHighlight = (metricKey: string) => {
    if (highlightedMetric === metricKey) {
      setHighlightedMetric(null);
    } else {
      setHighlightedMetric(metricKey);
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = (checked: boolean) => {
    setNotificationEnabled(checked);
    if (checked) {
      alert("📢 大幅增长通知功能即将上线，敬请期待！");
    }
  };

  // Custom tooltip
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

  if (!chartData.length) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          暂无历史数据，监控数据将在下次采集后显示
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Metric Controls */}
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
        
        {/* Checkboxes */}
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

        {/* Highlight Buttons */}
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
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
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

export default function KuaishouMonitoring() {
  const [contentData, setContentData] = useState<PostHistoryData[]>([]);
  const [influencerData, setInfluencerData] = useState<InfluencerHistoryData[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [influencerLoading, setInfluencerLoading] = useState(false);
  const [contentPage, setContentPage] = useState(1);
  const [influencerPage, setInfluencerPage] = useState(1);
  const [contentTotal, setContentTotal] = useState(0);
  const [influencerTotal, setInfluencerTotal] = useState(0);
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
  
  // Dialog states for stats popups
  const [selectedPost, setSelectedPost] = useState<PostHistoryData | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerHistoryData | null>(null);
  const [isInfluencerDialogOpen, setIsInfluencerDialogOpen] = useState(false);
  
  // Filter states
  const [postPhotoIdFilter, setPostPhotoIdFilter] = useState("");
  const [postAuthorFilter, setPostAuthorFilter] = useState("");
  const [postStatusFilter, setPostStatusFilter] = useState("all");
  const [influencerUserNameFilter, setInfluencerUserNameFilter] = useState("");
  const [influencerStatusFilter, setInfluencerStatusFilter] = useState("all");

  const validateUrl = (url: string) => {
    return url.includes("kuaishou.com");
  };

  // Load tasks from backend
  const loadTasks = async () => {
    setTasksLoading(true);
    try {
      const response = await fetchTasks(
        "kuaishou",
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

  // Load content history from backend
  const loadContentHistory = async () => {
    setContentLoading(true);
    try {
      const response = await fetchPostHistory(
        contentPage, 
        20,
        postPhotoIdFilter || undefined,
        postAuthorFilter || undefined,
        postStatusFilter === "all" ? undefined : postStatusFilter
      );
      setContentData(response.items);
      setContentTotal(response.total);
    } catch (error) {
      console.error("Failed to load content history:", error);
      toast({
        title: "加载失败",
        description: `加载作品监控数据失败: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setContentLoading(false);
    }
  };

  // Load influencer history from backend
  const loadInfluencerHistory = async () => {
    setInfluencerLoading(true);
    try {
      const response = await fetchInfluencerHistory(
        influencerPage, 
        20,
        influencerStatusFilter === "all" ? undefined : influencerStatusFilter,
        influencerUserNameFilter || undefined
      );
      setInfluencerData(response.items);
      setInfluencerTotal(response.total);
    } catch (error) {
      console.error("Failed to load influencer history:", error);
      toast({
        title: "加载失败",
        description: `加载达人监控数据失败: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setInfluencerLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [taskTypeFilter, taskStatusFilter, taskPage]);

  useEffect(() => {
    loadContentHistory();
  }, [contentPage, postPhotoIdFilter, postAuthorFilter, postStatusFilter]);

  useEffect(() => {
    loadInfluencerHistory();
  }, [influencerPage, influencerUserNameFilter, influencerStatusFilter]);

  const isContentUrl = (url: string) => {
    return url.includes("/short-video/") || url.includes("/video/");
  };

  const processContentUrls = (urls: string) => {
    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const valid = urlList.filter((url) => validateUrl(url));
    const invalid = urlList
      .filter((url) => !validateUrl(url))
      .filter((url) => url.length > 0);

    setValidContentUrls(valid);
    setInvalidContentUrls(invalid);
  };

  const processInfluencerUrls = (urls: string) => {
    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const valid = urlList.filter((url) => validateUrl(url));
    const invalid = urlList
      .filter((url) => !validateUrl(url))
      .filter((url) => url.length > 0);

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

  const handleAddContentBatch = async () => {
    if (validContentUrls.length === 0) {
      alert("请输入有效的快手作品链接");
      return;
    }

    setIsAddingContent(true);

    try {
      const response = await createPostMonitoringTask(
        validContentUrls,
        contentMonitoringInterval,
      );

      toast({
        title: "作品监控任务创建成功",
        description: `成功创建 ${response.total_successful} 个监控任务${response.total_failed > 0 ? `，失败 ${response.total_failed} 个` : ""}`,
        className: "bg-white border-black text-black",
      });

      if (response.failed_urls.length > 0) {
        console.warn("Failed URLs:", response.failed_urls);
      }

      // Refresh the tasks list to show new tasks
      loadTasks();
      // Refresh content history to show new monitoring data
      loadContentHistory();

      // Clear the form
      setContentUrls("");
      setValidContentUrls([]);
      setInvalidContentUrls([]);
      setContentUploadedFile(null);
    } catch (error) {
      console.error("Failed to create post monitoring tasks:", error);
      toast({
        title: "创建失败",
        description: `创建作品监控任务失败: ${error.message}`,
        variant: "destructive",
        className: "bg-white border-black text-black",
      });
    } finally {
      setIsAddingContent(false);
    }
  };

  const handleAddInfluencerBatch = async () => {
    if (validInfluencerUrls.length === 0) {
      alert("请输入有效的快手达人主页链接");
      return;
    }

    setIsAddingInfluencer(true);

    try {
      const response = await createUserMonitoringTask(
        validInfluencerUrls,
        influencerMonitoringInterval,
      );

      toast({
        title: "达人监控任务创建成功",
        description: `成功创建 ${response.total_successful} 个监控任务${response.total_failed > 0 ? `，失败 ${response.total_failed} 个` : ""}`,
        className: "bg-white border-black text-black",
      });

      if (response.failed_urls.length > 0) {
        console.warn("Failed URLs:", response.failed_urls);
      }

      // Refresh the tasks list to show new tasks
      loadTasks();
      // Refresh influencer history to show new monitoring data
      loadInfluencerHistory();

      // Clear the form
      setInfluencerUrls("");
      setValidInfluencerUrls([]);
      setInvalidInfluencerUrls([]);
      setInfluencerUploadedFile(null);
    } catch (error) {
      console.error("Failed to create user monitoring tasks:", error);
      toast({
        title: "创建失败",
        description: `创建达人监控任务失败: ${error.message}`,
        variant: "destructive",
        className: "bg-white border-black text-black",
      });
    } finally {
      setIsAddingInfluencer(false);
    }
  };

  const handleRemoveContent = (id: number) => {
    if (confirm("确定要停止监控这个作品吗？")) {
      setContentData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleRemoveInfluencer = (id: number) => {
    if (confirm("确定要停止监控这个达人吗？")) {
      setInfluencerData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleClearCompletedTasks = () => {
    setTaskQueue((prev) => prev.filter((task) => task.status !== "completed"));
  };

  const handleClearAllTasks = () => {
    if (confirm("确定要清空所有任务吗？")) {
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

  const getVerificationIcon = (verified: boolean, userType: string) => {
    if (!verified) return null;

    return userType.includes("官方") || userType.includes("机构") ? (
      <Crown className="h-3 w-3 text-yellow-500" />
    ) : (
      <Verified className="h-3 w-3 text-orange-500" />
    );
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
      case "KUAISHOU_POST_MONITOR":
        return "作品";
      case "KUAISHOU_INFLUENCER_MONITOR":
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

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + "万";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "千";
    }
    return num.toString();
  };

  const formatGrowthPercentage = (percentage: number) => {
    if (percentage === 0) return "0%";
    return `${percentage > 0 ? "+" : ""}${percentage.toFixed(1)}%`;
  };

  const getStatusBadgeFromTaskStatus = (status: PostHistoryData['task_status'] | InfluencerHistoryData['task_status']) => {
    switch (status) {
      case "MONITORING":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            监控中
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            已暂停
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            失败
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            已完成
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Clock className="h-3 w-3 mr-1" />
            等待中
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout
      title="快手监控"
      subtitle="实时监控快手平台的达人和作品数据变化"
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
              ⚡ 快手平台监控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="text-sm">作品监控: {contentTotal}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  达人监控: {influencerTotal}
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
              作品监控 ({contentTotal})
            </TabsTrigger>
            <TabsTrigger value="influencer" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              达人监控 ({influencerTotal})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Content Monitoring */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Monitor className="mr-2 h-4 w-4" />
                    作品监控添加
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  {/* Manual Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      手动输入作品链接
                    </label>
                    <Textarea
                      placeholder="请输入快手作品链接，每行一个链接&#10;示例：&#10;https://www.kuaishou.com/short-video/3xfhb2k3jgn8qxt"
                      value={contentUrls}
                      onChange={(e) => handleContentUrlsChange(e.target.value)}
                      className="min-h-[180px]"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">上传文件</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-600 mb-2">
                        选择包含作品链接的文本文件
                      </p>
                      <Input
                        type="file"
                        accept=".txt,.csv"
                        onChange={handleContentFileUpload}
                        className="max-w-full"
                      />
                      {contentUploadedFile && (
                        <div className="mt-2 flex items-center justify-center text-xs text-green-600">
                          <FileText className="h-3 w-3 mr-1" />
                          {contentUploadedFile.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* URL Validation */}
                  {(validContentUrls.length > 0 ||
                    invalidContentUrls.length > 0) && (
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg text-xs">
                      {validContentUrls.length > 0 && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>有效链接: {validContentUrls.length} 个</span>
                        </div>
                      )}
                      {invalidContentUrls.length > 0 && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span>无效链接: {invalidContentUrls.length} 个</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={handleAddContentBatch}
                    disabled={isAddingContent || validContentUrls.length === 0}
                    className="w-full"
                  >
                    {isAddingContent ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {isAddingContent
                      ? "添加中..."
                      : `添加作品监控 (${validContentUrls.length})`}
                  </Button>
                </CardContent>
              </Card>

              {/* Right: Influencer Monitoring */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <UserCheck className="mr-2 h-4 w-4" />
                    达人监控添加
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  {/* Manual Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      手动输入达人主页链接
                    </label>
                    <Textarea
                      placeholder="请输入快手达人主页链接，每行一个链接&#10;示例：&#10;https://www.kuaishou.com/profile/3xfhb2k3jgn8"
                      value={influencerUrls}
                      onChange={(e) =>
                        handleInfluencerUrlsChange(e.target.value)
                      }
                      className="min-h-[180px]"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">上传文件</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-600 mb-2">
                        选择包含达人主页链接的文本文件
                      </p>
                      <Input
                        type="file"
                        accept=".txt,.csv"
                        onChange={handleInfluencerFileUpload}
                        className="max-w-full"
                      />
                      {influencerUploadedFile && (
                        <div className="mt-2 flex items-center justify-center text-xs text-green-600">
                          <FileText className="h-3 w-3 mr-1" />
                          {influencerUploadedFile.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* URL Validation */}
                  {(validInfluencerUrls.length > 0 ||
                    invalidInfluencerUrls.length > 0) && (
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg text-xs">
                      {validInfluencerUrls.length > 0 && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>有效链接: {validInfluencerUrls.length} 个</span>
                        </div>
                      )}
                      {invalidInfluencerUrls.length > 0 && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span>
                            无效链接: {invalidInfluencerUrls.length} 个
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={handleAddInfluencerBatch}
                    disabled={
                      isAddingInfluencer || validInfluencerUrls.length === 0
                    }
                    className="w-full"
                  >
                    {isAddingInfluencer ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {isAddingInfluencer
                      ? "添加中..."
                      : `添加达人监控 (${validInfluencerUrls.length})`}
                  </Button>
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
                        <SelectItem value="KUAISHOU_POST_MONITOR">作品监控</SelectItem>
                        <SelectItem value="KUAISHOU_INFLUENCER_MONITOR">达人监控</SelectItem>
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
                    作品监控列表 ({contentTotal})
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    监控中:{" "}
                    {
                      contentData.filter((item) => item.task_status === "MONITORING")
                        .length
                    }
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1">
                      <Input
                        placeholder="搜索作品ID (photo_id)"
                        value={postPhotoIdFilter}
                        onChange={(e) => {
                          setPostPhotoIdFilter(e.target.value);
                          setContentPage(1);
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
                          setContentPage(1);
                        }}
                        className="h-8"
                      />
                    </div>
                    <div className="flex-1">
                      <Select
                        value={postStatusFilter}
                        onValueChange={(value) => {
                          setPostStatusFilter(value);
                          setContentPage(1);
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadContentHistory}
                      className="h-8 px-3"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      刷新
                    </Button>
                  </div>
                  
                  {contentLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 mx-auto animate-spin" />
                    <p className="text-sm text-muted-foreground mt-2">加载作品监控数据中...</p>
                  </div>
                ) : contentData.length === 0 ? (
                  <div className="text-center py-8">
                    <Monitor className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      暂无监控作品，请先添加作品链接
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">作品信息</TableHead>
                          <TableHead className="w-[120px]">
                            当前播放量
                          </TableHead>
                          <TableHead className="w-[100px]">当前点赞</TableHead>
                          <TableHead className="w-[100px]">当前评论</TableHead>
                          <TableHead className="w-[100px]">增长率</TableHead>
                          <TableHead className="w-[100px]">状态</TableHead>
                          <TableHead className="w-[120px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contentData.map((content) => (
                          <TableRow 
                            key={content.task_id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedPost(content);
                              setIsPostDialogOpen(true);
                            }}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center overflow-hidden">
                                  {content.author_avatar ? (
                                    <img 
                                      src={content.author_avatar} 
                                      alt={content.author_name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling.style.display = 'block';
                                      }}
                                    />
                                  ) : null}
                                  <Zap className="h-5 w-5 text-orange-500" style={{display: content.author_avatar ? 'none' : 'block'}} />
                                </div>
                                <div>
                                  <div
                                    className="max-w-[200px] truncate font-medium"
                                    title={content.video_caption || '快手作品'}
                                  >
                                    {content.video_caption || '快手作品'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    by {content.author_name || '未知作者'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {content.created_at ? new Date(content.created_at).toLocaleString('zh-CN') : '未知时间'}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                {formatNumber(content.most_recent_counts.view_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                {formatGrowthPercentage(content.increment_percentages.view_count_increment)}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Heart className="h-3 w-3 mr-1 text-red-500" />
                                {formatNumber(content.most_recent_counts.like_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                {formatGrowthPercentage(content.increment_percentages.like_count_increment)}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
                                {formatNumber(content.most_recent_counts.comment_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                {formatGrowthPercentage(content.increment_percentages.comment_count_increment)}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Share2 className="h-3 w-3 mr-1 text-purple-500" />
                                {formatNumber(content.most_recent_counts.share_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                {formatGrowthPercentage(content.increment_percentages.share_count_increment)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadgeFromTaskStatus(content.task_status)}
                              {content.error_message && (
                                <div className="text-xs text-red-600 mt-1" title={content.error_message}>
                                  错误: {content.error_message.length > 20 ? content.error_message.substring(0, 20) + '...' : content.error_message}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                    >
                                      <BarChart3 className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>作品监控趋势</DialogTitle>
                                      <DialogDescription>
                                        {content.video_caption || '快手作品'} - {content.author_name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      {content.history.length > 0 ? (
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-blue-600">
                                                {formatNumber(content.most_recent_counts.view_count)}
                                              </div>
                                              <div className="text-sm text-muted-foreground">播放量</div>
                                            </div>
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-red-600">
                                                {formatNumber(content.most_recent_counts.like_count)}
                                              </div>
                                              <div className="text-sm text-muted-foreground">点赞数</div>
                                            </div>
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-green-600">
                                                {formatNumber(content.most_recent_counts.comment_count)}
                                              </div>
                                              <div className="text-sm text-muted-foreground">评论数</div>
                                            </div>
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-purple-600">
                                                {formatNumber(content.most_recent_counts.share_count)}
                                              </div>
                                              <div className="text-sm text-muted-foreground">分享数</div>
                                            </div>
                                          </div>
                                          <div className="text-center text-gray-500">
                                            📊 历史数据记录: {content.history.length} 条
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center text-gray-500">
                                          📊 暂无历史数据
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    window.open(content.input_url, "_blank")
                                  }
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
                    达人监控列表 ({influencerTotal})
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    监控中:{" "}
                    {
                      influencerData.filter((item) => item.task_status === "MONITORING")
                        .length
                    }
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1">
                      <Input
                        placeholder="搜索用户名称"
                        value={influencerUserNameFilter}
                        onChange={(e) => {
                          setInfluencerUserNameFilter(e.target.value);
                          setInfluencerPage(1);
                        }}
                        className="h-8"
                      />
                    </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadInfluencerHistory}
                      className="h-8 px-3"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      刷新
                    </Button>
                  </div>
                  
                  {influencerLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 mx-auto animate-spin" />
                    <p className="text-sm text-muted-foreground mt-2">加载达人监控数据中...</p>
                  </div>
                ) : influencerData.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      暂无监��达人，请先添加达人链接
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">达人信息</TableHead>
                          <TableHead className="w-[120px]">
                            当前粉丝数
                          </TableHead>
                          <TableHead className="w-[100px]">作品数</TableHead>
                          <TableHead className="w-[120px]">瞬间数</TableHead>
                          <TableHead className="w-[100px]">关注数</TableHead>
                          <TableHead className="w-[100px]">状态</TableHead>
                          <TableHead className="w-[120px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {influencerData.map((influencer) => (
                          <TableRow 
                            key={influencer.task_id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedInfluencer(influencer);
                              setIsInfluencerDialogOpen(true);
                            }}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                                  {influencer.user_avatar ? (
                                    <img 
                                      src={influencer.user_avatar} 
                                      alt={influencer.user_name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <span style={{display: influencer.user_avatar ? 'none' : 'block'}}>
                                    {influencer.user_name?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">
                                      {influencer.user_name || '未知用户'}
                                    </span>
                                    <Verified className="h-3 w-3 text-orange-500" />
                                  </div>
                                  <div className="text-xs text-muted-foreground max-w-[180px] truncate" title={influencer.user_text}>
                                    {influencer.user_text || '快手用户'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {influencer.created_at ? new Date(influencer.created_at).toLocaleString('zh-CN') : '未知时间'}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1 text-blue-500" />
                                {formatNumber(influencer.most_recent_counts.follower_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                {formatGrowthPercentage(influencer.increment_percentages.follower_count_increment)}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Video className="h-3 w-3 mr-1 text-purple-500" />
                                {formatNumber(influencer.most_recent_counts.post_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                {formatGrowthPercentage(influencer.increment_percentages.post_count_increment)}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Heart className="h-3 w-3 mr-1 text-red-500" />
                                {formatNumber(influencer.most_recent_counts.moment_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                {formatGrowthPercentage(influencer.increment_percentages.moment_count_increment)}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <UserCheck className="h-3 w-3 mr-1 text-green-500" />
                                {formatNumber(influencer.most_recent_counts.following_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                {formatGrowthPercentage(influencer.increment_percentages.following_count_increment)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadgeFromTaskStatus(influencer.task_status)}
                              {influencer.error_message && (
                                <div className="text-xs text-red-600 mt-1" title={influencer.error_message}>
                                  错误: {influencer.error_message.length > 20 ? influencer.error_message.substring(0, 20) + '...' : influencer.error_message}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                    >
                                      <BarChart3 className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>达人监控趋势</DialogTitle>
                                      <DialogDescription>
                                        {influencer.user_name || '快手用户'}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      {influencer.history.length > 0 ? (
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-blue-600">
                                                {formatNumber(influencer.most_recent_counts.follower_count)}
                                              </div>
                                              <div className="text-sm text-muted-foreground">粉丝数</div>
                                            </div>
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-purple-600">
                                                {formatNumber(influencer.most_recent_counts.post_count)}
                                              </div>
                                              <div className="text-sm text-muted-foreground">作品数</div>
                                            </div>
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-red-600">
                                                {formatNumber(influencer.most_recent_counts.moment_count)}
                                              </div>
                                              <div className="text-sm text-muted-foreground">瞬间数</div>
                                            </div>
                                            <div className="text-center">
                                              <div className="text-2xl font-bold text-green-600">
                                                {formatNumber(influencer.most_recent_counts.following_count)}
                                              </div>
                                              <div className="text-sm text-muted-foreground">关注数</div>
                                            </div>
                                          </div>
                                          <div className="text-center text-gray-500">
                                            📊 历史数据记录: {influencer.history.length} 条
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center text-gray-500">
                                          📊 暂无历史数据
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    window.open(influencer.input_url, "_blank")
                                  }
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
                )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Post Trend Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-orange-500" />
              作品数据趋势分析
            </DialogTitle>
            <DialogDescription>
              {selectedPost?.video_caption || '快手作品'} - {selectedPost?.author_name || '未知作者'}
            </DialogDescription>
          </DialogHeader>
          {selectedPost && <PostTrendChart post={selectedPost} />}
        </DialogContent>
      </Dialog>

      {/* Influencer Trend Dialog */}
      <Dialog open={isInfluencerDialogOpen} onOpenChange={setIsInfluencerDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              达人数据趋势分析
            </DialogTitle>
            <DialogDescription>
              @{selectedInfluencer?.user_name || '快手用户'} - {selectedInfluencer?.user_text || ''}
            </DialogDescription>
          </DialogHeader>
          {selectedInfluencer && <InfluencerTrendChart influencer={selectedInfluencer} />}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
