import React, { useState } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  RefreshCw,
  Settings,
  FileText,
  MessageCircle,
  Mic,
  Eye,
  AlertCircle,
} from "lucide-react";

const platformStyles = [
  { id: "douyin", name: "抖音", emoji: "🎤", active: true },
  { id: "xiaohongshu", name: "小红书", emoji: "📖", active: false },
];

interface ForbiddenWord {
  word: string;
  type: string;
  risk: string;
  reason: string;
}

interface DetectionResult {
  totalWords: number;
  forbiddenCount: number;
  riskLevel: string;
  forbiddenWords: ForbiddenWord[];
  suggestions: string[];
  cleanedText?: string;
}

interface MediaTaskResult {
  taskId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  transcript?: string;
  forbiddenCheckResult?: DetectionResult;
  createdAt: string;
  updatedAt: string;
}

export default function ForbiddenWords() {
  const [inputText, setInputText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [activePlatform, setActivePlatform] = useState("douyin");
  const [activeTab, setActiveTab] = useState("text");
  const [showResults, setShowResults] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isDocumentChecking, setIsDocumentChecking] = useState(false);
  const [isAudioChecking, setIsAudioChecking] = useState(false);
  const [documentText, setDocumentText] = useState("");
  const [audioText, setAudioText] = useState("");
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [mediaTaskId, setMediaTaskId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const AUTH_TOKEN = import.meta.env.VITE_BACKEND_API_TOKEN;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleCheck = async () => {
    if (!inputText.trim()) return;

    setIsChecking(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/forbidden-words/check-text`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputText: inputText,
            platform: activePlatform,
          }),
        },
      );

      if (response.ok) {
        const result: DetectionResult = await response.json();
        setDetectionResult(result);
        setShowResults(true);
      } else {
        console.error("检测失败:", await response.text());
      }
    } catch (error) {
      console.error("检测失败:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDocumentCheck = async () => {
    if (!selectedFile) return;

    setIsDocumentChecking(true);
    try {
      const formData = new FormData();
      formData.append("input_file", selectedFile);
      formData.append("platform", activePlatform);

      const response = await fetch(
        `${API_BASE_URL}/api/forbidden-words/check-doc`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        const result: DetectionResult = await response.json();
        
        // Extract and set the cleaned text as the document content
        if (result.cleanedText) {
          setDocumentText(result.cleanedText);
          setInputText(result.cleanedText);
        }
        
        // Set the detection result and show results
        setDetectionResult(result);
        setShowResults(true);
      } else {
        console.error("文档检测失败:", await response.text());
      }
    } catch (error) {
      console.error("文档检测失败:", error);
    } finally {
      setIsDocumentChecking(false);
    }
  };

  const checkMediaResult = async (taskId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/forbidden-words/media-result/${taskId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        },
      );

      if (response.ok) {
        const result: MediaTaskResult = await response.json();
        
        if (result.status === 'COMPLETED') {
          // Clear polling interval
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          
          // Set results
          if (result.transcript) {
            setAudioText(result.transcript);
            setInputText(result.transcript);
          }
          
          if (result.forbiddenCheckResult) {
            setDetectionResult(result.forbiddenCheckResult);
            setShowResults(true);
          }
          
          setIsAudioChecking(false);
        } else if (result.status === 'FAILED') {
          // Clear polling interval
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          console.error("音频处理失败");
          setIsAudioChecking(false);
        }
        // Continue polling if status is PENDING or PROCESSING
      }
    } catch (error) {
      console.error("获取音频检测结果失败:", error);
    }
  };

  const handleAudioCheck = async () => {
    if (!audioFile) return;

    setIsAudioChecking(true);
    try {
      const formData = new FormData();
      formData.append("input_file", audioFile);
      formData.append("platform", activePlatform);

      const response = await fetch(
        `${API_BASE_URL}/api/forbidden-words/check-media`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.taskId) {
          setMediaTaskId(result.taskId);
          
          // Start polling for results
          const interval = setInterval(() => {
            checkMediaResult(result.taskId);
          }, 10000); // Poll every 10 seconds
          
          setPollingInterval(interval);
        }
      } else {
        console.error("音频上传失败:", await response.text());
        setIsAudioChecking(false);
      }
    } catch (error) {
      console.error("音频检测失败:", error);
      setIsAudioChecking(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const highlightForbiddenWords = (text: string) => {
    if (!detectionResult?.forbiddenWords) return text;
    
    let highlightedText = text;
    detectionResult.forbiddenWords.forEach((item) => {
      const escapedWord = item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedWord})`, "g");
      highlightedText = highlightedText.replace(
        regex,
        `<mark class="bg-red-200 text-red-800 px-1 rounded">${item.word}</mark>`,
      );
    });
    return highlightedText;
  };

  // Cleanup effect for polling interval
  React.useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return (
    <DashboardLayout
      title="违禁词查询"
      subtitle="实时检测内容中的违禁词汇，确保内容合规"
      actions={
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="mr-2 h-3.5 w-3.5" />
            规则设置
          </Button>
          <Button size="sm" className="h-8 brand-accent">
            <Download className="mr-2 h-3.5 w-3.5" />
            导出报告
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Platform Selection */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              选择检测平台
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {platformStyles.map((platform) => (
                <Button
                  key={platform.id}
                  variant={
                    activePlatform === platform.id ? "default" : "outline"
                  }
                  size="sm"
                  className={`h-8 ${
                    activePlatform === platform.id
                      ? "bg-foreground text-background"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setActivePlatform(platform.id)}
                >
                  <span className="mr-1">{platform.emoji}</span>
                  {platform.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">内容检测</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger
                      value="text"
                      className="flex items-center space-x-1"
                    >
                      <FileText className="h-3 w-3" />
                      <span>查文字</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="document"
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>查文档</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="audio"
                      className="flex items-center space-x-1"
                    >
                      <Mic className="h-3 w-3" />
                      <span>查音频</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">
                          粘贴或输入要检测的文字内容
                        </label>
                        <span className="text-xs text-muted-foreground">
                          {inputText.length}/2000
                        </span>
                      </div>
                      <Textarea
                        placeholder="请粘贴或输入需要检测的文字内容，支持复制粘贴..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] resize-none"
                        maxLength={2000}
                      />
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Copy className="h-3 w-3" />
                        <span>支持Ctrl+V快速粘贴</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="document" className="space-y-4">
                    <div className="space-y-4">
                      <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          {selectedFile
                            ? selectedFile.name
                            : "上传文档文件进行检测"}
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          支持 .txt, .doc, .docx, .pdf 格式，最大10MB
                        </p>
                        <div className="flex space-x-2 justify-center">
                          <input
                            type="file"
                            id="document-upload"
                            className="hidden"
                            accept=".txt,.doc,.docx,.pdf"
                            onChange={handleFileSelect}
                          />
                          <label htmlFor="document-upload">
                            <Button variant="outline" size="sm" asChild>
                              <span>
                                <Download className="mr-2 h-3 w-3" />
                                选择文件
                              </span>
                            </Button>
                          </label>
                          {selectedFile && (
                            <Button
                              size="sm"
                              onClick={handleDocumentCheck}
                              disabled={isDocumentChecking}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {isDocumentChecking ? (
                                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                              ) : (
                                <Search className="mr-2 h-3 w-3" />
                              )}
                              {isDocumentChecking ? "检测中..." : "开始检测"}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          文档解析结果
                        </label>
                        <Textarea
                          placeholder="上传文档后，解析的文字内容将显示在这里..."
                          value={documentText || inputText}
                          onChange={(e) => {
                            setDocumentText(e.target.value);
                            setInputText(e.target.value);
                          }}
                          className="min-h-[120px] resize-none"
                          maxLength={2000}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="audio" className="space-y-4">
                    <div className="space-y-4">
                      <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                        <Mic className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          {audioFile ? audioFile.name : "上传音频/视频文件进行检测"}
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          音频：.mp3, .wav, .flac, .aac, .opus, .ogg, .m4a<br/>
                          视频：.mp4, .mpeg, .mov, .webm<br/>
                          最大100MB
                        </p>
                        <div className="flex space-x-2 justify-center">
                          <input
                            type="file"
                            id="audio-upload"
                            className="hidden"
                            accept=".mp3,.wav,.flac,.aac,.opus,.ogg,.m4a,.mp4,.mpeg,.mov,.webm"
                            onChange={handleAudioSelect}
                          />
                          <label htmlFor="audio-upload">
                            <Button variant="outline" size="sm" asChild>
                              <span>
                                <Mic className="mr-2 h-3 w-3" />
                                选择文件
                              </span>
                            </Button>
                          </label>
                          {audioFile && (
                            <Button
                              size="sm"
                              onClick={handleAudioCheck}
                              disabled={isAudioChecking}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              {isAudioChecking ? (
                                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                              ) : (
                                <Search className="mr-2 h-3 w-3" />
                              )}
                              {isAudioChecking ? "检测中..." : "开始检测"}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          音视频转文字结果
                        </label>
                        <Textarea
                          placeholder="上传音视频后，语音识别的文字内容将显示在这里..."
                          value={audioText || inputText}
                          onChange={(e) => {
                            setAudioText(e.target.value);
                            setInputText(e.target.value);
                          }}
                          className="min-h-[120px] resize-none"
                          maxLength={2000}
                        />
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>AI音视频识别 + 违禁词检测一体化</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCheck}
                      disabled={!inputText.trim() || isChecking}
                      className="h-8"
                    >
                      {isChecking ? (
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Search className="mr-2 h-3.5 w-3.5" />
                      )}
                      {isChecking ? "检测中..." : "开始检测"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setInputText("");
                        setShowResults(false);
                      }}
                      className="h-8"
                    >
                      清空
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>实时检测</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {(showResults || isChecking) && (
              <Card className="border border-border mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      检测结果
                    </span>
                    {showResults && detectionResult && (
                      <Badge
                        variant="secondary"
                        className={getRiskBadgeColor(
                          detectionResult.riskLevel,
                        )}
                      >
                        {detectionResult.riskLevel === "high"
                          ? "高风险"
                          : detectionResult.riskLevel === "medium"
                            ? "中风险"
                            : "低风险"}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isChecking ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          AI正在检测内容合规性...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Summary */}
                      {detectionResult && (
                        <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                              总字数
                            </p>
                            <p className="text-lg font-semibold">
                              {detectionResult.totalWords}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                              违禁词
                            </p>
                            <p className="text-lg font-semibold text-red-600">
                              {detectionResult.forbiddenCount}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                              合规率
                            </p>
                            <p className="text-lg font-semibold text-green-600">
                              {detectionResult.totalWords > 0 
                                ? ((detectionResult.totalWords - detectionResult.forbiddenCount) / detectionResult.totalWords * 100).toFixed(1) + '%'
                                : '100%'
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Highlighted Text */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">高亮显示</h4>
                        <div
                          className="p-3 bg-muted/30 rounded-lg text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: highlightForbiddenWords(inputText),
                          }}
                        />
                      </div>

                      {/* Forbidden Words List */}
                      {detectionResult && detectionResult.forbiddenWords.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">检测到的违禁词</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {detectionResult.forbiddenWords.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 border border-border rounded"
                              >
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(item.risk)}`}
                                  >
                                    {item.word}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {item.reason}
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getRiskBadgeColor(item.risk)}`}
                                >
                                  {item.risk === "high"
                                    ? "高"
                                    : item.risk === "medium"
                                      ? "中"
                                      : "低"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cleaned Text */}
                      {detectionResult && detectionResult.cleanedText && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">AI优化建议</h4>
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm leading-relaxed">
                            {detectionResult.cleanedText}
                          </div>
                        </div>
                      )}
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
                      已检测
                    </span>
                    <span className="text-sm font-medium">10 次</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">剩余</span>
                    <span className="text-sm font-medium">90 次</span>
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
                    🎉 今日免费额度 100次
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            {showResults && detectionResult && detectionResult.suggestions.length > 0 && (
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    修改建议
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {detectionResult.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 text-xs"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5" />
                        <span className="text-muted-foreground leading-relaxed">
                          {suggestion}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detection Rules */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  检测规则
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>政治敏感词汇</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>医疗广告限制</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>金融风险词汇</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <span>平台特殊规则</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
