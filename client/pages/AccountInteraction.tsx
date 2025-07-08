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

const supportedPlatforms = [
  { id: "douyin", name: "抖音", emoji: "🎤", active: true },
  { id: "xiaohongshu", name: "小红书", emoji: "📖", active: true },
  { id: "kuaishou", name: "快手", emoji: "⚡", active: true },
  { id: "weibo", name: "微博", emoji: "🎭", active: true },
  { id: "bilibili", name: "哔哩哔哩", emoji: "📺", active: true },
  { id: "tiktok", name: "TikTok", emoji: "🎵", active: true },
  { id: "instagram", name: "Instagram", emoji: "📷", active: true },
  { id: "x", name: "X (Twitter)", emoji: "🐦", active: true },
];

// Sample account data
const sampleAccountData = [
  {
    id: 1,
    name: "美妆达人小丽",
    platform: "抖音",
    profileUrl: "https://www.douyin.com/user/123456",
    followers: "156.8万",
    addedAt: "2024-01-15 14:30",
    totalWorks: 127,
    totalLikes: "2340万",
    totalComments: "45.6万",
    totalShares: "12.3万",
    works: [
      {
        id: 1,
        title: "超火的韩式裸妆教程！新手必看",
        publishedAt: "2024-01-20",
        likes: "15.6万",
        comments: "3.2万",
        shares: "8.5千",
        views: "230万",
        url: "https://www.douyin.com/video/123",
      },
      {
        id: 2,
        title: "5分钟快速护肤步骤分享",
        publishedAt: "2024-01-18",
        likes: "12.3万",
        comments: "2.8万",
        shares: "6.2千",
        views: "180万",
        url: "https://www.douyin.com/video/124",
      },
    ],
  },
  {
    id: 2,
    name: "科技评测师",
    platform: "TikTok",
    profileUrl: "https://www.tiktok.com/@techreviewer",
    followers: "89.2万",
    addedAt: "2024-01-14 16:20",
    totalWorks: 203,
    totalLikes: "1580万",
    totalComments: "28.9万",
    totalShares: "15.6万",
    works: [
      {
        id: 1,
        title: "iPhone 15 Pro Max深度评测",
        publishedAt: "2024-01-19",
        likes: "25.8万",
        comments: "8.9万",
        shares: "12.5千",
        views: "450万",
        url: "https://www.tiktok.com/video/789",
      },
    ],
  },
];

