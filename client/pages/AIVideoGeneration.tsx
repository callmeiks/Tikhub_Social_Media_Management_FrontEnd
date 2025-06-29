import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  Video,
  Play,
  Copy,
  Download,
  RefreshCw,
  Settings,
  Sparkles,
  Search,
  Filter,
  Clock,
  Eye,
  Heart,
  Share2,
  Star,
  Wand2,
} from "lucide-react";

const categories = [
  { id: "beauty", name: "美妆", emoji: "💄", active: false },
  { id: "sports", name: "体育", emoji: "⚽", active: false },
  { id: "entertainment", name: "娱乐", emoji: "🎭", active: false },
  { id: "food", name: "美食", emoji: "🍽️", active: true },
  { id: "digital", name: "数码", emoji: "📱", active: false },
  { id: "emotion", name: "情感", emoji: "💝", active: false },
  { id: "lifestyle", name: "生活", emoji: "🏠", active: false },
  { id: "tech", name: "科技", emoji: "🔬", active: false },
  { id: "art", name: "艺术", emoji: "🎨", active: false },
];

const videoTemplates = [
  {
    id: 1,
    title: "一位厨艺出色的年轻的工作者咬了一口，流泪了",
    description:
      "一位厨艺精湛的年轻工作者在品尝自己制作的美食后，情不自禁地流下了感动的眼泪。",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2F6f5bb2d78f724eb19fe2873245c4db31%2F0064cc9f5ad343ef88f95d47e579b7d1?format=webp&width=200",
    duration: "0:15",
    views: "2.3万",
    category: "美食",
    tags: ["美食制作", "情感", "工作"],
  },
  {
    id: 2,
    title: "一位厨师精心在美奂的商务餐厅制作菜品",
    description:
      "在高档商务餐厅里，专业厨师正在精心制作精美菜品，展现极致的烹饪艺术。",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2F6f5bb2d78f724eb19fe2873245c4db31%2F0064cc9f5ad343ef88f95d47e579b7d1?format=webp&width=200",
    duration: "0:20",
    views: "1.8万",
    category: "美食",
    tags: ["专业厨师", "商务餐厅", "精美"],
  },
  {
    id: 3,
    title: "一位厨师在在豪华的厨房中精心制作菜品",
    description:
      "在装备齐全的豪华厨房中，厨师正在运用精湛技艺制作令人垂涎的美味佳肴。",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2F6f5bb2d78f724eb19fe2873245c4db31%2F0064cc9f5ad343ef88f95d47e579b7d1?format=webp&width=200",
    duration: "0:18",
    views: "3.1万",
    category: "美食",
    tags: ["豪华厨房", "精湛技艺", "美味"],
  },
  {
    id: 4,
    title: "一位鼓舞在在美丽的自然环境中练习武功",
    description: "在风景如画的自然环境中，一位武者正在专心致志地练习传统武功。",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2F6f5bb2d78f724eb19fe2873245c4db31%2F0064cc9f5ad343ef88f95d47e579b7d1?format=webp&width=200",
    duration: "0:25",
    views: "1.5万",
    category: "体育",
    tags: ["武功", "自然环境", "练习"],
  },
  {
    id: 5,
    title: "一位鼓舞在在美丽的黄昏时段练习",
    description: "在黄昏的美丽时光中，练习者沉浸在训练的专注与宁静之中。",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2F6f5bb2d78f724eb19fe2873245c4db31%2F0064cc9f5ad343ef88f95d47e579b7d1?format=webp&width=200",
    duration: "0:22",
    views: "2.7万",
    category: "体育",
    tags: ["黄昏", "练习", "美丽"],
  },
  {
    id: 6,
    title: "一位健身的在在豪华健身房中锻炼",
    description: "在设施完善的豪华健身房中，健身爱好者正在进行专业的体能训练。",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2F6f5bb2d78f724eb19fe2873245c4db31%2F0064cc9f5ad343ef88f95d47e579b7d1?format=webp&width=200",
    duration: "0:30",
    views: "4.2万",
    category: "体育",
    tags: ["健身房", "锻炼", "专业"],
  },
  {
    id: 7,
    title: "一位厨师在在美丽的中式庭院环境中游玩",
    description: "在古典雅致的中式庭院中，享受悠闲的时光，感受传统文化的魅力。",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2F6f5bb2d78f724eb19fe2873245c4db31%2F0064cc9f5ad343ef88f95d47e579b7d1?format=webp&width=200",
    duration: "0:28",
    views: "1.9万",
    category: "生活",
    tags: ["中式庭院", "悠闲", "传统"],
  },
  {
    id: 8,
    title: "一位健身在在美丽的海滩环境中游玩",
    description:
      "在阳光明媚的海滩上，享受自由自在的美好时光，感受大自然的魅力。",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2F6f5bb2d78f724eb19fe2873245c4db31%2F0064cc9f5ad343ef88f95d47e579b7d1?format=webp&width=200",
    duration: "0:35",
    views: "5.6万",
    category: "生活",
    tags: ["海滩", "阳光", "自然"],
  },
  {
    id: 9,
    title: "一位健身在在美丽的樱花树下中游玩",
    description:
      "在盛开的樱花树下，享受春日的美好时光，沉浸在浪漫的粉色花海中。",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2F6f5bb2d78f724eb19fe2873245c4db31%2F0064cc9f5ad343ef88f95d47e579b7d1?format=webp&width=200",
    duration: "0:24",
    views: "3.8万",
    category: "生活",
    tags: ["樱花", "春日", "浪漫"],
  },
  {
    id: 10,
    title: "一位健身在在美丽的悉尼海滩环境中游玩",
    description: "在澳洲悉尼的著名海滩上，体验异国海滨的独特风情和生活节奏。",
    thumbnail:
      "https://cdn.builder.io/api/v1/image/assets%2F6f5bb2d78f724eb19fe2873245c4db31%2F0064cc9f5ad343ef88f95d47e579b7d1?format=webp&width=200",
    duration: "0:32",
    views: "2.4万",
    category: "生活",
    tags: ["悉尼", "海滩", "异国"],
  },
];

