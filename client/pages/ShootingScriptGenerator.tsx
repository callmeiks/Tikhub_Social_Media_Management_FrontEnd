import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  FileText,
  MessageCircle,
  TrendingUp,
  Target,
  Hash,
  Star,
  ThumbsUp,
  Eye,
  Clock,
  Play,
} from "lucide-react";

const supportedPlatforms = [
  { id: "wechat", name: "微信公众号", emoji: "💬", active: true },
  { id: "csdn", name: "CSDN", emoji: "💻", active: true },
  { id: "zhihu", name: "知乎", emoji: "🤔", active: true },
  { id: "douyin", name: "抖音", emoji: "🎵", active: true },
  { id: "kuaishou", name: "快手", emoji: "⚡", active: true },
  { id: "xiaohongshu", name: "小红书", emoji: "📕", active: true },
  { id: "tiktok", name: "TikTok", emoji: "🎬", active: true },
];

const scriptTypes = [
  { id: "tutorial", name: "教程脚本", description: "知识分享类内容" },
  { id: "vlog", name: "生活vlog", description: "日常生活记录" },
  { id: "review", name: "产品测评", description: "商品评测介绍" },
  { id: "story", name: "故事剧情", description: "情节叙事类" },
  { id: "interview", name: "采访对话", description: "访谈问答形式" },
  { id: "promotion", name: "营销推广", description: "品牌宣传类" },
];

const videoDurations = [
  { id: "short", name: "短视频 (15-60秒)", duration: "15-60秒" },
  { id: "medium", name: "中等 (1-3分钟)", duration: "1-3分钟" },
  { id: "long", name: "长视频 (3-10分钟)", duration: "3-10分钟" },
  { id: "extended", name: "超长 (10分钟以上)", duration: "10分钟以上" },
];

const generatedScripts = [
  {
    id: 1,
    title: "护肤产品测评脚本",
    content: `【开场】（3秒）
镜头：特写产品包装
台词：姐妹们！今天测评这款号称3天见效的精华！

【产品介绍】（10秒）
镜头：手持产品展示各个角度
台词：首先看包装，简约大气，主要成分是玻尿酸和烟酰胺...

【使用过程】（20秒）
镜头：上脸使用过程
台词：质地比较清爽，推开很好吸收，没有黏腻感...

【效果展示】（15秒）
镜头：对比照片
台词：用了一周的效果对比，肉眼可见的改善...

【总结】（7秒）
镜头：面向镜头
台词：总体来说性价比很高，推荐给大家！记得点赞收藏哦~`,
    platform: "抖音",
    type: "产品测评",
    duration: "1分钟",
    score: 92,
  },
  {
    id: 2,
    title: "化妆教程脚本",
    content: `【开场】（5秒）
镜头：素颜特写
台词：今天教大家10分钟打造韩系妆容！

【底妆部分】（20秒）
镜头：上妆过程特写
台词：先用妆前乳，然后气垫薄薄一层...

【眼妆部分】（25秒）
镜头：眼部化妆特写
台词：眼影选择大地色系，轻扫眼窝...

【完妆展示】（10秒）
镜头：完整妆容展示
台词：完成！是不是很简单？快学起来吧！`,
    platform: "小红书",
    type: "教程脚本",
    duration: "1分钟",
    score: 88,
  },
];

const exampleTopics = ["日常护肤教程", "美食制作过程", "穿搭分享", "旅行vlog"];

export default function ShootingScriptGenerator() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("douyin");
  const [selectedType, setSelectedType] = useState("tutorial");
  const [selectedDuration, setSelectedDuration] = useState("short");
  const [targetAge, setTargetAge] = useState("");
  const [targetGender, setTargetGender] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [results, setResults] = useState(generatedScripts);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("请输入视频主题");
      return;
    }

    setIsGenerating(true);
    // 模拟API调用
    setTimeout(() => {
      setResults([
        ...generatedScripts.map((script) => ({
          ...script,
          title: script.title + " (新生成)",
        })),
      ]);
      setIsGenerating(false);
    }, 3000);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const insertExample = (example: string) => {
    setTopic(example);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <DashboardLayout
      title="拍摄脚本生成"
      subtitle="智能生成各类视频拍摄脚本，包含镜头、台词、时间安排"
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
                    <FileText className="mr-2 h-4 w-4" />
                    视频主题
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {topic.length}/500
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="请描述您要制作的视频内容主题，越详细越好，例如：&#10;&#10;• 日常护肤步骤分享，适合初学者&#10;• 10分钟快手早餐制作教程&#10;• 秋季穿搭推荐，职场风格&#10;• 周末短途旅行vlog，海边度假"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-[120px] resize-none border-0 p-0 focus-visible:ring-0"
                  maxLength={500}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Script Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">脚本类型</label>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scriptTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{type.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {type.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Video Duration */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">视频时长</label>
                    <Select
                      value={selectedDuration}
                      onValueChange={setSelectedDuration}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {videoDurations.map((duration) => (
                          <SelectItem key={duration.id} value={duration.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {duration.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {duration.duration}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      目标年龄（可选）
                    </label>
                    <Input
                      placeholder="例如：18-25岁、30-40岁、全年龄段"
                      value={targetAge}
                      onChange={(e) => setTargetAge(e.target.value)}
                      className="border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      目标性别（可选）
                    </label>
                    <Input
                      placeholder="例如：男性、女性、不限"
                      value={targetGender}
                      onChange={(e) => setTargetGender(e.target.value)}
                      className="border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    特殊要求（可选）
                  </label>
                  <Input
                    placeholder="例如：需要产品植入、要求悬念开头、需要互动环节"
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    className="border-border"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={!topic.trim() || isGenerating}
                      className="h-8"
                    >
                      {isGenerating ? (
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-3.5 w-3.5" />
                      )}
                      {isGenerating ? "生成中..." : "生成脚本"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTopic("");
                        setTargetAge("");
                        setTargetGender("");
                        setSpecialRequirements("");
                      }}
                      className="h-8"
                    >
                      清空
                    </Button>
                  </div>

                  <div className="flex space-x-1">
                    {exampleTopics.map((example, index) => (
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
                    生成结果 ({results.length}个脚本)
                  </span>
                  <Button variant="ghost" size="sm" className="h-6">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-brand-accent mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        AI正在生成拍摄脚本...
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                        <span>分析主题</span>
                        <span>•</span>
                        <span>规划结构</span>
                        <span>•</span>
                        <span>生成脚本</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map((script) => (
                      <div
                        key={script.id}
                        className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 pr-4">
                            <h3 className="text-sm font-medium mb-2">
                              {script.title}
                            </h3>
                            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground mb-3 bg-muted/30 p-3 rounded">
                              {script.content}
                            </pre>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <Target className="mr-1 h-3 w-3" />
                                {script.platform}
                              </span>
                              <span className="flex items-center">
                                <Star className="mr-1 h-3 w-3" />
                                {script.type}
                              </span>
                              <span className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {script.duration}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-xs font-medium ${getScoreColor(script.score)}`}
                            >
                              {script.score}分
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(script.content)}
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
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Daily Usage */}
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
                    <span className="text-sm font-medium">5 次</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">剩余</span>
                    <span className="text-sm font-medium">45 次</span>
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
                    🎬 每��免费额度 50次
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Creative Tips */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  拍摄技巧
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• 开头3秒最关键，要快速抓住注意力</p>
                  <p>• 镜头切换要有节奏感和逻辑性</p>
                  <p>• 台词要口语化，避免过于书面</p>
                  <p>• 结尾要有明确的行动召唤</p>
                  <p>• 根据平台特色调整内容风格</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
