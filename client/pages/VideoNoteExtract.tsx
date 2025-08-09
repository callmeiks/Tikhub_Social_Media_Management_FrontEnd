import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Video,
  Copy,
  Download,
  RefreshCw,
  Settings,
  CheckCircle,
  AlertTriangle,
  Eye,
  Zap,
  Clock,
  Target,
  MessageCircle,
  FileDown,
  ListChecks,
  Database,
  Loader2,
  XCircle,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const supportedPlatforms = [
  { id: "tiktok", name: "TikTok", emoji: "🎵", active: true },
  { id: "douyin", name: "抖音", emoji: "🎤", active: true },
  { id: "xiaohongshu", name: "小红书", emoji: "📖", active: true },
  { id: "bilibili", name: "B站", emoji: "📺", active: true },
  { id: "kuaishou", name: "快手", emoji: "⚡", active: true },
  { id: "instagram", name: "Instagram", emoji: "📷", active: true },
  { id: "x", name: "X (Twitter)", emoji: "🐦", active: true },
];

interface Task {
  task_id: string;
  url: string;
  platform: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'paused';
  progress: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
  caption_info?: {
    platform: string;
    caption_text: string;
    author: string;
    url: string;
  };
}

interface Caption {
  platform: string;
  caption_text: string;
  author: string;
  url: string;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    queued: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "排队中" },
    processing: { color: "bg-yellow-100 text-yellow-800", icon: Loader2, label: "处理中" },
    completed: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "已完成" },
    failed: { color: "bg-red-100 text-red-800", icon: XCircle, label: "失败" },
    cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle, label: "已取消" },
    paused: { color: "bg-orange-100 text-orange-800", icon: PauseCircle, label: "已暂停" },
  };
  return statusConfig[status as keyof typeof statusConfig] || statusConfig.queued;
};

const getPlatformName = (platform: string) => {
  const platformMap: { [key: string]: string } = {
    douyin: "抖音",
    tiktok: "TikTok",
    xiaohongshu: "小红书",
    kuaishou: "快手",
    bilibili: "B站",
    instagram: "Instagram",
    x: "X",
  };
  return platformMap[platform] || platform;
};


