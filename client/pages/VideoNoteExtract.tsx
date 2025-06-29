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
  Video,
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
  Play,
  MessageCircle,
  Hash,
  Clock,
  Target,
  BookOpen,
} from "lucide-react";

const supportedPlatforms = [
  { id: "tiktok", name: "TikTok", emoji: "🎵", active: true },
  { id: "douyin", name: "抖音", emoji: "🎤", active: true },
  { id: "xiaohongshu", name: "小红书", emoji: "📖", active: true },
  { id: "bilibili", name: "B站", emoji: "📺", active: true },
  { id: "kuaishou", name: "快手", emoji: "⚡", active: true },
];

const extractedData = {
  title: "这样护肤3个月，皮肤真的变好了！",
  videoInfo: {
    duration: "02:35",
    views: "23.6万",
    likes: "8.9万",
    comments: "2.1万",
    author: "护肤小仙女",
    platform: "抖音",
  },
  extractedCopy: `姐妹们好！今天分享我这3个月的护肤心得～

💄 我的变化：
- 毛孔明显变小了
- 皮肤更有光泽
- 痘印淡化了很多

🌟 我用的方法：
1️⃣ 早晚双重清洁
2️⃣ 精华要按摩到吸收
3️⃣ 面膜一周2-3次
4️⃣ 防晒真的很重要！

💡 产品推荐：
✨ 洁面：氨基酸洁面泡沫
✨ 精华：烟酰胺精华液  
✨ 面膜：玻尿酸补水面膜
✨ 防晒：物理防晒霜SPF50

坚持真的有用！姐妹们一起变美～

#护肤心得 #变美 #护肤分享`,
  hashtags: ["#护肤心得", "#变美", "#护肤分享", "#美容", "#护肤小技巧"],
  keyPoints: [
    "双重清洁很重要",
    "精华要充分按摩",
    "防晒是必需品",
    "坚持才有效果",
  ],
  sentiment: "positive",
  engagementRate: 37.8,
};

