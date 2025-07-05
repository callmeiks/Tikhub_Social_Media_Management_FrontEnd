import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Image as ImageIcon,
  Copy,
  Download,
  RefreshCw,
  Settings,
  Search,
  Link as LinkIcon,
  CheckCircle,
  AlertTriangle,
  Eye,
  Zap,
  Grid3X3,
  Type,
  Palette,
  Folder,
  Clock,
  Trash2,
  XCircle,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const extractionHistory = [
  {
    id: 1,
    url: "https://www.xiaohongshu.com/discovery/item/111111",
    platform: "小红书",
    title: "减肥成功分享！从130斤到100斤的完整攻略",
    status: "completed",
    imageCount: 8,
    extractedAt: "2024-01-14 16:22",
    extractedData: {
      content: `姐妹们好！今天来跟大家分享我的减肥心路历程～

💪 我的减肥数据：
- 开始体重：130斤
- 目标体重：100斤
- 减肥周期：6个月
- 最终体重：98斤

🔥 减肥方法分享：
1. 控制饮食：少油少盐，多吃蛋白质
2. 规律运动：每天至少30分钟有氧运动
3. 充足睡眠：保证每天8小时睡眠
4. 多喝水：每天至少2000ml

⚠️ 踩坑提醒：
- 不要节食！会反弹的
- 不要只做有氧，要加力量训练
- 体重会有波动，看趋势不看单天

💡 心得体会：
减肥是一个长期过程，要有耐心，相信自己一定可以成功！

#减肥分享 #瘦身心得 #健康生活`,
      tags: ["#减肥分享", "#瘦身心得", "#健康生活", "#减肥攻略"],
      images: [
        { description: "减肥前后对比图", size: "750x1000" },
        { description: "健康食谱搭配", size: "750x1000" },
        { description: "运动计划表", size: "750x1000" },
        { description: "体重变化曲线图", size: "750x1000" },
      ],
    },
  },
  {
    id: 2,
    url: "https://www.xiaohongshu.com/discovery/item/222222",
    platform: "小红书",
    title: "新手化妆教程｜打造自然裸妆的5个步骤",
    status: "completed",
    imageCount: 6,
    extractedAt: "2024-01-13 09:15",
    extractedData: {
      content: `Hello美女们！今天教大家画一个简单的日常裸妆～

✨ 需要的产品：
- 妆前乳
- 粉底液
- 遮瑕膏
- 散粉
- 眉笔
- 腮红
- 口红

📝 具体步骤：
1️⃣ 妆前打底：先用妆前乳打底，让妆容更持久
2️⃣ 底妆处理：用粉底液均匀涂抹全脸
3️⃣ 遮瑕重点：用遮瑕膏遮盖痘印和黑眼圈
4️⃣ 定妆处理：用散粉轻拍定妆
5️⃣ 眉毛画法：用眉笔勾勒自然眉形

💄 小技巧：
- 粉底液要选择贴合肤色的
- 腮红可以让气色更好
- 口红选择日常色号

#化妆教程 #裸妆 #新手化妆`,
      tags: ["#化妆教程", "#裸妆", "#新手化妆", "#美妆分享"],
      images: [
        { description: "化妆前后对比", size: "750x1000" },
        { description: "化妆品清单", size: "750x1000" },
        { description: "步骤详解图", size: "750x1000" },
      ],
    },
  },
  {
    id: 3,
    url: "https://www.xiaohongshu.com/discovery/item/333333",
    platform: "小红书",
    title: "学生党必看！宿舍收纳神器推荐",
    status: "completed",
    imageCount: 5,
    extractedAt: "2024-01-12 20:30",
    extractedData: {
      content: `同学们好！分享一下我的宿舍收纳经验～

🏠 宿舍收纳痛点：
- 空间小东西多
- 没有足够储物空间
- 东西容易乱

🛍️ 收纳神器推荐：
1. 床下收纳箱：可以放换季衣物
2. 挂式收纳袋：充分利用墙面空间
3. 桌面收纳盒：小物件分类存放
4. 真空压缩袋：节省50%空间

💡 收纳技巧：
- 物品分类标签化
- 常用物品放在容易拿到的地方
- 定期整理，养成好习惯

花费不到100元就能让宿舍焕然一新！

#宿舍收纳 #学生党 #收纳神器`,
      tags: ["#宿舍收纳", "#学生党", "#收纳神器", "#整理收纳"],
      images: [
        { description: "收纳前后对比", size: "750x1000" },
        { description: "收纳产品展示", size: "750x1000" },
        { description: "整理步骤图", size: "750x1000" },
      ],
    },
  },
];

