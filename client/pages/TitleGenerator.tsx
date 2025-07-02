import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Type,
  Wand2,
  Copy,
  RefreshCw,
  Settings,
  Sparkles,
  FileText,
  MessageCircle,
  TrendingUp,
  Target,
  Hash,
  Star,
  ThumbsUp,
  Eye,
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

const titleTypes = [
  { id: "trending", name: "热点标题", description: "结合热点话题" },
  { id: "emotional", name: "情感标题", description: "引发情感共鸣" },
  { id: "curiosity", name: "悬念标题", description: "激发好奇心" },
  { id: "practical", name: "实用标题", description: "突出实用价值" },
  { id: "numbers", name: "数字标题", description: "使用具体数字" },
  { id: "question", name: "疑问标题", description: "引��思考" },
];

const generatedTitles = [
  {
    title: "这个护肤秘诀，让我30岁看起来像20岁！",
    score: 95,
    tags: ["情感", "年龄", "护肤"],
  },
  {
    title: "90%的人都不知道的护肤误区，你中招了吗？",
    score: 88,
    tags: ["数字", "疑问", "护肤"],
  },
  {
    title: "花了3000块试遍网红护肤品，只有这3款值得买",
    score: 92,
    tags: ["数字", "测评", "推荐"],
  },
  {
    title: "素颜出门也不怕！这套护肤流程太绝了",
    score: 87,
    tags: ["自信", "流程", "护肤"],
  },
  {
    title: "从月光族到护肤达人，我的平价护肤心得",
    score: 85,
    tags: ["成长", "平价", "心得"],
  },
];

const exampleKeywords = [
  "护肤心得分享",
  "美食探店体验",
  "职场穿搭技巧",
  "旅行攻略推荐",
];

export default function TitleGenerator() {
  const [inputText, setInputText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [titleCount, setTitleCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlatform, setActivePlatform] = useState("wechat");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "trending",
    "emotional",
  ]);
  const [results, setResults] = useState(generatedTitles);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    // 模拟API调用
    setTimeout(() => {
      // 这里可以添加实际的标题生成逻辑
      setResults([
        ...generatedTitles.map((title) => ({
          ...title,
          title: title.title + " (新生成)",
        })),
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = (title: string) => {
    navigator.clipboard.writeText(title);
    // 这里可以添加toast提示
  };

  const insertExample = (example: string) => {
    setInputText(example);
  };

  const toggleTitleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId],
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <DashboardLayout
      title="标题生成"
      subtitle="根据内容自动生成吸引人的标题，提高点击率"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <TrendingUp className="mr-2 h-3.5 w-3.5" />
            热点分析
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Platform Selection */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Type className="mr-2 h-4 w-4" />
              选择平台风格
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {supportedPlatforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant={
                    activePlatform === platform.id ? "default" : "outline"
                  }
                  size="sm"
                  className={`h-8 ${
                    activePlatform === platform.id
                      ? "bg-foreground text-background"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setActivePlatform(platform.id)}
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
                    <FileText className="mr-2 h-4 w-4" />
                    内容描述
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {inputText.length}/2000
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="请输入内容，点击生成标题，将会自动生成50个标题（请不要重复输入太过相似的内容）"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px] resize-none border-0 p-0 focus-visible:ring-0"
                  maxLength={2000}
                />

                {/* Title Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">标题类型</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {titleTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant={
                          selectedTypes.includes(type.id)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="h-8 text-xs justify-start"
                        onClick={() => toggleTitleType(type.id)}
                      >
                        {type.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Title Count Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">生成数量</label>
                  <Input
                    type="number"
                    placeholder="输入要生成的标题数量"
                    value={titleCount}
                    onChange={(e) => setTitleCount(Number(e.target.value))}
                    min={1}
                    max={50}
                    className="border-border"
                  />
                  <div className="text-xs text-muted-foreground">
                    建议生成1-50个标题
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={!inputText.trim() || isGenerating}
                      className="h-8"
                    >
                      {isGenerating ? (
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-3.5 w-3.5" />
                      )}
                      {isGenerating ? "生成中..." : "生成标题"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setInputText("");
                        setKeywords("");
                      }}
                      className="h-8"
                    >
                      清空
                    </Button>
                  </div>

                  <div className="flex space-x-1">
                    {exampleKeywords.map((example, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => insertExample(example)}
                        className="h-6 text-xs text-muted-foreground hover:text-foreground"
                      >
                        示例{index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="border border-border mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" />
                    生成结果 ({results.length}个标题)
                  </span>
                  <Button variant="ghost" size="sm" className="h-6">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        AI正在生成创意标题...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-medium flex-1 pr-2">
                            {result.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-xs font-medium ${getScoreColor(result.score)}`}
                            >
                              {result.score}分
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(result.title)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {result.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="text-xs h-5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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
                      已使用
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
                    🎉 今日免费额度 100次
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Title Quality Metrics */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  标题质量
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
                      <Hash className="mr-1 h-3 w-3" />
                      关键词密度
                    </span>
                    <span className="text-xs font-medium">88%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      平台适配
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
                  生成技巧
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• 详细描述内容有助于生成精准标题</p>
                  <p>• 添加关键词提升SEO效果</p>
                  <p>• 选择多种标题类型增加创意</p>
                  <p>• 不同平台风格差异较大</p>
                  <p>• 标题长度建议控制在20字内</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
