import { useState, useEffect } from "react";
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
import {
  ArrowLeft,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Play,
  ExternalLink,
  Calendar,
  TrendingUp,
  Video,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

// Mock data - in real app this would come from API
const mockAccountDetails = {
  id: 1,
  name: "美妆达人小丽",
  platform: "抖音",
  profileUrl: "https://www.douyin.com/user/123456",
  avatar: "/api/placeholder/80/80",
  followers: "156.8万",
  following: "128",
  addedAt: "2024-01-15 14:30",
  totalWorks: 127,
  totalLikes: "2340万",
  totalComments: "45.6万",
  totalShares: "12.3万",
  verified: true,
  bio: "专业美妆达人 | 护肤分享 | 合作私信",
  location: "上海",
  collectWorksEnabled: true,
  works: [
    {
      id: 1,
      title: "超火的韩式裸妆教程！新手必看",
      publishedAt: "2024-01-20",
      likes: "15.6万",
      comments: "3.2万",
      shares: "8.5千",
      views: "230万",
      url: "https://www.douyin.com/video/123",
      thumbnail: "/api/placeholder/120/120",
      duration: "2:35",
    },
    {
      id: 2,
      title: "5分钟快速护肤步骤分享",
      publishedAt: "2024-01-18",
      likes: "12.3万",
      comments: "2.8万",
      shares: "6.2千",
      views: "180万",
      url: "https://www.douyin.com/video/124",
      thumbnail: "/api/placeholder/120/120",
      duration: "1:58",
    },
    {
      id: 3,
      title: "平价好用的唇釉推荐 💄",
      publishedAt: "2024-01-16",
      likes: "9.8万",
      comments: "1.9万",
      shares: "4.1千",
      views: "145万",
      url: "https://www.douyin.com/video/125",
      thumbnail: "/api/placeholder/120/120",
      duration: "3:12",
    },
    {
      id: 4,
      title: "冬日妆容搭配技巧",
      publishedAt: "2024-01-14",
      likes: "11.2万",
      comments: "2.5万",
      shares: "5.3千",
      views: "165万",
      url: "https://www.douyin.com/video/126",
      thumbnail: "/api/placeholder/120/120",
      duration: "2:48",
    },
    {
      id: 5,
      title: "眼妆新手入门教程",
      publishedAt: "2024-01-12",
      likes: "13.7万",
      comments: "3.1万",
      shares: "7.2千",
      views: "195万",
      url: "https://www.douyin.com/video/127",
      thumbnail: "/api/placeholder/120/120",
      duration: "4:15",
    },
  ],
};

export default function AccountDetails() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState(mockAccountDetails);
  const [currentPage, setCurrentPage] = useState(1);
  const worksPerPage = 10;

  const handleBackClick = () => {
    navigate("/data-collection/account-interaction");
  };

  const formatNumber = (num: string) => {
    return num;
  };

  const getPlatformBadge = (platform: string) => {
    const platformConfig = {
      抖音: { color: "bg-red-100 text-red-800", emoji: "🎤" },
      小红书: { color: "bg-pink-100 text-pink-800", emoji: "📖" },
      快手: { color: "bg-blue-100 text-blue-800", emoji: "⚡" },
      TikTok: { color: "bg-purple-100 text-purple-800", emoji: "🎵" },
    };
    const config = platformConfig[platform] || {
      color: "bg-gray-100 text-gray-800",
      emoji: "📱",
    };

    return (
      <Badge className={config.color}>
        {config.emoji} {platform}
      </Badge>
    );
  };

  const totalPages = Math.ceil(accountData.works.length / worksPerPage);
  const currentWorks = accountData.works.slice(
    (currentPage - 1) * worksPerPage,
    currentPage * worksPerPage,
  );

  return (
    <DashboardLayout
      title={`${accountData.name} - 账号详情`}
      subtitle="账号数据详情及作品分析"
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackClick}
          className="h-8"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5" />
          返回列表
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Account Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {accountData.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-semibold">{accountData.name}</h2>
                  {accountData.verified && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                  {getPlatformBadge(accountData.platform)}
                </div>
                <p className="text-muted-foreground mb-3">{accountData.bio}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-lg">
                      {accountData.followers}
                    </div>
                    <div className="text-muted-foreground">粉丝数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {accountData.following}
                    </div>
                    <div className="text-muted-foreground">关注数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {accountData.totalWorks}
                    </div>
                    <div className="text-muted-foreground">作品数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {accountData.totalLikes}
                    </div>
                    <div className="text-muted-foreground">获赞总数</div>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>添加时间</div>
                <div>{accountData.addedAt}</div>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(accountData.profileUrl, "_blank")
                    }
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    访问主页
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-sm text-muted-foreground">总播放量</div>
                  <div className="text-lg font-semibold">2,580万</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <div>
                  <div className="text-sm text-muted-foreground">总点赞数</div>
                  <div className="text-lg font-semibold">
                    {accountData.totalLikes}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-sm text-muted-foreground">总评论数</div>
                  <div className="text-lg font-semibold">
                    {accountData.totalComments}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Share2 className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-sm text-muted-foreground">总分享数</div>
                  <div className="text-lg font-semibold">
                    {accountData.totalShares}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Works Section */}
        {accountData.collectWorksEnabled ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center">
                  <Video className="mr-2 h-4 w-4" />
                  作品数据 ({accountData.works.length})
                </span>
                <Badge variant="secondary" className="text-xs">
                  最新 {accountData.works.length} 个作品
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">作品信息</TableHead>
                      <TableHead className="w-[120px]">发布时间</TableHead>
                      <TableHead className="w-[100px]">播放量</TableHead>
                      <TableHead className="w-[100px]">点赞数</TableHead>
                      <TableHead className="w-[100px]">评论数</TableHead>
                      <TableHead className="w-[100px]">分享数</TableHead>
                      <TableHead className="w-[80px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentWorks.map((work) => (
                      <TableRow key={work.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-12 rounded bg-gray-200 flex items-center justify-center">
                              <Play className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                              <div
                                className="max-w-[200px] truncate font-medium"
                                title={work.title}
                              >
                                {work.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                时长: {work.duration}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {work.publishedAt}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1 text-blue-500" />
                            {work.views}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center">
                            <Heart className="h-3 w-3 mr-1 text-red-500" />
                            {work.likes}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1 text-green-500" />
                            {work.comments}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center">
                            <Share2 className="h-3 w-3 mr-1 text-purple-500" />
                            {work.shares}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(work.url, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    显示第 {(currentPage - 1) * worksPerPage + 1} 到{" "}
                    {Math.min(
                      currentPage * worksPerPage,
                      accountData.works.length,
                    )}{" "}
                    项， 共 {accountData.works.length} 项
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      上一页
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">未采集作品数据</h3>
              <p className="text-muted-foreground">
                该账号未开启作品数据采集，仅显示账号基本信息
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
