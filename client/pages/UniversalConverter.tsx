import { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Wand2,
  Copy,
  Download,
  RefreshCw,
  Link2,
  FileText,
  Video,
  Image,
  Settings2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

// API configuration
const API_BASE_URL = "http://localhost:8000/api";
const AUTH_TOKEN = import.meta.env.VITE_BACKEND_API_TOKEN;

export default function UniversalConverter() {
  const { toast } = useToast();
  const [sourceContent, setSourceContent] = useState("");
  const [convertedContent, setConvertedContent] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [extractedMetadata, setExtractedMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [styleOptions, setStyleOptions] = useState({
    tone: "friendly",
    length: "medium",
    styleType: "casual",
    targetAge: "18-25",
    targetGender: "all",
  });

  const platforms = [
    { value: "douyin", label: "抖音", emoji: "🎵" },
    { value: "xiaohongshu", label: "小红书", emoji: "📕" },
    { value: "bilibili", label: "B站", emoji: "📺" },
    { value: "kuaishou", label: "快手", emoji: "⚡" },
    { value: "wechat", label: "微信公众号", emoji: "💬" },
    { value: "weibo", label: "微博", emoji: "🐦" },
    { value: "tiktok", label: "TikTok", emoji: "🎬" },
    { value: "instagram", label: "Instagram", emoji: "📸" },
    { value: "youtube", label: "YouTube", emoji: "▶️" },
  ];


  const handleConvert = async () => {
    if (!extractedData || !sourcePlatform || !targetPlatform) {
      toast({
        title: "错误",
        description: "请先提取内容后再进行转换",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/universal-converter/convert`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceContent: extractedData,
            sourcePlatform: sourcePlatform,
            targetPlatform: targetPlatform,
            styleOptions: {
              tone: styleOptions.tone,
              length: styleOptions.length,
              styleType: styleOptions.styleType,
              targetAge: styleOptions.targetAge,
              targetGender: styleOptions.targetGender,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`转换失败: ${response.statusText}`);
      }

      const data = await response.json();
      setConvertedContent(data.convertedContent || "");

      toast({
        title: "转换成功",
        description: "内容已成功转换为目标平台风格",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "转换过程中出现错误");
      toast({
        title: "转换失败",
        description: err instanceof Error ? err.message : "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvertOld = async () => {
    if (!sourceContent.trim() || !sourcePlatform || !targetPlatform) {
      return;
    }

    setIsConverting(true);

    // Simulate AI conversion process
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock converted content based on platforms and style options
    let mockConversion = "";
    const { tone, length, styleType, targetAge, targetGender } = styleOptions;

    // Apply style modifications based on options
    const getStyledIntro = () => {
      // Age-specific language adjustments
      const agePrefix =
        targetAge === "13-17"
          ? "同学们"
          : targetAge === "18-25"
            ? "小伙伴们"
            : targetAge === "26-35"
              ? "朋友们"
              : targetAge === "36-45"
                ? "各位"
                : targetAge === "46-60"
                  ? "大家"
                  : targetAge === "60+"
                    ? "叔叔阿姨们"
                    : "大家";

      // Gender-specific adjustments
      const genderTouch =
        targetGender === "female"
          ? "姐妹们"
          : targetGender === "male"
            ? "兄弟们"
            : agePrefix;

      if (tone === "humorous")
        return `哈哈哈，${genderTouch}，今天又来分享好东西啦～`;
      if (tone === "professional")
        return `${agePrefix}好，基于专业分析，为大家推荐一个优质产品：`;
      if (tone === "emotional")
        return `真的太爱这个了！${genderTouch}必须知道！`;
      return `${genderTouch}好，今天给大家分享一个超棒的发现：`;
    };

    if (sourcePlatform === "douyin" && targetPlatform === "xiaohongshu") {
      const intro = getStyledIntro();
      // Age and gender-specific content adjustments
      const studentFocus = targetAge === "13-17" || targetAge === "18-25";
      const budgetTerm = studentFocus ? "学生党友好" : "性价比高";
      const femaleFocus = targetGender === "female";

      const detailLevel =
        length === "short"
          ? `• 简单好用\n• ${budgetTerm}`
          : length === "long"
            ? `• 第一点：产品质量超棒，用料很足\n• 第二点：设计很贴心，使用体验很好\n• 第三点：${budgetTerm}，值得入手\n• 第四点：包装精美，${femaleFocus ? "颜值很高" : "送礼自用都不错"}`
            : `• 第一点：${sourceContent.split("").slice(0, 20).join("")}\n• 第二点：适合日常使用\n• 第三点：${budgetTerm}`;

      mockConversion = `📝 ${intro}

${sourceContent.split("").slice(0, 50).join("")}...

✨ ${styleType === "tutorial" ? "使用教程" : styleType === "review" ? "详细测评" : "种草指南"}：
${detailLevel}

🏷️ #种草分享 #好物推荐 #生活方式

💡 ${tone === "encouraging" ? "相信你们也会喜欢的！" : "小红薯��觉得怎么样呢？"}
评论区告诉我你们的想法～`;
    } else if (
      sourcePlatform === "xiaohongshu" &&
      targetPlatform === "douyin"
    ) {
      const opening =
        tone === "humorous"
          ? "哈喽大家好，我是你们的搞笑博主～"
          : tone === "professional"
            ? "大家好，我是专业测评师，今天为大家带来..."
            : tone === "encouraging"
              ? "嗨大家好，今天要给大家分享一个超级棒的..."
              : "嗨大家好，今天给大家分享一个超实用的...";

      const contentPoints =
        length === "short"
          ? `要点：${sourceContent.split("").slice(0, 30).join("")}`
          : `内容要点：
1. ${sourceContent.split("").slice(0, 25).join("")}
2. 这个方法真的太好用了
3. 大家一定要试试${length === "long" ? "\n4. 详细步骤我都整理好了\n5. 有问题随时评论区问我" : ""}`;

      const ending =
        tone === "encouraging"
          ? "相信大家都能学会，加油！"
          : tone === "professional"
            ? "以上就是今天的专业分享，感谢观看。"
            : "如果觉得有用的话，记得点赞关注哦！";

      mockConversion = `🎬 【${sourceContent.split("").slice(0, 15).join("")}��

开场：${opening}

${contentPoints}

结尾：${ending}

#抖音热门 #生活技巧 #干货分享`;
    } else {
      const platformName = platforms.find(
        (p) => p.value === targetPlatform,
      )?.label;
      const ageGroupLabel = {
        "13-17": "中学生群体",
        "18-25": "大学生/新职场群体",
        "26-35": "职场精英群体",
        "36-45": "中年用户群体",
        "46-60": "成熟用户群体",
        "60+": "银发族群体",
        all: "全年龄群体",
      }[targetAge];

      const genderLabel = {
        male: "男性用户",
        female: "女性用户",
        all: "男女通用",
      }[targetGender];

      const styleDescription = `${tone === "professional" ? "专业" : tone === "humorous" ? "幽默" : "友好"}语调 + ${length === "short" ? "精简" : length === "long" ? "详细" : "适中"}长度 + ${styleType}风格`;

      mockConversion = `��� 已转换为 ${platformName} 风格：

${sourceContent}

✨ 风格优化 (${styleDescription})：
• 调整了语调为${tone === "formal" ? "正式严肃" : tone === "friendly" ? "友好亲切" : tone === "professional" ? "专业权威" : "个性化"}风格
• 优化了内容长度为${length === "short" ? "简短精炼" : length === "medium" ? "适中详细" : "详细完整"}版本
• 采用了${styleType === "tutorial" ? "教程指导" : styleType === "review" ? "评测分析" : styleType === "creative" ? "创意新颖" : "通用"}表达方式
• 针对${ageGroupLabel}进行用词优化
• 按��${genderLabel}偏好调整表达方式
• 增强了平台适配性

🎯 目标受众：${ageGroupLabel} | ${genderLabel}
📈 转换完成，已根据目标受众进行精准优化`;
    }

    setConvertedContent(mockConversion);
    setIsConverting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedContent);
    toast({
      title: "复制成功",
      description: "内容已复制到剪贴板",
    });
  };

  const detectPlatformFromUrl = (url: string) => {
    if (url.includes("douyin.com") || url.includes("tiktok.com"))
      return "douyin";
    if (url.includes("xiaohongshu.com") || url.includes("xhs.com"))
      return "xiaohongshu";
    if (url.includes("bilibili.com")) return "bilibili";
    if (url.includes("kuaishou.com")) return "kuaishou";
    if (url.includes("weixin.qq.com") || url.includes("mp.weixin.qq.com"))
      return "wechat";
    if (url.includes("weibo.com")) return "weibo";
    if (url.includes("youtube.com") || url.includes("youtu.be"))
      return "youtube";
    if (url.includes("instagram.com")) return "instagram";
    return "";
  };

  const handleExtractFromLinkOld = async () => {
    if (!linkInput.trim()) return;

    setIsExtracting(true);

    // Auto-detect platform from URL
    const detectedPlatform = detectPlatformFromUrl(linkInput);
    if (detectedPlatform) {
      setSourcePlatform(detectedPlatform);
    }

    // Simulate content extraction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock extracted content based on URL type
    let extractedContent = "";
    let metadata = {};

    if (linkInput.includes("douyin.com") || linkInput.includes("tiktok.com")) {
      extractedContent = `🎵 超火爆视频文案：

"今天教大家一个超实用的生活小技巧！
真的太好用了，���会了能省好多钱💰

步骤很简单：
1️⃣ 准备这些材料...
2️⃣ 按照这个步骤...
3️⃣ 最后这样处理...

效果真的太棒了！大���快试试～
记得点赞收藏哦！❤️

#生活技巧 #实用妙招 #省钱攻略"`;

      metadata = {
        type: "短视频",
        platform: "抖音/TikTok",
        views: "50.2万",
        likes: "1.8万",
        duration: "30秒",
      };
    } else if (linkInput.includes("xiaohongshu.com")) {
      extractedContent = `📝 种草笔记分享：

✨ 发现了这个宝��好物！
真的超级好用，必须分享给大家～

🌟 产品特点：
• 颜值超高，拍照很出片
• 性价比很不错，学生党友好
• 使用体验很棒，推荐指数★★★★★

💡 使用心得：
第一次用就爱上了，效果比预期还要好
特别适合日常使用，简单方便

🏷️ #好物分享 #种草安利 #生活记录

小红薯们觉得怎么样？评论区交流～`;

      metadata = {
        type: "图文笔记",
        platform: "小红书",
        likes: "2.3K",
        收藏: "856",
        图片数: "6张",
      };
    } else if (linkInput.includes("weixin.qq.com")) {
      extractedContent = `📰 公众号文章内容：

【标题】如何高效管理时间，提升工作效率

现代社会节奏越来越快，如何在有限的时间内完成更多的工作，成为了每个人都需要面对的挑战。

一、时间管理的重要性
时间是最宝贵的资源，合理安排时间能够让我们事半功倍。

二、实用的时间管理方法
1. 番茄工作法
2. 四象��法则
3. 时间块管理

三、养成良好的工作习���
良好的习惯是高效工作的基础...

（文章内容较长，已提取核心要点）`;

      metadata = {
        type: "公众号文章",
        platform: "微���公众号",
        阅读量: "1.2万",
        在看: "123",
        字数: "约2500字",
      };
    } else {
      extractedContent = `🔗 链接内容提取���

${linkInput}

已自动提取该链接的文本内容，包括：
• 标题信息
• 主要内容段落
• 关键信息要点
• 相关标签和元数据

请查看提取结果，并根据需要进行平台转换。`;

      metadata = {
        type: "网页内容",
        platform: "通用链接",
        状态: "提取完成",
      };
    }

    setSourceContent(extractedContent);
    setExtractedMetadata(metadata);
    setIsExtracting(false);
  };

  const formatExtractedData = (data: any) => {
    let formattedContent = "";

    if (data.title) {
      formattedContent += `📌 标题: ${data.title}\n\n`;
    }

    if (data.description) {
      formattedContent += `📝 描述：\n${data.description}\n\n`;
    }

    if (data.hashtags && data.hashtags.length > 0) {
      formattedContent += `🏷️ 标签: ${data.hashtags.map((tag: string) => `#${tag}`).join(" ")}\n\n`;
    }

    if (data.transcript) {
      formattedContent += `📄 转录文本：\n${data.transcript}\n\n`;
    }

    if (data.video_url) {
      formattedContent += `🎥 视频链接: ${data.video_url}\n`;
    }

    return formattedContent.trim();
  };

  const handleExtractFromLink = async () => {
    if (!linkInput.trim()) return;

    setIsExtracting(true);
    setError(null);
    setExtractedData(null);
    setConvertedContent("");

    // Auto-detect platform from URL
    const detectedPlatform = detectPlatformFromUrl(linkInput);
    if (detectedPlatform) {
      setSourcePlatform(detectedPlatform);
    } else {
      toast({
        title: "警告",
        description: "无法自动识别平台，请手动选择源平台",
        variant: "destructive",
      });
      setIsExtracting(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/universal-converter/extract`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input_url: linkInput,
            source_platform: detectedPlatform,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`提取失败: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.data) {
        setExtractedData(result.data);
        setSourceContent(formatExtractedData(result.data));

        // Set metadata for display
        const metadata: any = {
          平台:
            platforms.find((p) => p.value === detectedPlatform)?.label ||
            detectedPlatform,
          状态: "提取成功",
        };

        if (result.data.title)
          metadata.标题 =
            result.data.title.substring(0, 30) +
            (result.data.title.length > 30 ? "..." : "");
        if (result.data.hashtags)
          metadata.标签数 = result.data.hashtags.length + "个";
        if (result.data.transcript)
          metadata.字数 = result.data.transcript.length + "字";

        setExtractedMetadata(metadata);

        toast({
          title: "提取成功",
          description: "内容已成功提取，可以进行转换了",
        });
      } else {
        throw new Error("未能提取到有效内容");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "提取过程中出现错误");
      toast({
        title: "提取失败",
        description: err instanceof Error ? err.message : "请检查链接是否有效",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };


  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">万能转换</h1>
            <Badge className="bg-orange-500 text-white">🔥 HOT</Badge>
          </div>
          <p className="text-muted-foreground">
            智能转换不同平台内容，一键适配各平台特色风格
          </p>
        </div>


        {/* Style Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              风格选项
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Tone Adjustment */}
              <div className="space-y-2">
                <label className="text-sm font-medium">语调调整</label>
                <Select
                  value={styleOptions.tone}
                  onValueChange={(value) =>
                    setStyleOptions((prev) => ({ ...prev, tone: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">正式严肃</SelectItem>
                    <SelectItem value="friendly">友好亲切</SelectItem>
                    <SelectItem value="professional">专业权威</SelectItem>
                    <SelectItem value="humorous">幽默风趣</SelectItem>
                    <SelectItem value="emotional">情感丰富</SelectItem>
                    <SelectItem value="encouraging">鼓励激励</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Length Control */}
              <div className="space-y-2">
                <label className="text-sm font-medium">长度控制</label>
                <Select
                  value={styleOptions.length}
                  onValueChange={(value) =>
                    setStyleOptions((prev) => ({ ...prev, length: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">简短精炼</SelectItem>
                    <SelectItem value="medium">适中详细</SelectItem>
                    <SelectItem value="long">详细完整</SelectItem>
                    <SelectItem value="extended">深度扩展</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Style Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">风格类型</label>
                <Select
                  value={styleOptions.styleType}
                  onValueChange={(value) =>
                    setStyleOptions((prev) => ({ ...prev, styleType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">轻松随意</SelectItem>
                    <SelectItem value="business">商务正式</SelectItem>
                    <SelectItem value="creative">创意新颖</SelectItem>
                    <SelectItem value="educational">教育科普</SelectItem>
                    <SelectItem value="storytelling">故事叙述</SelectItem>
                    <SelectItem value="listicle">列表形式</SelectItem>
                    <SelectItem value="tutorial">教程指导</SelectItem>
                    <SelectItem value="review">评测分析</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Age */}
              <div className="space-y-2">
                <label className="text-sm font-medium">目标年龄</label>
                <Select
                  value={styleOptions.targetAge}
                  onValueChange={(value) =>
                    setStyleOptions((prev) => ({ ...prev, targetAge: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="13-17">13-17岁 (中学生)</SelectItem>
                    <SelectItem value="18-25">
                      18-25岁 (大学生/新职场)
                    </SelectItem>
                    <SelectItem value="26-35">26-35岁 (职场精英)</SelectItem>
                    <SelectItem value="36-45">36-45岁 (中年用户)</SelectItem>
                    <SelectItem value="46-60">46-60岁 (成熟用户)</SelectItem>
                    <SelectItem value="60+">60岁以上 (银发一族)</SelectItem>
                    <SelectItem value="all">全年龄段</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Gender */}
              <div className="space-y-2">
                <label className="text-sm font-medium">目标性别</label>
                <Select
                  value={styleOptions.targetGender}
                  onValueChange={(value) =>
                    setStyleOptions((prev) => ({
                      ...prev,
                      targetGender: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男性用户</SelectItem>
                    <SelectItem value="female">女性用户</SelectItem>
                    <SelectItem value="all">男女通用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Style Preview */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">
                当前风格预览：
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {
                    {
                      formal: "正式严肃",
                      friendly: "友好亲切",
                      professional: "专业权威",
                      humorous: "幽默风趣",
                      emotional: "情感丰富",
                      encouraging: "鼓励激励",
                    }[styleOptions.tone]
                  }
                </Badge>
                <Badge variant="outline">
                  {
                    {
                      short: "简短精炼",
                      medium: "适中详细",
                      long: "详细完整",
                      extended: "深度扩展",
                    }[styleOptions.length]
                  }
                </Badge>
                <Badge variant="outline">
                  {
                    {
                      casual: "轻松随意",
                      business: "商务正式",
                      creative: "创意新颖",
                      educational: "教育科普",
                      storytelling: "故事叙述",
                      listicle: "列表形式",
                      tutorial: "教程指导",
                      review: "评测分析",
                    }[styleOptions.styleType]
                  }
                </Badge>
                <Badge variant="outline">
                  {
                    {
                      "13-17": "13-17岁",
                      "18-25": "18-25岁",
                      "26-35": "26-35岁",
                      "36-45": "36-45岁",
                      "46-60": "46-60岁",
                      "60+": "60+岁",
                      all: "全年龄",
                    }[styleOptions.targetAge]
                  }
                </Badge>
                <Badge variant="outline">
                  {
                    {
                      male: "男性向",
                      female: "女性向",
                      all: "男女通用",
                    }[styleOptions.targetGender]
                  }
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>源内容</span>
                <Select
                  value={sourcePlatform}
                  onValueChange={setSourcePlatform}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择源平台" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        <span className="flex items-center gap-2">
                          {platform.emoji} {platform.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Link Input Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">从链接提取内容</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="粘贴视频链接、图文链接或文章链接..."
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleExtractFromLink}
                    disabled={!linkInput.trim() || isExtracting}
                    variant="outline"
                  >
                    {isExtracting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        提取中
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        提取内容
                      </>
                    )}
                  </Button>
                </div>

                {/* Supported platforms */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>支持平台：</span>
                  <div className="flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    <span>抖音、TikTok、快手、B站</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    <span>小红书、微博</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>公众号、头条</span>
                  </div>
                </div>
              </div>

              {/* Extracted Metadata */}
              {extractedMetadata && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      提取信息
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(extractedMetadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-blue-600">{key}:</span>
                        <span className="text-blue-800 font-medium">
                          {value as string}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">提取的文本内容</span>
                  {extractedData && (
                    <Badge variant="outline" className="ml-2">
                      已提取数据
                    </Badge>
                  )}
                </div>
                <Textarea
                  placeholder="请先使用上方链接提取功能获取内容..."
                  value={sourceContent}
                  readOnly
                  className="min-h-[250px] resize-none bg-gray-50"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {sourceContent.length} 字符
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSourceContent("");
                      setExtractedData(null);
                      setExtractedMetadata(null);
                      setConvertedContent("");
                    }}
                  >
                    清空
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Converted Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>转换结果</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <Select
                  value={targetPlatform}
                  onValueChange={setTargetPlatform}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择目标平台" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        <span className="flex items-center gap-2">
                          {platform.emoji} {platform.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="转换后的内容将显示在这里..."
                value={convertedContent}
                readOnly
                className="min-h-[300px] resize-none bg-gray-50"
              />

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {convertedContent.length} 字符
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!convertedContent}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    复制
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!convertedContent}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    导出
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Convert Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={handleConvert}
            disabled={
              !extractedData ||
              !sourcePlatform ||
              !targetPlatform ||
              isConverting
            }
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg h-auto"
            size="lg"
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                AI 转换中...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                开始智能转换
              </>
            )}
          </Button>
        </div>

        {/* Features */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>转换特性</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🎯
                </div>
                <h3 className="font-medium mb-1">智能适应</h3>
                <p className="text-sm text-muted-foreground">
                  根据目标平台特点，自动调整内容风格
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  ⚡
                </div>
                <h3 className="font-medium mb-1">快速转换</h3>
                <p className="text-sm text-muted-foreground">
                  AI 驱动，秒级完成内容转换
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🎨
                </div>
                <h3 className="font-medium mb-1">风格优化</h3>
                <p className="text-sm text-muted-foreground">
                  保持原意的同时优化表达方式
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  📊
                </div>
                <h3 className="font-medium mb-1">多平台支持</h3>
                <p className="text-sm text-muted-foreground">
                  支持主流社交媒体平台互转
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
