import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Search,
  Link,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

export default function AccountInteraction() {
  const [selectedPlatform, setSelectedPlatform] = useState("wechat");
  const [startDate, setStartDate] = useState("2024");
  const [endDate, setEndDate] = useState("2024-06-30");

  const platformTabs = [
    { id: "summary", label: "字号汇总" },
    { id: "wechat", label: "公众号" },
    { id: "other", label: "其他" },
    { id: "xiaohongshu", label: "小红书" },
    { id: "shortvideo", label: "短视频" },
    { id: "kuaishou", label: "快手" },
    { id: "douyin", label: "抖音" },
    { id: "wechatnum", label: "微信号" },
    { id: "toutiao", label: "头条号" },
    { id: "dayu", label: "大鱼号" },
  ];

  const handleAnalysis = () => {
    console.log("Starting intelligent analysis...");
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">账号回采-公众号</h1>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 border-green-200"
            >
              AI分析
            </Badge>
          </div>
          <p className="text-muted-foreground">
            智能分析账号数据，支持多平台内容采集
          </p>
        </div>

        {/* Platform Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-1 border-b overflow-x-auto pb-1">
            {platformTabs.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  selectedPlatform === platform.id
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {platform.label}
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="batch" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="batch" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              批量链接
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              历史记录
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              数据展示
            </TabsTrigger>
            <TabsTrigger value="scoring" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              计分功能
            </TabsTrigger>
          </TabsList>

          <TabsContent value="batch" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">添加公众号</h3>
                  <p className="text-muted-foreground mb-6">
                    请添加需要分析的公众号链接或账号信息
                  </p>
                </div>

                {/* Search Form */}
                <div className="border-t pt-6">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">开始时间:</label>
                      <Input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-32"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">结束时间:</label>
                      <Input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-32"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">上级:</label>
                      <Input
                        type="text"
                        placeholder="输入上级"
                        className="w-24"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">下级:</label>
                      <Input
                        type="text"
                        placeholder="输入下级"
                        className="w-24"
                      />
                    </div>

                    <Button
                      onClick={handleAnalysis}
                      className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      开始智能智能分析
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>历史记录</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">暂无历史记录</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    完成数据采集后，记录将显示在这里
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>数据展示</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        0
                      </div>
                      <div className="text-sm font-medium">总账号数</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        0
                      </div>
                      <div className="text-sm font-medium">活跃账号</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        0
                      </div>
                      <div className="text-sm font-medium">总互动数</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        0
                      </div>
                      <div className="text-sm font-medium">平均互动率</div>
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      开始分析后将显示详细数据图表
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scoring" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>计分功能</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        --
                      </div>
                      <div className="text-sm font-medium">账号质量分</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        基于粉丝质量、活跃度等
                      </div>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        --
                      </div>
                      <div className="text-sm font-medium">内容质量分</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        基于内容原创性、互动等
                      </div>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        --
                      </div>
                      <div className="text-sm font-medium">影响力指数</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        综合影响力评估
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-muted-foreground">
                    <p className="text-sm">
                      完成账号分析后，将自动生成详细的评分报告
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
