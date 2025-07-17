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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <AvatarImage
            src={account.avatar_url}
            alt={account.nickname}
            fallbackText={account.nickname.charAt(0)}
            size="lg"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">{account.nickname}</h1>
              <Badge className={badgeConfig.color}>
                {badgeConfig.emoji} {getPlatformDisplayName("kuaishou")}
              </Badge>
              {account.is_verified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  已认证
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
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
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAccountToExcel(account, [], "快手")}
          >
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
        </div>
      </div>

      <Separator />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(account.follower_count)}
          </div>
          <div className="text-sm text-muted-foreground">粉丝</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {formatNumber(account.following_count)}
          </div>
          <div className="text-sm text-muted-foreground">关注</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {formatNumber(account.post_count)}
          </div>
          <div className="text-sm text-muted-foreground">作品</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {formatNumber(account.moment_count)}
          </div>
          <div className="text-sm text-muted-foreground">动态</div>
        </div>
      </div>

      {/* User Description */}
      {account.user_text && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">个人简介</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {account.user_text}
          </p>
        </div>
      )}

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

const KuaishouPostDetails: React.FC<{ 
  posts: KuaishouPost[], 
  loading: boolean, 
  onRefresh: () => void 
}> = ({ posts, loading, onRefresh }) => {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
  } | null>(null);

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
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">暂无作品数据</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                        <Play className="w-8 h-8 text-yellow-600" />
                      </div>
                      <button
                        onClick={() => setSelectedVideo({
                          url: post.video_play_url || "",
                          title: post.video_caption || "快手视频"
                        })}
                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                      >
                        <Play className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium line-clamp-2">
                        {post.video_caption || "无标题"}
                      </p>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedVideo({
                            url: post.video_play_url || "",
                            title: post.video_caption || "快手视频"
                          })}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          播放
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDateTime(post.create_time)}
                      </span>
                      {post.video_duration && (
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(post.video_duration)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {formatNumber(post.like_count || 0)}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {formatNumber(post.comment_count || 0)}
                      </span>
                      <span className="flex items-center">
                        <Share2 className="w-3 h-3 mr-1" />
                        {formatNumber(post.share_count || 0)}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {formatNumber(post.view_count || 0)}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {formatNumber(post.collect_count || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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

  if (loading) {
    return (
      <DashboardLayout title="账号详情">
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>正在加载账号数据...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!account) {
    return (
      <DashboardLayout title="账号详情">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">账号数据未找到</h2>
            <p className="text-muted-foreground mb-6">
              请从账号列表页面选择一个账号查看详情
            </p>
            <Button 
              onClick={() => navigate("/data-collection/account-interaction")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回账号列表</span>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`${account.nickname} - 快手账号详情`}
      actions={
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/data-collection/account-interaction")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>账号信息</CardTitle>
          </CardHeader>
          <CardContent>
            <KuaishouAccountFields account={account} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <KuaishouPostDetails 
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