const extractionQueue = [
  {
    id: 1,
    url: "https://www.xiaohongshu.com/discovery/item/123456",
    platform: "小红书",
    title: "超详细护肤心得分享！敏感肌女孩的逆袭之路",
    status: "completed",
    progress: 100,
    imageCount: 4,
    extractedAt: "2024-01-15 14:30",
  },
  {
    id: 2,
    url: "https://xhslink.com/abcdef",
    platform: "小红书",
    title: "冬季穿搭分享 | 温暖又时尚的搭配技巧",
    status: "extracting",
    progress: 75,
    imageCount: 6,
    extractedAt: "",
  },
  {
    id: 3,
    url: "https://www.xiaohongshu.com/discovery/item/789012",
    platform: "小红书",
    title: "烘焙新手必看！零失败蛋糕制作教程",
    status: "pending",
    progress: 0,
    imageCount: 0,
    extractedAt: "",
  },
  {
    id: 4,
    url: "https://www.xiaohongshu.com/discovery/item/345678",
    platform: "小红书",
    title: "居家收纳神器推荐，告别凌乱生活",
    status: "error",
    progress: 0,
    imageCount: 0,
    extractedAt: "",
  },
];

const extractedContent = {
  title: "超详细护肤心得分享！敏感肌女孩的逆袭之路",
  content: `姐妹们好！今天来分享一下我的护肤心得，作为一个敏感肌女孩，真的是踩了太多坑才找到适合自己的护肤��法😭

💡 我的肌肤状况：
- 敏感肌，容易泛红
- T区偏油，脸颊偏干
- 毛孔粗大，偶尔爆痘

🌟 护肤步骤分享：
1️⃣ 温和洁面：氨基酸洁面，早晚各一次
2️⃣ 爽肤水：含有神经酰胺的保湿型
3️⃣ 精华：烟酰胺精华，隔天使用
4️⃣ 面霜：选择质地轻薄但保湿力强的
5️⃣ 防晒：物理防晒，SPF30以上

✨ 重点产品推荐：
- 洁面：某某氨基酸洁面泡沫
- 爽肤水：某某神经酰胺爽肤水
- 精华：某某烟酰胺精华液
- 面霜：某某修护面霜

💖 小贴士：
- 敏感肌一定要温和护肤
- 新产品要先做过敏测试
- 防晒真的超级重要！

#护肤心得 #敏感肌护肤 #护肤分享 #美妆博主`,
  images: [
    {
      url: "https://cdn.xiaohongshu.com/image1.jpg",
      description: "护肤产品全家福",
      size: "750x1000",
    },
    {
      url: "https://cdn.xiaohongshu.com/image2.jpg",
      description: "洁面产品对比图",
      size: "750x1000",
    },
    {
      url: "https://cdn.xiaohongshu.com/image3.jpg",
      description: "使用前后对比",
      size: "750x1000",
    },
    {
      url: "https://cdn.xiaohongshu.com/image4.jpg",
      description: "护肤步骤示意图",
      size: "750x1000",
    },
  ],
  tags: ["#护肤心得", "#敏感肌护肤", "#护肤分享", "#美妆博主"],
  author: {
    name: "美妆小仙女",
    avatar: "https://cdn.xiaohongshu.com/avatar.jpg",
    followers: "12.5万",
  },
  stats: {
    likes: "2.3万",
    comments: "568",
    shares: "1.2万",
  },
};

