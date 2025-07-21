import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  DollarSign,
  Calendar,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  MapPin,
  UserCheck,
  Award,
  Zap,
  PieChart,
  Activity,
  Link,
  Search,
  Download,
  ExternalLink,
  Plus,
  CheckCircle,
} from "lucide-react";
import { 
  apiClient, 
  type DouyinInfluencer, 
  type DouyinKolFetchInfoRequest,
  type DouyinKolInfo,
  type DouyinKolListParams
} from "@/lib/api";
import { AvatarImage } from "@/components/ui/avatar-image";

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}千`;
  }
  return num.toString();
};

const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

// 模拟历史KOL数据
const mockHistoryKOLs: DouyinInfluencer[] = [
  {
    id: "1",
    task_id: "task-001",
    sec_user_id: "MS4wLjABAAAA1",
    unique_id: "fashionista_lily",
    nickname: "时尚达人Lily",
    avatar_url: "/placeholder.svg",
    signature: "分享时尚穿搭，传递美好生活 ✨",
    follower_count: 1580000,
    following_count: 1200,
    aweme_count: 456,
    total_favorited: 25800000,
    gender: 2,
    age: 28,
    ip_location: "北京",
    is_star: false,
    is_effect_artist: false,
    is_gov_media_vip: false,
    is_live_commerce: true,
    is_xingtu_kol: true,
    with_commerce_entry: true,
    with_fusion_shop_entry: true,
    with_new_goods: true,
    max_follower_count: 1600000,
    platform: "douyin",
    created_at: "2024-03-15T10:30:00Z",
    updated_at: new Date().toISOString(),
    share_url: "https://www.douyin.com/user/1",
  },
  {
    id: "2",
    task_id: "task-002",
    sec_user_id: "MS4wLjABAAAA2",
    unique_id: "beauty_queen",
    nickname: "美妆女王Mia",
    avatar_url: "/placeholder.svg",
    signature: "专业美妆博主 | 护肤达人 💄",
    follower_count: 2350000,
    following_count: 890,
    aweme_count: 623,
    total_favorited: 45600000,
    gender: 2,
    age: 25,
    ip_location: "上海",
    is_star: false,
    is_effect_artist: false,
    is_gov_media_vip: false,
    is_live_commerce: true,
    is_xingtu_kol: true,
    with_commerce_entry: true,
    with_fusion_shop_entry: false,
    with_new_goods: true,
    max_follower_count: 2400000,
    platform: "douyin",
    created_at: "2024-03-10T14:20:00Z",
    updated_at: new Date().toISOString(),
    share_url: "https://www.douyin.com/user/2",
  },
  {
    id: "3",
    task_id: "task-003",
    sec_user_id: "MS4wLjABAAAA3",
    unique_id: "fitness_coach",
    nickname: "健身教练Max",
    avatar_url: "/placeholder.svg",
    signature: "专业健身指导 | 健康生活方式推广者 💪",
    follower_count: 980000,
    following_count: 650,
    aweme_count: 345,
    total_favorited: 15200000,
    gender: 1,
    age: 32,
    ip_location: "广州",
    is_star: false,
    is_effect_artist: false,
    is_gov_media_vip: false,
    is_live_commerce: false,
    is_xingtu_kol: true,
    with_commerce_entry: false,
    with_fusion_shop_entry: false,
    with_new_goods: false,
    max_follower_count: 1000000,
    platform: "douyin",
    created_at: "2024-03-08T09:15:00Z",
    updated_at: new Date().toISOString(),
    share_url: "https://www.douyin.com/user/3",
  },
];

export default function DouyinKolAnalysis() {
  const { kolId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [kolUrls, setKolUrls] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedKOLs, setSelectedKOLs] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("created_at");
  const [urlCount, setUrlCount] = useState(0);
  const [addResult, setAddResult] = useState<any>(null);
  const [historyKOLs, setHistoryKOLs] = useState<DouyinKolInfo[]>([]);
  const [totalKOLs, setTotalKOLs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // 计算URL数量
  useEffect(() => {
    const urls = kolUrls
      .split("\n")
      .filter((url) => url.trim() && url.includes("douyin.com"));
    setUrlCount(urls.length);
  }, [kolUrls]);

  // 获取KOL历史数据
  const fetchKOLHistory = async () => {
    setLoading(true);
    try {
      const params: DouyinKolListParams = {
        page: currentPage,
        limit: 20,
        nickname: searchKeyword || undefined,
        sort_by_fans: sortBy === "follower_count"
      };
      
      const response = await apiClient.getDouyinKolList(params);
      setHistoryKOLs(response.kols);
      setTotalKOLs(response.total);
    } catch (error) {
      console.error("获取KOL历史数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和搜索条件变化时重新获取数据
  useEffect(() => {
    fetchKOLHistory();
  }, [currentPage, searchKeyword, sortBy]);

  const handleBackClick = () => {
    navigate("/kol-search-analysis/douyin-search");
  };

  // 处理添加KOL
  const handleAddKOLs = async () => {
    if (!kolUrls.trim()) return;

    setAddLoading(true);
    try {
      const urls = kolUrls
        .split("\n")
        .filter((url) => url.trim() && url.includes("douyin.com"));

      const response = await apiClient.fetchDouyinKolInfo({ urls });
      
      setAddResult({
        total_successful: response.total_successful,
        total_failed: response.total_failed,
        failed_urls: response.failed_urls,
        celery_tasks: response.celery_tasks
      });

      // 如果添加成功，刷新历史数据
      if (response.total_successful > 0) {
        setTimeout(() => {
          fetchKOLHistory();
        }, 1000);
      }

      // 清空输入框
      setTimeout(() => {
        setKolUrls("");
        setAddResult(null);
      }, 5000);
    } catch (error) {
      console.error("添加KOL失败:", error);
      setAddResult({
        total_successful: 0,
        total_failed: urlCount,
        failed_urls: ["添加失败: " + (error instanceof Error ? error.message : "未知错误")],
        celery_tasks: []
      });
    } finally {
      setAddLoading(false);
    }
  };

  // 处理KOL点击，跳转到详情分析
  const handleKOLClick = (kol: DouyinKolInfo) => {
    // 转换DouyinKolInfo为DouyinInfluencer格式以保持兼容性，并包含新增字段
    const transformedKol: DouyinInfluencer & {
      mcn_id?: string;
      mcn_name?: string;
      kol_id?: string;
      is_online?: boolean;
      is_game_author?: boolean;
      is_plan_author?: boolean;
    } = {
      id: kol.id,
      task_id: kol.kol_id,
      sec_user_id: kol.sec_user_id || "",
      unique_id: kol.unique_id,
      nickname: kol.nick_name,
      avatar_url: kol.avatar_uri,
      signature: `${kol.city} · ${kol.gender === "female" ? "女" : "男"}`,
      follower_count: kol.follower_count,
      following_count: 0, // API中没有此字段
      aweme_count: 0, // API中没有此字段
      total_favorited: 0, // API中没有此字段
      gender: kol.gender === "female" ? 2 : 1,
      age: kol.age || 0,
      ip_location: kol.city || kol.province,
      is_star: kol.is_star,
      is_effect_artist: false,
      is_gov_media_vip: false,
      is_live_commerce: kol.e_commerce_enable,
      is_xingtu_kol: kol.is_star,
      with_commerce_entry: kol.e_commerce_enable,
      with_fusion_shop_entry: false,
      with_new_goods: false,
      max_follower_count: kol.follower_count,
      platform: "douyin",
      created_at: kol.created_at,
      updated_at: kol.updated_at,
      share_url: `https://www.douyin.com/user/${kol.core_user_id}`,
      // 新增字段
      mcn_id: kol.mcn_id,
      mcn_name: kol.mcn_name,
      kol_id: kol.kol_id,
      is_online: kol.is_online,
      is_game_author: kol.is_game_author,
      is_plan_author: kol.is_plan_author,
      e_commerce_enable: kol.e_commerce_enable,
    };
    
    // 保存选中的KOL数据
    sessionStorage.setItem("selectedKol", JSON.stringify(transformedKol));
    // 导航到详情分析页面
    navigate(`/kol-search-analysis/douyin-analysis/${kol.id}`);
  };

  // 显示的KOL数据（服务器端已经过滤和排序）
  const displayKOLs = historyKOLs;

  // 获取总数据统计
  const totalStats = {
    totalKOLs: totalKOLs,
    totalFollowers: historyKOLs.reduce(
      (sum, kol) => sum + kol.follower_count,
      0,
    ),
    totalLikes: 0, // API中没有total_favorited字段
    avgFollowers: historyKOLs.length > 0 ? Math.round(
      historyKOLs.reduce((sum, kol) => sum + kol.follower_count, 0) /
        historyKOLs.length,
    ) : 0,
    xingtuKOLs: historyKOLs.filter((kol) => kol.is_star).length,
    liveCommerceKOLs: historyKOLs.filter((kol) => kol.e_commerce_enable).length,
  };

  return (
    <DashboardLayout
      title="抖音KOL分析"
      subtitle="添加和管理抖音KOL，深度分析KOL数据表现"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="h-8"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            返回搜索
          </Button>
          <div className="text-sm text-muted-foreground">
            最后更新: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Main Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="add" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
                <TabsTrigger
                  value="add"
                  className="flex items-center gap-2 rounded-none"
                >
                  <Link className="w-4 h-4" />
                  添加KOL
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center gap-2 rounded-none"
                >
                  <Users className="w-4 h-4" />
                  历史KOL数据
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2 rounded-none"
                >
                  <BarChart3 className="w-4 h-4" />
                  总数据展示
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                {/* 添加KOL Tab */}
                <TabsContent value="add" className="mt-0">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center">
                          <Link className="mr-2 h-4 w-4" />
                          批量添加抖音KOL链接
                        </span>
                        <Badge
                          variant={urlCount > 20 ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {urlCount}/20
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          抖音KOL主页链接 (每行一个链接，最多20个)
                        </label>
                        <Textarea
                          placeholder={`请输入抖音KOL主页链接，每行一个，例如：
https://www.douyin.com/user/MS4wLjABAAAA...
https://www.douyin.com/user/MS4wLjABAAAA...`}
                          value={kolUrls}
                          onChange={(e) => setKolUrls(e.target.value)}
                          rows={8}
                          className="font-mono text-sm"
                        />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>支持格式: douyin.com/user/* 链接</span>
                          <span className={urlCount > 20 ? "text-red-500" : ""}>
                            已输入 {urlCount} 个链接
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          onClick={handleAddKOLs}
                          disabled={
                            !kolUrls.trim() ||
                            urlCount === 0 ||
                            urlCount > 20 ||
                            addLoading
                          }
                          className="flex-1"
                        >
                          {addLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              添加中...
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              添加到分析队列
                            </>
                          )}
                        </Button>
                      </div>

                      {/* 添加结果 */}
                      {addResult && (
                        <Card className="border-green-200 bg-green-50">
                          <CardContent className="pt-4">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="space-y-2 flex-1">
                                <div className="font-medium text-green-800">
                                  添加完成
                                </div>
                                <div className="text-sm text-green-700">
                                  <span className="text-sm text-green-800">
                                    成功添加 {addResult.total_successful}{" "}
                                    个KOL到分析队列
                                  </span>
                                  {addResult.total_failed > 0 && (
                                    <span className="text-red-600 ml-2">
                                      失败 {addResult.total_failed} 个
                                    </span>
                                  )}
                                </div>
                                {addResult.total_failed > 0 && (
                                  <div className="text-xs text-red-600">
                                    失败原因: {addResult.failed_urls[0]?.error}
                                  </div>
                                )}
                                <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
                                  <p className="text-xs text-green-800">
                                    💡 成功添加后请到{" "}
                                    <strong>历史KOL数据</strong> 查看和分析
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* 使用说明 */}
                      <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="font-medium text-blue-800 text-sm">
                              使用说明
                            </div>
                            <div className="text-sm text-blue-700 space-y-1">
                              <p>• 支持批量添加抖音KOL主页链接</p>
                              <p>• 每行输入一个链接，最多支持20个</p>
                              <p>• 添加成功后可在"历史KOL数据"中查看详细分析</p>
                              <p>• 点击任意KOL可跳转到详细分析页面</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 历史KOL数据 Tab */}
                <TabsContent value="history" className="mt-0">
                  <div className="space-y-4">
                    {/* 搜索和筛选 */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="搜索KOL昵称或抖音号..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="created_at">添加时间</SelectItem>
                            <SelectItem value="follower_count">
                              粉丝数
                            </SelectItem>
                            <SelectItem value="total_favorited">
                              获赞数
                            </SelectItem>
                            <SelectItem value="aweme_count">作品数</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        共 {totalKOLs} 个KOL
                      </Badge>
                    </div>

                    {/* KOL列表 */}
                    <Card>
                      <CardContent className="p-0">
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[300px]">
                                  KOL信息
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  粉丝数
                                </TableHead>
                                <TableHead className="w-[120px]">
                                  MCN机构
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  是否带货
                                </TableHead>
                                <TableHead className="w-[120px]">
                                  标签
                                </TableHead>
                                <TableHead className="w-[120px]">
                                  添加时间
                                </TableHead>
                                <TableHead className="w-[80px]">操作</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {loading ? (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center py-8">
                                    <RefreshCw className="h-6 w-6 mx-auto animate-spin text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">加载中...</p>
                                  </TableCell>
                                </TableRow>
                              ) : displayKOLs.map((kol) => (
                                <TableRow
                                  key={kol.id}
                                  className="cursor-pointer hover:bg-gray-50"
                                  onClick={() => handleKOLClick(kol)}
                                >
                                  <TableCell>
                                    <div className="flex items-center space-x-3">
                                      <AvatarImage
                                        src={kol.avatar_uri || ""}
                                        alt={kol.nick_name}
                                        fallbackText={kol.nick_name.charAt(0)}
                                        size="md"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm">
                                          {kol.nick_name}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                          @{kol.unique_id}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                          📍 {kol.city || kol.province} ·{" "}
                                          {kol.gender === "female" ? "女" : "男"} ·{" "}
                                          {kol.age || "未知"}岁
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {formatNumber(kol.follower_count)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      {kol.mcn_name || '-'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge 
                                      variant={kol.e_commerce_enable ? "default" : "outline"}
                                      className="text-xs"
                                    >
                                      {kol.e_commerce_enable ? '是' : '否'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                      {kol.is_star && (
                                        <Badge
                                          variant="default"
                                          className="text-xs"
                                        >
                                          <Star className="mr-1 h-2 w-2" />
                                          星图
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground">
                                    {new Date(
                                      kol.created_at,
                                    ).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`https://www.douyin.com/user/${kol.core_user_id}`, "_blank");
                                      }}
                                      title="访问主页"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>

                    {!loading && displayKOLs.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          {searchKeyword ? "未找到匹配的KOL" : "暂无KOL数据"}
                        </h3>
                        <p className="text-muted-foreground">
                          {searchKeyword
                            ? "请尝试不同的搜索关键词"
                            : "请先在'添加KOL'中添加抖音KOL链接"}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 总数据展示 Tab */}
                <TabsContent value="overview" className="mt-0">
                  <div className="space-y-6">
                    {/* 总览数据卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                            <div className="text-3xl font-bold">
                              {totalStats.totalKOLs}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              已添加的KOL总数
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                            <div className="text-3xl font-bold">
                              {formatNumber(totalStats.totalFollowers)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              总粉丝数
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <Star className="h-8 w-8 mx-auto mb-2 text-green-500" />
                            <div className="text-3xl font-bold">
                              {totalStats.xingtuKOLs}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              星图达人数
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                            <div className="text-3xl font-bold">
                              {formatNumber(totalStats.avgFollowers)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              平均粉丝数
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <DollarSign className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                            <div className="text-3xl font-bold">
                              {totalStats.liveCommerceKOLs}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              带货达人
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 详细统计图表 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <PieChart className="mr-2 h-4 w-4" />
                            KOL类型分布
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">星图达人</span>
                              <span className="font-medium">
                                {totalStats.xingtuKOLs} (
                                {totalStats.totalKOLs > 0 ? (
                                  (totalStats.xingtuKOLs /
                                    totalStats.totalKOLs) *
                                  100
                                ).toFixed(1) : 0}
                                %)
                              </span>
                            </div>
                            <Progress
                              value={
                                totalStats.totalKOLs > 0 ? (totalStats.xingtuKOLs / totalStats.totalKOLs) * 100 : 0
                              }
                              className="h-2"
                            />

                            <div className="flex items-center justify-between">
                              <span className="text-sm">带货达人</span>
                              <span className="font-medium">
                                {totalStats.liveCommerceKOLs} (
                                {totalStats.totalKOLs > 0 ? (
                                  (totalStats.liveCommerceKOLs /
                                    totalStats.totalKOLs) *
                                  100
                                ).toFixed(1) : 0}
                                %)
                              </span>
                            </div>
                            <Progress
                              value={
                                totalStats.totalKOLs > 0 ? (totalStats.liveCommerceKOLs /
                                  totalStats.totalKOLs) *
                                100 : 0
                              }
                              className="h-2"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            地域分布
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {["北京", "上海", "广州", "深圳"].map((city) => {
                              const count = historyKOLs.filter(
                                (kol) => kol.city === city || kol.province === city,
                              ).length;
                              const percentage =
                                totalStats.totalKOLs > 0 ? (count / totalStats.totalKOLs) * 100 : 0;
                              return (
                                <div
                                  key={city}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm">{city}</span>
                                  <span className="font-medium">
                                    {count} ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
