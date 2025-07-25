import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { AvatarImage } from "@/components/ui/avatar-image";
import {
  Search,
  Link,
  FileText,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Download,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ExternalLink,
  Filter,
} from "lucide-react";
import {
  apiClient,
  type Influencer,
  type GetInfluencersParams,
  type TikTokInfluencer,
  type DouyinInfluencer,
  type XiaohongshuInfluencer,
  type KuaishouInfluencer,
  type XInfluencer,
  type YouTubeInfluencer,
  type CollectAccountsParams,
  type CollectAccountsResponse,
} from "@/lib/api";

const supportedPlatforms = [
  { id: "douyin", name: "抖音", emoji: "🎤", active: true },
  { id: "xiaohongshu", name: "小红书", emoji: "📖", active: true },
  { id: "tiktok", name: "TikTok", emoji: "🎵", active: true },
  { id: "kuaishou", name: "快手", emoji: "⚡", active: true },
  { id: "youtube", name: "YouTube", emoji: "📺", active: true },
  { id: "x", name: "X", emoji: "✖️", active: true },
  { id: "instagram", name: "Instagram", emoji: "📷", active: true },
];

export default function AccountInteraction() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("batch");
  const [batchUrls, setBatchUrls] = useState("");
  const [isCollecting, setIsCollecting] = useState(false);
  const [accountData, setAccountData] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["all"]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [collectWorks, setCollectWorks] = useState(false);
  const [collectionQuantity, setCollectionQuantity] = useState("最新50");
  const [sortBy, setSortBy] = useState("默认");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  // 采集结果状态
  const [collectResult, setCollectResult] = useState<{
    total_successful: number;
    total_failed: number;
    failed_urls: string[];
    show: boolean;
  } | null>(null);

  const urlCount = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0).length;

  const fetchInfluencers = async () => {
    if (
      selectedPlatforms.length === 0 ||
      (selectedPlatforms.length === 1 && !selectedPlatforms.includes("all"))
    ) {
      setAccountData([]);
      setTotalItems(0);
      return;
    }

    setLoading(true);
    try {
      // Use port 8001 for account-interaction API
      const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";
      const url = `${apiUrl}/api/account-interaction/influencers`;
      
      const searchParams = new URLSearchParams();
      searchParams.append("platform", selectedPlatforms.includes("all") ? "all" : selectedPlatforms.join(","));
      searchParams.append("page", currentPage.toString());
      searchParams.append("limit", itemsPerPage.toString());
      
      if (searchQuery.trim()) {
        searchParams.append("nickname", searchQuery.trim());
      }

      // Add sorting parameters
      switch (sortBy) {
        case "粉丝量-高到低":
          searchParams.append("sort_by_fans", "descending");
          break;
        case "粉丝量-低到高":
          searchParams.append("sort_by_fans", "ascending");
          break;
        case "作品量-高到低":
          searchParams.append("sort_by_posts", "descending");
          break;
        case "作品量-低到高":
          searchParams.append("sort_by_posts", "ascending");
          break;
        case "点赞量-高到低":
          searchParams.append("sort_by_likes", "descending");
          break;
        case "点赞量-低到高":
          searchParams.append("sort_by_likes", "ascending");
          break;
      }

      const headers: Record<string, string> = {};
      const token = import.meta.env.VITE_BACKEND_API_TOKEN || localStorage.getItem("auth_token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${url}?${searchParams.toString()}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      setAccountData(data.items);
      setTotalItems(data.total);
    } catch (error) {
      console.error("Failed to fetch influencers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "accounts") {
      fetchInfluencers();
    }
  }, [activeTab, selectedPlatforms, currentPage, sortBy, searchQuery]);

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}千`;
    }
    return num.toString();
  };

  const getDisplayFollowers = (influencer: Influencer): string => {
    // 小红书使用 fans_count, 抖音/TikTok/快手使用 follower_count
    const count =
      influencer.follower_count || (influencer as any).fans_count || 0;
    return formatNumber(count);
  };

  const getDisplayWorks = (influencer: Influencer): number => {
    // 小红书使用 post_count, 抖音/TikTok使用 aweme_count, 快手使用 post_count
    return influencer.aweme_count || (influencer as any).post_count || 0;
  };

  const getDisplayLikes = (influencer: Influencer): string => {
    // 小红书使用 liked_count, 抖音/TikTok使用 total_favorited
    const count =
      influencer.total_favorited || (influencer as any).liked_count || 0;
    return formatNumber(count);
  };

  const getPlatformDisplayName = (platform: string): string => {
    const platformMap: { [key: string]: string } = {
      douyin: "抖音",
      xiaohongshu: "小红书",
      tiktok: "TikTok",
      kuaishou: "快手",
      youtube: "YouTube",
      x: "X",
      instagram: "Instagram",
    };
    return platformMap[platform] || platform;
  };

  const getAvatarUrl = (account: Influencer): string => {
    return (account as any).avatar_url || "";
  };

  const handleCollect = async () => {
    if (urlCount === 0) {
      alert("请输入账号链接");
      return;
    }

    if (urlCount > 20) {
      alert("账号数量不能超过20个");
      return;
    }

    setIsCollecting(true);
    // 隐藏之前的结果
    setCollectResult(null);

    try {
      const urls = batchUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      // 转换 collectionQuantity 为数字
      const collectCountMap: { [key: string]: number } = {
        最新50: 50,
        最新100: 100,
        最新200: 200,
      };

      const collectParams: CollectAccountsParams = {
        urls: urls,
        collectPosts: collectWorks,
        collectCount: collectCountMap[collectionQuantity] || 50,
      };

      const response: CollectAccountsResponse =
        await apiClient.collectAccounts(collectParams);

      setIsCollecting(false);

      // 显示采集结果
      setCollectResult({
        total_successful: response.total_successful,
        total_failed: response.total_failed,
        failed_urls: response.failed_urls,
        show: true,
      });

      // 清空输入框
      setBatchUrls("");

      // 刷新账户列表
      fetchInfluencers();
    } catch (error) {
      setIsCollecting(false);
      console.error("采集账号失败:", error);
      alert("采集失败，请检查网络连接或稍后重试");
    }
  };

  const filteredAccountData = accountData;

  // Clear selected accounts that are no longer visible due to platform filtering
  useEffect(() => {
    const filteredAccountIds = accountData
      .filter((account) =>
        selectedPlatforms.includes(getPlatformDisplayName(account.platform)),
      )
      .map((acc) => acc.id);
    setSelectedAccounts((prev) =>
      prev.filter((id) => filteredAccountIds.includes(id)),
    );
  }, [selectedPlatforms, accountData]);

  // Statistics calculations
  const totalAccounts = filteredAccountData.length;
  const totalWorks = filteredAccountData.reduce(
    (sum, acc) => sum + getDisplayWorks(acc),
    0,
  );
  const highestLikesAccount =
    filteredAccountData.length > 0
      ? filteredAccountData.reduce((max, acc) => {
          const maxLikes = max.total_favorited || max.liked_acount || 0;
          const accLikes = acc.total_favorited || acc.liked_acount || 0;
          return accLikes > maxLikes ? acc : max;
        })
      : null;

  const togglePlatform = (platformName: string) => {
    if (platformName === "all") {
      setSelectedPlatforms(["all"]);
    } else {
      setSelectedPlatforms((prev) => {
        const filtered = prev.filter((p) => p !== "all");
        return filtered.includes(platformName)
          ? filtered.filter((p) => p !== platformName)
          : [...filtered, platformName];
      });
    }
  };

  const selectAllPlatforms = () => {
    setSelectedPlatforms(["all"]);
  };

  const clearAllPlatforms = () => {
    setSelectedPlatforms([]);
  };

  const toggleAccountSelection = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId],
    );
  };

  const selectAllAccounts = () => {
    setSelectedAccounts(filteredAccountData.map((acc) => acc.id));
  };

  const clearAllAccounts = () => {
    setSelectedAccounts([]);
  };

  const handleAccountClick = (account: Influencer) => {
    // Store account data in sessionStorage for the detail page
    sessionStorage.setItem("selectedAccount", JSON.stringify(account));
    navigate(
      `/data-collection/account-details/${account.platform}/${account.id}`,
    );
  };

  const exportAccountData = (accountId: string) => {
    // This would need to be implemented with actual posts data from API
    console.log("Export account data for:", accountId);
  };

  const exportSelectedAccounts = async () => {
    const selectedAccountsData = accountData.filter((acc) =>
      selectedAccounts.includes(acc.id),
    );

    if (selectedAccountsData.length === 0) {
      alert("请选择要导出的账号");
      return;
    }

    setLoading(true);
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Group accounts by platform
      const accountsByPlatform = selectedAccountsData.reduce(
        (acc, account) => {
          const platform = account.platform;
          if (!acc[platform]) {
            acc[platform] = [];
          }
          acc[platform].push(account);
          return acc;
        },
        {} as Record<string, Influencer[]>,
      );

      // Create a sheet for each platform
      for (const [platform, accounts] of Object.entries(accountsByPlatform)) {
        const platformDisplayName = getPlatformDisplayName(platform);

        // Create comprehensive data for this platform
        const sheetData: any[][] = [];

        // Add platform-specific headers
        if (platform === "tiktok") {
          sheetData.push([
            "昵称",
            "用户ID",
            "唯一标识",
            "分类",
            "签名",
            "签名语言",
            "分享链接",
            "Instagram",
            "Twitter",
            "YouTube频道",
            "粉丝数",
            "关注数",
            "获赞总数",
            "作品数",
            "企业认证",
            "商务等级",
            "明星认证",
            "特效师",
            "直播带货",
            "消息聊天入口",
            "商品橱窗",
            "新商品",
            "添加时间",
            "更新时间",
          ]);

          // Add TikTok account data
          accounts.forEach((account) => {
            const tiktokAccount = account as TikTokInfluencer;
            sheetData.push([
              tiktokAccount.nickname,
              tiktokAccount.uid,
              tiktokAccount.unique_id,
              tiktokAccount.category,
              tiktokAccount.signature,
              tiktokAccount.signature_language,
              tiktokAccount.share_url,
              tiktokAccount.ins_id,
              tiktokAccount.twitter_id,
              tiktokAccount.youtube_channel_title,
              tiktokAccount.follower_count,
              tiktokAccount.following_count,
              tiktokAccount.total_favorited,
              tiktokAccount.aweme_count,
              tiktokAccount.is_enterprise_verify ? "是" : "否",
              tiktokAccount.commerce_user_level,
              tiktokAccount.is_star ? "是" : "否",
              tiktokAccount.is_effect_artist ? "是" : "否",
              tiktokAccount.live_commerce ? "是" : "否",
              tiktokAccount.message_chat_entry ? "是" : "否",
              tiktokAccount.with_commerce_entry ? "是" : "否",
              tiktokAccount.with_new_goods ? "是" : "否",
              new Date(tiktokAccount.created_at).toLocaleString("zh-CN"),
              new Date(tiktokAccount.updated_at).toLocaleString("zh-CN"),
            ]);
          });
        } else if (platform === "douyin") {
          sheetData.push([
            "昵称",
            "唯一标识",
            "年龄",
            "性别",
            "头像链接",
            "签名",
            "分享链接",
            "粉丝数",
            "关注数",
            "获赞总数",
            "最高粉丝数",
            "作品数",
            "IP位置",
            "明星认证",
            "特效师",
            "政务媒体",
            "直播带货",
            "星图达人",
            "商品橱窗",
            "融合商店",
            "新商品",
            "添加时间",
            "更新时间",
          ]);

          // Add Douyin account data
          accounts.forEach((account) => {
            const douyinAccount = account as DouyinInfluencer;
            sheetData.push([
              douyinAccount.nickname,
              douyinAccount.unique_id,
              douyinAccount.age,
              douyinAccount.gender === 1
                ? "男"
                : douyinAccount.gender === 2
                  ? "女"
                  : "未知",
              douyinAccount.avatar_url,
              douyinAccount.signature,
              douyinAccount.share_url,
              douyinAccount.follower_count,
              douyinAccount.following_count,
              douyinAccount.total_favorited,
              douyinAccount.max_follower_count,
              douyinAccount.aweme_count,
              douyinAccount.ip_location,
              douyinAccount.is_star ? "是" : "否",
              douyinAccount.is_effect_artist ? "是" : "否",
              douyinAccount.is_gov_media_vip ? "是" : "否",
              douyinAccount.is_live_commerce ? "是" : "否",
              douyinAccount.is_xingtu_kol ? "是" : "否",
              douyinAccount.with_commerce_entry ? "是" : "否",
              douyinAccount.with_fusion_shop_entry ? "是" : "否",
              douyinAccount.with_new_goods ? "是" : "否",
              new Date(douyinAccount.created_at).toLocaleString("zh-CN"),
              new Date(douyinAccount.updated_at).toLocaleString("zh-CN"),
            ]);
          });
        } else if (platform === "xiaohongshu") {
          sheetData.push([
            "昵称",
            "用户ID",
            "小红书ID",
            "性别",
            "头像链接",
            "个人描述",
            "分享链接",
            "作品数",
            "获赞数",
            "收藏数",
            "关注数",
            "粉丝数",
            "IP位置",
            "小红书会员",
            "标签",
            "官方认证",
            "添加时间",
            "更新时间",
          ]);

          // Add Xiaohongshu account data
          accounts.forEach((account) => {
            const xhsAccount = account as XiaohongshuInfluencer;
            sheetData.push([
              xhsAccount.nickname,
              xhsAccount.user_id,
              xhsAccount.red_id,
              xhsAccount.gender === 1
                ? "男"
                : xhsAccount.gender === 2
                  ? "女"
                  : "未知",
              xhsAccount.avatar_url,
              xhsAccount.desc,
              xhsAccount.share_url,
              xhsAccount.post_count,
              xhsAccount.liked_count,
              xhsAccount.collected_count,
              xhsAccount.following_count,
              xhsAccount.fans_count,
              xhsAccount.ip_location,
              xhsAccount.is_red_club ? "是" : "否",
              xhsAccount.tags ? xhsAccount.tags.join(", ") : "",
              xhsAccount.red_official_verified ? "是" : "否",
              new Date(xhsAccount.created_at).toLocaleString("zh-CN"),
              new Date(xhsAccount.updated_at).toLocaleString("zh-CN"),
            ]);
          });
        } else if (platform === "kuaishou") {
          sheetData.push([
            "昵称",
            "用户ID",
            "快手ID",
            "性别",
            "头像链接",
            "个人简介",
            "城市",
            "星座",
            "粉丝数",
            "关注数",
            "作品数",
            "动态数",
            "是否认证",
            "是否被封禁",
            "动态开启",
            "隐私用户",
            "添加时间",
            "更新时间",
          ]);

          // Add Kuaishou account data
          accounts.forEach((account) => {
            const kuaishouAccount = account as KuaishouInfluencer;
            sheetData.push([
              kuaishouAccount.nickname,
              kuaishouAccount.user_id,
              kuaishouAccount.kwai_id,
              kuaishouAccount.user_sex === "M" ? "男" : kuaishouAccount.user_sex === "F" ? "女" : "未知",
              kuaishouAccount.avatar_url,
              kuaishouAccount.user_text,
              kuaishouAccount.city_name,
              kuaishouAccount.constellation,
              kuaishouAccount.follower_count,
              kuaishouAccount.following_count,
              kuaishouAccount.post_count,
              kuaishouAccount.moment_count,
              kuaishouAccount.is_verified ? "是" : "否",
              kuaishouAccount.is_user_banned ? "是" : "否",
              kuaishouAccount.enable_moment ? "是" : "否",
              kuaishouAccount.privacy_user === "1" ? "是" : "否",
              new Date(kuaishouAccount.created_at).toLocaleString("zh-CN"),
              new Date(kuaishouAccount.updated_at).toLocaleString("zh-CN"),
            ]);
          });
        } else if (platform === "x") {
          sheetData.push([
            "昵称",
            "用户名",
            "REST ID",
            "头像链接",
            "个人描述",
            "账号状态",
            "Blue认证",
            "推文数",
            "媒体数",
            "粉丝数",
            "关注数",
            "朋友数",
            "置顶推文ID",
            "标签类型",
            "标签描述",
            "标签链接",
            "账号创建时间",
            "添加时间",
            "更新时间",
          ]);

          // Add X account data
          accounts.forEach((account) => {
            const xAccount = account as XInfluencer;
            sheetData.push([
              xAccount.nickname,
              xAccount.screen_name,
              xAccount.rest_id,
              xAccount.avatar_url,
              xAccount.desc,
              xAccount.account_status,
              xAccount.blue_verified ? "是" : "否",
              xAccount.tweet_count,
              xAccount.media_count,
              xAccount.follower_count,
              xAccount.following_count,
              xAccount.friends_count,
              xAccount.pinned_tweet_id || "",
              xAccount.label_type || "",
              xAccount.label_description || "",
              xAccount.label_link || "",
              new Date(xAccount.account_created).toLocaleString("zh-CN"),
              new Date(xAccount.created_at).toLocaleString("zh-CN"),
              new Date(xAccount.created_at).toLocaleString("zh-CN"), // X平台没有updated_at,使用created_at
            ]);
          });
        } else if (platform === "youtube") {
          sheetData.push([
            "昵称",
            "频道ID",
            "频道名称",
            "头像链接",
            "描述",
            "订阅数",
            "视频数",
            "总观看数",
            "国家/地区",
            "认证状态",
            "商务邮箱",
            "Facebook链接",
            "Twitter链接",
            "Instagram链接",
            "TikTok链接",
            "其他链接",
            "频道创建时间",
            "添加时间",
            "更新时间",
          ]);

          // Add YouTube account data
          accounts.forEach((account) => {
            const youtubeAccount = account as YouTubeInfluencer;
            sheetData.push([
              youtubeAccount.nickname,
              youtubeAccount.channel_id,
              youtubeAccount.channel_name,
              youtubeAccount.avatar_url || youtubeAccount.channel_avatar,
              youtubeAccount.description,
              youtubeAccount.subscriber_count,
              youtubeAccount.video_count,
              youtubeAccount.view_count,
              youtubeAccount.country || "",
              youtubeAccount.is_verified ? "是" : "否",
              youtubeAccount.has_business_email ? "是" : "否",
              youtubeAccount.facebook_link || "",
              youtubeAccount.twitter_link || "",
              youtubeAccount.instagram_link || "",
              youtubeAccount.tiktok_link || "",
              youtubeAccount.other_links ? youtubeAccount.other_links.map(link => `${link.name}: ${link.endpoint}`).join("; ") : "",
              youtubeAccount.channel_creation_date,
              new Date(youtubeAccount.created_at).toLocaleString("zh-CN"),
              new Date(youtubeAccount.updated_at).toLocaleString("zh-CN"),
            ]);
          });
        }

        // Create worksheet for this platform
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

        // Set appropriate column widths
        const colWidths = sheetData[0].map((header, index) => {
          if (header.includes("链接") || header.includes("URL"))
            return { width: 50 };
          if (header.includes("时间")) return { width: 20 };
          if (
            header.includes("昵称") ||
            header.includes("描述") ||
            header.includes("签名")
          )
            return { width: 25 };
          if (header.includes("标签")) return { width: 30 };
          return { width: 15 };
        });

        worksheet["!cols"] = colWidths;

        // Add worksheet to workbook
        const sheetName = `${platformDisplayName}账号 (${accounts.length})`;
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }

      // Create summary sheet
      const summaryData = [
        ["昵称", "平台", "粉丝数", "作品数", "点赞数", "添加时间"],
        ...selectedAccountsData.map((account) => [
          account.nickname,
          getPlatformDisplayName(account.platform),
          getDisplayFollowers(account),
          getDisplayWorks(account),
          getDisplayLikes(account),
          new Date(account.created_at).toLocaleString("zh-CN"),
        ]),
      ];

      const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
      summaryWorksheet["!cols"] = [
        { width: 20 }, // 昵称
        { width: 12 }, // 平台
        { width: 12 }, // 粉丝数
        { width: 10 }, // 作品数
        { width: 12 }, // 点赞数
        { width: 20 }, // 添加时间
      ];

      // Insert summary sheet at the beginning
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "📊 账号汇总");

      // Reorder sheets to put summary first
      const sheetNames = workbook.SheetNames;
      const summaryIndex = sheetNames.indexOf("📊 账号汇总");
      if (summaryIndex > 0) {
        sheetNames.splice(summaryIndex, 1);
        sheetNames.unshift("📊 账号汇总");
      }

      // Generate Excel file and download
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      // Create filename with platform info
      const platformNames = Object.keys(accountsByPlatform)
        .map((p) => getPlatformDisplayName(p))
        .join("_");
      link.download = `账号完整数据_${platformNames}_${selectedAccountsData.length}个账号_${new Date().toLocaleDateString("zh-CN").replace(/\//g, "-")}.xlsx`;
      link.click();
    } catch (error) {
      console.error("导出失败:", error);
      alert("导出失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="账号数据采集"
      subtitle="智能采集账号作品数据，支持多平台内容分析"
      actions={
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={fetchInfluencers}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            刷新数据
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Platform Support */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Users className="mr-2 h-4 w-4" />
              支持平台
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {supportedPlatforms.map((platform) => (
                <Badge
                  key={platform.id}
                  variant="secondary"
                  className="flex items-center space-x-1 h-7"
                >
                  <span>{platform.emoji}</span>
                  <span>{platform.name}</span>
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="batch" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="batch" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              添加账户
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              历史账号数据
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              总数据展示
            </TabsTrigger>
          </TabsList>

          <TabsContent value="batch" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Link className="mr-2 h-4 w-4" />
                    批量添加账号主页链接
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
                    账号主页链接（每行一个，最多20个）
                  </label>
                  <Textarea
                    placeholder={`请粘贴账号主页链接，每行一个，支持以下格式：

https://www.douyin.com/user/123456789
https://www.xiaohongshu.com/user/abcdef123
https://www.tiktok.com/@username
https://www.bilibili.com/space/123456
https://weibo.com/u/123456789

支持抖音、小红书、快手、微博、B站、TikTok、Instagram、X等平台`}
                    value={batchUrls}
                    onChange={(e) => setBatchUrls(e.target.value)}
                    className="min-h-[200px] resize-none font-mono text-sm"
                    maxLength={10000}
                  />
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-muted-foreground">
                      支持主页链接和用户名，每行一个
                    </span>
                  </div>
                </div>

                {/* Collect Works Setting */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        是否采集账号作品
                      </label>
                      <div className="text-xs text-muted-foreground">
                        开启后将采集账号的作品数据
                      </div>
                    </div>
                    <Switch
                      checked={collectWorks}
                      onCheckedChange={setCollectWorks}
                    />
                  </div>

                  {collectWorks && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        采集作品数量
                      </label>
                      <Select
                        value={collectionQuantity}
                        onValueChange={setCollectionQuantity}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="选择采集数量" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="最新50">最新50</SelectItem>
                          <SelectItem value="最新100">最新100</SelectItem>
                          <SelectItem value="最新200">最新200</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-muted-foreground">
                        设置每个账号采集的作品数量
                      </div>
                    </div>
                  )}
                </div>

                {urlCount > 20 && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>账号数量超过限制，请删除多余的链接</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCollect}
                      disabled={urlCount === 0 || urlCount > 20 || isCollecting}
                      className="h-8"
                    >
                      {isCollecting ? (
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Search className="mr-2 h-3.5 w-3.5" />
                      )}
                      {isCollecting ? "采集中..." : "开始采集"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBatchUrls("")}
                      className="h-8"
                    >
                      清空
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {urlCount > 0 && <span>检测到 {urlCount} 个账号链接</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 采集结果显示 */}
            {collectResult && collectResult.show && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-blue-900">
                        采集结果
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCollectResult(null)}
                        className="h-6 w-6 p-0 text-blue-700 hover:text-blue-900"
                      >
                        ×
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          成功添加 {collectResult.total_successful}{" "}
                          个账号到采集队列
                        </span>
                      </div>

                      {collectResult.total_failed > 0 && (
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-800">
                            失败 {collectResult.total_failed} 个账号
                          </span>
                        </div>
                      )}

                      {collectResult.failed_urls.length > 0 && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs font-medium text-red-800 mb-1">
                            失败的URL:
                          </p>
                          <div className="space-y-1">
                            {collectResult.failed_urls.map((url, index) => (
                              <div
                                key={index}
                                className="text-xs text-red-700 font-mono break-all"
                              >
                                {url}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {collectResult.total_successful > 0 && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-xs text-green-800">
                            💡 成功添加后请到 <strong>历史账号数据</strong> 查看
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="accounts" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    账号列表 ({filteredAccountData.length})
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="搜索账号名称..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 w-[200px] pl-8"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[160px] h-8">
                        <SelectValue placeholder="排序方式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="默认">默认排序</SelectItem>
                        <SelectItem value="粉丝量-高到低">粉丝量 ↓</SelectItem>
                        <SelectItem value="粉丝量-低到高">粉丝量 ↑</SelectItem>
                        <SelectItem value="作品量-高到低">作品量 ↓</SelectItem>
                        <SelectItem value="作品量-低到高">作品量 ↑</SelectItem>
                        <SelectItem value="点赞量-高到低">点赞量 ↓</SelectItem>
                        <SelectItem value="点赞量-低到高">点赞量 ↑</SelectItem>
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Filter className="mr-2 h-3.5 w-3.5" />
                          平台筛选 (
                          {selectedPlatforms.includes("all")
                            ? "全部"
                            : selectedPlatforms.length}
                          )
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">选择平台</h4>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={selectAllPlatforms}
                                className="h-6 text-xs"
                              >
                                全选
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllPlatforms}
                                className="h-6 text-xs"
                              >
                                清空
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={selectedPlatforms.includes("all")}
                                onCheckedChange={() => togglePlatform("all")}
                              />
                              <span className="text-sm font-medium">
                                🌐 全部平台
                              </span>
                            </div>
                            {supportedPlatforms.map((platform) => (
                              <div
                                key={platform.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  checked={selectedPlatforms.includes(
                                    platform.name,
                                  )}
                                  onCheckedChange={() =>
                                    togglePlatform(platform.name)
                                  }
                                />
                                <span className="text-sm flex items-center">
                                  {platform.emoji} {platform.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={selectAllAccounts}
                      className="h-8 text-xs"
                      disabled={filteredAccountData.length === 0}
                    >
                      全选
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllAccounts}
                      className="h-8 text-xs"
                      disabled={selectedAccounts.length === 0}
                    >
                      清空
                    </Button>
                    <Button
                      size="sm"
                      onClick={exportSelectedAccounts}
                      disabled={selectedAccounts.length === 0 || loading}
                      className="h-8"
                    >
                      {loading ? (
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-3.5 w-3.5" />
                      )}
                      {loading
                        ? "导出中..."
                        : `导出Excel (${selectedAccounts.length})`}
                    </Button>
                    <Badge variant="secondary" className="text-xs">
                      已添加 {accountData.length} 个账号
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
                      <p className="text-sm text-muted-foreground">
                        正在加载账号数据...
                      </p>
                    </div>
                  ) : filteredAccountData.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        没有找到符合筛选条件的账号
                      </p>
                    </div>
                  ) : (
                    filteredAccountData.map((account) => (
                      <div
                        key={account.id}
                        className="border border-border rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                        onClick={() => handleAccountClick(account)}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={selectedAccounts.includes(account.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedAccounts((prev) => [
                                      ...prev,
                                      account.id,
                                    ]);
                                  } else {
                                    setSelectedAccounts((prev) =>
                                      prev.filter((id) => id !== account.id),
                                    );
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="mr-1"
                              />
                              <AvatarImage
                                src={getAvatarUrl(account)}
                                alt={account.nickname}
                                fallbackText={account.nickname.charAt(0)}
                                size="md"
                              />
                              <div>
                                <h3 className="text-sm font-medium">
                                  {account.nickname}
                                </h3>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {getPlatformDisplayName(account.platform)}
                                  </Badge>
                                  <span className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {getDisplayFollowers(account)} 粉丝
                                  </span>
                                  <span className="flex items-center">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {getDisplayWorks(account)} 作品
                                  </span>
                                  <span className="flex items-center">
                                    <Heart className="h-3 w-3 mr-1 text-red-500" />
                                    {getDisplayLikes(account)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <div className="text-right text-xs text-muted-foreground">
                                <div>添加于</div>
                                <div>
                                  {new Date(
                                    account.created_at,
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  exportAccountData(account.id);
                                }}
                                className="h-8"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                导出
                              </Button>
                              <div className="text-muted-foreground">
                                <ExternalLink className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalItems > itemsPerPage && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      显示第 {(currentPage - 1) * itemsPerPage + 1} 到{" "}
                      {Math.min(currentPage * itemsPerPage, totalItems)} 项，共{" "}
                      {totalItems} 项
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1 || loading}
                      >
                        上一页
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={
                          currentPage * itemsPerPage >= totalItems || loading
                        }
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">总数据展示</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Summary Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {totalAccounts}
                      </div>
                      <div className="text-sm font-medium">总账号数</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        已添加的账号总数
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {totalWorks}
                      </div>
                      <div className="text-sm font-medium">总作品数</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        已采集的作品总数
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        {totalAccounts > 0
                          ? Math.round(totalWorks / totalAccounts)
                          : 0}
                      </div>
                      <div className="text-sm font-medium">平均作品数</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        每个账号平均作品数
                      </div>
                    </div>
                  </div>

                  {/* Top Performer */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      作品总点赞量最高用户
                    </h3>
                    {highestLikesAccount ? (
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="text-lg">
                              {getPlatformDisplayName(
                                highestLikesAccount.platform,
                              ) === "抖音"
                                ? "🎤"
                                : getPlatformDisplayName(
                                      highestLikesAccount.platform,
                                    ) === "小红书"
                                  ? "📖"
                                  : "🎵"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {highestLikesAccount.nickname}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>
                                {getPlatformDisplayName(
                                  highestLikesAccount.platform,
                                )}
                              </span>
                              <span>
                                {getDisplayFollowers(highestLikesAccount)} 粉丝
                              </span>
                              <span>
                                {getDisplayWorks(highestLikesAccount)} 作品
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">
                            {getDisplayLikes(highestLikesAccount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            总点赞数
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Users className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">没有符合筛选条件的账号数据</p>
                      </div>
                    )}
                  </div>

                  {/* Platform Distribution */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-3">平台分布</h3>
                    <div className="space-y-2">
                      {supportedPlatforms.map((platform) => {
                        const count = filteredAccountData.filter(
                          (acc) =>
                            getPlatformDisplayName(acc.platform) ===
                            platform.name,
                        ).length;
                        const percentage =
                          totalAccounts > 0 ? (count / totalAccounts) * 100 : 0;
                        return (
                          <div
                            key={platform.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <span>{platform.emoji}</span>
                              <span className="text-sm">{platform.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">
                                {count}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