export default function AIVideoGeneration() {
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");

  const filteredTemplates = videoTemplates.filter((template) =>
    selectedCategory === "all"
      ? true
      : template.category ===
        categories.find((c) => c.id === selectedCategory)?.name,
  );

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert("请输入视频描述");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("视频生成完成！");
    }, 3000);
  };

  const handleUseTemplate = (template: any) => {
    setPrompt(template.description);
  };

  return (
    <DashboardLayout
      title="AI视频生成"
      subtitle="使用AI技术生成原创视频内容，创新创作方式"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            创建视频
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Introduction Banner */}
        <Card className="border border-border bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-600" />
                  图片生成视频功能
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-yellow-100 text-yellow-800"
                  >
                    文字生成视频
                  </Badge>
                </h2>
                <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
                  请描述您想要创建的视频内容，AI将会为您生成精彩的视频。您可以描述场景、人物、动作等详细信息，
                  也可以直接使用下方的模板。一个优质的视频可以显著提升您的内容质量。
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    生成时间：1-3分钟
                  </span>
                  <span className="flex items-center">
                    <Video className="mr-1 h-3 w-3" />
                    支持1080P高清
                  </span>
                  <span className="flex items-center">
                    <Sparkles className="mr-1 h-3 w-3" />
                    AI智能生成
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">
                  剩余10次
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Categories */}
          <div>
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">视频类型</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "ghost"}
                    className="w-full justify-start h-8"
                    onClick={() => setSelectedCategory("all")}
                  >
                    全部分类
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "ghost"
                      }
                      className="w-full justify-start h-8"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span className="mr-2">{category.emoji}</span>
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-border mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">快捷操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full h-8">
                  <Eye className="mr-2 h-3 w-3" />
                  我的作品
                </Button>
                <Button variant="outline" size="sm" className="w-full h-8">
                  <Star className="mr-2 h-3 w-3" />
                  收藏模板
                </Button>
                <Button variant="outline" size="sm" className="w-full h-8">
                  <Download className="mr-2 h-3 w-3" />
                  下载记录
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Custom Video Generation */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Wand2 className="mr-2 h-4 w-4" />
                  自定义视频生成
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">视频描述</label>
                  <Textarea
                    placeholder="请详细描述您想要生成的视频内容，例如：一位年轻的厨师在现代化厨房中制作美味的意大利面，阳光从窗户洒进来..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px] resize-none"
                    maxLength={500}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>详细的描述���生成更好的视频效果</span>
                    <span>{prompt.length}/500</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="brand-accent"
                  >
                    {isGenerating ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="mr-2 h-4 w-4" />
                    )}
                    {isGenerating ? "生成中..." : "生成视频"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPrompt("")}
                    disabled={isGenerating}
                  >
                    清空
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Template Library */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>模板库</span>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                      <Input
                        placeholder="搜索模板..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-7 w-40 text-xs"
                      />
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Filter className="h-3 w-3" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="group relative border border-border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer"
                    >
                      {/* Video Thumbnail */}
                      <div className="aspect-video bg-gray-100 relative">
                        <img
                          src={template.thumbnail}
                          alt={template.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-white"
                            onClick={() => handleUseTemplate(template)}
                          >
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-black/50 text-white"
                          >
                            {template.duration}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-black/50 text-white"
                          >
                            <Eye className="mr-1 h-2 w-2" />
                            {template.views}
                          </Badge>
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="p-3">
                        <h3 className="text-sm font-medium mb-1 line-clamp-2">
                          {template.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {template.tags.slice(0, 2).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs h-4 px-1"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUseTemplate(template)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
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
