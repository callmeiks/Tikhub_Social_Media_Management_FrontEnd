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
  { id: "tone", name: "语调调整", options: ["正式", "轻松", "幽默", "专业"] },
  { id: "length", name: "长度控制", options: ["精简", "标准", "详细", "扩展"] },
  {
    id: "style",
    name: "风格类型",
    options: [
      { value: "爆款文案", description: "高传播性，容易走红" },
      { value: "情感文案", description: "引发情感共鸣" },
      { value: "悬念文案", description: "制造悬念，吸引观看" },
      { value: "教程文案", description: "实用干货分享" },
      { value: "故事文案", description: "叙事性强，引人入胜" },
      { value: "热点文案", description: "结合当下热点话题" },
    ],
  },
  {
    id: "track",
    name: "赛道类型",
    options: ["美妆", "健身", "美食", "科技", "教育", "娱乐", "旅行", "时尚"],
  },
  { id: "language", name: "语言", options: ["中文", "英文"] },
];

const exampleTexts = [
  "美妆教程、口红试色、护肤技巧",
  "健身赛道",
  "今天给大家分享一个超级实用的生活小技巧，只要三步就能让你的皮肤变得水嫩光滑...",
];

export default function ContentRewrite() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [activeStyle, setActiveStyle] = useState("xiaohongshu");
  const [selectedOptions, setSelectedOptions] = useState({
    tone: "轻松",
    length: "标准",
    style: "爆款文案",
    track: "美妆",
    language: "中文",
  });

  const handleRewrite = async () => {
    if (!inputText.trim()) return;

    setIsRewriting(true);

    // 检测输入类型
    const detectInputType = (text: string) => {
      if (text.includes("赛道")) return "track";
      if (text.length < 50 && (text.includes("、") || text.includes(",")))
        return "keywords";
      return "content";
    };

    const inputType = detectInputType(inputText);

    // ��拟API调用
    setTimeout(() => {
      let outputContent = "";

      if (inputType === "keywords") {
        outputContent = `【基于关键词生成的文案】\n\n🎯 关键词：${inputText}\n\n📝 生成文案：\n根据您提供的关键词"${inputText}"，AI为您生成了适合${activeStyle}平台的优质文案内容。文案采用${selectedOptions.tone}语调，${selectedOptions.length}篇幅，${selectedOptions.style}风格，针对${selectedOptions.track}赛道，使用${selectedOptions.language}语言，确保内容既符合平台特色又具有吸引力。`;
      } else if (inputType === "track") {
        outputContent = `【赛道定制文案】\n\n🏁 目标赛道：${inputText}\n\n📝 生成文案：\nAI基于您选择的"${inputText}"，结合当前热门趋势和${activeStyle}平台特色，为您定制专属文案。内容风格为${selectedOptions.tone}语调，${selectedOptions.length}长度，${selectedOptions.style}类型，专注${selectedOptions.track}赛道，${selectedOptions.language}表达，帮助您在该赛道中脱颖而出。`;
      } else {
        outputContent = `【智能改写文案】\n\n📄 原始内容：${inputText.substring(0, 100)}${inputText.length > 100 ? "..." : ""}\n\n✨ 改写结果：\n经过AI智能改写，结合${activeStyle}平台风格特点���调整为${selectedOptions.tone}语调，${selectedOptions.length}长度，${selectedOptions.style}类型，适配${selectedOptions.track}赛道，${selectedOptions.language}语言的全新优质文案内容。`;
      }

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
                    "您可以选择以下任一种方式输入：&#10;&#10;第一种：输入关键词&#10;例如：美妆教程、护肤技巧、口红推荐&#10;&#10;第二种：输入感兴趣的赛道&#10;例如：美妆赛道、健身赛道、美食赛道&#10;&#10;第三种：输入完整的原始文案&#10;例如：今天给大家分享一个护肤小技巧...&#10;&#10;💡 AI会根据您的输入内容自动识别类型，并生成相应的文案"
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-none border-0 p-0 focus-visible:ring-0"
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
                          {option.options.map((opt) => {
                            const isObject = typeof opt === "object";
                            const optValue = isObject ? opt.value : opt;
                            const optDescription = isObject
                              ? opt.description
                              : null;

                            return (
                              <SelectItem key={optValue} value={optValue}>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {optValue}
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
                        {option.options.map((opt) => {
                          const optValue =
                            typeof opt === "object" ? opt.value : opt;

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
                              {optValue}
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
                <CardTitle className="text-base">今日使���</CardTitle>
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
