import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

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
  const [contentMonitoringInterval, setContentMonitoringInterval] =
    useState("1h");
  const [influencerMonitoringInterval, setInfluencerMonitoringInterval] =
    useState("1h");

  const validateUrl = (url: string) => {
    return url.includes("tiktok.com");
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
      alert("请输入有效的TikTok作品链接");
      return;
    }

    setIsAddingContent(true);

    const newTasks = validContentUrls.map((url) => ({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      type: "content" as const,
      status: "waiting" as const,
      addedAt: new Date().toLocaleString("zh-CN"),
    }));

    setTaskQueue((prev) => [...prev, ...newTasks]);

    await processTaskQueue(newTasks, setTaskQueue, (task, i) => {
      const newContentItem = {
        id: Date.now() + i,
        title: `批量添加的作品监控 ${i + 1}`,
        author: "���者名称",
        url: task.url,
        thumbnail: "/api/placeholder/120/120",
        addedAt: task.addedAt,
        status: "active",
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
    });

    setContentUrls("");
    setValidContentUrls([]);
    setInvalidContentUrls([]);
    setContentUploadedFile(null);
    setIsAddingContent(false);
  };

  const handleAddInfluencerBatch = async () => {
    if (validInfluencerUrls.length === 0) {
      alert("请输入有效的TikTok达人链接");
      return;
    }

    setIsAddingInfluencer(true);

    const newTasks = validInfluencerUrls.map((url) => ({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      type: "influencer" as const,
      status: "waiting" as const,
      addedAt: new Date().toLocaleString("zh-CN"),
    }));

    setTaskQueue((prev) => [...prev, ...newTasks]);

    await processTaskQueue(newTasks, setTaskQueue, (task, i) => {
      const newInfluencer = {
        id: Date.now() + i + 1000,
        username: `批量添加的达人 ${i + 1}`,
        avatar: "/api/placeholder/60/60",
        url: task.url,
        addedAt: task.addedAt,
        status: "active",
        verified: false,
        userType: "普通用户",
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
                <span className="text-sm">状��: 正常运行</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              添加监控
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              作品监控 ({contentData.length})
            </TabsTrigger>
            <TabsTrigger value="influencer" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              达人监控 ({influencerData.length})
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
                        <SelectItem value="1m">1 分钟</SelectItem>
                        <SelectItem value="1h">1 小时</SelectItem>
                        <SelectItem value="4h">4 小时</SelectItem>
                        <SelectItem value="24h">24 小时</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-gray-500">
                      ⏰ 设置数���采集的时间间隔
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

            {/* Task Queue Section */}
            {taskQueue.length > 0 && (
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      任务队列 ({taskQueue.length})
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearCompletedTasks}
                        disabled={
                          !taskQueue.some((task) => task.status === "completed")
                        }
                        className="h-7 text-xs"
                      >
                        清除已完成
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAllTasks}
                        className="h-7 text-xs"
                      >
                        清空所有
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Queue Statistics */}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {
                            taskQueue.filter(
                              (task) => task.status === "waiting",
                            ).length
                          }
                        </div>
                        <div className="text-xs text-gray-600">等待中</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-yellow-600">
                          {
                            taskQueue.filter(
                              (task) => task.status === "processing",
                            ).length
                          }
                        </div>
                        <div className="text-xs text-gray-600">处理中</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {
                            taskQueue.filter(
                              (task) => task.status === "completed",
                            ).length
                          }
                        </div>
                        <div className="text-xs text-gray-600">已完成</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-600">
                          {
                            taskQueue.filter((task) => task.status === "failed")
                              .length
                          }
                        </div>
                        <div className="text-xs text-gray-600">失败</div>
                      </div>
                    </div>

                    {/* Task List */}
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[400px]">链接</TableHead>
                            <TableHead className="w-[100px]">类型</TableHead>
                            <TableHead className="w-[120px]">状态</TableHead>
                            <TableHead className="w-[150px]">
                              添加时间
                            </TableHead>
                            <TableHead className="w-[150px]">
                              完成时间
                            </TableHead>
                            <TableHead className="w-[100px]">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {taskQueue.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell className="font-medium">
                                <div
                                  className="max-w-[350px] truncate"
                                  title={task.url}
                                >
                                  {task.url}
                                </div>
                                {task.error && (
                                  <div className="text-xs text-red-600 mt-1">
                                    {task.error}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs">
                                  {task.type === "content" ? "作品" : "达人"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {getTaskStatusBadge(task.status)}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {task.addedAt}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {task.completedAt || "-"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  {task.status === "failed" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                                      onClick={() =>
                                        handleRetryFailedTask(task.id)
                                      }
                                      title="重试"
                                    >
                                      <RefreshCw className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      window.open(task.url, "_blank")
                                    }
                                    title="查看链接"
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
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Monitor className="mr-2 h-4 w-4" />
                    作品监控列表 ({contentData.length})
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    活跃监控:{" "}
                    {
                      contentData.filter((item) => item.status === "active")
                        .length
                    }
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contentData.length === 0 ? (
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
                          <TableHead className="w-[100px]">当前分享</TableHead>
                          <TableHead className="w-[100px]">增长率</TableHead>
                          <TableHead className="w-[100px]">状态</TableHead>
                          <TableHead className="w-[120px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contentData.map((content) => (
                          <TableRow key={content.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <Play className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                  <div
                                    className="max-w-[200px] truncate font-medium"
                                    title={content.title}
                                  >
                                    {content.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    by {content.author}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    添加于 {content.addedAt}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                {content.currentStats.views}
                              </div>
                              <div className="text-xs text-green-600">
                                {calculateGrowth(
                                  content.currentStats.views,
                                  content.initialStats.views,
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Heart className="h-3 w-3 mr-1 text-red-500" />
                                {content.currentStats.likes}
                              </div>
                              <div className="text-xs text-green-600">
                                {calculateGrowth(
                                  content.currentStats.likes,
                                  content.initialStats.likes,
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
                                {content.currentStats.comments}
                              </div>
                              <div className="text-xs text-green-600">
                                {calculateGrowth(
                                  content.currentStats.comments,
                                  content.initialStats.comments,
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Share2 className="h-3 w-3 mr-1 text-purple-500" />
                                {content.currentStats.shares}
                              </div>
                              <div className="text-xs text-green-600">
                                {calculateGrowth(
                                  content.currentStats.shares,
                                  content.initialStats.shares,
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium text-green-600">
                                ↗️ 增长中
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(content.status)}
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
                                        {content.title} - TikTok
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <div className="text-center text-gray-500">
                                        📊 趋势图表开发中...
                                        <br />
                                        <span className="text-sm">
                                          将显示播放量、点赞数、评论数的时间趋势变化
                                        </span>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    window.open(content.url, "_blank")
                                  }
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  onClick={() =>
                                    handleRemoveContent(content.id)
                                  }
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                    达人监控列表 ({influencerData.length})
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    活跃监控:{" "}
                    {
                      influencerData.filter((item) => item.status === "active")
                        .length
                    }
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {influencerData.length === 0 ? (
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
                          <TableHead className="w-[250px]">达人信息</TableHead>
                          <TableHead className="w-[120px]">
                            当前粉丝数
                          </TableHead>
                          <TableHead className="w-[100px]">作品数</TableHead>
                          <TableHead className="w-[120px]">获赞总数</TableHead>
                          <TableHead className="w-[100px]">互动率</TableHead>
                          <TableHead className="w-[100px]">状态</TableHead>
                          <TableHead className="w-[120px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {influencerData.map((influencer) => (
                          <TableRow key={influencer.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                                  {influencer.username.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">
                                      {influencer.username}
                                    </span>
                                    {getVerificationIcon(
                                      influencer.verified,
                                      influencer.userType,
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {influencer.userType}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    添加于 {influencer.addedAt}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1 text-blue-500" />
                                {influencer.currentStats.followers}
                              </div>
                              <div className="text-xs text-green-600">
                                {calculateGrowth(
                                  influencer.currentStats.followers,
                                  influencer.initialStats.followers,
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Video className="h-3 w-3 mr-1 text-purple-500" />
                                {influencer.currentStats.works}
                              </div>
                              <div className="text-xs text-green-600">
                                {calculateGrowth(
                                  influencer.currentStats.works,
                                  influencer.initialStats.works,
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <Heart className="h-3 w-3 mr-1 text-red-500" />
                                {influencer.currentStats.totalLikes}
                              </div>
                              <div className="text-xs text-green-600">
                                {calculateGrowth(
                                  influencer.currentStats.totalLikes,
                                  influencer.initialStats.totalLikes,
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="font-medium text-green-600">
                                {influencer.recentActivity.engagementRate}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                本周 {influencer.recentActivity.postsThisWeek}{" "}
                                作品
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(influencer.status)}
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
                                        {influencer.username} - TikTok
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <div className="text-center text-gray-500">
                                        📊 趋势图表开发中...
                                        <br />
                                        <span className="text-sm">
                                          将显示粉丝数、作品数、获赞总数的时间趋势变化
                                        </span>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    window.open(influencer.url, "_blank")
                                  }
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  onClick={() =>
                                    handleRemoveInfluencer(influencer.id)
                                  }
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
