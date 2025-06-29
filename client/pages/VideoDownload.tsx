import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  { id: "xiaohongshu", name: "小红书", emoji: "📖", active: true },
  { id: "bilibili", name: "B站", emoji: "📺", active: true },
  { id: "kuaishou", name: "快手", emoji: "⚡", active: true },
];

const downloadQueue = [
  {
    id: 1,
    url: "https://www.tiktok.com/@user/video/7123456789",
    platform: "TikTok",
    title: "Amazing dance tutorial #fyp",
    status: "completed",
    progress: 100,
    fileSize: "15.2 MB",
    duration: "00:32",
    quality: "1080p",
  },
  {
    id: 2,
    url: "https://v.douyin.com/iJKLMNO/",
    platform: "抖音",
    title: "美食制作教程",
    status: "downloading",
    progress: 65,
    fileSize: "23.8 MB",
    duration: "01:15",
    quality: "720p",
  },
  {
    id: 3,
    url: "https://www.xiaohongshu.com/discovery/item/xyz123",
    platform: "小红书",
    title: "护肤心得分享",
    status: "pending",
    progress: 0,
    fileSize: "12.5 MB",
    duration: "00:45",
    quality: "720p",
  },
  {
    id: 4,
    url: "https://www.bilibili.com/video/BV1234567890",
    platform: "B站",
    title: "编程教学视频",
    status: "error",
    progress: 0,
    fileSize: "45.2 MB",
    duration: "05:30",
    quality: "1080p",
  },
];

const downloadSettings = {
  quality: "1080p",
  format: "mp4",
  downloadPath: "/Downloads/TikHub",
  downloadWithWatermark: false,
};

export default function VideoDownload() {
  const [batchUrls, setBatchUrls] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("batch");
  const [downloadList, setDownloadList] = useState(downloadQueue);
  const [settings, setSettings] = useState(downloadSettings);

  const handleBatchProcess = async () => {
    const urls = batchUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      alert("请输入至少一个视频链接");
      return;
    }

    if (urls.length > 50) {
      alert("最多支持50个链接，请减少链接数量");
      return;
    }

    setIsProcessing(true);
    // 模拟处理过程
    setTimeout(() => {
      // 这里可以添加实际的批量处理逻辑
      setIsProcessing(false);
      alert(`成功添加 ${urls.length} 个视频到下载队列`);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "downloading":
        return <Download className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
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
      case "error":
        return "失败";
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
      case "error":
        return "bg-red-100 text-red-800";
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
    (item) => item.status === "downloading",
  ).length;
  const errorCount = downloadList.filter(
    (item) => item.status === "error",
  ).length;

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
https://www.xiaohongshu.com/discovery/item/xyz123
https://www.bilibili.com/video/BV1234567890

支持的平台：TikTok、抖音、小红书、B站、快手等`}
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
                      <label className="text-sm font-medium">视频质量</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["1080p", "720p", "480p", "360p"].map((quality) => (
                          <Button
                            key={quality}
                            variant={
                              settings.quality === quality
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() =>
                              setSettings((prev) => ({ ...prev, quality }))
                            }
                          >
                            {quality}
                          </Button>
                        ))}
                      </div>
                    </div>

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

                    <div className="flex items-center justify-between">
                      <span className="text-sm">保留水印</span>
                      <Button
                        variant={
                          settings.downloadWithWatermark ? "default" : "outline"
                        }
                        size="sm"
                        className="h-6 w-12 text-xs"
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            downloadWithWatermark: !prev.downloadWithWatermark,
                          }))
                        }
                      >
                        {settings.downloadWithWatermark ? "是" : "否"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">今日统计</CardTitle>
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
                        下载中
                      </span>
                      <span className="text-sm font-medium">
                        {downloadingCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        失败
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        {errorCount}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-foreground h-2 rounded-full"
                        style={{ width: "75%" }}
                      />
                    </div>
                    <Badge
                      variant="secondary"
                      className="w-full justify-center text-xs"
                    >
                      🎉 今日已下载 156 个视频
                    </Badge>
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
                    下载队列 ({downloadList.length})
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="h-7">
                      <Pause className="mr-1 h-3 w-3" />
                      暂停全部
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7">
                      <RotateCcw className="mr-1 h-3 w-3" />
                      重试失败
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {downloadList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {getStatusIcon(item.status)}
                            <h3 className="text-sm font-medium truncate">
                              {item.title}
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
                            <span>{item.platform}</span>
                            <span>{item.duration}</span>
                            <span>{item.quality}</span>
                            <span>{item.fileSize}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {item.status === "downloading" && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>下载进度</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  下载历史
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileVideo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">下载历史为空</h3>
                  <p className="text-muted-foreground">
                    完成的下载记录将在这里显示
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
