import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RotateCcw,
  Wand2,
  Copy,
  Download,
  RefreshCw,
  Settings,
  Sparkles,
  FileText,
  MessageCircle,
} from "lucide-react";

const contentStyles = [
  { id: "xiaohongshu", name: "小红书", active: true },
  { id: "douyin", name: "抖音", active: false },
  { id: "kuaishou", name: "快手", active: false },
  { id: "tiktok", name: "TikTok", active: false },
  { id: "instagram", name: "Instagram", active: false },
];

const rewriteOptions = [
  { id: "tone", name: "语调调整", options: [
    { value: "formal", label: "正式" },
    { value: "casual", label: "轻松" },
    { value: "humorous", label: "幽默" },
    { value: "professional", label: "专业" }
  ]},
  { id: "length", name: "长度控制", options: [
    { value: "concise", label: "精简" },
    { value: "standard", label: "标准" },
    { value: "detailed", label: "详细" },
    { value: "extended", label: "扩展" }
  ]},
  {
    id: "style",
    name: "风格类型",
    options: [
      { value: "viral", label: "爆款文案", description: "高传播性，容易走红" },
      { value: "emotional", label: "情感文案", description: "引发情感共鸣" },
      { value: "suspense", label: "悬念文案", description: "制造悬念，吸引观看" },
      { value: "tutorial", label: "教程文案", description: "实用干货分享" },
      { value: "story", label: "故事文案", description: "叙事性强，引人入胜" },
      { value: "trending", label: "热点文案", description: "结合当下热点话题" },
    ],
  },
  {
    id: "track",
    name: "赛道类型",
    options: [
      { value: "beauty", label: "美妆" },
      { value: "fitness", label: "健身" },
      { value: "food", label: "美食" },
      { value: "tech", label: "科技" },
      { value: "education", label: "教育" },
      { value: "entertainment", label: "娱乐" },
      { value: "travel", label: "旅行" },
      { value: "fashion", label: "时尚" }
    ],
  },
  { id: "language", name: "语言", options: [
    { value: "chinese", label: "中文" },
    { value: "english", label: "英文" }
  ]},
];

const exampleTexts = [
  "美妆教程、口红试色、护肤技巧",
  "健身赛道",
  "今天给大家分享一个超级实用的生活小技巧，只要三步就能让你的皮肤变得水嫩光滑...",
];

export default function CaptionWriter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [activeStyle, setActiveStyle] = useState("xiaohongshu");
  const [selectedOptions, setSelectedOptions] = useState({
    tone: "casual",
    length: "standard",
    style: "viral",
    track: "beauty",
    language: "chinese",
  });

  const handleRewrite = async () => {
    if (!inputText.trim()) return;

    setIsRewriting(true);

    // 模拟API调用
    setTimeout(() => {
      const outputContent = `【AI生成文案】\n\n📝 输入内容：${inputText.substring(0, 100)}${inputText.length > 100 ? "..." : ""}\n\n✨ 生成结果：\n经过AI智能处理，结合${activeStyle}平台风格特点，调整为${selectedOptions.tone}语调，${selectedOptions.length}长度，${selectedOptions.style}类型，适配${selectedOptions.track}赛道，${selectedOptions.language}语言的全新优质文案内容。`;

      setOutputText(outputContent);
      setIsRewriting(false);
    }, 2000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // 这里可以添加toast提示
  };

  const insertExample = (text: string) => {
    setInputText(text);
  };

  return (
    <DashboardLayout
      title="文案生成"
      subtitle="AI智能生成，提升内容质量和原创性"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            批量处理
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Style Selection */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Wand2 className="mr-2 h-4 w-4" />
              选择文案风格
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {contentStyles.map((style) => (
                <Button
                  key={style.id}
                  variant={activeStyle === style.id ? "default" : "outline"}
                  size="sm"
                  className={`h-8 ${
                    activeStyle === style.id
                      ? "bg-foreground text-background"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setActiveStyle(style.id)}
                >
                  {style.name}
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
                    内容输入
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {inputText.length}/800
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
                      感兴趣赛道
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                      原始文案
                    </span>
                  </div>
                </div>
                <Textarea
                  placeholder={
                    "📝 三种输入方式任选其一：\n\n1️⃣ 关键词输入\n   美妆教程、护肤技巧、口红推荐\n   健身动作、减肥方法、蛋白粉测评\n\n2️⃣ 赛道输入\n   美妆赛道、健身赛道、美食赛道\n   科技数码、教育培训、时尚穿搭\n\n3️⃣ 完整文案输入\n   今天给大家分享一个护肤小技巧，\n   这个方法我用了3个月效果很明显...\n\n💡 提示：AI会自动识别您的输入类型并生成对应风格的文案内容"
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[320px] resize-none border-0 p-0 focus-visible:ring-0"
                  maxLength={800}
                />

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRewrite}
                      disabled={!inputText.trim() || isRewriting}
                      className="h-8"
                    >
                      {isRewriting ? (
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="mr-2 h-3.5 w-3.5" />
                      )}
                      {isRewriting ? "改写中..." : "重新构思"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInputText("")}
                      className="h-8"
                    >
                      清空
                    </Button>
                  </div>

                  <div className="flex space-x-1">
                    {exampleTexts.map((example, index) => (
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

            {/* Output Section */}
            {(outputText || isRewriting) && (
              <Card className="border border-border mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      改写结果
                    </span>
                    {outputText && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(outputText)}
                        className="h-6"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isRewriting ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          AI正在重新构思文案...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-[150px] p-3 bg-muted/30 rounded-md">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                        {outputText}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Settings Panel */}
          <div className="space-y-4">
            {/* Rewrite Options */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">改写选项</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rewriteOptions.map((option) => (
                  <div key={option.id}>
                    <p className="text-sm font-medium mb-2">{option.name}</p>

                    {/* Use dropdown for style and track types */}
                    {option.id === "style" || option.id === "track" ? (
                      <Select
                        value={
                          selectedOptions[
                            option.id as keyof typeof selectedOptions
                          ]
                        }
                        onValueChange={(value) =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [option.id]: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {option.options.map((opt: any) => {
                            const isObject = typeof opt === "object";
                            const optValue = isObject ? opt.value : opt;
                            const optLabel = isObject ? opt.label : opt;
                            const optDescription = isObject
                              ? opt.description
                              : null;

                            return (
                              <SelectItem key={optValue} value={optValue}>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {optLabel}
                                  </span>
                                  {optDescription && (
                                    <span className="text-xs text-muted-foreground">
                                      {optDescription}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    ) : (
                      /* Use buttons for other options */
                      <div className="grid grid-cols-2 gap-1">
                        {option.options.map((opt: any) => {
                          const optValue =
                            typeof opt === "object" ? opt.value : opt;
                          const optLabel =
                            typeof opt === "object" ? opt.label : opt;

                          return (
                            <Button
                              key={optValue}
                              variant={
                                selectedOptions[
                                  option.id as keyof typeof selectedOptions
                                ] === optValue
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [option.id]: optValue,
                                }))
                              }
                            >
                              {optLabel}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">今日使��</CardTitle>
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

            {/* Tips */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  使用���巧
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• 输入完整的原始文案效果更好</p>
                  <p>• 选择合适的平台风格提升匹配度</p>
                  <p>• 可多次重新构思获得不同版本</p>
                  <p>• 支持批量处理多条文案</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
