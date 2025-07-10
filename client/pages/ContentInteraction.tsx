import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  RefreshCw,
  Download,
  Filter,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Users,
  CheckCircle,
  AlertTriangle,
  Link,
  BarChart3,
  Plus,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Star,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Play,
  Image,
  User,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

const supportedPlatforms = [
  { id: "douyin", name: "��音", emoji: "🎤", domain: "douyin.com" },
  {
    id: "xiaohongshu",
    name: "小红书",
    emoji: "����",
    domain: "xiaohongshu.com",
  },
  { id: "kuaishou", name: "快手", emoji: "⚡", domain: "kuaishou.com" },
  { id: "bilibili", name: "哔哩哔哩", emoji: "📺", domain: "bilibili.com" },
  { id: "youtube", name: "YouTube", emoji: "📹", domain: "youtube.com" },
  { id: "tiktok", name: "TikTok", emoji: "🎵", domain: "tiktok.com" },
  { id: "x", name: "X", emoji: "🐦", domain: "x.com" },
  { id: "instagram", name: "Instagram", emoji: "📷", domain: "instagram.com" },
];

// Sample data for demonstration
const sampleContentData = [
  {
    id: 1,
    title: "超火的韩式裸妆教程！新手必看",
    platform: "抖音",
    author: "美妆达人小丽",
    url: "https://www.douyin.com/video/123456",
    publishedAt: "2024-01-20",
    views: "230万",
    likes: "15.6万",
    comments: "3.2万",
    shares: "8.5千",
    collections: "12.3万",
    addedAt: "2024-01-21 10:30",
    coverUrl:
      "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=400&h=600&fit=crop",
    duration: "00:15",
    contentType: "美妆教程",
  },
  {
    id: 2,
    title: "学生党宿舍收���神器推荐",
    platform: "小红书",
    author: "生活记录家",
    url: "https://www.xiaohongshu.com/discovery/item/456789",
    publishedAt: "2024-01-19",
    views: "120万",
    likes: "8.9万",
    comments: "1.5万",
    shares: "3.2千",
    collections: "25.6万",
    addedAt: "2024-01-21 09:15",
    coverUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop",
    duration: "-",
    contentType: "生活分享",
  },
  {
    id: 3,
    title: "iPhone 15 Pro Max Deep Review",
    platform: "TikTok",
    author: "TechReviewer",
    url: "https://www.tiktok.com/@techreviewer/video/789012",
    publishedAt: "2024-01-21",
    views: "450万",
    likes: "25.8万",
    comments: "8.9万",
    shares: "12.5千",
    collections: "18.7万",
    addedAt: "2024-01-21 14:20",
    coverUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=600&fit=crop",
    duration: "03:25",
    contentType: "数码评测",
  },
  {
    id: 4,
    title: "创意料理：芝士焗红薯制作教程",
    platform: "哔哩哔哩",
    author: "��食up主",
    url: "https://www.bilibili.com/video/BV123456789",
    publishedAt: "2024-01-18",
    views: "89万",
    likes: "12.5万",
    comments: "2.8万",
    shares: "4.1千",
    collections: "8.9万",
    addedAt: "2024-01-21 16:45",
    coverUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop",
    duration: "05:30",
    contentType: "美食制作",
  },
];

