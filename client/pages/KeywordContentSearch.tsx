import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Filter, Calendar } from "lucide-react";

export default function KeywordContentSearch() {
  const [keyword, setKeyword] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("wechat");
  const [timeRange, setTimeRange] = useState("30");
  const [sortBy, setSortBy] = useState("time");
  const [showType, setShowType] = useState("all");

  const platformTabs = [
    { id: "summary", label: "平台汇总" },
    { id: "wechat", label: "公众号" },
    { id: "xiaohongshu", label: "小红书" },
    { id: "douyin", label: "抖音" },
    { id: "kuaishou", label: "快手" },
    { id: "bilibili", label: "B站" },
    { id: "toutiao", label: "头条" },
  ];

  const mockResults = [
    {
      id: 1,
      title: '深圳一大学"情报九号"了，实力抢���夺权',
      publishTime: "2025/06/23 07:40",
      platform: "头条",
      views: "10w+",
      likes: 403,
      comments: 21,
      shares: 244,
      readTime: "--",
    },
    {
      id: 2,
      title: "考不上清华就让子子孙孙...",
      publishTime: "2025/06/23 21:25",
      platform: "头条",
      views: "10w+",
      likes: 925,
      comments: 545,
      shares: 1329,
      readTime: "--",
    },
    {
      id: 3,
      title: "学校立志都都都都是我的好学校",
      publishTime: "2025/06/24 19:28",
      platform: "头条",
      views: "10w+",
      likes: 482,
      comments: 72,
      shares: 172,
      readTime: "--",
    },
  ];

  const handleSearch = () => {
    console.log("Searching for:", keyword);
  };

  const handleExport = () => {
    console.log("Exporting results...");
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">按关键词导出作品-公众号</h1>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 border-green-200"
            >
              公众体验
            </Badge>
          </div>
          <p className="text-muted-foreground">
            高效搜索各平台内容，导出作品数据
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
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {platform.label}
              </button>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {/* Search Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">关键</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="输入搜索关键词..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSearch}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      开始搜索
                    </Button>
                    <Button
                      onClick={handleExport}
                      variant="outline"
                      className="px-6"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      导出数据
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filter Options */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm">搜索范围</span>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                      标题
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" className="rounded" />
                      正文
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" className="rounded" />
                      主文
                    </label>
                  </div>
                </div>
              </div>

              {/* Time and Sort Options */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm">发布时间</span>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">昨天</SelectItem>
                      <SelectItem value="7">近7天</SelectItem>
                      <SelectItem value="30">近30天</SelectItem>
                      <SelectItem value="90">近90天</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">排序方式</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">按时间</SelectItem>
                      <SelectItem value="views">按阅读量</SelectItem>
                      <SelectItem value="likes">按点赞数</SelectItem>
                      <SelectItem value="comments">按评论数</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">自定义时间</span>
                  <Badge variant="outline" className="text-xs">
                    📅
                  </Badge>
                </div>
              </div>

              {/* Search Settings */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    搜索设置
                  </span>
                </div>
                <p className="text-sm text-yellow-700">
                  只搜索头条号，多平台搜索请添加，请联系
                  <span className="text-blue-600 cursor-pointer">在线客服</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>搜索结果</span>
                <Badge variant="secondary">
                  共 99+ 条结果 &gt; 关键词：关键
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                发现结果
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium">
                      标题概要
                    </th>
                    <th className="text-center p-3 text-sm font-medium">
                      发布时间
                    </th>
                    <th className="text-center p-3 text-sm font-medium">
                      平台
                    </th>
                    <th className="text-center p-3 text-sm font-medium">
                      阅读数 ⬇️
                    </th>
                    <th className="text-center p-3 text-sm font-medium">
                      点赞数 ⬇️
                    </th>
                    <th className="text-center p-3 text-sm font-medium">
                      在看数 ⬇️
                    </th>
                    <th className="text-center p-3 text-sm font-medium">
                      评论数 ⬇️
                    </th>
                    <th className="text-center p-3 text-sm font-medium">
                      原文 📋
                    </th>
                    <th className="text-center p-3 text-sm font-medium">
                      关键词出现位置
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockResults.map((result, index) => (
                    <tr key={result.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="max-w-md">
                          <h4 className="font-medium text-sm mb-1">
                            {result.title}
                          </h4>
                          {index === 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              ⭐ 星级作者
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center text-sm">
                        {result.publishTime}
                      </td>
                      <td className="p-3 text-center text-sm">
                        {result.platform}
                      </td>
                      <td className="p-3 text-center text-sm">
                        {result.views}
                      </td>
                      <td className="p-3 text-center text-sm">
                        {result.likes}
                      </td>
                      <td className="p-3 text-center text-sm">
                        {result.comments}
                      </td>
                      <td className="p-3 text-center text-sm">
                        {result.shares}
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-blue-600 text-xs"
                        >
                          查看 &gt;
                        </Button>
                      </td>
                      <td className="p-3 text-center text-sm">
                        {result.readTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                显示 1-3 条，共 99+ 条结果
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  上一页
                </Button>
                <Button variant="outline" size="sm">
                  下一页
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
