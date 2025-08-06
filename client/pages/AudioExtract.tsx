import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AudioLines,
  Video,
  Upload,
  Copy,
  Download,
  RefreshCw,
  Settings,
  FileAudio,
  FileVideo,
  Play,
  Pause,
  Clock,
  FileText,
  Mic,
  CheckCircle,
  AlertTriangle,
  Zap,
  Link as LinkIcon,
  Eye,
} from "lucide-react";

const supportedFormats = [
  {
    type: "audio",
    formats: ["MP3", "WAV", "FLAC", "AAC", "OPUS", "OGG", "M4A"],
  },
  { type: "video", formats: ["MP4", "MPEG", "MOV", "WEBM"] },
];

const supportedLanguages = [
  { code: "chinese", name: "中文", flag: "🇨🇳" },
  { code: "english", name: "English", flag: "🇺🇸" },
  { code: "japanese", name: "日本語", flag: "🇯🇵" },
  { code: "korean", name: "한국어", flag: "🇰🇷" },
  { code: "french", name: "Français", flag: "🇫🇷" },
  { code: "german", name: "Deutsch", flag: "🇩🇪" },
  { code: "spanish", name: "Español", flag: "🇪🇸" },
  { code: "italian", name: "Italiano", flag: "🇮🇹" },
  { code: "portuguese", name: "Português", flag: "🇵🇹" },
  { code: "russian", name: "Русский", flag: "🇷🇺" },
  { code: "arabic", name: "العربية", flag: "🇸🇦" },
  { code: "turkish", name: "Türkçe", flag: "🇹🇷" },
  { code: "dutch", name: "Nederlands", flag: "🇳🇱" },
  { code: "swedish", name: "Svenska", flag: "🇸🇪" },
  { code: "polish", name: "Polski", flag: "🇵🇱" },
  { code: "catalan", name: "Català", flag: "🇪🇸" },
  { code: "indonesian", name: "Bahasa Indonesia", flag: "🇮🇩" },
];

const extractedResult = {
  fileName: "音频文件.mp3",
  duration: "03:42",
  fileSize: "8.5 MB",
  extractedText: `大家好，欢迎来到今天的分享。

今天���想和大家聊聊关于个人成长的话题。在这个快速发展的时代，我们每个人都面临着各种各样的挑战和机遇。

首先，我认为学习是最重要的。无论你现在处于人生的哪个阶段，持续学习都是必不可少的。学习不仅仅是获取知识，更重要的是培养我们的思维能力和解决问题的能力。

其次，我想强调坚持的重要性。很多时候，成功和失败之间的差距就在于是否能够坚持下去。当我们遇到困难的时候，不要轻易放弃，要相信自己的能力。

最后，我想说的是要保持积极的心态。积极的心态能够帮助我们更好地面对生活中的挑战，也能够吸引更多的正能量。

希望今天的分享对大家有所帮助，谢谢大家的聆听。`,
  confidence: 96,
  language: "中文",
  speakers: 1,
  keywords: ["个人成长", "学习", "坚持", "积极心态", "挑战"],
};

