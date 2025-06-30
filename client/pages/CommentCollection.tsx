import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, FileText, Settings, BarChart3 } from "lucide-react";

export default function CommentCollection() {
  const [linkInput, setLinkInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!linkInput.trim()) return;

    setIsProcessing(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  const linkCount = linkInput.split("\n").filter((line) => line.trim()).length;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">通用评论采集</h1>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 border-green-200"
            >
              免费体验
            </Badge>
          </div>
          <p className="text-muted-foreground">高效各类链接地址评论PY介绍</p>
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
            <TabsTrigger value="extension" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              功能扩展
            </TabsTrigger>
            <TabsTrigger value="scoring" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              计分功能
            </TabsTrigger>
          </TabsList>

          <TabsContent value="batch" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>批量链接采集</span>
                  <Badge variant="outline">{linkCount} 条链接</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="请输入链接地址，每行一个链接&#10;支持抖音、小红书、B站等平台链接&#10;&#10;示例：&#10;https://www.douyin.com/video/123456&#10;https://www.xiaohongshu.com/explore/123456&#10;https://www.bilibili.com/video/BV123456"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                  {!linkInput.trim() && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-3">
                        <Link className="w-8 h-8 text-green-500" />
                      </div>
                      <p className="text-muted-foreground">添加文案链接</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleProcess}
                    disabled={!linkInput.trim() || isProcessing}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-lg"
                  >
                    {isProcessing ? "处理中..." : "100"}
                  </Button>
                </div>

                {linkCount > 0 && (
                  <div className="text-sm text-muted-foreground text-center">
                    已添加 {linkCount} 个链接，点击按钮开始采集评论
                  </div>
                )}
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
                    完成评论采集后，记录将显示在这里
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extension" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>功能扩展</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">评论筛选</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      根据关键词、点赞数、时间等条件筛选评论
                    </p>
                    <Badge variant="outline">即将推出</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">情感分析</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      自动分析评论情感倾向，识别正面、负面和中性评论
                    </p>
                    <Badge variant="outline">即将推出</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">数据导出</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      支持导出为Excel、CSV等格式，便于后续分析
                    </p>
                    <Badge variant="outline">即将推出</Badge>
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
                        85
                      </div>
                      <div className="text-sm font-medium">评论质量分</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        基于评论长度、互动数等
                      </div>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        92
                      </div>
                      <div className="text-sm font-medium">情感积极度</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        正面评论占比
                      </div>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        78
                      </div>
                      <div className="text-sm font-medium">互动活跃度</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        评论互���综合指标
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-muted-foreground">
                    <p className="text-sm">
                      完成评论采集后，将自动生成详细的评分报告
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
