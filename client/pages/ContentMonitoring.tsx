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
} from "lucide-react";

const supportedPlatforms = [
  { id: "douyin", name: "抖音", emoji: "🎤", domain: "douyin.com" },
  { id: "xiaohongshu", name: "小红书", emoji: "📖", domain: "xiaohongshu.com" },
  { id: "kuaishou", name: "快手", emoji: "⚡", domain: "kuaishou.com" },
  { id: "bilibili", name: "哔哩哔哩", emoji: "📺", domain: "bilibili.com" },
  { id: "weibo", name: "微博", emoji: "🎭", domain: "weibo.com" },
  { id: "tiktok", name: "TikTok", emoji: "🎵", domain: "tiktok.com" },
  { id: "instagram", name: "Instagram", emoji: "📷", domain: "instagram.com" },
  { id: "x", name: "X", emoji: "🐦", domain: "x.com" },
  { id: "youtube", name: "YouTube", emoji: "📹", domain: "youtube.com" },
];

// Sample monitoring data
const mockMonitoringData = [
  {
    id: 1,
    title: "超火的韩式裸妆教程！新手必看",
    platform: "抖音",
    author: "美妆达人小丽",
    url: "https://www.douyin.com/video/123456",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-15 10:30",
    status: "active",
    currentStats: {
      views: "256.8万",
      likes: "18.2万",
      comments: "4.5万",
      shares: "12.1千",
    },
    initialStats: {
      views: "230万",
      likes: "15.6万",
      comments: "3.2万",
      shares: "8.5千",
    },
    trendData: [
      { date: "01-15", views: 2300000, likes: 156000, comments: 32000 },
      { date: "01-16", views: 2450000, likes: 167000, comments: 38000 },
      { date: "01-17", views: 2568000, likes: 182000, comments: 45000 },
    ],
  },
  {
    id: 2,
    title: "iPhone 15 Pro Max深度评测",
    platform: "TikTok",
    author: "TechReviewer",
    url: "https://www.tiktok.com/@techreviewer/video/789012",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-14 16:20",
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
    trendData: [
      { date: "01-14", views: 4500000, likes: 258000, comments: 89000 },
      { date: "01-15", views: 4890000, likes: 275000, comments: 105000 },
      { date: "01-16", views: 5123000, likes: 289000, comments: 128000 },
    ],
  },
];