export default function AccountInteraction() {
  const navigate = useNavigate();
  const [batchUrls, setBatchUrls] = useState("");
  const [isCollecting, setIsCollecting] = useState(false);
  const [accountData, setAccountData] = useState(sampleAccountData);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["all"]);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [collectWorks, setCollectWorks] = useState(false);
  const [collectionQuantity, setCollectionQuantity] = useState("最新50");
  const [sortBy, setSortBy] = useState("默认");
  const [searchQuery, setSearchQuery] = useState("");

  const urlCount = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0).length;

  const validateUrl = (url: string) => {
    const platformPatterns = [
      /douyin\.com\/user/,
      /xiaohongshu\.com\/user/,
      /kuaishou\.com\/profile/,
      /weibo\.com\/u/,
      /bilibili\.com\/space/,
      /tiktok\.com\/@/,
      /instagram\.com\//,
      /x\.com\//,
      /twitter\.com\//,
    ];
    return platformPatterns.some((pattern) => pattern.test(url));
  };

  const invalidUrls = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0 && !validateUrl(url));

  const hasInvalidUrls = invalidUrls.length > 0;

  const handleCollect = async () => {
    if (urlCount === 0) {
      alert("请输入账号链接");
      return;
    }

    if (urlCount > 20) {
      alert("账号数量不能超过20个");
      return;
    }

    if (hasInvalidUrls) {
      alert("请修正无效的链接格式");
      return;
    }

    setIsCollecting(true);
    // 模拟API调用
    setTimeout(() => {
      const urls = batchUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      // 这里应该调用实际的API来采集数据
      console.log("采集账号:", urls);
      console.log("采集作品:", collectWorks);
      console.log("采集数量:", collectionQuantity);

      setIsCollecting(false);
      alert(`成功添加 ${urls.length} 个账号到采集队列`);
    }, 3000);
  };

  // Helper function to parse numbers with Chinese units (万, 千)
  const parseNumber = (str: string): number => {
    if (!str) return 0;
    const cleanStr = str.replace(/[^\d.万千]/g, "");
    if (cleanStr.includes("万")) {
      return parseFloat(cleanStr.replace("万", "")) * 10000;
    } else if (cleanStr.includes("千")) {
      return parseFloat(cleanStr.replace("千", "")) * 1000;
    }
    return parseFloat(cleanStr) || 0;
  };

  const filteredAccountData = accountData
    .filter((account) => {
      const platformMatch =
        selectedPlatforms.includes("all") ||
        selectedPlatforms.includes(account.platform);
      const searchMatch =
        searchQuery.trim() === "" ||
        account.name.toLowerCase().includes(searchQuery.toLowerCase());
      return platformMatch && searchMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "粉丝量-高到低":
          return parseNumber(b.followers) - parseNumber(a.followers);
        case "粉丝量-低到高":
          return parseNumber(a.followers) - parseNumber(b.followers);
        case "作品量-高到低":
          return b.totalWorks - a.totalWorks;
        case "作品量-低到高":
          return a.totalWorks - b.totalWorks;
        case "点赞量-高到低":
          return parseNumber(b.totalLikes) - parseNumber(a.totalLikes);
        case "点赞量-低到高":
          return parseNumber(a.totalLikes) - parseNumber(b.totalLikes);
        default:
          return 0; // 默认排序
      }
    });

  // Clear selected accounts that are no longer visible due to platform filtering
  useEffect(() => {
    const filteredAccountIds = accountData
      .filter((account) => selectedPlatforms.includes(account.platform))
      .map((acc) => acc.id);
    setSelectedAccounts((prev) =>
      prev.filter((id) => filteredAccountIds.includes(id)),
    );
  }, [selectedPlatforms, accountData]);

  // Statistics calculations
  const totalAccounts = filteredAccountData.length;
  const totalWorks = filteredAccountData.reduce(
    (sum, acc) => sum + acc.totalWorks,
    0,
  );
  const highestLikesAccount =
    filteredAccountData.length > 0
      ? filteredAccountData.reduce((max, acc) =>
          parseInt(acc.totalLikes.replace(/[万千]/g, "")) >
          parseInt(max.totalLikes.replace(/[万千]/g, ""))
            ? acc
            : max,
        )
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

  const toggleAccountSelection = (accountId: number) => {
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

  const handleAccountClick = (accountId: number) => {
    navigate(`/data-collection/account-details/${accountId}`);
  };

  const exportAccountData = (accountId: number) => {
    const account = accountData.find((acc) => acc.id === accountId);
    if (!account) return;

    const csvContent = [
      [
        "作品标题",
        "发布时间",
        "点赞数",
        "评论数",
        "分享数",
        "播放量",
        "链接",
      ].join(","),
      ...account.works.map((work) =>
        [
          `"${work.title}"`,
          work.publishedAt,
          work.likes,
          work.comments,
          work.shares,
          work.views,
          work.url,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${account.name}_作品数据.csv`;
    link.click();
  };

  const exportSelectedAccounts = () => {
    const selectedAccountsData = accountData.filter((acc) =>
      selectedAccounts.includes(acc.id),
    );

    if (selectedAccountsData.length === 0) {
      alert("请选择要导出的账号");
      return;
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Add a sheet for each selected account
    selectedAccountsData.forEach((account) => {
      // Prepare data for this account
      const sheetData = [
        // Header row
        [
          "作品标题",
          "发布时间",
          "点赞数",
          "评论数",
          "分享数",
          "播放量",
          "链接",
        ],
        // Data rows
        ...account.works.map((work) => [
          work.title,
          work.publishedAt,
          work.likes,
          work.comments,
          work.shares,
          work.views,
          work.url,
        ]),
      ];

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      // Set column widths for better readability
      worksheet["!cols"] = [
        { width: 40 }, // 作品标题
        { width: 12 }, // 发布时间
        { width: 10 }, // 点赞数
        { width: 10 }, // 评论数
        { width: 10 }, // 分享数
        { width: 12 }, // 播放量
        { width: 50 }, // 链接
      ];

      // Clean sheet name (Excel sheet names have restrictions)
      const cleanSheetName = account.name
        .replace(/[\\\/\?\*\[\]]/g, "_")
        .substring(0, 31);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, cleanSheetName);
    });

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
    link.download = `账号作品数据_${selectedAccountsData.length}个账号.xlsx`;
    link.click();
  };

  return (
    <DashboardLayout
      title="账号数据采集"
      subtitle="智能采集账号作品数据，支持多平台内容分析"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
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

        <Tabs defaultValue="batch" className="w-full">
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
                    placeholder={`请粘贴账号主页链接，每行一个��

https://www.douyin.com/user/123456789
https://www.xiaohongshu.com/user/abcdef123
https://www.tiktok.com/@username
https://www.bilibili.com/space/123456
https://weibo.com/u/123456789

支持抖音、小红书、快手、���博、B站、TikTok、Instagram、X等平台`}
                    value={batchUrls}
                    onChange={(e) => setBatchUrls(e.target.value)}
                    className="min-h-[200px] resize-none font-mono text-sm"
                    maxLength={10000}
                  />
                  <div className="flex items-center space-x-2 text-xs">
                    {urlCount > 0 && !hasInvalidUrls ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">
                          检测��� {urlCount} 个���效账号链接
                        </span>
                      </>
                    ) : hasInvalidUrls ? (
                      <>
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        <span className="text-red-600">
                          发现 {invalidUrls.length} 个无效链接，请检查格式
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">
                        支持主页链接和用户名，每行一个
                      </span>
                    )}
                  </div>
                </div>

                {/* Collect Works Setting */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        是否采集账号��品
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
                      disabled={
                        urlCount === 0 ||
                        urlCount > 20 ||
                        hasInvalidUrls ||
                        isCollecting
                      }
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
          </TabsContent>

          <TabsContent value="accounts" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    历史账号数据 ({filteredAccountData.length})
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
                        <SelectItem value="作品量-高��低">作品量 ↓</SelectItem>
                        <SelectItem value="作品量-低到高">作品量 ↑</SelectItem>
                        <SelectItem value="点赞量-高到低">点赞量 ↓</SelectItem>
                        <SelectItem value="点赞量-低到高">点赞量 ↑</SelectItem>
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Filter className="mr-2 h-3.5 w-3.5" />
                          平台筛选 ({selectedPlatforms.length})
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
                      disabled={selectedAccounts.length === 0}
                      className="h-8"
                    >
                      <Download className="mr-2 h-3.5 w-3.5" />
                      导出Excel ({selectedAccounts.length})
                    </Button>
                    <Badge variant="secondary" className="text-xs">
                      已添加 {accountData.length} 个账号
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredAccountData.length === 0 ? (
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
                        onClick={() => handleAccountClick(account.id)}
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
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                {account.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-sm font-medium">
                                  {account.name}
                                </h3>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {account.platform}
                                  </Badge>
                                  <span className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {account.followers} 粉丝
                                  </span>
                                  <span className="flex items-center">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {account.totalWorks} 作品
                                  </span>
                                  <span className="flex items-center">
                                    <Heart className="h-3 w-3 mr-1 text-red-500" />
                                    {account.totalLikes}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <div className="text-right text-xs text-muted-foreground">
                                <div>添加于</div>
                                <div>{account.addedAt}</div>
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
                              {highestLikesAccount.platform === "抖音"
                                ? "🎤"
                                : highestLikesAccount.platform === "小红书"
                                  ? "📖"
                                  : "🎵"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {highestLikesAccount.name}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>{highestLikesAccount.platform}</span>
                              <span>{highestLikesAccount.followers} 粉丝</span>
                              <span>{highestLikesAccount.totalWorks} 作品</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">
                            {highestLikesAccount.totalLikes}
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
                          (acc) => acc.platform === platform.name,
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
                              <span className="text-sm font-medium w-8">
                                {count}
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