export default function AudioExtract() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("link");
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [responseFormat, setResponseFormat] = useState<string>("json");
  const [speakerLabels, setSpeakerLabels] = useState(false);
  const [language, setLanguage] = useState<string>("chinese");
  const [error, setError] = useState<string | null>(null);
  const [actualResult, setActualResult] = useState<any>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [historyTasks, setHistoryTasks] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<string>("completed");
  const [historyOffset, setHistoryOffset] = useState(0);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyLimit] = useState(10);

  const AUTH_TOKEN = import.meta.env.VITE_BACKEND_API_TOKEN;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  // Use useRef to store the interval ID to ensure we can clear it properly
  const pollingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Poll for task results
  const pollTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/audio-transcript/result/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to get task status: ${response.status}`);
      }

      const result = await response.json();
      setTaskStatus(result.status);
      setProgress(result.progress || 0);

      if (result.status === "COMPLETED") {
        // Clear polling interval
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          setPollingInterval(null);
        }

        // Set results
        setActualResult(result);
        setExtractedText(result.output_data || "");
        setShowResults(true);
        setIsExtracting(false);
        setProgress(100);
        return; // Stop polling
      } else if (result.status === "FAILED") {
        // Clear polling interval
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          setPollingInterval(null);
        }

        throw new Error(result.error_message || "转录任务失败");
      }
      // Continue polling for PENDING/PROCESSING status
    } catch (err) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        setPollingInterval(null);
      }
      setError(err instanceof Error ? err.message : "获取任务状态失败");
      setIsExtracting(false);
      console.error("获取任务状态失败:", err);
    }
  };

  const handleExtractText = async (
    source: "link" | "file" | "recording",
    data?: File | Blob,
  ) => {
    setIsExtracting(true);
    setProgress(0);
    setError(null);
    setShowResults(false);
    setTaskId(null);
    setTaskStatus("");

    // Clear any existing polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setPollingInterval(null);
    }

    try {
      const formData = new FormData();

      if (source === "link") {
        formData.append("type", "url");
        formData.append("url", videoUrl);
      } else {
        formData.append("type", "file");
        if (source === "recording" && data) {
          // 将录音 Blob 转换为 File
          const audioFile = new File([data], "recording.webm", {
            type: "audio/webm",
          });
          formData.append("file", audioFile);
        } else if (data) {
          formData.append("file", data as File);
        }
      }

      formData.append("response_format", responseFormat);
      formData.append("language", language);
      formData.append("speaker_labels", speakerLabels.toString());

      // Submit transcription task
      const response = await fetch(
        `${API_BASE_URL}/api/audio-transcript/extract`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`,
        );
      }

      const result = await response.json();
      
      if (!result.success || !result.task_id) {
        throw new Error(result.message || "任务提交失败");
      }

      setTaskId(result.task_id);
      setTaskStatus("PENDING");
      
      // Start polling for results every 8 seconds
      const interval = setInterval(() => {
        pollTaskStatus(result.task_id);
      }, 8000);
      
      pollingIntervalRef.current = interval;
      setPollingInterval(interval);
      
      // Initial poll after 2 seconds
      setTimeout(() => {
        pollTaskStatus(result.task_id);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "提取失败，请重试");
      setIsExtracting(false);
      console.error("提取文字失败:", err);
    }
  };

  const cancelTask = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setPollingInterval(null);
    }
    setIsExtracting(false);
    setTaskId(null);
    setTaskStatus("");
    setProgress(0);
  };

  const fetchHistory = async (offset = 0, resetTasks = true) => {
    setIsLoadingHistory(true);
    try {
      const params = new URLSearchParams({
        limit: historyLimit.toString(),
        offset: offset.toString(),
      });
      
      // Always filter for completed tasks only
      params.append("status", "COMPLETED");

      const response = await fetch(
        `${API_BASE_URL}/api/audio-transcript/tasks?${params}`,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.status}`);
      }

      const data = await response.json();
      
      if (resetTasks) {
        setHistoryTasks(data.tasks || []);
      } else {
        setHistoryTasks(prev => [...prev, ...(data.tasks || [])]);
      }
      
      setHistoryTotal(data.total || 0);
      setHistoryOffset(offset);
      
    } catch (err) {
      console.error("获取历史记录失败:", err);
      setError(err instanceof Error ? err.message : "获取历史记录失败");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadMoreHistory = () => {
    const newOffset = historyOffset + historyLimit;
    fetchHistory(newOffset, false);
  };

  const refreshHistory = () => {
    fetchHistory(0, true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        setAudioChunks([audioBlob]);

        // 创建音频URL供播放
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // 创建音频元素
        const audio = new Audio(url);
        setAudioElement(audio);

        // 监听播放结束事件
        audio.addEventListener("ended", () => {
          setIsPlaying(false);
        });
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // 开始计时
      setRecordingDuration(0);
      const timer = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      setRecordingTimer(timer);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);

      // 停止计时
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }
    }
  };

  const playAudio = () => {
    if (audioElement && audioUrl) {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    // 停止播放
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }

    // 清理音频URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    // 重置状态
    setAudioChunks([]);
    setAudioUrl(null);
    setAudioElement(null);
    setRecordingDuration(0);
  };

  // 清理音频URL和轮询定时器，防止内存泄漏
  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [audioUrl]);

  // Fetch history when component mounts
  React.useEffect(() => {
    if (activeTab === "history") {
      fetchHistory(0, true);
    }
  }, [activeTab]);

  // Clear results when switching between input tabs (not history)
  React.useEffect(() => {
    if (activeTab !== "history") {
      // Clear results when switching between input tabs
      setShowResults(false);
      setActualResult(null);
      setExtractedText("");
      setError(null);
    }
  }, [activeTab]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([extractedResult.extractedText], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "提取文字.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <DashboardLayout
      title="音视频提取文字"
      subtitle="使用AI语音识别技术，快速将音视频内容转换为文字"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <Zap className="mr-2 h-3.5 w-3.5" />
            批量处理
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Supported Formats */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <AudioLines className="mr-2 h-4 w-4" />
              音视频文字提取公众
              <Badge
                variant="secondary"
                className="ml-2 text-xs bg-orange-100 text-orange-800"
              >
                高精度识别
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                支持格式：MP3、MP4、WAV、FLAC、AAC、OPUS、OGG、M4A、MPEG、MOV、WEBM
              </div>
              <div className="text-sm text-muted-foreground">
                单个文件大小不超过100MB，最大时长30分钟，支持16种主流语言
              </div>
              <div className="grid grid-cols-2 gap-4">
                {supportedFormats.map((category) => (
                  <div
                    key={category.type}
                    className="flex items-center space-x-2"
                  >
                    {category.type === "audio" ? (
                      <FileAudio className="h-4 w-4 text-blue-600" />
                    ) : (
                      <FileVideo className="h-4 w-4 text-purple-600" />
                    )}
                    <div className="flex flex-wrap gap-1">
                      {category.formats.map((format) => (
                        <Badge
                          key={format}
                          variant="outline"
                          className="text-xs h-5"
                        >
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <AudioLines className="mr-2 h-4 w-4" />
                  音视频提取
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger
                      value="link"
                      className="flex items-center space-x-1"
                    >
                      <LinkIcon className="h-3 w-3" />
                      <span>视频链接</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="upload"
                      className="flex items-center space-x-1"
                    >
                      <Upload className="h-3 w-3" />
                      <span>文件上传</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="record"
                      className="flex items-center space-x-1"
                    >
                      <Mic className="h-3 w-3" />
                      <span>实时录音</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="flex items-center space-x-1"
                    >
                      <Clock className="h-3 w-3" />
                      <span>提取历史</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="link" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">视频链接</label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="请输入视频链接，如：https://www.douyin.com/video/..."
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleExtractText("link")}
                            disabled={!videoUrl.trim() || isExtracting}
                            className="h-10"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            提取文字
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          支持抖音、TikTok、小红书、快手、B站、Instagram、X等平台视频链接
                        </div>
                      </div>

                      {isExtracting && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>
                              {taskStatus === "PENDING" && "任务已提交，等待处理..."}
                              {taskStatus === "PROCESSING" && "正在提取音频并转换文字..."}
                              {!taskStatus && "正在提交任务..."}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span>{progress}%</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelTask}
                                className="h-6 px-2"
                              >
                                取消
                              </Button>
                            </div>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-muted-foreground text-center">
                            {taskStatus === "PENDING" && "任务排队中，请稍候..."}
                            {taskStatus === "PROCESSING" && "AI正在从视频中提取音频并分析内容..."}
                            {!taskStatus && "正在连接服务器..."}
                            {taskId && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                任务ID: {taskId}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-4">
                    <div
                      className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center bg-orange-50/50"
                      onDrop={handleFileDrop}
                      onDragOver={handleDragOver}
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                          <FileAudio className="h-8 w-8 text-orange-600" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-800">
                            {selectedFile
                              ? selectedFile.name
                              : "拖拽文件到此处或点击上传"}
                          </p>
                          <p className="text-sm text-gray-600">
                            支持 MP3、MP4、WAV 等格式，最大 100MB
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".mp3,.wav,.flac,.aac,.opus,.ogg,.m4a,.mp4,.mpeg,.mov,.webm"
                            onChange={handleFileSelect}
                          />
                          <label htmlFor="file-upload">
                            <Button
                              variant="outline"
                              className="border-orange-300 text-orange-700 hover:bg-orange-50"
                              asChild
                            >
                              <span>
                                <Upload className="mr-2 h-4 w-4" />
                                选择文件
                              </span>
                            </Button>
                          </label>
                          {selectedFile && (
                            <Button
                              onClick={() =>
                                handleExtractText("file", selectedFile)
                              }
                              disabled={isExtracting}
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              提取文字
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {isExtracting && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {taskStatus === "PENDING" && "任务已提交，等待处理..."}
                            {taskStatus === "PROCESSING" && "正在提取文字..."}
                            {!taskStatus && "正在上传文件..."}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span>{progress}%</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelTask}
                              className="h-6 px-2"
                            >
                              取消
                            </Button>
                          </div>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="text-xs text-muted-foreground text-center">
                          {taskStatus === "PENDING" && "任务排队中，请稍候..."}
                          {taskStatus === "PROCESSING" && "AI正在分析音频内容，请稍候..."}
                          {!taskStatus && "正在上传文件到服务器..."}
                          {taskId && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              任务ID: {taskId}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="record" className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                          <Mic className="h-8 w-8 text-red-600" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium">实时录音转文字</p>
                          <p className="text-sm text-muted-foreground">
                            点击开始录音，实时转音视频文件为文字
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {!isRecording ? (
                            <Button
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50"
                              onClick={startRecording}
                            >
                              <Mic className="mr-2 h-4 w-4" />
                              开始录音
                            </Button>
                          ) : (
                            <Button
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={stopRecording}
                            >
                              <Pause className="mr-2 h-4 w-4" />
                              停止录音
                            </Button>
                          )}
                          {audioChunks.length > 0 && !isRecording && (
                            <>
                              <div className="flex space-x-2">
                                {!isPlaying ? (
                                  <Button
                                    onClick={playAudio}
                                    variant="outline"
                                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                  >
                                    <Play className="mr-2 h-4 w-4" />
                                    播放录音
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={pauseAudio}
                                    variant="outline"
                                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                  >
                                    <Pause className="mr-2 h-4 w-4" />
                                    暂停
                                  </Button>
                                )}
                                <Button
                                  onClick={() =>
                                    handleExtractText(
                                      "recording",
                                      audioChunks[0],
                                    )
                                  }
                                  disabled={isExtracting}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  提取文字
                                </Button>
                                <Button
                                  onClick={resetRecording}
                                  variant="ghost"
                                  size="icon"
                                  title="重新录音"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                        {isRecording && (
                          <div className="space-y-2">
                            <div className="text-sm text-red-600 animate-pulse">
                              正在录音中...
                            </div>
                            <div className="text-sm text-muted-foreground">
                              录音时长:{" "}
                              {Math.floor(recordingDuration / 60)
                                .toString()
                                .padStart(2, "0")}
                              :
                              {(recordingDuration % 60)
                                .toString()
                                .padStart(2, "0")}
                            </div>
                          </div>
                        )}
                        {audioChunks.length > 0 && !isRecording && (
                          <div className="text-sm text-muted-foreground">
                            录音时长:{" "}
                            {Math.floor(recordingDuration / 60)
                              .toString()
                              .padStart(2, "0")}
                            :
                            {(recordingDuration % 60)
                              .toString()
                              .padStart(2, "0")}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <div className="space-y-4">
                      {/* Header with refresh button */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">已完成的提取记录</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={refreshHistory}
                          disabled={isLoadingHistory}
                          className="h-8"
                        >
                          <RefreshCw className={`mr-2 h-3 w-3 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                          刷新
                        </Button>
                      </div>

                      {/* History List */}
                      {isLoadingHistory && historyTasks.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <RefreshCw className="h-8 w-8 animate-spin text-brand-accent mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">加载历史记录中...</p>
                          </div>
                        </div>
                      ) : historyTasks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Clock className="h-8 w-8 mx-auto mb-4 opacity-50" />
                          <p>暂无已完成的提取记录</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {historyTasks.map((task) => (
                            <div
                              key={task.task_id}
                              className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-sm font-mono text-muted-foreground">
                                      {task.task_id.slice(0, 8)}...
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(task.created_at).toLocaleString()}
                                    </span>
                                  </div>
                                  
                                  <div className="text-sm text-muted-foreground mb-2">
                                    {task.input_data?.type === "url" ? (
                                      <span>视频链接: {task.input_data.url?.slice(0, 50)}...</span>
                                    ) : (
                                      <span>文件上传</span>
                                    )}
                                    {task.input_data?.language && (
                                      <span className="ml-2">• {task.input_data.language}</span>
                                    )}
                                  </div>

                                  {task.output_data && (
                                    <div className="text-sm bg-muted/30 p-2 rounded mt-2 max-h-20 overflow-hidden">
                                      <p className="line-clamp-2">
                                        {(() => {
                                          const outputText = typeof task.output_data === 'string' 
                                            ? task.output_data 
                                            : task.output_data.text || JSON.stringify(task.output_data);
                                          return outputText.slice(0, 150) + (outputText.length > 150 ? "..." : "");
                                        })()}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-1 ml-2">
                                  {task.output_data && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const outputText = typeof task.output_data === 'string' 
                                            ? task.output_data 
                                            : task.output_data.text || JSON.stringify(task.output_data);
                                          handleCopy(outputText);
                                        }}
                                        className="h-6 w-6 p-0"
                                        title="复制文本"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const outputText = typeof task.output_data === 'string' 
                                            ? task.output_data 
                                            : task.output_data.text || JSON.stringify(task.output_data);
                                          const element = document.createElement("a");
                                          const file = new Blob([outputText], { type: "text/plain" });
                                          element.href = URL.createObjectURL(file);
                                          element.download = `提取文字_${task.task_id.slice(0, 8)}.txt`;
                                          document.body.appendChild(element);
                                          element.click();
                                          document.body.removeChild(element);
                                          URL.revokeObjectURL(element.href);
                                        }}
                                        className="h-6 w-6 p-0"
                                        title="下载文本"
                                      >
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Load More Button */}
                          {historyTasks.length < historyTotal && (
                            <div className="text-center pt-4">
                              <Button
                                variant="outline"
                                onClick={loadMoreHistory}
                                disabled={isLoadingHistory}
                                className="h-8"
                              >
                                {isLoadingHistory ? (
                                  <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                                ) : (
                                  <span>加载更多</span>
                                )}
                              </Button>
                              <p className="text-xs text-muted-foreground mt-2">
                                已显示 {historyTasks.length} / {historyTotal} 条记录
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Results Section - Only show when not on history tab */}
            {showResults && actualResult && activeTab !== "history" && (
              <Card className="border border-border mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      提取结果
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(extractedText)}
                        className="h-6"
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        复制
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownload}
                        className="h-6"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        下载
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Task Info */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            任务ID：
                          </span>
                          <span className="font-medium font-mono text-xs">
                            {actualResult.task_id || "未知"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            状态：
                          </span>
                          <span className="font-medium">
                            {actualResult.status === "COMPLETED" && "已完成"}
                            {actualResult.status === "PROCESSING" && "处理中"}
                            {actualResult.status === "PENDING" && "等待中"}
                            {actualResult.status === "FAILED" && "失败"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            输入类型：
                          </span>
                          <span className="font-medium">
                            {actualResult.input_data?.type === "url" ? "视频链接" : "文件上传"}
                          </span>
                        </div>
                        {actualResult.input_data?.language && (
                          <div>
                            <span className="text-muted-foreground">
                              语言：
                            </span>
                            <span className="font-medium">
                              {actualResult.input_data.language}
                            </span>
                          </div>
                        )}
                        {actualResult.created_at && (
                          <div>
                            <span className="text-muted-foreground">
                              创建时间：
                            </span>
                            <span className="font-medium">
                              {new Date(actualResult.created_at).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {actualResult.completed_at && (
                          <div>
                            <span className="text-muted-foreground">
                              完成时间：
                            </span>
                            <span className="font-medium">
                              {new Date(actualResult.completed_at).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Extracted Text */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">提取的文字内容</h3>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>
                            语言：{actualResult.input_data?.language || "自动检测"}
                          </span>
                          <span>•</span>
                          <span>
                            格式：{actualResult.input_data?.response_format || "json"}
                          </span>
                        </div>
                      </div>
                      <Textarea
                        value={extractedText}
                        onChange={(e) => setExtractedText(e.target.value)}
                        className="min-h-[200px] text-sm"
                        placeholder="提取的文字内容将显示在这里..."
                      />
                    </div>

                    {/* Error Message if task failed */}
                    {actualResult.error_message && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {actualResult.error_message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Settings Panel */}
          <div className="space-y-4">
            {/* Extract Settings */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  提取设置
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language-select">音频语言</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {supportedLanguages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center space-x-2">
                              <span>{lang.flag}</span>
                              <span>{lang.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response-format">返回格式</Label>
                    <Select
                      value={responseFormat}
                      onValueChange={setResponseFormat}
                    >
                      <SelectTrigger id="response-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON格式</SelectItem>
                        <SelectItem value="text">纯文本</SelectItem>
                        <SelectItem value="srt">SRT字幕</SelectItem>
                        <SelectItem value="verbose_json">
                          详细JSON(含说话人)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="speaker-labels">说话人标识</Label>
                    <Switch
                      id="speaker-labels"
                      checked={speakerLabels}
                      onCheckedChange={(checked) => {
                        setSpeakerLabels(checked);
                        if (checked && responseFormat !== "verbose_json") {
                          setResponseFormat("verbose_json");
                        }
                      }}
                      disabled={responseFormat !== "verbose_json"}
                    />
                  </div>

                  {speakerLabels && responseFormat !== "verbose_json" && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        说话人标识仅在"详细JSON"格式下可用
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Usage Stats */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">今日使用</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      已使用
                    </span>
                    <span className="text-sm font-medium">10 次</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      剩余时长
                    </span>
                    <span className="text-sm font-medium">90 分钟</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-foreground h-2 rounded-full"
                      style={{ width: "10%" }}
                    />
                  </div>
                  <Badge
                    variant="secondary"
                    className="w-full justify-center text-xs"
                  >
                    🎉 每日免费时长 100分钟
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  使用提示
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• 建议上传清晰的音频文件</p>
                  <p>• 支持多人对话的识别分离</p>
                  <p>• 长音频文件会分段处理</p>
                  <p>• 识别结果支持手动编辑</p>
                  <p>• 可导出为多种文本格式</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