export default function VideoNoteExtract() {
  const { toast } = useToast();
  const [batchUrls, setBatchUrls] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeTab, setActiveTab] = useState("extract");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingCaptions, setIsLoadingCaptions] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : "http://127.0.0.1:8000/api";

  const handleExtract = async () => {
    const urls = batchUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      toast({
        title: "错误",
        description: "请输入至少一个视频或笔记链接",
        variant: "destructive",
      });
      return;
    }

    if (urls.length > 50) {
      toast({
        title: "错误",
        description: "最多支持50个链接，请减少链接数量",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);
    
    try {
      const token = localStorage.getItem("authToken") || import.meta.env.VITE_BACKEND_API_TOKEN;
      const response = await fetch(`${API_BASE_URL}/caption-collection/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ urls }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      toast({
        title: "成功",
        description: `成功创建 ${data.total_successful} 个提取任务`,
      });
      
      if (data.total_failed > 0) {
        toast({
          title: "部分失败",
          description: `${data.total_failed} 个链接处理失败`,
          variant: "destructive",
        });
      }
      
      // Clear input after successful submission
      setBatchUrls("");
      
      // Switch to task list tab to show progress
      setActiveTab("tasks");
      
      // Refresh task list
      await fetchTasks();
    } catch (error) {
      console.error("Extraction error:", error);
      toast({
        title: "错误",
        description: "提取请求失败，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const fetchTasks = async (page = 1, status = "all") => {
    setIsLoadingTasks(true);
    try {
      const token = localStorage.getItem("authToken") || import.meta.env.VITE_BACKEND_API_TOKEN;
      let url = `${API_BASE_URL}/caption-collection/tasks?page=${page}&limit=20`;
      
      if (status !== "all") {
        url += `&status=${status}`;
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data.tasks || []);
      // Assuming backend will add pagination info in future
      setTotalPages(Math.ceil((data.total || data.tasks?.length || 0) / 20));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast({
        title: "错误",
        description: "获取任务列表失败",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const fetchCaptions = async () => {
    setIsLoadingCaptions(true);
    try {
      const token = localStorage.getItem("authToken") || import.meta.env.VITE_BACKEND_API_TOKEN;
      const response = await fetch(`${API_BASE_URL}/caption-collection/captions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaptions(data.captions || []);
    } catch (error) {
      console.error("Failed to fetch captions:", error);
      toast({
        title: "错误",
        description: "获取文案数据失败",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCaptions(false);
    }
  };

  useEffect(() => {
    if (activeTab === "tasks") {
      fetchTasks(currentPage, statusFilter);
    } else if (activeTab === "captions") {
      fetchCaptions();
    }
  }, [activeTab, currentPage, statusFilter]);

  const exportCaptions = (format: 'csv' | 'xlsx') => {
    if (captions.length === 0) {
      toast({
        title: "错误",
        description: "没有可导出的数据",
        variant: "destructive",
      });
      return;
    }

    if (format === 'csv') {
      const csvContent = [
        ['平台', '作者', '文案内容', '链接'],
        ...captions.map(c => [
          getPlatformName(c.platform),
          c.author,
          c.caption_text.replace(/"/g, '""'),
          c.url
        ])
      ]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `captions_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // For XLSX, we'd need a library like xlsx or sheetjs
      // For now, show a message
      toast({
        title: "提示",
        description: "Excel导出功能即将推出",
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "成功",
      description: "已复制到剪贴板",
    });
  };

  const validateUrl = (url: string) => {
    const platformPatterns = [
      /tiktok\.com/,
      /douyin\.com/,
      /xiaohongshu\.com/,
      /bilibili\.com/,
      /kuaishou\.com/,
      /instagram\.com/,
      /x\.com/,
      /twitter\.com/,
    ];
    return platformPatterns.some((pattern) => pattern.test(url));
  };

  const urlCount = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0).length;

  const invalidUrls = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0 && !validateUrl(url));

  const hasInvalidUrls = invalidUrls.length > 0;

  return (
    <DashboardLayout
      title="文案提取"
      subtitle="智能提取视频和笔记中的文案内容，支持TikTok、抖音、小红书、B站、快手、Instagram、X等平台"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <Download className="mr-2 h-3.5 w-3.5" />
            批量提取
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Platform Support */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Video className="mr-2 h-4 w-4" />
              支持平台
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {supportedPlatforms.map((platform) => (
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
            <TabsTrigger value="extract" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              文案提取
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              任务列表
            </TabsTrigger>
            <TabsTrigger value="captions" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              文案数据
            </TabsTrigger>
          </TabsList>

          <TabsContent value="extract" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-2">
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        批量文案提取
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
                        视频或笔记链接（每行一个，最多50个）
                      </label>
                      <Textarea
                        placeholder={`请粘贴视频或笔记链接，每行一个：

https://www.tiktok.com/@user/video/123456789
https://v.douyin.com/iABCDEF/
https://www.xiaohongshu.com/discovery/item/xyz123
https://www.bilibili.com/video/BV1234567890
https://www.instagram.com/p/ABC123xyz/
https://x.com/user/status/123456789

支持TikTok、抖音、小红书、B站、快手、Instagram、X等平台`}
                        value={batchUrls}
                        onChange={(e) => setBatchUrls(e.target.value)}
                        className="min-h-[200px] resize-none font-mono text-sm"
                        maxLength={10000}
                      />
                      <div className="flex items-center space-x-2 text-xs">
                        {urlCount > 0 && !hasInvalidUrls ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">
                              检测到 {urlCount} 个有效链接
                            </span>
                          </>
                        ) : hasInvalidUrls ? (
                          <>
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                            <span className="text-red-600">
                              发现 {invalidUrls.length} 个无效链接，请检查格式
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">
                            支持完整链接和分享短链接，每行一个
                          </span>
                        )}
                      </div>
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
                          onClick={handleExtract}
                          disabled={
                            urlCount === 0 ||
                            urlCount > 50 ||
                            hasInvalidUrls ||
                            isExtracting
                          }
                          className="h-8"
                        >
                          {isExtracting ? (
                            <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Zap className="mr-2 h-3.5 w-3.5" />
                          )}
                          {isExtracting ? "批量提取中..." : "开始批量提取"}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setBatchUrls("");
                          }}
                          className="h-8"
                        >
                          清空
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {urlCount > 0 && <span>检测到 {urlCount} 个链接</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Settings Panel */}
              <div className="space-y-4">
                {/* Usage Stats */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">今日使用</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          已提取
                        </span>
                        <span className="text-sm font-medium">8 次</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          剩余
                        </span>
                        <span className="text-sm font-medium">92 次</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-foreground h-2 rounded-full"
                          style={{ width: "8%" }}
                        />
                      </div>
                      <Badge
                        variant="secondary"
                        className="w-full justify-center text-xs"
                      >
                        🎉 今日免费额度 100次
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      使用技巧
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>• 支持提取视频字幕和笔记文字</p>
                      <p>• 自动识别话题标签和关键词</p>
                      <p>• 可批量处理多个链接</p>
                      <p>• 提取结果支持一键复制</p>
                      <p>• 仅限公开内容的文案提取</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Task List Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <ListChecks className="mr-2 h-4 w-4" />
                    任务列表
                  </span>
                  <div className="flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={(value) => {
                      setStatusFilter(value);
                      setCurrentPage(1);
                    }}>
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="筛选状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="queued">排队中</SelectItem>
                        <SelectItem value="processing">处理中</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
                        <SelectItem value="failed">失败</SelectItem>
                        <SelectItem value="cancelled">已取消</SelectItem>
                        <SelectItem value="paused">已暂停</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchTasks(currentPage, statusFilter)}
                      disabled={isLoadingTasks}
                      className="h-8"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isLoadingTasks ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingTasks ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <ListChecks className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">暂无任务记录</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[350px]">链接</TableHead>
                          <TableHead className="w-[100px]">平台</TableHead>
                          <TableHead className="w-[100px]">状态</TableHead>
                          <TableHead className="w-[100px]">进度</TableHead>
                          <TableHead className="w-[180px]">创建时间</TableHead>
                          <TableHead className="w-[180px]">完成时间</TableHead>
                          <TableHead className="w-[100px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasks.map((task) => {
                          const statusConfig = getStatusBadge(task.status);
                          const StatusIcon = statusConfig.icon;
                          return (
                            <TableRow key={task.task_id}>
                              <TableCell className="font-medium">
                                <div className="max-w-[330px] truncate" title={task.url}>
                                  {task.url}
                                </div>
                                {task.error_message && (
                                  <div className="text-xs text-red-600 mt-1">
                                    错误: {task.error_message}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {getPlatformName(task.platform)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={`text-xs ${statusConfig.color}`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-muted rounded-full h-2">
                                    <div
                                      className="bg-foreground h-2 rounded-full transition-all"
                                      style={{ width: `${task.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs">{task.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(task.created_at).toLocaleString('zh-CN')}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {task.completed_at ? new Date(task.completed_at).toLocaleString('zh-CN') : '-'}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  {task.caption_info && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => handleCopy(task.caption_info!.caption_text)}
                                      title="复制文案"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => window.open(task.url, "_blank")}
                                    title="查看原链接"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1 || isLoadingTasks}
                    >
                      上一页
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      第 {currentPage} 页，共 {totalPages} 页
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || isLoadingTasks}
                    >
                      下一页
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Caption Data Tab */}
          <TabsContent value="captions" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    文案数据
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      共 {captions.length} 条文案
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchCaptions()}
                      disabled={isLoadingCaptions}
                      className="h-8"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isLoadingCaptions ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportCaptions('csv')}
                      disabled={captions.length === 0}
                      className="h-8"
                    >
                      <FileDown className="mr-2 h-3.5 w-3.5" />
                      导出CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportCaptions('xlsx')}
                      disabled={captions.length === 0}
                      className="h-8"
                    >
                      <FileDown className="mr-2 h-3.5 w-3.5" />
                      导出Excel
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingCaptions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : captions.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">暂无文案数据</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      提取的文案将在任务完成后显示在这里
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold">{captions.length}</div>
                        <div className="text-xs text-muted-foreground">总文案数</div>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold">
                          {[...new Set(captions.map(c => c.platform))].length}
                        </div>
                        <div className="text-xs text-muted-foreground">平台数</div>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold">
                          {[...new Set(captions.map(c => c.author))].length}
                        </div>
                        <div className="text-xs text-muted-foreground">作者数</div>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold">
                          {Math.round(captions.reduce((acc, c) => acc + c.caption_text.length, 0) / captions.length)}
                        </div>
                        <div className="text-xs text-muted-foreground">平均字数</div>
                      </div>
                    </div>

                    {/* Caption List */}
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">平台</TableHead>
                            <TableHead className="w-[150px]">作者</TableHead>
                            <TableHead className="w-[500px]">文案内容</TableHead>
                            <TableHead className="w-[250px]">链接</TableHead>
                            <TableHead className="w-[100px]">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {captions.map((caption, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {getPlatformName(caption.platform)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                <div className="max-w-[140px] truncate" title={caption.author}>
                                  {caption.author}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="max-w-[480px]">
                                  <div className="line-clamp-3">
                                    {caption.caption_text}
                                  </div>
                                  {caption.caption_text.length > 150 && (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="h-auto p-0 text-xs"
                                      onClick={() => {
                                        // Could open a modal to show full text
                                        handleCopy(caption.caption_text);
                                      }}
                                    >
                                      查看全文并复制
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[230px] truncate text-xs text-muted-foreground" title={caption.url}>
                                  {caption.url}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleCopy(caption.caption_text)}
                                    title="复制文案"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => window.open(caption.url, "_blank")}
                                    title="查看原链接"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
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
