import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  DollarSign,
  Calendar,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  MapPin,
  UserCheck,
  Award,
  Zap,
  PieChart,
  Activity,
} from "lucide-react";
import { apiClient, type DouyinInfluencer } from "@/lib/api";
import { AvatarImage } from "@/components/ui/avatar-image";

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}千`;
  }
  return num.toString();
};

const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

// 粉丝趋势分析组件
const FanTrendsAnalysisTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 趋势总览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-600">+15.2%</div>
              <div className="text-sm text-muted-foreground">本月增长率</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">+8.7万</div>
              <div className="text-sm text-muted-foreground">本月新增</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">+2.5万</div>
              <div className="text-sm text-muted-foreground">本周新增</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">98.5%</div>
              <div className="text-sm text-muted-foreground">留存率</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 粉丝增长趋势图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            粉丝增长趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-medium">粉丝增长趋势图表</p>
              <p className="text-sm">显示近30天的粉丝增长变化</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 粉丝活跃时间分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              粉丝活跃时段
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "08:00-10:00", activity: 78, color: "bg-green-500" },
                { time: "12:00-14:00", activity: 92, color: "bg-blue-500" },
                { time: "18:00-20:00", activity: 95, color: "bg-purple-500" },
                { time: "20:00-22:00", activity: 88, color: "bg-orange-500" },
              ].map((item) => (
                <div key={item.time} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.time}</span>
                    <span className="font-medium">{item.activity}%</span>
                  </div>
                  <Progress value={item.activity} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <PieChart className="mr-2 h-4 w-4" />
              粉丝来源分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: "搜索发现", percentage: 42.5, color: "bg-blue-500" },
                { source: "推荐算法", percentage: 35.8, color: "bg-green-500" },
                {
                  source: "话题页面",
                  percentage: 12.3,
                  color: "bg-purple-500",
                },
                { source: "分享链接", percentage: 9.4, color: "bg-orange-500" },
              ].map((item) => (
                <div
                  key={item.source}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{item.source}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// 观众分析组件
const AudienceAnalysisTab: React.FC = () => {
  const fanGenderData = [
    { label: "男性", value: 45.2, color: "bg-blue-500" },
    { label: "女性", value: 54.8, color: "bg-pink-500" },
  ];

  const fanAgeData = [
    { label: "18-24���", value: 35.6, color: "bg-green-500" },
    { label: "25-34岁", value: 42.3, color: "bg-blue-500" },
    { label: "35-44岁", value: 16.8, color: "bg-orange-500" },
    { label: "45岁以上", value: 5.3, color: "bg-gray-500" },
  ];

  const fanCityData = [
    { city: "北京", percentage: 12.5 },
    { city: "上海", percentage: 10.8 },
    { city: "广州", percentage: 8.9 },
    { city: "深圳", percentage: 7.6 },
    { city: "杭州", percentage: 6.2 },
    { city: "成都", percentage: 5.4 },
    { city: "武汉", percentage: 4.7 },
    { city: "西安", percentage: 4.1 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 性别分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Users className="mr-2 h-4 w-4" />
              性别分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fanGenderData.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">
                      {formatPercentage(item.value)}
                    </span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 年龄分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              年龄分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fanAgeData.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">
                      {formatPercentage(item.value)}
                    </span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 地域分布 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            粉丝地域分布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fanCityData.map((item, index) => (
              <div key={item.city} className="text-center">
                <div className="text-lg font-semibold">
                  {formatPercentage(item.percentage)}
                </div>
                <div className="text-sm text-muted-foreground">{item.city}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 粉丝趋势 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            粉丝增长趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+2.5万</div>
              <div className="text-sm text-muted-foreground">本周新增</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">+8.7万</div>
              <div className="text-sm text-muted-foreground">本月新增</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">+15.2%</div>
              <div className="text-sm text-muted-foreground">增长率</div>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>粉丝趋势图表</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 服务报价组件
const ServicePricingTab: React.FC = () => {
  const pricingData = [
    { type: "短视频植入", price: "5万-15万", desc: "15秒-60秒视频��容" },
    { type: "直播带货", price: "10万-30万", desc: "2-3小时直播时长" },
    { type: "品牌合作", price: "20万-50万", desc: "深度品牌合作内容" },
    { type: "产品测评", price: "3万-8万", desc: "产品体验类内容" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            服务报价表
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pricingData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{item.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.desc}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">{item.price}</div>
                  <div className="text-xs text-muted-foreground">预估价格</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Target className="mr-2 h-4 w-4" />
            历史合作案例
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">���妆品牌A合作</div>
                <Badge variant="secondary">2024年3月</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                15秒产品测评视频，获得120万播放量，点赞数8.5万
              </p>
              <div className="flex space-x-4 text-sm">
                <span>播放量: 120万</span>
                <span>点赞: 8.5万</span>
                <span>评论: 3.2万</span>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">服装品牌B直播</div>
                <Badge variant="secondary">2024年2月</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                3小时直播带货，销售额达到85万，转化率2.3%
              </p>
              <div className="flex space-x-4 text-sm">
                <span>观看人数: 15万</span>
                <span>销售额: 85万</span>
                <span>转化率: 2.3%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 达人表现组件
const CreatorPerformanceTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              平均转化率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">2.8%</div>
              <div className="text-sm text-muted-foreground">
                行业平均���出1.2%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              CPM成本
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">¥45</div>
              <div className="text-sm text-muted-foreground">
                每千次展示成本
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Target className="mr-2 h-4 w-4" />
              ROI指数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">4.2</div>
              <div className="text-sm text-muted-foreground">投入产出比</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <PieChart className="mr-2 h-4 w-4" />
            品类转化效果分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: "美妆护肤", rate: 3.2, orders: 1250 },
              { category: "服装配饰", rate: 2.8, orders: 980 },
              { category: "数码产品", rate: 2.1, orders: 420 },
              { category: "生活用品", rate: 2.5, orders: 650 },
            ].map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div>
                  <div className="font-medium">{item.category}</div>
                  <div className="text-sm text-muted-foreground">
                    订单数: {item.orders}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{item.rate}%</div>
                  <div className="text-xs text-muted-foreground">转化率</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 视频表现分析组件
const VideoPerformanceTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">158万</div>
              <div className="text-sm text-muted-foreground">平均播放量</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">12.5万</div>
              <div className="text-sm text-muted-foreground">平均点赞数</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">3.2万</div>
              <div className="text-sm text-muted-foreground">平均评论数</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Share2 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">1.8万</div>
              <div className="text-sm text-muted-foreground">平均分享数</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            最近热门视频表现
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>视频标题</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead>播放量</TableHead>
                <TableHead>点赞数</TableHead>
                <TableHead>评论数</TableHead>
                <TableHead>完播率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  title: "春季护肤小贴士分享",
                  date: "2024-03-15",
                  views: "256万",
                  likes: "18.5万",
                  comments: "5.2万",
                  completion: "68%",
                },
                {
                  title: "今日穿搭推荐",
                  date: "2024-03-14",
                  views: "189万",
                  likes: "14.2万",
                  comments: "3.8万",
                  completion: "72%",
                },
                {
                  title: "美食制作教程",
                  date: "2024-03-13",
                  views: "145万",
                  likes: "12.8万",
                  comments: "4.1万",
                  completion: "65%",
                },
              ].map((video, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>{video.date}</TableCell>
                  <TableCell>{video.views}</TableCell>
                  <TableCell>{video.likes}</TableCell>
                  <TableCell>{video.comments}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        parseInt(video.completion) > 70
                          ? "default"
                          : "secondary"
                      }
                    >
                      {video.completion}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// 热门词云组件
const HotWordCloudTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Zap className="mr-2 h-4 w-4 text-yellow-500" />
              热门话题词云
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">A+</div>
              <div className="text-sm text-muted-foreground mb-4">
                优质创作者
              </div>
              <Progress value={85} className="h-2" />
              <div className="text-xs text-muted-foreground mt-2">
                综合评分: 85/100
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Award className="mr-2 h-4 w-4 text-blue-500" />
              认证信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">实名认证</span>
                <Badge variant="default">已认证</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">星图达人</span>
                <Badge variant="default">已认证</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">蓝V认证</span>
                <Badge variant="secondary">未认证</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">MCN机构</span>
                <Badge variant="default">已签约</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            星图数据指标
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4.8</div>
              <div className="text-sm text-muted-foreground">内容质量评分</div>
              <Progress value={96} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4.6</div>
              <div className="text-sm text-muted-foreground">合作满意度</div>
              <Progress value={92} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4.9</div>
              <div className="text-sm text-muted-foreground">商业价值评分</div>
              <Progress value={98} className="h-2 mt-2" />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4 className="font-medium">合作历史记录</h4>
            <div className="space-y-3">
              {[
                { brand: "美妆品牌A", date: "2024-03", rating: 4.8 },
                { brand: "服装品牌B", date: "2024-02", rating: 4.6 },
                { brand: "食品品牌C", date: "2024-01", rating: 4.9 },
              ].map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <div className="font-medium">{record.brand}</div>
                    <div className="text-sm text-muted-foreground">
                      {record.date}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{record.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function DouyinKolAnalysis() {
  const { kolId } = useParams();
  const navigate = useNavigate();
  const [kolData, setKolData] = useState<DouyinInfluencer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取KOL数据
    const mockKolData: DouyinInfluencer = {
      id: kolId || "demo-kol",
      task_id: "task-12345",
      sec_user_id: "MS4wLjABAAAA...",
      unique_id: "fashionista_lily",
      nickname: "时尚达人Lily",
      avatar_url: "/placeholder.svg",
      signature: "分享时尚穿搭，传递美好生活",
      follower_count: 1580000,
      following_count: 1200,
      aweme_count: 456,
      total_favorited: 25800000,
      gender: 2,
      age: 28,
      ip_location: "北京",
      is_star: false,
      is_effect_artist: false,
      is_gov_media_vip: false,
      is_live_commerce: true,
      is_xingtu_kol: true,
      with_commerce_entry: true,
      with_fusion_shop_entry: true,
      with_new_goods: true,
      max_follower_count: 1600000,
      platform: "douyin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_url: "https://www.douyin.com/user/...",
    };

    setTimeout(() => {
      setKolData(mockKolData);
      setLoading(false);
    }, 1000);
  }, [kolId]);

  const handleBackClick = () => {
    navigate("/kol-search-analysis/douyin-search");
  };

  if (loading) {
    return (
      <DashboardLayout title="加载中..." subtitle="正在加载抖音KOL分析数据">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!kolData) {
    return (
      <DashboardLayout title="抖音KOL分析" subtitle="深度分析KOL数据表现">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">无法加载KOL数据</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            请从KOL搜索页面选择要分析的KOL。
          </p>
          <Button onClick={handleBackClick} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回搜索页面
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`${kolData.nickname} - 抖音KOL分析`}
      subtitle="深度���析KOL数据表现和商业价值"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="h-8"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            返回搜索
          </Button>
          <div className="flex items-center space-x-4">
            {!kolId && (
              <Badge variant="secondary" className="text-xs">
                📊 演示数据
              </Badge>
            )}
            <div className="text-sm text-muted-foreground">
              最后更新: {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        {/* KOL Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <AvatarImage
                src={kolData.avatar_url || ""}
                alt={kolData.nickname}
                fallbackText={kolData.nickname.charAt(0)}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-semibold">{kolData.nickname}</h2>
                  <Badge className="bg-red-100 text-red-800">🎤 抖音KOL</Badge>
                  {kolData.is_xingtu_kol && (
                    <Badge variant="secondary">
                      <Star className="mr-1 h-3 w-3" />
                      星图达人
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <div className="font-medium text-lg">
                      {formatNumber(kolData.follower_count)}
                    </div>
                    <div className="text-muted-foreground">粉丝数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {kolData.aweme_count}
                    </div>
                    <div className="text-muted-foreground">作品数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {formatNumber(kolData.total_favorited)}
                    </div>
                    <div className="text-muted-foreground">获赞总数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">A+</div>
                    <div className="text-muted-foreground">星图等��</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span>📍 {kolData.ip_location}</span>
                  <span>👤 {kolData.gender === 2 ? "女" : "男"}</span>
                  <span>🎂 {kolData.age}岁</span>
                  {kolData.is_live_commerce && <span>🛍️ 带货达人</span>}
                </div>

                {kolData.signature && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {kolData.signature}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="fantrends" className="w-full">
              <TabsList className="grid w-full grid-cols-6 rounded-none border-b">
                <TabsTrigger value="fantrends" className="rounded-none">
                  粉丝趋势分析
                </TabsTrigger>
                <TabsTrigger value="audience" className="rounded-none">
                  观众分析
                </TabsTrigger>
                <TabsTrigger value="pricing" className="rounded-none">
                  服务报价
                </TabsTrigger>
                <TabsTrigger value="video" className="rounded-none">
                  视频表现
                </TabsTrigger>
                <TabsTrigger value="performance" className="rounded-none">
                  达人表现
                </TabsTrigger>
                <TabsTrigger value="wordcloud" className="rounded-none">
                  热门词云
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="fantrends" className="mt-0">
                  <FanTrendsAnalysisTab />
                </TabsContent>

                <TabsContent value="audience" className="mt-0">
                  <AudienceAnalysisTab />
                </TabsContent>

                <TabsContent value="pricing" className="mt-0">
                  <ServicePricingTab />
                </TabsContent>

                <TabsContent value="video" className="mt-0">
                  <VideoPerformanceTab />
                </TabsContent>

                <TabsContent value="performance" className="mt-0">
                  <CreatorPerformanceTab />
                </TabsContent>

                <TabsContent value="wordcloud" className="mt-0">
                  <HotWordCloudTab />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
