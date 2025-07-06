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
  UserCheck,
  Plus,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Video,
  ExternalLink,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Crown,
  Verified,
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
const mockInfluencerData = [
  {
    id: 1,
    username: "美妆达人小丽",
    platform: "抖音",
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
    trendData: [
      { date: "01-15", followers: 1502000, likes: 22800000, works: 124 },
      { date: "01-16", followers: 1545000, likes: 23100000, works: 125 },
      { date: "01-17", followers: 1568000, likes: 23400000, works: 127 },
    ],
  },
  {
    id: 2,
    username: "TechReviewer",
    platform: "TikTok",
    avatar: "/api/placeholder/60/60",
    url: "https://www.tiktok.com/@techreviewer",
    addedAt: "2024-01-14 16:20",
    status: "active",
    verified: true,
    userType: "认证用户",
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
    trendData: [
      { date: "01-14", followers: 2389000, likes: 34500000, works: 200 },
      { date: "01-15", followers: 2421000, likes: 35200000, works: 201 },
      { date: "01-16", followers: 2457000, likes: 35800000, works: 203 },
    ],
  },
];

export default function InfluencerMonitoring() {
  const [monitoringData, setMonitoringData] = useState(mockInfluencerData);
  const [newInfluencerUrl, setNewInfluencerUrl] = useState("");
  const [isAddingInfluencer, setIsAddingInfluencer] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  const validateUrl = (url: string) => {
    return supportedPlatforms.some((platform) => url.includes(platform.domain));
  };

  const getPlatformFromUrl = (url: string) => {
    const platform = supportedPlatforms.find((p) => url.includes(p.domain));
    return platform ? platform.name : "未知";
  };

  const handleAddInfluencer = async () => {
    if (!newInfluencerUrl.trim()) {
      alert("请输入达人链接");
      return;
    }

    if (!validateUrl(newInfluencerUrl)) {
      alert("不支持的平台链接，请检查链接格式");
      return;
    }

    setIsAddingInfluencer(true);
    // 模拟API调用
    setTimeout(() => {
      const newInfluencer = {
        id: Date.now(),
        username: "新添加的达人",
        platform: getPlatformFromUrl(newInfluencerUrl),
        avatar: "/api/placeholder/60/60",
        url: newInfluencerUrl,
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
        trendData: [],
      };

      setMonitoringData((prev) => [newInfluencer, ...prev]);
      setNewInfluencerUrl("");
      setIsAddingInfluencer(false);
      alert("达人监控添加成功！");
    }, 2000);
  };

  const handleRemoveInfluencer = (id: number) => {
    if (confirm("确定要停止监控这个达人吗？")) {
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
      title="达人监控"
      subtitle="实时监控达��账号的数据变化趋势"
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
              <UserCheck className="mr-2 h-4 w-4" />
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
              <UserCheck className="w-4 h-4" />
              监控列表
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  添加达人监控
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">达人主页链接</label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="请粘贴达人主页链接..."
                      value={newInfluencerUrl}
                      onChange={(e) => setNewInfluencerUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddInfluencer}
                      disabled={isAddingInfluencer || !newInfluencerUrl.trim()}
                      className="px-6"
                    >
                      {isAddingInfluencer ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      {isAddingInfluencer ? "添加中..." : "添加监控"}
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    💡
                    支持抖音、小红书、快手、B站、微博、TikTok、Instagram、X、YouTube等平台
                  </div>
                </div>

                {/* URL validation feedback */}
                {newInfluencerUrl && (
                  <div className="flex items-center space-x-2 text-sm">
                    {validateUrl(newInfluencerUrl) ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">
                          检测到 {getPlatformFromUrl(newInfluencerUrl)} 平台链接
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">
                          不支持的平台链接，请检查链接格式
                        </span>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <UserCheck className="mr-2 h-4 w-4" />
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
                          <TableHead className="w-[100px]">平台</TableHead>
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
                        {monitoringData.map((influencer) => (
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
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {influencer.platform}
                              </Badge>
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
                                      onClick={() =>
                                        setSelectedInfluencer(influencer)
                                      }
                                    >
                                      <BarChart3 className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>达人监控趋势</DialogTitle>
                                      <DialogDescription>
                                        {influencer.username} -{" "}
                                        {influencer.platform}
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
