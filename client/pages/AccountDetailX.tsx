import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient, type XInfluencer, type XPost } from "@/lib/api";
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
  Hash,
  AtSign,
  Quote,
  Repeat,
  Bookmark,
  Link as LinkIcon,
  Play,
} from "lucide-react";
import {
  formatNumber,
  formatDateTime,
  getPlatformDisplayName,
  getPlatformBadgeConfig,
  exportAccountToExcel,
} from "@/utils/accountUtils";

// X 平台特定组件
const XAccountFields: React.FC<{ account: XInfluencer }> = ({ account }) => {
  const badgeConfig = getPlatformBadgeConfig("x");
  
  return (
    <div className="space-y-4">
      {/* 基本信息 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-medium">基本信息</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">用户名:</span>
              <span className="font-medium">@{account.screen_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">REST ID:</span>
              <span className="font-medium text-xs break-all">{account.rest_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">账号状态:</span>
              <span className={`font-medium ${account.account_status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                {account.account_status === 'active' ? '活跃' : '非活跃'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Blue 认证:</span>
              <span className="font-medium">{account.blue_verified ? "是" : "否"}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">统计信息</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">推文数:</span>
              <span className="font-medium">{formatNumber(account.tweet_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">媒体数:</span>
              <span className="font-medium">{formatNumber(account.media_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">朋友数:</span>
              <span className="font-medium">{formatNumber(account.friends_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">置顶推文:</span>
              <span className="font-medium text-xs break-all">{account.pinned_tweet_id || "无"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 标签信息 */}
      {account.label_type && account.label_type.trim() && (
        <div className="space-y-2">
          <h3 className="font-medium">标签信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">标签类型:</span>
              <span className="font-medium">{account.label_type || "无"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">标签描述:</span>
              <span className="font-medium">{account.label_description || "无"}</span>
            </div>
            {account.label_link && account.label_link.trim() && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">标签链接:</span>
                <a
                  href={account.label_link.startsWith('http') ? account.label_link : `https://${account.label_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-xs"
                >
                  查看链接
                </a>
              </div>
            )}
            {account.label_badge && account.label_badge.trim() && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">标签徽章:</span>
                <img
                  src={account.label_badge}
                  alt="Label Badge"
                  className="w-6 h-6 rounded"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 账号创建时间 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">账号创建时间</h3>
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{new Date(account.account_created).toLocaleString('zh-CN')}</span>
        </div>
      </div>
    </div>
  );
};

// X 推文详情展示组件
const XPostDetails: React.FC<{ post: XPost }> = ({ post }) => {
  return (
    <div className="bg-gray-50 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            基本信息
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">推文ID:</span>
              <span className="font-medium text-xs break-all">{post.tweet_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">作者:</span>
              <span className="font-medium">@{post.author_screen_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">语言:</span>
              <span className="font-medium">{post.lang}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">对话ID:</span>
              <span className="font-medium text-xs break-all">{post.conversation_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">发布时间:</span>
              <span className="font-medium">
                {post.created_time}
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
              <span className="text-gray-600">转发:</span>
              <span className="font-medium">{formatNumber(post.retweet_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">回复:</span>
              <span className="font-medium">{formatNumber(post.replies_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">引用:</span>
              <span className="font-medium">{formatNumber(post.quotes_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">书签:</span>
              <span className="font-medium">{formatNumber(post.bookmarks_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">观看:</span>
              <span className="font-medium">{formatNumber(post.view_count)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 推文类型 */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
          推文状态
        </h4>
        <div className="flex flex-wrap gap-2">
          {post.text.startsWith('RT @') && (
            <Badge variant="secondary" className="text-xs">
              <Repeat className="w-3 h-3 mr-1" />
              转发
            </Badge>
          )}
          {post.quotes_count > 0 && (
            <Badge variant="secondary" className="text-xs">
              <Quote className="w-3 h-3 mr-1" />
              有引用
            </Badge>
          )}
          {post.replies_count > 0 && (
            <Badge variant="secondary" className="text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              有回复
            </Badge>
          )}
          {post.sensitive && (
            <Badge variant="destructive" className="text-xs">
              敏感内容
            </Badge>
          )}
          {post.is_pinned && (
            <Badge variant="outline" className="text-xs">
              置顶推文
            </Badge>
          )}
          {post.author_blue_verified && (
            <Badge variant="outline" className="text-xs bg-blue-50">
              <Shield className="w-3 h-3 mr-1" />
              认证作者
            </Badge>
          )}
        </div>
      </div>

      {/* 推文内容 */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
          推文内容
        </h4>
        <div className="text-sm text-gray-600 bg-white p-3 rounded border">
          {post.text}
        </div>
      </div>

      {/* 媒体和链接 */}
      {(post.images_url.length > 0 || post.video_url || post.expanded_url) && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            媒体和链接
          </h4>
          <div className="space-y-2">
            {post.images_url.length > 0 && (
              <div>
                <span className="text-xs text-gray-600 mb-1 block">
                  图片 ({post.images_url.length}):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {post.images_url.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-xs truncate"
                    >
                      图片 {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {post.video_url && post.video_url.trim() && (
              <div>
                <span className="text-xs text-gray-600 mb-1 block">
                  视频:
                </span>
                <a
                  href={post.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-xs block truncate"
                >
                  <LinkIcon className="w-3 h-3 mr-1 inline" />
                  {post.video_url}
                </a>
              </div>
            )}
            {post.expanded_url && post.expanded_url.trim() && (
              <div>
                <span className="text-xs text-gray-600 mb-1 block">
                  展开链接:
                </span>
                <a
                  href={post.expanded_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-xs block truncate"
                >
                  <LinkIcon className="w-3 h-3 mr-1 inline" />
                  {post.expanded_url}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const XPostsList: React.FC<{ 
  posts: XPost[], 
  loading: boolean, 
  onRefresh: () => void 
}> = ({ posts, loading, onRefresh }) => {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const getPostStats = (post: XPost) => {
    return {
      likes: formatNumber(post.like_count || 0),
      retweets: formatNumber(post.retweet_count || 0),
      replies: formatNumber(post.replies_count || 0),
      quotes: formatNumber(post.quotes_count || 0),
      bookmarks: formatNumber(post.bookmarks_count || 0),
      views: formatNumber(post.view_count || 0),
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">推文详情</h2>
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
          <p>正在加载推文数据...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">暂无推文数据</h3>
          <p className="text-muted-foreground">
            该账号暂无可显示的推文数据
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">推文内容</TableHead>
                <TableHead className="w-[120px]">发布时间</TableHead>
                <TableHead className="w-[100px]">点赞数</TableHead>
                <TableHead className="w-[100px]">转发数</TableHead>
                <TableHead className="w-[100px]">回复数</TableHead>
                <TableHead className="w-[100px]">观看数</TableHead>
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
                          <div className="w-20 h-14 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                            {post.images_url.length > 0 ? (
                              <img
                                src={post.images_url[0]}
                                alt="推文图片"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : post.video_url && post.video_url.trim() ? (
                              <div className="relative w-full h-full bg-black flex items-center justify-center">
                                <video
                                  src={post.video_url}
                                  className="w-full h-full object-cover"
                                  muted
                                  preload="metadata"
                                  onError={(e) => {
                                    const target = e.target as HTMLVideoElement;
                                    target.style.display = 'none';
                                    target.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="bg-black bg-opacity-50 rounded-full p-1">
                                    <Play className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            <div className={`${post.images_url.length > 0 || (post.video_url && post.video_url.trim()) ? 'hidden' : ''} w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center`}>
                              <span className="text-2xl">𝕏</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div
                              className="max-w-[180px] truncate font-medium text-sm"
                              title={post.text || post.desc || "无内容"}
                            >
                              {post.text || post.desc || "无内容"}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {post.text.startsWith('RT @') && (
                                <Badge variant="secondary" className="text-xs">
                                  <Repeat className="w-2 h-2 mr-1" />
                                  转发
                                </Badge>
                              )}
                              {post.replies_count > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  <MessageCircle className="w-2 h-2 mr-1" />
                                  回复
                                </Badge>
                              )}
                              {(post.images_url.length > 0 || post.video_url) && (
                                <Badge variant="outline" className="text-xs">
                                  媒体
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {post.created_time}
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
                          <Repeat className="h-3 w-3 mr-1 text-green-500" />
                          {stats.retweets}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1 text-blue-500" />
                          {stats.replies}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1 text-purple-500" />
                          {stats.views}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            const tweetUrl = `https://twitter.com/${post.author_screen_name}/status/${post.tweet_id}`;
                            window.open(tweetUrl, "_blank");
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
                          <XPostDetails post={post} />
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

export default function AccountDetailX() {
  const { platform, accountId } = useParams<{
    platform: string;
    accountId: string;
  }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<XInfluencer | null>(null);
  const [posts, setPosts] = useState<XPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  const handleBackClick = () => {
    navigate("/data-collection/account-interaction");
  };

  const getDisplayFollowers = (account: XInfluencer): string => {
    return formatNumber(account.follower_count || 0);
  };

  const getDisplayWorks = (account: XInfluencer): number => {
    return account.tweet_count || 0;
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
          if (parsedAccount.platform === "x" && parsedAccount.id === accountId) {
            setAccount(parsedAccount as XInfluencer);
            setLoading(false);
            return;
          }
        }

        // 如果 sessionStorage 没有数据或数据不匹配，从 API 获取
        if (accountId) {
          console.log("Fetching account data from API for accountId:", accountId);
          const accountData = await apiClient.getAccountDetail(accountId);
          console.log("Retrieved account data:", accountData);
          if (accountData.platform === "x") {
            setAccount(accountData as XInfluencer);
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
    
    console.log("Fetching posts for rest_id:", account.rest_id);
    setPostsLoading(true);
    try {
      const response = await apiClient.getPosts({
        platform: "x",
        platform_user_id: account.rest_id,
        page: 1,
        limit: 20,
      });
      console.log("Posts response:", response);
      setPosts(response.items as XPost[]);
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
    exportAccountToExcel(account, posts, "X");
  };

  if (loading) {
    return (
      <DashboardLayout title="加载中..." subtitle="正在加载X账号详情">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!account) {
    return (
      <DashboardLayout title="X账号详情" subtitle="X账号数据详情">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">无法加载X账号数据</h3>
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
      title={`${account.name} - X账号详情`}
      subtitle="X账号数据详情及推文分析"
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
                alt={account.name}
                fallbackText={account.name.charAt(0)}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-semibold">
                    {account.name}
                  </h2>
                  <Badge className="bg-blue-100 text-blue-800">
                    ✖️ X
                  </Badge>
                  {account.blue_verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Blue认证
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <div className="font-medium text-lg">
                      {getDisplayFollowers(account)}
                    </div>
                    <div className="text-muted-foreground">关注者</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {getDisplayWorks(account)}
                    </div>
                    <div className="text-muted-foreground">推文数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {formatNumber(account.following_count)}
                    </div>
                    <div className="text-muted-foreground">关注中</div>
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
                    <span>@{account.screen_name}</span>
                    <span>ID: {account.rest_id}</span>
                    <span>媒体: {formatNumber(account.media_count)}</span>
                  </div>
                </div>
                {account.desc && account.desc.trim() && (
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {account.desc}
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
            <XAccountFields account={account} />
          </CardContent>
        </Card>

        {/* Posts Section */}
        <Card>
          <CardContent className="p-6">
            <XPostsList 
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