import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Wand2, Copy, Download, RefreshCw } from "lucide-react";

export default function UniversalConverter() {
  const [sourceContent, setSourceContent] = useState("");
  const [convertedContent, setConvertedContent] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("");
  const [isConverting, setIsConverting] = useState(false);

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
• 优化了内容结构  
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
              <Textarea
                placeholder="请输入需要转换的内容...&#10;&#10;支持：&#10;• 视频文案/脚本&#10;• 图文内容&#10;• 标题描述&#10;• 完整文章"
                value={sourceContent}
                onChange={(e) => setSourceContent(e.target.value)}
                className="min-h-[300px] resize-none"
              />

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
                  根据目标平台特点自动调整内容风格
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
