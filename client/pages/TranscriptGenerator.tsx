import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const languageOptions = [
  { id: "chinese", name: "中文", emoji: "🇨🇳" },
  { id: "english", name: "英文", emoji: "🇺🇸" },
];

const trackTypes = [
  { id: "general", name: "通用", description: "适用于各种场景" },
  { id: "business", name: "商务", description: "商业演讲、报告" },
  { id: "tech", name: "科技", description: "技术分享、产品介绍" },
  { id: "education", name: "教育", description: "培训、教学内容" },
  { id: "marketing", name: "营销", description: "推广、宣传文案" },
  { id: "entertainment", name: "娱乐", description: "娱乐、文艺内容" },
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
  const [selectedStyle, setSelectedStyle] = useState("viral");
  const [selectedPlatform, setSelectedPlatform] = useState("wechat");
  const [selectedLanguage, setSelectedLanguage] = useState("chinese");
  const [wordCount, setWordCount] = useState(500);
  const [selectedTrack, setSelectedTrack] = useState("general");
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
                    内容输入
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {keywords.length}/2000
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      关键词输入
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      文稿描述
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                      现有草稿
                    </span>
                  </div>
                </div>
                <Textarea
                  placeholder="📝 三种输入方式任选其一：&#10;&#10;1️⃣ 关键词输入&#10;   产品发布会、会议纪要、营销方案&#10;   演讲稿、项目报告、培训资料&#10;&#10;2️⃣ 文稿描述输入&#10;   我需要写一份关于新产品发布的演讲稿...&#10;   帮我准备一个项目汇报的PPT大纲...&#10;&#10;3️⃣ 现有草稿输入&#10;   把您已有的文稿草稿粘贴进来，AI会帮您优化完善&#10;&#10;💡 支持最多2000字符，AI会根据内容自动识别并生成对应的文稿"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="min-h-[320px] resize-none border-0 p-0 focus-visible:ring-0"
                  maxLength={2000}
                />

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
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
                      {isGenerating ? "生成中..." : "生成文稿"}
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

                  <div className="flex space-x-1">
                    {["产品发布会演讲稿", "项目汇报大纲", "培训课程内容"].map(
                      (example, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => setKeywords(example)}
                          className="h-6 text-xs text-muted-foreground hover:text-foreground"
                        >
                          示例{index + 1}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            {(showResults || isGenerating) && (
              <Card className="border border-border mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成结果
                    </span>
                    {showResults && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText("生成的文稿内��")
                        }
                        className="h-6"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          AI正在生成文稿...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-[200px] p-3 bg-muted/30 rounded-md">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                        {showResults
                          ? `【AI生成文稿】

基于您输入的内容"${keywords.substring(0, 50)}${keywords.length > 50 ? "..." : ""}"

已为您生成适合${selectedPlatform}平台的${selectedStyle}风格文稿，使用${selectedLanguage === "chinese" ? "中文" : "英文"}语言，字数约${wordCount}字，针对${selectedTrack}赛道优化。

生成的文���内容将在这里显示...`
                          : ""}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Settings Panel */}
          <div className="space-y-4">
            {/* Generation Options */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">生成选项</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">文稿风格</p>
                  <Select
                    value={selectedStyle}
                    onValueChange={setSelectedStyle}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {copywritingStyles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{style.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {style.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">语言</p>
                  <div className="grid grid-cols-2 gap-1">
                    {languageOptions.map((lang) => (
                      <Button
                        key={lang.id}
                        variant={
                          selectedLanguage === lang.id ? "default" : "outline"
                        }
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setSelectedLanguage(lang.id)}
                      >
                        {lang.emoji} {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">字数要求</p>
                  <Input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(Number(e.target.value))}
                    min={100}
                    max={5000}
                    placeholder="输入字数"
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    建议100-5000字
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">赛道类型</p>
                  <Select
                    value={selectedTrack}
                    onValueChange={setSelectedTrack}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {trackTypes.map((track) => (
                        <SelectItem key={track.id} value={track.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{track.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {track.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <p>• 添加相�����话题标签扩大曝光</p>
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