export default function ContentExtract() {
  const [batchUrls, setBatchUrls] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("batch");
  const [extractionList, setExtractionList] = useState(extractionQueue);
  const [expandedHistoryItems, setExpandedHistoryItems] = useState<number[]>(
    [],
  );
  const [downloadSettings, setDownloadSettings] = useState({
    format: "jpg",
    downloadPath: "/Downloads/TikHub/ContentExtract",
  });
  const [extractionSettings, setExtractionSettings] = useState({
    images: true,
    text: true,
    tags: true,
  });

  const handleExtract = async () => {
    const urls = batchUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      alert("请输入至少一个笔记链接");
      return;
    }

    if (urls.length > 20) {
      alert("最多支持20个链接，请减少链接数量");
      return;
    }

    // 验证链接格式
    const invalidUrls = urls.filter(
      (url) => !url.includes("xiaohongshu.com") && !url.includes("xhslink.com"),
    );

    if (invalidUrls.length > 0) {
      alert("请输入有效的小红书链接");
      return;
    }

    setIsExtracting(true);
    // 模拟API调用
    setTimeout(() => {
      setShowResults(true);
      setIsExtracting(false);
    }, 3000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownloadImage = (imageUrl: string, description: string) => {
    // 模拟图片下载
    console.log(`下载图片: ${imageUrl} - ${description}`);
  };

  const handleBatchDownload = () => {
    // 模拟批量下载
    console.log("批量下载所有图片");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "extracting":
        return <Download className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成";
      case "extracting":
        return "提取中";
      case "pending":
        return "等待中";
      case "error":
        return "失败";
      default:
        return "未知";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "extracting":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const urlCount = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0).length;

  const completedCount = extractionList.filter(
    (item) => item.status === "completed",
  ).length;
  const extractingCount = extractionList.filter(
    (item) => item.status === "extracting",
  ).length;
  const errorCount = extractionList.filter(
    (item) => item.status === "error",
  ).length;

  return (
    <DashboardLayout
      title="图文提取"
      subtitle="从小红书笔记中提取图片和文字信息，便于二次创作"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <Grid3X3 className="mr-2 h-3.5 w-3.5" />
            批量提取
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Platform Notice */}
        <Card className="border border-border bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800"
              >
                📖 仅支持小红书
              </Badge>
              <span className="text-sm text-orange-700">
                当前仅支持小红书平台的图文内容提取，其他平台功能正在开发中
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="batch">批量提取</TabsTrigger>
            <TabsTrigger value="queue">提取队列</TabsTrigger>
            <TabsTrigger value="history">提取历史</TabsTrigger>
          </TabsList>

          <TabsContent value="batch" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-2">
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        批量添加笔记链接
                      </span>
                      <Badge
                        variant={urlCount > 20 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {urlCount}/20
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value="url" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger
                          value="url"
                          className="flex items-center space-x-1"
                        >
                          <LinkIcon className="h-3 w-3" />
                          <span>批量提取</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="search"
                          className="flex items-center space-x-1"
                        >
                          <Search className="h-3 w-3" />
                          <span>搜索提取</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="url" className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            粘贴笔记链接（每行一个，最多20个）
                          </label>
                          <Textarea
                            placeholder={`请粘贴小红书笔记链接，每行一个：

https://www.xiaohongshu.com/discovery/item/123456789
https://xhslink.com/abcdef
https://www.xiaohongshu.com/discovery/item/987654321

支持完整链接和分享短链接`}
                            value={batchUrls}
                            onChange={(e) => setBatchUrls(e.target.value)}
                            className="min-h-[200px] resize-none font-mono text-sm"
                            maxLength={5000}
                          />
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>支持完整链接和短链接，每行一个</span>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="search" className="space-y-4">
                        <div className="space-y-4">
                          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                              根据关键词搜索小红书内容
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                              功能开发中，敬请期待
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {urlCount > 20 && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>链接数量超过限制，请删除多余的链接</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExtract}
                          disabled={
                            urlCount === 0 || urlCount > 20 || isExtracting
                          }
                          className="h-8"
                        >
                          {isExtracting ? (
                            <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Zap className="mr-2 h-3.5 w-3.5" />
                          )}
                          {isExtracting ? "提取中..." : "开始提取"}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setBatchUrls("");
                            setShowResults(false);
                          }}
                          className="h-8"
                        >
                          清空
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {urlCount > 0 && <span>检测到 {urlCount} 个链接</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Section */}
                {(showResults || isExtracting) && (
                  <Card className="border border-border mt-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          提取结果
                        </span>
                        {showResults && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBatchDownload}
                            className="h-6"
                          >
                            <Download className="mr-1 h-3 w-3" />
                            批量下载
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isExtracting ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <RefreshCw className="h-8 w-8 animate-spin text-brand-accent mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground mb-2">
                              正在解析小红书内容...
                            </p>
                            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                              <span>提取图片</span>
                              <span>•</span>
                              <span>解析文本</span>
                              <span>•</span>
                              <span>识别标签</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Author Info */}
                          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              👤
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {extractedContent.author.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {extractedContent.author.followers} 粉丝
                              </p>
                            </div>
                            <div className="ml-auto flex space-x-4 text-xs text-muted-foreground">
                              <span>❤️ {extractedContent.stats.likes}</span>
                              <span>💬 {extractedContent.stats.comments}</span>
                              <span>🔗 {extractedContent.stats.shares}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium">笔记标题</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCopy(extractedContent.title)
                                }
                                className="h-6"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm bg-muted/30 p-3 rounded-lg">
                              {extractedContent.title}
                            </p>
                          </div>

                          {/* Content */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium">正文内容</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCopy(extractedContent.content)
                                }
                                className="h-6"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <Textarea
                              value={extractedContent.content}
                              readOnly
                              className="min-h-[200px] text-sm bg-muted/30"
                            />
                          </div>

                          {/* Tags */}
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">话题标签</h3>
                            <div className="flex flex-wrap gap-2">
                              {extractedContent.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs cursor-pointer"
                                  onClick={() => handleCopy(tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Images */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium">
                                提取图片 ({extractedContent.images.length})
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBatchDownload}
                                className="h-6"
                              >
                                <Download className="h-3 w-3" />
                                全部��载
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {extractedContent.images.map((image, index) => (
                                <div
                                  key={index}
                                  className="group relative border border-border rounded-lg overflow-hidden"
                                >
                                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                  </div>
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDownloadImage(
                                          image.url,
                                          image.description,
                                        )
                                      }
                                      className="text-white h-6"
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1">
                                    <p className="truncate">
                                      {image.description}
                                    </p>
                                    <p className="text-gray-300">
                                      {image.size}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Settings Panel */}
              <div className="space-y-4">
                {/* Usage Stats */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">今日使用</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          已提取
                        </span>
                        <span className="text-sm font-medium">
                          {completedCount} 篇
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          剩余
                        </span>
                        <span className="text-sm font-medium">
                          {100 - completedCount} 篇
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-foreground h-2 rounded-full"
                          style={{ width: `${completedCount}%` }}
                        />
                      </div>
                      <Badge
                        variant="secondary"
                        className="w-full justify-center text-xs"
                      >
                        🎉 今日免费额度 100篇
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Extraction Settings */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Palette className="mr-2 h-4 w-4" />
                      提取设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">提取内容</label>
                      <div className="space-y-2">
                        {[
                          { label: "图片", icon: ImageIcon, key: "images" },
                          { label: "文字", icon: Type, key: "text" },
                          { label: "标签", icon: LinkIcon, key: "tags" },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <item.icon className="h-3 w-3" />
                              <span className="text-sm">{item.label}</span>
                            </div>
                            <Button
                              variant={
                                extractionSettings[
                                  item.key as keyof typeof extractionSettings
                                ]
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="h-6 w-12 text-xs"
                              onClick={() =>
                                setExtractionSettings((prev) => ({
                                  ...prev,
                                  [item.key]:
                                    !prev[item.key as keyof typeof prev],
                                }))
                              }
                            >
                              {extractionSettings[
                                item.key as keyof typeof extractionSettings
                              ]
                                ? "开启"
                                : "关闭"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Download Settings */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Folder className="mr-2 h-4 w-4" />
                      下载设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">图片格式</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["jpg", "png", "webp"].map((format) => (
                          <Button
                            key={format}
                            variant={
                              downloadSettings.format === format
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() =>
                              setDownloadSettings((prev) => ({
                                ...prev,
                                format,
                              }))
                            }
                          >
                            {format.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">保存路径</label>
                      <Input
                        value={downloadSettings.downloadPath}
                        onChange={(e) =>
                          setDownloadSettings((prev) => ({
                            ...prev,
                            downloadPath: e.target.value,
                          }))
                        }
                        className="text-xs"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      使用说明
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>• 仅支持公开的小红书笔记</p>
                      <p>• 支持完整链接和分享短链接</p>
                      <p>• 提取的内容仅供学习和参考</p>
                      <p>• 请遵守平台规定和版权法律</p>
                      <p>• 图片质量取决于原始内容</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="queue" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    提取队列 ({extractionList.length})
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="h-7">
                      <Pause className="mr-1 h-3 w-3" />
                      暂停全部
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7">
                      <RotateCcw className="mr-1 h-3 w-3" />
                      重试失败
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {extractionList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {getStatusIcon(item.status)}
                            <h3 className="text-sm font-medium truncate">
                              {item.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getStatusColor(item.status)}`}
                            >
                              {getStatusText(item.status)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mb-2">
                            {item.url}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{item.platform}</span>
                            {item.imageCount > 0 && (
                              <span>{item.imageCount} 张��片</span>
                            )}
                            {item.extractedAt && (
                              <span>{item.extractedAt}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {item.status === "extracting" && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>提取进度</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  提取历史
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">提取历史为空</h3>
                  <p className="text-muted-foreground">
                    完成的提取记录将在这里显示
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
