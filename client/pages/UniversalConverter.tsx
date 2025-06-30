import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Wand2, Copy, Download, RefreshCw, Link2, FileText, Video, Image } from "lucide-react";

export default function UniversalConverter() {
  const [sourceContent, setSourceContent] = useState("");
  const [convertedContent, setConvertedContent] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedMetadata, setExtractedMetadata] = useState<any>(null);

  const platforms = [
    { value: "douyin", label: "抖音", emoji: "🎵" },
    { value: "xiaohongshu", label: "小红书", emoji: "📕" },
    { value: "bilibili", label: "B站", emoji: "📺" },
    { value: "kuaishou", label: "快手", emoji: "⚡" },
    { value: "wechat", label: "微信公众号", emoji: "💬" },
    { value: "weibo", label: "微博", emoji: "🐦" },
    { value: "tiktok", label: "TikTok", emoji: "🎬" },
    { value: "instagram", label: "Instagram", emoji: "📸" },
    { value: "youtube", label: "YouTube", emoji: "▶️" },
  ];

  const conversionTemplates = [
    {
      title: "抖音 → 小红书",
      description: "短视频脚本转换为图文种草笔记",
      popular: true,
    },
    {
      title: "小红书 → 抖音",
      description: "种草笔记转换为短视频脚本",
      popular: true,
    },
    {
      title: "B站 → 抖音",
      description: "长视频内容转换为短视频脚本",
      popular: false,
    },
    {
      title: "公众号 → 小红书",
      description: "公众号文章转换为小红书笔记",
      popular: false,
    },
    {
      title: "微博 → 抖音",
      description: "微博内容转换为短视频文案",
      popular: false,
    },
    {
      title: "TikTok → 抖音",
      description: "国际版内容本土化转换",
      popular: true,
    },
  ];

  const handleConvert = async () => {
    if (!sourceContent.trim() || !sourcePlatform || !targetPlatform) {
      return;
    }

    setIsConverting(true);

    // Simulate AI conversion process
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock converted content based on platforms
    let mockConversion = "";
    if (sourcePlatform === "douyin" && targetPlatform === "xiaohongshu") {
      mockConversion = `📝 ${sourceContent.split("").slice(0, 50).join("")}...

✨ 种草指南：
• 第一点：${sourceContent.split("").slice(0, 20).join("")}
• 第二点：适合日常使用
• 第三点：性价比超高

🏷️ #种草分享 #好物推荐 #生活方式

💡 小红薯们觉得怎么样呢？
评论区告诉我你们的想法～`;
    } else if (
      sourcePlatform === "xiaohongshu" &&
      targetPlatform === "douyin"
    ) {
      mockConversion = `🎬 【${sourceContent.split("").slice(0, 15).join("")}】

开场：嗨大家好，今天给大家分享一个超实用的...

内容要点：
1. ${sourceContent.split("").slice(0, 25).join("")}
2. 这个方法真的太好用了
3. 大家一定要试试

结尾：如果觉得有用的话，记得点赞关注哦！

#抖音热门 #生活技巧 #干货分享`;
    } else {
      mockConversion = `🔄 已转换为 ${platforms.find((p) => p.value === targetPlatform)?.label} 风格：

${sourceContent}

✨ 平台优化：
• 调整了标题格式
• ��化了内容结构
• 添加了平台标签
• 增强了互动元素

📈 转换完成，建议根据目标平台特点进一步调整`;
    }

    setConvertedContent(mockConversion);
    setIsConverting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedContent);
  };

  const detectPlatformFromUrl = (url: string) => {
    if (url.includes('douyin.com') || url.includes('tiktok.com')) return 'douyin';
    if (url.includes('xiaohongshu.com') || url.includes('xhs.com')) return 'xiaohongshu';
    if (url.includes('bilibili.com')) return 'bilibili';
    if (url.includes('kuaishou.com')) return 'kuaishou';
    if (url.includes('weixin.qq.com') || url.includes('mp.weixin.qq.com')) return 'wechat';
    if (url.includes('weibo.com')) return 'weibo';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('instagram.com')) return 'instagram';
    return '';
  };

  const handleExtractFromLink = async () => {
    if (!linkInput.trim()) return;

    setIsExtracting(true);

    // Auto-detect platform from URL
    const detectedPlatform = detectPlatformFromUrl(linkInput);
    if (detectedPlatform) {
      setSourcePlatform(detectedPlatform);
    }

    // Simulate content extraction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock extracted content based on URL type
    let extractedContent = "";
    let metadata = {};

    if (linkInput.includes('douyin.com') || linkInput.includes('tiktok.com')) {
      extractedContent = `🎵 超火爆视频文案：

"今天教大家一个超实用的生活小技巧！
真的太好用了，学会了能省好多钱💰

步骤很简单：
1️⃣ 准备这些材料...
2️⃣ 按照这个步骤...
3️⃣ 最后这样处理...

效果真的太棒了！大家快试试～
记得点赞收藏哦！❤️

#生活技巧 #实用妙招 #省钱攻略"`;

      metadata = {
        type: '短视频',
        platform: '抖音/TikTok',
        views: '50.2万',
        likes: '1.8万',
        duration: '30秒'
      };
    } else if (linkInput.includes('xiaohongshu.com')) {
      extractedContent = `📝 种草笔记分享：

✨ 发现了这个宝藏好物！
真的超级好用，必须分享给大家～

🌟 产品特点：
• 颜值超高，拍照很出片
• 性价比很不错，学生党友好
• 使用体验很棒，推荐指数★★★★★

💡 使用心得：
第一次用就爱上了，效果比预期还要好
特别适合日常使用，简单方便

🏷️ #好物分享 #种草安利 #生活记录

小红薯们觉得怎么样？评论区交流～`;

      metadata = {
        type: '图文笔记',
        platform: '小红书',
        likes: '2.3K',
        收藏: '856',
        图片数: '6张'
      };
    } else if (linkInput.includes('weixin.qq.com')) {
      extractedContent = `📰 公众号文章内容：

【标题】如何高效管理时间，提升工作效率

现代社会节奏越来越快，如何在有限的时间内完成更多的工作，成为了每个人都需要面对的挑战。

一、时间管理的重要性
时间是最宝贵的资源，合理安排时间能够让我们事半功倍。

二、实用的时间管理方法
1. 番茄工作法
2. 四象限法则
3. 时间块管理

三、养成良好的工作习惯
良好的习惯是高效工作的基础...

（文章内容较长，已提取核心要点）`;

      metadata = {
        type: '公众号文章',
        platform: '微信公众号',
        ��读量: '1.2万',
        在看: '123',
        字数: '约2500字'
      };
    } else {
      extractedContent = `🔗 链接内容提取：

${linkInput}

已自动提取该链接的文本内容，包括：
• 标题信息
• 主要内容段落
• 关键信息要点
• 相关标签和元数据

请查看提取结果，并根据需要进行平台转换。`;

      metadata = {
        type: '网页内容',
        platform: '通用链接',
        状态: '提取完成'
      };
    }

    setSourceContent(extractedContent);
    setExtractedMetadata(metadata);
    setIsExtracting(false);
  };

  const handleTemplateSelect = (template: string) => {
    const [source, target] = template.split(" → ");
    const sourcePlatformValue = platforms.find(
      (p) => p.label === source,
    )?.value;
    const targetPlatformValue = platforms.find(
      (p) => p.label === target,
    )?.value;

    if (sourcePlatformValue) setSourcePlatform(sourcePlatformValue);
    if (targetPlatformValue) setTargetPlatform(targetPlatformValue);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">万能转换</h1>
            <Badge className="bg-orange-500 text-white">🔥 HOT</Badge>
          </div>
          <p className="text-muted-foreground">
            智能转换不同平台内容，一键适配各平台特色风格
          </p>
        </div>

        {/* Quick Templates */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              热门转换模板
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {conversionTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex-col items-start text-left"
                  onClick={() => handleTemplateSelect(template.title)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{template.title}</span>
                    {template.popular && (
                      <Badge variant="secondary" className="text-xs">
                        热门
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {template.description}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>源内容</span>
                <Select
                  value={sourcePlatform}
                  onValueChange={setSourcePlatform}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择源平台" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        <span className="flex items-center gap-2">
                          {platform.emoji} {platform.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Link Input Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">从链接提取内容</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="粘贴视频链接、图文链接或文章链接..."
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleExtractFromLink}
                    disabled={!linkInput.trim() || isExtracting}
                    variant="outline"
                  >
                    {isExtracting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        提取中
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        提取内容
                      </>
                    )}
                  </Button>
                </div>

                {/* Supported platforms */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>支持平台：</span>
                  <div className="flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    <span>抖音、TikTok、快手、B站</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    <span>小红书、微博</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>公众号、头条</span>
                  </div>
                </div>
              </div>

              {/* Extracted Metadata */}
              {extractedMetadata && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">提取信息</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(extractedMetadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-blue-600">{key}:</span>
                        <span className="text-blue-800 font-medium">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">或直接输入文本内容</span>
                </div>
                <Textarea
                  placeholder="请输入需要转换的内容...&#10;&#10;支持：&#10;• 视频文案/脚本&#10;• 图文内容&#10;• 标题描述&#10;• 完整文章"
                  value={sourceContent}
                  onChange={(e) => setSourceContent(e.target.value)}
                  className="min-h-[250px] resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {sourceContent.length} 字符
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSourceContent("")}
                  >
                    清空
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Converted Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>转换结果</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <Select
                  value={targetPlatform}
                  onValueChange={setTargetPlatform}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择目标平台" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        <span className="flex items-center gap-2">
                          {platform.emoji} {platform.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="转换后的内容将显示在这里..."
                value={convertedContent}
                readOnly
                className="min-h-[300px] resize-none bg-gray-50"
              />

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {convertedContent.length} 字符
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!convertedContent}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    复制
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!convertedContent}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    导出
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Convert Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={handleConvert}
            disabled={
              !sourceContent.trim() ||
              !sourcePlatform ||
              !targetPlatform ||
              isConverting
            }
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg h-auto"
            size="lg"
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                AI 转换中...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                开始智能转换
              </>
            )}
          </Button>
        </div>

        {/* Features */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>转换特性</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🎯
                </div>
                <h3 className="font-medium mb-1">智能适配</h3>
                <p className="text-sm text-muted-foreground">
                  根据目标平台特点���动调整内容风格
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  ⚡
                </div>
                <h3 className="font-medium mb-1">快速转换</h3>
                <p className="text-sm text-muted-foreground">
                  AI 驱动，秒级完成内容转换
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🎨
                </div>
                <h3 className="font-medium mb-1">风格优化</h3>
                <p className="text-sm text-muted-foreground">
                  保持原意的同时优化表达方式
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  📊
                </div>
                <h3 className="font-medium mb-1">多平台支持</h3>
                <p className="text-sm text-muted-foreground">
                  支持主流社交媒体平台互转
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