export default function ContentMonitoring() {
  const [monitoringData, setMonitoringData] = useState(mockMonitoringData);
  const [batchUrls, setBatchUrls] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validUrls, setValidUrls] = useState([]);
  const [invalidUrls, setInvalidUrls] = useState([]);

  const validateUrl = (url: string) => {
    return supportedPlatforms.some((platform) => url.includes(platform.domain));
  };

  const getPlatformFromUrl = (url: string) => {
    const platform = supportedPlatforms.find((p) => url.includes(p.domain));
    return platform ? platform.name : "未知";
  };

  const processBatchUrls = (urls: string) => {
    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const valid = urlList.filter((url) => validateUrl(url));
    const invalid = urlList.filter(
      (url) => !validateUrl(url) && url.length > 0,
    );

    setValidUrls(valid);
    setInvalidUrls(invalid);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setBatchUrls(content);
        processBatchUrls(content);
      };
      reader.readAsText(file);
    }
  };

  const handleBatchUrlsChange = (urls: string) => {
    setBatchUrls(urls);
    processBatchUrls(urls);
  };

  const handleAddBatchContent = async () => {
    if (validUrls.length === 0) {
      alert("请输入有效的作品链接");
      return;
    }

    setIsAddingContent(true);
    // 模拟批量API调用
    setTimeout(() => {
      const newContentItems = validUrls.map((url, index) => ({
        id: Date.now() + index,
        title: `批量添加的作品监控 ${index + 1}`,
        platform: getPlatformFromUrl(url),
        author: "作者名称",
        url: url,
        thumbnail: "/api/placeholder/120/120",
        addedAt: new Date().toLocaleString("zh-CN"),
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
        trendData: [],
      }));

      setMonitoringData((prev) => [...newContentItems, ...prev]);
      setBatchUrls("");
      setValidUrls([]);
      setInvalidUrls([]);
      setUploadedFile(null);
      setSelectedPlatform("");
      setIsAddingContent(false);
      alert(`成功添加 ${validUrls.length} 个作品监控！`);
    }, 2000);
  };

  const handleRemoveContent = (id: number) => {
    if (confirm("确定要停止监控这个作品吗？")) {
      setMonitoringData((prev) => prev.filter((item) => item.id !== id));
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
            已���停
          </Badge>
        );
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
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
      title="指定作品监控"
      subtitle="实时监控指定作品的数据变化趋势"
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
        {/* Platform Support */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Monitor className="mr-2 h-4 w-4" />
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

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              添加监控
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              监控列表
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  批量添加作品监控
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Option */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    方式一：上传文件
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      选择包含作品链接的文本文件（每行一个链接）
                    </p>
                    <Input
                      type="file"
                      accept=".txt,.csv"
                      onChange={handleFileUpload}
                      className="max-w-xs mx-auto"
                    />
                    {uploadedFile && (
                      <div className="mt-2 flex items-center justify-center text-sm text-green-600">
                        <FileText className="h-4 w-4 mr-1" />
                        已上传：{uploadedFile.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Input Option */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    方式二：手动输入
                  </label>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="请输入作品链接，每行一个链接&#10;例如：&#10;https://www.douyin.com/video/123456&#10;https://www.tiktok.com/@user/video/789012&#10;https://www.xiaohongshu.com/explore/123abc"
                      value={batchUrls}
                      onChange={(e) => handleBatchUrlsChange(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <div className="text-xs text-gray-500">
                      💡
                      支持抖音、小红书、快手、B站、微博、TikTok、Instagram、X、YouTube等平台
                    </div>
                  </div>
                </div>

                {/* URL Validation Summary */}
                {(validUrls.length > 0 || invalidUrls.length > 0) && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    {validUrls.length > 0 && (
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-green-800">
                            有效链接 ({validUrls.length} 个)
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            {validUrls.slice(0, 3).map((url, index) => (
                              <div key={index} className="truncate max-w-md">
                                {getPlatformFromUrl(url)}: {url}
                              </div>
                            ))}
                            {validUrls.length > 3 && (
                              <div className="text-green-500">
                                ...还有 {validUrls.length - 3} 个链接
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {invalidUrls.length > 0 && (
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-red-800">
                            无效链接 ({invalidUrls.length} 个)
                          </div>
                          <div className="text-xs text-red-600 mt-1">
                            {invalidUrls.slice(0, 3).map((url, index) => (
                              <div key={index} className="truncate max-w-md">
                                {url}
                              </div>
                            ))}
                            {invalidUrls.length > 3 && (
                              <div className="text-red-500">
                                ...还有 {invalidUrls.length - 3} 个链接
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddBatchContent}
                    disabled={isAddingContent || validUrls.length === 0}
                    className="px-8"
                  >
                    {isAddingContent ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {isAddingContent
                      ? "批量添加中..."
                      : `批量添加 (${validUrls.length})`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Monitor className="mr-2 h-4 w-4" />
                    监控列表 ({monitoringData.length})
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    活跃监控:{" "}
                    {
                      monitoringData.filter((item) => item.status === "active")
                        .length
                    }
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {monitoringData.length === 0 ? (
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
                          <TableHead className="w-[100px]">平台</TableHead>
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
                        {monitoringData.map((content) => (
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
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {content.platform}
                              </Badge>
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
                                      onClick={() =>
                                        setSelectedContent(content)
                                      }
                                    >
                                      <BarChart3 className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>作品监控趋势</DialogTitle>
                                      <DialogDescription>
                                        {content.title} - {content.platform}
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
