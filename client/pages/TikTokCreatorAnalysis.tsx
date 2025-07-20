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
  Globe,
} from "lucide-react";
import { apiClient, type TikTokInfluencer } from "@/lib/api";
import { AvatarImage } from "@/components/ui/avatar-image";

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

// 粉丝&观众分析组件
const FanAudienceAnalysisTab: React.FC = () => {
  const fanGenderData = [
    { label: "Male", value: 42.8, color: "bg-blue-500" },
    { label: "Female", value: 57.2, color: "bg-pink-500" },
  ];

  const fanAgeData = [
    { label: "13-17", value: 28.4, color: "bg-green-500" },
    { label: "18-24", value: 45.2, color: "bg-blue-500" },
    { label: "25-34", value: 20.6, color: "bg-orange-500" },
    { label: "35+", value: 5.8, color: "bg-gray-500" },
  ];

  const topCountries = [
    { country: "United States", percentage: 35.2, flag: "🇺🇸" },
    { country: "United Kingdom", percentage: 12.8, flag: "🇬🇧" },
    { country: "Canada", percentage: 8.9, flag: "🇨🇦" },
    { country: "Australia", percentage: 6.4, flag: "🇦🇺" },
    { country: "Germany", percentage: 5.2, flag: "🇩🇪" },
    { country: "France", percentage: 4.7, flag: "🇫🇷" },
    { country: "Brazil", percentage: 4.1, flag: "🇧🇷" },
    { country: "India", percentage: 3.8, flag: "🇮🇳" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 性别分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Gender Distribution
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
              Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fanAgeData.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.label} years</span>
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
            <Globe className="mr-2 h-4 w-4" />
            Top Countries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topCountries.map((item, index) => (
              <div key={item.country} className="text-center">
                <div className="text-2xl mb-1">{item.flag}</div>
                <div className="text-lg font-semibold">
                  {formatPercentage(item.percentage)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.country}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 观众活跃时间 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Audience Activity & Growth Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+85K</div>
              <div className="text-sm text-muted-foreground">Weekly Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">+320K</div>
              <div className="text-sm text-muted-foreground">
                Monthly Growth
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">+18.5%</div>
              <div className="text-sm text-muted-foreground">Growth Rate</div>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Growth Trend Chart</p>
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
    {
      type: "Brand Partnership",
      price: "$25K-$75K",
      desc: "Integrated brand content (15-60s videos)",
    },
    {
      type: "Product Placement",
      price: "$15K-$40K",
      desc: "Product showcase in regular content",
    },
    {
      type: "Live Stream",
      price: "$30K-$80K",
      desc: "Live streaming collaboration (2-3 hours)",
    },
    {
      type: "Campaign Series",
      price: "$50K-$150K",
      desc: "Multi-video campaign package",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Service Pricing
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
                  <div className="text-xs text-muted-foreground">
                    Estimated Price
                  </div>
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
            Recent Collaborations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">Fashion Brand A</div>
                <Badge variant="secondary">March 2024</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                30-second fashion showcase video, achieved 3.2M views and 285K
                likes
              </p>
              <div className="flex space-x-4 text-sm">
                <span>Views: 3.2M</span>
                <span>Likes: 285K</span>
                <span>Comments: 52K</span>
                <span>Shares: 18K</span>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">Tech Brand B</div>
                <Badge variant="secondary">February 2024</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Product review and unboxing video, generated 2.8M views with
                4.2% engagement rate
              </p>
              <div className="flex space-x-4 text-sm">
                <span>Views: 2.8M</span>
                <span>Engagement: 4.2%</span>
                <span>Click-through: 2.1%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 性价比&转化率组件
const ROIConversionTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Avg. Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">4.2%</div>
              <div className="text-sm text-muted-foreground">
                Above industry avg by 1.8%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              CPM Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">$12.5</div>
              <div className="text-sm text-muted-foreground">
                Cost per thousand views
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Target className="mr-2 h-4 w-4" />
              ROI Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">5.8</div>
              <div className="text-sm text-muted-foreground">
                Return on investment
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <PieChart className="mr-2 h-4 w-4" />
            Category Conversion Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { category: "Fashion & Beauty", rate: 3.8, sales: "$145K" },
              { category: "Tech & Electronics", rate: 4.2, sales: "$89K" },
              { category: "Lifestyle Products", rate: 3.1, sales: "$67K" },
              { category: "Food & Beverage", rate: 2.9, sales: "$52K" },
            ].map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div>
                  <div className="font-medium">{item.category}</div>
                  <div className="text-sm text-muted-foreground">
                    Sales: {item.sales}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{item.rate}%</div>
                  <div className="text-xs text-muted-foreground">
                    Conversion Rate
                  </div>
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
              <div className="text-2xl font-bold">2.8M</div>
              <div className="text-sm text-muted-foreground">Avg Views</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">185K</div>
              <div className="text-sm text-muted-foreground">Avg Likes</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">12.5K</div>
              <div className="text-sm text-muted-foreground">Avg Comments</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Share2 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">8.2K</div>
              <div className="text-sm text-muted-foreground">Avg Shares</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Top Performing Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video Title</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Completion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  title: "Morning Routine That Changed My Life",
                  date: "2024-03-15",
                  views: "4.2M",
                  likes: "325K",
                  comments: "18.5K",
                  completion: "78%",
                },
                {
                  title: "Fashion Haul: Spring Collection",
                  date: "2024-03-12",
                  views: "3.8M",
                  likes: "298K",
                  comments: "15.2K",
                  completion: "72%",
                },
                {
                  title: "Travel Vlog: Tokyo Adventures",
                  date: "2024-03-08",
                  views: "3.1M",
                  likes: "245K",
                  comments: "12.8K",
                  completion: "85%",
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
                        parseInt(video.completion) > 75
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

// Creator Fund指标组件
const CreatorFundMetricsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Star className="mr-2 h-4 w-4 text-yellow-500" />
              Creator Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                Gold
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                Elite Creator
              </div>
              <Progress value={92} className="h-2" />
              <div className="text-xs text-muted-foreground mt-2">
                Overall Score: 92/100
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Award className="mr-2 h-4 w-4 text-blue-500" />
              Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Verified</span>
                <Badge variant="default">✓ Verified</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Creator Fund</span>
                <Badge variant="default">✓ Eligible</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Business Account</span>
                <Badge variant="default">✓ Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Partnership Program</span>
                <Badge variant="default">✓ Approved</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4.9</div>
              <div className="text-sm text-muted-foreground">
                Content Quality
              </div>
              <Progress value={98} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4.7</div>
              <div className="text-sm text-muted-foreground">
                Audience Engagement
              </div>
              <Progress value={94} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4.8</div>
              <div className="text-sm text-muted-foreground">
                Brand Safety Score
              </div>
              <Progress value={96} className="h-2 mt-2" />
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4 className="font-medium">Partnership History</h4>
            <div className="space-y-3">
              {[
                {
                  brand: "Nike",
                  date: "2024-03",
                  rating: 4.9,
                  type: "Fashion",
                },
                { brand: "Apple", date: "2024-02", rating: 4.8, type: "Tech" },
                {
                  brand: "Coca-Cola",
                  date: "2024-01",
                  rating: 4.7,
                  type: "F&B",
                },
              ].map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <div className="font-medium">{record.brand}</div>
                    <div className="text-sm text-muted-foreground">
                      {record.date} • {record.type}
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

export default function TikTokCreatorAnalysis() {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [creatorData, setCreatorData] = useState<TikTokInfluencer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取Creator数据
    const mockCreatorData: TikTokInfluencer = {
      id: creatorId || "demo-creator",
      task_id: "task-12345",
      sec_user_id: "MS4wLjABAAAA...",
      unique_id: "lifestyle_sarah",
      nickname: "Sarah Johnson",
      avatar_url: "/placeholder.svg",
      signature: "Lifestyle creator sharing daily inspiration ✨ NYC 🗽",
      follower_count: 4800000,
      following_count: 892,
      aweme_count: 1245,
      total_favorited: 128000000,
      region: "United States",
      language: "English",
      is_verified: true,
      is_live_open: true,
      platform: "tiktok",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_url: "https://www.tiktok.com/@lifestyle_sarah",
    };

    setTimeout(() => {
      setCreatorData(mockCreatorData);
      setLoading(false);
    }, 1000);
  }, [creatorId]);

  const handleBackClick = () => {
    navigate("/kol-search-analysis/tiktok-search");
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Loading..."
        subtitle="Loading TikTok Creator Analysis"
      >
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!creatorData) {
    return (
      <DashboardLayout
        title="TikTok Creator Analysis"
        subtitle="In-depth creator performance and value analysis"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">
            Unable to load creator data
          </h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Please select a creator from the search page to analyze.
          </p>
          <Button onClick={handleBackClick} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`${creatorData.nickname} - TikTok Creator Analysis`}
      subtitle="In-depth creator performance and commercial value analysis"
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
            Back to Search
          </Button>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Creator Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <AvatarImage
                src={creatorData.avatar_url || ""}
                alt={creatorData.nickname}
                fallbackText={creatorData.nickname.charAt(0)}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-semibold">
                    {creatorData.nickname}
                  </h2>
                  <Badge className="bg-black text-white">🎵 TikTok</Badge>
                  {creatorData.is_verified && (
                    <Badge variant="secondary">
                      <UserCheck className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <div className="font-medium text-lg">
                      {formatNumber(creatorData.follower_count)}
                    </div>
                    <div className="text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {creatorData.aweme_count}
                    </div>
                    <div className="text-muted-foreground">Videos</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {formatNumber(creatorData.total_favorited)}
                    </div>
                    <div className="text-muted-foreground">Total Likes</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">Gold</div>
                    <div className="text-muted-foreground">Creator Level</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span>🌍 {creatorData.region}</span>
                  <span>🗣️ {creatorData.language}</span>
                  <span>@{creatorData.unique_id}</span>
                  {creatorData.is_live_open && <span>🔴 Live Enabled</span>}
                </div>

                {creatorData.signature && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {creatorData.signature}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="fans" className="w-full">
              <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
                <TabsTrigger value="fans" className="rounded-none">
                  Fans & Audience
                </TabsTrigger>
                <TabsTrigger value="pricing" className="rounded-none">
                  Service Pricing
                </TabsTrigger>
                <TabsTrigger value="roi" className="rounded-none">
                  ROI & Conversion
                </TabsTrigger>
                <TabsTrigger value="video" className="rounded-none">
                  Video Performance
                </TabsTrigger>
                <TabsTrigger value="fund" className="rounded-none">
                  Creator Fund
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="fans" className="mt-0">
                  <FanAudienceAnalysisTab />
                </TabsContent>

                <TabsContent value="pricing" className="mt-0">
                  <ServicePricingTab />
                </TabsContent>

                <TabsContent value="roi" className="mt-0">
                  <ROIConversionTab />
                </TabsContent>

                <TabsContent value="video" className="mt-0">
                  <VideoPerformanceTab />
                </TabsContent>

                <TabsContent value="fund" className="mt-0">
                  <CreatorFundMetricsTab />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
