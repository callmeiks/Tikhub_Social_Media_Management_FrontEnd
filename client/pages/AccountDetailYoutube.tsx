import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient, type YouTubeInfluencer, type YouTubePost } from "@/lib/api";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@/components/ui/avatar-image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileSpreadsheet,
  AlertTriangle,
  Play,
  Clock,
  Globe,
  CheckCircle,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Link as LinkIcon,
} from "lucide-react";
import {
  formatNumber,
  formatDateTime,
  formatDuration,
  getPlatformDisplayName,
  getPlatformBadgeConfig,
  exportAccountToExcel,
} from "@/utils/accountUtils";

// YouTube 平台特定组件
const YouTubeAccountFields: React.FC<{ account: YouTubeInfluencer }> = ({ account }) => {
  const badgeConfig = getPlatformBadgeConfig("youtube");
  
  return (
    <div className="space-y-4">
      {/* 基本信息 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-medium">基本信息</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">频道ID:</span>
              <span className="font-medium text-xs break-all">{account.channel_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">频道名称:</span>
              <span className="font-medium">{account.channel_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">认证状态:</span>
              <span className={`font-medium ${account.is_verified ? 'text-green-600' : 'text-gray-600'}`}>
                {account.is_verified ? '已认证' : '未认证'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">商务邮箱:</span>
              <span className="font-medium">{account.has_business_email ? "有" : "无"}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">统计信息</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">订阅数:</span>
              <span className="font-medium">{account.subscriber_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">视频数:</span>
              <span className="font-medium">{account.video_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">总观看数:</span>
              <span className="font-medium">{account.view_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">国家/地区:</span>
              <span className="font-medium">{account.country || "未知"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 社交媒体链接 */}
      <div className="space-y-2">
        <h3 className="font-medium">社交媒体链接</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {account.facebook_link && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center">
                <Facebook className="w-3 h-3 mr-1" />
                Facebook:
              </span>
              <a
                href={`https://${account.facebook_link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xs"
              >
                {account.facebook_link}
              </a>
            </div>
          )}
          {account.twitter_link && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center">
                <Twitter className="w-3 h-3 mr-1" />
                Twitter:
              </span>
              <a
                href={`https://${account.twitter_link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xs"
              >
                {account.twitter_link}
              </a>
            </div>
          )}
          {account.instagram_link && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center">
                <Instagram className="w-3 h-3 mr-1" />
                Instagram:
              </span>
              <a
                href={`https://${account.instagram_link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xs"
              >
                {account.instagram_link}
              </a>
            </div>
          )}
          {account.tiktok_link && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center">
                <Play className="w-3 h-3 mr-1" />
                TikTok:
              </span>
              <a
                href={`https://${account.tiktok_link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xs"
              >
                {account.tiktok_link}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 其他链接 */}
      {account.other_links && account.other_links.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">其他链接</h3>
          <div className="space-y-2">
            {account.other_links.map((link, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center">
                  <LinkIcon className="w-3 h-3 mr-1" />
                  {link.name}:
                </span>
                <a
                  href={`https://${link.endpoint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-xs"
                >
                  {link.endpoint}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 频道创建时间 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">频道创建时间</h3>
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{account.channel_creation_date}</span>
        </div>
      </div>
    </div>
  );
};

// YouTube 视频详情展示组件
const YouTubePostDetails: React.FC<{ post: YouTubePost }> = ({ post }) => {
  return (
    <div className="bg-gray-50 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            基本信息
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">视频ID:</span>
              <span className="font-medium text-xs break-all">{post.video_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">频道ID:</span>
              <span className="font-medium text-xs break-all">{post.channel_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">频道名称:</span>
              <span className="font-medium">{post.channel_name || "未知"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">时长:</span>
              <span className="font-medium">
                {formatDuration(post.length_seconds * 1000)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">发布时间:</span>
              <span className="font-medium">{post.published_time}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            互动数据
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">观看数:</span>
              <span className="font-medium">{formatNumber(post.view_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">点赞数:</span>
              <span className="font-medium">{formatNumber(post.like_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">评论数:</span>
              <span className="font-medium">{formatNumber(post.comment_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">频道认证:</span>
              <span className="font-medium">{post.is_channel_verified ? "是" : "否"}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 视频状态 */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
          视频状态
        </h4>
        <div className="flex flex-wrap gap-2">
          {post.is_live_stream && (
            <Badge variant="secondary" className="text-xs">
              <Play className="w-3 h-3 mr-1" />
              直播内容
            </Badge>
          )}
          {post.is_live_now && (
            <Badge variant="destructive" className="text-xs">
              <Play className="w-3 h-3 mr-1" />
              正在直播
            </Badge>
          )}
          {post.is_regionally_restricted && (
            <Badge variant="outline" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              地区限制
            </Badge>
          )}
        </div>
      </div>

      {/* 视频描述 */}
      {post.description && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            视频描述
          </h4>
          <div className="text-sm text-gray-600 bg-white p-3 rounded border max-h-32 overflow-y-auto">
            {post.description}
          </div>
        </div>
      )}

      {/* 媒体链接 */}
      {(post.video_play_url || post.audio_play_url) && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            媒体链接
          </h4>
          <div className="space-y-1">
            {post.video_play_url && (
              <a
                href={post.video_play_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xs block"
              >
                <Play className="w-3 h-3 mr-1 inline" />
                视频播放链接
              </a>
            )}
            {post.audio_play_url && (
              <a
                href={post.audio_play_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-xs block"
              >
                <Play className="w-3 h-3 mr-1 inline" />
                音频播放链接
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const YouTubePostsList: React.FC<{ 
  posts: YouTubePost[], 
  loading: boolean, 
  onRefresh: () => void 
}> = ({ posts, loading, onRefresh }) => {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const getPostStats = (post: YouTubePost) => {
    return {
      views: formatNumber(post.view_count || 0),
      likes: formatNumber(post.like_count || 0),
      comments: formatNumber(post.comment_count || 0),
      duration: formatDuration(post.length_seconds * 1000),
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">视频详情</h2>
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
          <p>正在加载视频数据...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">暂无视频数据</h3>
          <p className="text-muted-foreground">
            该频道暂无可显示的视频数据
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">视频内容</TableHead>
                <TableHead className="w-[120px]">发布时间</TableHead>
                <TableHead className="w-[100px]">观看数</TableHead>
                <TableHead className="w-[100px]">点赞数</TableHead>
                <TableHead className="w-[100px]">评论数</TableHead>
                <TableHead className="w-[80px]">时长</TableHead>
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
                          <div className="w-20 h-14 rounded overflow-hidden bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center flex-shrink-0">
                            <Play className="w-6 h-6 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div
                              className="max-w-[180px] truncate font-medium text-sm"
                              title={post.title || "无标题"}
                            >
                              {post.title || "无标题"}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {post.is_live_stream && (
                                <Badge variant="secondary" className="text-xs">
                                  <Play className="w-2 h-2 mr-1" />
                                  直播
                                </Badge>
                              )}
                              {post.is_live_now && (
                                <Badge variant="destructive" className="text-xs">
                                  <Play className="w-2 h-2 mr-1" />
                                  直播中
                                </Badge>
                              )}
                              {post.is_channel_verified && (
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle className="w-2 h-2 mr-1" />
                                  认证
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {post.published_time}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1 text-purple-500" />
                          {stats.views}
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
                          <MessageCircle className="h-3 w-3 mr-1 text-blue-500" />
                          {stats.comments}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          {stats.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            const youtubeUrl = `https://www.youtube.com/watch?v=${post.video_id}`;
                            window.open(youtubeUrl, "_blank");
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
                          <YouTubePostDetails post={post} />
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
    </div>
  );
};

export default function AccountDetailYoutube() {
  const { platform, accountId } = useParams<{
    platform: string;
    accountId: string;
  }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<YouTubeInfluencer | null>(null);
  const [posts, setPosts] = useState<YouTubePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  const handleBackClick = () => {
    navigate("/data-collection/account-interaction");
  };

  const getDisplayFollowers = (account: YouTubeInfluencer): string => {
    return account.subscriber_count || "0";
  };

  const getDisplayWorks = (account: YouTubeInfluencer): string => {
    return account.video_count || "0";
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
          if (parsedAccount.platform === "youtube" && parsedAccount.id === accountId) {
            setAccount(parsedAccount as YouTubeInfluencer);
            setLoading(false);
            return;
          }
        }

        // 如果 sessionStorage 没有数据或数据不匹配，从 API 获取
        if (accountId) {
          console.log("Fetching account data from API for accountId:", accountId);
          const accountData = await apiClient.getAccountDetail(accountId);
          console.log("Retrieved account data:", accountData);
          if (accountData.platform === "youtube") {
            setAccount(accountData as YouTubeInfluencer);
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
    
    console.log("Fetching posts for channel_id:", account.channel_id);
    setPostsLoading(true);
    try {
      const response = await apiClient.getPosts({
        platform: "youtube",
        platform_user_id: account.channel_id,
        page: 1,
        limit: 20,
      });
      console.log("Posts response:", response);
      setPosts(response.items as YouTubePost[]);
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
    exportAccountToExcel(account, posts, "YouTube");
  };

  if (loading) {
    return (
      <DashboardLayout title="加载中..." subtitle="正在加载YouTube频道详情">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!account) {
    return (
      <DashboardLayout title="YouTube频道详情" subtitle="YouTube频道数据详情">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">无法加载YouTube频道数据</h3>
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
      title={`${account.title} - YouTube频道详情`}
      subtitle="YouTube频道数据详情及视频分析"
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
                src={account.avatar_url || account.channel_avatar || ""}
                alt={account.title}
                fallbackText={account.title.charAt(0)}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-semibold">
                    {account.title}
                  </h2>
                  <Badge className="bg-red-100 text-red-800">
                    📺 YouTube
                  </Badge>
                  {account.is_verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      已认证
                    </Badge>
                  )}
                  {account.has_business_email && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      <Mail className="w-3 h-3 mr-1" />
                      商务邮箱
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <div className="font-medium text-lg">
                      {getDisplayFollowers(account)}
                    </div>
                    <div className="text-muted-foreground">订阅者</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {getDisplayWorks(account)}
                    </div>
                    <div className="text-muted-foreground">视频数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {account.view_count || "0"}
                    </div>
                    <div className="text-muted-foreground">总观看数</div>
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
                    <span>频道ID: {account.channel_id}</span>
                    <span>国家: {account.country || "未知"}</span>
                    <span>创建: {account.channel_creation_date}</span>
                  </div>
                </div>
                {account.description && (
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                    {account.description}
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
            <YouTubeAccountFields account={account} />
          </CardContent>
        </Card>

        {/* Posts Section */}
        <Card>
          <CardContent className="p-6">
            <YouTubePostsList 
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