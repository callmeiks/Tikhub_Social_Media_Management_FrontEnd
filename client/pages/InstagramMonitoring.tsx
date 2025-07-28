import { useState } from "react";
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
  Camera,
} from "lucide-react";

// Sample monitoring data for Instagram content
const mockContentData = [
  {
    id: 1,
    title: "Sunset photography at Golden Hour 🌅",
    author: "photographymaster",
    url: "https://www.instagram.com/p/ABC123DEF456/",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-15 10:30",
    status: "active",
    type: "Photo",
    currentStats: {
      views: "45.2K",
      likes: "23.8K",
      comments: "892",
      shares: "156",
    },
    initialStats: {
      views: "38.9K",
      likes: "19.5K",
      comments: "734",
      shares: "125",
    },
  },
  {
    id: 2,
    title: "Travel vlog: Exploring Santorini 🇬🇷",
    author: "wanderlust_jenny",
    url: "https://www.instagram.com/reel/DEF456GHI789/",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-14 16:20",
    status: "active",
    type: "Reel",
    currentStats: {
      views: "187.3K",
      likes: "45.6K",
      comments: "2.1K",
      shares: "843",
    },
    initialStats: {
      views: "165.7K",
      likes: "38.9K",
      comments: "1.8K",
      shares: "721",
    },
  },
  {
    id: 3,
    title: "Modern minimalist home tour ✨",
    author: "homestyle_daily",
    url: "https://www.instagram.com/p/GHI789JKL012/",
    thumbnail: "/api/placeholder/120/120",
    addedAt: "2024-01-13 14:15",
    status: "active",
    type: "Photo",
    currentStats: {
      views: "78.5K",
      likes: "12.4K",
      comments: "534",
      shares: "289",
    },
    initialStats: {
      views: "65.2K",
      likes: "9.8K",
      comments: "412",
      shares: "201",
    },
  },
];

// Sample monitoring data for Instagram influencers
const mockInfluencerData = [
  {
    id: 1,
    username: "photographymaster",
    avatar: "/api/placeholder/60/60",
    url: "https://www.instagram.com/photographymaster/",
    addedAt: "2024-01-15 10:30",
    status: "active",
    verified: true,
    userType: "Creator",
    currentStats: {
      followers: "89.5K",
      following: "542",
      works: "1.2K",
      totalLikes: "2.3M",
    },
    initialStats: {
      followers: "87.2K",
      following: "538",
      works: "1.18K",
      totalLikes: "2.2M",
    },
    recentActivity: {
      postsThisWeek: 4,
      avgLikes: "23.8K",
      avgComments: "892",
      engagementRate: "27.5%",
    },
  },
  {
    id: 2,
    username: "wanderlust_jenny",
    avatar: "/api/placeholder/60/60",
    url: "https://www.instagram.com/wanderlust_jenny/",
    addedAt: "2024-01-14 16:20",
    status: "active",
    verified: false,
    userType: "Travel Influencer",
    currentStats: {
      followers: "245.8K",
      following: "1.8K",
      works: "892",
      totalLikes: "5.7M",
    },
    initialStats: {
      followers: "238.2K",
      following: "1.76K",
      works: "885",
      totalLikes: "5.5M",
    },
    recentActivity: {
      postsThisWeek: 6,
      avgLikes: "45.6K",
      avgComments: "2.1K",
      engagementRate: "19.8%",
    },
  },
  {
    id: 3,
    username: "homestyle_daily",
    avatar: "/api/placeholder/60/60",
    url: "https://www.instagram.com/homestyle_daily/",
    addedAt: "2024-01-13 14:15",
    status: "active",
    verified: true,
    userType: "Lifestyle Creator",
    currentStats: {
      followers: "156.3K",
      following: "892",
      works: "1.5K",
      totalLikes: "4.2M",
    },
    initialStats: {
      followers: "149.7K",
      following: "875",
      works: "1.47K",
      totalLikes: "3.9M",
    },
    recentActivity: {
      postsThisWeek: 5,
      avgLikes: "12.4K",
      avgComments: "534",
      engagementRate: "8.9%",
    },
  },
];

export default function InstagramMonitoring() {
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
  const [contentMonitoringInterval, setContentMonitoringInterval] = useState("1h");
  const [influencerMonitoringInterval, setInfluencerMonitoringInterval] = useState("1h");

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
      alert("请输入有效的Instagram内容链接");
      return;
    }

    setIsAddingContent(true);

    const newTasks = createTaskQueueItems(validContentUrls, () => true);
    setTaskQueue((prev) => [...prev, ...newTasks]);

    await processTaskQueue(newTasks, setTaskQueue, (task, i) => {
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
    });

    setContentUrls("");
    setValidContentUrls([]);
    setInvalidContentUrls([]);
    setContentUploadedFile(null);
    setIsAddingContent(false);
  };

  const handleAddInfluencerBatch = async () => {
    if (validInfluencerUrls.length === 0) {
      alert("请输入有效的Instagram用户主页链接");
      return;
    }

    setIsAddingInfluencer(true);

    const newTasks = createTaskQueueItems(validInfluencerUrls, () => false);
    setTaskQueue((prev) => [...prev, ...newTasks]);

    await processTaskQueue(newTasks, setTaskQueue, (task, i) => {
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
    });

    setInfluencerUrls("");
    setValidInfluencerUrls([]);
    setInvalidInfluencerUrls([]);
    setInfluencerUploadedFile(null);
    setIsAddingInfluencer(false);
  };

  const handleRemoveContent = (id: number) => {
    if (confirm("确定要���止监控这个内容吗？")) {
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
                <span className="text-sm">内容监控: {contentData.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  用户监控: {influencerData.length}
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
              内容监控 ({contentData.length})
            </TabsTrigger>
            <TabsTrigger value="influencer" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              用户监控 ({influencerData.length})
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
                    <Select value={contentMonitoringInterval} onValueChange={setContentMonitoringInterval}>
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
                    <Select value={influencerMonitoringInterval} onValueChange={setInfluencerMonitoringInterval}>
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
                    内容监控列表 ({contentData.length})
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
                      暂无监控内容，请先添加内容链接
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
                        <div className="relative h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Camera className="h-12 w-12 text-white/80" />
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
                                by @{content.author}
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
                                      <DialogTitle>内容监控趋势</DialogTitle>
                                      <DialogDescription>
                                        {content.title} - Instagram
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
                    用户监控列表 ({influencerData.length})
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
                      暂无监控用户，请先添加用户链接
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
                        <div className="relative h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold">
                              {influencer.username.charAt(0).toUpperCase()}
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
                                @{influencer.username}
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
                                帖子
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
                                        @{influencer.username} - Instagram
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <div className="text-center text-gray-500">
                                        📊 趋势图表开发中...
                                        <br />
                                        <span className="text-sm">
                                          将显示粉丝数、帖子数、获赞总数的时间趋势变化
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
