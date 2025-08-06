import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Download,
  Play,
  Pause,
  RefreshCw,
  Settings,
  FileVideo,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Clock,
  Folder,
  Monitor,
  Smartphone,
  AlertTriangle,
  Copy,
  Trash2,
  RotateCcw,
} from "lucide-react";

const platformSupport = [
  { id: "tiktok", name: "TikTok", emoji: "🎵", active: true },
  { id: "douyin", name: "抖音", emoji: "🎤", active: true },
  { id: "youtube", name: "YouTube", emoji: "📹", active: true },
  { id: "bilibili", name: "B站", emoji: "📺", active: true },
  { id: "kuaishou", name: "快手", emoji: "⚡", active: true },
];

interface VideoTask {
  task_id: string;
  url: string;
  platform: string | null;
  title: string | null;
  status: string;
  progress: number;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
  file_info: {
    format: string;
    filename: string;
    file_size: number;
    local_path: string;
    original_url: string;
  } | null;
  batch_id: string;
}

const downloadSettings = {
  format: "mp4",
  downloadPath: "/Downloads/TikHub",
};

export default function VideoDownload() {
  const [batchUrls, setBatchUrls] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("batch");
  const [downloadList, setDownloadList] = useState<VideoTask[]>([]);
  const [settings, setSettings] = useState(downloadSettings);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isDeletingTasks, setIsDeletingTasks] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<string>("all");
  const [selectedHistoryTaskIds, setSelectedHistoryTaskIds] = useState<
    string[]
  >([]);
  const [isDeletingHistoryTasks, setIsDeletingHistoryTasks] = useState(false);
  const tasksCache = useRef<{ data: VideoTask[] | null; timestamp: number }>({ data: null, timestamp: 0 });
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  const fetchDownloadTasks = async (status?: string, forceRefresh = false) => {
    // Check cache for download list tab
    if (activeTab === "queue" && !forceRefresh && tasksCache.current.data && 
        Date.now() - tasksCache.current.timestamp < CACHE_DURATION) {
      setDownloadList(tasksCache.current.data);
      return;
    }

    setIsLoadingTasks(true);
    try {
      const token = import.meta.env.VITE_BACKEND_API_TOKEN;
      let url = "http://127.0.0.1:8004/api/video-download/tasks?page=1&limit=20";
      if (status) {
        url += `&status=${status}`;
      }
      
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      const tasks = data.tasks || [];
      
      // Update cache for download list tab
      if (activeTab === "queue" && !status) {
        tasksCache.current = { data: tasks, timestamp: Date.now() };
      }
      
      setDownloadList(tasks);
    } catch (error) {
      toast.error("获取下载任务失败");
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (activeTab === "queue") {
      // For queue tab, fetch all tasks without status filter
      fetchDownloadTasks();
    } else if (activeTab === "history") {
      // For history tab, only fetch completed tasks
      fetchDownloadTasks("completed");
    }
    // Clear selections when changing tabs
    setSelectedTaskIds([]);
    setSelectedHistoryTaskIds([]);
  }, [activeTab]);

  const handleBatchDelete = async () => {
    if (selectedTaskIds.length === 0) {
      toast.error("请选择要删除的任务");
      return;
    }

    setIsDeletingTasks(true);
    try {
      const token = import.meta.env.VITE_BACKEND_API_TOKEN;
      const response = await fetch(
        "http://127.0.0.1:8004/api/video-download/batch-delete",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task_ids: selectedTaskIds,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(
          `成功删除 ${data.successfully_deleted} 个任务，失败 ${data.failed_deletions} 个`,
        );
        setSelectedTaskIds([]);
        fetchDownloadTasks(undefined, true);
      } else {
        toast.error("删除任务失败");
      }
    } catch (error) {
      console.error("Error deleting tasks:", error);
      toast.error("网络错误，删除任务失败");
    } finally {
      setIsDeletingTasks(false);
    }
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTaskIds((prev) => [...prev, taskId]);
    } else {
      setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(queueTasks.map((task) => task.task_id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  const handleHistoryBatchDelete = async () => {
    if (selectedHistoryTaskIds.length === 0) {
      toast.error("请选择要删除的任务");
      return;
    }

    setIsDeletingHistoryTasks(true);
    try {
      const token = import.meta.env.VITE_BACKEND_API_TOKEN;
      const response = await fetch(
        "http://127.0.0.1:8004/api/video-download/batch-delete",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task_ids: selectedHistoryTaskIds,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(
          `成功删除 ${data.successfully_deleted} 个任务，失败 ${data.failed_deletions} 个`,
        );
        setSelectedHistoryTaskIds([]);
        fetchDownloadTasks("completed", true);
      } else {
        toast.error("删除任务失败");
      }
    } catch (error) {
      console.error("Error deleting history tasks:", error);
      toast.error("网络错误，删除任务失败");
    } finally {
      setIsDeletingHistoryTasks(false);
    }
  };

  const handleSelectHistoryTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedHistoryTaskIds((prev) => [...prev, taskId]);
    } else {
      setSelectedHistoryTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleSelectAllHistory = (checked: boolean) => {
    if (checked) {
      setSelectedHistoryTaskIds(historyTasks.map((task) => task.task_id));
    } else {
      setSelectedHistoryTaskIds([]);
    }
  };

  const handleBatchProcess = async () => {
    const urls = batchUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      toast.error("请输入至少一个视频链接");
      return;
    }

    if (urls.length > 50) {
      toast.error("最多支持50个链接，请减少链接数量");
      return;
    }

    setIsProcessing(true);
    try {
      const token = import.meta.env.VITE_BACKEND_API_TOKEN;
      const response = await fetch(
        "http://127.0.0.1:8004/api/video-download/create-tasks",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            urls: urls,
            settings: {
              format: settings.format,
              downloadPath: settings.downloadPath,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create download tasks");
      }

      const data = await response.json();
      if (data.total_successful > 0) {
        toast.success(`成功创建 ${data.total_successful} 个下载任务`);
        if (data.total_failed > 0) {
          toast.warning(`${data.total_failed} 个链接处理失败`);
        }
        setBatchUrls("");
        // Invalidate cache and refresh
        tasksCache.current = { data: null, timestamp: 0 };
        if (activeTab === "queue") {
          fetchDownloadTasks(undefined, true);
        }
      } else {
        toast.error("所有链接处理失败");
      }
    } catch (error) {
      toast.error("提交下载任务失败");
      console.error("Error creating download tasks:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "downloading":
        return <Download className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case "queued":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成";
      case "downloading":
        return "下载中";
      case "pending":
        return "等待中";
      case "failed":
        return "失败";
      case "processing":
        return "处理中";
      case "queued":
        return "排队中";
      case "cancelled":
        return "已取消";
      default:
        return "未知";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "downloading":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "queued":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const urlCount = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0).length;

  const completedCount = downloadList.filter(
    (item) => item.status === "completed",
  ).length;
  const downloadingCount = downloadList.filter(
    (item) => item.status === "processing" || item.status === "downloading",
  ).length;
  const errorCount = downloadList.filter(
    (item) => item.status === "failed",
  ).length;
  const queuedCount = downloadList.filter(
    (item) => item.status === "queued" || item.status === "pending",
  ).length;

  // For queue tab, show all tasks
  const queueTasks = downloadList;

  const allHistoryTasks = downloadList.filter(
    (item) =>
      item.status === "completed" ||
      item.status === "failed" ||
      item.status === "cancelled",
  );

  const getFilteredHistoryTasks = () => {
    switch (historyFilter) {
      case "completed":
        return allHistoryTasks.filter((task) => task.status === "completed");
      case "failed":
        return allHistoryTasks.filter((task) => task.status === "failed");
      case "cancelled":
        return allHistoryTasks.filter((task) => task.status === "cancelled");
      case "failed-cancelled":
        return allHistoryTasks.filter(
          (task) => task.status === "failed" || task.status === "cancelled",
        );
      case "all":
      default:
        return allHistoryTasks;
    }
  };

  const historyTasks = getFilteredHistoryTasks();

  return (
    <DashboardLayout
      title="视频下载"
      subtitle="快速下载各平台视频内容，支持批量下载"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <Folder className="mr-2 h-3.5 w-3.5" />
            打开文件夹
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Platform Support */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <FileVideo className="mr-2 h-4 w-4" />
              支持平台
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {platformSupport.map((platform) => (
                <Badge
                  key={platform.id}
                  variant="secondary"
                  className="flex items-center space-x-1 h-7"
                >
                  <span>{platform.emoji}</span>
                  <span>{platform.name}</span>
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="batch">批量下载</TabsTrigger>
            <TabsTrigger value="queue">下载队列</TabsTrigger>
            <TabsTrigger value="history">下载历史</TabsTrigger>
          </TabsList>

          <TabsContent value="batch" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Batch Input */}
              <div className="lg:col-span-2">
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        批量添加视频链接
                      </span>
                      <Badge
                        variant={urlCount > 50 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {urlCount}/50
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        粘贴视频链接（每行一个，最多50个）
                      </label>
                      <Textarea
                        placeholder={`请粘贴视频链接，每行一个：

https://www.tiktok.com/@user/video/123456789
https://v.douyin.com/iABCDEF/
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://www.bilibili.com/video/BV1234567890

支持的平台：TikTok、抖音、YouTube、B站、快手等`}
                        value={batchUrls}
                        onChange={(e) => setBatchUrls(e.target.value)}
                        className="min-h-[300px] resize-none font-mono text-sm"
                        maxLength={10000}
                      />
                    </div>

                    {urlCount > 50 && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>链接数量超过限制，请删除多余的链接</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBatchProcess}
                          disabled={
                            urlCount === 0 || urlCount > 50 || isProcessing
                          }
                          className="h-8"
                        >
                          {isProcessing ? (
                            <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Download className="mr-2 h-3.5 w-3.5" />
                          )}
                          {isProcessing ? "处理中..." : "开始下载"}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setBatchUrls("")}
                          className="h-8"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          清空
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {urlCount > 0 && `检测到 ${urlCount} 个链接`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Download Settings */}
              <div className="space-y-4">
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">下载设置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">输出格式</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["mp4", "mov", "avi", "mkv"].map((format) => (
                          <Button
                            key={format}
                            variant={
                              settings.format === format ? "default" : "outline"
                            }
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() =>
                              setSettings((prev) => ({ ...prev, format }))
                            }
                          >
                            {format.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">保存路径</label>
                      <Input
                        value={settings.downloadPath}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            downloadPath: e.target.value,
                          }))
                        }
                        className="text-xs"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">统计</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        已完成
                      </span>
                      <span className="text-sm font-medium">
                        {completedCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        处理中
                      </span>
                      <span className="text-sm font-medium">
                        {downloadingCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        排队中
                      </span>
                      <span className="text-sm font-medium">{queuedCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        失败
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        {errorCount}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="queue" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    下载队列 ({queueTasks.length})
                  </span>
                  <div className="flex items-center space-x-2">
                    {queueTasks.length > 0 && (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7"
                          disabled={
                            selectedTaskIds.length === 0 || isDeletingTasks
                          }
                          onClick={handleBatchDelete}
                        >
                          {isDeletingTasks ? (
                            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="mr-1 h-3 w-3" />
                          )}
                          删除选中 ({selectedTaskIds.length})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7"
                          onClick={() => fetchDownloadTasks(undefined, true)}
                        >
                          <RefreshCw className="mr-1 h-3 w-3" />
                          刷新
                        </Button>
                      </>
                    )}
                    {queueTasks.length === 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7"
                        onClick={() => fetchDownloadTasks(undefined, true)}
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        刷新
                      </Button>
                    )}
                  </div>
                </CardTitle>
                {queueTasks.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Checkbox
                      checked={selectedTaskIds.length === queueTasks.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span>全选</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {isLoadingTasks ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">加载中...</p>
                  </div>
                ) : queueTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <FileVideo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">队列为空</h3>
                    <p className="text-muted-foreground">
                      暂无正在处理的下载任务
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {queueTasks.map((item) => (
                      <div
                        key={item.task_id}
                        className="p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <Checkbox
                              checked={selectedTaskIds.includes(item.task_id)}
                              onCheckedChange={(checked) =>
                                handleSelectTask(
                                  item.task_id,
                                  checked as boolean,
                                )
                              }
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                {getStatusIcon(item.status)}
                                <h3 className="text-sm font-medium truncate">
                                  {item.title || "获取视频信息中..."}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getStatusColor(item.status)}`}
                                >
                                  {getStatusText(item.status)}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-2">
                                {item.url}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                {item.platform && <span>{item.platform}</span>}
                                <span>
                                  {new Date(item.created_at).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                navigator.clipboard.writeText(item.url);
                                toast.success("链接已复制");
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {(item.status === "processing" ||
                          item.status === "downloading") && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>处理进度</span>
                              <span>{item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    下载历史 ({historyTasks.length}/{allHistoryTasks.length})
                  </span>
                  <div className="flex items-center space-x-2">
                    {historyTasks.length > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7"
                        disabled={
                          selectedHistoryTaskIds.length === 0 ||
                          isDeletingHistoryTasks
                        }
                        onClick={handleHistoryBatchDelete}
                      >
                        {isDeletingHistoryTasks ? (
                          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="mr-1 h-3 w-3" />
                        )}
                        删除选中 ({selectedHistoryTaskIds.length})
                      </Button>
                    )}
                    <Select
                      value={historyFilter}
                      onValueChange={setHistoryFilter}
                    >
                      <SelectTrigger className="h-7 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
                        <SelectItem value="failed">失败</SelectItem>
                        <SelectItem value="cancelled">已取消</SelectItem>
                        <SelectItem value="failed-cancelled">
                          失败 + 取消
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      onClick={() => fetchDownloadTasks("completed", true)}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      刷新
                    </Button>
                  </div>
                </CardTitle>
                {historyTasks.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Checkbox
                      checked={
                        selectedHistoryTaskIds.length === historyTasks.length
                      }
                      onCheckedChange={handleSelectAllHistory}
                    />
                    <span>全选</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {isLoadingTasks ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">加载中...</p>
                  </div>
                ) : historyTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <FileVideo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">下载历史为空</h3>
                    <p className="text-muted-foreground">
                      完成的下载记录将在这里显示
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historyTasks.map((item) => (
                      <div
                        key={item.task_id}
                        className="p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <Checkbox
                              checked={selectedHistoryTaskIds.includes(
                                item.task_id,
                              )}
                              onCheckedChange={(checked) =>
                                handleSelectHistoryTask(
                                  item.task_id,
                                  checked as boolean,
                                )
                              }
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                {getStatusIcon(item.status)}
                                <h3 className="text-sm font-medium truncate">
                                  {item.title || "未知视频"}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getStatusColor(item.status)}`}
                                >
                                  {getStatusText(item.status)}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-2">
                                {item.url}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                {item.platform && <span>{item.platform}</span>}
                                <span>
                                  {new Date(item.created_at).toLocaleString()}
                                </span>
                                {item.completed_at && (
                                  <span>
                                    完成于:{" "}
                                    {new Date(
                                      item.completed_at,
                                    ).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {item.error_message && (
                                <p className="text-xs text-red-600 mt-2">
                                  错误: {item.error_message}
                                </p>
                              )}
                              {item.file_info && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  <span>文件: {item.file_info.filename}</span>
                                  <span className="ml-4">
                                    大小:{" "}
                                    {(
                                      item.file_info.file_size /
                                      1024 /
                                      1024
                                    ).toFixed(2)}{" "}
                                    MB
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                navigator.clipboard.writeText(item.url);
                                toast.success("链接已复制");
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            {item.file_info && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={async () => {
                                  const filePath = item.file_info!.local_path;

                                  try {
                                    const token = import.meta.env
                                      .VITE_BACKEND_API_TOKEN;
                                    const response = await fetch(
                                      "http://127.0.0.1:8004/api/video-download/open-folder",
                                      {
                                        method: "POST",
                                        headers: {
                                          accept: "application/json",
                                          Authorization: `Bearer ${token}`,
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          file_path: filePath,
                                        }),
                                      },
                                    );

                                    if (response.ok) {
                                      const data = await response.json();
                                      if (data.success) {
                                        toast.success("文件夹已打开");
                                      } else {
                                        toast.error(
                                          data.message || "打开文件夹失败",
                                        );
                                      }
                                    } else {
                                      toast.error("服务器错误，无法打开文件夹");
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error opening folder:",
                                      error,
                                    );
                                    toast.error("网络错误，无法打开文件夹");
                                  }
                                }}
                                title="打开文件夹"
                              >
                                <Folder className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
