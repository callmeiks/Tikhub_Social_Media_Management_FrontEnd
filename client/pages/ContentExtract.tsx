import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Image as ImageIcon,
  Copy,
  Download,
  RefreshCw,
  Settings,
  Search,
  Link as LinkIcon,
  CheckCircle,
  AlertTriangle,
  Eye,
  Zap,
  Grid3X3,
  Type,
  Palette,
  Folder,
  Clock,
  Trash2,
  XCircle,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface ContentExtractTask {
  id: string;
  url: string;
  status: string;
  progress: number;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
  content: {
    title: string;
    text: string;
    images: Array<{
      url: string;
      description: string;
      fileSize: string;
      format: string;
    }>;
    tags: string[];
    author: {
      name: string;
      userId: string;
      avatar: string;
      followers: number;
      isVerified: boolean;
    };
    stats: {
      likes: number;
      comments: number;
      shares: number;
      views: number;
    };
    publishedAt: string;
  } | null;
}

const extractionHistory = [
  {
    id: 1,
    url: "https://www.xiaohongshu.com/discovery/item/111111",
    platform: "小红书",
    title: "减肥成功分享！从130斤到100斤的完整攻略",
    status: "completed",
    imageCount: 8,
    extractedAt: "2024-01-14 16:22",
    extractedData: {
      content: `姐妹们好！今天来跟大家分享我的减肥心路历程～

💪 我的减肥数据：
- 开始��重：130斤
- 目标体重：100斤
- 减肥周期：6个月
- 最终体重：98斤

🔥 减肥方法分享：
1. 控制饮食：少油少盐，多吃蛋白质
2. 规律运动：每天至少30分钟有氧运动
3. 充足睡眠：保证每天8小时睡眠
4. 多喝水：每天至少2000ml

⚠️ 踩坑提醒：
- 不要节食！会反弹的
- 不要只做有氧，要加力量训练
- 体重会有波动，看趋势不看单天

💡 心得体会：
减肥是一个长期过程，要有耐心，相信自己一定可以成功！

#减肥分享 #瘦身心得 #健康生活`,
      tags: ["#减肥分享", "#瘦身心得", "#健康生活", "#减肥攻略"],
      images: [
        { description: "减肥前后对比图", size: "750x1000" },
        { description: "健康食谱搭配", size: "750x1000" },
        { description: "运动计划表", size: "750x1000" },
        { description: "体重变化曲线图", size: "750x1000" },
      ],
    },
  },
  {
    id: 2,
    url: "https://www.xiaohongshu.com/discovery/item/222222",
    platform: "小红书",
    title: "新手化妆教程｜打造自然裸妆的5个步骤",
    status: "completed",
    imageCount: 6,
    extractedAt: "2024-01-13 09:15",
    extractedData: {
      content: `Hello美女们！今天教大家画一个简单的日常裸妆～

✨ 需要的产品：
- 妆前乳
- 粉底液
- 遮瑕膏
- 散粉
- 眉笔
- 腮红
- 口红

📝 具体步骤：
1️⃣ 妆前打底：先用妆前乳打底，让妆容更持久
2️⃣ 底妆处理：用粉底液均匀涂抹全脸
3️⃣ 遮瑕重点：用遮瑕膏遮盖痘印和黑眼圈
4️⃣ 定妆处理：用散粉轻拍定妆
5️⃣ 眉毛画法：用眉笔勾勒自然眉形

💄 小技巧：
- 粉底液要选择贴合肤色的
- 腮红可以让气色更好
- 口红选���日常色号

#化妆教程 #裸妆 #新手化妆`,
      tags: ["#化妆教程", "#裸妆", "#新手化妆", "#美妆分享"],
      images: [
        { description: "化妆前后对比", size: "750x1000" },
        { description: "化妆品清单", size: "750x1000" },
        { description: "步骤详解图", size: "750x1000" },
      ],
    },
  },
  {
    id: 3,
    url: "https://www.xiaohongshu.com/discovery/item/333333",
    platform: "小红书",
    title: "学生党必看！宿舍收纳神器推荐",
    status: "completed",
    imageCount: 5,
    extractedAt: "2024-01-12 20:30",
    extractedData: {
      content: `同学们好！分享一下我的宿舍收纳经验～

🏠 宿舍收纳痛点：
- 空间小东西多
- ���有足够储物空间
- 东西容易乱

🛍️ 收纳神器推荐：
1. 床下收纳箱：可以放换季衣物
2. 挂式收纳袋：充分利用墙面空间
3. 桌面收纳盒：小物件分类存放
4. 真空压缩袋：节省50%空间

💡 收纳技巧：
- 物品分类标签化
- 常用物品放在容易拿到的地方
- 定期整理，养成好习惯

花费不到100元就能让宿舍焕然一新！

#宿舍收纳 #学生党 #收纳神器`,
      tags: ["#宿舍收纳", "#学生党", "#收纳神器", "#��理收纳"],
      images: [
        { description: "收纳前后对比", size: "750x1000" },
        { description: "收纳产品展示", size: "750x1000" },
        { description: "整理步骤图", size: "750x1000" },
      ],
    },
  },
];

