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
  Clock,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Bookmark,
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
    aweme_id?: string;
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

// TikTok Post History interfaces
interface TikTokPostHistoryItem {
  task_id: string;
  task_status: string;
  monitor_interval: string;
  created_at: string;
  next_execution_at: string;
  aweme_id: string;
  input_url: string;
  error_message: string | null;
  desc: string;
  create_time: string;
  share_url: string;
  video_url: string;
  author_nickname: string;
  most_recent_counts: {
    digg_count: number;
    comment_count: number;
    share_count: number;
    collect_count: number;
    play_count: number;
    download_count: number;
  };
  increment_percentages: {
    digg_count_increment: number;
    comment_count_increment: number;
    share_count_increment: number;
    collect_count_increment: number;
    play_count_increment: number;
    download_count_increment: number;
  };
  history: Array<{
    created_at: string;
    digg_count: number;
    comment_count: number;
    share_count: number;
    collect_count: number;
    play_count: number;
    download_count: number;
  }>;
}

interface TikTokPostHistoryResponse {
  items: TikTokPostHistoryItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// TikTok Influencer History interfaces
interface TikTokInfluencerHistoryItem {
  task_id: string;
  task_status: string;
  monitor_interval: string;
  created_at: string;
  next_execution_at: string;
  user_id: string;
  input_url: string;
  error_message: string | null;
  unique_id: string;
  nickname: string;
  signature: string;
  avatar_url: string;
  region: string;
  language: string;
  is_verified: boolean;
  most_recent_counts: {
    follower_count: number;
    following_count: number;
    total_favorited: number;
    aweme_count: number;
  };
  increment_percentages: {
    follower_count_increment: number;
    following_count_increment: number;
    total_favorited_increment: number;
    aweme_count_increment: number;
  };
  history: Array<{
    created_at: string;
    follower_count: number;
    following_count: number;
    total_favorited: number;
    aweme_count: number;
  }>;
}

interface TikTokInfluencerHistoryResponse {
  items: TikTokInfluencerHistoryItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
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

// Sample monitoring data for TikTok content
const mockContentData = [
  {
    id: 1,
    title: "iPhone 15 Pro Max深度评测",
    author: "TechReviewer",
    url: "https://www.tiktok.com/@techreviewer/video/789012",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-15 10:30",
    status: "active",
    currentStats: {
      views: "512.3万",
      likes: "28.9万",
      comments: "12.8万",
      shares: "15.6千",
    },
    initialStats: {
      views: "450万",
      likes: "25.8万",
      comments: "8.9万",
      shares: "12.5千",
    },
  },
  {
    id: 2,
    title: "AI Art Tutorial - Create Amazing Digital Art",
    author: "DigitalArtist",
    url: "https://www.tiktok.com/@digitalartist/video/456789",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-14 16:20",
    status: "active",
    currentStats: {
      views: "298.7万",
      likes: "45.2万",
      comments: "18.5万",
      shares: "23.1千",
    },
    initialStats: {
      views: "275万",
      likes: "38.9万",
      comments: "15.2万",
      shares: "19.8千",
    },
  },
];

// Sample monitoring data for TikTok influencers
const mockInfluencerData = [
  {
    id: 1,
    username: "TechReviewer",
    avatar: "/api/placeholder/60/60",
    url: "https://www.tiktok.com/@techreviewer",
    addedAt: "2024-01-15 10:30",
    status: "active",
    verified: true,
    userType: "Verified Creator",
    currentStats: {
      followers: "245.7万",
      following: "89",
      works: "203",
      totalLikes: "3580万",
    },
    initialStats: {
      followers: "238.9万",
      following: "87",
      works: "200",
      totalLikes: "3450万",
    },
    recentActivity: {
      postsThisWeek: 2,
      avgLikes: "28.9万",
      avgComments: "12.8万",
      engagementRate: "15.2%",
    },
  },
  {
    id: 2,
    username: "DigitalArtist",
    avatar: "/api/placeholder/60/60",
    url: "https://www.tiktok.com/@digitalartist",
    addedAt: "2024-01-14 16:20",
    status: "active",
    verified: true,
    userType: "Pro Account",
    currentStats: {
      followers: "189.4万",
      following: "156",
      works: "342",
      totalLikes: "2890万",
    },
    initialStats: {
      followers: "182.1万",
      following: "152",
      works: "338",
      totalLikes: "2760万",
    },
    recentActivity: {
      postsThisWeek: 4,
      avgLikes: "45.2万",
      avgComments: "18.5万",
      engagementRate: "18.9%",
    },
  },
];

// API functions
const createTikTokPostMonitoringTask = async (
  urls: string[],
  monitorInterval: string,
): Promise<CreateMonitoringTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/monitor/tiktok/post/create`, {
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
    let errorMessage = "Failed to create TikTok post monitoring task";
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

// Fetch TikTok post history
const fetchTikTokPostHistory = async (
  page: number = 1,
  limit: number = 20,
  status?: string
): Promise<TikTokPostHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (status && status !== "all") {
    params.append("status", status);
  }

  const response = await fetch(`${API_BASE_URL}/monitor/tiktok/history/posts?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch TikTok post history";
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

// Fetch TikTok influencer history
const fetchTikTokInfluencerHistory = async (
  page: number = 1,
  limit: number = 20,
  status?: string
): Promise<TikTokInfluencerHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (status && status !== "all") {
    params.append("status", status);
  }

