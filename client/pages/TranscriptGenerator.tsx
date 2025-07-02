import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  Wand2,
  Copy,
  RefreshCw,
  Settings,
  Sparkles,
  Hash,
  MessageCircle,
  TrendingUp,
  Target,
  Zap,
  Play,
  Search,
  Star,
  Clock,
  Eye,
  ThumbsUp,
} from "lucide-react";

const supportedPlatforms = [
  { id: "wechat", name: "微信公众号", emoji: "💬", active: true },
  { id: "csdn", name: "CSDN", emoji: "💻", active: true },
  { id: "zhihu", name: "知乎", emoji: "🤔", active: true },
  { id: "douyin", name: "抖音", emoji: "🎵", active: true },
  { id: "kuaishou", name: "快手", emoji: "⚡", active: true },
  { id: "xiaohongshu", name: "小红书", emoji: "📕", active: true },
  { id: "tiktok", name: "TikTok", emoji: "🎬", active: true },
  { id: "other", name: "其他", emoji: "📝", active: true },
];

const copywritingStyles = [
  { id: "viral", name: "爆款文案", description: "高传播性，容易走红" },
  { id: "emotional", name: "情感文案", description: "引发情感共鸣" },
  { id: "suspense", name: "悬念文案", description: "制造悬念，吸引观看" },
  { id: "tutorial", name: "教程文案", description: "实用干货分享" },
  { id: "story", name: "故事文案", description: "叙事性强，引人入胜" },
  { id: "trendy", name: "热点文案", description: "结合当下热点话题" },
];

const generatedCopies = [
  {
    id: 1,
    content:
      "今天教大家一个超实用的护肤小技巧！👀 这个方法我用了3年，皮肤真的越来越好！姐妹们快来学起来~ #护肤小技巧 #美容 #干货分享",
    style: "教程文案",
    platform: "抖音",
    engagement: "预计互动率: 8.5%",
    tags: ["#护肤小技巧", "#美容", "#干货分享"],
    score: 92,
  },
  {
    id: 2,
    content:
      "这个秘密我憋了好久终于要说了！😱 90%的人都不知道这样做竟然能...（评论区告诉你答案）",
    style: "悬念文案",
    platform: "快手",
    engagement: "预计互动率: 12.3%",
    tags: ["#秘密", "#干货", "#涨知识"],
    score: 95,
  },
  {
    id: 3,
    content:
      "从月薪3000到月入过万，我只用了这一招！💰 真的不是标题党，方法在视频里全部分享！",
    style: "爆款文案",
    platform: "抖音",
    engagement: "预计互动率: 15.7%",
    tags: ["#副业", "#赚钱", "#干货"],
    score: 98,
  },
];

