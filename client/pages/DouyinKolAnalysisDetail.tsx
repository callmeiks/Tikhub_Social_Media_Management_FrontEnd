import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  DollarSign,
  Calendar,
  CalendarIcon,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  MapPin,
  UserCheck,
  Award,
  Zap,
  PieChart,
  Activity,
  Search,
} from "lucide-react";
import { 
  apiClient, 
  type DouyinInfluencer, 
  type DouyinKolInfo,
  type KolDetailRequest,
  type AudiencePortraitResponse,
  type ServicePricingResponse,
  type VideoPerformanceRequest,
  type VideoPerformanceResponse,
  type InfluenceMetricsResponse,
  type FansTrendRequest,
  type FansTrendResponse,
  type HotCommentWordsResponse
} from "@/lib/api";
import { AvatarImage } from "@/components/ui/avatar-image";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}千`;
  }
  return num.toString();
};

const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

// 粉丝数量折线图组件
const FansCountLineChart: React.FC<{ data: Array<{ date: string; fans_cnt: string }> }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const width = 800;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // 计算数据范围
  const fansValues = data.map(d => parseInt(d.fans_cnt));
  const minFans = Math.min(...fansValues);
  const maxFans = Math.max(...fansValues);
  const fansRange = maxFans - minFans;

  // 创建数据点
  const points = data.map((d, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((parseInt(d.fans_cnt) - minFans) / fansRange) * chartHeight;
    return { x, y, date: d.date, fans: parseInt(d.fans_cnt) };
  });

  // 创建路径
  const pathData = points.map((point, index) => 
    index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
  ).join(' ');

  // Y轴刻度
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) => {
    const value = minFans + (i / (yTicks - 1)) * fansRange;
    return {
      value,
      y: padding.top + chartHeight - (i / (yTicks - 1)) * chartHeight
    };
  });

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width={width} height={height} className="overflow-visible">
        {/* 网格线 */}
        {yTickValues.map((tick, index) => (
          <line
            key={index}
            x1={padding.left}
            y1={tick.y}
            x2={padding.left + chartWidth}
            y2={tick.y}
            stroke="#f0f0f0"
            strokeWidth="1"
          />
        ))}
        
        {/* Y轴 */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#e0e0e0"
          strokeWidth="2"
        />
        
        {/* X轴 */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="#e0e0e0"
          strokeWidth="2"
        />
        
        {/* Y轴标签 */}
        {yTickValues.map((tick, index) => (
          <text
            key={index}
            x={padding.left - 10}
            y={tick.y + 4}
            textAnchor="end"
            className="text-xs fill-gray-600"
          >
            {formatNumber(tick.value)}
          </text>
        ))}
        
        {/* 折线 */}
        <path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        
        {/* 数据点 */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              className="drop-shadow-sm"
            />
            {/* 悬停提示 */}
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="transparent"
              className="hover:fill-blue-100 cursor-pointer"
            >
              <title>{`${point.date}: ${formatNumber(point.fans)}`}</title>
            </circle>
          </g>
        ))}
        
        {/* X轴日期标签 (只显示第一个和最后一个) */}
        <text
          x={points[0]?.x || padding.left}
          y={padding.top + chartHeight + 20}
          textAnchor="middle"
          className="text-xs fill-gray-600"
        >
          {data[0]?.date}
        </text>
        <text
          x={points[points.length - 1]?.x || padding.left + chartWidth}
          y={padding.top + chartHeight + 20}
          textAnchor="middle"
          className="text-xs fill-gray-600"
        >
          {data[data.length - 1]?.date}
        </text>
      </svg>
    </div>
  );
};

// 粉丝趋势分析组件
const FanTrendsAnalysisTab: React.FC<{ kolId: string }> = ({ kolId }) => {
  const [fansTrendData, setFansTrendData] = useState<FansTrendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  const fetchFansTrend = async () => {
    if (!kolId) return;
    setLoading(true);
    try {
      const response = await apiClient.getKolFansTrend({
        kol_id: kolId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });
      setFansTrendData(response);
    } catch (error) {
      console.error("获取粉丝趋势数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFansTrend();
  }, [kolId, startDate, endDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const calculateGrowthRate = () => {
    if (!fansTrendData || fansTrendData.fans_count.length < 2) return "0%";
    const firstCount = parseInt(fansTrendData.fans_count[0].fans_cnt);
    const lastCount = parseInt(fansTrendData.fans_count[fansTrendData.fans_count.length - 1].fans_cnt);
    const rate = ((lastCount - firstCount) / firstCount) * 100;
    return `${rate > 0 ? '+' : ''}${rate.toFixed(1)}%`;
  };

  const calculateMonthlyGrowth = () => {
    if (!fansTrendData || fansTrendData.fans_count.length < 2) return "0";
    const firstCount = parseInt(fansTrendData.fans_count[0].fans_cnt);
    const lastCount = parseInt(fansTrendData.fans_count[fansTrendData.fans_count.length - 1].fans_cnt);
    const growth = lastCount - firstCount;
    return formatNumber(Math.abs(growth));
  };

  return (
    <div className="space-y-6">
      {/* 日期筛选器 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            日期筛选
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">开始日期</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    size="sm"
                    className={cn(
                      "w-[140px] h-8 justify-start text-left font-normal text-xs",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {startDate ? format(startDate, "MM-dd") : "选择日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">结束日期</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    size="sm"
                    className={cn(
                      "w-[140px] h-8 justify-start text-left font-normal text-xs",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {endDate ? format(endDate, "MM-dd") : "选择日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={fetchFansTrend} disabled={loading} size="sm" className="mt-4 h-8">
              {loading ? (
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Search className="mr-1 h-3 w-3" />
              )}
              更新
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 趋势总览 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-lg font-bold text-black">{calculateGrowthRate()}</div>
              <div className="text-xs text-gray-600">总体增长率</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-black">+{calculateMonthlyGrowth()}</div>
              <div className="text-xs text-gray-600">期间变化</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-black">
                {fansTrendData?.fans_count.length ? 
                  formatNumber(parseInt(fansTrendData.fans_count[fansTrendData.fans_count.length - 1].fans_cnt)) : 
                  '-'
                }
              </div>
              <div className="text-xs text-gray-600">当前粉丝数</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 粉丝数量变化图表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Users className="mr-2 h-4 w-4" />
            粉丝数量变化
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fansTrendData && fansTrendData.fans_count.length > 0 ? (
            <div className="w-full h-64">
              <FansCountLineChart data={fansTrendData.fans_count} />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无粉丝数量数据</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 增长率数据表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            增长率变化
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fansTrendData && fansTrendData.fans_growth.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>日增长</TableHead>
                    <TableHead>增长率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fansTrendData.fans_growth.map((item) => {
                    const growthValue = parseFloat(item.fans_growth);
                    const growthRate = parseFloat(item.fans_growth_rate);
                    
                    return (
                      <TableRow key={item.date}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className={`font-medium ${growthValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {growthValue >= 0 ? '+' : ''}{formatNumber(growthValue)}
                        </TableCell>
                        <TableCell className={`font-medium ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无增长率数据</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

// 观众分析组件
const AudienceAnalysisTab: React.FC<{ kolId: string }> = ({ kolId }) => {
  const [audienceData, setAudienceData] = useState<AudiencePortraitResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudienceData = async () => {
      if (!kolId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getKolAudiencePortrait({ kol_id: kolId });
        setAudienceData(response);
      } catch (error) {
        console.error("获取受众画像数据失败:", error);
        setError(error instanceof Error ? error.message : "获取数据失败");
      } finally {
        setLoading(false);
      }
    };

    fetchAudienceData();
  }, [kolId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">加载受众分析数据中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-medium mb-2 text-red-600">加载失败</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
          重新加载
        </Button>
      </div>
    );
  }

  if (!audienceData) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">暂无受众分析数据</p>
      </div>
    );
  }

  // 通用格式化函数
  const formatDistributionData = (data: any[], needTotal = false) => {
    if (!data || data.length === 0) return { items: [], total: 0 };
    const total = data.reduce((sum, item) => sum + parseInt(item.distribution_value || "0"), 0);
    const items = data.map(item => ({
      key: item.distribution_key,
      value: parseInt(item.distribution_value || "0"),
      percentage: total > 0 ? (parseInt(item.distribution_value || "0") / total * 100) : 0
    }));
    return { items, total };
  };

  // 真正的饼图组件 (用于性别和年龄)
  const PieChartVisualization: React.FC<{ data: any[], title: string, description?: string }> = ({ data, title, description }) => {
    const { items } = formatDistributionData(data);
    const colors = [
      '#3b82f6', '#ec4899', '#10b981', '#f59e0b', 
      '#8b5cf6', '#ef4444', '#6366f1', '#f97316'
    ];

    // 计算饼图路径
    const createPieChart = (data: any[]) => {
      let cumulativePercentage = 0;
      const radius = 80;
      const centerX = 100;
      const centerY = 100;

      return data.map((item, index) => {
        const startAngle = cumulativePercentage * 3.6; // 转换为度数
        const endAngle = (cumulativePercentage + item.percentage) * 3.6;
        
        const startAngleRad = (startAngle - 90) * (Math.PI / 180);
        const endAngleRad = (endAngle - 90) * (Math.PI / 180);
        
        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);
        
        const largeArc = item.percentage > 50 ? 1 : 0;
        
        const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        
        cumulativePercentage += item.percentage;
        
        return {
          path: pathData,
          color: colors[index % colors.length],
          percentage: item.percentage,
          key: item.key,
          value: item.value
        };
      });
    };

    const pieData = createPieChart(items);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <PieChart className="mr-2 h-4 w-4" />
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            {/* 饼图 */}
            <div className="flex-shrink-0">
              <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-sm">
                {pieData.map((slice, index) => (
                  <path
                    key={index}
                    d={slice.path}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="2"
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </svg>
            </div>
            
            {/* 图例 */}
            <div className="flex-1 space-y-3">
              {items.map((item, index) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-sm font-medium">
                      {item.key === 'male' ? '男性' : item.key === 'female' ? '女性' : item.key}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{item.percentage.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">{formatNumber(item.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // 纵向条形图组件 (用于城市等级和观众分类)
  const BarChartVisualization: React.FC<{ data: any[], title: string, description?: string }> = ({ data, title, description }) => {
    const { items } = formatDistributionData(data);
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-red-500'
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.key}</span>
                  <span className="font-semibold">{item.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors[index % colors.length]} transition-all duration-1000 ease-out`}
                    style={{ width: `${item.percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-xs text-white font-medium">
                      {formatNumber(item.value)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // 重点数据卡片组件 (用于城市分布TOP5)
  const HighlightCardVisualization: React.FC<{ data: any[], title: string, description?: string, showTop?: number }> = ({ 
    data, title, description, showTop = 5 
  }) => {
    const { items } = formatDistributionData(data);
    const topItems = items.slice(0, showTop);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {topItems.map((item, index) => (
              <div key={item.key} className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200">
                <div className="text-lg font-bold text-blue-600">
                  {item.percentage.toFixed(1)}%
                </div>
                <div className="text-xs font-medium text-blue-800 mt-1">
                  {item.key}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {formatNumber(item.value)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // 省份分布 - 地图风格展示
  const ProvinceMapVisualization: React.FC<{ data: any[], title: string, description?: string, showTop?: number }> = ({ 
    data, title, description, showTop = 8 
  }) => {
    const { items } = formatDistributionData(data);
    const topProvinces = items.slice(0, showTop);
    const maxPercentage = Math.max(...topProvinces.map(item => item.percentage));
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProvinces.map((item, index) => (
              <div key={item.key} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-800 rounded px-2 py-1 font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{item.key}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-sm">{item.percentage.toFixed(1)}%</span>
                    <span className="text-xs text-muted-foreground ml-2">{formatNumber(item.value)}</span>
                  </div>
                </div>
                <div className="w-full bg-green-100 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                    style={{ width: `${(item.percentage / maxPercentage) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // 兴趣标签云
  const InterestsCloudVisualization: React.FC<{ data: any[], title: string, description?: string, showTop?: number }> = ({ 
    data, title, description, showTop = 8 
  }) => {
    const { items } = formatDistributionData(data);
    const topInterests = items.slice(0, showTop);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Star className="mr-2 h-4 w-4" />
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {topInterests.map((item, index) => {
              const size = Math.max(0.8, Math.min(1.6, item.percentage / 10));
              return (
                <div
                  key={item.key}
                  className="relative bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full border border-purple-200 hover:shadow-md transition-all"
                  style={{ fontSize: `${size}rem` }}
                >
                  <span className="font-medium text-purple-800">{item.key}</span>
                  <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="text-xs text-purple-600 text-center mt-1">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // 手机品牌市场占有率
  const PhoneMarketVisualization: React.FC<{ data: any[], title: string, description?: string, showTop?: number }> = ({ 
    data, title, description, showTop = 8 
  }) => {
    const { items } = formatDistributionData(data);
    const topBrands = items.slice(0, showTop);
    
    const brandIcons: { [key: string]: string } = {
      'iPhone': '🍎',
      '华为': '📱',
      '小米': '📱',
      'oppo': '📱',
      'vivo': '📱',
      '荣耀': '📱',
      '红米': '📱',
      '其他': '📱'
    };
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Star className="mr-2 h-4 w-4" />
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {topBrands.map((item, index) => (
              <div key={item.key} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                <div className="text-2xl">
                  {brandIcons[item.key] || '📱'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">{item.key}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="font-semibold text-orange-600">{item.percentage.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">{formatNumber(item.value)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* 受众画像核心洞察 - 简洁黑白设计 */}
      <Card className="border border-gray-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Users className="mr-2 h-4 w-4" />
            受众画像核心洞察
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {audienceData.gender && (() => {
              const genderData = formatDistributionData(audienceData.gender.data);
              const femaleData = genderData.items.find(item => item.key === 'female');
              const maleData = genderData.items.find(item => item.key === 'male');
              const dominantGender = femaleData && maleData ? 
                (femaleData.percentage > maleData.percentage ? femaleData : maleData) : 
                genderData.items.sort((a, b) => b.percentage - a.percentage)[0];
              
              return (
                <div className="text-center p-3 border border-gray-200 rounded-lg bg-white hover:border-gray-400 transition-colors">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {dominantGender?.percentage.toFixed(0)}%
                  </div>
                  <div className="text-xs font-medium text-gray-600 mb-1">
                    {dominantGender?.key === 'female' ? '女性占主导' : dominantGender?.key === 'male' ? '男性占主导' : '性别分布'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatNumber(dominantGender?.value || 0)}
                  </div>
                </div>
              );
            })()}
            
            {audienceData.age && (() => {
              const ageData = formatDistributionData(audienceData.age.data);
              const topAge = ageData.items.sort((a, b) => b.percentage - a.percentage)[0];
              
              return (
                <div className="text-center p-3 border border-gray-200 rounded-lg bg-white hover:border-gray-400 transition-colors">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {topAge?.key || 'N/A'}
                  </div>
                  <div className="text-xs font-medium text-gray-600 mb-1">主要年龄段</div>
                  <div className="text-xs text-gray-500">
                    {topAge?.percentage.toFixed(1)}% 占比
                  </div>
                </div>
              );
            })()}
            
            {audienceData.city_level && (() => {
              const cityLevelData = formatDistributionData(audienceData.city_level.data);
              const topCityLevel = cityLevelData.items.sort((a, b) => b.percentage - a.percentage)[0];
              
              return (
                <div className="text-center p-3 border border-gray-200 rounded-lg bg-white hover:border-gray-400 transition-colors">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {topCityLevel?.key || 'N/A'}
                  </div>
                  <div className="text-xs font-medium text-gray-600 mb-1">主力城市等级</div>
                  <div className="text-xs text-gray-500">消费能力</div>
                </div>
              );
            })()}
            
            {audienceData.interests && (() => {
              const interestsData = formatDistributionData(audienceData.interests.data);
              const topInterest = interestsData.items.sort((a, b) => b.percentage - a.percentage)[0];
              
              return (
                <div className="text-center p-3 border border-gray-200 rounded-lg bg-white hover:border-gray-400 transition-colors">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {topInterest?.key || 'N/A'}
                  </div>
                  <div className="text-xs font-medium text-gray-600 mb-1">兴趣偏好</div>
                  <div className="text-xs text-gray-500">
                    {topInterest?.percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {/* 饼图区域 - 性别和年龄分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {audienceData.gender && (
          <PieChartVisualization
            data={audienceData.gender.data}
            title="性别分布"
            description={audienceData.gender.description}
          />
        )}
        
        {audienceData.age && (
          <PieChartVisualization
            data={audienceData.age.data}
            title="年龄分布"
            description={audienceData.age.description}
          />
        )}
      </div>

      {/* 条形图区域 - 城市等级和观众分类 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {audienceData.city_level && (
          <BarChartVisualization
            data={audienceData.city_level.data}
            title="城市等级分布"
            description={audienceData.city_level.description}
          />
        )}
        
        {audienceData.audience_category && (
          <BarChartVisualization
            data={audienceData.audience_category.data}
            title="观众分类分布"
            description={audienceData.audience_category.description}
          />
        )}
      </div>

      {/* 城市分布 - 重点卡片展示 */}
      {audienceData.city && (
        <HighlightCardVisualization
          data={audienceData.city.data}
          title="重点城市分布 TOP5"
          description={audienceData.city.description}
          showTop={5}
        />
      )}

      {/* 其他数据可视化区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 省份分布 */}
        {audienceData.province && (
          <ProvinceMapVisualization
            data={audienceData.province.data}
            title="省份分布排行"
            description={audienceData.province.description}
            showTop={8}
          />
        )}
        
        {/* 手机品牌分布 */}
        {audienceData.phone_type && (
          <PhoneMarketVisualization
            data={audienceData.phone_type.data}
            title="手机品牌市场占有率"
            description={audienceData.phone_type.description}
            showTop={8}
          />
        )}
      </div>

      {/* 兴趣标签云 */}
      {audienceData.interests && (
        <InterestsCloudVisualization
          data={audienceData.interests.data}
          title="兴趣偏好标签云"
          description={audienceData.interests.description}
          showTop={8}
        />
      )}
    </div>
  );
};

// 服务报价组件
const ServicePricingTab: React.FC<{ kolId: string }> = ({ kolId }) => {
  const [servicePricingData, setServicePricingData] = useState<ServicePricingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicePricing = async () => {
      if (!kolId) return;
      setLoading(true);
      try {
        const response = await apiClient.getKolServicePricing({ kol_id: kolId });
        setServicePricingData(response);
      } catch (error) {
        console.error("获取服务报价数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicePricing();
  }, [kolId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `¥${(price / 10000).toFixed(1)}万`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            服务报价表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {servicePricingData && servicePricingData.service_pricing.length > 0 ? (
            <div className="space-y-4">
              {servicePricingData.service_pricing.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{item.desc}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.enable ? '可接单' : '暂不可用'} • {item.settlement_desc}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">{formatPrice(item.price)}</div>
                    <div className="text-xs text-muted-foreground">预估价格</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无服务报价数据</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 行业标签 */}
      {servicePricingData?.industry_tags && servicePricingData.industry_tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Target className="mr-2 h-4 w-4" />
              主要服务行业
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {servicePricingData.industry_tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Target className="mr-2 h-4 w-4" />
            历史合作案例
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">美妆品牌A合作</div>
                <Badge variant="secondary">2024年3月</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                15秒产品测评视频，获得120万播放量，点赞数8.5万
              </p>
              <div className="flex space-x-4 text-sm">
                <span>播放量: 120万</span>
                <span>点赞: 8.5万</span>
                <span>评论: 3.2万</span>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">服装品牌B直播</div>
                <Badge variant="secondary">2024年2月</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                3小时直播带货，销售额达到85万，转化率2.3%
              </p>
              <div className="flex space-x-4 text-sm">
                <span>观看人数: 15万</span>
                <span>销售额: 85万</span>
                <span>转化率: 2.3%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 视频表现组件
const VideoPerformanceTab: React.FC<{ kolId: string }> = ({ kolId }) => {
  const [videoPerformanceData, setVideoPerformanceData] = useState<VideoPerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoPerformance = async () => {
      if (!kolId) return;
      setLoading(true);
      try {
        const response = await apiClient.getKolVideoPerformance({
          kol_id: kolId,
          type: "_1",
          range: "_3"
        });
        setVideoPerformanceData(response);
      } catch (error) {
        console.error("获取视频表现数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoPerformance();
  }, [kolId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">
                {videoPerformanceData?.video_performance_overview?.play_mid ? 
                  formatNumber(parseInt(videoPerformanceData.video_performance_overview.play_mid)) : '-'}
              </div>
              <div className="text-sm text-muted-foreground">平均播放量</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">
                {videoPerformanceData?.video_performance_overview?.like_avg ? 
                  formatNumber(parseInt(videoPerformanceData.video_performance_overview.like_avg)) : '-'}
              </div>
              <div className="text-sm text-muted-foreground">平均点赞数</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">
                {videoPerformanceData?.video_performance_overview?.comment_avg ? 
                  formatNumber(parseInt(videoPerformanceData.video_performance_overview.comment_avg)) : '-'}
              </div>
              <div className="text-sm text-muted-foreground">平均评论数</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Share2 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">1.8万</div>
              <div className="text-sm text-muted-foreground">平均分享数</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            最近热门视频表现
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>视频标题</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead>播放量</TableHead>
                <TableHead>点赞数</TableHead>
                <TableHead>评论数</TableHead>
                <TableHead>完播率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  title: "春季护肤小贴士分享",
                  date: "2024-03-15",
                  views: "256万",
                  likes: "18.5万",
                  comments: "5.2万",
                  completion: "68%",
                },
                {
                  title: "今日穿搭推荐",
                  date: "2024-03-14",
                  views: "189万",
                  likes: "14.2万",
                  comments: "3.8万",
                  completion: "72%",
                },
                {
                  title: "美食制作教程",
                  date: "2024-03-13",
                  views: "145万",
                  likes: "12.8万",
                  comments: "4.1万",
                  completion: "65%",
                },
              ].map((video, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>{video.date}</TableCell>
                  <TableCell>{video.views}</TableCell>
                  <TableCell>{video.likes}</TableCell>
                  <TableCell>{video.comments}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        parseInt(video.completion) > 70
                          ? "default"
                          : "secondary"
                      }
                    >
                      {video.completion}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};


// 达人表现组件
interface CreatorPerformanceTabProps {
  kolId: string;
}

const CreatorPerformanceTab: React.FC<CreatorPerformanceTabProps> = ({ kolId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInfluenceMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getKolInfluenceMetrics({ kol_id: kolId });
      setData(response);
    } catch (error) {
      console.error("获取影响力指标失败:", error);
      setError(error instanceof Error ? error.message : "获取数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kolId) {
      fetchInfluenceMetrics();
    }
  }, [kolId]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-6 w-6 mx-auto animate-spin text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">加载影响力指标中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-medium mb-2 text-red-600">加载失败</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={fetchInfluenceMetrics}
        >
          重新加载
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 达人综合评分 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Star className="mr-2 h-4 w-4" />
              合作指数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {data?.cooperate_index?.toFixed(1) || '暂无'}
              </div>
              <div className="text-sm text-muted-foreground">合作潜力评分</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              CP指数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {data?.cp_index?.toFixed(1) || '暂无'}
              </div>
              <div className="text-sm text-muted-foreground">内容传播指数</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              链接转化指数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {data?.link_convert_index?.toFixed(1) || '暂无'}
              </div>
              <div className="text-sm text-muted-foreground">转化能力评分</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Award className="mr-2 h-4 w-4" />
              传播指数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {data?.link_spread_index?.toFixed(1) || '暂无'}
              </div>
              <div className="text-sm text-muted-foreground">
                内容传播力评分
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 达人能力雷达图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            达人影响力分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                { skill: "合作指数", score: data?.cooperate_index || 0 },
                { skill: "CP指数", score: data?.cp_index || 0 },
                { skill: "链接转化指数", score: data?.link_convert_index || 0 },
                { skill: "传播指数", score: data?.link_spread_index || 0 },
                { skill: "购物指数", score: data?.link_shopping_index || 0 },
              ].map((item) => (
                <div key={item.skill} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.skill}</span>
                    <span className="font-medium">{item.score.toFixed(1)}</span>
                  </div>
                  <Progress value={Math.min(item.score, 100)} className="h-2" />
                </div>
              ))}
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <PieChart className="h-12 w-12 mx-auto mb-2" />
                <p>影响力雷达图</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 热门词云组件
interface HotWordCloudTabProps {
  kolId: string;
}

const HotWordCloudTab: React.FC<HotWordCloudTabProps> = ({ kolId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHotCommentWords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getKolHotCommentWords({ kol_id: kolId });
      setData(response);
    } catch (error) {
      console.error("获取热门评论词汇失败:", error);
      setError(error instanceof Error ? error.message : "获取数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kolId) {
      fetchHotCommentWords();
    }
  }, [kolId]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-6 w-6 mx-auto animate-spin text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">加载热门词汇中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-medium mb-2 text-red-600">加载失败</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={fetchHotCommentWords}
        >
          重新加载
        </Button>
      </div>
    );
  }

  const hotWords = data?.hot_words || [];
  const wordFrequency = data?.word_frequency || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Zap className="mr-2 h-4 w-4 text-yellow-500" />
              热门评论词汇
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hotWords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hotWords.map((word: any, index: number) => (
                  <Badge
                    key={index}
                    variant={index < 5 ? "default" : "secondary"}
                    className="text-sm"
                    style={{
                      fontSize: `${Math.max(0.8, Math.min(1.5, (word.frequency || 10) / 100))}rem`
                    }}
                  >
                    {word.word || word}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-2" />
                  <p>暂无热门词汇数据</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
              词频统计排行
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wordFrequency.length > 0 ? (
                wordFrequency.slice(0, 10).map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-xs bg-gray-100 rounded px-2 py-1 mr-2">
                        {index + 1}
                      </span>
                      <span className="text-sm">{item.word}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{item.count || item.frequency}</span>
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">暂无词频统计数据</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {data && data.topic_stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <MessageCircle className="mr-2 h-4 w-4" />
              话题参与度分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {data.topic_stats?.coverage_rate ? `${(data.topic_stats.coverage_rate * 100).toFixed(1)}%` : '暂无'}
                </div>
                <div className="text-sm text-muted-foreground">话题覆盖率</div>
                <Progress value={data.topic_stats?.coverage_rate * 100 || 0} className="h-2 mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {data.topic_stats?.avg_engagement || '暂无'}
                </div>
                <div className="text-sm text-muted-foreground">平均互动量</div>
                <Progress value={70} className="h-2 mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {data.topic_stats?.influence_score?.toFixed(1) || '暂无'}
                </div>
                <div className="text-sm text-muted-foreground">话题引导力</div>
                <Progress value={data.topic_stats?.influence_score || 0} className="h-2 mt-2" />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h4 className="font-medium">近期热门话题参与</h4>
              <div className="space-y-3">
                {data.recent_topics && data.recent_topics.length > 0 ? (
                  data.recent_topics.map((record: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <div className="font-medium">{record.topic || record.hashtag}</div>
                        <div className="text-sm text-muted-foreground">
                          参与度: {record.engagement || record.count}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge
                          variant={record.trend === "hot" || record.trend === "热门" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {record.trend || record.status || '稳定'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">暂无话题参与数据</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function DouyinKolAnalysisDetail() {
  const { kolId } = useParams();
  const navigate = useNavigate();
  const [kolData, setKolData] = useState<DouyinInfluencer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 首先尝试从sessionStorage获取数据
    const storedKol = sessionStorage.getItem("selectedKol");
    if (storedKol) {
      try {
        const kol = JSON.parse(storedKol) as DouyinInfluencer;
        setKolData(kol);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Failed to parse stored KOL data:", error);
      }
    }

    // 如果没有存储的数据，使用默认示例数据
    const defaultKolId = kolId || "demo-kol";

    const mockKolData: DouyinInfluencer = {
      id: defaultKolId,
      task_id: "task-12345",
      sec_user_id: "MS4wLjABAAAA...",
      unique_id: "fashionista_lily",
      nickname: "时尚达人Lily",
      avatar_url: "/placeholder.svg",
      signature: "分享时尚穿搭，传递美好生活",
      follower_count: 1580000,
      following_count: 1200,
      aweme_count: 456,
      total_favorited: 25800000,
      gender: 2,
      age: 28,
      ip_location: "北京",
      is_star: false,
      is_effect_artist: false,
      is_gov_media_vip: false,
      is_live_commerce: true,
      is_xingtu_kol: true,
      with_commerce_entry: true,
      with_fusion_shop_entry: true,
      with_new_goods: true,
      max_follower_count: 1600000,
      platform: "douyin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      share_url: "https://www.douyin.com/user/...",
    };

    setTimeout(() => {
      setKolData(mockKolData);
      setLoading(false);
    }, 1000);
  }, [kolId]);

  const handleBackClick = () => {
    navigate("/kol-search-analysis/douyin-analysis");
  };

  if (loading) {
    return (
      <DashboardLayout title="加载中..." subtitle="正在加载抖音KOL分析数据">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!kolData) {
    return (
      <DashboardLayout title="抖音KOL分析" subtitle="深度分析KOL数据表现">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">无法加载KOL数据</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            请从KOL列表页面选择要分析的KOL。
          </p>
          <Button onClick={handleBackClick} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回KOL管理
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`${kolData.nickname} - 抖音KOL详情分析`}
      subtitle="深度分析KOL数据表现和商业价值"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="h-8"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            返回KOL管理
          </Button>
          <div className="flex items-center space-x-4">
            {!kolId && (
              <Badge variant="secondary" className="text-xs">
                📊 演示数据
              </Badge>
            )}
            <div className="text-sm text-muted-foreground">
              最后更新: {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        {/* KOL Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <AvatarImage
                src={kolData.avatar_url || ""}
                alt={kolData.nickname}
                fallbackText={kolData.nickname.charAt(0)}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-semibold">{kolData.nickname}</h2>
                  <Badge className="bg-red-100 text-red-800">🎤 抖音KOL</Badge>
                  {kolData.is_xingtu_kol && (
                    <Badge variant="secondary">
                      <Star className="mr-1 h-3 w-3" />
                      星图达人
                    </Badge>
                  )}
                </div>

                {/* MCN信息 */}
                {(() => {
                  const storedKol = sessionStorage.getItem("selectedKol");
                  if (storedKol) {
                    try {
                      const extendedData = JSON.parse(storedKol);
                      if (extendedData.mcn_name || extendedData.mcn_id) {
                        return (
                          <div className="flex items-center space-x-4 mb-3 text-sm">
                            <Badge variant="outline" className="text-xs">
                              🏢 MCN机构
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{extendedData.mcn_name || '未知机构'}</span>
                              {extendedData.mcn_id && (
                                <span className="text-xs text-muted-foreground">
                                  (ID: {extendedData.mcn_id})
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }
                    } catch (e) {
                      console.error('Error parsing stored KOL data for MCN info:', e);
                    }
                  }
                  return null;
                })()}

                {/* 基础数据 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <div className="font-medium text-lg">
                      {formatNumber(kolData.follower_count)}
                    </div>
                    <div className="text-muted-foreground">粉丝数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {kolData.aweme_count || '-'}
                    </div>
                    <div className="text-muted-foreground">作品数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {kolData.total_favorited ? formatNumber(kolData.total_favorited) : '-'}
                    </div>
                    <div className="text-muted-foreground">获赞总数</div>
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {kolData.is_xingtu_kol ? 'A+' : 'B'}
                    </div>
                    <div className="text-muted-foreground">星图等级</div>
                  </div>
                </div>

                {/* 详细信息展示 */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">详细信息</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                    {/* 检查是否有扩展数据 */}
                    {(() => {
                      const storedKol = sessionStorage.getItem("selectedKol");
                      if (storedKol) {
                        try {
                          const extendedData = JSON.parse(storedKol);
                          // 如果数据来源于API，显示更多字段
                          if (extendedData.mcn_name || extendedData.star_index || extendedData.vv_median_30d) {
                            return (
                              <>
                                <div>
                                  <div className="text-gray-500">MCN机构</div>
                                  <div className="font-medium">{extendedData.mcn_name || '-'}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500">星图指数</div>
                                  <div className="font-medium">
                                    {extendedData.star_index ? extendedData.star_index.toFixed(1) : '-'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">平均播放量</div>
                                  <div className="font-medium">
                                    {extendedData.vv_median_30d ? formatNumber(extendedData.vv_median_30d) : '-'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">互动中位数</div>
                                  <div className="font-medium">
                                    {extendedData.interaction_median_30d ? formatNumber(extendedData.interaction_median_30d) : '-'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">30天涨粉</div>
                                  <div className="font-medium">
                                    {extendedData.fans_increment_within_30d ? formatNumber(extendedData.fans_increment_within_30d) : '-'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">15天涨粉率</div>
                                  <div className="font-medium">
                                    {extendedData.fans_increment_rate_within_15d ? 
                                      `${(extendedData.fans_increment_rate_within_15d * 100).toFixed(2)}%` : '-'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">电商评分</div>
                                  <div className="font-medium">
                                    {extendedData.ecom_score ? extendedData.ecom_score.toFixed(1) : '-'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">建议CPM</div>
                                  <div className="font-medium">
                                    {extendedData.assign_cpm_suggest_price ? 
                                      `¥${extendedData.assign_cpm_suggest_price}` : '-'}
                                  </div>
                                </div>
                                {extendedData.price_1_20 && (
                                  <div>
                                    <div className="text-gray-500">1-20s报价</div>
                                    <div className="font-medium">¥{extendedData.price_1_20}</div>
                                  </div>
                                )}
                                {extendedData.price_20_60 && (
                                  <div>
                                    <div className="text-gray-500">20-60s报价</div>
                                    <div className="font-medium">¥{extendedData.price_20_60}</div>
                                  </div>
                                )}
                                {extendedData.price_60 && (
                                  <div>
                                    <div className="text-gray-500">60s+报价</div>
                                    <div className="font-medium">¥{extendedData.price_60}</div>
                                  </div>
                                )}
                                <div>
                                  <div className="text-gray-500">在线状态</div>
                                  <div className="font-medium">
                                    {extendedData.is_online ? '在线' : '离线'}
                                  </div>
                                </div>
                              </>
                            );
                          }
                        } catch (e) {
                          console.error('Error parsing stored KOL data:', e);
                        }
                      }
                      return null;
                    })()}
                    
                    {/* 基础信息 */}
                    <div>
                      <div className="text-gray-500">抖音ID</div>
                      <div className="font-medium">{kolData.unique_id}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">关注数</div>
                      <div className="font-medium">{kolData.following_count || '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">是否星图</div>
                      <div className="font-medium">{kolData.is_xingtu_kol ? '是' : '否'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">是否带货</div>
                      <div className="font-medium">{kolData.is_live_commerce ? '是' : '否'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span>📍 {kolData.ip_location}</span>
                  <span>👤 {kolData.gender === 2 ? "女" : "男"}</span>
                  <span>🎂 {kolData.age}岁</span>
                  {kolData.is_live_commerce && <span>🛍️ 带货达人</span>}
                </div>

                {kolData.signature && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {kolData.signature}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="fantrends" className="w-full">
              <TabsList className="grid w-full grid-cols-6 rounded-none border-b">
                <TabsTrigger value="fantrends" className="rounded-none">
                  粉丝趋势分析
                </TabsTrigger>
                <TabsTrigger value="audience" className="rounded-none">
                  观众分析
                </TabsTrigger>
                <TabsTrigger value="pricing" className="rounded-none">
                  服务报价
                </TabsTrigger>
                <TabsTrigger value="video" className="rounded-none">
                  视频表现
                </TabsTrigger>
                <TabsTrigger value="performance" className="rounded-none">
                  达人表现
                </TabsTrigger>
                <TabsTrigger value="wordcloud" className="rounded-none">
                  热门词云
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="fantrends" className="mt-0">
                  <FanTrendsAnalysisTab kolId={kolData.task_id || kolId || ''} />
                </TabsContent>

                <TabsContent value="audience" className="mt-0">
                  <AudienceAnalysisTab kolId={kolData.task_id || kolId || ''} />
                </TabsContent>

                <TabsContent value="pricing" className="mt-0">
                  <ServicePricingTab kolId={kolData.task_id || kolId || ''} />
                </TabsContent>

                <TabsContent value="video" className="mt-0">
                  <VideoPerformanceTab kolId={kolData.task_id || kolId || ''} />
                </TabsContent>

                <TabsContent value="performance" className="mt-0">
                  <CreatorPerformanceTab kolId={kolId || ''} />
                </TabsContent>

                <TabsContent value="wordcloud" className="mt-0">
                  <HotWordCloudTab kolId={kolId || ''} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
