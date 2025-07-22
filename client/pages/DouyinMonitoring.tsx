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
} from "lucide-react";

// Sample monitoring data for Douyin content
const mockContentData = [
  {
    id: 1,
    title: "超火的韩式裸妆教程！新手必看",
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
  },
  {
    id: 2,
    title: "今日穿搭分享 | 冬日温暖系搭配",
    author: "时尚博主Amy",
    url: "https://www.douyin.com/video/789012",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-14 16:20",
    status: "active",
    currentStats: {
      views: "189.3万",
      likes: "12.7万",
      comments: "8.9万",
      shares: "5.6千",
    },
    initialStats: {
      views: "165万",
      likes: "10.8万",
      comments: "6.2万",
      shares: "4.2千",
    },
  },
];

// Sample monitoring data for Douyin influencers
const mockInfluencerData = [
  {
    id: 1,
    username: "美妆达人小丽",
    avatar: "/api/placeholder/60/60",
    url: "https://www.douyin.com/user/123456",
    addedAt: "2024-01-15 10:30",
    status: "active",
    verified: true,
    userType: "个人认证",
    currentStats: {
      followers: "156.8万",
      following: "128",
      works: "127",
      totalLikes: "2340万",
    },
    initialStats: {
      followers: "150.2万",
      following: "125",
      works: "124",
      totalLikes: "2280万",
    },
    recentActivity: {
      postsThisWeek: 3,
      avgLikes: "18.5万",
      avgComments: "4.2万",
      engagementRate: "12.5%",
    },
  },
  {
    id: 2,
    username: "时尚博主Amy",
    avatar: "/api/placeholder/60/60",
    url: "https://www.douyin.com/user/789012",
    addedAt: "2024-01-14 16:20",
    status: "active",
    verified: true,
    userType: "企业认证",
    currentStats: {
      followers: "89.2万",
      following: "89",
      works: "203",
      totalLikes: "1580万",
    },
    initialStats: {
      followers: "85.1万",
      following: "87",
      works: "200",
      totalLikes: "1450万",
    },
    recentActivity: {
      postsThisWeek: 2,
      avgLikes: "12.7万",
      avgComments: "8.9万",
      engagementRate: "14.2%",
    },
  },
];

export default function DouyinMonitoring() {
  const [contentData, setContentData] = useState(mockContentData);
  const [influencerData, setInfluencerData] = useState(mockInfluencerData);
  const [batchUrls, setBatchUrls] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validUrls, setValidUrls] = useState([]);
  const [invalidUrls, setInvalidUrls] = useState([]);

  const validateUrl = (url: string) => {
    return url.includes("douyin.com");
  };

  const isContentUrl = (url: string) => {
    return url.includes("/video/") || url.includes("/note/");
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
      alert("请输入有效的抖音链接");
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
      const contentUrls = validUrls.filter(isContentUrl);
      const influencerUrls = validUrls.filter(url => !isContentUrl(url));

      // Add content monitoring
      if (contentUrls.length > 0) {
        const newContentItems = contentUrls.map((url, index) => ({
          id: Date.now() + index,
          title: `批量添加的作品监控 ${index + 1}`,
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
        }));
        setContentData((prev) => [...newContentItems, ...prev]);
      }

      // Add influencer monitoring
      if (influencerUrls.length > 0) {
        const newInfluencers = influencerUrls.map((url, index) => ({
          id: Date.now() + index + 1000,
          username: `批量添加的达人 ${index + 1}`,
          avatar: "/api/placeholder/60/60",
          url: url,
          addedAt: new Date().toLocaleString("zh-CN"),
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
        }));
        setInfluencerData((prev) => [...newInfluencers, ...prev]);
      }

      setBatchUrls("");
      setValidUrls([]);
      setInvalidUrls([]);
      setUploadedFile(null);
      setIsAdding(false);
      alert(`成功添加 ${contentUrls.length} 个作品监控和 ${influencerUrls.length} 个达人监控！`);
    }, 2000);
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

    return userType.includes("企业") ? (
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
      title="抖音监控"
      subtitle="实时监控抖音平台的达人和作品数据变化"
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
              🎤 抖音平台监控
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
                <span className="text-sm">达人监控: {influencerData.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">状态: 正常运行</span>
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  批量添加抖音监控
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
                      选择包含抖音链接的文本文件（每行一个链接）
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
                      placeholder="请输入抖音链接，每行一个链接&#10;作品链接示例：&#10;https://www.douyin.com/video/123456&#10;&#10;达人主页链接示例：&#10;https://www.douyin.com/user/123456"
                      value={batchUrls}
                      onChange={(e) => handleBatchUrlsChange(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <div className="text-xs text-gray-500">
                      💡 支持同时添加作品链接和达人主页链接，系统会自动识别类型
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
                            作品链接: {validUrls.filter(isContentUrl).length} 个<br/>
                            达人链接: {validUrls.filter(url => !isContentUrl(url)).length} 个
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
                            请确保链接包含 "douyin.com"
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
                    disabled={isAdding || validUrls.length === 0}
                    className="px-8"
                  >
                    {isAdding ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {isAdding
                      ? "批量添加中..."
                      : `批量添加 (${validUrls.length})`}
                  </Button>
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
                    作品监控列表 ({contentData.length})
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    活跃监控: {contentData.filter((item) => item.status === "active").length}
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
                          <TableHead className="w-[120px]">当前播放量</TableHead>
                          <TableHead className="w-[100px]">当前点赞</TableHead>
                          <TableHead className="w-[100px]">当前评论</TableHead>
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
                                        {content.title} - 抖音
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
                    活跃监控: {influencerData.filter((item) => item.status === "active").length}
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
                          <TableHead className="w-[120px]">当前粉丝数</TableHead>
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
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
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
                                本周 {influencer.recentActivity.postsThisWeek} 作品
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
                                        {influencer.username} - 抖音
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
