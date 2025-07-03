import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";

const extractedContent = {
  title: "超详细护肤心得分享！敏感肌女孩的逆袭之路",
  content: `姐妹们好！今天来分享一下我的��肤心得，作为一个敏感肌女孩，真的是踩了太多坑才找到���合自己的护肤方法😭

💡 我的肌肤状况：
- 敏感肌，容易泛红
- T区偏油，脸颊偏干
- 毛孔粗大，偶尔爆痘

🌟 护肤步骤分享：
1️��� 温和洁面：氨基酸洁面，早晚各一次
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
- ���产品要先做过敏测试
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
  const [activeTab, setActiveTab] = useState("url");
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
                    variant={
                      batchUrls
                        .split("\n")
                        .filter((url) => url.trim().length > 0).length > 20
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {
                      batchUrls
                        .split("\n")
                        .filter((url) => url.trim().length > 0).length
                    }
                    /20
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                        粘贴笔记链接���每行一个，最多20个）
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

                {batchUrls.split("\n").filter((url) => url.trim().length > 0)
                  .length > 20 && (
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
                        batchUrls
                          .split("\n")
                          .filter((url) => url.trim().length > 0).length ===
                          0 ||
                        batchUrls
                          .split("\n")
                          .filter((url) => url.trim().length > 0).length > 20 ||
                        isExtracting
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
                    {batchUrls
                      .split("\n")
                      .filter((url) => url.trim().length > 0).length > 0 && (
                      <span>
                        检测到{" "}
                        {
                          batchUrls
                            .split("\n")
                            .filter((url) => url.trim().length > 0).length
                        }{" "}
                        个链接
                      </span>
                    )}
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
                            onClick={() => handleCopy(extractedContent.title)}
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
                            onClick={() => handleCopy(extractedContent.content)}
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
                            全部下载
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
                                <p className="truncate">{image.description}</p>
                                <p className="text-gray-300">{image.size}</p>
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
                    <span className="text-sm font-medium">15 篇</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">剩余</span>
                    <span className="text-sm font-medium">85 篇</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-foreground h-2 rounded-full"
                      style={{ width: "15%" }}
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
                              [item.key]: !prev[item.key as keyof typeof prev],
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
                    {["jpg", "png", "webp", "原格式"].map((format) => (
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

                <div className="flex items-center justify-between">
                  <span className="text-sm">同时保存文字</span>
                  <Button
                    variant={downloadSettings.saveText ? "default" : "outline"}
                    size="sm"
                    className="h-6 w-12 text-xs"
                    onClick={() =>
                      setDownloadSettings((prev) => ({
                        ...prev,
                        saveText: !prev.saveText,
                      }))
                    }
                  >
                    {downloadSettings.saveText ? "是" : "否"}
                  </Button>
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
                  <p>• 提取的���容仅供学习和参考</p>
                  <p>• 请遵守平台规定和版权法律</p>
                  <p>• 图片质量取决于原始内容</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
