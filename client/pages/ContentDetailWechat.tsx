import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import ReactMarkdown from "react-markdown";
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
  Eye,
  Calendar,
  User,
  ExternalLink,
  Copy,
  Download,
  FileText,
  Bookmark,
  Image,
  BarChart3,
  Type,
  Quote,
  Link,
} from "lucide-react";

interface WechatArticleData {
  id: string;
  task_id: string;
  title: string;
  author: string;
  publish_type: string;
  publish_source: string;
  author_user_id: string;
  summary: string;
  full_text: string;
  images_url: string[];
  word_count: number;
  image_count: number;
  has_reference: boolean;
  read_count: number;
  like_count: number;
  old_like_count: number;
  comment_count: number;
  collect_count: number;
  share_count: number;
  article_url: string;
  created_at: string;
  updated_at: string;
}

export default function ContentDetailWechat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState<WechatArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if content data was passed via navigation state
    if (location.state?.contentData) {
      const contentData = location.state.contentData;

      // Map the API data to WechatArticleData format
      const mappedData: WechatArticleData = {
        id: contentData.id,
        task_id: contentData.task_id,
        title: contentData.title,
        author: contentData.author,
        publish_type: contentData.publish_type,
        publish_source: contentData.publish_source,
        author_user_id: contentData.author_user_id,
        summary: contentData.summary,
        full_text: contentData.full_text,
        images_url: contentData.images_url || [],
        word_count: contentData.word_count,
        image_count: contentData.image_count,
        has_reference: contentData.has_reference,
        read_count: contentData.read_count,
        like_count: contentData.like_count,
        old_like_count: contentData.old_like_count,
        comment_count: contentData.comment_count,
        collect_count: contentData.collect_count,
        share_count: contentData.share_count,
        article_url: contentData.article_url,
        created_at: contentData.created_at,
        updated_at: contentData.updated_at,
      };

      setContent(mappedData);
      setLoading(false);
    } else {
      // Fallback to mock data if no data was passed
      setTimeout(() => {
        const mockData: WechatArticleData = {
          id: "wechat_1",
          task_id: "task_001",
          title: "深度解析：2024年互联网行业发展趋势与机遇",
          author: "科技观察者",
          publish_type: "原创",
          publish_source: "科技前沿",
          author_user_id: "gh_123456789abc",
          summary:
            "本文深入分析了2024年互联网行���的发展趋势，包括人工智能、元宇宙、Web3等前沿技术的应用场景和市场机遇。",
          full_text:
            "随着技术的不断发展，2024年互联网行业正在经历前所未有的变革。人工智能技术的普及应用，为各行各业带来了新的发展机遇...",
          images_url: [
            "https://mmbiz.qpic.cn/mmbiz_jpg/123456/640",
            "https://mmbiz.qpic.cn/mmbiz_jpg/789012/640",
          ],
          word_count: 3500,
          image_count: 8,
          has_reference: true,
          read_count: 25600,
          like_count: 1250,
          old_like_count: 1180,
          comment_count: 89,
          collect_count: 456,
          share_count: 123,
          article_url:
            "https://mp.weixin.qq.com/s/abcdefghijklmnopqrstuvwxyz123456",
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
      <DashboardLayout title="微信文章详情" subtitle="加载中...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!content) {
    return (
      <DashboardLayout title="微信文章详情" subtitle="文章不存在">
        <div className="text-center py-12">
          <p className="text-muted-foreground">找不到指定的微信文章</p>
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
    navigator.clipboard.writeText(content.article_url);
    alert("链接已复制到剪贴板");
  };

  const getPublishTypeColor = (type: string) => {
    switch (type) {
      case "原创":
        return "bg-green-100 text-green-800 border-green-200";
      case "转载":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "翻译":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getReadingTime = (wordCount: number) => {
    // 平均阅读速度约250字/分钟
    const minutes = Math.ceil(wordCount / 250);
    return `${minutes}分钟`;
  };

  return (
    <DashboardLayout
      title="微信文章详情"
      subtitle={content.title}
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
            onClick={() => window.open(content.article_url, "_blank")}
            className="h-8"
          >
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            查看原文章
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 作品基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              微信文章信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 文章封面预览 */}
              <div className="lg:col-span-1">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted relative">
                  {content.images_url && content.images_url.length > 0 ? (
                    <img
                      src={content.images_url[0]}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    微信公众号
                  </div>
                </div>
              </div>

              {/* 文章详情 */}
              <div className="lg:col-span-3 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{content.title}</h1>
                    <Badge
                      variant="outline"
                      className={getPublishTypeColor(content.publish_type)}
                    >
                      {content.publish_type}
                    </Badge>
                    {content.has_reference && (
                      <Badge variant="outline" className="text-xs">
                        <Quote className="mr-1 h-3 w-3" />
                        有引用
                      </Badge>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-muted-foreground text-lg mb-2">
                      {content.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>作者: {content.author}</span>
                      <span>•</span>
                      <span>来源: {content.publish_source}</span>
                      <span>•</span>
                      <span>
                        预计阅读: {getReadingTime(content.word_count)}
                      </span>
                    </div>
                  </div>

                  {/* 数据统计 */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="h-4 w-4 mr-1 text-blue-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.read_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        阅读量
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Heart className="h-4 w-4 mr-1 text-red-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.like_count.toLocaleString()}
                        {content.like_count > content.old_like_count && (
                          <span className="text-xs text-green-500 ml-1">
                            +{content.like_count - content.old_like_count}
                          </span>
                        )}
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
                        {content.comment_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        评论数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Share2 className="h-4 w-4 mr-1 text-purple-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.share_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        分享数
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Bookmark className="h-4 w-4 mr-1 text-orange-500" />
                      </div>
                      <div className="text-lg font-semibold">
                        {content.collect_count.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        收藏数
                      </div>
                    </div>
                  </div>

                  {/* 作者信息 */}
                  <div className="p-4 bg-muted/20 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">作者信息</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">作者: </span>
                        <span>{content.author}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">公众号: </span>
                        <span>{content.publish_source}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">用户ID: </span>
                        <span>{content.author_user_id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          发布类型:{" "}
                        </span>
                        <span>{content.publish_type}</span>
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
                        <div className="text-2xl font-bold text-blue-600">
                          {content.word_count.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          字数
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {content.image_count}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          图片数
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {getReadingTime(content.word_count)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          预计阅读
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {content.has_reference ? "是" : "否"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          有引用
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 图片资源 */}
                  {content.images_url && content.images_url.length > 1 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Image className="mr-2 h-4 w-4" />
                        文章图片
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
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
                      {content.images_url.length > 4 && (
                        <div className="text-xs text-muted-foreground mt-2">
                          还有 {content.images_url.length - 4} 张图片...
                        </div>
                      )}
                    </div>
                  )}

                  {/* 其他属性 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      创建时间:{" "}
                      {new Date(content.created_at).toLocaleString("zh-CN")}
                    </div>
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-2" />
                      <button
                        onClick={() =>
                          window.open(content.article_url, "_blank")
                        }
                        className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                      >
                        查看文章链接
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for additional information */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">文章内容</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <div className="space-y-6">
              {/* 文章正文内容 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    文章正文
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      className="text-sm leading-relaxed"
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-800">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-medium mt-4 mb-2 text-gray-700">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-4 text-gray-600 leading-relaxed">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-4 space-y-1">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-4 space-y-1">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-600">{children}</li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                            {children}
                          </pre>
                        ),
                        a: ({ children, href }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {children}
                          </a>
                        ),
                        img: ({ src, alt }) => (
                          <img
                            src={src}
                            alt={alt}
                            className="max-w-full h-auto rounded-lg my-4 cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => window.open(src, "_blank")}
                          />
                        ),
                      }}
                    >
                      {content.full_text}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>数据分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(
                        (content.like_count / content.read_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">点赞率</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(
                        (content.comment_count / content.read_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">评论率</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(
                        (content.share_count / content.read_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">分享率</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {(
                        (content.collect_count / content.read_count) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">收藏率</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">
                      {Math.round(content.word_count / content.image_count)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      字图比例
                    </div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">
                      {content.like_count - content.old_like_count > 0
                        ? `+${content.like_count - content.old_like_count}`
                        : "0"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      新增点赞
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-2">内容质量指标</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">阅读完成度估算</span>
                        <span className="text-sm font-medium">
                          {Math.min(
                            100,
                            Math.round(
                              (content.like_count / content.read_count) * 1000,
                            ),
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          100,
                          Math.round(
                            (content.like_count / content.read_count) * 1000,
                          ),
                        )}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">互动活跃度</span>
                        <span className="text-sm font-medium">
                          {Math.min(
                            100,
                            Math.round(
                              ((content.like_count +
                                content.comment_count +
                                content.share_count) /
                                content.read_count) *
                                100,
                            ),
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          100,
                          Math.round(
                            ((content.like_count +
                              content.comment_count +
                              content.share_count) /
                              content.read_count) *
                              100,
                          ),
                        )}
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