const extractionQueue = [
  {
    id: 1,
    url: "https://www.xiaohongshu.com/discovery/item/123456",
    platform: "小红书",
    title: "超详细护肤心得分享！敏感肌女孩的逆袭之路",
    status: "completed",
    progress: 100,
    imageCount: 4,
    extractedAt: "2024-01-15 14:30",
  },
  {
    id: 2,
    url: "https://xhslink.com/abcdef",
    platform: "小红书",
    title: "冬季穿搭分享 | 温暖又时尚的搭配技巧",
    status: "extracting",
    progress: 75,
    imageCount: 6,
    extractedAt: "",
  },
  {
    id: 3,
    url: "https://www.xiaohongshu.com/discovery/item/789012",
    platform: "小红书",
    title: "烘焙新手必看！零失败��糕制作教程",
    status: "pending",
    progress: 0,
    imageCount: 0,
    extractedAt: "",
  },
  {
    id: 4,
    url: "https://www.xiaohongshu.com/discovery/item/345678",
    platform: "小红书",
    title: "居家收纳神器推荐，告别凌乱生活",
    status: "error",
    progress: 0,
    imageCount: 0,
    extractedAt: "",
  },
];

const extractedContent = {
  title: "超详细护肤心得分享！敏感肌女孩的逆袭之路",
  content: `姐妹们好！今天来分享一下我的护肤心得，作为一个敏感肌女孩，真的是踩了太多坑才找到适合自己的护肤方法😭

💡 我的肌肤状况：
- 敏感肌，容易泛红
- T区偏油，脸颊偏干
- 毛孔粗大，偶尔爆痘

🌟 护肤步骤分享：
1️⃣ 温和洁面：氨基酸洁面，早晚各一次
2️⃣ 爽肤水：含有神经酰胺的保湿型
3️⃣ 精华：烟酰胺精华，隔天使用
4️⃣ 面霜：选择质地轻薄但保湿力强的
5️⃣ 防晒：物理防晒，SPF30以上

✨ 重点产品推荐：
- 洁面：某某氨基酸洁面泡沫
- 爽肤水：某某神经酰胺爽肤水
- 精华：某某烟酰胺精华液
- 面霜：某某修护面霜

💖 小贴士：
- 敏感肌一定要温和护肤
- 新产品要先做过敏测试
- 防��真的超级重要！

#护肤心得 #敏感肌护肤 #护肤分享 #美妆博主`,
  images: [
    {
      url: "https://cdn.xiaohongshu.com/image1.jpg",
      description: "护肤产品全家福",
      size: "750x1000",
    },
    {
      url: "https://cdn.xiaohongshu.com/image2.jpg",
      description: "��面产品对比图",
      size: "750x1000",
    },
    {
      url: "https://cdn.xiaohongshu.com/image3.jpg",
      description: "使用前后对比",
      size: "750x1000",
    },
    {
      url: "https://cdn.xiaohongshu.com/image4.jpg",
      description: "护肤步骤示意图",
      size: "750x1000",
    },
  ],
  tags: ["#护肤心得", "#敏感肌护肤", "#护肤分享", "#美妆博主"],
  author: {
    name: "美妆小仙女",
    avatar: "https://cdn.xiaohongshu.com/avatar.jpg",
    followers: "12.5万",
  },
  stats: {
    likes: "2.3万",
    comments: "568",
    shares: "1.2万",
  },
};

