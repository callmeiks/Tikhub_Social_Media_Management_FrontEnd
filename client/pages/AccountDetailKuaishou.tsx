import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient, type KuaishouInfluencer, type KuaishouPost } from "@/lib/api";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AvatarImage } from "@/components/ui/avatar-image";
import { VideoModal } from "@/components/shared/VideoModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  MapPin,
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  RefreshCw,
  Play,
  Star,
  Shield,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileSpreadsheet,
  AlertTriangle,
} from "lucide-react";
import {
  formatNumber,
  formatDateTime,
  formatDuration,
  getPlatformDisplayName,
  getPlatformBadgeConfig,
  exportAccountToExcel,
} from "@/utils/accountUtils";

// Kuaishou specific components
const KuaishouAccountFields: React.FC<{ account: KuaishouInfluencer }> = ({ account }) => {
  const badgeConfig = getPlatformBadgeConfig("kuaishou");
  
  return (
    <div className="space-y-4">

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-medium">基本信息</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">性别:</span>
              <span>{account.user_sex === "M" ? "男" : account.user_sex === "F" ? "女" : "未知"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">星座:</span>
              <span>{account.constellation || "未知"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">私密作品:</span>
              <span>{formatNumber(account.photo_private_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">动态开启:</span>
              <span>{account.enable_moment ? "是" : "否"}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">隐私设置</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">隐私用户:</span>
              <span>{account.privacy_user === "1" ? "是" : "否"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">手机号查找:</span>
              <span>{account.not_allow_find_me_by_mobile === "1" ? "禁止" : "允许"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">QQ好友推荐:</span>
              <span>{account.not_recommend_to_qq_friends === "1" ? "禁止" : "允许"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">通讯录推荐:</span>
              <span>{account.not_recommend_to_contacts === "1" ? "禁止" : "允许"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">同关注拒绝:</span>
              <span>{account.show_same_follow_deny === "1" ? "是" : "否"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">常联系人拒绝:</span>
              <span>{account.frequent_user_deny === "1" ? "是" : "否"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">熟人拒绝:</span>
              <span>{account.acquaintance_deny === "1" ? "是" : "否"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">下载拒绝:</span>
              <span>{account.download_deny === "1" ? "是" : "否"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">分享水印:</span>
              <span>{account.photo_share_add_watermark === "1" ? "是" : "否"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">附近在线状态:</span>
              <span>{account.disable_nearby_online_status === "1" ? "关闭" : "开启"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">消息在线状态:</span>
              <span>{account.disable_im_online_status === "1" ? "关闭" : "开启"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">允许打赏:</span>
              <span>{account.allow_others_reward_me === "1" ? "是" : "否"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">账号状态</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${account.is_user_banned ? 'bg-red-500' : 'bg-green-500'}`} />
            <span>{account.is_user_banned ? "已封禁" : "正常"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>更新时间: {formatDateTime(account.updated_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 快手作品详情展示组件
const KuaishouPostDetails: React.FC<{ post: KuaishouPost }> = ({ post }) => {
  return (
    <div className="bg-gray-50 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            基本信息
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">作品ID:</span>
              <span className="font-medium text-xs break-all">{post.photo_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">作者:</span>
              <span className="font-medium">{post.author_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">时长:</span>
              <span className="font-medium">
                {formatDuration(post.video_duration)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">发布时间:</span>
              <span className="font-medium">
                {formatDateTime(post.create_time)}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            互动数据
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">点赞:</span>
              <span className="font-medium">{formatNumber(post.like_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">评论:</span>
              <span className="font-medium">{formatNumber(post.comment_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">分享:</span>
              <span className="font-medium">{formatNumber(post.share_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">播放:</span>
              <span className="font-medium">{formatNumber(post.view_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">收藏:</span>
              <span className="font-medium">{formatNumber(post.collect_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">打赏:</span>
              <span className="font-medium">{formatNumber(post.reward_count)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {post.sound_track_artist && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            音乐信息
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">音乐作者:</span>
              <span className="font-medium">{post.sound_track_artist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">音乐ID:</span>
              <span className="font-medium text-xs break-all">{post.sound_track_id}</span>
            </div>
            {post.sound_track_audio_url && (
              <div className="flex justify-between">
                <span className="text-gray-600">音乐链接:</span>
                <a
                  href={post.sound_track_audio_url}
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
    </div>
  );
};

const KuaishouPostsList: React.FC<{ 
  posts: KuaishouPost[], 
  loading: boolean, 
  onRefresh: () => void 
}> = ({ posts, loading, onRefresh }) => {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const handlePlayVideo = (post: KuaishouPost) => {
    if (post.video_play_url) {
      setSelectedVideo({
        url: post.video_play_url,
        title: post.video_caption || "快手视频"
      });
    }
  };

  const getPostStats = (post: KuaishouPost) => {
    return {
      likes: formatNumber(post.like_count || 0),
      comments: formatNumber(post.comment_count || 0),
      shares: formatNumber(post.share_count || 0),
      views: formatNumber(post.view_count || 0),
      collects: formatNumber(post.collect_count || 0),
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">作品详情</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>正在加载作品数据...</p>
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
                    <TableRow className={isExpanded ? "bg-gray-50" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div
                            className="relative w-20 h-14 rounded overflow-hidden bg-gray-200 cursor-pointer group"
                            onClick={() => handlePlayVideo(post)}
                          >
                            {post.video_play_url ? (
                              <>
                                <video
                                  className="absolute top-0 left-0 w-full h-full object-cover"
                                  src={post.video_play_url}
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
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-200">
                                <Play className="h-4 w-4 text-yellow-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div
                              className="max-w-[180px] truncate font-medium text-sm"
                              title={post.video_caption || "无标题"}
                            >
                              {post.video_caption || "无标题"}
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
                          onClick={() => {
                            if (post.share_url) {
                              window.open(`https://www.kuaishou.com/short-video/${post.share_url}`, "_blank");
                            }
                          }}
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
                            setExpandedPostId(isExpanded ? null : post.id)
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
                          <KuaishouPostDetails post={post} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
};

export default function AccountDetailKuaishou() {
  const { platform, accountId } = useParams<{
    platform: string;
    accountId: string;
  }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<KuaishouInfluencer | null>(null);
  const [posts, setPosts] = useState<KuaishouPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  const handleBackClick = () => {
    navigate("/data-collection/account-interaction");
  };

  const getDisplayFollowers = (account: KuaishouInfluencer): string => {
    return formatNumber(account.follower_count || 0);
  };

  const getDisplayWorks = (account: KuaishouInfluencer): number => {
    return account.post_count || 0;
  };

  useEffect(() => {
    const loadAccountData = async () => {
      setLoading(true);
      console.log("Loading account data for accountId:", accountId);
      
      try {
        // 首先尝试从 sessionStorage 获取数据
        const storedAccount = sessionStorage.getItem("selectedAccount");
        if (storedAccount) {
          const parsedAccount = JSON.parse(storedAccount);
          console.log("Found stored account:", parsedAccount);
          if (parsedAccount.platform === "kuaishou" && parsedAccount.id === accountId) {
            setAccount(parsedAccount as KuaishouInfluencer);
            setLoading(false);
            return;
          }
        }

        // 如果 sessionStorage 没有数据或数据不匹配，从 API 获取
        if (accountId) {
          console.log("Fetching account data from API for accountId:", accountId);
          const accountData = await apiClient.getAccountDetail(accountId);
          console.log("Retrieved account data:", accountData);
          if (accountData.platform === "kuaishou") {
            setAccount(accountData as KuaishouInfluencer);
          } else {
            console.error("Account platform mismatch:", accountData.platform);
          }
        }
      } catch (error) {
        console.error("Failed to load account data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, [accountId]);

  const fetchPosts = async () => {
    if (!account) {
      console.log("No account data available for fetching posts");
      return;
    }
    
    console.log("Fetching posts for user_id:", account.user_id);
    setPostsLoading(true);
    try {
      const response = await apiClient.getPosts({
        platform: "kuaishou",
        platform_user_id: account.user_id,
        page: 1,
        limit: 20,
      });
      console.log("Posts response:", response);
      setPosts(response.items as KuaishouPost[]);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchPosts();
    }
  }, [account]);

  const exportToExcel = () => {
    if (!account) return;
    exportAccountToExcel(account, posts, "快手");
  };

  if (loading) {
    return (
      <DashboardLayout title="加载中..." subtitle="正在加载快手账号详情">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!account) {
    return (
      <DashboardLayout title="快手账号详情" subtitle="快手账号数据详情">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">无法加载快手账号数据</h3>
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
      title={`${account.nickname} - 快手账号详情`}
      subtitle="快手账号数据详情及作品分析"
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
                src={account.avatar_url || ""}
                alt={account.nickname}
                fallbackText={account.nickname.charAt(0)}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-semibold">
                    {account.nickname}
                  </h2>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    ⚡ 快手
                  </Badge>
                  {account.is_verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Shield className="w-3 h-3 mr-1" />
                      已认证
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <div className="font-medium text-lg">
                      {getDisplayFollowers(account)}
                    </div>
                    <div className="text-muted-foreground">粉丝数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {getDisplayWorks(account)}
                    </div>
                    <div className="text-muted-foreground">作品数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {formatNumber(account.following_count)}
                    </div>
                    <div className="text-muted-foreground">关注数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {new Date(account.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-muted-foreground">添加时间</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <span>@{account.kwai_id}</span>
                    <span>ID: {account.user_id}</span>
                    {account.city_name && (
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {account.city_name}
                      </span>
                    )}
                  </div>
                </div>
                {account.user_text && (
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {account.user_text}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>详细信息</CardTitle>
          </CardHeader>
          <CardContent>
            <KuaishouAccountFields account={account} />
          </CardContent>
        </Card>

        {/* Posts Section */}
        <Card>
          <CardContent className="p-6">
            <KuaishouPostsList 
              posts={posts} 
              loading={postsLoading}
              onRefresh={fetchPosts}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}