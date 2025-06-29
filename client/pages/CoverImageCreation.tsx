import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Image as ImageIcon,
  Wand2,
  Copy,
  Download,
  RefreshCw,
  Settings,
  Sparkles,
  Palette,
  Layout,
  Type,
  Zap,
  Eye,
  Heart,
  Star,
  Clock,
} from "lucide-react";

const coverTemplates = [
  {
    id: "douyin",
    name: "抖音封面",
    size: "1080x1920",
    description: "竖版视频封面，适合抖音短视频",
    aspectRatio: "9:16",
    color: "#ff4444",
  },
  {
    id: "xiaohongshu",
    name: "小红书封面",
    size: "1080x1350",
    description: "方形图片封面，适合小红书笔记",
    aspectRatio: "4:5",
    color: "#ff2442",
  },
  {
    id: "wechat",
    name: "公众号大封面",
    size: "900x500",
    description: "横版大图封面，适合公众号头条",
    aspectRatio: "16:9",
    color: "#07c160",
  },
];

const styleTemplates = [
  { id: "business", name: "商务风格", desc: "专业简洁" },
  { id: "creative", name: "创意风格", desc: "时尚个性" },
  { id: "minimal", name: "极简风格", desc: "简约清爽" },
  { id: "colorful", name: "多彩风格", desc: "活泼鲜艳" },
];

export default function CoverImageCreation() {
  const [selectedTemplate, setSelectedTemplate] = useState("douyin");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputs, setInputs] = useState({
    content1: "",
    content2: "",
    content3: "",
  });

  const handleGenerate = () => {
    if (!inputs.content1.trim()) {
      alert("请至少输入一个内容描述");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("封面图生成完成！");
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout
      title="封面图制作"
      subtitle="AI智能设计封面图，提升内容吸引力和点击率"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <Download className="mr-2 h-3.5 w-3.5" />
            我的作品
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Feature Introduction */}
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Wand2 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  封面图制作
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-orange-100 text-orange-800"
                  >
                    AI智能设计
                  </Badge>
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  自动化批量制作封面图，爆量后快速的好内容速度，创造更多小红书封面，达到一分钟内完成制作，提高公众号素用，高质量...
                </p>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-orange-600">
                    <Sparkles className="mr-2 h-4 w-4" />
                    你好，欢迎体验封面图设计工具功能，你可以从此页面输入一离关键文字内容复制一篇关键词或复制，
                    这样您就能获得很好的封面设计效果，具体效果请自行体验！
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Type className="mr-2 h-4 w-4" />
                  内容输入
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      请输入公众号的营销标题或主要文字内容封面
                    </label>
                    <Input
                      placeholder="输入公众号营销标题或主要文字内容..."
                      value={inputs.content1}
                      onChange={(e) =>
                        handleInputChange("content1", e.target.value)
                      }
                      className="border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      请输入红书的营销标题或主要文字封面
                    </label>
                    <Input
                      placeholder="输入小红书营销标题或主要文字内容..."
                      value={inputs.content2}
                      onChange={(e) =>
                        handleInputChange("content2", e.target.value)
                      }
                      className="border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      请输入关键词，直接生成小红书封面
                    </label>
                    <Input
                      placeholder="输入关键词直接生成小红书封面..."
                      value={inputs.content3}
                      onChange={(e) =>
                        handleInputChange("content3", e.target.value)
                      }
                      className="border-border"
                    />
                  </div>
                </div>

                {/* Template Selection */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium">选择封面类型</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {coverTemplates.map((template) => (
                      <Button
                        key={template.id}
                        variant={
                          selectedTemplate === template.id
                            ? "default"
                            : "outline"
                        }
                        className="h-auto p-3 flex flex-col items-center space-y-2"
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: template.color }}
                        >
                          {template.aspectRatio}
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-medium">
                            {template.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {template.size}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Style Selection */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">设计风格</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {styleTemplates.map((style) => (
                      <Button
                        key={style.id}
                        variant="outline"
                        size="sm"
                        className="h-auto p-2 justify-start"
                      >
                        <div className="text-left">
                          <div className="text-xs font-medium">
                            {style.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {style.desc}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>新版图</span>
                    <span>•</span>
                    <span>历史记录</span>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={!inputs.content1.trim() || isGenerating}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isGenerating ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="mr-2 h-4 w-4" />
                    )}
                    {isGenerating ? "生成中..." : "生成"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated Results */}
            {isGenerating && (
              <Card className="border border-border mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">生成进度</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        AI正在设计封面图...
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                        <span>分析内容</span>
                        <span>•</span>
                        <span>设计布局</span>
                        <span>•</span>
                        <span>生成图片</span>
                      </div>
                    </div>
                  </div>
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
                    <span className="text-sm font-medium">5 张</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">剩余</span>
                    <span className="text-sm font-medium">95 张</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-foreground h-2 rounded-full"
                      style={{ width: "5%" }}
                    />
                  </div>
                  <Badge
                    variant="secondary"
                    className="w-full justify-center text-xs"
                  >
                    🎉 今日免费额度 100张
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Template Preview */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Layout className="mr-2 h-4 w-4" />
                  模板预览
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coverTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate === template.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-border hover:bg-muted/30"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-12 rounded flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: template.color }}
                        >
                          {template.name.slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {template.size} • {template.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  设计技巧
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• 标题要简洁明了，突出重点</p>
                  <p>• 选择与内容匹配的颜色风格</p>
                  <p>• 保持视觉层次清晰</p>
                  <p>• 考虑平台特色和用户习惯</p>
                  <p>• 测试不同版本的效果</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Works */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  最近作品
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      title: "美食分享封面",
                      platform: "小红书",
                      time: "10分钟前",
                    },
                    {
                      title: "科技资讯封面",
                      platform: "公众号",
                      time: "1小时前",
                    },
                    {
                      title: "生活技巧封面",
                      platform: "抖音",
                      time: "2小时前",
                    },
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
