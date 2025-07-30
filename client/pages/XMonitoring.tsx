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
import { Checkbox } from "@/components/ui/checkbox";
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
  Twitter,
  Repeat2,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Pause,
  RotateCcw,
  Quote,
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
import { toast } from "sonner";

// Utility function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const API_TOKEN = import.meta.env.VITE_BACKEND_API_TOKEN;

// Interfaces
interface CreateMonitoringTaskResponse {
  total_successful: number;
  total_failed: number;
  failed_urls: string[];
  successful_tasks: {
    [url: string]: string;
  };
}

// Post history interfaces
interface PostHistoryItem {
  task_id: string;
  task_status: string;
  monitor_interval: string;
  created_at: string;
  next_execution_at: string;
  tweet_id: string;
  input_url: string;
  error_message: string | null;
  text: string;
  created_time: string;
  author_screen_name: string;
  author_blue_verified: boolean;
  display_url: string;
  expanded_url: string;
  images_url: string[];
  video_url: string;
  most_recent_counts: {
    like_count: number;
    retweet_count: number;
    bookmarks_count: number;
    quotes_count: number;
    replies_count: number;
    view_count: number;
  };
  increment_percentages: {
    like_count_increment: number;
    retweet_count_increment: number;
    bookmarks_count_increment: number;
    quotes_count_increment: number;
    replies_count_increment: number;
    view_count_increment: number;
  };
  history: Array<{
    created_at: string;
    like_count: number;
    retweet_count: number;
    bookmarks_count: number;
    quotes_count: number;
    replies_count: number;
    view_count: number;
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
  username: string;
  input_url: string;
  error_message: string | null;
  rest_id: string;
  screen_name: string;
  name: string;
  desc: string;
  user_avatar: string;
  blue_verified: boolean;
  account_created: string;
  most_recent_counts: {
    friends_count: number;
    follower_count: number;
    tweet_count: number;
    media_count: number;
  };
  increment_percentages: {
    friends_count_increment: number;
    follower_count_increment: number;
    tweet_count_increment: number;
    media_count_increment: number;
  };
  history: Array<{
    created_at: string;
    friends_count: number;
    follower_count: number;
    tweet_count: number;
    media_count: number;
  }>;
}

interface InfluencerHistoryResponse {
  items: InfluencerHistoryItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface MonitoringTask {
  task_id: string;
  platform: string;
  urls: string[];
  monitor_interval: string;
  status: "running" | "paused" | "stopped";
  created_at: string;
  updated_at: string;
  next_execution_at?: string;
  is_user_task: boolean;
  latest_data?: any;
  content_type?: string;
  input_data?: {
    url?: string;
    urls?: string[];
  };
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

// API Functions
const createXPostMonitoringTask = async (
  urls: string[],
  monitorInterval: string,
): Promise<CreateMonitoringTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/monitor/x/post/create`, {
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

const createXUserMonitoringTask = async (
  urls: string[],
  monitorInterval: string,
): Promise<CreateMonitoringTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/monitor/x/user/create`, {
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

const fetchTasks = async (page: number = 1, pageSize: number = 10): Promise<TaskListResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/monitor/tasks?platform=x&page=${page}&limit=${pageSize}`,
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

// Fetch post history API function
const fetchPostHistory = async (
  page: number = 1,
  limit: number = 20,
  tweetId?: string,
  authorNickname?: string,
  status?: string,
): Promise<PostHistoryResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (tweetId) params.append('tweet_id', tweetId);
  if (authorNickname) params.append('author_nickname', authorNickname);
  if (status) params.append('status', status);
  
  const response = await fetch(`${API_BASE_URL}/api/monitor/x/history/posts?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
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
  
  if (status) params.append('status', status);
  
  const response = await fetch(`${API_BASE_URL}/api/monitor/x/history/influencers?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Sample monitoring data for X content
const mockContentData = [
  {
    id: 1,
    title:
      "Breaking: Major breakthrough in AI research announced at tech conference 🚀",
    author: "TechNewsDaily",
    url: "https://x.com/TechNewsDaily/status/1234567890123456789",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-15 10:30",
    status: "active",
    type: "Tweet",
    currentStats: {
      views: "125.8K",
      likes: "3.2K",
      comments: "456",
      shares: "892",
    },
    initialStats: {
      views: "98.5K",
      likes: "2.8K",
      comments: "389",
      shares: "634",
    },
  },
  {
    id: 2,
    title:
      "Thread: The future of remote work - what experts predict for 2024 and beyond 🧵",
    author: "WorkTrends",
    url: "https://x.com/WorkTrends/status/2345678901234567890",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-14 16:20",
    status: "active",
    type: "Thread",
    currentStats: {
      views: "89.3K",
      likes: "2.1K",
      comments: "234",
      shares: "567",
    },
    initialStats: {
      views: "67.8K",
      likes: "1.7K",
      comments: "178",
      shares: "423",
    },
  },
  {
    id: 3,
    title:
      "Just launched our new product! Thanks to everyone who supported us 🎉",
    author: "StartupCo",
    url: "https://x.com/StartupCo/status/3456789012345678901",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-13 14:15",
    status: "active",
    type: "Tweet",
    currentStats: {
      views: "67.5K",
      likes: "1.8K",
      comments: "156",
      shares: "289",
    },
    initialStats: {
      views: "52.3K",
      likes: "1.4K",
      comments: "123",
      shares: "201",
    },
  },
];

// Sample monitoring data for X influencers
const mockInfluencerData = [
  {
    id: 1,
    username: "TechNewsDaily",
    avatar: "/api/placeholder/60/60",
    url: "https://x.com/TechNewsDaily",
    addedAt: "2024-01-15 10:30",
    status: "active",
    verified: true,
    userType: "Media",
    currentStats: {
      followers: "234.5K",
      following: "1.2K",
      works: "5.8K",
      totalLikes: "1.2M",
    },
    initialStats: {
      followers: "228.9K",
      following: "1.18K",
      works: "5.75K",
      totalLikes: "1.15M",
    },
    recentActivity: {
      postsThisWeek: 12,
      avgLikes: "3.2K",
      avgComments: "456",
      engagementRate: "1.8%",
    },
  },
  {
    id: 2,
    username: "WorkTrends",
    avatar: "/api/placeholder/60/60",
    url: "https://x.com/WorkTrends",
    addedAt: "2024-01-14 16:20",
    status: "active",
    verified: false,
    userType: "Business",
    currentStats: {
      followers: "89.7K",
      following: "567",
      works: "3.2K",
      totalLikes: "567K",
    },
    initialStats: {
      followers: "86.4K",
      following: "542",
      works: "3.15K",
      totalLikes: "545K",
    },
    recentActivity: {
      postsThisWeek: 8,
      avgLikes: "2.1K",
      avgComments: "234",
      engagementRate: "2.6%",
    },
  },
  {
    id: 3,
    username: "StartupCo",
    avatar: "/api/placeholder/60/60",
    url: "https://x.com/StartupCo",
    addedAt: "2024-01-13 14:15",
    status: "active",
    verified: true,
    userType: "Organization",
    currentStats: {
      followers: "45.8K",
      following: "234",
      works: "892",
      totalLikes: "234K",
    },
    initialStats: {
      followers: "43.2K",
      following: "229",
      works: "878",
      totalLikes: "221K",
    },
    recentActivity: {
      postsThisWeek: 5,
      avgLikes: "1.8K",
      avgComments: "156",
      engagementRate: "4.2%",
    },
  },
];

export default function XMonitoring() {
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
  const [tasksPage, setTasksPage] = useState(1);
  const [tasksTotalPages, setTasksTotalPages] = useState(1);
  const [tasksFilter, setTasksFilter] = useState<"all" | "running" | "paused" | "stopped">("all");
  
  // Post history state
  const [postHistory, setPostHistory] = useState<PostHistoryItem[]>([]);
  const [postHistoryLoading, setPostHistoryLoading] = useState(false);
  const [postHistoryCache, setPostHistoryCache] = useState<Record<string, PostHistoryItem[]>>({});
  const [postFilter, setPostFilter] = useState<"all" | "active" | "inactive">("all");
  const [postAuthorFilter, setPostAuthorFilter] = useState("");
  
  // Influencer history state  
  const [influencerHistory, setInfluencerHistory] = useState<InfluencerHistoryItem[]>([]);
  const [influencerHistoryLoading, setInfluencerHistoryLoading] = useState(false);
  const [influencerHistoryCache, setInfluencerHistoryCache] = useState<Record<string, InfluencerHistoryItem[]>>({});
  const [influencerFilter, setInfluencerFilter] = useState<"all" | "verified" | "unverified">("all");
  const [influencerNameFilter, setInfluencerNameFilter] = useState("");
  
  // Active tab state
  const [activeTab, setActiveTab] = useState("add");
  
  // Dialog states for stats popups
  const [selectedPost, setSelectedPost] = useState<PostHistoryItem | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerHistoryItem | null>(null);
  const [isInfluencerDialogOpen, setIsInfluencerDialogOpen] = useState(false);

  // Load tasks from backend
  const loadTasks = async (page: number = 1) => {
    if (!API_TOKEN) {
      console.warn("API token not configured");
      toast.error("API配置错误，请检查环境变量");
      return;
    }
    
    console.log("Loading tasks from backend...");
    setTasksLoading(true);
    try {
      const response = await fetchTasks(page, 10);
      console.log("Tasks response:", response);
      
      if (response.code === 200) {
        console.log("Found", response.data.tasks.length, "tasks");
        setRealTasks(response.data.tasks);
        setTasksTotalPages(Math.ceil(response.data.total / response.data.page_size));
        setTasksPage(response.data.current_page);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
      toast.error(`加载监控任务失败: ${error.message}`);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    console.log("Component mounted, loading tasks...");
    loadTasks();
  }, []);
  
  // Load post history from backend
  const loadPostHistory = async (useCache: boolean = true) => {
    const cacheKey = `posts-${postFilter}-${postAuthorFilter}`;
    
    // Check cache first
    if (useCache && postHistoryCache[cacheKey]) {
      console.log("Using cached post history data");
      setPostHistory(postHistoryCache[cacheKey]);
      return;
    }
    
    if (!API_TOKEN) {
      console.warn("API token not configured");
      toast.error("API配置错误，请检查环境变量");
      return;
    }
    
    console.log("Loading post history from API...");
    setPostHistoryLoading(true);
    try {
      // Call the API to get all post history data
      console.log("Calling fetchPostHistory with filters:", {
        authorNickname: postAuthorFilter || undefined,
        status: postFilter === "all" ? undefined : "MONITORING"
      });
      
      const response = await fetchPostHistory(
        1, // page
        20, // limit
        undefined, // tweet_id - we get all posts
        postAuthorFilter || undefined, // author_nickname filter
        postFilter === "all" ? undefined : "MONITORING" // status filter
      );
      
      console.log("Post history response:", response);
      
      let filteredData = response.items || [];
      
      // Additional client-side filtering if needed
      // (Server already handles most filtering via query params)
      
      setPostHistory(filteredData);
      console.log("Set post history data:", filteredData);
      
      // Update cache
      setPostHistoryCache(prev => ({
        ...prev,
        [cacheKey]: filteredData
      }));
      
    } catch (error) {
      console.error("Failed to load post history:", error);
      toast.error(`加载推文历史数据失败: ${error.message}`);
    } finally {
      setPostHistoryLoading(false);
    }
  };
  
  // Load influencer history from backend
  const loadInfluencerHistory = async (useCache: boolean = true) => {
    const cacheKey = `influencers-${influencerFilter}-${influencerNameFilter}`;
    
    // Check cache first
    if (useCache && influencerHistoryCache[cacheKey]) {
      console.log("Using cached influencer history data");
      setInfluencerHistory(influencerHistoryCache[cacheKey]);
      return;
    }
    
    if (!API_TOKEN) {
      console.warn("API token not configured");
      toast.error("API配置错误，请检查环境变量");
      return;
    }
    
    console.log("Loading influencer history from API...");
    setInfluencerHistoryLoading(true);
    try {
      // Call the API to get all influencer history data
      console.log("Calling fetchInfluencerHistory with filters:", {
        status: influencerFilter === "all" ? undefined : "MONITORING"
      });
      
      const response = await fetchInfluencerHistory(
        1, // page
        20, // limit
        influencerFilter === "all" ? undefined : "MONITORING" // status filter
      );
      
      console.log("Influencer history response:", response);
      
      let filteredData = response.items || [];
      
      // Apply client-side filters
      if (influencerFilter === "verified") {
        filteredData = filteredData.filter(item => item.blue_verified);
      } else if (influencerFilter === "unverified") {
        filteredData = filteredData.filter(item => !item.blue_verified);
      }
      
      if (influencerNameFilter) {
        filteredData = filteredData.filter(item => 
          item.screen_name.toLowerCase().includes(influencerNameFilter.toLowerCase()) ||
          item.name.toLowerCase().includes(influencerNameFilter.toLowerCase())
        );
      }
      
      setInfluencerHistory(filteredData);
      console.log("Set influencer history data:", filteredData);
      
      // Update cache
      setInfluencerHistoryCache(prev => ({
        ...prev,
        [cacheKey]: filteredData
      }));
      
    } catch (error) {
      console.error("Failed to load influencer history:", error);
      toast.error(`加载用户历史数据失败: ${error.message}`);
    } finally {
      setInfluencerHistoryLoading(false);
    }
  };
  
  // Load history data when filters change
  useEffect(() => {
    if (realTasks.length > 0 && activeTab === "content") {
      loadPostHistory(false); // Don't use cache when filters change
    }
  }, [postFilter, postAuthorFilter, realTasks, activeTab]);
  
  useEffect(() => {
    if (realTasks.length > 0 && activeTab === "influencer") {
      loadInfluencerHistory(false); // Don't use cache when filters change
    }
  }, [influencerFilter, influencerNameFilter, realTasks, activeTab]);
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Load data when switching to content or influencer tabs
    if (tab === "content") {
      console.log("Switching to content tab, loading post history");
      loadPostHistory(true); // Use cache on first load
    } else if (tab === "influencer") {
      console.log("Switching to influencer tab, loading influencer history");
      loadInfluencerHistory(true); // Use cache on first load
    }
  };

  const validateUrl = (url: string) => {
    return url.includes("x.com") || url.includes("twitter.com");
  };

  const isContentUrl = (url: string) => {
    return url.includes("/status/");
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
      toast.error("请输入有效的X推文链接");
      return;
    }

    if (!API_TOKEN) {
      toast.error("API配置错误，请检查环境变量");
      return;
    }

    setIsAddingContent(true);

    try {
      const response = await createXPostMonitoringTask(
        validContentUrls,
        contentMonitoringInterval,
      );
      
      if (response.total_successful > 0) {
        const taskIds = Object.values(response.successful_tasks);
        toast.success(`成功创建 ${response.total_successful} 个监控任务！`);
        
        if (response.total_failed > 0) {
          toast.warning(`${response.total_failed} 个URL创建失败: ${response.failed_urls.join(', ')}`);
        }
        
        // Refresh the tasks list
        await loadTasks();
        
        // Clear the form
        setContentUrls("");
        setValidContentUrls([]);
        setInvalidContentUrls([]);
        setContentUploadedFile(null);
      } else {
        toast.error(`创建任务失败: ${response.failed_urls.join(', ')}`);
      }
    } catch (error) {
      console.error("Error creating content monitoring task:", error);
      toast.error("创建任务失败，请检查网络连接和API配置");
    } finally {
      setIsAddingContent(false);
    }
  };

  const handleAddInfluencerBatch = async () => {
    if (validInfluencerUrls.length === 0) {
      toast.error("请输入有效的X用户主页链接");
      return;
    }

    if (!API_TOKEN) {
      toast.error("API配置错误，请检查环境变量");
      return;
    }

    setIsAddingInfluencer(true);

    try {
      const response = await createXUserMonitoringTask(
        validInfluencerUrls,
        influencerMonitoringInterval,
      );
      
      if (response.total_successful > 0) {
        const taskIds = Object.values(response.successful_tasks);
        toast.success(`成功创建 ${response.total_successful} 个监控任务！`);
        
        if (response.total_failed > 0) {
          toast.warning(`${response.total_failed} 个URL创建失败: ${response.failed_urls.join(', ')}`);
        }
        
        // Refresh the tasks list
        await loadTasks();
        
        // Clear the form
        setInfluencerUrls("");
        setValidInfluencerUrls([]);
        setInvalidInfluencerUrls([]);
        setInfluencerUploadedFile(null);
      } else {
        toast.error(`创建任务失败: ${response.failed_urls.join(', ')}`);
      }
    } catch (error) {
      console.error("Error creating influencer monitoring task:", error);
      toast.error("创建任务失败，请检查网络连接和API配置");
    } finally {
      setIsAddingInfluencer(false);
    }
  };

  const handleRemoveContent = (id: number) => {
    if (confirm("确定要停止监控这个推文吗？")) {
      setContentData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleRemoveInfluencer = (id: number) => {
    if (confirm("确定要停止监控这个用户吗？")) {
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
  
  const filteredPostHistory = postHistory.filter(post => {
    if (postFilter === "all") return true;
    // Add additional filtering logic based on your needs
    return true;
  });
  
  const filteredInfluencerHistory = influencerHistory.filter(influencer => {
    if (influencerFilter === "verified" && !influencer.blue_verified) return false;
    if (influencerFilter === "unverified" && influencer.blue_verified) return false;
    return true;
  });

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
      case "Thread":
        return <MessageCircle className="h-3 w-3 text-blue-500" />;
      default:
        return <Twitter className="h-3 w-3 text-blue-500" />;
    }
  };

  const getVerificationIcon = (verified: boolean, userType: string) => {
    if (!verified) return null;

    return userType.includes("Organization") ||
      userType.includes("Business") ? (
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
  
  const getGrowthColor = (increment: number): string => {
    if (increment > 0) return "text-green-600";
    if (increment < 0) return "text-red-600";
    return "text-gray-500";
  };
  
  const getGrowthIcon = (increment: number) => {
    if (increment > 0) return "↗️";
    if (increment < 0) return "↘️";
    return "➡️";
  };

  return (
    <DashboardLayout
      title="X(Twitter)监控"
      subtitle="实时监控X平台的用户和推文数据变化"
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
              🐦 X(Twitter)平台监控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="text-sm">推文监控: {postHistory.length}</span>
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

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
              推文监控 ({postHistory.length})
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
                        <SelectItem value="1min">1 分钟</SelectItem>
                        <SelectItem value="1hour">1 小时</SelectItem>
                        <SelectItem value="4hours">4 小时</SelectItem>
                        <SelectItem value="24hours">24 小时</SelectItem>
                        <SelectItem value="7days">7 天</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-gray-500">
                      ⏰ 设置数据采集的时间间隔
                    </div>
                  </div>

                  {/* Manual Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      手动输入推文链接
                    </label>
                    <Textarea
                      placeholder="请输入X推文链接，每行一个链接&#10;示例：&#10;https://x.com/username/status/1234567890123456789&#10;https://twitter.com/username/status/1234567890123456789"
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
                        选择包含推文链接的文本文件
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
                        <SelectItem value="1min">1 分钟</SelectItem>
                        <SelectItem value="1hour">1 小时</SelectItem>
                        <SelectItem value="4hours">4 小时</SelectItem>
                        <SelectItem value="24hours">24 小时</SelectItem>
                        <SelectItem value="7days">7 天</SelectItem>
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
                      placeholder="请输入X用户主页链接，每行一个链接&#10;示例：&#10;https://x.com/username&#10;https://twitter.com/username"
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
                    推文监控列表 ({postHistory.length})
                  </span>
                  <div className="flex items-center space-x-2">
                    <Select value={postFilter} onValueChange={(value: "all" | "active" | "inactive") => setPostFilter(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="active">活跃</SelectItem>
                        <SelectItem value="inactive">非活跃</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="搜索作者..."
                      value={postAuthorFilter}
                      onChange={(e) => setPostAuthorFilter(e.target.value)}
                      className="w-32"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadPostHistory(false)}
                      disabled={postHistoryLoading}
                    >
                      {postHistoryLoading ? (
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
                {postHistoryLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>加载中...</span>
                  </div>
                ) : filteredPostHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Monitor className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {realTasks.length === 0 
                        ? "暂无监控任务，请先在'添加监控'选项卡中添加推文链接" 
                        : "暂无推文监控数据，请等待数据采集或检查API配置"
                      }
                    </p>
                    {realTasks.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        已找到 {realTasks.length} 个监控任务，但无法获取历史数据
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPostHistory.map((post) => (
                      <Card
                        key={post.tweet_id}
                        className="group hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
                        onClick={() => {
                          setSelectedPost(post);
                          setIsPostDialogOpen(true);
                        }}
                      >
                        {/* Content Image/Thumbnail */}
                        <div className="relative h-48 bg-gradient-to-br from-black via-gray-800 to-blue-900">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Twitter className="h-12 w-12 text-white/80" />
                          </div>
                          {/* Type Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge
                              variant="secondary"
                              className="bg-white/90 text-xs flex items-center gap-1"
                            >
                              <Twitter className="h-3 w-3 text-blue-500" />
                              推文
                            </Badge>
                          </div>
                          {/* Verification Badge */}
                          {post.author_blue_verified && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-blue-100 text-blue-800">
                                <Verified className="h-3 w-3 mr-1" />
                                已验证
                              </Badge>
                            </div>
                          )}
                          {/* Growth Indicator */}
                          <div className="absolute bottom-3 right-3">
                            <div className={`bg-white/90 rounded-full px-2 py-1 text-xs font-medium ${
                              post.increment_percentages.like_count_increment > 0 ? 'text-green-600' : 
                              post.increment_percentages.like_count_increment < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {getGrowthIcon(post.increment_percentages.like_count_increment)} 点赞{post.increment_percentages.like_count_increment > 0 ? '增长' : post.increment_percentages.like_count_increment < 0 ? '下降' : '稳定'}
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          {/* Content Info */}
                          <div className="space-y-3">
                            <div>
                              <h3
                                className="font-medium text-sm line-clamp-2 leading-tight"
                                title={post.text}
                              >
                                {post.text}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                by @{post.author_screen_name}
                                {post.author_blue_verified && <Verified className="h-3 w-3 text-blue-500" />}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                发布于 {post.created_time ? new Date(parseInt(post.created_time)).toLocaleString() : '未知时间'}
                              </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Eye className="h-3 w-3 text-blue-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(post.most_recent_counts.view_count)}
                                </div>
                                <div className={`text-xs ${getGrowthColor(post.increment_percentages.view_count_increment)}`}>
                                  {post.increment_percentages.view_count_increment > 0 ? '+' : ''}
                                  {post.increment_percentages.view_count_increment.toFixed(1)}%
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Heart className="h-3 w-3 text-red-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(post.most_recent_counts.like_count)}
                                </div>
                                <div className={`text-xs ${getGrowthColor(post.increment_percentages.like_count_increment)}`}>
                                  {post.increment_percentages.like_count_increment > 0 ? '+' : ''}
                                  {post.increment_percentages.like_count_increment.toFixed(1)}%
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Repeat2 className="h-3 w-3 text-green-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(post.most_recent_counts.retweet_count)}
                                </div>
                                <div className={`text-xs ${getGrowthColor(post.increment_percentages.retweet_count_increment)}`}>
                                  {post.increment_percentages.retweet_count_increment > 0 ? '+' : ''}
                                  {post.increment_percentages.retweet_count_increment.toFixed(1)}%
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center space-x-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      title="查看趋势"
                                    >
                                      <BarChart3 className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>推文监控趋势</DialogTitle>
                                      <DialogDescription>
                                        @{post.author_screen_name} 的推文 - X(Twitter)
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <div className="text-center text-gray-500">
                                        📊 趋势图表开发中...
                                        <br />
                                        <span className="text-sm">
                                          将显示浏览量、点赞数、转发数的时间趋势变化
                                        </span>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="打开原链接"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`https://x.com/${post.author_screen_name}/status/${post.tweet_id}`, "_blank");
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                title="删除监控"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('确定要停止监控这个推文吗？')) {
                                    // TODO: Implement remove post monitoring
                                    toast.success('监控已停止');
                                  }
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="influencer" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <UserCheck className="mr-2 h-4 w-4" />
                    用户监控列表 ({influencerHistory.length})
                  </span>
                  <div className="flex items-center space-x-2">
                    <Select value={influencerFilter} onValueChange={(value: "all" | "verified" | "unverified") => setInfluencerFilter(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部用户</SelectItem>
                        <SelectItem value="verified">已验证</SelectItem>
                        <SelectItem value="unverified">未验证</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="搜索用户名..."
                      value={influencerNameFilter}
                      onChange={(e) => setInfluencerNameFilter(e.target.value)}
                      className="w-32"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadInfluencerHistory(false)}
                      disabled={influencerHistoryLoading}
                    >
                      {influencerHistoryLoading ? (
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
                {influencerHistoryLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>加载中...</span>
                  </div>
                ) : filteredInfluencerHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {realTasks.length === 0 
                        ? "暂无监控任务，请先在'添加监控'选项卡中添加用户链接" 
                        : "暂无用户监控数据，请等待数据采集或检查API配置"
                      }
                    </p>
                    {realTasks.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        已找到 {realTasks.length} 个监控任务，但无法获取历史数据
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInfluencerHistory.map((influencer) => (
                      <Card
                        key={influencer.user_id}
                        className="group hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
                        onClick={() => {
                          setSelectedInfluencer(influencer);
                          setIsInfluencerDialogOpen(true);
                        }}
                      >
                        {/* User Profile Header */}
                        <div className="relative h-32 bg-gradient-to-br from-black via-gray-800 to-blue-900">
                          <div className="absolute inset-0 flex items-center justify-center">
                            {influencer.user_avatar ? (
                              <img 
                                src={influencer.user_avatar} 
                                alt={influencer.name}
                                className="w-16 h-16 rounded-full border-2 border-white/20"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold" style={{display: influencer.user_avatar ? 'none' : 'flex'}}>
                              {influencer.screen_name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          {/* Verification Badge */}
                          {influencer.blue_verified && (
                            <div className="absolute top-3 right-3">
                              <Verified className="h-4 w-4 text-blue-500 bg-white rounded-full p-1" />
                            </div>
                          )}
                          {/* Growth Indicator */}
                          <div className="absolute bottom-3 right-3">
                            <div className={`bg-white/90 rounded-full px-2 py-1 text-xs font-medium ${
                              influencer.increment_percentages.follower_count_increment > 0 ? 'text-green-600' : 
                              influencer.increment_percentages.follower_count_increment < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {getGrowthIcon(influencer.increment_percentages.follower_count_increment)} 粉丝{influencer.increment_percentages.follower_count_increment > 0 ? '增长' : influencer.increment_percentages.follower_count_increment < 0 ? '下降' : '稳定'}
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* User Info */}
                            <div className="text-center">
                              <h3 className="font-medium text-sm flex items-center justify-center gap-1">
                                @{influencer.screen_name}
                                {influencer.blue_verified && <Verified className="h-3 w-3 text-blue-500" />}
                              </h3>
                              <p className="text-xs font-medium text-gray-700 mt-1">
                                {influencer.name}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2" title={influencer.desc}>
                                {influencer.desc || '暂无简介'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                注册于 {influencer.account_created ? new Date(influencer.account_created).toLocaleDateString() : '未知时间'}
                              </p>
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
                                <div className={`text-xs ${getGrowthColor(influencer.increment_percentages.follower_count_increment)}`}>
                                  {influencer.increment_percentages.follower_count_increment > 0 ? '+' : ''}
                                  {influencer.increment_percentages.follower_count_increment.toFixed(1)}%
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Twitter className="h-3 w-3 text-blue-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(influencer.most_recent_counts.tweet_count)}
                                </div>
                                <div className={`text-xs ${getGrowthColor(influencer.increment_percentages.tweet_count_increment)}`}>
                                  {influencer.increment_percentages.tweet_count_increment > 0 ? '+' : ''}
                                  {influencer.increment_percentages.tweet_count_increment.toFixed(1)}%
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Heart className="h-3 w-3 text-red-500" />
                                </div>
                                <div className="font-medium">
                                  {formatNumber(influencer.most_recent_counts.media_count)}
                                </div>
                                <div className={`text-xs ${getGrowthColor(influencer.increment_percentages.media_count_increment)}`}>
                                  {influencer.increment_percentages.media_count_increment > 0 ? '+' : ''}
                                  {influencer.increment_percentages.media_count_increment.toFixed(1)}%
                                </div>
                              </div>
                            </div>

                            {/* Additional Stats */}
                            <div className="text-center pt-2 border-t">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <div className="text-muted-foreground">关注</div>
                                  <div className="font-medium">{formatNumber(influencer.most_recent_counts.friends_count)}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">媒体</div>
                                  <div className="font-medium">{formatNumber(influencer.most_recent_counts.media_count)}</div>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center space-x-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      title="查看趋势"
                                    >
                                      <BarChart3 className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>用户监控趋势</DialogTitle>
                                      <DialogDescription>
                                        @{influencer.screen_name} - X(Twitter)
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <div className="text-center text-gray-500">
                                        📊 趋势图表开发中...
                                        <br />
                                        <span className="text-sm">
                                          将显示粉丝数、推文数、获赞总数的时间趋势变化
                                        </span>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="打开原链接"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`https://x.com/${influencer.screen_name}`, "_blank");
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                title="删除监控"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('确定要停止监控这个用户吗？')) {
                                    // TODO: Implement remove influencer monitoring
                                    toast.success('监控已停止');
                                  }
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
                      onValueChange={(value: "all" | "running" | "paused" | "stopped") => setTasksFilter(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="running">运行中</SelectItem>
                        <SelectItem value="paused">已暂停</SelectItem>
                        <SelectItem value="stopped">已停止</SelectItem>
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
                        <span className="text-sm">已完成: {realTasks.filter(task => task.status === 'stopped').length}</span>
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
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {task.urls.slice(0, 2).map((url, index) => (
                                  <a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-xs"
                                  >
                                    {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                                  </a>
                                ))}
                                {task.urls.length > 2 && (
                                  <span className="text-gray-500 text-xs">
                                    +{task.urls.length - 2} more
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {task.is_user_task ? "用户监控" : "推文监控"}
                              </Badge>
                            </TableCell>
                            <TableCell>{task.monitor_interval}分钟</TableCell>
                            <TableCell>
                              {task.status === "running" ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  监控中
                                </Badge>
                              ) : task.status === "paused" ? (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  已暂停
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                                  <X className="h-3 w-3 mr-1" />
                                  已停止
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {task.next_execution_at ? (
                                new Date(task.next_execution_at).toLocaleString()
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
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
              推文趋势分析
            </DialogTitle>
            <DialogDescription className="text-sm">
              推文数据趋势变化分析
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

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label, metrics }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry: any) => {
          const metric = metrics.find((m: any) => m.key === entry.dataKey);
          if (!metric) return null;
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

// Interactive Trend Chart Component for X Posts
function PostTrendChart({ post }: { post: PostHistoryItem }) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    view_count: true,
    like_count: true,
    retweet_count: true,
    replies_count: true,
    quotes_count: true,
    bookmarks_count: true,
  });
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null);

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
    retweet_count: item.retweet_count,
    replies_count: item.replies_count,
    quotes_count: item.quotes_count,
    bookmarks_count: item.bookmarks_count,
  }));

  // Metric configurations
  const metrics = [
    { key: 'view_count', label: '浏览量', color: '#3B82F6', icon: Eye },
    { key: 'like_count', label: '点赞数', color: '#EF4444', icon: Heart },
    { key: 'retweet_count', label: '转发数', color: '#10B981', icon: Repeat2 },
    { key: 'replies_count', label: '回复数', color: '#8B5CF6', icon: MessageCircle },
    { key: 'quotes_count', label: '引用数', color: '#F59E0B', icon: Quote },
    { key: 'bookmarks_count', label: '收藏数', color: '#6B7280', icon: Bookmark },
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

  // Handle metric highlighting
  const handleMetricHighlight = (metricKey: string) => {
    setHighlightedMetric(highlightedMetric === metricKey ? null : metricKey);
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
            <Tooltip content={<CustomTooltip metrics={metrics} />} />
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
                    <span className="text-gray-600">最大值:</span>
                    <span>{formatNumber(stats.max)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">平均值:</span>
                    <span>{formatNumber(stats.avg)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">最小值:</span>
                    <span>{formatNumber(stats.min)}</span>
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

// Interactive Trend Chart Component for X Influencers
function InfluencerTrendChart({ influencer }: { influencer: InfluencerHistoryItem }) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    follower_count: true,
    friends_count: true,
    tweet_count: true,
    media_count: true,
  });
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null);

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
    friends_count: item.friends_count,
    tweet_count: item.tweet_count,
    media_count: item.media_count,
  }));

  // Metric configurations
  const metrics = [
    { key: 'follower_count', label: '粉丝数', color: '#3B82F6', icon: Users },
    { key: 'friends_count', label: '关注数', color: '#10B981', icon: UserCheck },
    { key: 'tweet_count', label: '推文数', color: '#8B5CF6', icon: Twitter },
    { key: 'media_count', label: '媒体数', color: '#EF4444', icon: Image },
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

  // Handle metric highlighting
  const handleMetricHighlight = (metricKey: string) => {
    setHighlightedMetric(highlightedMetric === metricKey ? null : metricKey);
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
            <Tooltip content={<CustomTooltip metrics={metrics} />} />
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
                    <span className="text-gray-600">最大值:</span>
                    <span>{formatNumber(stats.max)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">平均值:</span>
                    <span>{formatNumber(stats.avg)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">最小值:</span>
                    <span>{formatNumber(stats.min)}</span>
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
