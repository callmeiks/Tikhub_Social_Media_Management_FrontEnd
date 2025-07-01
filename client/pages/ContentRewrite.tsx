import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  { id: "style", name: "风格类型", options: ["营销", "教育", "娱乐", "新闻"] },
  { id: "language", name: "语言", options: ["中文", "英文"] },
];

const exampleTexts = [
  "今天给大家分享一个超级实用的生活小技巧...",
  "最近发现了一个宝藏APP，必须安利给大家...",
  "作为一个资深打工人，我想说说职场那些事...",
];

export default function ContentRewrite() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [activeStyle, setActiveStyle] = useState("xiaohongshu");
  const [selectedOptions, setSelectedOptions] = useState({
    tone: "轻松",
    length: "标准",
    style: "营销",
    language: "中文",
  });

  const handleRewrite = async () => {
    if (!inputText.trim()) return;

    setIsRewriting(true);
    // 模拟API调用
    setTimeout(() => {
      setOutputText(
        `【重新构思后的文案】\n\n${inputText}\n\n经过AI智能改写，结合${activeStyle}风格特点，调整为${selectedOptions.tone}语调，${selectedOptions.length}长度，${selectedOptions.style}类型，${selectedOptions.language}语言的全新文案内容。`,
      );
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
      title="文案改写"
      subtitle="AI智能改写，提升内容质量和原创性"
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
                    原始文案
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {inputText.length}/800
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="请输入原始文案，点击重新构思，文案将会自动转化改写（请不要重复输入太过相似的内容）"
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
                    <div className="grid grid-cols-2 gap-1">
                      {option.options.map((opt) => (
                        <Button
                          key={opt}
                          variant={
                            selectedOptions[
                              option.id as keyof typeof selectedOptions
                            ] === opt
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [option.id]: opt,
                            }))
                          }
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

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
