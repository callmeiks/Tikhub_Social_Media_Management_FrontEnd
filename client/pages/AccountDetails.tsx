import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
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
} from "lucide-react";
import {
  apiClient,
  type Influencer,
  type Post,
  type TikTokInfluencer,
  type DouyinInfluencer,
  type XiaohongshuInfluencer,
  type TikTokPost,
  type DouyinPost,
  type XiaohongshuPost,
} from "@/lib/api";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AvatarImage } from "@/components/ui/avatar-image";

const getPlatformUserIdKey = (platform: string): string => {
  switch (platform) {
    case "tiktok":
      return "sec_user_id";
    case "douyin":
      return "sec_user_id";
    case "xiaohongshu":
      return "user_id";
    default:
      return "id";
  }
};

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}千`;
  }
  return num.toString();
};

const getPlatformDisplayName = (platform: string): string => {
  const platformMap: { [key: string]: string } = {
    douyin: "抖音",
    xiaohongshu: "小红书",
    tiktok: "TikTok",
  };
  return platformMap[platform] || platform;
};

const getAvatarUrl = (account: Influencer): string => {
  return (account as any).avatar_url || "";
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

interface AccountFieldsProps {
  account: Influencer;
}

const TikTokAccountFields: React.FC<{ account: TikTokInfluencer }> = ({
  account,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium">Sec User ID:</span>{" "}
          <span className="break-all text-xs">{account.sec_user_id || "N/A"}</span>
        </div>
        <div>
          <span className="font-medium">用户ID:</span> {account.uid || "N/A"}
        </div>
        <div>
          <span className="font-medium">唯一标识:</span>{" "}
          {account.unique_id || "N/A"}
        </div>
        <div>
          <span className="font-medium">分类:</span> {account.category || "N/A"}
        </div>
        <div>
          <span className="font-medium">签名语言:</span>{" "}
          {account.signature_language || "N/A"}
        </div>
        <div>
          <span className="font-medium">关注数:</span>{" "}
          {formatNumber(account.following_count || 0)}
        </div>
        <div>
          <span className="font-medium">企业认证:</span>{" "}
          {account.is_enterprise_verify ? "是" : "否"}
        </div>
        <div>
          <span className="font-medium">商务等级:</span>{" "}
          {account.commerce_user_level || 0}
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
          <span className="font-medium">直播带货:</span>{" "}
          {account.live_commerce ? "是" : "否"}
        </div>
        <div>
          <span className="font-medium">消息聊天入口:</span>{" "}
          {account.message_chat_entry ? "是" : "否"}
        </div>
        <div>
          <span className="font-medium">商务入口:</span>{" "}
          {account.with_commerce_entry ? "是" : "否"}
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mt-4">
        {account.share_url && (
          <div>
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
        {account.ins_id && (
          <div>
            <span className="font-medium">Instagram:</span> {account.ins_id}
          </div>
        )}
        {account.twitter_id && (
          <div>
            <span className="font-medium">Twitter:</span> {account.twitter_id}
          </div>
        )}
        {account.youtube_channel_id && (
          <div>
            <span className="font-medium">YouTube ID:</span>{" "}
            {account.youtube_channel_id}
          </div>
        )}
      </div>

      {account.youtube_channel_title && (
        <div>
          <span className="font-medium">YouTube频道:</span>{" "}
          {account.youtube_channel_title}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
        {account.android_download_app_link && (
          <div>
            <span className="font-medium">Android下载:</span>{" "}
            <a
              href={account.android_download_app_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              下载
            </a>
          </div>
        )}
        {account.ios_download_app_link && (
          <div>
            <span className="font-medium">iOS下载:</span>{" "}
            <a
              href={account.ios_download_app_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              下载
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const DouyinAccountFields: React.FC<{ account: DouyinInfluencer }> = ({
  account,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium">Sec User ID:</span>{" "}
          <span className="break-all text-xs">{account.sec_user_id || "N/A"}</span>
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

const XiaohongshuAccountFields: React.FC<{
  account: XiaohongshuInfluencer;
}> = ({ account }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium">User ID:</span>{" "}
          <span className="break-all text-xs">{account.user_id || "N/A"}</span>
        </div>
        <div>
          <span className="font-medium">小红书ID:</span>{" "}
          {account.red_id || "N/A"}
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
          <span className="font-medium">笔记数量:</span>{" "}
          {formatNumber(account.post_acount || 0)}
        </div>
        <div>
          <span className="font-medium">获赞数:</span>{" "}
          {formatNumber(account.liked_acount || 0)}
        </div>
        <div>
          <span className="font-medium">收藏数:</span>{" "}
          {formatNumber(account.collected_acount || 0)}
        </div>
        <div>
          <span className="font-medium">关注数:</span>{" "}
          {formatNumber(
            account.following_acount || account.following_count || 0,
          )}
        </div>
        <div>
          <span className="font-medium">粉丝数:</span>{" "}
          {formatNumber(account.fans_acount || account.follower_count || 0)}
        </div>
        <div>
          <span className="font-medium">小红书会员:</span>{" "}
          {account.is_red_club ? "是" : "否"}
        </div>
        <div>
          <span className="font-medium">官方认证:</span>{" "}
          {account.red_official_verified ? "是" : "否"}
        </div>
      </div>

      {account.desc && (
        <div className="mt-4">
          <span className="font-medium">个人简介:</span> {account.desc}
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

      {account.tags && account.tags.length > 0 && (
        <div className="mt-4">
          <span className="font-medium">标签:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {account.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PostDetailsDropdown: React.FC<{ post: Post }> = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderPostDetails = () => {
    switch (post.platform) {
      case "tiktok":
        const tiktokPost = post as TikTokPost;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">基本信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">内容类型:</span>
                    <span className="font-medium">{tiktokPost.content_type || "未知"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">时长:</span>
                    <span className="font-medium">{formatDuration(tiktokPost.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">语言:</span>
                    <span className="font-medium">{tiktokPost.desc_language || "未知"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">AI创作:</span>
                    <Badge variant={tiktokPost.created_by_ai ? "secondary" : "outline"} className="text-xs">
                      {tiktokPost.created_by_ai ? "是" : "否"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">状态信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">广告:</span>
                    <Badge variant={tiktokPost.is_ads ? "destructive" : "outline"} className="text-xs">
                      {tiktokPost.is_ads ? "是" : "否"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">置顶:</span>
                    <Badge variant={tiktokPost.is_top ? "default" : "outline"} className="text-xs">
                      {tiktokPost.is_top ? "是" : "否"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">下载次数:</span>
                    <span className="font-medium">{formatNumber(tiktokPost.download_count)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">播放次数:</span>
                    <span className="font-medium">{formatNumber(tiktokPost.play_count)}</span>
                  </div>
                </div>
              </div>
            </div>
            {tiktokPost.music_author && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">音乐信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">音乐作者:</span>
                    <span className="font-medium">{tiktokPost.music_author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">音乐时长:</span>
                    <span className="font-medium">{formatDuration(tiktokPost.music_duration * 1000)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "douyin":
        const douyinPost = post as DouyinPost;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">基本信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">时长:</span>
                    <span className="font-medium">{formatDuration(douyinPost.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">拍摄方式:</span>
                    <span className="font-medium">{douyinPost.shoot_way || "未知"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">播放次数:</span>
                    <span className="font-medium">{formatNumber(douyinPost.play_count)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">状态信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">广告:</span>
                    <Badge variant={douyinPost.is_ads ? "destructive" : "outline"} className="text-xs">
                      {douyinPost.is_ads ? "是" : "否"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">置顶:</span>
                    <Badge variant={douyinPost.is_top ? "default" : "outline"} className="text-xs">
                      {douyinPost.is_top ? "是" : "否"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">带货:</span>
                    <Badge variant={douyinPost.with_goods ? "secondary" : "outline"} className="text-xs">
                      {douyinPost.with_goods ? "是" : "否"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700 border-b pb-1">位置信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">城市:</span>
                  <span className="font-medium">{douyinPost.city || "未知"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">地区:</span>
                  <span className="font-medium">{douyinPost.region || "未知"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IP归属:</span>
                  <span className="font-medium">{douyinPost.ip_attribution || "未知"}</span>
                </div>
              </div>
            </div>
            {douyinPost.music_author && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">音乐信息</h4>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">音乐作者:</span>
                    <span className="font-medium">{douyinPost.music_author}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "xiaohongshu":
        const xhsPost = post as XiaohongshuPost;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">基本信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">类型:</span>
                    <Badge variant="outline" className="text-xs">{xhsPost.type || "未知"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">等级:</span>
                    <Badge variant="secondary" className="text-xs">{xhsPost.level || "未知"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">最后更新:</span>
                    <span className="font-medium text-xs">{formatDateTime(xhsPost.last_update_time)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">状态信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">精选笔记:</span>
                    <Badge variant={xhsPost.is_good_note ? "default" : "outline"} className="text-xs">
                      {xhsPost.is_good_note ? "是" : "否"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">有音乐:</span>
                    <Badge variant={xhsPost.has_music ? "secondary" : "outline"} className="text-xs">
                      {xhsPost.has_music ? "是" : "否"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700 border-b pb-1">互动数据</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">获赞数:</span>
                  <span className="font-medium">{formatNumber(xhsPost.likes_count)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">点赞数:</span>
                  <span className="font-medium">{formatNumber(xhsPost.nice_count)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>暂无详细信息</div>;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
          {isOpen ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          {renderPostDetails()}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default function AccountDetails() {
  const { platform, accountId } = useParams();
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState<Influencer | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 20;

  useEffect(() => {
    // Get account data from sessionStorage
    const storedAccount = sessionStorage.getItem("selectedAccount");
    if (storedAccount) {
      const account = JSON.parse(storedAccount) as Influencer;
      setAccountData(account);
      fetchPosts(account);
    }
  }, []);

  const fetchPosts = async (account: Influencer) => {
    if (!account) return;

    setPostsLoading(true);
    try {
      const userIdKey = getPlatformUserIdKey(account.platform);
      const userId = (account as any)[userIdKey];

      const response = await apiClient.getPosts({
        platform: account.platform as "tiktok" | "douyin" | "xiaohongshu",
        platform_user_id: userId,
        page: currentPage,
        limit: postsPerPage,
        sort_by_time: 0, // newest first
      });

      setPosts(response.items);
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

  const getPlatformBadge = (platform: string) => {
    const platformConfig = {
      抖音: { color: "bg-red-100 text-red-800", emoji: "🎤" },
      小红书: { color: "bg-pink-100 text-pink-800", emoji: "📖" },
      TikTok: { color: "bg-purple-100 text-purple-800", emoji: "🎵" },
    };
    const displayName = getPlatformDisplayName(platform);
    const config = platformConfig[displayName] || {
      color: "bg-gray-100 text-gray-800",
      emoji: "📱",
    };

    return (
      <Badge className={config.color}>
        {config.emoji} {displayName}
      </Badge>
    );
  };

  const getDisplayFollowers = (account: Influencer): string => {
    // 小红书使用 fans_count, 抖音/TikTok使用 follower_count
    const count =
      account.follower_count ||
      (account as any).fans_count ||
      (account as any).fans_acount ||
      0;
    return formatNumber(count);
  };

  const getDisplayWorks = (account: Influencer): number => {
    // 小红书使用 post_count, 抖音/TikTok使用 aweme_count
    return (
      account.aweme_count ||
      (account as any).post_count ||
      (account as any).post_acount ||
      0
    );
  };

  const getDisplayLikes = (account: Influencer): string => {
    // 小红书使用 liked_count, 抖音/TikTok使用 total_favorited
    const count =
      account.total_favorited ||
      (account as any).liked_count ||
      (account as any).liked_acount ||
      0;
    return formatNumber(count);
  };

  const getPostTitle = (post: Post): string => {
    if (post.platform === "xiaohongshu") {
      return (post as XiaohongshuPost).title || post.desc || "无标题";
    }
    return post.desc || "无标题";
  };

  const getPostUrl = (post: Post): string => {
    switch (post.platform) {
      case "tiktok":
        return (post as TikTokPost).share_url || "";
      case "douyin":
        return (post as DouyinPost).share_url || "";
      case "xiaohongshu":
        return (post as XiaohongshuPost).share_url || "";
      default:
        return "";
    }
  };

  const getPostStats = (post: Post) => {
    const diggCount =
      (post as any).digg_count || (post as any).likes_count || 0;
    const commentCount = post.comment_count || 0;
    const shareCount = post.share_count || 0;
    const playCount = (post as any).play_count || 0;
    const collectCount = post.collect_count || 0;

    return {
      likes: formatNumber(diggCount),
      comments: formatNumber(commentCount),
      shares: formatNumber(shareCount),
      views: formatNumber(playCount),
      collects: formatNumber(collectCount),
    };
  };

  if (!accountData) {
    return (
      <DashboardLayout title="加载中..." subtitle="正在加载账号详情">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  const renderAccountFields = () => {
    switch (accountData.platform) {
      case "tiktok":
        return (
          <TikTokAccountFields account={accountData as TikTokInfluencer} />
        );
      case "douyin":
        return (
          <DouyinAccountFields account={accountData as DouyinInfluencer} />
        );
      case "xiaohongshu":
        return (
          <XiaohongshuAccountFields
            account={accountData as XiaohongshuInfluencer}
          />
        );
      default:
        return <div>暂无详细信息</div>;
    }
  };

  return (
    <DashboardLayout
      title={`${accountData.nickname} - 账号详情`}
      subtitle="账号数据详情及作品分析"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="h-8"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            返回列表
          </Button>
        </div>

        {/* Account Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <AvatarImage
                src={getAvatarUrl(accountData)}
                alt={accountData.nickname}
                fallbackText={accountData.nickname.charAt(0)}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-semibold">
                    {accountData.nickname}
                  </h2>
                  {getPlatformBadge(accountData.platform)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <div className="font-medium text-lg">
                      {getDisplayFollowers(accountData)}
                    </div>
                    <div className="text-muted-foreground">粉��数</div>
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
                {renderAccountFields()}
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
                        <TableHead className="w-[120px]">���布时间</TableHead>
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
                        return (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-3">
                                <div className="w-16 h-12 rounded bg-gray-200 flex items-center justify-center">
                                  <Play className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                  <div
                                    className="max-w-[200px] truncate font-medium"
                                    title={getPostTitle(post)}
                                  >
                                    {getPostTitle(post)}
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
                                  window.open(getPostUrl(post), "_blank")
                                }
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </TableCell>
                            <TableCell>
                              <PostDetailsDropdown post={post} />
                            </TableCell>
                          </TableRow>
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
    </DashboardLayout>
  );
}