export default function TranscriptGenerator() {
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    "viral",
    "emotional",
  ]);
  const [selectedPlatform, setSelectedPlatform] = useState("wechat");
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      alert("请输入关键词、文稿描述或现有草稿");
      return;
    }

    if (keywords.length > 2000) {
      alert("内容长度不能超过2000个字符");
      return;
    }

    setIsGenerating(true);
    // 模拟API调用
    setTimeout(() => {
      setShowResults(true);
      setIsGenerating(false);
    }, 3000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId],
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 90) return "text-blue-600";
    if (score >= 80) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <DashboardLayout
      title="文稿生成"
      subtitle="智能生成各类文稿内容，支持关键词、描述和草稿输入"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <TrendingUp className="mr-2 h-3.5 w-3.5" />
            热点词库
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
                <Button
                  key={platform.id}
                  variant={
                    selectedPlatform === platform.id ? "default" : "outline"
                  }
                  size="sm"
                  className={`h-8 ${
                    selectedPlatform === platform.id
                      ? "bg-foreground text-background"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  <span className="mr-1">{platform.emoji}</span>
                  {platform.name}
                </Button>
              ))}
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
                    <Hash className="mr-2 h-4 w-4" />
                    内容描述
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {keywords.length}/2000
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    输入内容（关键词/文稿描述/现有草稿）
                  </label>
                  <Textarea
                    placeholder="📝 三种输入方式任选其一：&#10;&#10;1️⃣ 关键词输入&#10;   产品发布会、会议纪要、营销方案&#10;   演讲稿、项目报告、培训资料&#10;&#10;2️⃣ 文稿描述输入&#10;   我需要写一份关于新产品发布的演讲稿...&#10;   帮我准备一个项目汇报的PPT大纲...&#10;&#10;3️⃣ 现有草稿输入&#10;   把您已有的文稿草稿粘贴进来，AI会帮您优化完善&#10;&#10;💡 支持最多2000字符，AI会根据内容自动识别并生成对应的文稿"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="min-h-[120px] resize-none"
                    maxLength={2000}
                  />
                </div>

                {/* Copy Style Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">文案风格</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {copywritingStyles.map((style) => (
                      <Button
                        key={style.id}
                        variant={
                          selectedStyles.includes(style.id)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="h-auto p-2 text-xs justify-start"
                        onClick={() => toggleStyle(style.id)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{style.name}</div>
                          <div className="text-xs text-muted-foreground opacity-70">
                            {style.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={!keywords.trim() || isGenerating}
                      className="h-8"
                    >
                      {isGenerating ? (
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-3.5 w-3.5" />
                      )}
                      {isGenerating ? "生成中..." : "生成文案"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setKeywords("");
                        setShowResults(false);
                      }}
                      className="h-8"
                    >
                      清空
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <Zap className="inline h-3 w-3 mr-1" />
                    AI智能生成
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {(showResults || isGenerating) && (
              <Card className="border border-border mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成效果 ({showResults ? generatedCopies.length : 0}
                      条文案)
                    </span>
                    {showResults && (
                      <Button variant="ghost" size="sm" className="h-6">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin text-brand-accent mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">
                          AI正在生成创意文案...
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                          <span>分析关键词</span>
                          <span>•</span>
                          <span>匹配风格</span>
                          <span>•</span>
                          <span>生成文案</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {generatedCopies.map((copy) => (
                        <div
                          key={copy.id}
                          className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 pr-4">
                              <p className="text-sm leading-relaxed mb-2">
                                {copy.content}
                              </p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {copy.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs h-5"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Target className="mr-1 h-3 w-3" />
                                  {copy.platform}
                                </span>
                                <span className="flex items-center">
                                  <Star className="mr-1 h-3 w-3" />
                                  {copy.style}
                                </span>
                                <span className="flex items-center">
                                  <TrendingUp className="mr-1 h-3 w-3" />
                                  {copy.engagement}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-xs font-medium ${getScoreColor(copy.score)}`}
                              >
                                {copy.score}分
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(copy.content)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
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
                      已生成
                    </span>
                    <span className="text-sm font-medium">10 次</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">剩余</span>
                    <span className="text-sm font-medium">90 次</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-foreground h-2 rounded-full"
                      style={{ width: "10%" }}
                    />
                  </div>
                  <Badge
                    variant="secondary"
                    className="w-full justify-center text-xs"
                  >
                    🎉 每日获得总数100次权限
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Keywords */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Hash className="mr-2 h-4 w-4" />
                  热门关键词
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "护肤技巧",
                    "美食制作",
                    "旅行攻略",
                    "穿搭分享",
                    "健身减肥",
                    "学习方法",
                    "职场技能",
                    "副业赚钱",
                  ].map((keyword) => (
                    <Button
                      key={keyword}
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setKeywords(keyword)}
                    >
                      {keyword}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Quality */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  文案质量
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Eye className="mr-1 h-3 w-3" />
                      吸引力
                    </span>
                    <span className="text-xs font-medium">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      互动率
                    </span>
                    <span className="text-xs font-medium">88%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Play className="mr-1 h-3 w-3" />
                      完播率
                    </span>
                    <span className="text-xs font-medium">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  创作技巧
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• 前3秒要抓住用户注意力</p>
                  <p>• 使用悬念和疑问句增加互动</p>
                  <p>• 结合热点话题提升传播度</p>
                  <p>• 添加相���话题标签扩大曝光</p>
                  <p>• 文案长度控制在50字以内</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
