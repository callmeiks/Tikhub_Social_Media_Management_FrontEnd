import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  MapPin,
  User,
  ExternalLink,
  Copy,
  Download,
  FileText,
  Image,
  Video,
  Edit3,
  Type,
  BarChart3,
  Repeat,
} from "lucide-react";

interface WeiboPostData {
  id: string;
  task_id: string;
  create_time: string;
  post_id: string;
  mblogid: string;
  author_id: string;
  author_screen_name: string;
  author_avatar: string;
  edit_count: number;
  text_length: number;
  pic_num: number;
  reposts_count: number;
  comments_count: number;
  attitudes_count: number;
  is_long_text: boolean;
  title: string;
  text_raw: string;
  region_name: string;
  video_play_urls?: string[];
  images_urls?: string[];
  created_at: string;
  updated_at: string;
}

export default function ContentDetailWeibo() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<WeiboPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      // Mock data for Weibo post
      const mockData: WeiboPostData = {
        id: "weibo_1",
        task_id: "task_001",
        create_time: "2024-01-01 15:30:00",
        post_id: "4987654321098765",
        mblogid: "Nxyz123456789",
        author_id: "1234567890",
        author_screen_name: "科技评论家",
        author_avatar: "https://wx1.sinaimg.cn/large/123456.jpg",
        edit_count: 2,
        text_length: 280,
        pic_num: 3,
        reposts_count: 1520,
        comments_count: 456,
        attitudes_count: 8900,
        is_long_text: false,
        title: "",
        text_raw:
          "今天的科技新闻真是让人眼花缭乱！AI技术的发展速度超出了所有人的预期，特别是在自然语言处理和图像识别方面的突破。这些技术正在深刻改变我们的生活方式，从智能助手到自动驾驶，无处不在。#科技 #人工智能 #未来",
        region_name: "北京",
        video_play_urls: [],
        images_urls: [
          "https://wx1.sinaimg.cn/large/image1.jpg",
          "https://wx1.sinaimg.cn/large/image2.jpg",
          "https://wx1.sinaimg.cn/large/image3.jpg",
        ],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };
      setContent(mockData);
      setLoading(false);
    }, 500);
  }, [contentId]);

  if (loading) {
    return (
      <DashboardLayout title="微博详情" subtitle="加载中...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout title="微博详情" subtitle="微博不存在">
        <div className="text-center py-12">
          <p className="text-muted-foreground">找不到指定的微博</p>
          <Button
            onClick={() => navigate(-1)}
            className="mt-4"
            variant="outline"
          >
            返回
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleCopyUrl = () => {
    const weiboUrl = `https://weibo.com/${content.author_id}/${content.mblogid}`;
    navigator.clipboard.writeText(weiboUrl);
    alert("链接已复制到剪贴板");
  };

  const getContentType = () => {
    if (content.video_play_urls && content.video_play_urls.length > 0) {
      return { type: "视频", icon: Video, color: "text-red-500" };
    }
    if (content.images_urls && content.images_urls.length > 0) {
      return { type: "图文", icon: Image, color: "text-blue-500" };
    }
    return { type: "文字", icon: FileText, color: "text-gray-500" };
  };

  const contentType = getContentType();

  const extractHashtags = (text: string) => {
    const hashtagRegex = /#([^#\s]+)#/g;
    const matches = [];
    let match;
    while ((match = hashtagRegex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  };

  const hashtags = extractHashtags(content.text_raw);

  return (
    <DashboardLayout
      title="微博详情"
      subtitle={content.text_raw.slice(0, 50) + "..."}
      actions={
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/data-collection/content-interaction")}
            className="h-8"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            返回作品列表
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className="h-8"
          >
            <Copy className="mr-2 h-3.5 w-3.5" />
            复制链接
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                `https://weibo.com/${content.author_id}/${content.mblogid}`,
                "_blank",
              )
            }
            className="h-8"
          >
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            查看原微博
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 作品基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <contentType.icon
                className={`mr-2 h-5 w-5 ${contentType.color}`}
              />
              微博信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 媒体预览 */}
              <div className="lg:col-span-1">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                  {content.images_urls && content.images_urls.length > 0 ? (
                    <img
                      src={content.images_urls[0]}
                      alt="微博图片"
                      className="w-full h-full object-cover"
                    />
                  ) : content.video_play_urls &&
                    content.video_play_urls.length > 0 ? (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <Video className="h-16 w-16 text-white" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    微博
                  </div>
                  {content.is_long_text && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      长文
                    </div>
                  )}
                </div>
              </div>

              {/* 微博详情 */}
              <div className="lg:col-span-3 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {content.title && (
                      <h1 className="text-2xl font-bold">{content.title}</h1>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {contentType.type}
                    </Badge>
                    {content.is_long_text && (
                      <Badge variant="secondary" className="text-xs">
                        长微博
                      </Badge>
                    )}
                    {content.edit_count > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Edit3 className="mr-1 h-3 w-3" />
                        已编辑 {content.edit_count} 次
                      </Badge>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-lg leading-relaxed mb-3">
                      {content.text_raw}
                    </p>

                    {/* 话题标签 */}
                    {hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {hashtags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 数据统计 */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Heart className="h-4 w-4 mr-1 text-red-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.attitudes_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        点赞数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <MessageCircle className="h-4 w-4 mr-1 text-green-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.comments_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        评论数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Repeat className="h-4 w-4 mr-1 text-blue-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.reposts_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        转发数
                      </div>
                    </div>
                  </div>

                  {/* 作者信息 */}
                  <div className="p-4 bg-muted/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">作者信息</h3>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={content.author_avatar}
                          alt={content.author_screen_name}
                        />
                        <AvatarFallback>
                          {content.author_screen_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {content.author_screen_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          用户ID: {content.author_id}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 内容统计 */}
                  <div className="p-4 bg-muted/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Type className="mr-2 h-4 w-4" />
                      内容统计
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {content.text_length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          字符数
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">
                          {content.pic_num}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          图片数
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">
                          {content.video_play_urls?.length || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          视频数
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">
                          {content.edit_count}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          编辑次数
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 媒体资源 */}
                  {content.images_urls && content.images_urls.length > 1 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Image className="mr-2 h-4 w-4" />
                        图片资源 ({content.images_urls.length}张)
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {content.images_urls.slice(0, 6).map((url, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded bg-muted overflow-hidden"
                          >
                            <img
                              src={url}
                              alt={`图片 ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      {content.images_urls.length > 6 && (
                        <div className="text-xs text-muted-foreground mt-2">
                          还有 {content.images_urls.length - 6} 张图片...
                        </div>
                      )}
                    </div>
                  )}

                  {/* 视频资源 */}
                  {content.video_play_urls &&
                    content.video_play_urls.length > 0 && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Video className="mr-2 h-4 w-4" />
                          视频资源 ({content.video_play_urls.length}个)
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          包含 {content.video_play_urls.length} 个视频文件
                        </div>
                      </div>
                    )}

                  {/* 其他属性 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      发布时间: {content.create_time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      地理位置: {content.region_name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for additional information */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="media">媒体资源</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>技术信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">任务ID: </span>
                    <span>{content.task_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">微博ID: </span>
                    <span>{content.post_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">MBlog ID: </span>
                    <span>{content.mblogid}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">作者ID: </span>
                    <span>{content.author_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">文本长度: </span>
                    <span>{content.text_length} 字符</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">图片数量: </span>
                    <span>{content.pic_num} 张</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">编辑次数: </span>
                    <span>{content.edit_count} 次</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">长文本: </span>
                    <span>{content.is_long_text ? "是" : "否"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">地理位置: </span>
                    <span>{content.region_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">创建时间: </span>
                    <span>
                      {new Date(content.created_at).toLocaleString("zh-CN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">更新时间: </span>
                    <span>
                      {new Date(content.updated_at).toLocaleString("zh-CN")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>媒体资源详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 图片资源 */}
                  {content.images_urls && content.images_urls.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <Image className="mr-2 h-4 w-4" />
                        图片资源 ({content.images_urls.length}张)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {content.images_urls.map((url, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg overflow-hidden bg-muted relative"
                          >
                            <img
                              src={url}
                              alt={`图片 ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 视频资源 */}
                  {content.video_play_urls &&
                    content.video_play_urls.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <Video className="mr-2 h-4 w-4" />
                          视频资源 ({content.video_play_urls.length}个)
                        </h4>
                        <div className="space-y-2">
                          {content.video_play_urls.map((url, index) => (
                            <div
                              key={index}
                              className="p-3 bg-muted/30 rounded-lg flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <Video className="h-4 w-4 mr-2 text-red-500" />
                                <span className="text-sm">
                                  视频 {index + 1}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(url, "_blank")}
                              >
                                查看
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 无媒体资源 */}
                  {(!content.images_urls || content.images_urls.length === 0) &&
                    (!content.video_play_urls ||
                      content.video_play_urls.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2" />
                        <p>此微博仅包含文字内容</p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>数据分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {(
                        (content.attitudes_count /
                          (content.attitudes_count +
                            content.comments_count +
                            content.reposts_count)) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      点赞占比
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(
                        (content.comments_count /
                          (content.attitudes_count +
                            content.comments_count +
                            content.reposts_count)) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      评论占比
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(
                        (content.reposts_count /
                          (content.attitudes_count +
                            content.comments_count +
                            content.reposts_count)) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      转发占比
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(content.text_length / (content.pic_num || 1))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      字图比例
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {content.attitudes_count +
                        content.comments_count +
                        content.reposts_count}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      总互动数
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">互动分布</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">点赞数</span>
                        <span className="text-sm font-medium">
                          {content.attitudes_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (content.attitudes_count /
                            Math.max(
                              content.attitudes_count,
                              content.comments_count,
                              content.reposts_count,
                            )) *
                          100
                        }
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">转发数</span>
                        <span className="text-sm font-medium">
                          {content.reposts_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (content.reposts_count /
                            Math.max(
                              content.attitudes_count,
                              content.comments_count,
                              content.reposts_count,
                            )) *
                          100
                        }
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">评论数</span>
                        <span className="text-sm font-medium">
                          {content.comments_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (content.comments_count /
                            Math.max(
                              content.attitudes_count,
                              content.comments_count,
                              content.reposts_count,
                            )) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
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
