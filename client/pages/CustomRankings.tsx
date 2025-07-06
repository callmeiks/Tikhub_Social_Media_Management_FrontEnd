import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trophy,
  Plus,
  Settings,
  Eye,
  Heart,
  Users,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Calendar,
  Filter,
  Edit,
  Trash2,
  Star,
} from "lucide-react";

const rankingTypes = [
  { id: "content", name: "作品榜单", icon: "🎬" },
  { id: "influencer", name: "达人榜单", icon: "👑" },
  { id: "trend", name: "趋势榜单", icon: "📈" },
  { id: "engagement", name: "互动榜单", icon: "💬" },
];

const timeRanges = [
  { id: "1day", name: "24小时" },
  { id: "3days", name: "3天" },
  { id: "7days", name: "7天" },
  { id: "30days", name: "30天" },
];

const platforms = [
  { id: "douyin", name: "抖音", emoji: "🎤" },
  { id: "xiaohongshu", name: "小红书", emoji: "📖" },
  { id: "kuaishou", name: "快手", emoji: "⚡" },
  { id: "bilibili", name: "哔哩哔哩", emoji: "📺" },
  { id: "weibo", name: "微博", emoji: "🎭" },
  { id: "tiktok", name: "TikTok", emoji: "🎵" },
  { id: "instagram", name: "Instagram", emoji: "📷" },
  { id: "x", name: "X", emoji: "🐦" },
  { id: "youtube", name: "YouTube", emoji: "📹" },
];

// Sample rankings data
const mockRankings = [
  {
    id: 1,
    name: "抖音美妆热门榜",
    type: "content",
    platform: "抖音",
    timeRange: "24小时",
    sortBy: "likes",
    description: "抖音平台美妆相关热门作品榜单",
    itemCount: 50,
    lastUpdated: "2024-01-21 15:30",
    status: "active",
    keywords: ["美妆", "护肤", "化妆"],
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "小红书生活达人榜",
    type: "influencer",
    platform: "小红书",
    timeRange: "7天",
    sortBy: "followers",
    description: "小红书平台生活方式相关达人榜单",
    itemCount: 100,
    lastUpdated: "2024-01-21 12:00",
    status: "active",
    keywords: ["生活", "家居", "穿搭"],
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "TikTok科技趋势榜",
    type: "trend",
    platform: "TikTok",
    timeRange: "3天",
    sortBy: "growth",
    description: "TikTok平台科技相关趋势榜单",
    itemCount: 30,
    lastUpdated: "2024-01-21 10:15",
    status: "paused",
    keywords: ["科技", "数码", "AI"],
    createdAt: "2024-01-12",
  },
];

