import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient, type InstagramInfluencer, type InstagramPost } from "@/lib/api";
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
  Image as ImageIcon,
  Video,
  User,
  Globe,
  Link as LinkIcon,
  Bookmark,
} from "lucide-react";
import {
  formatNumber,
  formatDateTime,
  getPlatformDisplayName,
  getPlatformBadgeConfig,
  exportAccountToExcel,
} from "@/utils/accountUtils";

// Instagram 平台特定组件
const InstagramAccountFields: React.FC<{ account: InstagramInfluencer }> = ({ account }) => {
  const badgeConfig = getPlatformBadgeConfig("instagram");
  
  return (
    <div className="space-y-4">
      {/* 基本信息 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-medium">基本信息</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">用户名:</span>
              <span className="font-medium">@{account.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">用户ID:</span>
              <span className="font-medium text-xs break-all">{account.user_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">是否私密:</span>
              <span className={`font-medium ${account.is_private ? 'text-red-600' : 'text-green-600'}`}>
                {account.is_private ? '私密账号' : '公开账号'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">认证状态:</span>
              <span className="font-medium">{account.is_verified ? "已认证" : "未认证"}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">账号类型</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">商业账号:</span>
              <span className="font-medium">{account.is_business_account ? "是" : "否"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">专业账号:</span>
              <span className="font-medium">{account.is_professional_account ? "是" : "否"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">分类:</span>
              <span className="font-medium">{account.category_name || "无"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">国家:</span>
              <span className="font-medium">{account.country || "未知"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 商业信息 */}
      {account.is_business_account && (
        <div className="space-y-2">
          <h3 className="font-medium">商业信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">联系方式:</span>
              <span className="font-medium">{account.business_contact_method || "无"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">商业分类:</span>
              <span className="font-medium">{account.business_category_name || "无"}</span>
            </div>
            {account.business_email && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">商业邮箱:</span>
                <span className="font-medium text-xs break-all">{account.business_email}</span>
              </div>
            )}
            {account.business_phone_number && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">商业电话:</span>
                <span className="font-medium">{account.business_phone_number}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 功能特性 */}
      <div className="space-y-2">
        <h3 className="font-medium">功能特性</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">AR效果:</span>
            <span className="font-medium">{account.has_ar_effects ? "支持" : "不支持"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reels:</span>
            <span className="font-medium">{account.has_clips ? "支持" : "不支持"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">频道:</span>
            <span className="font-medium">{account.has_channel ? "有" : "无"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">指南:</span>
            <span className="font-medium">{account.has_guides ? "有" : "无"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">精选故事:</span>
            <span className="font-medium">{formatNumber(account.highlight_reel_count)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">媒体数量:</span>
            <span className="font-medium">{formatNumber(account.media_count)}</span>
          </div>
        </div>
      </div>

      {/* 链接信息 */}
      {(account.external_url || account.bio_links.length > 0) && (
        <div className="space-y-2">
          <h3 className="font-medium">链接信息</h3>
          <div className="space-y-2">
            {account.external_url && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">外部链接:</span>
                <a
                  href={account.external_url.startsWith('http') ? account.external_url : `https://${account.external_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-xs break-all"
                >
                  {account.external_url}
                </a>
              </div>
            )}
            {account.bio_links.map((link, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-muted-foreground">简介链接 {index + 1}:</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-xs break-all"
                >
                  {link.title || link.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 账号创建时间 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">账号创建时间</h3>
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{new Date(parseInt(account.date_joined_as_timestamp) * 1000).toLocaleString('zh-CN')}</span>
        </div>
      </div>
    </div>
  );
};

// Instagram 帖子详情展示组件
const InstagramPostDetails: React.FC<{ post: InstagramPost }> = ({ post }) => {
  return (
    <div className="bg-gray-50 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            基本信息
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">帖子ID:</span>
              <span className="font-medium text-xs break-all">{post.pk}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">短代码:</span>
              <span className="font-medium">{post.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">类型:</span>
              <span className="font-medium">{post.is_video ? "视频" : "图片"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">媒体类型:</span>
              <span className="font-medium">{post.typename}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">发布时间:</span>
              <span className="font-medium">{post.taken_at_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">作者:</span>
              <span className="font-medium">@{post.username}</span>
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
              <span className="text-gray-600">收藏:</span>
              <span className="font-medium">{formatNumber(post.save_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">分享:</span>
              <span className="font-medium">{formatNumber(post.share_count)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">观看:</span>
              <span className="font-medium">{formatNumber(post.view_count)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 帖子状态 */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
          帖子状态
        </h4>
        <div className="flex flex-wrap gap-2">
          {post.is_video && (
            <Badge variant="secondary" className="text-xs">
              <Video className="w-3 h-3 mr-1" />
              视频
            </Badge>
          )}
          {!post.is_video && post.image_urls.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              <ImageIcon className="w-3 h-3 mr-1" />
              图片 ({post.image_urls.length})
            </Badge>
          )}
          {post.is_verified && (
            <Badge variant="outline" className="text-xs bg-blue-50">
              <Shield className="w-3 h-3 mr-1" />
              认证作者
            </Badge>
          )}
          {post.is_private && (
            <Badge variant="destructive" className="text-xs">
              私密内容
            </Badge>
          )}
          {post.is_paid_partnership && (
            <Badge variant="outline" className="text-xs bg-green-50">
              付费合作
            </Badge>
          )}
          {post.comments_disabled && (
            <Badge variant="outline" className="text-xs bg-red-50">
              评论已关闭
            </Badge>
          )}
          {post.can_save && (
            <Badge variant="secondary" className="text-xs">
              <Bookmark className="w-3 h-3 mr-1" />
              可收藏
            </Badge>
          )}
        </div>
      </div>

      {/* 帖子标题/文案 */}
      {post.caption_text && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            帖子内容
          </h4>
          <div className="text-sm text-gray-600 bg-white p-3 rounded border max-h-32 overflow-y-auto">
            {post.caption_text}
          </div>
        </div>
      )}

      {/* 标签用户 */}
      {post.tagged_users.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            标签用户
          </h4>
          <div className="flex flex-wrap gap-2">
            {post.tagged_users.map((user, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <User className="w-3 h-3 mr-1" />
                @{user.username}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 标签 */}
      {post.hashtags.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
            话题标签
          </h4>
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((hashtag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{hashtag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InstagramPostsList: React.FC<{ 
  posts: InstagramPost[], 
  loading: boolean, 
  onRefresh: () => void 
}> = ({ posts, loading, onRefresh }) => {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const getPostStats = (post: InstagramPost) => {
    return {
      likes: formatNumber(post.like_count || 0),
      comments: formatNumber(post.comment_count || 0),
      saves: formatNumber(post.save_count || 0),
      shares: formatNumber(post.share_count || 0),
      views: formatNumber(post.view_count || 0),
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">帖子详情</h2>
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
          <p>正在加载帖子数据...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">暂无帖子数据</h3>
          <p className="text-muted-foreground">
            该账号暂无可显示的帖子数据
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">帖子内容</TableHead>
                <TableHead className="w-[120px]">发布时间</TableHead>
                <TableHead className="w-[100px]">点赞数</TableHead>
                <TableHead className="w-[100px]">评论数</TableHead>
                <TableHead className="w-[100px]">收藏数</TableHead>
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
                            {post.is_video ? (
                              post.video_url ? (
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
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center">
                                  <Video className="w-6 h-6 text-purple-600" />
                                </div>
                              )
                            ) : post.image_urls.length > 0 ? (
                              <img
                                src={post.image_urls[0]}
                                alt="帖子图片"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-purple-600" />
                              </div>
                            )}
                            <div className={`${(post.is_video && post.video_url) || post.image_urls.length > 0 ? 'hidden' : ''} w-full h-full bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center`}>
                              <span className="text-xl text-purple-600">📷</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div
                              className="max-w-[180px] truncate font-medium text-sm"
                              title={post.caption_text || "无标题"}
                            >
                              {post.caption_text || "无标题"}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {post.is_video && (
                                <Badge variant="secondary" className="text-xs">
                                  <Video className="w-2 h-2 mr-1" />
                                  视频
                                </Badge>
                              )}
                              {!post.is_video && post.image_urls.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  <ImageIcon className="w-2 h-2 mr-1" />
                                  图片
                                </Badge>
                              )}
                              {post.is_paid_partnership && (
                                <Badge variant="outline" className="text-xs">
                                  合作
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {post.taken_at_date}
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
                          <Bookmark className="h-3 w-3 mr-1 text-yellow-500" />
                          {stats.saves}
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
                            const instagramUrl = `https://www.instagram.com/p/${post.code}/`;
                            window.open(instagramUrl, "_blank");
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
                          <InstagramPostDetails post={post} />
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

export default function AccountDetailInstagram() {
  const { platform, accountId } = useParams<{
    platform: string;
    accountId: string;
  }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<InstagramInfluencer | null>(null);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  const handleBackClick = () => {
    navigate("/data-collection/account-interaction");
  };

  const getDisplayFollowers = (account: InstagramInfluencer): string => {
    return formatNumber(account.follower_count || 0);
  };

  const getDisplayWorks = (account: InstagramInfluencer): number => {
    return account.media_count || 0;
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
          if (parsedAccount.platform === "instagram" && parsedAccount.id === accountId) {
            setAccount(parsedAccount as InstagramInfluencer);
            setLoading(false);
            return;
          }
        }

        // 如果 sessionStorage 没有数据或数据不匹配，从 API 获取
        if (accountId) {
          console.log("Fetching account data from API for accountId:", accountId);
          const accountData = await apiClient.getAccountDetail(accountId);
          console.log("Retrieved account data:", accountData);
          if (accountData.platform === "instagram") {
            setAccount(accountData as InstagramInfluencer);
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
        platform: "instagram",
        platform_user_id: account.user_id,
        page: 1,
        limit: 20,
      });
      console.log("Posts response:", response);
      setPosts(response.items as InstagramPost[]);
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
    exportAccountToExcel(account, posts, "Instagram");
  };

  if (loading) {
    return (
      <DashboardLayout title="加载中..." subtitle="正在加载Instagram账号详情">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!account) {
    return (
      <DashboardLayout title="Instagram账号详情" subtitle="Instagram账号数据详情">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">无法加载Instagram账号数据</h3>
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
      title={`${account.nickname} - Instagram账号详情`}
      subtitle="Instagram账号数据详情及帖子分析"
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
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    📷 Instagram
                  </Badge>
                  {account.is_verified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Shield className="w-3 h-3 mr-1" />
                      已认证
                    </Badge>
                  )}
                  {account.is_private && (
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      私密账号
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
                    <div className="text-muted-foreground">帖子数</div>
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
                    <span>@{account.username}</span>
                    <span>ID: {account.user_id}</span>
                    {account.category_name && <span>分类: {account.category_name}</span>}
                  </div>
                </div>
                {account.biography && account.biography.trim() && (
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {account.biography}
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
            <InstagramAccountFields account={account} />
          </CardContent>
        </Card>

        {/* Posts Section */}
        <Card>
          <CardContent className="p-6">
            <InstagramPostsList 
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