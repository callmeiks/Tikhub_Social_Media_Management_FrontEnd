import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import douyinCityList from "../../douyin_city_list.json";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowLeft,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Play,
  ExternalLink,
  Calendar,
  TrendingUp,
  Video,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Image,
  FileSpreadsheet,
} from "lucide-react";
import {
  apiClient,
  type DouyinInfluencer,
  type DouyinPost,
  type Post,
} from "@/lib/api";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AvatarImage } from "@/components/ui/avatar-image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}千`;
  }
  return num.toString();
};

const formatDateTime = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp) * 1000);
  return (
    date.toLocaleDateString("zh-CN") +
    " " +
    date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  );
};

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// 抖音账号字段展示组件
const DouyinAccountFields: React.FC<{ account: DouyinInfluencer }> = ({
  account,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium">Sec User ID:</span>{" "}
          <span className="break-all text-xs">
            {account.sec_user_id || "N/A"}
          </span>
        </div>
        <div>
          <span className="font-medium">唯一标识:</span>{" "}
          {account.unique_id || "N/A"}
        </div>
        <div>
          <span className="font-medium">年龄:</span> {account.age || "N/A"}
        </div>
        <div>
          <span className="font-medium">性别:</span>{" "}
          {account.gender === 1 ? "男" : account.gender === 2 ? "女" : "未知"}
        </div>
        <div>
          <span className="font-medium">IP位置:</span>{" "}
          {account.ip_location || "N/A"}
        </div>
        <div>
          <span className="font-medium">关注数:</span>{" "}
          {formatNumber(account.following_count || 0)}
        </div>
        <div>
          <span className="font-medium">最高粉丝数:</span>{" "}
          {formatNumber(account.max_follower_count || 0)}
        </div>
        <div>
          <span className="font-medium">明星认证:</span>{" "}
          {account.is_star ? "是" : "否"}
        </div>
        <div>
          <span className="font-medium">特效师:</span>{" "}
          {account.is_effect_artist ? "是" : "否"}
        </div>
        <div>
          <span className="font-medium">政务媒体:</span>{" "}
          {account.is_gov_media_vip ? "是" : "否"}
        </div>
        <div>
          <span className="font-medium">直播带货:</span>{" "}
          {account.is_live_commerce ? "是" : "否"}
        </div>
        <div>
          <span className="font-medium">星图达人:</span>{" "}
          {account.is_xingtu_kol ? "是" : "否"}
        </div>
        <div>
          <span className="font-medium">商品橱窗:</span>{" "}
          {account.with_commerce_entry ? "是" : "否"}
        </div>
        <div>
          <span className="font-medium">融合店铺入口:</span>{" "}
          {account.with_fusion_shop_entry ? "是" : "否"}
        </div>
        <div>
          <span className="font-medium">新商品:</span>{" "}
          {account.with_new_goods ? "是" : "否"}
        </div>
      </div>

      {account.signature && (
        <div className="mt-4">
          <span className="font-medium">个人简介:</span> {account.signature}
        </div>
      )}

      {account.share_url && (
        <div className="mt-4">
          <span className="font-medium">分享链接:</span>{" "}
          <a
            href={account.share_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            查看
          </a>
        </div>
      )}
    </div>
  );
};

// 抖音作品详情组件
const DouyinPostDetails: React.FC<{
  post: DouyinPost;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ post, isOpen, onToggle }) => {
  if (!isOpen) return null;

  return (
    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 mx-4 mb-2">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
              基本信息
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">作品ID:</span>
                <span className="font-medium text-xs break-all">
                  {(post as any).aweme_id || "未知"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">时长:</span>
                <span className="font-medium">
                  {formatDuration(post.duration)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">拍摄方式:</span>
                <span className="font-medium">
                  {post.shoot_way || "未知"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">播放次数:</span>
                <span className="font-medium">
                  {formatNumber(post.play_count)}
                </span>
              </div>
              {post.video_url && (
                <div className="flex justify-between">
                  <span className="text-gray-600">播放链接:</span>
                  <a
                    href={post.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-xs"
                  >
                    查看视频
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
              状态信息
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">广告:</span>
                <Badge
                  variant={post.is_ads ? "destructive" : "outline"}
                  className="text-xs"
                >
                  {post.is_ads ? "是" : "否"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">置顶:</span>
                <Badge
                  variant={post.is_top ? "default" : "outline"}
                  className="text-xs"
                >
                  {post.is_top ? "是" : "否"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">带货:</span>
                <Badge
                  variant={post.with_goods ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {post.with_goods ? "是" : "否"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">作品警告:</span>
                <Badge
                  variant={
                    (post as any).is_warned
                      ? "destructive"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {(post as any).is_warned ? "是" : "否"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            位置信息
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">城市:</span>
              <span className="font-medium">
                {post.city &&
                douyinCityList[
                  post.city as keyof typeof douyinCityList
                ]
                  ? douyinCityList[
                      post.city as keyof typeof douyinCityList
                    ]
                  : post.city || "未知"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">地区:</span>
              <span className="font-medium">
                {post.region || "未知"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IP归属:</span>
              <span className="font-medium">
                {post.ip_attribution || "未知"}
              </span>
            </div>
          </div>
        </div>
        {post.music_author && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
              音乐信息
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">音乐作者:</span>
                <span className="font-medium">
                  {post.music_author}
                </span>
              </div>
              {post.music_duration && (
                <div className="flex justify-between">
                  <span className="text-gray-600">音乐时长:</span>
                  <span className="font-medium">
                    {formatDuration(post.music_duration * 1000)}
                  </span>
                </div>
              )}
              {post.music_play_url && (
                <div className="flex justify-between">
                  <span className="text-gray-600">音乐链接:</span>
                  <a
                    href={post.music_play_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-xs"
                  >
                    播放音乐
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
        {(post as any).cha_list &&
          (post as any).cha_list.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
                参与挑战
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(post as any).cha_list.map(
                  (cha: any, index: number) => (
                    <Badge
                      key={cha.cid || index}
                      variant="secondary"
                      className="text-xs"
                    >
                      #{cha.cha_name || cha.name}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

// 视频播放模态框
const VideoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}> = ({ isOpen, onClose, videoUrl, title }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <video
            className="absolute top-0 left-0 w-full h-full rounded-lg bg-black"
            controls
            autoPlay
            src={videoUrl}
          >
            <source src={videoUrl} type="video/mp4" />
            您的浏览器不支持视频播放。
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function AccountDetailDouyin() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState<DouyinInfluencer | null>(null);
  const [posts, setPosts] = useState<DouyinPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>("");
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>("");
  const postsPerPage = 20;

  useEffect(() => {
    // Get account data from sessionStorage
    const storedAccount = sessionStorage.getItem("selectedAccount");
    if (storedAccount) {
      try {
        const account = JSON.parse(storedAccount) as DouyinInfluencer;
        if (account.platform === "douyin") {
          setAccountData(account);
          fetchPosts(account);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to parse stored account data:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPosts = async (account: DouyinInfluencer) => {
    if (!account) return;

    setPostsLoading(true);
    try {
      const response = await apiClient.getPosts({
        platform: "douyin",
        platform_user_id: account.sec_user_id,
        page: currentPage,
        limit: postsPerPage,
        sort_by_time: 0, // newest first
      });

      setPosts(response.items as DouyinPost[]);
      setTotalPosts(response.total);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (accountData) {
      fetchPosts(accountData);
    }
  }, [currentPage]);

  const handleBackClick = () => {
    navigate("/data-collection/account-interaction");
  };

  const handlePlayVideo = (post: DouyinPost) => {
    if (post.video_url) {
      setSelectedVideoUrl(post.video_url);
      setSelectedVideoTitle(post.desc || "无标题");
      setVideoModalOpen(true);
    }
  };

  const exportToExcel = () => {
    if (!accountData) return;

    const wb = XLSX.utils.book_new();

    // User Info Sheet
    const userInfoHeaders = Object.keys(accountData);
    const userInfoData = [userInfoHeaders];
    const userInfoRow = userInfoHeaders.map((key) => {
      const value = (accountData as any)[key];
      if (value === null || value === undefined) return "";
      if (typeof value === "boolean") return value ? "是" : "否";
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    });
    userInfoData.push(userInfoRow);

    const userInfoWS = XLSX.utils.aoa_to_sheet(userInfoData);
    XLSX.utils.book_append_sheet(wb, userInfoWS, "User Info");

    // Posts Sheet
    if (posts.length > 0) {
      const allPostKeys = new Set<string>();
      posts.forEach((post) => {
        Object.keys(post).forEach((key) => allPostKeys.add(key));
      });

      const postsHeaders = Array.from(allPostKeys);
      const postsData = [postsHeaders];

      posts.forEach((post) => {
        const postRow = postsHeaders.map((key) => {
          const value = (post as any)[key];
          if (value === null || value === undefined) return "";
          if (typeof value === "boolean") return value ? "是" : "否";
          if (typeof value === "object") {
            if (Array.isArray(value)) {
              return value
                .map((item) =>
                  typeof item === "object"
                    ? JSON.stringify(item)
                    : String(item),
                )
                .join("; ");
            }
            return JSON.stringify(value);
          }
          return String(value);
        });
        postsData.push(postRow);
      });

      const postsWS = XLSX.utils.aoa_to_sheet(postsData);
      XLSX.utils.book_append_sheet(wb, postsWS, "User Posts");
    }

    const fileName = `${accountData.nickname}_抖音数据_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const getPostStats = (post: DouyinPost) => {
    return {
      likes: formatNumber(post.digg_count || 0),
      comments: formatNumber(post.comment_count || 0),
      shares: formatNumber(post.share_count || 0),
      views: formatNumber(post.play_count || 0),
      collects: formatNumber(post.collect_count || 0),
    };
  };

  const getDisplayFollowers = (account: DouyinInfluencer): string => {
    return formatNumber(account.follower_count || 0);
  };

  const getDisplayWorks = (account: DouyinInfluencer): number => {
    return account.aweme_count || 0;
  };

  const getDisplayLikes = (account: DouyinInfluencer): string => {
    return formatNumber(account.total_favorited || 0);
  };

  if (loading) {
    return (
      <DashboardLayout title="加载中..." subtitle="正在加载抖音账号详情">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!accountData) {
    return (
      <DashboardLayout title="抖音账号详情" subtitle="抖音账号数据详情">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">无法加载抖音账号数据</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            请从账号列表页面点击进入，或者账号数据可能已过期。
          </p>
          <Button onClick={handleBackClick} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回账号列表
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`${accountData.nickname} - 抖音账号详情`}
      subtitle="抖音账号数据详情及作品分析"
    >
      <div className="space-y-6">
        {/* Back Button and Actions */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="h-8"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            返回列表
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={exportToExcel}
            className="h-8"
          >
            <FileSpreadsheet className="mr-2 h-3.5 w-3.5" />
            导出Excel
          </Button>
        </div>

        {/* Account Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <AvatarImage
                src={accountData.avatar_url || ""}
                alt={accountData.nickname}
                fallbackText={accountData.nickname.charAt(0)}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-semibold">
                    {accountData.nickname}
                  </h2>
                  <Badge className="bg-red-100 text-red-800">
                    🎤 抖音
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <div className="font-medium text-lg">
                      {getDisplayFollowers(accountData)}
                    </div>
                    <div className="text-muted-foreground">粉丝数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {getDisplayWorks(accountData)}
                    </div>
                    <div className="text-muted-foreground">作品数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {getDisplayLikes(accountData)}
                    </div>
                    <div className="text-muted-foreground">获赞总数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {new Date(accountData.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-muted-foreground">添加时间</div>
                  </div>
                </div>
                <DouyinAccountFields account={accountData} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center">
                <Video className="mr-2 h-4 w-4" />
                作品数据 ({totalPosts})
              </span>
              <Badge variant="secondary" className="text-xs">
                共 {totalPosts} 个作品
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
                <p className="text-sm text-muted-foreground">
                  正在加载作品数据...
                </p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">暂无作品数据</h3>
                <p className="text-muted-foreground">
                  该账号暂无可显示的作品数据
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">作品信息</TableHead>
                        <TableHead className="w-[120px]">发布时间</TableHead>
                        <TableHead className="w-[100px]">点赞数</TableHead>
                        <TableHead className="w-[100px]">评论数</TableHead>
                        <TableHead className="w-[100px]">分享数</TableHead>
                        <TableHead className="w-[100px]">播放量</TableHead>
                        <TableHead className="w-[80px]">操作</TableHead>
                        <TableHead className="w-[50px]">详情</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => {
                        const stats = getPostStats(post);
                        const isExpanded = expandedPostId === post.id;
                        return (
                          <React.Fragment key={post.id}>
                            <TableRow
                              className={isExpanded ? "bg-gray-50" : ""}
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className="relative w-20 h-14 rounded overflow-hidden bg-gray-200 cursor-pointer group"
                                    onClick={() => handlePlayVideo(post)}
                                  >
                                    {post.video_url ? (
                                      <>
                                        <video
                                          className="absolute top-0 left-0 w-full h-full object-cover"
                                          src={post.video_url}
                                          muted
                                          preload="metadata"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                          <div className="bg-white rounded-full p-1.5 opacity-80 group-hover:opacity-100">
                                            <Play className="h-3 w-3 text-gray-700" />
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Play className="h-4 w-4 text-gray-500" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div
                                      className="max-w-[180px] truncate font-medium text-sm"
                                      title={post.desc || "无标题"}
                                    >
                                      {post.desc || "无标题"}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                  {formatDateTime(post.create_time)}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="flex items-center">
                                  <Heart className="h-3 w-3 mr-1 text-red-500" />
                                  {stats.likes}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="flex items-center">
                                  <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
                                  {stats.comments}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="flex items-center">
                                  <Share2 className="h-3 w-3 mr-1 text-purple-500" />
                                  {stats.shares}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                  {stats.views}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    window.open(post.share_url, "_blank")
                                  }
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-gray-100"
                                  onClick={() =>
                                    setExpandedPostId(
                                      isExpanded ? null : post.id,
                                    )
                                  }
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3" />
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                            {isExpanded && (
                              <TableRow>
                                <TableCell colSpan={8} className="p-0 border-0">
                                  <DouyinPostDetails
                                    post={post}
                                    isOpen={isExpanded}
                                    onToggle={() => setExpandedPostId(null)}
                                  />
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPosts > postsPerPage && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      显示第 {(currentPage - 1) * postsPerPage + 1} 到{" "}
                      {Math.min(currentPage * postsPerPage, totalPosts)} 项，共{" "}
                      {totalPosts} 项
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1 || postsLoading}
                      >
                        上一页
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={
                          currentPage * postsPerPage >= totalPosts ||
                          postsLoading
                        }
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={selectedVideoUrl}
        title={selectedVideoTitle}
      />
    </DashboardLayout>
  );
}