export default function CustomRankings() {
  const [rankings, setRankings] = useState(mockRankings);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState(null);

  // New ranking form state
  const [newRanking, setNewRanking] = useState({
    name: "",
    type: "",
    platform: "",
    timeRange: "",
    sortBy: "",
    description: "",
    keywords: "",
    itemCount: 50,
  });

  const handleCreateRanking = () => {
    if (!newRanking.name || !newRanking.type || !newRanking.platform) {
      alert("请填写必填字段");
      return;
    }

    setIsCreating(true);
    setTimeout(() => {
      const ranking = {
        id: Date.now(),
        ...newRanking,
        keywords: newRanking.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        lastUpdated: new Date().toLocaleString("zh-CN"),
        status: "active",
        createdAt: new Date().toLocaleDateString("zh-CN"),
      };

      setRankings((prev) => [ranking, ...prev]);
      setNewRanking({
        name: "",
        type: "",
        platform: "",
        timeRange: "",
        sortBy: "",
        description: "",
        keywords: "",
        itemCount: 50,
      });
      setIsCreating(false);
      alert("榜单创建成功！");
    }, 1500);
  };

  const handleDeleteRanking = (id: number) => {
    if (confirm("确定要删除这个自定义榜单吗？")) {
      setRankings((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            运行中
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Calendar className="h-3 w-3 mr-1" />
            已暂停
          </Badge>
        );
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    const typeObj = rankingTypes.find((t) => t.id === type);
    return typeObj ? typeObj.icon : "📊";
  };

  const getTypeName = (type: string) => {
    const typeObj = rankingTypes.find((t) => t.id === type);
    return typeObj ? typeObj.name : type;
  };

  const getPlatformEmoji = (platform: string) => {
    const platformObj = platforms.find((p) => p.name === platform);
    return platformObj ? platformObj.emoji : "📱";
  };

  return (
    <DashboardLayout
      title="自定义监控榜单"
      subtitle="创建和管理个性化的数据监控榜单"
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
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              创建榜单
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              榜单管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  创建自定义榜单
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">榜单名称 *</label>
                    <Input
                      placeholder="输入榜单名称"
                      value={newRanking.name}
                      onChange={(e) =>
                        setNewRanking((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">榜单类型 *</label>
                    <Select
                      value={newRanking.type}
                      onValueChange={(value) =>
                        setNewRanking((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择榜单类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {rankingTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.icon} {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">目标平台 *</label>
                    <Select
                      value={newRanking.platform}
                      onValueChange={(value) =>
                        setNewRanking((prev) => ({ ...prev, platform: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择平台" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform.id} value={platform.name}>
                            {platform.emoji} {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">统计周期</label>
                    <Select
                      value={newRanking.timeRange}
                      onValueChange={(value) =>
                        setNewRanking((prev) => ({ ...prev, timeRange: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择统计周期" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeRanges.map((range) => (
                          <SelectItem key={range.id} value={range.name}>
                            {range.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">排序依据</label>
                    <Select
                      value={newRanking.sortBy}
                      onValueChange={(value) =>
                        setNewRanking((prev) => ({ ...prev, sortBy: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择排序依据" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="likes">点赞数</SelectItem>
                        <SelectItem value="views">播放量</SelectItem>
                        <SelectItem value="comments">��论数</SelectItem>
                        <SelectItem value="shares">分享数</SelectItem>
                        <SelectItem value="followers">粉丝数</SelectItem>
                        <SelectItem value="growth">增长率</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">榜单数量</label>
                    <Select
                      value={newRanking.itemCount.toString()}
                      onValueChange={(value) =>
                        setNewRanking((prev) => ({
                          ...prev,
                          itemCount: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择榜单数量" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Top 10</SelectItem>
                        <SelectItem value="20">Top 20</SelectItem>
                        <SelectItem value="50">Top 50</SelectItem>
                        <SelectItem value="100">Top 100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">关键词过滤</label>
                  <Input
                    placeholder="输入关键词，用逗号分隔"
                    value={newRanking.keywords}
                    onChange={(e) =>
                      setNewRanking((prev) => ({
                        ...prev,
                        keywords: e.target.value,
                      }))
                    }
                  />
                  <div className="text-xs text-gray-500">
                    示例: 美妆,护肤,化妆品
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">榜单描述</label>
                  <Input
                    placeholder="输入榜单描述"
                    value={newRanking.description}
                    onChange={(e) =>
                      setNewRanking((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setNewRanking({
                        name: "",
                        type: "",
                        platform: "",
                        timeRange: "",
                        sortBy: "",
                        description: "",
                        keywords: "",
                        itemCount: 50,
                      })
                    }
                  >
                    重置
                  </Button>
                  <Button
                    onClick={handleCreateRanking}
                    disabled={isCreating}
                    className="brand-accent"
                  >
                    {isCreating ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {isCreating ? "创建中..." : "创建榜单"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Trophy className="mr-2 h-4 w-4" />
                    榜单管理 ({rankings.length})
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    运行中:{" "}
                    {rankings.filter((r) => r.status === "active").length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rankings.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      暂无自定义榜单，请先创建榜单
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rankings.map((ranking) => (
                      <div
                        key={ranking.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-lg">
                              {getTypeIcon(ranking.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium text-base">
                                  {ranking.name}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {getTypeName(ranking.type)}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {getPlatformEmoji(ranking.platform)}{" "}
                                  {ranking.platform}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {ranking.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {ranking.timeRange}
                                </span>
                                <span>
                                  <Filter className="h-3 w-3 inline mr-1" />
                                  {ranking.sortBy === "likes"
                                    ? "点赞排序"
                                    : ranking.sortBy === "views"
                                      ? "播放排序"
                                      : "其他排序"}
                                </span>
                                <span>
                                  <Trophy className="h-3 w-3 inline mr-1" />
                                  Top {ranking.itemCount}
                                </span>
                                <span>更新: {ranking.lastUpdated}</span>
                              </div>
                              {ranking.keywords &&
                                ranking.keywords.length > 0 && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <span className="text-xs text-muted-foreground">
                                      关键词:
                                    </span>
                                    {ranking.keywords.map((keyword, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {keyword}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(ranking.status)}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>榜单详情</DialogTitle>
                                  <DialogDescription>
                                    {ranking.name} - {ranking.platform}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <div className="text-center text-gray-500">
                                    📊 榜单数据开发中...
                                    <br />
                                    <span className="text-sm">
                                      将显示完整的榜单排名和详细数据
                                    </span>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteRanking(ranking.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
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
