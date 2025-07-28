import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Image,
  Bookmark,
} from "lucide-react";
import { TaskItem, createTaskQueueItems, processTaskQueue } from "@/lib/taskQueue";
import { TaskQueueSection } from "@/components/shared/TaskQueueSection";

// Sample monitoring data for Xiaohongshu content
const mockContentData = [
  {
    id: 1,
    title: "秋日穿搭分享 | 温柔知性风格搭配",
    author: "时尚博主小雅",
    url: "https://www.xiaohongshu.com/explore/63f1234567890abc",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-15 10:30",
    status: "active",
    type: "图文",
    currentStats: {
      views: "18.5万",
      likes: "12.3万",
      comments: "3.2万",
      shares: "1.8千",
    },
    initialStats: {
      views: "15.2万",
      likes: "9.8万",
      comments: "2.5万",
      shares: "1.2千",
    },
  },
  {
    id: 2,
    title: "护肤心得分享 | 敏感肌的冬日护理",
    author: "美容达人Lisa",
    url: "https://www.xiaohongshu.com/explore/63f0987654321def",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-14 16:20",
    status: "active",
    type: "视频",
    currentStats: {
      views: "25.7万",
      likes: "18.9万",
      comments: "5.4万",
      shares: "3.2千",
    },
    initialStats: {
      views: "22.1万",
      likes: "15.6万",
      comments: "4.8万",
      shares: "2.7千",
    },
  },
  {
    id: 3,
    title: "北欧风家居装修攻略 ✨",
    author: "家居生活达人",
    url: "https://www.xiaohongshu.com/explore/63f1111222333444",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-13 14:15",
    status: "active",
    type: "图文",
    currentStats: {
      views: "31.2万",
      likes: "8.7万",
      comments: "2.1万",
      shares: "4.5千",
    },
    initialStats: {
      views: "28.9万",
      likes: "7.2万",
      comments: "1.8万",
      shares: "3.8千",
    },
  },
];

// Sample monitoring data for Xiaohongshu influencers
const mockInfluencerData = [
  {
    id: 1,
    username: "时尚博主小雅",
    avatar: "/api/placeholder/60/60",
    url: "https://www.xiaohongshu.com/user/profile/5f1234567890abcd",
    addedAt: "2024-01-15 10:30",
    status: "active",
    verified: true,
    userType: "时尚博主",
    currentStats: {
      followers: "68.9万",
      following: "245",
      works: "892",
      totalLikes: "1280万",
    },
    initialStats: {
      followers: "65.2万",
      following: "240",
      works: "885",
      totalLikes: "1220万",
    },
    recentActivity: {
      postsThisWeek: 5,
      avgLikes: "12.3万",
      avgComments: "3.2万",
      engagementRate: "22.8%",
    },
  },
  {
    id: 2,
    username: "美容达人Lisa",
    avatar: "/api/placeholder/60/60",
    url: "https://www.xiaohongshu.com/user/profile/5f0987654321abcd",
    addedAt: "2024-01-14 16:20",
    status: "active",
    verified: true,
    userType: "美妆护肤博主",
    currentStats: {
      followers: "124.5万",
      following: "89",
      works: "567",
      totalLikes: "2890万",
    },
    initialStats: {
      followers: "118.7万",
      following: "87",
      works: "562",
      totalLikes: "2750万",
    },
    recentActivity: {
      postsThisWeek: 3,
      avgLikes: "18.9万",
      avgComments: "5.4万",
      engagementRate: "19.5%",
    },
  },
  {
    id: 3,
    username: "家居生活达人",
    avatar: "/api/placeholder/60/60",
    url: "https://www.xiaohongshu.com/user/profile/5f1111222333444",
    addedAt: "2024-01-13 14:15",
    status: "active",
    verified: true,
    userType: "生活方式博主",
    currentStats: {
      followers: "89.3万",
      following: "156",
      works: "723",
      totalLikes: "1650万",
    },
    initialStats: {
      followers: "85.7万",
      following: "152",
      works: "718",
      totalLikes: "1580万",
    },
    recentActivity: {
      postsThisWeek: 4,
      avgLikes: "8.7万",
      avgComments: "2.1万",
      engagementRate: "12.4%",
    },
  },
];

