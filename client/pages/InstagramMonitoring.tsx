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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Pause,
  RotateCcw,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Upload,
  FileText,
  Users,
  UserPlus,
  Video,
  Crown,
  Verified,
  Image,
  Grid,
  Camera,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const API_TOKEN = import.meta.env.VITE_BACKEND_API_TOKEN;

// Interfaces
interface CreateMonitoringTaskResponse {
  total_successful: number;
  total_failed: number;
  failed_urls: string[];
  successful_tasks: Record<string, string>;
}

interface MonitoringTask {
  task_id: string;
  platform: string;
  urls: string[];
  monitor_interval: string;
  status: "running" | "paused" | "stopped" | "completed";
  created_at: string;
  updated_at: string;
  next_execution_at?: string;
  is_user_task: boolean;
  latest_data?: any;
}

interface TaskListResponse {
  code: number;
  message: string;
  data: {
    tasks: MonitoringTask[];
    total: number;
    current_page: number;
    page_size: number;
  };
}

// Instagram Post History Interfaces
interface PostHistoryItem {
  created_at: string;
  like_count: number;
  comment_count: number;
  share_count: number;
}

interface PostHistoryData {
  task_id: string;
  task_status: "MONITORING" | "PAUSED" | "FAILED" | "COMPLETED" | "PENDING" | "QUEUED" | "PROCESSING";
  monitor_interval: string;
  created_at: string;
  next_execution_at: string;
  code: string;
  input_url: string;
  error_message: string | null;
  pk: string;
  taken_at: number;
  username: string;
  profile_pic_url: string;
  caption_text: string;
  image_urls: string[];
  video_url: string;
  location_address: string;
  media_type: number;
  is_video?: boolean;
  most_recent_counts: {
    like_count: number;
    comment_count: number;
    share_count: number;
  };
  increment_percentages: {
    like_count_increment: number;
    comment_count_increment: number;
    share_count_increment: number;
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

// Instagram Influencer History Interfaces
interface InfluencerHistoryItem {
  created_at: string;
  follower_count: number;
  following_count: number;
  media_count: number;
}

interface InfluencerHistoryData {
  task_id: string;
  task_status: "MONITORING" | "PAUSED" | "FAILED" | "COMPLETED" | "PENDING" | "QUEUED" | "PROCESSING";
  monitor_interval: string;
  created_at: string;
  next_execution_at: string;
  username: string;
  input_url: string;
  error_message: string | null;
  user_id: string;
  biography: string;
  external_url: string;
  profile_pic_url: string;
  is_verified: boolean;
  is_private: boolean;
  is_business_account: boolean;
  most_recent_counts: {
    follower_count: number;
    following_count: number;
    media_count: number;
  };
  increment_percentages: {
    follower_count_increment: number;
    following_count_increment: number;
    media_count_increment: number;
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

// API Functions
const createInstagramPostMonitoringTask = async (
  urls: string[],
  monitorInterval: string,
): Promise<CreateMonitoringTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/monitor/instagram/post/create`, {
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
    let errorMessage = "Failed to create Instagram post monitoring task";
    try {
      const error = await response.json();
      errorMessage = error.detail || error.message || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
};

const createInstagramUserMonitoringTask = async (
  urls: string[],
  monitorInterval: string,
): Promise<CreateMonitoringTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/monitor/instagram/user/create`, {
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
    let errorMessage = "Failed to create Instagram user monitoring task";
    try {
      const error = await response.json();
      errorMessage = error.detail || error.message || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
};

const fetchTasks = async (page: number = 1, pageSize: number = 10): Promise<TaskListResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/monitor/tasks?platform=instagram&page=${page}&limit=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    },
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Transform the unified API response to match the expected interface
  return {
    code: 200,
    message: "success",
    data: {
      tasks: data.tasks.map((task: any) => ({
        task_id: task.id,
        platform: task.platform,
        urls: task.input_data.urls || [task.input_data.url].filter(Boolean),
        monitor_interval: task.monitor_interval,
        status: task.status === "MONITORING" ? "running" : 
                task.status === "PAUSED" ? "paused" : 
                task.status === "FAILED" ? "stopped" : "stopped",
        created_at: task.created_at,
        updated_at: task.updated_at,
        next_execution_at: task.next_execution_at,
        is_user_task: task.content_type === "influencer" || task.content_type === "user",
        latest_data: task.output_data,
      })),
      total: data.total,
      current_page: data.page,
      page_size: data.limit,
    },
  };
};

const pauseTask = async (taskId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/monitor/pause`, {
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

const resumeTask = async (taskId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/monitor/resume`, {
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

const retryTask = async (taskId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/monitor/retry`, {
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

// Fetch Instagram Post History
const fetchInstagramPostHistory = async (
  page: number = 1,
  limit: number = 20,
  code?: string,
  authorNickname?: string,
  status?: string,
): Promise<PostHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (code) params.append("code", code);
  if (authorNickname) params.append("author_nickname", authorNickname);
  if (status) params.append("status", status);

  const response = await fetch(`${API_BASE_URL}/api/monitor/instagram/history/posts?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch Instagram post history";
    try {
      const error = await response.json();
      errorMessage = error.detail || error.message || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Fetch Instagram Influencer History
const fetchInstagramInfluencerHistory = async (
  page: number = 1,
  limit: number = 20,
  status?: string,
): Promise<InfluencerHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) params.append("status", status);

  const response = await fetch(`${API_BASE_URL}/api/monitor/instagram/history/influencers?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch Instagram influencer history";
    try {
      const error = await response.json();
      errorMessage = error.detail || error.message || errorMessage;
    } catch {
      errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};


export default function InstagramMonitoring() {
  // Form state
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
    useState("1h");
  const [influencerMonitoringInterval, setInfluencerMonitoringInterval] =
    useState("1h");
  
  // Real tasks state
  const [realTasks, setRealTasks] = useState<MonitoringTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  // Dialog state for stats popup
  const [selectedPost, setSelectedPost] = useState<PostHistoryData | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerHistoryData | null>(null);
  const [isInfluencerDialogOpen, setIsInfluencerDialogOpen] = useState(false);
  const [tasksPage, setTasksPage] = useState(1);
  const [tasksTotalPages, setTasksTotalPages] = useState(1);
  const [tasksFilter, setTasksFilter] = useState<"all" | "running" | "paused" | "stopped" | "completed">("all");
  
  // Post history state
  const [postHistory, setPostHistory] = useState<PostHistoryData[]>([]);
  const [postHistoryLoading, setPostHistoryLoading] = useState(false);
  const [postHistoryCache, setPostHistoryCache] = useState<{ [key: string]: PostHistoryResponse }>({});
  const [postCodeFilter, setPostCodeFilter] = useState("");
  const [postAuthorFilter, setPostAuthorFilter] = useState("");
  const [postStatusFilter, setPostStatusFilter] = useState("all");
  const [postPage, setPostPage] = useState(1);
  const [postTotal, setPostTotal] = useState(0);
  
  // Influencer history state
  const [influencerHistory, setInfluencerHistory] = useState<InfluencerHistoryData[]>([]);
  const [influencerHistoryLoading, setInfluencerHistoryLoading] = useState(false);
  const [influencerHistoryCache, setInfluencerHistoryCache] = useState<{ [key: string]: InfluencerHistoryResponse }>({});
  const [influencerStatusFilter, setInfluencerStatusFilter] = useState("all");
  const [influencerPage, setInfluencerPage] = useState(1);
  const [influencerTotal, setInfluencerTotal] = useState(0);

  // Load tasks from backend
  const loadTasks = async (page: number = 1) => {
    if (!API_TOKEN) {
      console.warn("API token not configured");
      return;
    }
    
    setTasksLoading(true);
    try {
      const response = await fetchTasks(page, 10);
      if (response.code === 200) {
        setRealTasks(response.data.tasks);
        setTasksTotalPages(Math.ceil(response.data.total / response.data.page_size));
        setTasksPage(response.data.current_page);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
      toast.error("加载监控任务失败");
    } finally {
      setTasksLoading(false);
    }
  };

  // Load post history with caching
  const loadPostHistory = async (useCache = true) => {
    const cacheKey = `posts_${postPage}_${postCodeFilter}_${postAuthorFilter}_${postStatusFilter}`;
    
    if (useCache && postHistoryCache[cacheKey]) {
      const cached = postHistoryCache[cacheKey];
      setPostHistory(cached.items);
      setPostTotal(cached.total);
      return;
    }

    setPostHistoryLoading(true);
    try {
      const response = await fetchInstagramPostHistory(
        postPage,
        20,
        postCodeFilter || undefined,
        postAuthorFilter || undefined,
        postStatusFilter === "all" ? undefined : postStatusFilter,
      );
      setPostHistory(response.items);
      setPostTotal(response.total);
      
      // Cache the response
      setPostHistoryCache(prev => ({
        ...prev,
        [cacheKey]: response
      }));
    } catch (error) {
      console.error("Failed to load post history:", error);
      toast.error(`加载内容监控数据失败: ${error.message}`);
    } finally {
      setPostHistoryLoading(false);
    }
  };

  // Load influencer history with caching
  const loadInfluencerHistory = async (useCache = true) => {
    const cacheKey = `influencers_${influencerPage}_${influencerStatusFilter}`;
    
    if (useCache && influencerHistoryCache[cacheKey]) {
      const cached = influencerHistoryCache[cacheKey];
      setInfluencerHistory(cached.items);
      setInfluencerTotal(cached.total);
      return;
    }

    setInfluencerHistoryLoading(true);
    try {
      const response = await fetchInstagramInfluencerHistory(
        influencerPage,
        20,
        influencerStatusFilter === "all" ? undefined : influencerStatusFilter,
      );
      setInfluencerHistory(response.items);
      setInfluencerTotal(response.total);
      
      // Cache the response
      setInfluencerHistoryCache(prev => ({
        ...prev,
        [cacheKey]: response
      }));
    } catch (error) {
      console.error("Failed to load influencer history:", error);
      toast.error(`加载用户监控数据失败: ${error.message}`);
    } finally {
      setInfluencerHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Load post history when filters change
  useEffect(() => {
    loadPostHistory();
  }, [postPage, postCodeFilter, postAuthorFilter, postStatusFilter]);

  // Load influencer history when filters change
  useEffect(() => {
    loadInfluencerHistory();
  }, [influencerPage, influencerStatusFilter]);

  const validateUrl = (url: string) => {
    return url.includes("instagram.com");
  };

  const isContentUrl = (url: string) => {
    return (
      url.includes("/p/") || url.includes("/reel/") || url.includes("/tv/")
    );
  };

  const processContentUrls = (urls: string) => {
    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const valid = urlList.filter(
      (url) => validateUrl(url) && isContentUrl(url),
    );
    const invalid = urlList
      .filter((url) => !validateUrl(url) || !isContentUrl(url))
      .filter((url) => url.length > 0);

    setValidContentUrls(valid);
    setInvalidContentUrls(invalid);
  };

  const processInfluencerUrls = (urls: string) => {
    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const valid = urlList.filter(
      (url) => validateUrl(url) && !isContentUrl(url),
    );
    const invalid = urlList
      .filter((url) => !validateUrl(url) || isContentUrl(url))
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
      toast.error("请输入有效的Instagram内容链接");
      return;
    }

    if (!API_TOKEN) {
      toast.error("API配置错误，请检查环境变量");
      return;
    }

    setIsAddingContent(true);

    try {
      const response = await createInstagramPostMonitoringTask(
        validContentUrls,
        contentMonitoringInterval,
      );
      
      toast.success(
        `成功创建 ${response.total_successful} 个监控任务${
          response.total_failed > 0 ? `，失败 ${response.total_failed} 个` : ""
        }`
      );
      
      if (response.failed_urls.length > 0) {
        console.warn("Failed URLs:", response.failed_urls);
        response.failed_urls.forEach(url => {
          toast.error(`失败: ${url}`);
        });
      }
      
      // Refresh the tasks list
      await loadTasks();
      
      // Clear the form
      setContentUrls("");
      setValidContentUrls([]);
      setInvalidContentUrls([]);
      setContentUploadedFile(null);
    } catch (error) {
      console.error("Error creating content monitoring task:", error);
      toast.error(`创建任务失败: ${error.message}`);
    } finally {
      setIsAddingContent(false);
    }

    // Removed processTaskQueue since we're using real API now
    /*await processTaskQueue(newTasks, setTaskQueue, (task, i) => {
      const newContentItem = {
        id: Date.now() + i,
        title: `��量添加的内容监控 ${i + 1}`,
        author: "用户名",
        url: task.url,
        thumbnail: "/api/placeholder/120/120",
        addedAt: task.addedAt,
        status: "active",
        type: task.url.includes("/reel/") ? "Reel" : "Photo",
        currentStats: {
          views: "0",
          likes: "0",
          comments: "0",
          shares: "0",
        },
        initialStats: {
          views: "0",
          likes: "0",
          comments: "0",
          shares: "0",
        },
      };
      setContentData((prev) => [newContentItem, ...prev]);
    });*/
  };

  const handleAddInfluencerBatch = async () => {
    if (validInfluencerUrls.length === 0) {
      toast.error("请输入有效的Instagram用户主页链接");
      return;
    }

    if (!API_TOKEN) {
      toast.error("API配置错误，请检查环境变量");
      return;
    }

    setIsAddingInfluencer(true);

    try {
      const response = await createInstagramUserMonitoringTask(
        validInfluencerUrls,
        influencerMonitoringInterval,
      );
      
      toast.success(
        `成功创建 ${response.total_successful} 个监控任务${
          response.total_failed > 0 ? `，失败 ${response.total_failed} 个` : ""
        }`
      );
      
      if (response.failed_urls.length > 0) {
        console.warn("Failed URLs:", response.failed_urls);
        response.failed_urls.forEach(url => {
          toast.error(`失败: ${url}`);
        });
      }
      
      // Refresh the tasks list
      await loadTasks();
      
      // Clear the form
      setInfluencerUrls("");
      setValidInfluencerUrls([]);
      setInvalidInfluencerUrls([]);
      setInfluencerUploadedFile(null);
    } catch (error) {
      console.error("Error creating influencer monitoring task:", error);
      toast.error(`创建任务失败: ${error.message}`);
    } finally {
      setIsAddingInfluencer(false);
    }

    // Removed processTaskQueue since we're using real API now
    /*await processTaskQueue(newTasks, setTaskQueue, (task, i) => {
      const newInfluencer = {
        id: Date.now() + i + 1000,
        username: `批量添加的用户 ${i + 1}`,
        avatar: "/api/placeholder/60/60",
        url: task.url,
        addedAt: task.addedAt,
        status: "active",
        verified: false,
        userType: "Personal",
        currentStats: {
          followers: "0",
          following: "0",
          works: "0",
          totalLikes: "0",
        },
        initialStats: {
          followers: "0",
          following: "0",
          works: "0",
          totalLikes: "0",
        },
        recentActivity: {
          postsThisWeek: 0,
          avgLikes: "0",
          avgComments: "0",
          engagementRate: "0%",
        },
      };
      setInfluencerData((prev) => [newInfluencer, ...prev]);
    });*/
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

  // Real task control handlers
  const handlePauseTask = async (taskId: string) => {
    try {
      await pauseTask(taskId);
      toast.success("任务已暂停");
      await loadTasks(); // Refresh tasks
    } catch (error) {
      console.error("Failed to pause task:", error);
      toast.error("暂停任务失败");
    }
  };

  const handleResumeTask = async (taskId: string) => {
    try {
      await resumeTask(taskId);
      toast.success("任务已恢复");
      await loadTasks(); // Refresh tasks
    } catch (error) {
      console.error("Failed to resume task:", error);
      toast.error("恢复任务失败");
    }
  };

  const handleRetryTask = async (taskId: string) => {
    try {
      await retryTask(taskId);
      toast.success("任务重试成功");
      await loadTasks(); // Refresh tasks
    } catch (error) {
      console.error("Failed to retry task:", error);
      toast.error("重试任务失败");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= tasksTotalPages) {
      setTasksPage(newPage);
      loadTasks(newPage);
    }
  };

  const getStatusBadgeForTask = (status: string) => {
    switch (status) {
      case "running":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            运行中
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Pause className="h-3 w-3 mr-1" />
            已暂停
          </Badge>
        );
      case "stopped":
        return (
          <Badge className="bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            已停止
          </Badge>
        );
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  const filteredTasks = realTasks.filter(task => 
    tasksFilter === "all" || task.status === tasksFilter
  );

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
    switch (type) {
      case "Reel":
        return <Video className="h-3 w-3 text-purple-500" />;
      case "Video":
        return <Play className="h-3 w-3 text-red-500" />;
      default:
        return <Image className="h-3 w-3 text-blue-500" />;
    }
  };

  const getVerificationIcon = (verified: boolean, userType: string) => {
    if (!verified) return null;

    return userType.includes("Business") || userType.includes("Brand") ? (
      <Crown className="h-3 w-3 text-yellow-500" />
    ) : (
      <Verified className="h-3 w-3 text-blue-500" />
    );
  };

  const calculateGrowth = (current: string, initial: string) => {
    const currentNum = parseFloat(
      current.replace(/[K,M]/g, "").replace(/[^\d.]/g, ""),
    );
    const initialNum = parseFloat(
      initial.replace(/[K,M]/g, "").replace(/[^\d.]/g, ""),
    );

    if (initialNum === 0) return "0%";
    const growth = ((currentNum - initialNum) / initialNum) * 100;
    return `${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`;
  };

  // Utility functions for formatting
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatGrowthPercentage = (percentage: number) => {
    if (percentage === 0) return '0%';
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  const getTaskStatusBadge = (status: string) => {
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
            <Pause className="h-3 w-3 mr-1" />
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
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Instagram监控"
      subtitle="���时监控Instagram平台的用户和内容数据变化"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            刷���数据
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Platform Info */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              📷 Instagram平台监控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="text-sm">内容监控: {postHistory.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  用户监控: {influencerHistory.length}
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
              <CheckCircle className="w-4 h-4" />
              任务列表 ({realTasks.length})
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              内容监控 ({postHistory.length})
            </TabsTrigger>
            <TabsTrigger value="influencer" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              用户监控 ({influencerHistory.length})
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
                        <SelectItem value="1m">1 分钟</SelectItem>
                        <SelectItem value="1h">1 小时</SelectItem>
                        <SelectItem value="4h">4 小时</SelectItem>
                        <SelectItem value="24h">24 小时</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-gray-500">
                      ⏰ 设置数据采集的时间间隔
                    </div>
                  </div>

                  {/* Manual Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      手动输入内容链接
                    </label>
                    <Textarea
                      placeholder="请输入Instagram内容链接，每行一个链接&#10;示例：&#10;https://www.instagram.com/p/ABC123DEF456/&#10;https://www.instagram.com/reel/DEF456GHI789/"
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
                        选择包含内容链接的文本文件
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
                          <span>有效链��: {validContentUrls.length} 个</span>
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
                        <SelectItem value="1m">1 分钟</SelectItem>
                        <SelectItem value="1h">1 小时</SelectItem>
                        <SelectItem value="4h">4 小时</SelectItem>
                        <SelectItem value="24h">24 小时</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-gray-500">
                      ⏰ 设置数据采集的时间间隔
                    </div>
                  </div>

                  {/* Manual Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      手动输入用户主页链接
                    </label>
                    <Textarea
                      placeholder="请输入Instagram用户主页链接，每行一个链接&#10;示例：&#10;https://www.instagram.com/username/"
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
                        选择包含用户主页链接的文本文件
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

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Monitor className="mr-2 h-4 w-4" />
                    内容监控列表 ({postTotal})
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    监控中:{" "}
                    {
                      postHistory.filter((item) => item.task_status === "MONITORING")
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
                        placeholder="搜索作品代码 (code)"
                        value={postCodeFilter}
                        onChange={(e) => {
                          setPostCodeFilter(e.target.value);
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPostHistory(false)}
                      className="h-8 px-3"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      刷新
                    </Button>
                  </div>
                  
                  {postHistoryLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 mx-auto animate-spin" />
                      <p className="text-sm text-muted-foreground mt-2">加载内容监控数据中...</p>
                    </div>
                  ) : postHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Monitor className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        暂无监控内容，请先添加内容链接
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
                          <div className="relative h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
                            <div className="absolute inset-0 flex items-center justify-center">
                              {post.media_type === 2 ? (
                                <Play className="h-12 w-12 text-white/80" />
                              ) : (
                                <Camera className="h-12 w-12 text-white/80" />
                              )}
                            </div>
                            
                            {/* Type Badge */}
                            <div className="absolute top-3 left-3">
                              <Badge
                                variant="secondary"
                                className="bg-white/90 text-xs flex items-center gap-1"
                              >
                                {post.media_type === 2 ? (
                                  <Video className="h-3 w-3 text-red-500" />
                                ) : (
                                  <Image className="h-3 w-3 text-blue-500" />
                                )}
                                {post.media_type === 2 ? "视频" : "图片"}
                              </Badge>
                            </div>
                            
                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                              {getTaskStatusBadge(post.task_status)}
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
                                  title={post.caption_text || 'Instagram 内容'}
                                >
                                  {post.caption_text || 'Instagram 内容'}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  by @{post.username || '未知用户'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  发布于: {post.taken_at ? new Date(post.taken_at * 1000).toLocaleDateString("zh-CN") : "未知时间"}
                                </p>
                                {post.error_message && (
                                  <p className="text-xs text-red-600 mt-1">
                                    错误: {post.error_message}
                                  </p>
                                )}
                              </div>

                              {/* Stats Grid */}
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="text-center">
                                  <div className="flex items-center justify-center mb-1">
                                    <Heart className="h-3 w-3 text-red-500" />
                                  </div>
                                  <div className="font-medium">
                                    {formatNumber(post.most_recent_counts.like_count)}
                                  </div>
                                  <div className="text-green-600 text-xs">
                                    +{post.increment_percentages.like_count_increment.toFixed(1)}%
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
                                <div className="text-xs text-muted-foreground">
                                  {post.created_at ? new Date(post.created_at).toLocaleDateString("zh-CN") : "未知时间"}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    title="查看详细数据"
                                  >
                                    <BarChart3 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    title="打开原链接"
                                    onClick={() => window.open(post.input_url, "_blank")}
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
                    用户监控列表 ({influencerTotal})
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    监控中:{" "}
                    {
                      influencerHistory.filter((item) => item.task_status === "MONITORING")
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
                      onClick={() => loadInfluencerHistory(false)}
                      className="h-8 px-3"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      刷新
                    </Button>
                  </div>
                  
                  {influencerHistoryLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 mx-auto animate-spin" />
                      <p className="text-sm text-muted-foreground mt-2">加载用户监控数据中...</p>
                    </div>
                  ) : influencerHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <UserCheck className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        暂无监控用户，请先添加用户链接
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
                          <div className="relative h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
                            <div className="absolute inset-0 flex items-center justify-center">
                              {influencer.profile_pic_url ? (
                                <img
                                  src={influencer.profile_pic_url}
                                  alt={`@${influencer.username}`}
                                  className="w-16 h-16 rounded-full border-2 border-white/30 object-cover"
                                  onError={(e) => {
                                    // Fallback to initial letter if image fails to load
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold" style={{ display: influencer.profile_pic_url ? 'none' : 'flex' }}>
                                {influencer.username.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            {/* Verification Badge */}
                            {influencer.is_verified && (
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                  <Verified className="h-3 w-3 mr-1" />
                                  已认证
                                </Badge>
                              </div>
                            )}
                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                              {getTaskStatusBadge(influencer.task_status)}
                            </div>
                          </div>

                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* User Info */}
                              <div className="text-center">
                                <h3 className="font-medium text-sm flex items-center justify-center gap-1">
                                  @{influencer.username}
                                  {influencer.is_verified && (
                                    <Verified className="h-3 w-3 text-blue-500" />
                                  )}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {influencer.biography || '无简介'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ID: {influencer.user_id}
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
                                    {formatNumber(influencer.most_recent_counts.follower_count)}
                                  </div>
                                  <div className="text-green-600 text-xs">
                                    +{influencer.increment_percentages.follower_count_increment.toFixed(1)}%
                                  </div>
                                  <div className="text-muted-foreground text-xs">粉丝</div>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center mb-1">
                                    <UserPlus className="h-3 w-3 text-green-500" />
                                  </div>
                                  <div className="font-medium">
                                    {formatNumber(influencer.most_recent_counts.following_count)}
                                  </div>
                                  <div className="text-green-600 text-xs">
                                    +{influencer.increment_percentages.following_count_increment.toFixed(1)}%
                                  </div>
                                  <div className="text-muted-foreground text-xs">关注</div>
                                </div>
                                <div className="text-center">
                                  <div className="flex items-center justify-center mb-1">
                                    <Grid className="h-3 w-3 text-purple-500" />
                                  </div>
                                  <div className="font-medium">
                                    {formatNumber(influencer.most_recent_counts.media_count)}
                                  </div>
                                  <div className="text-green-600 text-xs">
                                    +{influencer.increment_percentages.media_count_increment.toFixed(1)}%
                                  </div>
                                  <div className="text-muted-foreground text-xs">媒体</div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="text-xs text-muted-foreground">
                                  {influencer.created_at ? new Date(influencer.created_at).toLocaleDateString("zh-CN") : "未知时间"}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    title="查看详细数据"
                                  >
                                    <BarChart3 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    title="打开原链接"
                                    onClick={() => window.open(influencer.input_url, "_blank")}
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    监控任务列表 ({realTasks.length})
                  </span>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={tasksFilter}
                      onValueChange={(value: "all" | "running" | "paused" | "stopped" | "completed") => setTasksFilter(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="running">运行中</SelectItem>
                        <SelectItem value="paused">已暂停</SelectItem>
                        <SelectItem value="stopped">已停止</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadTasks()}
                      disabled={tasksLoading}
                    >
                      {tasksLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      刷新
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>加载中...</span>
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      暂无监控任务
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Status Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">监控中: {realTasks.filter(task => task.status === 'running').length}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">已暂停: {realTasks.filter(task => task.status === 'paused').length}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">已完成: {realTasks.filter(task => task.status === 'completed').length}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <X className="h-4 w-4 text-red-500" />
                        <span className="text-sm">失败: {realTasks.filter(task => task.status === 'stopped').length}</span>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>任务url</TableHead>
                          <TableHead className="w-[100px]">类型</TableHead>
                          <TableHead className="w-[100px]">监控间隔</TableHead>
                          <TableHead className="w-[100px]">状态</TableHead>
                          <TableHead className="w-[180px]">创建时间</TableHead>
                          <TableHead className="w-[180px]">下次执行</TableHead>
                          <TableHead className="w-[100px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.map((task) => (
                          <TableRow key={task.task_id}>
                            <TableCell className="text-sm">
                              <a
                                href={task.urls[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate block max-w-[300px]"
                                title={task.urls[0]}
                              >
                                {task.urls[0]}
                              </a>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {task.is_user_task ? "用户监控" : "内容监控"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {task.monitor_interval}
                            </TableCell>
                            <TableCell>{getStatusBadgeForTask(task.status)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(task.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {task.next_execution_at ? new Date(task.next_execution_at).toLocaleString() : '-'}
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="flex items-center justify-center">
                                {task.status === "running" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePauseTask(task.task_id)}
                                    className="h-7 text-xs px-3 bg-white border-black text-black hover:bg-black hover:text-white"
                                  >
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    暂停
                                  </Button>
                                ) : task.status === "paused" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleResumeTask(task.task_id)}
                                    className="h-7 text-xs px-3 bg-white border-black text-black hover:bg-black hover:text-white"
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    恢复
                                  </Button>
                                ) : task.status === "stopped" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRetryTask(task.task_id)}
                                    className="h-7 text-xs px-3 bg-white border-black text-black hover:bg-black hover:text-white"
                                  >
                                    <RotateCcw className="h-3 w-3 mr-1" />
                                    重试
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(task.urls[0], "_blank")}
                                    className="h-7 text-xs"
                                    title="查看链接"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {tasksTotalPages > 1 && (
                      <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-muted-foreground">
                          第 {tasksPage} 页，共 {tasksTotalPages} 页
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(tasksPage - 1)}
                            disabled={tasksPage <= 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            上一页
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(tasksPage + 1)}
                            disabled={tasksPage >= tasksTotalPages}
                          >
                            下一页
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
              内容趋势分析
            </DialogTitle>
            <DialogDescription className="text-sm">
              内容数据趋势变化分析
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
              用户趋势分析
            </DialogTitle>
            <DialogDescription className="text-sm">
              用户数据趋势变化分析
            </DialogDescription>
          </DialogHeader>
          {selectedInfluencer && <InfluencerTrendChart influencer={selectedInfluencer} />}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// Interactive Scatter Plot Component for Instagram Post Trends
function PostTrendChart({ post }: { post: PostHistoryData }) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    like_count: true,
    comment_count: true, 
    share_count: true,
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
    like_count: item.like_count,
    comment_count: item.comment_count,
    share_count: item.share_count,
  }));

  // Metric configurations for Instagram
  const metrics = [
    { key: 'like_count', label: '点赞数', color: '#EF4444', icon: Heart },
    { key: 'comment_count', label: '评论数', color: '#10B981', icon: MessageCircle },
    { key: 'share_count', label: '分享数', color: '#8B5CF6', icon: Share2 },
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
      <div className="grid grid-cols-3 gap-4 pt-2 border-t">
        {metrics.map((metric) => {
          if (!visibleMetrics[metric.key]) return null;
          const stats = getStatistics(metric.key);
          const Icon = metric.icon;
          
          return (
            <div key={metric.key} className="text-center space-y-1">
              <div className="flex items-center justify-center">
                <Icon className="h-3 w-3 mr-1" style={{ color: metric.color }} />
                <span className="text-xs font-medium" style={{ color: metric.color }}>
                  {metric.label}
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div>最高: {stats.max.toLocaleString()}</div>
                <div>最低: {stats.min.toLocaleString()}</div>
                <div>平均: {stats.avg.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Interactive Scatter Plot Component for Instagram Influencer Trends  
function InfluencerTrendChart({ influencer }: { influencer: InfluencerHistoryData }) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    follower_count: true,
    following_count: true, 
    media_count: true,
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
    media_count: item.media_count,
  }));

  // Metric configurations for Instagram Influencers
  const metrics = [
    { key: 'follower_count', label: '粉丝数', color: '#3B82F6', icon: Users },
    { key: 'following_count', label: '关注数', color: '#10B981', icon: UserPlus },
    { key: 'media_count', label: '媒体数', color: '#8B5CF6', icon: Grid },
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
      <div className="grid grid-cols-3 gap-4 pt-2 border-t">
        {metrics.map((metric) => {
          if (!visibleMetrics[metric.key]) return null;
          const stats = getStatistics(metric.key);
          const Icon = metric.icon;
          
          return (
            <div key={metric.key} className="text-center space-y-1">
              <div className="flex items-center justify-center">
                <Icon className="h-3 w-3 mr-1" style={{ color: metric.color }} />
                <span className="text-xs font-medium" style={{ color: metric.color }}>
                  {metric.label}
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div>最高: {stats.max.toLocaleString()}</div>
                <div>最低: {stats.min.toLocaleString()}</div>
                <div>平均: {stats.avg.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
