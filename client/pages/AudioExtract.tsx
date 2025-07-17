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
} from "lucide-react";

const supportedFormats = [
  {
    type: "audio",
    formats: ["MP3", "WAV", "FLAC", "AAC", "OPUS", "OGG", "M4A"],
  },
  { type: "video", formats: ["MP4", "MPEG", "MOV", "WEBM"] },
];

const supportedLanguages = [
  { code: "mandarin", name: "中文", flag: "🇨🇳" },
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
  const [language, setLanguage] = useState<string>("mandarin");
  const [error, setError] = useState<string | null>(null);
  const [actualResult, setActualResult] = useState<any>(null);

  const AUTH_TOKEN = import.meta.env.VITE_BACKEND_API_TOKEN;

  const handleExtractText = async (
    source: "link" | "file" | "recording",
    data?: File | Blob,
  ) => {
    setIsExtracting(true);
    setProgress(0);
    setError(null);
    setShowResults(false);

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

      // 模拟进度（实际上传时可以使用 XMLHttpRequest 监听上传进度）
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 20, 90));
      }, 500);

      const response = await fetch(
        "http://127.0.0.1:8000/api/audio-transcript/extract",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          body: formData,
        },
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`,
        );
      }

      const result = await response.json();
      setActualResult(result);

      // 根据返回格式处理结果
      if (responseFormat === "json" || responseFormat === "verbose_json") {
        setExtractedText(result.transcript || "");
      } else {
        setExtractedText(result.transcript || "");
      }

      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提取失败，请重试");
      console.error("提取文字失败:", err);
    } finally {
      setIsExtracting(false);
      setProgress(0);
    }
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

  // 清理音频URL，防止内存泄漏
  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

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
                  <TabsList className="grid w-full grid-cols-3 mb-4">
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
                          支持抖音、YouTube、B站等主流平��视频链接
                        </div>
                      </div>

                      {isExtracting && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>正在提取音频并转换文字...</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-muted-foreground text-center">
                            AI正在从视频中提取音频并分析内容...
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
                          <Button
                            variant="ghost"
                            className="text-orange-700 hover:bg-orange-50"
                          >
                            从云盘导入
                          </Button>
                        </div>
                      </div>
                    </div>

                    {isExtracting && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>正在提取文字...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="text-xs text-muted-foreground text-center">
                          AI正在分析音频内容，请稍候...
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

            {/* Results Section */}
            {showResults && actualResult && (
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
                    {/* File Info */}
                    {actualResult.file_info && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              文件名：
                            </span>
                            <span className="font-medium">
                              {actualResult.file_info.filename || "未知"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              时长：
                            </span>
                            <span className="font-medium">
                              {actualResult.file_info.duration
                                ? `${Math.floor(actualResult.file_info.duration / 60)}:${(actualResult.file_info.duration % 60).toString().padStart(2, "0")}`
                                : "未知"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              格式：
                            </span>
                            <span className="font-medium">
                              {actualResult.file_info.format?.toUpperCase() ||
                                "未知"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Extracted Text */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">提取的文字内容</h3>
                        {actualResult.language && (
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>语言：{actualResult.language}</span>
                            {actualResult.speakers && (
                              <>
                                <span>•</span>
                                <span>说话人：{actualResult.speakers}人</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <Textarea
                        value={extractedText}
                        onChange={(e) => setExtractedText(e.target.value)}
                        className="min-h-[200px] text-sm"
                        placeholder="提取的文字内容将显示在这里..."
                      />
                    </div>

                    {/* Keywords - 如果API返回关键词 */}
                    {actualResult.keywords &&
                      actualResult.keywords.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">关键词</h3>
                          <div className="flex flex-wrap gap-2">
                            {actualResult.keywords.map(
                              (keyword: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs cursor-pointer"
                                  onClick={() => handleCopy(keyword)}
                                >
                                  {keyword}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
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