export default function ContentExtract() {
  const [batchUrls, setBatchUrls] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("batch");
  const [extractionList, setExtractionList] = useState(extractionQueue);
  const [extractTasks, setExtractTasks] = useState<ContentExtractTask[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isCancellingTasks, setIsCancellingTasks] = useState(false);
  const [historyTasks, setHistoryTasks] = useState<ContentExtractTask[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedHistoryTaskIds, setSelectedHistoryTaskIds] = useState<
    string[]
  >([]);
  const [isRetryingTasks, setIsRetryingTasks] = useState(false);
  const [expandedHistoryItems, setExpandedHistoryItems] = useState<number[]>(
    [],
  );
  const [historyFilter, setHistoryFilter] = useState<string>("all");
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const [downloadSettings, setDownloadSettings] = useState({
    format: "jpg",
    downloadPath: "/Downloads/TikHub/ContentExtract",
  });
  const [extractionSettings, setExtractionSettings] = useState({
    images: true,
    text: true,
    tags: true,
  });

  const fetchExtractTasks = async () => {
    setIsLoadingTasks(true);
    try {
      const token = import.meta.env.VITE_BACKEND_API_TOKEN;
      const response = await fetch(
        "http://127.0.0.1:8000/api/content-extract/tasks",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: 10,
            offset: 0,
            status: ["queued", "processing", "paused"],
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch extract tasks");
      }

      const data = await response.json();
      setExtractTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching extract tasks:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const fetchHistoryTasks = async () => {
    setIsLoadingHistory(true);
    try {
      const token = import.meta.env.VITE_BACKEND_API_TOKEN;
      const response = await fetch(
        "http://127.0.0.1:8000/api/content-extract/tasks",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: 10,
            offset: 0,
            status: ["completed", "failed", "cancelled"],
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch history tasks");
      }

      const data = await response.json();
      setHistoryTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching history tasks:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "queue") {
      fetchExtractTasks();
    } else if (activeTab === "history") {
      fetchHistoryTasks();
    }
  }, [activeTab]);

  // 当历史筛选器改变时清空选择
  useEffect(() => {
    setSelectedHistoryTaskIds([]);
  }, [historyFilter]);

  const cancelTasks = async (taskIds: string[]) => {
    if (taskIds.length === 0) return;

    setIsCancellingTasks(true);
    try {
      const token = import.meta.env.VITE_BACKEND_API_TOKEN;

      const cancelPromises = taskIds.map(async (taskId) => {
        const response = await fetch(
          `http://127.0.0.1:8000/api/content-extract/batch/${taskId}`,
          {
            method: "DELETE",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to cancel task ${taskId}`);
        }

        return response.json();
      });

      await Promise.all(cancelPromises);

      // 刷新任务列表
      await fetchExtractTasks();

      // 清空选中的任务
      setSelectedTaskIds([]);
    } catch (error) {
      console.error("Error cancelling tasks:", error);
      alert("取消任务失败，请重试");
    } finally {
      setIsCancellingTasks(false);
    }
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTaskIds((prev) => [...prev, taskId]);
    } else {
      setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(extractTasks.map((task) => task.id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  const handleCancelSelected = async () => {
    if (selectedTaskIds.length === 0) return;

    const confirmMessage =
      selectedTaskIds.length === 1
        ? "确定要取消这个任务吗？"
        : `确定要取消这 ${selectedTaskIds.length} 个任务吗？`;

    if (confirm(confirmMessage)) {
      await cancelTasks(selectedTaskIds);
    }
  };

  const retryTasks = async (taskIds: string[]) => {
    if (taskIds.length === 0) return;

    setIsRetryingTasks(true);
    try {
      const token = import.meta.env.VITE_BACKEND_API_TOKEN;

      const retryPromises = taskIds.map(async (taskId) => {
        const response = await fetch(
          `http://127.0.0.1:8000/api/content-extract/task/${taskId}/retry`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to retry task ${taskId}`);
        }

        return response.json();
      });

      await Promise.all(retryPromises);

      // 刷新历史任务列表
      await fetchHistoryTasks();

      // 清空选中的任务
      setSelectedHistoryTaskIds([]);
    } catch (error) {
      console.error("Error retrying tasks:", error);
      alert("重试任务失败，请重试");
    } finally {
      setIsRetryingTasks(false);
    }
  };

  const handleSelectHistoryTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedHistoryTaskIds((prev) => [...prev, taskId]);
    } else {
      setSelectedHistoryTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleSelectAllHistory = (checked: boolean) => {
    if (checked) {
      // 选择当前筛选结果中的所有可选任务
      const selectableTaskIds = filteredHistoryTasks
        .filter(
          (task) =>
            task.status === "completed" ||
            task.status === "failed" ||
            task.status === "cancelled",
        )
        .map((task) => task.id);
      setSelectedHistoryTaskIds(selectableTaskIds);
    } else {
      setSelectedHistoryTaskIds([]);
    }
  };

  const handleRetrySelected = async () => {
    if (selectedHistoryTaskIds.length === 0) return;

    const confirmMessage =
      selectedHistoryTaskIds.length === 1
        ? "确定要重试这个任务吗？"
        : `确定要重试这 ${selectedHistoryTaskIds.length} 个任务吗？`;

    if (confirm(confirmMessage)) {
      await retryTasks(selectedHistoryTaskIds);
    }
  };

  const handleExtract = async () => {
    const urls = batchUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      alert("请输入至少一个笔记链接");
      return;
    }

    if (urls.length > 20) {
      alert("最多支持20个链接，请减少链接数量");
      return;
    }

    // 验证链接格式
    const invalidUrls = urls.filter(
      (url) => !url.includes("xiaohongshu.com") && !url.includes("xhslink.com"),
    );

    if (invalidUrls.length > 0) {
      alert("请输入有效的小红书链接");
      return;
    }

    setIsExtracting(true);
    try {
      const token = import.meta.env.VITE_BACKEND_API_TOKEN;

      const response = await fetch(
        "http://127.0.0.1:8000/api/content-extract/batch",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            settings: {
              downloadPath: downloadSettings.downloadPath,
              extractImages: extractionSettings.images,
              extractTags: extractionSettings.tags,
              extractText: extractionSettings.text,
              imageFormat: downloadSettings.format,
            },
            urls: urls,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      alert(
        `提交成功！创建了 ${result.urlCount} 个提取任务，预计需要 ${result.estimatedTime} 秒完成。`,
      );

      // 清空输入并刷新任务列表
      setBatchUrls("");
      setShowResults(false);

      // 如果当前在队列标签页，刷新队列数据
      if (activeTab === "queue") {
        fetchExtractTasks();
      }
    } catch (error) {
      console.error("提取请求失败:", error);
      alert("提取请求失败，请检查网络连接或重试");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownloadImage = (imageUrl: string, description: string) => {
    // 模拟图片下载
    console.log(`下载图片: ${imageUrl} - ${description}`);
  };

  const handleBatchDownload = () => {
    // 模拟批量下载
    console.log("批量下载所有图片");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "processing":
        return <Download className="h-4 w-4 text-blue-600" />;
      case "queued":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "paused":
        return <Pause className="h-4 w-4 text-orange-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成";
      case "processing":
        return "处理中";
      case "queued":
        return "排队中";
      case "failed":
        return "失败";
      case "paused":
        return "已暂停";
      case "cancelled":
        return "已��消";
      default:
        return "未知";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "queued":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "paused":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const urlCount = batchUrls
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0).length;

  const completedCount = extractionList.filter(
    (item) => item.status === "completed",
  ).length;

  const toggleHistoryExpansion = (id: number) => {
    setExpandedHistoryItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // 筛选历史任务
  const getFilteredHistoryTasks = () => {
    switch (historyFilter) {
      case "completed":
        return historyTasks.filter((task) => task.status === "completed");
      case "failed":
        return historyTasks.filter((task) => task.status === "failed");
      case "cancelled":
        return historyTasks.filter((task) => task.status === "cancelled");
      case "failed-cancelled":
        return historyTasks.filter(
          (task) => task.status === "failed" || task.status === "cancelled",
        );
      case "all":
      default:
        return historyTasks;
    }
  };

  const filteredHistoryTasks = getFilteredHistoryTasks();

  // 导出功能
  const exportToCSV = async () => {
    if (selectedHistoryTaskIds.length === 0) {
      alert("请选择要导出的任务");
      return;
    }

    setIsExportingCsv(true);
    try {
      const selectedTasks = historyTasks.filter(
        (task) =>
          selectedHistoryTaskIds.includes(task.id) &&
          task.status === "completed",
      );

      if (selectedTasks.length === 0) {
        alert("没有可导出的已完成任务");
        return;
      }

      const dateStr = new Date().toISOString().split("T")[0];

      if (exportFormat === "csv") {
        // CSV导出
        const headers = [
          "任务ID",
          "URL",
          "标题",
          "内容文字",
          "图片数量",
          "图片URL列表",
          "作者",
          "粉丝数",
          "点赞数",
          "评论数",
          "分享数",
          "标签",
          "完成时间",
        ];
        const csvContent = [
          headers.join(","),
          ...selectedTasks.map((task) =>
            [
              task.id,
              `"${task.url}"`,
              `"${task.content?.title || ""}"`,
              `"${task.content?.text?.replace(/"/g, '""') || ""}"`,
              task.content?.images?.length || 0,
              `"${task.content?.images?.map((img) => img.url).join("; ") || ""}"`,
              `"${task.content?.author?.name || ""}"`,
              task.content?.author?.followers || 0,
              task.content?.stats?.likes || 0,
              task.content?.stats?.comments || 0,
              task.content?.stats?.shares || 0,
              `"${task.content?.tags?.join("; ") || ""}"`,
              task.completed_at
                ? new Date(task.completed_at).toLocaleString()
                : "",
            ].join(","),
          ),
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        downloadFile(blob, `content_extract_${dateStr}.csv`);
      } else if (exportFormat === "markdown") {
        // Markdown导出
        let markdownContent = `# 图文提取结果导出\n\n导出时间: ${new Date().toLocaleString()}\n\n`;

        selectedTasks.forEach((task, index) => {
          markdownContent += `## ${index + 1}. ${task.content?.title || "无标题"}\n\n`;
          markdownContent += `**任务ID**: ${task.id}\n\n`;
          markdownContent += `**URL**: ${task.url}\n\n`;
          markdownContent += `**作者**: ${task.content?.author?.name || "未知"} (${task.content?.author?.followers || 0} 粉丝)\n\n`;
          markdownContent += `**互动数据**: ❤️ ${task.content?.stats?.likes || 0} | 💬 ${task.content?.stats?.comments || 0} | 🔗 ${task.content?.stats?.shares || 0}\n\n`;
          markdownContent += `**内容文字**:\n${task.content?.text || ""}\n\n`;

          if (task.content?.tags && task.content.tags.length > 0) {
            markdownContent += `**标签**: ${task.content.tags.join(" ")}\n\n`;
          }

          if (task.content?.images && task.content.images.length > 0) {
            markdownContent += `**图片 (${task.content.images.length}张)**:\n`;
            task.content.images.forEach((img, imgIndex) => {
              markdownContent += `${imgIndex + 1}. [${img.description || "图片"}](${img.url})\n`;
            });
            markdownContent += "\n";
          }

          markdownContent += `**完成时间**: ${task.completed_at ? new Date(task.completed_at).toLocaleString() : ""}\n\n`;
          markdownContent += "---\n\n";
        });

        const blob = new Blob([markdownContent], {
          type: "text/markdown;charset=utf-8;",
        });
        downloadFile(blob, `content_extract_${dateStr}.md`);
      } else if (exportFormat === "xlsx") {
        // XLSX导出 (简化版，使用CSV格式但扩展名为xlsx)
        const headers = [
          "任务ID",
          "URL",
          "标题",
          "内容文字",
          "图片数量",
          "图片URL列表",
          "作者",
          "粉丝数",
          "点赞数",
          "评论数",
          "分享数",
          "标签",
          "完成时间",
        ];
        const csvContent = [
          headers.join("\t"),
          ...selectedTasks.map((task) =>
            [
              task.id,
              task.url,
              task.content?.title || "",
              task.content?.text || "",
              task.content?.images?.length || 0,
              task.content?.images?.map((img) => img.url).join("; ") || "",
              task.content?.author?.name || "",
              task.content?.author?.followers || 0,
              task.content?.stats?.likes || 0,
              task.content?.stats?.comments || 0,
              task.content?.stats?.shares || 0,
              task.content?.tags?.join("; ") || "",
              task.completed_at
                ? new Date(task.completed_at).toLocaleString()
                : "",
            ].join("\t"),
          ),
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;",
        });
        downloadFile(blob, `content_extract_${dateStr}.xlsx`);
      }

      alert(`成功导出 ${selectedTasks.length} 个任务的数据`);
      setSelectedHistoryTaskIds([]);
    } catch (error) {
      console.error("导出失败:", error);
      alert("导出失败，请重试");
    } finally {
      setIsExportingCsv(false);
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout
      title="图文提取"
      subtitle="从小红书笔记中提取图片和文字信息，便于二次创作"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <Grid3X3 className="mr-2 h-3.5 w-3.5" />
            批量提取
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Platform Notice */}
        <Card className="border border-border bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800"
              >
                📖 仅支持小红书
              </Badge>
              <span className="text-sm text-orange-700">
                当前仅支持小红书平台的图文内容提取，其他平台功能正在开发中
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="batch">批量提取</TabsTrigger>
            <TabsTrigger value="queue">提取队列</TabsTrigger>
            <TabsTrigger value="history">文案数据</TabsTrigger>
          </TabsList>

          <TabsContent value="batch" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-2">
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        批量添加笔记链接
                      </span>
                      <Badge
                        variant={urlCount > 20 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {urlCount}/20
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value="url" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger
                          value="url"
                          className="flex items-center space-x-1"
                        >
                          <LinkIcon className="h-3 w-3" />
                          <span>批量提取</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="search"
                          className="flex items-center space-x-1"
                        >
                          <Search className="h-3 w-3" />
                          <span>搜索提取</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="url" className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            粘贴笔记链接（每行一个，最多20个）
                          </label>
                          <Textarea
                            placeholder={`请粘贴小红书笔记链接，每行一个：

https://www.xiaohongshu.com/discovery/item/123456789
https://xhslink.com/abcdef
https://www.xiaohongshu.com/discovery/item/987654321

支持完整链接和分享短链接`}
                            value={batchUrls}
                            onChange={(e) => setBatchUrls(e.target.value)}
                            className="min-h-[200px] resize-none font-mono text-sm"
                            maxLength={5000}
                          />
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>支持完整链接和短链接，每行一个</span>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="search" className="space-y-4">
                        <div className="space-y-4">
                          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                              根据关键词搜索小红书内容
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                              功能开发中，敬请期待
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {urlCount > 20 && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>链接数量超过限制，请删除多余的链接</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExtract}
                          disabled={
                            urlCount === 0 || urlCount > 20 || isExtracting
                          }
                          className="h-8"
                        >
                          {isExtracting ? (
                            <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Zap className="mr-2 h-3.5 w-3.5" />
                          )}
                          {isExtracting ? "提取中..." : "开始提取"}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setBatchUrls("");
                            setShowResults(false);
                          }}
                          className="h-8"
                        >
                          清空
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {urlCount > 0 && <span>检测到 {urlCount} 个链接</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Section */}
                {(showResults || isExtracting) && (
                  <Card className="border border-border mt-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          提取结果
                        </span>
                        {showResults && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBatchDownload}
                            className="h-6"
                          >
                            <Download className="mr-1 h-3 w-3" />
                            批量下载
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isExtracting ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <RefreshCw className="h-8 w-8 animate-spin text-brand-accent mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground mb-2">
                              正在解析小红书内容...
                            </p>
                            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                              <span>提取图片</span>
                              <span>•</span>
                              <span>解析文本</span>
                              <span>•</span>
                              <span>识别标签</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Author Info */}
                          <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              👤
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {extractedContent.author.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {extractedContent.author.followers} 粉丝
                              </p>
                            </div>
                            <div className="ml-auto flex space-x-4 text-xs text-muted-foreground">
                              <span>❤️ {extractedContent.stats.likes}</span>
                              <span>💬 {extractedContent.stats.comments}</span>
                              <span>🔗 {extractedContent.stats.shares}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium">笔记标题</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCopy(extractedContent.title)
                                }
                                className="h-6"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm bg-muted/30 p-3 rounded-lg">
                              {extractedContent.title}
                            </p>
                          </div>

                          {/* Content */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium">正文内容</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCopy(extractedContent.content)
                                }
                                className="h-6"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <Textarea
                              value={extractedContent.content}
                              readOnly
                              className="min-h-[200px] text-sm bg-muted/30"
                            />
                          </div>

                          {/* Tags */}
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">话题标签</h3>
                            <div className="flex flex-wrap gap-2">
                              {extractedContent.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs cursor-pointer"
                                  onClick={() => handleCopy(tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Images */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium">
                                提取图片 ({extractedContent.images.length})
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBatchDownload}
                                className="h-6"
                              >
                                <Download className="h-3 w-3" />
                                全部��载
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {extractedContent.images.map((image, index) => (
                                <div
                                  key={index}
                                  className="group relative border border-border rounded-lg overflow-hidden"
                                >
                                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                  </div>
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDownloadImage(
                                          image.url,
                                          image.description,
                                        )
                                      }
                                      className="text-white h-6"
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1">
                                    <p className="truncate">
                                      {image.description}
                                    </p>
                                    <p className="text-gray-300">
                                      {image.size}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Settings Panel */}
              <div className="space-y-4">
                {/* Usage Stats */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">今日使用</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          已提取
                        </span>
                        <span className="text-sm font-medium">
                          {completedCount} 篇
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          剩余
                        </span>
                        <span className="text-sm font-medium">
                          {100 - completedCount} 篇
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-foreground h-2 rounded-full"
                          style={{ width: `${completedCount}%` }}
                        />
                      </div>
                      <Badge
                        variant="secondary"
                        className="w-full justify-center text-xs"
                      >
                        🎉 今日免费额度 100篇
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Extraction Settings */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Palette className="mr-2 h-4 w-4" />
                      提取设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">提取内容</label>
                      <div className="space-y-2">
                        {[
                          { label: "图片", icon: ImageIcon, key: "images" },
                          { label: "文字", icon: Type, key: "text" },
                          { label: "标签", icon: LinkIcon, key: "tags" },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <item.icon className="h-3 w-3" />
                              <span className="text-sm">{item.label}</span>
                            </div>
                            <Button
                              variant={
                                extractionSettings[
                                  item.key as keyof typeof extractionSettings
                                ]
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="h-6 w-12 text-xs"
                              onClick={() =>
                                setExtractionSettings((prev) => ({
                                  ...prev,
                                  [item.key]:
                                    !prev[item.key as keyof typeof prev],
                                }))
                              }
                            >
                              {extractionSettings[
                                item.key as keyof typeof extractionSettings
                              ]
                                ? "开启"
                                : "关闭"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Download Settings */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Folder className="mr-2 h-4 w-4" />
                      下载设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">图片格式</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["jpg", "png", "webp"].map((format) => (
                          <Button
                            key={format}
                            variant={
                              downloadSettings.format === format
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() =>
                              setDownloadSettings((prev) => ({
                                ...prev,
                                format,
                              }))
                            }
                          >
                            {format.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">保存路径</label>
                      <Input
                        value={downloadSettings.downloadPath}
                        onChange={(e) =>
                          setDownloadSettings((prev) => ({
                            ...prev,
                            downloadPath: e.target.value,
                          }))
                        }
                        className="text-xs"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      使用说明
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>• 仅支持公开的小红书笔记</p>
                      <p>• 支持完整链接和分享短链接</p>
                      <p>• 提取的内容仅供学习和参考</p>
                      <p>• 请遵守平台规定和版权法律</p>
                      <p>• 图片质量取决于原始内容</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="queue" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    提取队列 ({extractTasks.length})
                    {selectedTaskIds.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        已选择 {selectedTaskIds.length}
                      </Badge>
                    )}
                  </span>
                  <div className="flex space-x-2">
                    {selectedTaskIds.length > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7"
                        onClick={handleCancelSelected}
                        disabled={isCancellingTasks}
                      >
                        {isCancellingTasks ? (
                          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        取消选中
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      onClick={fetchExtractTasks}
                      disabled={isLoadingTasks}
                    >
                      {isLoadingTasks ? (
                        <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-1 h-3 w-3" />
                      )}
                      刷新
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingTasks ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-brand-accent mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        正在加载提取队列...
                      </p>
                    </div>
                  </div>
                ) : extractTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-center">
                      <Download className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        暂无正在处理的提取任务
                      </p>
                      <p className="text-xs text-muted-foreground">
                        请前往批量提取页面添加新任务
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {extractTasks.length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all"
                            checked={
                              selectedTaskIds.length === extractTasks.length &&
                              extractTasks.length > 0
                            }
                            onCheckedChange={handleSelectAll}
                          />
                          <label
                            htmlFor="select-all"
                            className="text-sm font-medium cursor-pointer"
                          >
                            全选 ({extractTasks.length} 个任务)
                          </label>
                        </div>
                        {selectedTaskIds.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            已选择 {selectedTaskIds.length} /{" "}
                            {extractTasks.length}
                          </span>
                        )}
                      </div>
                    )}
                    {extractTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 border border-border rounded-lg ${
                          selectedTaskIds.includes(task.id)
                            ? "bg-blue-50 border-blue-200"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <Checkbox
                              id={`task-${task.id}`}
                              checked={selectedTaskIds.includes(task.id)}
                              onCheckedChange={(checked) =>
                                handleSelectTask(task.id, checked as boolean)
                              }
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                {getStatusIcon(task.status)}
                                <h3 className="text-sm font-medium truncate">
                                  {task.content?.title || "正在提取内容..."}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getStatusColor(task.status)}`}
                                >
                                  {getStatusText(task.status)}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-2">
                                {task.url}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>小红书</span>
                                {task.content?.images && (
                                  <span>
                                    {task.content.images.length} 张图片
                                  </span>
                                )}
                                {task.created_at && (
                                  <span>
                                    {new Date(task.created_at).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {task.content && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() =>
                                  task.content && handleCopy(task.content.text)
                                }
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-600"
                              onClick={() => cancelTasks([task.id])}
                              disabled={isCancellingTasks}
                              title="取消任务"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {(task.status === "processing" ||
                          task.status === "queued") && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>提取进度</span>
                              <span>{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-2" />
                          </div>
                        )}
                        {task.error_message && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                            错误: {task.error_message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    提取历史 ({filteredHistoryTasks.length}/
                    {historyTasks.length})
                    {selectedHistoryTaskIds.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        已选择 {selectedHistoryTaskIds.length}
                      </Badge>
                    )}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7"
                      onClick={handleRetrySelected}
                      disabled={
                        isRetryingTasks || selectedHistoryTaskIds.length === 0
                      }
                    >
                      {isRetryingTasks ? (
                        <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <RotateCcw className="mr-1 h-3 w-3" />
                      )}
                      重试选中
                    </Button>
                    <div className="flex items-center space-x-1">
                      <Select
                        value={exportFormat}
                        onValueChange={setExportFormat}
                      >
                        <SelectTrigger className="h-7 w-20 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="markdown">MD</SelectItem>
                          <SelectItem value="xlsx">XLSX</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="default"
                        size="sm"
                        className="h-7 bg-green-600 hover:bg-green-700"
                        onClick={exportToCSV}
                        disabled={
                          isExportingCsv || selectedHistoryTaskIds.length === 0
                        }
                      >
                        {isExportingCsv ? (
                          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Download className="mr-1 h-3 w-3" />
                        )}
                        导出
                      </Button>
                    </div>
                    <Select
                      value={historyFilter}
                      onValueChange={setHistoryFilter}
                    >
                      <SelectTrigger className="h-7 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
                        <SelectItem value="failed">失败</SelectItem>
                        <SelectItem value="cancelled">已取消</SelectItem>
                        <SelectItem value="failed-cancelled">
                          失败 + 取消
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      onClick={fetchHistoryTasks}
                      disabled={isLoadingHistory}
                    >
                      {isLoadingHistory ? (
                        <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-1 h-3 w-3" />
                      )}
                      刷新
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-brand-accent mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        正在加载提取历史...
                      </p>
                    </div>
                  </div>
                ) : filteredHistoryTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-center">
                      <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {historyFilter === "all"
                          ? "暂无提取历史"
                          : `暂无${historyFilter === "completed" ? "已完成" : historyFilter === "failed" ? "失败" : historyFilter === "cancelled" ? "已取消" : "失败或取消"}的任务`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {historyFilter === "all"
                          ? "完成的提取任务将在这里显示"
                          : "请尝试其他筛选条件"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredHistoryTasks.length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all-history"
                            checked={
                              selectedHistoryTaskIds.length > 0 &&
                              selectedHistoryTaskIds.length ===
                                filteredHistoryTasks.filter(
                                  (task) =>
                                    task.status === "completed" ||
                                    task.status === "failed" ||
                                    task.status === "cancelled",
                                ).length
                            }
                            onCheckedChange={handleSelectAllHistory}
                          />
                          <label
                            htmlFor="select-all-history"
                            className="text-sm font-medium cursor-pointer"
                          >
                            全选 (
                            {
                              filteredHistoryTasks.filter(
                                (task) =>
                                  task.status === "completed" ||
                                  task.status === "failed" ||
                                  task.status === "cancelled",
                              ).length
                            }{" "}
                            个可选)
                          </label>
                        </div>
                        {selectedHistoryTaskIds.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            已选择 {selectedHistoryTaskIds.length} /{" "}
                            {
                              filteredHistoryTasks.filter(
                                (task) =>
                                  task.status === "completed" ||
                                  task.status === "failed" ||
                                  task.status === "cancelled",
                              ).length
                            }
                          </span>
                        )}
                      </div>
                    )}
                    {filteredHistoryTasks.map((task) => {
                      const isExpanded = expandedHistoryItems.includes(
                        parseInt(task.id),
                      );
                      const isRetryable =
                        task.status === "failed" || task.status === "cancelled";
                      const isSelectable =
                        task.status === "completed" ||
                        task.status === "failed" ||
                        task.status === "cancelled";
                      return (
                        <div
                          key={task.id}
                          className={`border border-border rounded-lg ${
                            selectedHistoryTaskIds.includes(task.id)
                              ? "bg-blue-50 border-blue-200"
                              : ""
                          }`}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start space-x-3 flex-1 min-w-0">
                                {isSelectable && (
                                  <Checkbox
                                    id={`history-task-${task.id}`}
                                    checked={selectedHistoryTaskIds.includes(
                                      task.id,
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleSelectHistoryTask(
                                        task.id,
                                        checked as boolean,
                                      )
                                    }
                                    className="mt-1"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    {getStatusIcon(task.status)}
                                    <h3 className="text-sm font-medium truncate">
                                      {task.content?.title || "提取内容"}
                                    </h3>
                                    <Badge
                                      variant="secondary"
                                      className={`text-xs ${getStatusColor(task.status)}`}
                                    >
                                      {getStatusText(task.status)}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate mb-2">
                                    {task.url}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span>小红书</span>
                                    {task.content?.images && (
                                      <span>
                                        {task.content.images.length} 张图片
                                      </span>
                                    )}
                                    {task.completed_at && (
                                      <span>
                                        {new Date(
                                          task.completed_at,
                                        ).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                  {task.status === "completed" &&
                                    task.content && (
                                      <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                                        <p className="line-clamp-1 font-medium">
                                          {task.content.title}
                                        </p>
                                      </div>
                                    )}
                                  {task.error_message && (
                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                                      错误: {task.error_message}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                {task.status === "completed" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      toggleHistoryExpansion(parseInt(task.id))
                                    }
                                    className="h-6 w-6 p-0"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                  </Button>
                                )}
                                {task.content && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleCopy(task.content?.text || "")
                                    }
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                )}
                                {isRetryable && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => retryTasks([task.id])}
                                    className="h-6 w-6 p-0 text-blue-600"
                                    title="重试任务"
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && task.content && (
                            <div className="border-t border-border p-4 bg-muted/20">
                              <div className="space-y-4">
                                {/* Author Info */}
                                {task.content.author && (
                                  <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      {task.content.author.avatar ? (
                                        <img
                                          src={task.content.author.avatar}
                                          alt={task.content.author.name}
                                          className="w-10 h-10 rounded-full"
                                        />
                                      ) : (
                                        <span className="text-sm">👤</span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        {task.content.author.name}
                                      </p>
                                      {task.content.author.followers && (
                                        <p className="text-xs text-muted-foreground">
                                          {task.content.author.followers} 粉丝
                                        </p>
                                      )}
                                    </div>
                                    <div className="ml-auto flex space-x-4 text-xs text-muted-foreground">
                                      {task.content.stats.likes && (
                                        <span>
                                          ❤️ {task.content.stats.likes}
                                        </span>
                                      )}
                                      {task.content.stats.comments && (
                                        <span>
                                          💬 {task.content.stats.comments}
                                        </span>
                                      )}
                                      {task.content.stats.shares && (
                                        <span>
                                          🔗 {task.content.stats.shares}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Extracted Text */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">
                                      提取的文字内容
                                    </h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleCopy(task.content?.text || "")
                                      }
                                      className="h-6"
                                    >
                                      <Copy className="h-3 w-3 mr-1" />
                                      复制文字
                                    </Button>
                                  </div>
                                  <div className="bg-background p-3 rounded-lg text-sm max-h-40 overflow-y-auto">
                                    {task.content.text}
                                  </div>
                                </div>

                                {/* Tags */}
                                {task.content.tags &&
                                  task.content.tags.length > 0 && (
                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium">
                                        话题标签
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {task.content.tags.map(
                                          (tag: string, index: number) => (
                                            <Badge
                                              key={index}
                                              variant="outline"
                                              className="text-xs cursor-pointer"
                                              onClick={() => handleCopy(tag)}
                                            >
                                              #{tag}
                                            </Badge>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Images */}
                                {task.content.images &&
                                  task.content.images.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium">
                                          提取图片 ({task.content.images.length}
                                          )
                                        </h4>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={handleBatchDownload}
                                          className="h-6"
                                        >
                                          <Download className="h-3 w-3 mr-1" />
                                          下载图片
                                        </Button>
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {task.content.images.map(
                                          (image: any, index: number) => (
                                            <div
                                              key={index}
                                              className="group relative border border-border rounded-lg overflow-hidden bg-gray-100"
                                            >
                                              <div className="aspect-square flex items-center justify-center">
                                                <img
                                                  src={image.url}
                                                  alt={image.description}
                                                  className="w-full h-full object-cover"
                                                  onError={(e) => {
                                                    e.currentTarget.style.display =
                                                      "none";
                                                    const nextElement = e
                                                      .currentTarget
                                                      .nextElementSibling as HTMLElement;
                                                    if (nextElement) {
                                                      nextElement.style.display =
                                                        "flex";
                                                    }
                                                  }}
                                                />
                                                <div className="hidden w-full h-full items-center justify-center">
                                                  <ImageIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                              </div>
                                              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1">
                                                <p className="truncate text-xs">
                                                  {image.description}
                                                </p>
                                                <p className="text-gray-300 text-xs">
                                                  {image.fileSize}
                                                </p>
                                              </div>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