// 作品详情展示组件
const ContentDetailsRow: React.FC<{ content: any }> = ({ content }) => {
  return (
    <div className="p-4 bg-muted/30 border-t">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 作品详情 */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            作品详情
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                内容类型:
              </span>
              <span className="ml-2">{content.contentType}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">时长:</span>
              <span className="ml-2">{content.duration}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                发布时间:
              </span>
              <span className="ml-2">{content.publishedAt}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                添加时间:
              </span>
              <span className="ml-2">{content.addedAt}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                作品链接:
              </span>
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:underline text-xs break-all"
              >
                {content.url.length > 60
                  ? content.url.substring(0, 60) + "..."
                  : content.url}
              </a>
            </div>
          </div>
        </div>

        {/* 作者信息 */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <User className="h-4 w-4 mr-2" />
            作者信息
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                作者名���:
              </span>
              <span className="ml-2">{content.author}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                发布平台:
              </span>
              <span className="ml-2">{content.platform}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">作品ID:</span>
              <span className="ml-2 font-mono text-xs">{content.id}</span>
            </div>
          </div>
        </div>

        {/* 数据统计 */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            数据统计
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1 text-blue-500" />
              <span className="font-medium text-muted-foreground">播放:</span>
              <span className="ml-1">{content.views}</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-3 w-3 mr-1 text-red-500" />
              <span className="font-medium text-muted-foreground">点赞:</span>
              <span className="ml-1">{content.likes}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
              <span className="font-medium text-muted-foreground">评论:</span>
              <span className="ml-1">{content.comments}</span>
            </div>
            <div className="flex items-center">
              <Share2 className="h-3 w-3 mr-1 text-purple-500" />
              <span className="font-medium text-muted-foreground">分享:</span>
              <span className="ml-1">{content.shares}</span>
            </div>
            <div className="flex items-center col-span-2">
              <Users className="h-3 w-3 mr-1 text-orange-500" />
              <span className="font-medium text-muted-foreground">收藏:</span>
              <span className="ml-1">{content.collections}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ContentInteraction() {
  const navigate = useNavigate();
  const [batchUrls, setBatchUrls] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contentData, setContentData] = useState(sampleContentData);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    supportedPlatforms.map((p) => p.name),
  );
  const [selectedContent, setSelectedContent] = useState<number[]>([]);
  const [expandedContent, setExpandedContent] = useState<number[]>([]);

  const urlCount = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0).length;

  const validateUrl = (url: string) => {
    return supportedPlatforms.some((platform) => url.includes(platform.domain));
  };

  const invalidUrls = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0 && !validateUrl(url));

  const hasInvalidUrls = invalidUrls.length > 0;

  // Filter content by selected platforms
  const filteredContentData = contentData.filter((content) =>
    selectedPlatforms.includes(content.platform),
  );

  // Clear selected content that are no longer visible due to platform filtering
  useEffect(() => {
    const filteredContentIds = contentData
      .filter((content) => selectedPlatforms.includes(content.platform))
      .map((content) => content.id);
    setSelectedContent((prev) =>
      prev.filter((id) => filteredContentIds.includes(id)),
    );
  }, [selectedPlatforms, contentData]);

  const handleAnalyze = async () => {
    const urls = batchUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      alert("请输入至少一个作品链接");
      return;
    }

    if (urls.length > 50) {
      alert("最多支持50个作品链接，请减少数量");
      return;
    }

    if (hasInvalidUrls) {
      alert("存在无效链接，请检查后重试");
      return;
    }

    setIsAnalyzing(true);
    // 模拟API调用
    setTimeout(() => {
      setIsAnalyzing(false);
      alert(`成功添加 ${urls.length} 个作品到分析队列`);
    }, 3000);
  };

  const togglePlatform = (platformName: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformName)
        ? prev.filter((p) => p !== platformName)
        : [...prev, platformName],
    );
  };

  const selectAllPlatforms = () => {
    setSelectedPlatforms(supportedPlatforms.map((p) => p.name));
  };

  const clearAllPlatforms = () => {
    setSelectedPlatforms([]);
  };

  const toggleContentSelection = (contentId: number) => {
    setSelectedContent((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId],
    );
  };

  const selectAllContent = () => {
    setSelectedContent(filteredContentData.map((content) => content.id));
  };

  const clearAllContent = () => {
    setSelectedContent([]);
  };

  const toggleContentExpansion = (contentId: number) => {
    setExpandedContent((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId],
    );
  };

  const handleContentAction = (action: string, contentId: number) => {
    const content = contentData.find((c) => c.id === contentId);
    if (!content) return;

    switch (action) {
      case "view":
        window.open(content.url, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(content.url);
        alert("链��已复制到剪贴板");
        break;
      case "edit":
        // TODO: 实现编辑功能
        alert(`编辑作品: ${content.title}`);
        break;
      case "star":
        // TODO: 实现收藏功能
        alert(`收藏作品: ${content.title}`);
        break;

      case "delete":
        if (confirm(`确定要删除作品"${content.title}"吗？`)) {
          setContentData((prev) => prev.filter((c) => c.id !== contentId));
          setSelectedContent((prev) => prev.filter((id) => id !== contentId));
          alert("作品已删除");
        }
        break;
      default:
        break;
    }
  };

  const exportContentData = () => {
    const selectedContentData = contentData.filter((content) =>
      selectedContent.includes(content.id),
    );

    if (selectedContentData.length === 0) {
      alert("请选择要导出的作���数据");
      return;
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Prepare data for export
    const exportData = [
      [
        "作品标题",
        "平台",
        "作者",
        "发布时间",
        "播放量",
        "点赞数",
        "评论数",
        "分享数",
        "收藏数",
        "添加时间",
        "链接",
      ],
      ...selectedContentData.map((content) => [
        content.title,
        content.platform,
        content.author,
        content.publishedAt,
        content.views,
        content.likes,
        content.comments,
        content.shares,
        content.collections,
        content.addedAt,
        content.url,
      ]),
    ];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);

    // Set column widths
    worksheet["!cols"] = [
      { width: 40 }, // 作品标题
      { width: 10 }, // 平台
      { width: 15 }, // 作者
      { width: 12 }, // 发布时��
      { width: 12 }, // 播放量
      { width: 10 }, // 点赞数
      { width: 10 }, // 评论数
      { width: 10 }, // 分享数
      { width: 10 }, // 收藏数
      { width: 16 }, // 添加���间
      { width: 50 }, // 链接
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "作品互动数据");

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
    link.download = `作品互动数据_${selectedContentData.length}条记录.xlsx`;
    link.click();
  };

  // Statistics calculations
  const totalContent = filteredContentData.length;
  const totalViews = filteredContentData.reduce((sum, content) => {
    const views = parseInt(
      content.views.replace(/[万千]/g, "").replace(/\D/g, ""),
    );
    return sum + (isNaN(views) ? 0 : views);
  }, 0);
  const totalLikes = filteredContentData.reduce((sum, content) => {
    const likes = parseInt(
      content.likes.replace(/[万千]/g, "").replace(/\D/g, ""),
    );
    return sum + (isNaN(likes) ? 0 : likes);
  }, 0);
  const avgEngagementRate =
    totalContent > 0 ? ((totalLikes / totalViews) * 100).toFixed(2) : "0";

  return (
    <DashboardLayout
      title="作品互动数查询"
      subtitle="分析作品互动数据，洞察内容表现和用户参与度"
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
              支��平台
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

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              添加作��
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              作品数据
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              总数据展示
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6">
            {/* Batch Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    批量添加作品链接
                  </span>
                  <Badge
                    variant={urlCount > 50 ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {urlCount}/50
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    作品��接（每行一个���最多50个）
                  </label>
                  <Textarea
                    placeholder={`请粘贴作品链接，每行一个：

https://www.douyin.com/video/123456789
https://www.xiaohongshu.com/discovery/item/abcdef123
https://www.tiktok.com/@username/video/123
https://www.bilibili.com/video/BV123456789
https://www.youtube.com/watch?v=example123

支持抖音、小���书、快手、B站、YouTube、TikTok、Instagram、X等平台`}
                    value={batchUrls}
                    onChange={(e) => setBatchUrls(e.target.value)}
                    className="min-h-[200px] resize-none font-mono text-sm"
                    maxLength={15000}
                  />
                  <div className="flex items-center space-x-2 text-xs">
                    {urlCount > 0 && !hasInvalidUrls ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">
                          检测到 {urlCount} 个有效作品链接
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
                        支持视频、图文等各类作品链接
                      </span>
                    )}
                  </div>
                </div>

                {urlCount > 50 && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>链接数量超过限制，请删除多余的链��</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleAnalyze}
                      disabled={
                        urlCount === 0 ||
                        urlCount > 50 ||
                        hasInvalidUrls ||
                        isAnalyzing
                      }
                      className="h-8"
                    >
                      {isAnalyzing ? (
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Search className="mr-2 h-3.5 w-3.5" />
                      )}
                      {isAnalyzing ? "分析中..." : "开始分析"}
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
                    {urlCount > 0 && <span>检测到 {urlCount} 个作品链接</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            {/* Data Table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    作品互动数据 ({filteredContentData.length})
                  </span>
                  <div className="flex items-center space-x-2">
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
                            {supportedPlatforms.map((platform) => {
                              const contentCount = contentData.filter(
                                (content) => content.platform === platform.name,
                              ).length;
                              return (
                                <div
                                  key={platform.id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={platform.id}
                                    checked={selectedPlatforms.includes(
                                      platform.name,
                                    )}
                                    onCheckedChange={() =>
                                      togglePlatform(platform.name)
                                    }
                                  />
                                  <label
                                    htmlFor={platform.id}
                                    className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                  >
                                    <span>{platform.emoji}</span>
                                    <span>{platform.name}</span>
                                    {contentCount > 0 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {contentCount}
                                      </Badge>
                                    )}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={selectAllContent}
                        className="h-6 text-xs"
                        disabled={filteredContentData.length === 0}
                      >
                        全选
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllContent}
                        className="h-6 text-xs"
                        disabled={selectedContent.length === 0}
                      >
                        清空
                      </Button>
                      <Button
                        size="sm"
                        onClick={exportContentData}
                        disabled={selectedContent.length === 0}
                        className="h-8 brand-accent"
                      >
                        <Download className="mr-2 h-3.5 w-3.5" />
                        导出选中 ({selectedContent.length})
                      </Button>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredContentData.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      没有找到符合筛选条件的作品数据
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">选择</TableHead>
                          <TableHead className="w-[120px]">作品展示</TableHead>
                          <TableHead className="w-[200px]">作品标题</TableHead>
                          <TableHead className="w-[80px]">平台</TableHead>
                          <TableHead className="w-[100px]">发布���间</TableHead>
                          <TableHead className="w-[100px]">播放量</TableHead>
                          <TableHead className="w-[80px]">点赞</TableHead>
                          <TableHead className="w-[80px]">评论</TableHead>
                          <TableHead className="w-[80px]">分享</TableHead>
                          <TableHead className="w-[80px]">收藏</TableHead>
                          <TableHead className="w-[50px]">操作</TableHead>
                          <TableHead className="w-[50px]">详情</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContentData.map((content) => (
                          <React.Fragment key={content.id}>
                            <TableRow>
                              <TableCell>
                                <Checkbox
                                  checked={selectedContent.includes(content.id)}
                                  onCheckedChange={() =>
                                    toggleContentSelection(content.id)
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center relative">
                                  {content.coverUrl ? (
                                    <img
                                      src={content.coverUrl}
                                      alt={content.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        const next = e.currentTarget
                                          .nextElementSibling as HTMLElement;
                                        if (next) next.style.display = "flex";
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="w-full h-full flex items-center justify-center bg-gray-200"
                                    style={{
                                      display: content.coverUrl
                                        ? "none"
                                        : "flex",
                                    }}
                                  >
                                    {content.duration &&
                                    content.duration !== "-" ? (
                                      <Play className="h-5 w-5 text-gray-500" />
                                    ) : (
                                      <Image className="h-5 w-5 text-gray-500" />
                                    )}
                                  </div>
                                  {content.duration &&
                                    content.duration !== "-" && (
                                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                        {content.duration}
                                      </div>
                                    )}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                <div
                                  className="max-w-[260px] truncate"
                                  title={content.title}
                                >
                                  {content.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  by {content.author}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {content.platform}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {content.publishedAt}
                              </TableCell>
                              <TableCell className="text-sm">
                                <span className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1 text-blue-500" />
                                  {content.views}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm">
                                <span className="flex items-center">
                                  <Heart className="h-3 w-3 mr-1 text-red-500" />
                                  {content.likes}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm">
                                <span className="flex items-center">
                                  <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
                                  {content.comments}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm">
                                <span className="flex items-center">
                                  <Share2 className="h-3 w-3 mr-1 text-purple-500" />
                                  {content.shares}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm">
                                <span className="flex items-center">
                                  <Users className="h-3 w-3 mr-1 text-orange-500" />
                                  {content.collections}
                                </span>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                  >
                                    <DropdownMenuLabel>操作</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleContentAction("view", content.id)
                                      }
                                    >
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      查看原作品
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleContentAction("copy", content.id)
                                      }
                                    >
                                      <Copy className="mr-2 h-4 w-4" />
                                      ��制链接
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleContentAction("star", content.id)
                                      }
                                    >
                                      <Star className="mr-2 h-4 w-4" />
                                      收藏作品
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleContentAction(
                                          "analyze",
                                          content.id,
                                        )
                                      }
                                    >
                                      <BookOpen className="mr-2 h-4 w-4" />
                                      详细分析
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleContentAction("edit", content.id)
                                      }
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      编辑信息
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleContentAction(
                                          "delete",
                                          content.id,
                                        )
                                      }
                                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      删除作品
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    toggleContentExpansion(content.id)
                                  }
                                >
                                  {expandedContent.includes(content.id) ? (
                                    <ChevronUp className="h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3" />
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                            {expandedContent.includes(content.id) && (
                              <TableRow>
                                <TableCell colSpan={12} className="p-0">
                                  <ContentDetailsRow content={content} />
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            {/* Overview Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">总数据展示</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Summary Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {totalContent}
                      </div>
                      <div className="text-sm font-medium">总��品数</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        已添加的作品总数
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {totalViews}万
                      </div>
                      <div className="text-sm font-medium">总播放量</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        所有作���播放量总和
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600 mb-2">
                        {totalLikes}万
                      </div>
                      <div className="text-sm font-medium">总点赞数</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        所有作品点赞总数
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        {avgEngagementRate}%
                      </div>
                      <div className="text-sm font-medium">平均互动率</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        点赞数/播放量比例
                      </div>
                    </div>
                  </div>

                  {/* Platform Distribution */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-3">平台分布</h3>
                    <div className="space-y-2">
                      {supportedPlatforms.map((platform) => {
                        const count = filteredContentData.filter(
                          (content) => content.platform === platform.name,
                        ).length;
                        const percentage =
                          totalContent > 0 ? (count / totalContent) * 100 : 0;
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
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8">
                                {count}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Performing Content */}
                  {filteredContentData.length > 0 && (
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-red-500" />
                        表现最佳作品
                      </h3>
                      <div className="space-y-3">
                        {filteredContentData
                          .sort(
                            (a, b) =>
                              parseInt(b.likes.replace(/[万千]/g, "")) -
                              parseInt(a.likes.replace(/[万千]/g, "")),
                          )
                          .slice(0, 3)
                          .map((content, index) => (
                            <div
                              key={content.id}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                  {index + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium truncate max-w-[300px]">
                                    {content.title}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span>{content.platform}</span>
                                    <span>{content.author}</span>
                                    <span>{content.publishedAt}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-red-600">
                                  {content.likes}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  点赞数
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
