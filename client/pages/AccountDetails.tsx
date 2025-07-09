import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import douyinCityList from "../../douyin_city_list.json";
import * as XLSX from 'xlsx';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
          {account.gender === 1 ? "女" : account.gender === 2 ? "男" : "未知"}
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

const PostDetailsDropdown: React.FC<{ post: Post; isOpen: boolean; onToggle: () => void }> = ({ post, isOpen, onToggle }) => {

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
                    <span className="text-gray-600">作品ID:</span>
                    <span className="font-medium text-xs break-all">{tiktokPost.aweme_id || "未知"}</span>
                  </div>
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
                  {tiktokPost.video_url && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">播放链接:</span>
                      <a
                        href={tiktokPost.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-xs"
                      >
                        查看视频
                      </a>
                    </div>
                  )}
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
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700 border-b pb-1">商业信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">商业音乐:</span>
                  <Badge variant={tiktokPost.with_promotional_music ? "secondary" : "outline"} className="text-xs">
                    {tiktokPost.with_promotional_music ? "是" : "否"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">商业推广:</span>
                  <Badge variant={tiktokPost.has_promote_entry ? "secondary" : "outline"} className="text-xs">
                    {tiktokPost.has_promote_entry ? "是" : "否"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700 border-b pb-1">技术信息</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">剪映制作:</span>
                  <Badge variant={tiktokPost.is_capcut ? "secondary" : "outline"} className="text-xs">
                    {tiktokPost.is_capcut ? "是" : "否"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">内容类型:</span>
                  <Badge variant={!tiktokPost.is_pgcshow ? "default" : "outline"} className="text-xs">
                    {!tiktokPost.is_pgcshow ? "UGC" : "PGC"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VR内容:</span>
                  <Badge variant={tiktokPost.is_vr ? "secondary" : "outline"} className="text-xs">
                    {tiktokPost.is_vr ? "是" : "否"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">弹幕支持:</span>
                  <Badge variant={tiktokPost.support_danmaku ? "secondary" : "outline"} className="text-xs">
                    {tiktokPost.support_danmaku ? "是" : "否"}
                  </Badge>
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
                  {tiktokPost.music_play_url && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">音乐链接:</span>
                      <a
                        href={tiktokPost.music_play_url}
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
            {tiktokPost.cha_list && tiktokPost.cha_list.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">参与挑战</h4>
                <div className="flex flex-wrap gap-1.5">
                  {tiktokPost.cha_list.map((cha, index) => (
                    <Badge key={cha.cid || index} variant="secondary" className="text-xs">
                      #{cha.name}
                    </Badge>
                  ))}
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
                    <span className="text-gray-600">作品ID:</span>
                    <span className="font-medium text-xs break-all">{(douyinPost as any).aweme_id || "未知"}</span>
                  </div>
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
                  {douyinPost.video_url && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">播放链接:</span>
                      <a
                        href={douyinPost.video_url}
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">作品警告:</span>
                    <Badge variant={(douyinPost as any).is_warned ? "destructive" : "outline"} className="text-xs">
                      {(douyinPost as any).is_warned ? "是" : "否"}
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
                  <span className="font-medium">
                    {douyinPost.city && douyinCityList[douyinPost.city as keyof typeof douyinCityList] 
                      ? douyinCityList[douyinPost.city as keyof typeof douyinCityList]
                      : douyinPost.city || "未知"}
                  </span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">音乐作者:</span>
                    <span className="font-medium">{douyinPost.music_author}</span>
                  </div>
                  {douyinPost.music_duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">音乐时长:</span>
                      <span className="font-medium">{formatDuration(douyinPost.music_duration * 1000)}</span>
                    </div>
                  )}
                  {douyinPost.music_play_url && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">音乐链接:</span>
                      <a
                        href={douyinPost.music_play_url}
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
            {(douyinPost as any).cha_list && (douyinPost as any).cha_list.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">参与挑战</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(douyinPost as any).cha_list.map((cha: any, index: number) => (
                    <Badge key={cha.cid || index} variant="secondary" className="text-xs">
                      #{cha.cha_name || cha.name}
                    </Badge>
                  ))}
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
                    <span className="text-gray-600">笔记ID:</span>
                    <span className="font-medium text-xs break-all">{xhsPost.note_id || "未知"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">类型:</span>
                    <Badge variant="outline" className="text-xs">{xhsPost.type || "未知"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">等级:</span>
                    <Badge variant="secondary" className="text-xs">{xhsPost.level || "未知"}</Badge>
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
                  <span className="text-gray-600">点赞数:</span>
                  <span className="font-medium">{formatNumber(xhsPost.likes_count)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">分享数:</span>
                  <span className="font-medium">{formatNumber(xhsPost.share_count)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">评论数:</span>
                  <span className="font-medium">{formatNumber(xhsPost.comment_count)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">收藏数:</span>
                  <span className="font-medium">{formatNumber(xhsPost.collect_count)}</span>
                </div>
              </div>
            </div>
            {xhsPost.desc && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">笔记内容</h4>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <p className="whitespace-pre-wrap">{xhsPost.desc}</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div>暂无详细信息</div>;
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 mx-4 mb-2">
      {renderPostDetails()}
    </div>
  );
};

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

const ImageGalleryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  postTitle: string;
  onDownloadAll: () => void;
}> = ({ isOpen, onClose, images, currentIndex, onIndexChange, postTitle, onDownloadAll }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate pr-4">{postTitle}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                共 {images.length} 张图片
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onDownloadAll}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>下载全部</span>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[70vh] pr-2">
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group border-2 transition-all duration-200 ${
                  index === currentIndex ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onIndexChange(index)}
              >
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Eye className="h-4 w-4 text-gray-700" />
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
        {currentIndex >= 0 && currentIndex < images.length && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                当前查看: 第 {currentIndex + 1} 张图片
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = images[currentIndex];
                    link.download = `${postTitle}_image_${currentIndex + 1}.jpg`;
                    link.click();
                  }}
                  className="flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>下载当前图片</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function AccountDetails() {
  const { platform, accountId } = useParams();
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState<Influencer | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>("");
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>("");
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const postsPerPage = 20;

  useEffect(() => {
    // Get account data from sessionStorage
    const storedAccount = sessionStorage.getItem("selectedAccount");
    if (storedAccount) {
      try {
        const account = JSON.parse(storedAccount) as Influencer;
        setAccountData(account);
        fetchPosts(account);
        setLoading(false);
      } catch (error) {
        console.error("Failed to parse stored account data:", error);
        setLoading(false);
      }
    } else {
      // No account data found in sessionStorage
      setLoading(false);
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

  const getVideoUrl = (post: Post): string => {
    switch (post.platform) {
      case "tiktok":
        return (post as TikTokPost).video_url || "";
      case "douyin":
        return (post as DouyinPost).video_url || "";
      case "xiaohongshu":
        return (post as any).video_url || "";
      default:
        return "";
    }
  };

  const getXiaohongshuImages = (post: Post): string[] => {
    if (post.platform === "xiaohongshu") {
      return (post as XiaohongshuPost).images_list || [];
    }
    return [];
  };


  const handleImageGalleryOpen = (post: Post) => {
    const images = getXiaohongshuImages(post);
    if (images.length > 0) {
      setSelectedImages(images);
      setCurrentImageIndex(0);
      setImageGalleryOpen(true);
    }
  };

  const downloadAllImages = async (images: string[], postTitle: string) => {
    try {
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${postTitle}_image_${i + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        // Add delay to avoid overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error('Error downloading images:', error);
    }
  };

  const handlePlayVideo = (post: Post) => {
    const videoUrl = getVideoUrl(post);
    if (videoUrl) {
      setSelectedVideoUrl(videoUrl);
      setSelectedVideoTitle(getPostTitle(post));
      setVideoModalOpen(true);
    }
  };

  const exportToExcel = () => {
    if (!accountData) return;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // User Info Sheet - Export all user data
    const userInfoHeaders = Object.keys(accountData);
    const userInfoData = [userInfoHeaders];
    
    // Convert account data to row format
    const userInfoRow = userInfoHeaders.map(key => {
      const value = (accountData as any)[key];
      if (value === null || value === undefined) return '';
      if (typeof value === 'boolean') return value ? '是' : '否';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    });
    userInfoData.push(userInfoRow);

    const userInfoWS = XLSX.utils.aoa_to_sheet(userInfoData);
    XLSX.utils.book_append_sheet(wb, userInfoWS, 'User Info');

    // User Posts Sheet - Export all posts data
    if (posts.length > 0) {
      // Get all unique keys from all posts
      const allPostKeys = new Set<string>();
      posts.forEach(post => {
        Object.keys(post).forEach(key => allPostKeys.add(key));
      });
      
      const postsHeaders = Array.from(allPostKeys);
      const postsData = [postsHeaders];
      
      // Convert each post to row format
      posts.forEach(post => {
        const postRow = postsHeaders.map(key => {
          const value = (post as any)[key];
          if (value === null || value === undefined) return '';
          if (typeof value === 'boolean') return value ? '是' : '否';
          if (typeof value === 'object') {
            // Special handling for arrays and objects
            if (Array.isArray(value)) {
              return value.map(item => 
                typeof item === 'object' ? JSON.stringify(item) : String(item)
              ).join('; ');
            }
            return JSON.stringify(value);
          }
          return String(value);
        });
        postsData.push(postRow);
      });
      
      const postsWS = XLSX.utils.aoa_to_sheet(postsData);
      XLSX.utils.book_append_sheet(wb, postsWS, 'User Posts');
    }

    // Generate and download file
    const fileName = `${accountData.nickname}_完整数据_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
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
        return (post as any).share_url || "";
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

  if (loading) {
    return (
      <DashboardLayout title="加载中..." subtitle="正在加载账号详情">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!accountData) {
    return (
      <DashboardLayout title="账号详情" subtitle="账号数据详情">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">无法加载账号数据</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            请从账号列表页面点击进入，或者账号数据可能已过期。
            如需查看账号详情，请先选择账号。
          </p>
          <Button onClick={handleBackClick} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回账号列表
          </Button>
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
                                  <div className="relative w-20 h-14 rounded overflow-hidden bg-gray-200 cursor-pointer group"
                                       onClick={() => {
                                         if (post.platform === "xiaohongshu") {
                                           const images = getXiaohongshuImages(post);
                                           const videoUrl = getVideoUrl(post);
                                           if (images.length > 0) {
                                             handleImageGalleryOpen(post);
                                           } else if (videoUrl) {
                                             handlePlayVideo(post);
                                           }
                                         } else {
                                           handlePlayVideo(post);
                                         }
                                       }}>
                                    {post.platform === "xiaohongshu" ? (
                                      (() => {
                                        const images = getXiaohongshuImages(post);
                                        const videoUrl = getVideoUrl(post);
                                        if (images.length > 0) {
                                          return (
                                            <>
                                              <img
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                                src={images[0]}
                                                alt="Post preview"
                                              />
                                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                                <div className="bg-white rounded-full p-1.5 opacity-80 group-hover:opacity-100 shadow-lg">
                                                  <Image className="h-3 w-3 text-gray-700" />
                                                </div>
                                              </div>
                                              {images.length > 1 && (
                                                <div className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                                                  {images.length}
                                                </div>
                                              )}
                                            </>
                                          );
                                        } else if (videoUrl) {
                                          return (
                                            <>
                                              <video
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                                src={videoUrl}
                                                muted
                                                preload="metadata"
                                              />
                                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                                <div className="bg-white rounded-full p-1.5 opacity-80 group-hover:opacity-100 shadow-lg">
                                                  <Play className="h-3 w-3 text-gray-700" />
                                                </div>
                                              </div>
                                            </>
                                          );
                                        } else {
                                          return (
                                            <div className="w-full h-full flex items-center justify-center">
                                              <Image className="h-4 w-4 text-gray-500" />
                                            </div>
                                          );
                                        }
                                      })()
                                    ) : getVideoUrl(post) ? (
                                      <>
                                        <video
                                          className="absolute top-0 left-0 w-full h-full object-cover"
                                          src={getVideoUrl(post)}
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
                                  <PostDetailsDropdown
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

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={imageGalleryOpen}
        onClose={() => setImageGalleryOpen(false)}
        images={selectedImages}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
        postTitle={selectedVideoTitle}
        onDownloadAll={() => downloadAllImages(selectedImages, selectedVideoTitle)}
      />
    </DashboardLayout>
  );
}
