import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  { type: "audio", formats: ["MP3", "WAV", "M4A", "AAC", "OGG"] },
  { type: "video", formats: ["MP4", "AVI", "MOV", "MKV", "WEBM"] },
];

const extractedResult = {
  fileName: "音频文件.mp3",
  duration: "03:42",
  fileSize: "8.5 MB",
  extractedText: `大家好，欢迎来到今天的分享。

今天我想和大家聊聊关于个人成长的话题。在这个快速发展的时代，我们每个人都面临着各种各样的挑战和机遇。

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
  const [activeTab, setActiveTab] = useState("upload");
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");

  const handleFileUpload = async () => {
    setIsExtracting(true);
    setProgress(0);

    // 模拟上传和提取进度
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExtracting(false);
          setShowResults(true);
          setExtractedText(extractedResult.extractedText);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

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
                支持格式：MP3、MP4、WAV、M4A、AAC、AVI、MOV、MKV、WEBM
              </div>
              <div className="text-sm text-muted-foreground">
                单个文件大小���超过2000M(建议不超过30分钟)
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
                  <Upload className="mr-2 h-4 w-4" />
                  文件上传
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
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

                  <TabsContent value="upload" className="space-y-4">
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center bg-orange-50/50">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                          <FileAudio className="h-8 w-8 text-orange-600" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-800">
                            拖拽文件到此处或点击上传
                          </p>
                          <p className="text-sm text-gray-600">
                            支持 MP3、MP4、WAV 等格式，最大 2GB
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={handleFileUpload}
                            className="border-orange-300 text-orange-700 hover:bg-orange-50"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            选择文件
                          </Button>
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
                            点击开始录音，实时转换为文字
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <Mic className="mr-2 h-4 w-4" />
                            开始录音
                          </Button>
                          <Button variant="ghost" disabled>
                            <Pause className="mr-2 h-4 w-4" />
                            停止
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Results Section */}
            {showResults && (
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
                        onClick={() =>
                          handleCopy(extractedResult.extractedText)
                        }
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
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            文件名：
                          </span>
                          <span className="font-medium">
                            {extractedResult.fileName}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">时长：</span>
                          <span className="font-medium">
                            {extractedResult.duration}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">大小：</span>
                          <span className="font-medium">
                            {extractedResult.fileSize}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            识别率：
                          </span>
                          <span className="font-medium text-green-600">
                            {extractedResult.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Extracted Text */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">提取的文字内容</h3>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>语言：{extractedResult.language}</span>
                          <span>•</span>
                          <span>说话人：{extractedResult.speakers}人</span>
                        </div>
                      </div>
                      <Textarea
                        value={extractedText}
                        onChange={(e) => setExtractedText(e.target.value)}
                        className="min-h-[200px] text-sm"
                        placeholder="提取的文字内容将显示在这里..."
                      />
                    </div>

                    {/* Keywords */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">关键词</h3>
                      <div className="flex flex-wrap gap-2">
                        {extractedResult.keywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs cursor-pointer"
                            onClick={() => handleCopy(keyword)}
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
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

            {/* Recognition Settings */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Volume2 className="mr-2 h-4 w-4" />
                  识别设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">语言���择</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["中文", "英文", "日文", "韩文"].map((lang) => (
                      <Button
                        key={lang}
                        variant={lang === "中文" ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs"
                      >
                        {lang}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">识别模式</label>
                  <div className="space-y-2">
                    {[
                      { label: "高精度模式", desc: "准确率更高，速度较慢" },
                      { label: "快速模式", desc: "速度更快，准确率较高" },
                    ].map((mode, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border border-border rounded"
                      >
                        <div>
                          <p className="text-sm font-medium">{mode.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {mode.desc}
                          </p>
                        </div>
                        <Button
                          variant={index === 0 ? "default" : "outline"}
                          size="sm"
                          className="h-6 w-12 text-xs"
                        >
                          {index === 0 ? "使用" : "选择"}
                        </Button>
                      </div>
                    ))}
                  </div>
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
                  <p>• 识别结果支持手动编��</p>
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
