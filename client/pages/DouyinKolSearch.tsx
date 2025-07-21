import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Users,
  Star,
  RefreshCw,
  BarChart3,
  TrendingUp,
  MapPin,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Plus,
} from "lucide-react";
import { 
  apiClient, 
  type DouyinInfluencer, 
  type DouyinKolSearchRequest, 
  type DouyinKolSearchResult,
  type DouyinKolFetchInfoRequest
} from "@/lib/api";
import { AvatarImage } from "@/components/ui/avatar-image";
import * as XLSX from 'xlsx';

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}千`;
  }
  return num.toString();
};

// 详细数字格式化（显示完整数字带逗号分隔）
const formatDetailedNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

// 搜索表单接口
interface SearchFilters {
  keyword: string;
  maxUsers: number;
}

// 结果过滤接口
interface ResultFilters {
  sortBy: 'follower' | 'fans_increment' | 'star_index' | 'vv_median';
  sortOrder: 'asc' | 'desc';
  showOnlyEcommerce: boolean;
  minStarLevel: string;
}

export default function DouyinKolSearch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<DouyinKolSearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [addingToAnalysis, setAddingToAnalysis] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<SearchFilters>({
    keyword: "",
    maxUsers: 50,
  });

  const [resultFilters, setResultFilters] = useState<ResultFilters>({
    sortBy: 'follower',
    sortOrder: 'desc',
    showOnlyEcommerce: false,
    minStarLevel: 'all',
  });


  const handleSearch = async () => {
    if (!filters.keyword.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    console.log("Starting search with filters:", filters);
    
    try {
      const response = await apiClient.searchDouyinKol({
        keyword: filters.keyword,
        max_users: filters.maxUsers,
      });
      console.log("API Response:", response);
      console.log("Results:", response.results);
      
      if (response && response.results && Array.isArray(response.results)) {
        // 验证每个结果项的基本结构
        const validatedResults = response.results.filter(item => {
          if (!item || typeof item !== 'object') {
            console.warn("Invalid item in results:", item);
            return false;
          }
          if (!item.kol_id) {
            console.warn("Item missing kol_id:", item);
            return false;
          }
          return true;
        });
        
        setSearchResults(validatedResults);
        setTotalResults(validatedResults.length);
        console.log("Search results set successfully:", validatedResults.length, "items");
      } else {
        console.warn("Invalid response structure:", response);
        setSearchResults([]);
        setTotalResults(0);
        setError("响应数据格式错误");
      }
    } catch (error) {
      console.error("搜索KOL失败:", error);
      setError(error instanceof Error ? error.message : "搜索失败");
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleKolClick = (kol: DouyinKolSearchResult) => {
    // 转换数据结构以匹配DouyinInfluencer接口
    const transformedKol: DouyinInfluencer = {
      id: kol.kol_id,
      task_id: kol.core_user_id,
      sec_user_id: kol.id,
      unique_id: kol.nick_name,
      nickname: kol.nick_name,
      avatar_url: kol.avatar_uri,
      signature: (kol.content_theme_labels_180d && Array.isArray(kol.content_theme_labels_180d) && kol.content_theme_labels_180d.length > 0) ? kol.content_theme_labels_180d.join(", ") : "暂无简介",
      follower_count: kol.follower,
      following_count: 0, // API响应中没有此字段
      aweme_count: 0, // API响应中没有此字段
      total_favorited: kol.interaction_median_30d ? kol.interaction_median_30d * 30 : 0, // 估算值
      gender: kol.gender,
      age: 0, // API响应中没有此字段
      ip_location: kol.city || kol.province || "未知",
      is_star: false,
      is_effect_artist: false,
      is_gov_media_vip: false,
      is_live_commerce: kol.e_commerce_enable || false,
      is_xingtu_kol: kol.star_index !== null,
      with_commerce_entry: kol.e_commerce_enable || false,
      with_fusion_shop_entry: false,
      with_new_goods: false,
      max_follower_count: kol.follower,
      platform: "douyin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_url: `https://www.douyin.com/user/${kol.id}`,
    };
    
    // 保存转换后的KOL数据到sessionStorage
    sessionStorage.setItem("selectedKol", JSON.stringify(transformedKol));
    // 在新窗口打开详情页面
    window.open(`/kol-search-analysis/douyin-analysis/${kol.kol_id}`, '_blank');
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      maxUsers: 50,
    });
  };

  const handleAddToAnalysis = async (kol: DouyinKolSearchResult) => {
    const kolId = kol.kol_id;
    
    // 防止重复添加
    if (addingToAnalysis.has(kolId)) {
      return;
    }

    setAddingToAnalysis(prev => new Set(prev).add(kolId));

    try {
      // 构造抖音用户URL
      const douyinUrl = `https://www.douyin.com/user/${kol.id}`;
      
      const response = await apiClient.fetchDouyinKolInfo({
        urls: [douyinUrl]
      });

      console.log("添加KOL到分析列表成功:", response);
      
      // 可以显示成功消息或进行其他处理
      // 这里可以添加toast通知等
      alert(`成功添加 ${kol.nick_name} 到分析列表！任务ID: ${response.celery_tasks[0]?.task_id}`);
      
    } catch (error) {
      console.error("添加KOL到分析列表失败:", error);
      alert(`添加 ${kol.nick_name} 到分析列表失败: ${error instanceof Error ? error.message : "未知错误"}`);
    } finally {
      setAddingToAnalysis(prev => {
        const newSet = new Set(prev);
        newSet.delete(kolId);
        return newSet;
      });
    }
  };

  const getStarLevel = (kol: DouyinKolSearchResult): string => {
    if (!kol.star_index || kol.star_index === null) return "B";
    if (kol.star_index > 80) return "S";
    if (kol.star_index > 60) return "A+";
    if (kol.star_index > 40) return "A";
    if (kol.star_index > 20) return "B+";
    return "B";
  };

  // 过滤和排序搜索结果
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...searchResults];

    // 应用过滤器
    if (resultFilters.showOnlyEcommerce) {
      filtered = filtered.filter(kol => kol.e_commerce_enable);
    }

    if (resultFilters.minStarLevel && resultFilters.minStarLevel !== 'all') {
      const levelOrder = { 'S': 4, 'A+': 3, 'A': 2, 'B+': 1, 'B': 0 };
      const minLevel = levelOrder[resultFilters.minStarLevel as keyof typeof levelOrder];
      filtered = filtered.filter(kol => {
        const kolLevel = getStarLevel(kol);
        const kolLevelValue = levelOrder[kolLevel as keyof typeof levelOrder];
        return kolLevelValue !== undefined && kolLevelValue >= minLevel;
      });
    }

    // 应用排序
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (resultFilters.sortBy) {
        case 'follower':
          aValue = a.follower || 0;
          bValue = b.follower || 0;
          break;
        case 'fans_increment':
          aValue = a.fans_increment_within_30d || 0;
          bValue = b.fans_increment_within_30d || 0;
          break;
        case 'star_index':
          aValue = a.star_index || 0;
          bValue = b.star_index || 0;
          break;
        case 'vv_median':
          aValue = a.vv_median_30d || 0;
          bValue = b.vv_median_30d || 0;
          break;
        default:
          return 0;
      }

      return resultFilters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return filtered;
  }, [searchResults, resultFilters]);

  // 添加调试日志
  useEffect(() => {
    console.log("Component state:", { loading, searchResults, totalResults, error });
    console.log("Search results:", searchResults);
    console.log("Filtered results:", filteredAndSortedResults);
  }, [loading, searchResults, totalResults, error, filteredAndSortedResults]);

  // 导出Excel功能
  const exportToExcel = () => {
    const exportData = filteredAndSortedResults.map((kol, index) => ({
      '序号': index + 1,
      'KOL昵称': kol.nick_name || '',
      '抖音ID': kol.core_user_id || '',
      '粉丝数': kol.follower || 0,
      '30天涨粉': kol.fans_increment_within_30d || 0,
      '涨粉率(%)': ((kol.fans_increment_rate_within_15d || 0) * 100).toFixed(2),
      '平均播放量': kol.vv_median_30d || 0,
      '互动量中位数': kol.interaction_median_30d || 0,
      '星图指数': kol.star_index ? kol.star_index.toFixed(1) : '',
      '等级': getStarLevel(kol),
      '性别': kol.gender === 2 ? '女' : kol.gender === 1 ? '男' : '未知',
      '地区': kol.city || kol.province || '未知',
      '是否带货': kol.e_commerce_enable ? '是' : '否',
      '电商评分': kol.ecom_score || '',
      '建议CPM价格': kol.assign_cpm_suggest_price || '',
      '1-20秒报价': kol.price_1_20 || '',
      '20-60秒报价': kol.price_20_60 || '',
      '60秒以上报价': kol.price_60 || '',
      '主要内容标签': (kol.content_theme_labels_180d || []).slice(0, 3).join(', '),
      '链接转化指数': kol.link_convert_index || '',
      '链接购物指数': kol.link_shopping_index || '',
      '链接传播指数': kol.link_spread_index || '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "抖音KOL数据");

    // 设置列宽
    const colWidths = [
      { wch: 6 },   // 序号
      { wch: 20 },  // KOL昵称
      { wch: 15 },  // 抖音ID
      { wch: 12 },  // 粉丝数
      { wch: 12 },  // 30天涨粉
      { wch: 10 },  // 涨粉率
      { wch: 12 },  // 平均播放量
      { wch: 12 },  // 互动量中位数
      { wch: 10 },  // 星图指数
      { wch: 8 },   // 等级
      { wch: 8 },   // 性别
      { wch: 12 },  // 地区
      { wch: 10 },  // 是否带货
      { wch: 10 },  // 电商评分
      { wch: 12 },  // 建议CPM价格
      { wch: 12 },  // 1-20秒报价
      { wch: 12 },  // 20-60秒报价
      { wch: 12 },  // 60秒以上报价
      { wch: 30 },  // 主要内容标签
      { wch: 12 },  // 链接转化指数
      { wch: 12 },  // 链接购物指数
      { wch: 12 },  // 链接传播指数
    ];
    ws['!cols'] = colWidths;

    const fileName = `抖音KOL搜索结果_${filters.keyword}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // 添加渲染保护
  try {
    if (!Array.isArray(searchResults)) {
      console.error("searchResults is not an array:", searchResults);
      return (
        <DashboardLayout
          title="抖音KOL搜索"
          subtitle="数据加载错误"
        >
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2 text-red-600">数据格式错误</h3>
            <p className="text-muted-foreground">搜索结果数据格式不正确</p>
          </div>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout
        title="抖音KOL搜索"
        subtitle="搜索和发现优质抖音KOL，精准匹配营销需求"
      >
        <div className="space-y-6">
        {/* 搜索区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Search className="mr-2 h-4 w-4" />
              KOL搜索
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 搜索输入区域 */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium mb-2 block">搜索关键词</Label>
                  <Input
                    placeholder="输入KOL昵称、抖音号或相关关键词..."
                    value={filters.keyword}
                    onChange={(e) =>
                      handleFilterChange("keyword", e.target.value)
                    }
                    className="h-11"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">搜索数量</Label>
                  <Select
                    value={filters.maxUsers.toString()}
                    onValueChange={(value) => handleFilterChange("maxUsers", parseInt(value))}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="选择搜索数量" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25条</SelectItem>
                      <SelectItem value="50">50条</SelectItem>
                      <SelectItem value="100">100条</SelectItem>
                      <SelectItem value="200">200条</SelectItem>
                      <SelectItem value="500">500条</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={handleSearch}
                  disabled={loading || !filters.keyword.trim()}
                  className="h-11 px-8"
                  size="lg"
                >
                  {loading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  搜索 KOL
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 搜索结果 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                搜索结果 ({filteredAndSortedResults.length}/{totalResults})
              </span>
              {searchResults.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToExcel}
                  >
                    <Download className="mr-2 h-3 w-3" />
                    导出Excel
                  </Button>
                </div>
              )}
            </CardTitle>
            
            {/* 过滤器控件 */}
            {searchResults.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">筛选:</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm">排序:</span>
                  <Select
                    value={resultFilters.sortBy}
                    onValueChange={(value: any) => 
                      setResultFilters(prev => ({ ...prev, sortBy: value }))
                    }
                  >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="follower">粉丝数</SelectItem>
                      <SelectItem value="fans_increment">30天涨粉</SelectItem>
                      <SelectItem value="star_index">星图指数</SelectItem>
                      <SelectItem value="vv_median">播放量</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => 
                      setResultFilters(prev => ({ 
                        ...prev, 
                        sortOrder: prev.sortOrder === 'desc' ? 'asc' : 'desc' 
                      }))
                    }
                  >
                    {resultFilters.sortOrder === 'desc' ? 
                      <ArrowDown className="h-3 w-3" /> : 
                      <ArrowUp className="h-3 w-3" />
                    }
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ecommerce-filter"
                    checked={resultFilters.showOnlyEcommerce}
                    onCheckedChange={(checked) =>
                      setResultFilters(prev => ({ ...prev, showOnlyEcommerce: !!checked }))
                    }
                  />
                  <Label htmlFor="ecommerce-filter" className="text-sm">
                    仅显示带货达人
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm">最低等级:</span>
                  <Select
                    value={resultFilters.minStarLevel}
                    onValueChange={(value) => 
                      setResultFilters(prev => ({ ...prev, minStarLevel: value }))
                    }
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue placeholder="全部" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setResultFilters({
                    sortBy: 'follower',
                    sortOrder: 'desc',
                    showOnlyEcommerce: false,
                    minStarLevel: 'all',
                  })}
                >
                  重置筛选
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
                <p className="text-sm text-muted-foreground">正在搜索KOL...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-red-400 mb-4" />
                <h3 className="text-lg font-medium mb-2 text-red-600">搜索出错</h3>
                <p className="text-muted-foreground">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setError(null)}
                >
                  重试
                </Button>
              </div>
            ) : filteredAndSortedResults.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">暂无搜索结果</h3>
                <p className="text-muted-foreground">
                  {searchResults.length === 0 ? "请输入关键词开始搜索" : "当前筛选条件下无匹配结果，请调整筛选条件"}
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[280px]">KOL信息</TableHead>
                        <TableHead className="w-[100px]">粉丝数</TableHead>
                        <TableHead className="w-[120px]">30天涨粉</TableHead>
                        <TableHead className="w-[120px]">平均播放量</TableHead>
                        <TableHead className="w-[100px]">星图指数</TableHead>
                        <TableHead className="w-[80px]">等级</TableHead>
                        <TableHead className="w-[120px]">标签</TableHead>
                        <TableHead className="w-[160px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedResults && filteredAndSortedResults.length > 0 ? (
                        filteredAndSortedResults.map((kol) => {
                          // 安全检查确保必要的字段存在
                          if (!kol || !kol.kol_id) {
                            console.warn("Invalid KOL data:", kol);
                            return null;
                          }
                          
                          try {
                            return (
                        <TableRow
                          key={kol.kol_id}
                          className="hover:bg-gray-50"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <AvatarImage
                                src={kol.avatar_uri || ""}
                                alt={kol.nick_name || "KOL"}
                                fallbackText={(kol.nick_name || "K").charAt(0)}
                                size="md"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">
                                  {kol.nick_name || "未知用户"}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  ID: {kol.core_user_id || "未知"}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {kol.city || kol.province || "未知"} ·{" "}
                                  {kol.gender === 2 ? "女" : kol.gender === 1 ? "男" : "未知"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatDetailedNumber(kol.follower || 0)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className={`font-medium ${(kol.fans_increment_within_30d || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {(kol.fans_increment_within_30d || 0) >= 0 ? '+' : ''}{formatNumber(kol.fans_increment_within_30d || 0)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {((kol.fans_increment_rate_within_15d || 0) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {kol.vv_median_30d ? formatNumber(kol.vv_median_30d) : (
                              <span className="text-muted-foreground text-xs">暂无</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {kol.star_index ? (
                              <Badge variant="secondary">
                                {kol.star_index.toFixed(1)}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">暂无</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                getStarLevel(kol) === "S"
                                  ? "default"
                                  : getStarLevel(kol).startsWith("A")
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {getStarLevel(kol)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {kol.star_index !== null && (
                                <Badge variant="default" className="text-xs">
                                  <Star className="mr-1 h-2 w-2" />
                                  星图
                                </Badge>
                              )}
                              {kol.e_commerce_enable && (
                                <Badge variant="secondary" className="text-xs">
                                  🛍️ 带货
                                </Badge>
                              )}
                              {kol.content_theme_labels_180d && Array.isArray(kol.content_theme_labels_180d) && kol.content_theme_labels_180d.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {kol.content_theme_labels_180d[0]}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => handleKolClick(kol)}
                              >
                                <BarChart3 className="mr-1 h-3 w-3" />
                                详情
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => handleAddToAnalysis(kol)}
                                disabled={addingToAnalysis.has(kol.kol_id)}
                              >
                                {addingToAnalysis.has(kol.kol_id) ? (
                                  <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                                ) : (
                                  <Plus className="mr-1 h-3 w-3" />
                                )}
                                添加分析
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                            );
                          } catch (rowError) {
                            console.error("Error rendering KOL row:", rowError, kol);
                            return null;
                          }
                        }).filter(Boolean)
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                            暂无数据
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 搜索统计 */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                搜索结果统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(
                      searchResults.reduce(
                        (sum, kol) => sum + kol.follower,
                        0,
                      ) /
                        searchResults.length /
                        10000,
                    )}
                    万
                  </div>
                  <div className="text-sm text-muted-foreground">
                    平均粉丝数
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {(() => {
                      const validResults = searchResults.filter(kol => kol.vv_median_30d !== null && kol.vv_median_30d !== undefined);
                      if (validResults.length === 0) return "暂无";
                      const avg = validResults.reduce((sum, kol) => sum + (kol.vv_median_30d || 0), 0) / validResults.length;
                      return Math.round(avg / 10000) + "万";
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    平均播放量
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {searchResults.filter((kol) => kol.star_index !== null).length}
                  </div>
                  <div className="text-sm text-muted-foreground">星图达人</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {searchResults.filter((kol) => kol.e_commerce_enable).length}
                  </div>
                  <div className="text-sm text-muted-foreground">带货达人</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error("Render error:", error);
    return (
      <DashboardLayout
        title="抖音KOL搜索"
        subtitle="页面渲染错误"
      >
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2 text-red-600">页面出现错误</h3>
          <p className="text-muted-foreground">请刷新页面重试</p>
          <pre className="text-xs text-left mt-4 p-4 bg-gray-100 rounded">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </DashboardLayout>
    );
  }
}