export default function XiaohongshuMonitoring() {
  const [contentData, setContentData] = useState(mockContentData);
  const [influencerData, setInfluencerData] = useState(mockInfluencerData);
  const [batchUrls, setBatchUrls] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validUrls, setValidUrls] = useState([]);
  const [invalidUrls, setInvalidUrls] = useState([]);
  const [taskQueue, setTaskQueue] = useState<TaskItem[]>([]);

  const validateUrl = (url: string) => {
    return url.includes("xiaohongshu.com");
  };

  const isContentUrl = (url: string) => {
    return url.includes("/explore/") || url.includes("/discovery/");
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
      alert("请输入有效的小红书链接");
      return;
    }

    setIsAdding(true);
    
    const newTasks = createTaskQueueItems(validUrls, isContentUrl);
    setTaskQueue(newTasks);

    await processTaskQueue(newTasks, setTaskQueue, (task, i) => {
      if (task.type === 'content') {
        const newContentItem = {
          id: Date.now() + i,
          title: `批量添加的笔记监控 ${i + 1}`,
          author: "博主名称",
          url: task.url,
          thumbnail: "/api/placeholder/120/120",
          addedAt: task.addedAt,
          status: "active",
          type: "图文",
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
        setContentData(prev => [newContentItem, ...prev]);
      } else {
        const newInfluencer = {
          id: Date.now() + i + 1000,
          username: `批量添加的博主 ${i + 1}`,
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
        setInfluencerData(prev => [newInfluencer, ...prev]);
      }
    });

    setBatchUrls("");
    setValidUrls([]);
    setInvalidUrls([]);
    setUploadedFile(null);
    setIsAdding(false);
  };

  const handleRemoveContent = (id: number) => {
    if (confirm("确定要停止监控这个笔记吗？")) {
      setContentData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleRemoveInfluencer = (id: number) => {
    if (confirm("确定要停止监控这个博主吗？")) {
      setInfluencerData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleClearCompletedTasks = () => {
    setTaskQueue(prev => prev.filter(task => task.status !== 'completed'));
  };

  const handleClearAllTasks = () => {
    if (confirm("��定要清空所有任务吗？")) {
      setTaskQueue([]);
    }
  };

  const handleRetryFailedTask = (taskId: string) => {
    setTaskQueue(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: 'waiting', error: undefined } : task
      )
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

  const getContentTypeIcon = (type: string) => {
    return type === "视频" ? (
      <Video className="h-3 w-3 text-red-500" />
    ) : (
      <Image className="h-3 w-3 text-blue-500" />
    );
  };

  const getVerificationIcon = (verified: boolean, userType: string) => {
    if (!verified) return null;

    return userType.includes("官方") || userType.includes("品牌") ? (
      <Crown className="h-3 w-3 text-yellow-500" />
    ) : (
      <Verified className="h-3 w-3 text-red-500" />
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
      title="小红书监控"
      subtitle="实时监控小红书平台的博主和笔记数据变化"
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
              📖 小红书平台监控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="text-sm">笔记监控: {contentData.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  博主监控: {influencerData.length}
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              添加监控
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              笔记监控 ({contentData.length})
            </TabsTrigger>
            <TabsTrigger value="influencer" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              博主监控 ({influencerData.length})
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
                  {/* 手动输入在上方 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      手动输入
                    </label>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="请输入小红书作品链接，每行一个链接&#10;作品链接示例：&#10;https://www.xiaohongshu.com/explore/64a5b2c8000000001e03456f&#10;https://www.xiaohongshu.com/explore/64a5b3d9000000001e034890"
                        value={contentUrls}
                        onChange={(e) => handleContentUrlsChange(e.target.value)}
                        className="min-h-[180px]"
                      />
                      <div className="text-xs text-gray-500">
                        💡 仅支持小红书作品链接
                      </div>
                    </div>
                  </div>

                  {/* 上传文件在下方 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      上传文件
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-600 mb-2">
                        选择包含小红书链接的文本文件（每行一个链接）
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
                  {(validContentUrls.length > 0 || invalidContentUrls.length > 0) && (
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
                              请确保链接包含 "xiaohongshu.com"
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
                      disabled={isAddingContent || validContentUrls.length === 0}
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
                  {/* 手动输入在上方 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      手动输入
                    </label>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="请输入小红书达人链接，每行一个链接&#10;达人主页链接示例：&#10;https://www.xiaohongshu.com/user/profile/5e8a7b5c0000000001000123&#10;https://www.xiaohongshu.com/user/profile/5e8a7c8d0000000001000456"
                        value={influencerUrls}
                        onChange={(e) => handleInfluencerUrlsChange(e.target.value)}
                        className="min-h-[180px]"
                      />
                      <div className="text-xs text-gray-500">
                        💡 仅支持小红书达人主页链接
                      </div>
                    </div>
                  </div>

                  {/* 上传文件在下方 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      上传文件
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-600 mb-2">
                        选择包含小红书达人链接的文本文件（每行一个链接）
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
                  {(validInfluencerUrls.length > 0 || invalidInfluencerUrls.length > 0) && (
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
                              请确保链接包含 "xiaohongshu.com"
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
                      disabled={isAddingInfluencer || validInfluencerUrls.length === 0}
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
                    笔记监控列表 ({contentData.length})
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
                      暂无监控笔记，请先添加笔记链接
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contentData.map((content) => (
                      <Card
                        key={content.id}
                        className="group hover:shadow-lg transition-all duration-200 overflow-hidden"
                      >
                        {/* Content Image/Thumbnail */}
                        <div className="relative h-48 bg-gradient-to-br from-red-400 via-pink-400 to-orange-400">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Bookmark className="h-12 w-12 text-white/80" />
                          </div>
                          {/* Type Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge
                              variant="secondary"
                              className="bg-white/90 text-xs flex items-center gap-1"
                            >
                              {getContentTypeIcon(content.type)}
                              {content.type}
                            </Badge>
                          </div>
                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            {getStatusBadge(content.status)}
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
                                title={content.title}
                              >
                                {content.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                by {content.author}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                添加于 {content.addedAt}
                              </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Eye className="h-3 w-3 text-blue-500" />
                                </div>
                                <div className="font-medium">
                                  {content.currentStats.views}
                                </div>
                                <div className="text-green-600 text-xs">
                                  {calculateGrowth(
                                    content.currentStats.views,
                                    content.initialStats.views,
                                  )}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Heart className="h-3 w-3 text-red-500" />
                                </div>
                                <div className="font-medium">
                                  {content.currentStats.likes}
                                </div>
                                <div className="text-green-600 text-xs">
                                  {calculateGrowth(
                                    content.currentStats.likes,
                                    content.initialStats.likes,
                                  )}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <MessageCircle className="h-3 w-3 text-green-500" />
                                </div>
                                <div className="font-medium">
                                  {content.currentStats.comments}
                                </div>
                                <div className="text-green-600 text-xs">
                                  {calculateGrowth(
                                    content.currentStats.comments,
                                    content.initialStats.comments,
                                  )}
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
                                      <DialogTitle>笔记监控趋势</DialogTitle>
                                      <DialogDescription>
                                        {content.title} - 小红书
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <div className="text-center text-gray-500">
                                        📊 趋势图表开发中...
                                        <br />
                                        <span className="text-sm">
                                          将显示浏览量、点赞数、评论数的时间趋势变化
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
                                  onClick={() =>
                                    window.open(content.url, "_blank")
                                  }
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                title="删除监控"
                                onClick={() => handleRemoveContent(content.id)}
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
                    博主监控列表 ({influencerData.length})
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
                      暂无��控博主，请先添加博主链接
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {influencerData.map((influencer) => (
                      <Card
                        key={influencer.id}
                        className="group hover:shadow-lg transition-all duration-200 overflow-hidden"
                      >
                        {/* User Profile Header */}
                        <div className="relative h-32 bg-gradient-to-br from-red-400 via-pink-400 to-orange-400">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold">
                              {influencer.username.charAt(0)}
                            </div>
                          </div>
                          {/* Verification Badge */}
                          {influencer.verified && (
                            <div className="absolute top-3 right-3">
                              {getVerificationIcon(
                                influencer.verified,
                                influencer.userType,
                              )}
                            </div>
                          )}
                          {/* Status Badge */}
                          <div className="absolute bottom-3 right-3">
                            {getStatusBadge(influencer.status)}
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* User Info */}
                            <div className="text-center">
                              <h3 className="font-medium text-sm flex items-center justify-center gap-1">
                                {influencer.username}
                                {getVerificationIcon(
                                  influencer.verified,
                                  influencer.userType,
                                )}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {influencer.userType}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                添加于 {influencer.addedAt}
                              </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Users className="h-3 w-3 text-blue-500" />
                                </div>
                                <div className="font-medium">
                                  {influencer.currentStats.followers}
                                </div>
                                <div className="text-green-600 text-xs">
                                  {calculateGrowth(
                                    influencer.currentStats.followers,
                                    influencer.initialStats.followers,
                                  )}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Video className="h-3 w-3 text-purple-500" />
                                </div>
                                <div className="font-medium">
                                  {influencer.currentStats.works}
                                </div>
                                <div className="text-green-600 text-xs">
                                  {calculateGrowth(
                                    influencer.currentStats.works,
                                    influencer.initialStats.works,
                                  )}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Heart className="h-3 w-3 text-red-500" />
                                </div>
                                <div className="font-medium">
                                  {influencer.currentStats.totalLikes}
                                </div>
                                <div className="text-green-600 text-xs">
                                  {calculateGrowth(
                                    influencer.currentStats.totalLikes,
                                    influencer.initialStats.totalLikes,
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Engagement Rate */}
                            <div className="text-center pt-2 border-t">
                              <div className="text-sm font-medium text-green-600">
                                {influencer.recentActivity.engagementRate}{" "}
                                互动率
                              </div>
                              <div className="text-xs text-muted-foreground">
                                本周 {influencer.recentActivity.postsThisWeek}{" "}
                                笔记
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
                                      <DialogTitle>博主监控趋势</DialogTitle>
                                      <DialogDescription>
                                        {influencer.username} - 小红书
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <div className="text-center text-gray-500">
                                        📊 趋势图表开发中...
                                        <br />
                                        <span className="text-sm">
                                          将显示粉丝数、笔记数、获赞总数的时间趋势变化
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
                                  onClick={() =>
                                    window.open(influencer.url, "_blank")
                                  }
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                title="删除监控"
                                onClick={() =>
                                  handleRemoveInfluencer(influencer.id)
                                }
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
