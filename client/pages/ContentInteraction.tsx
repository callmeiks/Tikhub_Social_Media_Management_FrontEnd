import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";

const supportedPlatforms = [
  { id: "douyin", name: "抖音", emoji: "🎤", domain: "douyin.com" },
  { id: "xiaohongshu", name: "小红书", emoji: "📖", domain: "xiaohongshu.com" },
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
  },
  {
    id: 2,
    title: "学生党宿舍收纳神器推荐",
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
  },
  {
    id: 4,
    title: "创意料理：芝士焗红薯制作教程",
    platform: "哔哩哔哩",
    author: "美食up主",
    url: "https://www.bilibili.com/video/BV123456789",
    publishedAt: "2024-01-18",
    views: "89万",
    likes: "12.5万",
    comments: "2.8万",
    shares: "4.1千",
    collections: "8.9万",
    addedAt: "2024-01-21 16:45",
  },
];

export default function ContentInteraction() {
  const [batchUrls, setBatchUrls] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contentData, setContentData] = useState(sampleContentData);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    supportedPlatforms.map((p) => p.name),
  );

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

  const exportContentData = () => {
    if (filteredContentData.length === 0) {
      alert("没有可导出的数据");
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
      ...filteredContentData.map((content) => [
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
      { width: 12 }, // 发布时间
      { width: 12 }, // 播放量
      { width: 10 }, // 点赞数
      { width: 10 }, // 评论数
      { width: 10 }, // 分享数
      { width: 10 }, // 收藏数
      { width: 16 }, // 添加时间
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
    link.download = `作品互动数据_${filteredContentData.length}条记录.xlsx`;
    link.click();
  };

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
                作品链接（每行一个，最多50个）
              </label>
              <Textarea
                placeholder={`请粘贴作品链接，每行一个：

https://www.douyin.com/video/123456789
https://www.xiaohongshu.com/discovery/item/abcdef123
https://www.tiktok.com/@username/video/123
https://www.bilibili.com/video/BV123456789
https://www.youtube.com/watch?v=example123

支持抖音、小红书、快手、B站、YouTube、TikTok、Instagram、X等平台`}
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
                <span>链接数量超过限制，请删除多余的链接</span>
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
                <Button
                  size="sm"
                  onClick={exportContentData}
                  disabled={filteredContentData.length === 0}
                  className="h-8 brand-accent"
                >
                  <Download className="mr-2 h-3.5 w-3.5" />
                  导出Excel ({filteredContentData.length})
                </Button>
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
                      <TableHead className="w-[300px]">作品标题</TableHead>
                      <TableHead className="w-[80px]">平台</TableHead>
                      <TableHead className="w-[120px]">作者</TableHead>
                      <TableHead className="w-[100px]">发布时间</TableHead>
                      <TableHead className="w-[100px]">播放量</TableHead>
                      <TableHead className="w-[80px]">点赞</TableHead>
                      <TableHead className="w-[80px]">评论</TableHead>
                      <TableHead className="w-[80px]">分享</TableHead>
                      <TableHead className="w-[80px]">收藏</TableHead>
                      <TableHead className="w-[60px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContentData.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell className="font-medium">
                          <div
                            className="max-w-[280px] truncate"
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
                        <TableCell className="text-sm">
                          {content.author}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(content.url, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
