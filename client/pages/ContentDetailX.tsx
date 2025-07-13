import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  Repeat,
  Eye,
  Calendar,
  User,
  ExternalLink,
  Copy,
  Download,
  FileText,
  Image,
  Video,
  Bookmark,
  Quote,
  Shield,
  AlertTriangle,
  BarChart3,
  Globe,
  Users,
  CheckCircle,
} from "lucide-react";

interface XPostData {
  id: string;
  task_id: string;
  tweet_id: string;
  created_time: string;
  like_count: number;
  status: string;
  text: string;
  retweet_count: number;
  bookmarks_count: number;
  quotes_count: number;
  replies_count: number;
  lang: string;
  view_count: number;
  sensitive: boolean;
  conversation_id: string;
  images_url?: string[];
  video_url?: string;
  author_rest_id: string;
  author_screen_name: string;
  author_avatar: string;
  author_blue_verified: boolean;
  author_follower_count: number;
  display_url?: string;
  expanded_url?: string;
  media_type?: string;
  created_at: string;
  updated_at: string;
}

export default function ContentDetailX() {
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<XPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if content data was passed via navigation state
    if (location.state?.contentData) {
      const contentData = location.state.contentData;
      
      // Map the API data to XPostData format
      const mappedData: XPostData = {
        id: contentData.id || "x_" + Date.now(),
        task_id: contentData.task_id || "",
        tweet_id: contentData.tweet_id || "",
        created_time: contentData.created_time || new Date().toISOString(),
        like_count: contentData.like_count || 0,
        status: contentData.status || "unknown",
        text: contentData.text || "无内容",
        retweet_count: contentData.retweet_count || 0,
        bookmarks_count: contentData.bookmarks_count || 0,
        quotes_count: contentData.quotes_count || 0,
        replies_count: contentData.replies_count || 0,
        lang: contentData.lang || "en",
        view_count: contentData.view_count || 0,
        sensitive: contentData.sensitive || false,
        conversation_id: contentData.conversation_id || "",
        images_url: contentData.images_url || [],
        video_url: contentData.video_url || "",
        author_rest_id: contentData.author_rest_id || "",
        author_screen_name: contentData.author_screen_name || "未知用户",
        author_avatar: contentData.author_avatar || "",
        author_blue_verified: contentData.author_blue_verified || false,
        author_follower_count: contentData.author_follower_count || 0,
        display_url: contentData.display_url || "",
        expanded_url: contentData.expanded_url || "",
        media_type: contentData.media_type || "",
        created_at: contentData.created_at || new Date().toISOString(),
        updated_at: contentData.updated_at || new Date().toISOString(),
      };
      
      setContent(mappedData);
      setLoading(false);
    } else {
      // Fallback to mock data if no data was passed
      setTimeout(() => {
        const mockData: XPostData = {
          id: "x_1",
          task_id: "task_001",
          tweet_id: "1750123456789012345",
          created_time: "2024-01-01T15:30:00Z",
          like_count: 15600,
          status: "published",
          text: "Just witnessed an incredible breakthrough in AI technology! The future is happening faster than we thought. This will change everything about how we interact with machines. #AI #Technology #Innovation #Future",
          retweet_count: 2840,
          bookmarks_count: 1250,
          quotes_count: 380,
          replies_count: 890,
          lang: "en",
          view_count: 125000,
          sensitive: false,
          conversation_id: "1750123456789012345",
          images_url: [
            "https://pbs.twimg.com/media/image1.jpg",
            "https://pbs.twimg.com/media/image2.jpg",
          ],
          video_url: "",
          author_rest_id: "1234567890123456789",
          author_screen_name: "TechInfluencer",
          author_avatar: "https://pbs.twimg.com/profile_images/avatar.jpg",
          author_blue_verified: true,
          author_follower_count: 856000,
          display_url: "tech-news.com/ai-breakthrough",
          expanded_url: "https://tech-news.com/ai-breakthrough-2024",
          media_type: "photo",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        };
        setContent(mockData);
        setLoading(false);
      }, 500);
    }
  }, [location.state]);

  if (loading) {
    return (
      <DashboardLayout title="X (Twitter) 详情" subtitle="加载中...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout title="X (Twitter) 详情" subtitle="推文不存在">
        <div className="text-center py-12">
          <p className="text-muted-foreground">找不到指定的 X (Twitter) 推文</p>
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
    const twitterUrl = `https://x.com/${content.author_screen_name}/status/${content.tweet_id}`;
    navigator.clipboard.writeText(twitterUrl);
    alert("链接已复制到剪贴板");
  };

  const getContentType = () => {
    if (content.video_url) {
      return { type: "视频", icon: Video, color: "text-red-500" };
    }
    if (content.images_url && content.images_url.length > 0) {
      return { type: "图文", icon: Image, color: "text-blue-500" };
    }
    return { type: "文字", icon: FileText, color: "text-gray-500" };
  };

  const contentType = getContentType();

  const extractHashtags = (text: string) => {
    const hashtagRegex = /#\w+/g;
    return text.match(hashtagRegex) || [];
  };

  const extractMentions = (text: string) => {
    const mentionRegex = /@\w+/g;
    return text.match(mentionRegex) || [];
  };

  const hashtags = content ? extractHashtags(content.text || "") : [];
  const mentions = content ? extractMentions(content.text || "") : [];

  const getEngagementRate = () => {
    if (!content) return 0;
    const totalEngagements =
      content.like_count +
      content.retweet_count +
      content.replies_count +
      content.quotes_count +
      content.bookmarks_count;
    return content.view_count > 0 ? (totalEngagements / content.view_count) * 100 : 0;
  };

  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      en: "英语",
      zh: "中文",
      es: "西班牙语",
      fr: "法语",
      de: "德语",
      ja: "日语",
      ko: "韩语",
      pt: "葡萄牙语",
      ru: "俄语",
      ar: "阿拉伯语",
    };
    return languages[code] || code;
  };

  return (
    <DashboardLayout
      title="X (Twitter) 详情"
      subtitle={content.text.slice(0, 50) + "..."}
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
                `https://x.com/${content.author_screen_name}/status/${content.tweet_id}`,
                "_blank",
              )
            }
            className="h-8"
          >
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            查看原推文
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
              X (Twitter) 推文信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 媒体预览 */}
              <div className="lg:col-span-1">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                  {content.images_url && content.images_url.length > 0 ? (
                    <img
                      src={content.images_url[0]}
                      alt="推文图片"
                      className="w-full h-full object-cover"
                    />
                  ) : content.video_url ? (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <Video className="h-16 w-16 text-white" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black text-white text-xs px-2 py-1 rounded">
                    X
                  </div>
                  {content.sensitive && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      敏感内容
                    </div>
                  )}
                </div>
              </div>

              {/* 推文详情 */}
              <div className="lg:col-span-3 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {contentType.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getLanguageName(content.lang)}
                    </Badge>
                    {content.sensitive && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        敏感内容
                      </Badge>
                    )}
                    <Badge
                      variant={
                        content.status === "published"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {content.status}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <p className="text-lg leading-relaxed mb-3">
                      {content.text}
                    </p>

                    {/* 标签和提及 */}
                    <div className="space-y-2">
                      {hashtags.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground mr-2">
                            话题:
                          </span>
                          <div className="inline-flex flex-wrap gap-1">
                            {hashtags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {mentions.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground mr-2">
                            提及:
                          </span>
                          <div className="inline-flex flex-wrap gap-1">
                            {mentions.map((mention, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {mention}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 数据统计 */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="h-4 w-4 mr-1 text-blue-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.view_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        查看次数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Heart className="h-4 w-4 mr-1 text-red-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.like_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        点赞数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Repeat className="h-4 w-4 mr-1 text-green-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.retweet_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        转推数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <MessageCircle className="h-4 w-4 mr-1 text-purple-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.replies_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        回复数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Quote className="h-4 w-4 mr-1 text-orange-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.quotes_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        引用转推
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Bookmark className="h-4 w-4 mr-1 text-yellow-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.bookmarks_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ���签数
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
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            @{content.author_screen_name}
                          </span>
                          {content.author_blue_verified && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {content.author_follower_count.toLocaleString()}{" "}
                          关注者
                        </div>
                        <div className="text-sm text-muted-foreground">
                          用户ID: {content.author_rest_id}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 链接信息 */}
                  {(content.display_url || content.expanded_url) && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        外部链接
                      </h3>
                      <div className="space-y-2 text-sm">
                        {content.display_url && (
                          <div>
                            <span className="text-muted-foreground">
                              显示链接:{" "}
                            </span>
                            <span>{content.display_url}</span>
                          </div>
                        )}
                        {content.expanded_url && (
                          <div>
                            <span className="text-muted-foreground">
                              完整链接:{" "}
                            </span>
                            <a
                              href={content.expanded_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {content.expanded_url}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 媒体资源 */}
                  {content.images_url && content.images_url.length > 1 && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Image className="mr-2 h-4 w-4" />
                        图片资源 ({content.images_url.length}张)
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {content.images_url.slice(0, 4).map((url, index) => (
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
                    </div>
                  )}

                  {/* 视频资源 */}
                  {content.video_url && content.video_url.trim() !== "" && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Video className="mr-2 h-4 w-4" />
                        视频资源
                      </h3>
                      <div className="text-sm">
                        <a
                          href={content.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {content.video_url}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* 其他属性 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      发布时间:{" "}
                      {/^\d+$/.test(content.created_time) ? new Date(parseInt(content.created_time)).toLocaleString("zh-CN") : new Date(content.created_time).toLocaleString("zh-CN")}
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      语言: {getLanguageName(content.lang)}
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      互动率: {getEngagementRate().toFixed(2)}%
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      对话ID: {content.conversation_id}
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
                    <span className="text-muted-foreground">推文ID: </span>
                    <span>{content.tweet_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">对话ID: </span>
                    <span>{content.conversation_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">作者ID: </span>
                    <span>{content.author_rest_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">状态: </span>
                    <span>{content.status}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">语言: </span>
                    <span>
                      {content.lang} ({getLanguageName(content.lang)})
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">敏感内容: </span>
                    <span>{content.sensitive ? "是" : "否"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">媒体类型: </span>
                    <span>{content.media_type || "无"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">蓝V认证: </span>
                    <span>
                      {content.author_blue_verified ? "已认证" : "未认证"}
                    </span>
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
                  {content.images_url && content.images_url.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <Image className="mr-2 h-4 w-4" />
                        图片资源 ({content.images_url.length}张)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {content.images_url.map((url, index) => (
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
                  {content.video_url && content.video_url.trim() !== "" && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <Video className="mr-2 h-4 w-4" />
                        视频资源
                      </h4>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <a
                          href={content.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {content.video_url}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* 外部链接 */}
                  {(content.display_url || content.expanded_url) && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        外部链接
                      </h4>
                      <div className="space-y-2">
                        {content.display_url && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">
                              显示链接
                            </div>
                            <div className="break-all">
                              {content.display_url}
                            </div>
                          </div>
                        )}
                        {content.expanded_url && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">
                              完整链接
                            </div>
                            <a
                              href={content.expanded_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {content.expanded_url}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 无媒体资源 */}
                  {(!content.images_url || content.images_url.length === 0) &&
                    (!content.video_url || content.video_url.trim() === "") &&
                    !content.display_url &&
                    !content.expanded_url && (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2" />
                        <p>此推文仅包含文字内容</p>
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {(
                        (content.like_count / content.view_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">点赞率</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(
                        (content.retweet_count / content.view_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">转推率</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(
                        (content.replies_count / content.view_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">回复率</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {(
                        (content.quotes_count / content.view_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      引用转推率
                    </div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {(
                        (content.bookmarks_count / content.view_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">收藏率</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {getEngagementRate().toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      总互动率
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">互动分布</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">查看次数</span>
                        <span className="text-sm font-medium">
                          {content.view_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">点赞数</span>
                        <span className="text-sm font-medium">
                          {content.like_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (content.like_count /
                            Math.max(
                              content.like_count,
                              content.retweet_count,
                              content.replies_count,
                              content.quotes_count,
                              content.bookmarks_count,
                            )) *
                          100
                        }
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">转推数</span>
                        <span className="text-sm font-medium">
                          {content.retweet_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (content.retweet_count /
                            Math.max(
                              content.like_count,
                              content.retweet_count,
                              content.replies_count,
                              content.quotes_count,
                              content.bookmarks_count,
                            )) *
                          100
                        }
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">回复数</span>
                        <span className="text-sm font-medium">
                          {content.replies_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (content.replies_count /
                            Math.max(
                              content.like_count,
                              content.retweet_count,
                              content.replies_count,
                              content.quotes_count,
                              content.bookmarks_count,
                            )) *
                          100
                        }
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">引用转推</span>
                        <span className="text-sm font-medium">
                          {content.quotes_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (content.quotes_count /
                            Math.max(
                              content.like_count,
                              content.retweet_count,
                              content.replies_count,
                              content.quotes_count,
                              content.bookmarks_count,
                            )) *
                          100
                        }
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">书签数</span>
                        <span className="text-sm font-medium">
                          {content.bookmarks_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (content.bookmarks_count /
                            Math.max(
                              content.like_count,
                              content.retweet_count,
                              content.replies_count,
                              content.quotes_count,
                              content.bookmarks_count,
                            )) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                {content.sensitive && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center text-red-600">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      敏感内容提醒
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      该推文被标记为敏感内容，可能会影响传播范围和互动数据。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