  const response = await fetch(`${API_BASE_URL}/monitor/tiktok/history/influencers?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch TikTok influencer history";
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

const createTikTokUserMonitoringTask = async (
  urls: string[],
  monitorInterval: string,
): Promise<CreateMonitoringTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/monitor/tiktok/user/create`, {
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
    let errorMessage = "Failed to create TikTok user monitoring task";
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

const fetchTasks = async (
  platform: string = "tiktok",
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

export default function TikTokMonitoring() {
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
  const [realTasks, setRealTasks] = useState<MonitoringTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>("all");
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("all");
  const [taskPage, setTaskPage] = useState(1);
  const [taskTotal, setTaskTotal] = useState(0);
  const [contentMonitoringInterval, setContentMonitoringInterval] =
    useState("1hour");
  const [influencerMonitoringInterval, setInfluencerMonitoringInterval] =
    useState("1hour");

  // TikTok History Data States
  const [postHistory, setPostHistory] = useState<TikTokPostHistoryItem[]>([]);
  const [postHistoryLoading, setPostHistoryLoading] = useState(false);
  const [postPage, setPostPage] = useState(1);
  const [postTotal, setPostTotal] = useState(0);
  const [postTotalPages, setPostTotalPages] = useState(1);
  const [postStatusFilter, setPostStatusFilter] = useState("all");
  const [postHistoryCache, setPostHistoryCache] = useState<{[key: string]: TikTokPostHistoryResponse}>({});
  
  const [influencerHistory, setInfluencerHistory] = useState<TikTokInfluencerHistoryItem[]>([]);
  const [influencerHistoryLoading, setInfluencerHistoryLoading] = useState(false);
  const [influencerPage, setInfluencerPage] = useState(1);
  const [influencerTotal, setInfluencerTotal] = useState(0);
  const [influencerTotalPages, setInfluencerTotalPages] = useState(1);
  const [influencerStatusFilter, setInfluencerStatusFilter] = useState("all");
  const [influencerHistoryCache, setInfluencerHistoryCache] = useState<{[key: string]: TikTokInfluencerHistoryResponse}>({});
  
  // Dialog states for stats popup
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<TikTokPostHistoryItem | null>(null);
  const [isInfluencerDialogOpen, setIsInfluencerDialogOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<TikTokInfluencerHistoryItem | null>(null);

  const validateUrl = (url: string) => {
    return url.includes("tiktok.com");
  };

  const loadTasks = async () => {
    setTasksLoading(true);
    try {
      const response = await fetchTasks(
        "tiktok",
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

  useEffect(() => {
    loadTasks();
  }, [taskTypeFilter, taskStatusFilter, taskPage]);

  // Load TikTok Post History with caching
  const loadPostHistory = async () => {
    const cacheKey = `posts_${postPage}_${postStatusFilter}`;
    
    // Check cache first
    if (postHistoryCache[cacheKey]) {
      const cachedData = postHistoryCache[cacheKey];
      setPostHistory(cachedData.items);
      setPostTotal(cachedData.total);
      setPostTotalPages(cachedData.total_pages);
      return;
    }

    setPostHistoryLoading(true);
    try {
      const response = await fetchTikTokPostHistory(
        postPage,
        20,
        postStatusFilter === "all" ? undefined : postStatusFilter
      );
      
      setPostHistory(response.items);
      setPostTotal(response.total);
      setPostTotalPages(response.total_pages);
      
      // Cache the response
      setPostHistoryCache(prev => ({
        ...prev,
        [cacheKey]: response
      }));
    } catch (error) {
      console.error("Failed to load post history:", error);
      toast({
        title: "加载失败",
        description: `加载作品历史失败: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setPostHistoryLoading(false);
    }
  };

  // Load TikTok Influencer History with caching
  const loadInfluencerHistory = async () => {
    const cacheKey = `influencers_${influencerPage}_${influencerStatusFilter}`;
    
    // Check cache first
    if (influencerHistoryCache[cacheKey]) {
      const cachedData = influencerHistoryCache[cacheKey];
      setInfluencerHistory(cachedData.items);
      setInfluencerTotal(cachedData.total);
      setInfluencerTotalPages(cachedData.total_pages);
      return;
    }

    setInfluencerHistoryLoading(true);
    try {
      const response = await fetchTikTokInfluencerHistory(
        influencerPage,
        20,
        influencerStatusFilter === "all" ? undefined : influencerStatusFilter
      );
      
      setInfluencerHistory(response.items);
      setInfluencerTotal(response.total);
      setInfluencerTotalPages(response.total_pages);
      
      // Cache the response
      setInfluencerHistoryCache(prev => ({
        ...prev,
        [cacheKey]: response
      }));
    } catch (error) {
      console.error("Failed to load influencer history:", error);
      toast({
        title: "加载失败",
        description: `加载达人历史失败: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setInfluencerHistoryLoading(false);
    }
  };

  // Load data when tab is clicked
  useEffect(() => {
    loadPostHistory();
  }, [postPage, postStatusFilter]);

  useEffect(() => {
    loadInfluencerHistory();
  }, [influencerPage, influencerStatusFilter]);

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
      case "TIKTOK_POST_MONITOR":
        return "作品";
      case "TIKTOK_INFLUENCER_MONITOR":
        return "达人";
      default:
        return taskType;
    }
  };

  // Helper functions for TikTok history display
  const getPostStatusBadge = (status: string) => {
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
      default:
        return <Badge variant="secondary" className="text-xs h-6 px-2 whitespace-nowrap">{status}</Badge>;
    }
  };

  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null || isNaN(num)) {
      return '0';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Pagination handlers
  const canGoPostPrev = postPage > 1;
  const canGoPostNext = postPage < postTotalPages;
  const canGoInfluencerPrev = influencerPage > 1;
  const canGoInfluencerNext = influencerPage < influencerTotalPages;

  const handlePostPrevPage = () => {
    if (canGoPostPrev) {
      setPostPage(postPage - 1);
    }
  };

  const handlePostNextPage = () => {
    if (canGoPostNext) {
      setPostPage(postPage + 1);
    }
  };

  const handleInfluencerPrevPage = () => {
    if (canGoInfluencerPrev) {
      setInfluencerPage(influencerPage - 1);
    }
  };

  const handleInfluencerNextPage = () => {
    if (canGoInfluencerNext) {
      setInfluencerPage(influencerPage + 1);
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

  const isContentUrl = (url: string) => {
    return url.includes("/video/");
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
        description: "请输入有效的TikTok作品链接",
        variant: "destructive",
      });
      return;
    }

    setIsAddingContent(true);

    try {
      // Create monitoring tasks via API
      const response = await createTikTokPostMonitoringTask(
        validContentUrls,
        contentMonitoringInterval,
      );

      // Show success message
      if (response.failed_urls.length > 0) {
        toast({
          title: "部分成功",
          description: `成功添加 ${response.total_successful} 个任务，失败 ${response.total_failed} 个`,
          variant: "default",
        });
      } else {
        toast({
          title: "添加成功",
          description: `成功添加 ${response.total_successful} 个TikTok作品监控任务！`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to create TikTok post monitoring tasks:", error);
      toast({
        title: "创建失败",
        description: `创建监控任务失败: ${error.message}`,
        variant: "destructive",
      });
      setIsAddingContent(false);
      return;
    }

    const newTasks = validContentUrls.map((url) => ({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      type: "content" as const,
      status: "completed" as const,
      addedAt: new Date().toLocaleString("zh-CN"),
      completedAt: new Date().toLocaleString("zh-CN"),
    }));

    setTaskQueue((prev) => [...prev, ...newTasks]);

    // Add successful tasks to content data
    validContentUrls.forEach((url, i) => {
      const newContentItem = {
        id: Date.now() + i,
        title: `TikTok作品监控 ${i + 1}`,
        author: "作者加载中...",
        url: url,
        thumbnail: "/api/placeholder/120/120",
        addedAt: new Date().toLocaleString("zh-CN"),
        status: "active",
        currentStats: {
          views: "加载中...",
          likes: "加载中...",
          comments: "加载中...",
          shares: "加载中...",
        },
        initialStats: {
          views: "0",
          likes: "0",
          comments: "0",
          shares: "0",
        },
      };
      setContentData((prev) => [newContentItem, ...prev]);
    });

    setContentUrls("");
    setValidContentUrls([]);
    setInvalidContentUrls([]);
    setContentUploadedFile(null);
    setIsAddingContent(false);
  };

  const handleAddInfluencerBatch = async () => {
    if (validInfluencerUrls.length === 0) {
      toast({
        title: "输入错误",
        description: "请输入有效的TikTok达人链接",
        variant: "destructive",
      });
      return;
    }

    setIsAddingInfluencer(true);

    try {
      // Create monitoring tasks via API
      const response = await createTikTokUserMonitoringTask(
        validInfluencerUrls,
        influencerMonitoringInterval,
      );

      // Show success message
      if (response.failed_urls.length > 0) {
        toast({
          title: "部分成功",
          description: `成功添加 ${response.total_successful} 个任务，失败 ${response.total_failed} 个`,
          variant: "default",
        });
      } else {
        toast({
          title: "添加成功",
          description: `成功添加 ${response.total_successful} 个TikTok达人监控任务！`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to create TikTok user monitoring tasks:", error);
      toast({
        title: "创建失败",
        description: `创建监控任务失败: ${error.message}`,
        variant: "destructive",
      });
      setIsAddingInfluencer(false);
      return;
    }

    const newTasks = validInfluencerUrls.map((url) => ({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      type: "influencer" as const,
      status: "completed" as const,
      addedAt: new Date().toLocaleString("zh-CN"),
      completedAt: new Date().toLocaleString("zh-CN"),
    }));

    setTaskQueue((prev) => [...prev, ...newTasks]);

    // Add successful tasks to influencer data
    validInfluencerUrls.forEach((url, i) => {
      const newInfluencer = {
        id: Date.now() + i + 1000,
        username: `TikTok达人监控 ${i + 1}`,
        avatar: "/api/placeholder/60/60",
        url: url,
        addedAt: new Date().toLocaleString("zh-CN"),
        status: "active",
        verified: false,
        userType: "用户加载中...",
        currentStats: {
          followers: "加载中...",
          following: "加载中...",
          works: "加载中...",
          totalLikes: "加载中...",
        },
        initialStats: {
          followers: "0",
          following: "0",
          works: "0",
          totalLikes: "0",
        },
        recentActivity: {
          postsThisWeek: 0,
          avgLikes: "加载中...",
          avgComments: "加载中...",
          engagementRate: "加载中...",
        },
      };
      setInfluencerData((prev) => [newInfluencer, ...prev]);
    });

    setInfluencerUrls("");
    setValidInfluencerUrls([]);
    setInvalidInfluencerUrls([]);
    setInfluencerUploadedFile(null);
    setIsAddingInfluencer(false);
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

  const getTaskStatusBadge = (status: TaskItem["status"]) => {
    switch (status) {
      case "waiting":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            等待中
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            处理中
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            已完成
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200"
          >
            <X className="h-3 w-3 mr-1" />
            失败
          </Badge>
        );
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
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

    return userType.includes("Pro") ? (
      <Crown className="h-3 w-3 text-yellow-500" />
    ) : (
      <Verified className="h-3 w-3 text-blue-500" />
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

  return (
    <DashboardLayout
      title="TikTok监控"
      subtitle="实时监控TikTok平台的达人和作品数据变化"
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
              🎵 TikTok平台监控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="text-sm">作品监控: {contentData.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  达人监控: {influencerData.length}
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
              作品监控 ({postTotal})
            </TabsTrigger>
            <TabsTrigger value="influencer" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              达人监控 ({influencerTotal})
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
                        <SelectItem value="1min">1 分钟</SelectItem>
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
                        placeholder="请输入TikTok作品链接，每行一个链接&#10;作品链接示例：&#10;https://www.tiktok.com/@username/video/123456&#10;https://www.tiktok.com/@username/video/789012"
                        value={contentUrls}
                        onChange={(e) =>
                          handleContentUrlsChange(e.target.value)
                        }
                        className="min-h-[180px]"
                      />
                      <div className="text-xs text-gray-500">
                        💡 仅支持TikTok作品/视频链接
                      </div>
                    </div>
                  </div>

                  {/* 上传文件在下方 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">上传文件</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-600 mb-2">
                        选择包含TikTok链接的文本文件（每行一个链接）
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
                              请确保链接包含 "tiktok.com"
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
                        <SelectItem value="1min">1 分钟</SelectItem>
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
                        placeholder="请输入TikTok达人链接，每行一个链接&#10;达人主页链接示例：&#10;https://www.tiktok.com/@username&#10;https://www.tiktok.com/@username2"
                        value={influencerUrls}
                        onChange={(e) =>
                          handleInfluencerUrlsChange(e.target.value)
                        }
                        className="min-h-[180px]"
                      />
                      <div className="text-xs text-gray-500">
                        💡 仅支持TikTok达人主页链接
                      </div>
                    </div>
                  </div>

                  {/* 上传文件在下方 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">上传文件</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-600 mb-2">
                        选择包含TikTok达人链接的文本文件（每行一个链接）
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
                              请确保链接包含 "tiktok.com"
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

          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    任务队列 ({taskTotal})
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadTasks}
                      disabled={tasksLoading}
                      className="h-7 text-xs"
                    >
                      {tasksLoading ? (
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
                  {/* Task Filters */}
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Select
                        value={taskTypeFilter}
                        onValueChange={(value) => {
                          setTaskTypeFilter(value);
                          setTaskPage(1); // Reset to first page when filter changes
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择任务类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部类型</SelectItem>
                          <SelectItem value="TIKTOK_POST_MONITOR">
                            作品监控
                          </SelectItem>
                          <SelectItem value="TIKTOK_INFLUENCER_MONITOR">
                            达人监控
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select
                        value={taskStatusFilter}
                        onValueChange={(value) => {
                          setTaskStatusFilter(value);
                          setTaskPage(1); // Reset to first page when filter changes
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择任务状态" />
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

                  {/* Task Statistics */}
                  <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {
                          realTasks.filter((task) => task.status === "MONITORING")
                            .length
                        }
                      </div>
                      <div className="text-xs text-gray-600">监控中</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-yellow-600">
                        {
                          realTasks.filter((task) => task.status === "PAUSED")
                            .length
                        }
                      </div>
                      <div className="text-xs text-gray-600">已暂停</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {
                          realTasks.filter((task) => task.status === "COMPLETED")
                            .length
                        }
                      </div>
                      <div className="text-xs text-gray-600">已完成</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">
                        {
                          realTasks.filter((task) => task.status === "FAILED")
                            .length
                        }
                      </div>
                      <div className="text-xs text-gray-600">失败</div>
                    </div>
                  </div>

                  {/* Real Task List */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="h-10">
                          <TableHead className="w-[350px] py-2">链接</TableHead>
                          <TableHead className="w-[80px] py-2">类型</TableHead>
                          <TableHead className="w-[100px] py-2">状态</TableHead>
                          <TableHead className="w-[100px] py-2">监控间隔</TableHead>
                          <TableHead className="w-[140px] py-2">创建时间</TableHead>
                          <TableHead className="w-[100px] py-2">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasksLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <Loader2 className="h-6 w-6 mx-auto animate-spin mb-2" />
                              <p className="text-sm text-muted-foreground">
                                加载任务中...
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : realTasks.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                暂无监控任务
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          realTasks.map((task) => (
                            <TableRow key={task.id} className="h-12">
                              <TableCell className="font-medium py-2">
                                <div
                                  className="max-w-[320px] truncate text-sm"
                                  title={task.input_data.url}
                                >
                                  {task.input_data.url}
                                </div>
                                {task.error_message && (
                                  <div className="text-xs text-red-600 mt-1">
                                    {task.error_message}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="py-2">
                                <Badge variant="secondary" className="text-xs h-6 px-2 whitespace-nowrap">
                                  {getRealTaskTypeLabel(task.task_type)}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-2">
                                <div className="flex items-center">
                                  {getRealTaskStatusBadge(task.status)}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm py-2">
                                {task.monitor_interval}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600 py-2">
                                {formatDateTime(task.created_at)}
                              </TableCell>
                              <TableCell className="py-2">
                                <div className="flex items-center justify-center">
                                  {getActionButton(task)}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Controls - Always Show */}
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
                    作品监控列表 ({postTotal})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex space-x-4">
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
                    <div className="flex-2"></div>
                    <div className="flex-2"></div>
                  </div>

                  {postHistoryLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 mx-auto animate-spin mb-2" />
                      <p className="text-sm text-muted-foreground">加载作品历史中...</p>
                    </div>
                  ) : postHistory.length === 0 ? (
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
                          <TableHead className="w-[100px]">分享量</TableHead>
                          <TableHead className="w-[100px]">收藏量</TableHead>
                          <TableHead className="w-[100px]">下载量</TableHead>
                          <TableHead className="w-[100px]">状态</TableHead>
                          <TableHead className="w-[120px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {postHistory.map((post) => (
                          <TableRow 
                            key={post.task_id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedPost(post);
                              setIsPostDialogOpen(true);
                            }}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(post.video_url, "_blank");
                                  }}
                                  title="点击播放视频"
                                >
                                  <video
                                    className="w-full h-full object-cover rounded-lg"
                                    src={post.video_url}
                                    muted
                                    onError={(e) => {
                                      const target = e.target as HTMLVideoElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling!.classList.remove('hidden');
                                    }}
                                  />
                                  <Play className="h-5 w-5 text-gray-500 hidden" />
                                </div>
                                <div>
                                  <div className="max-w-[200px] truncate font-medium" title={post.desc}>
                                    {post.desc || '无标题'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    by {post.author_nickname || '未知作者'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    创建于 {formatDateTime(post.created_at)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                {formatNumber(post.most_recent_counts.play_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                +{(post.increment_percentages.play_count_increment || 0).toFixed(1)}%
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Heart className="h-3 w-3 mr-1 text-red-500" />
                                {formatNumber(post.most_recent_counts.digg_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                +{(post.increment_percentages.digg_count_increment || 0).toFixed(1)}%
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
                                {formatNumber(post.most_recent_counts.comment_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                +{(post.increment_percentages.comment_count_increment || 0).toFixed(1)}%
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Share2 className="h-3 w-3 mr-1 text-purple-500" />
                                {formatNumber(post.most_recent_counts.share_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                +{(post.increment_percentages.share_count_increment || 0).toFixed(1)}%
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Bookmark className="h-3 w-3 mr-1 text-amber-500" />
                                {formatNumber(post.most_recent_counts.collect_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                +{(post.increment_percentages.collect_count_increment || 0).toFixed(1)}%
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Download className="h-3 w-3 mr-1 text-gray-600" />
                                {formatNumber(post.most_recent_counts.download_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                +{(post.increment_percentages.download_count_increment || 0).toFixed(1)}%
                              </div>
                            </TableCell>
                            <TableCell>
                              {getPostStatusBadge(post.task_status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 bg-white border-black text-black hover:bg-black hover:text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPost(post);
                                    setIsPostDialogOpen(true);
                                  }}
                                  title="查看趋势"
                                >
                                  <BarChart3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(post.input_url, "_blank");
                                  }}
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

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                      显示第 {((postPage - 1) * 20) + 1} - {Math.min(postPage * 20, postTotal)} 条，共 {postTotal} 条
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePostPrevPage}
                        disabled={!canGoPostPrev}
                        className="h-8 bg-white border-black text-black hover:bg-black hover:text-white"
                      >
                        上一页
                      </Button>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">
                          第 {postPage} / {postTotalPages} 页
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePostNextPage}
                        disabled={!canGoPostNext}
                        className="h-8 bg-white border-black text-black hover:bg-black hover:text-white"
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
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
                    <div className="flex-2"></div>
                  </div>

                  {influencerHistoryLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 mx-auto animate-spin mb-2" />
                      <p className="text-sm text-muted-foreground">加载达人历史中...</p>
                    </div>
                  ) : influencerHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <UserCheck className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        暂无监控达人，请先添加达人链接
                      </p>
                    </div>
                  ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">达人信息</TableHead>
                          <TableHead className="w-[120px]">当前粉丝数</TableHead>
                          <TableHead className="w-[100px]">作品数</TableHead>
                          <TableHead className="w-[120px]">获赞总数</TableHead>
                          <TableHead className="w-[100px]">状态</TableHead>
                          <TableHead className="w-[120px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {influencerHistory.map((influencer) => (
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
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                  {influencer.avatar_url ? (
                                    <img
                                      src={influencer.avatar_url}
                                      alt={influencer.nickname}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.nextElementSibling!.classList.remove('hidden');
                                      }}
                                    />
                                  ) : null}
                                  <div className={`text-white text-sm font-bold ${influencer.avatar_url ? 'hidden' : ''}`}>
                                    {influencer.nickname.charAt(0)}
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">
                                      {influencer.nickname}
                                    </span>
                                    {influencer.is_verified && <Verified className="h-3 w-3 text-blue-500" />}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    @{influencer.unique_id}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {influencer.region}
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
                                +{(influencer.increment_percentages.follower_count_increment || 0).toFixed(1)}%
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Video className="h-3 w-3 mr-1 text-purple-500" />
                                {formatNumber(influencer.most_recent_counts.aweme_count)}
                              </div>
                              <div className="text-xs text-green-600">
                                +{(influencer.increment_percentages.aweme_count_increment || 0).toFixed(1)}%
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Heart className="h-3 w-3 mr-1 text-red-500" />
                                {formatNumber(influencer.most_recent_counts.total_favorited)}
                              </div>
                              <div className="text-xs text-green-600">
                                +{(influencer.increment_percentages.total_favorited_increment || 0).toFixed(1)}%
                              </div>
                            </TableCell>
                            <TableCell>
                              {getPostStatusBadge(influencer.task_status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 bg-white border-black text-black hover:bg-black hover:text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInfluencer(influencer);
                                    setIsInfluencerDialogOpen(true);
                                  }}
                                  title="查看趋势"
                                >
                                  <BarChart3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(influencer.input_url, "_blank");
                                  }}
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

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                      显示第 {((influencerPage - 1) * 20) + 1} - {Math.min(influencerPage * 20, influencerTotal)} 条，共 {influencerTotal} 条
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleInfluencerPrevPage}
                        disabled={!canGoInfluencerPrev}
                        className="h-8 bg-white border-black text-black hover:bg-black hover:text-white"
                      >
                        上一页
                      </Button>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">
                          第 {influencerPage} / {influencerTotalPages} 页
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleInfluencerNextPage}
                        disabled={!canGoInfluencerNext}
                        className="h-8 bg-white border-black text-black hover:bg-black hover:text-white"
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Post Trend Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-4 w-4" />
              作品趋势分析
            </DialogTitle>
            <DialogDescription className="text-sm">
              作品数据趋势变化分析
            </DialogDescription>
          </DialogHeader>
          {selectedPost && <TikTokPostTrendChart post={selectedPost} />}
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
          {selectedInfluencer && <TikTokInfluencerTrendChart influencer={selectedInfluencer} />}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// Interactive Chart Component for TikTok Post Trends
function TikTokPostTrendChart({ post }: { post: TikTokPostHistoryItem }) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    play_count: true,
    digg_count: true, 
    comment_count: true,
    share_count: true,
    collect_count: true,
    download_count: true,
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
    play_count: item.play_count,
    digg_count: item.digg_count,
    comment_count: item.comment_count,
    share_count: item.share_count,
    collect_count: item.collect_count,
    download_count: item.download_count,
  }));

  // Metric configurations
  const metrics = [
    { key: 'play_count', label: '播放量', color: '#3B82F6', icon: Eye },
    { key: 'digg_count', label: '点赞数', color: '#EF4444', icon: Heart },
    { key: 'comment_count', label: '评论数', color: '#10B981', icon: MessageCircle },
    { key: 'share_count', label: '分享数', color: '#8B5CF6', icon: Share2 },
    { key: 'collect_count', label: '收藏数', color: '#F59E0B', icon: Bookmark },
    { key: 'download_count', label: '下载量', color: '#6B7280', icon: Download },
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

// Interactive Chart Component for TikTok Influencer Trends
function TikTokInfluencerTrendChart({ influencer }: { influencer: TikTokInfluencerHistoryItem }) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    follower_count: true,
    following_count: true, 
    aweme_count: true,
    total_favorited: true,
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
    aweme_count: item.aweme_count,
    total_favorited: item.total_favorited,
  }));

  // Metric configurations
  const metrics = [
    { key: 'follower_count', label: '粉丝数', color: '#3B82F6', icon: Users },
    { key: 'following_count', label: '关注数', color: '#10B981', icon: UserCheck },
    { key: 'aweme_count', label: '作品数', color: '#8B5CF6', icon: Video },
    { key: 'total_favorited', label: '获赞总数', color: '#EF4444', icon: Heart },
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