export default function VideoNoteExtract() {
  const [inputUrl, setInputUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("url");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const handleExtract = async () => {
    if (!inputUrl.trim()) {
      alert("请输入视频或笔记链接");
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

  const validateUrl = (url: string) => {
    const platformPatterns = [
      /tiktok\.com/,
      /douyin\.com/,
      /xiaohongshu\.com/,
      /bilibili\.com/,
      /kuaishou\.com/,
    ];
    return platformPatterns.some((pattern) => pattern.test(url));
  };

  const isValidUrl = validateUrl(inputUrl);

  return (
    <DashboardLayout
      title="视频/笔记文案提取"
      subtitle="智能提取视频和笔记中的文案内容，快速获取创作灵感"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <Download className="mr-2 h-3.5 w-3.5" />
            批量提取
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Platform Support */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Video className="mr-2 h-4 w-4" />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  内容提取
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger
                      value="url"
                      className="flex items-center space-x-1"
                    >
                      <LinkIcon className="h-3 w-3" />
                      <span>链接提取</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="batch"
                      className="flex items-center space-x-1"
                    >
                      <FileText className="h-3 w-3" />
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
                        视频或笔记链接
                      </label>
                      <Input
                        placeholder="请输入TikTok、抖音、小红书、B站、快手等平台的视频或笔记链接"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className={`border-border ${
                          inputUrl &&
                          !isValidUrl &&
                          "border-red-300 focus:border-red-500"
                        }`}
                      />
                      <div className="flex items-center space-x-2 text-xs">
                        {inputUrl && isValidUrl ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">链接格式正确</span>
                          </>
                        ) : inputUrl && !isValidUrl ? (
                          <>
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                            <span className="text-red-600">
                              请输入有效的平台链接
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">
                            支持完整链接和分享短链接
                          </span>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="batch" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        批量链接（每行一个）
                      </label>
                      <Textarea
                        placeholder={`请输入多个链接，每行一个：

https://www.tiktok.com/@user/video/123456789
https://v.douyin.com/iABCDEF/
https://www.xiaohongshu.com/discovery/item/xyz123`}
                        className="min-h-[120px] resize-none font-mono text-sm"
                        maxLength={5000}
                      />
                      <div className="text-xs text-muted-foreground">
                        最多支持20个链接，将按顺序提取
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="search" className="space-y-4">
                    <div className="space-y-4">
                      <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                        <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          根据关键词搜索热门内容并提取文案
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          功能开发中，敬请期待
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExtract}
                      disabled={!inputUrl.trim() || !isValidUrl || isExtracting}
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
                        setInputUrl("");
                        setShowResults(false);
                      }}
                      className="h-8"
                    >
                      清空
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <Eye className="inline h-3 w-3 mr-1" />
                    AI智能文案提取
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
                        onClick={() => handleCopy(extractedData.extractedCopy)}
                        className="h-6"
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        复制全部
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
                          正在分析视频/笔记内容...
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                          <span>解析链接</span>
                          <span>•</span>
                          <span>提取文案</span>
                          <span>•</span>
                          <span>分析内容</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Video/Note Info */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium mb-2">
                              {extractedData.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <Target className="mr-1 h-3 w-3" />
                                {extractedData.videoInfo.platform}
                              </span>
                              <span className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {extractedData.videoInfo.duration}
                              </span>
                              <span className="flex items-center">
                                <Eye className="mr-1 h-3 w-3" />
                                {extractedData.videoInfo.views}
                              </span>
                              <span className="flex items-center">
                                ❤️ {extractedData.videoInfo.likes}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            {extractedData.engagementRate}% 互动率
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          作者：{extractedData.videoInfo.author}
                        </p>
                      </div>

                      {/* Extracted Content */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">
                            提取的文案内容
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCopy(extractedData.extractedCopy)
                            }
                            className="h-6"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <Textarea
                          value={extractedData.extractedCopy}
                          readOnly
                          className="min-h-[200px] text-sm bg-muted/30"
                        />
                      </div>

                      {/* Hashtags */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">话题标签</h3>
                        <div className="flex flex-wrap gap-2">
                          {extractedData.hashtags.map((tag, index) => (
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

                      {/* Key Points */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">关键要点</h3>
                        <div className="space-y-1">
                          {extractedData.keyPoints.map((point, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                              <span>{point}</span>
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
                    <span className="text-sm font-medium">8 次</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">剩余</span>
                    <span className="text-sm font-medium">92 次</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-foreground h-2 rounded-full"
                      style={{ width: "8%" }}
                    />
                  </div>
                  <Badge
                    variant="secondary"
                    className="w-full justify-center text-xs"
                  >
                    🎉 今日免费额度 100次
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Extraction Settings */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  提取设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">提取内容</label>
                  <div className="space-y-2">
                    {[
                      { label: "完整文案", checked: true },
                      { label: "话题标签", checked: true },
                      { label: "关键要点", checked: true },
                      { label: "情感分析", checked: false },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{item.label}</span>
                        <Button
                          variant={item.checked ? "default" : "outline"}
                          size="sm"
                          className="h-6 w-12 text-xs"
                        >
                          {item.checked ? "开启" : "关闭"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Extracts */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  最近提取
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      title: "护肤心得分享",
                      platform: "抖音",
                      time: "10分钟前",
                    },
                    {
                      title: "美食制作教程",
                      platform: "小红书",
                      time: "1小时前",
                    },
                    { title: "旅行攻略", platform: "B站", time: "2小时前" },
                  ].map((item, index) => (
                    <div key={index} className="text-xs">
                      <p className="font-medium truncate">{item.title}</p>
                      <div className="flex justify-between text-muted-foreground mt-1">
                        <span>{item.platform}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  使用技巧
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• 支持提取视频字幕和笔记文字</p>
                  <p>• 自动识别话题标签和关键词</p>
                  <p>• 可批量处理多个链接</p>
                  <p>• 提取结果支持一键复制</p>
                  <p>• 仅限公开内容的文案提取</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
