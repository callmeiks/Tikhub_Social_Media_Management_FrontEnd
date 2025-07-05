import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Home,
  Wand2,
  Database,
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Settings,
  Search,
  Bell,
  User,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SubMenuItem {
  title: string;
  href: string;
  badge?: string;
}

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "首页",
    icon: Home,
    href: "/",
  },
  {
    title: "创作者工具",
    icon: Wand2,
    href: "/creator-tools",
    subItems: [
      {
        title: "万能转换",
        href: "/creator-tools/universal-converter",
        badge: "HOT",
      },
      { title: "文案生成", href: "/creator-tools/rewrite" },
      { title: "文稿生成", href: "/creator-tools/short-video-copy" },
      { title: "标题生成", href: "/creator-tools/title-generator" },
      { title: "拍摄脚本生成", href: "/creator-tools/shooting-script" },
      { title: "AI视频生成", href: "/creator-tools/ai-video", badge: "NEW" },
      { title: "封面图制作", href: "/creator-tools/image-recreation" },

      { title: "音视频���取文字", href: "/creator-tools/audio-extract" },
      { title: "账号PK", href: "/creator-tools/account-analysis" },
      { title: "违禁词查询", href: "/creator-tools/forbidden-words" },
    ],
  },
  {
    title: "数据采集",
    icon: Database,
    href: "/data-collection",
    subItems: [
      { title: "视频下载", href: "/creator-tools/video-download" },
      { title: "图文提取", href: "/creator-tools/content-extract" },
      { title: "文案提取", href: "/creator-tools/video-note-extract" },
      {
        title: "账号作品数据采集",
        href: "/data-collection/account-interaction",
      },

      { title: "作品互动数查询", href: "/data-collection/content-interaction" },
      { title: "关键词作品查询", href: "/data-collection/keyword-content" },
      { title: "关键词账号查询", href: "/data-collection/keyword-accounts" },
    ],
  },
  {
    title: "数据监控",
    icon: BarChart3,
    href: "/data-monitoring",
    subItems: [
      {
        title: "作品互动数据检测",
        href: "/data-monitoring/content-interaction",
      },
      { title: "账号指标检测", href: "/data-monitoring/account-metrics" },
      {
        title: "作品舆情评论检测",
        href: "/data-monitoring/sentiment-analysis",
      },
      { title: "自定义监控榜单", href: "/data-monitoring/custom-rankings" },
      { title: "当前任务管理", href: "/data-monitoring/task-management" },
    ],
  },
  {
    title: "热点榜单",
    icon: TrendingUp,
    href: "/hot-rankings",
    subItems: [
      { title: "抖音�����账号", href: "/hot-rankings/dy-hot-accounts" },
      { title: "抖音上升热点榜", href: "/hot-rankings/dy-rising-trends" },
      { title: "抖音同城热点榜", href: "/hot-rankings/dy-local-trends" },
      { title: "抖音挑战热点榜", href: "/hot-rankings/dy-challenge-trends" },
      { title: "抖音视频热榜", href: "/hot-rankings/dy-video-trends" },
      { title: "抖音低分爆款榜", href: "/hot-rankings/dy-low-score-viral" },
      { title: "抖音高点赞��榜", href: "/hot-rankings/dy-high-like-rate" },
      {
        title: "抖音高完播率榜",
        href: "/hot-rankings/dy-high-completion-rate",
      },
      {
        title: "抖音高涨粉率榜",
        href: "/hot-rankings/dy-high-follower-growth",
      },
      { title: "抖音搜索热榜", href: "/hot-rankings/dy-search-trends" },
      { title: "抖音热度飙升搜索榜", href: "/hot-rankings/dy-rising-search" },
      { title: "抖音热度飙升话题榜", href: "/hot-rankings/dy-rising-topics" },
      { title: "TikTok热门产品", href: "/hot-rankings/tiktok-hot-products" },
      { title: "TikTok热门标签", href: "/hot-rankings/tiktok-hot-tags" },
      { title: "热门音乐", href: "/hot-rankings/hot-music" },
      { title: "热门广告", href: "/hot-rankings/hot-ads" },
      {
        title: "TikTok创意模式排行榜",
        href: "/hot-rankings/tiktok-creative-rankings",
      },
    ],
  },
  {
    title: "KOL分析",
    icon: Users,
    href: "/kol-analysis",
    subItems: [
      { title: "KOL服务报价", href: "/kol-analysis/pricing" },
      { title: "KOL观众画像", href: "/kol-analysis/audience-profile" },
      { title: "粉丝画像", href: "/kol-analysis/fan-profile" },
      { title: "粉丝趋势", href: "/kol-analysis/fan-trends" },
      { title: "性价比分析", href: "/kol-analysis/roi-analysis" },
      { title: "星图指标", href: "/kol-analysis/star-metrics" },
      { title: "KOL相关热��分析", href: "/kol-analysis/keyword-analysis" },
      { title: "KOL视频表现分析", href: "/kol-analysis/video-performance" },
      { title: "KOL转化能力分析", href: "/kol-analysis/conversion-analysis" },
      {
        title: "TikTok Creator搜索",
        href: "/kol-analysis/tiktok-creator-search",
      },
    ],
  },
  {
    title: "广告&商品分析",
    icon: ShoppingCart,
    href: "/ads-products",
    subItems: [
      { title: "产品详情", href: "/ads-products/product-details" },
      { title: "商店��品列表", href: "/ads-products/store-products" },
      { title: "广告关键帧分析", href: "/ads-products/ad-keyframes" },
      { title: "广���百分位数据", href: "/ads-products/ad-percentile" },
      { title: "广告互动分析", href: "/ads-products/ad-interaction" },
      { title: "产品指标数据", href: "/ads-products/product-metrics" },
      { title: "产品详情信息", href: "/ads-products/product-info" },
    ],
  },
];

const platformIcons = {
  tiktok: "🎵",
  douyin: "🎤",
  xiaohongshu: "📖",
  bilibili: "📺",
  wechat: "💬",
};

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ className, isOpen = true, onToggle }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("tiktok");

  // Auto-expand menu items based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const itemsToExpand: string[] = [];

    menuItems.forEach((item) => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some(
          (subItem) =>
            currentPath === subItem.href ||
            currentPath.startsWith(subItem.href + "/"),
        );
        if (hasActiveSubItem) {
          itemsToExpand.push(item.title);
        }
      }
    });

    setExpandedItems(itemsToExpand);
  }, [location.pathname]);

  const toggleItem = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const isItemActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const isParentActive = (item: MenuItem) => {
    if (item.href && isItemActive(item.href)) return true;
    return item.subItems?.some((subItem) => isItemActive(subItem.href));
  };

  return (
    <div
      className={cn(
        "flex h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200",
        isOpen ? "w-72" : "w-16",
        className,
      )}
    >
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border/50">
          {isOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
                <span className="text-black font-semibold text-sm">TH</span>
              </div>
              <div>
                <h1 className="text-base font-semibold text-sidebar-foreground">
                  TikHub
                </h1>
                <p className="text-xs text-sidebar-foreground/70">
                  社交媒体管理平台
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2 space-y-0.5">
            {menuItems.map((item) => {
              const isActive = isParentActive(item);
              const isExpanded = expandedItems.includes(item.title);
              const hasSubItems = item.subItems && item.subItems.length > 0;

              return (
                <div key={item.title}>
                  <Collapsible
                    open={isExpanded}
                    onOpenChange={(open) => {
                      if (open) {
                        setExpandedItems((prev) => [...prev, item.title]);
                      } else {
                        setExpandedItems((prev) =>
                          prev.filter((i) => i !== item.title),
                        );
                      }
                    }}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start px-3 py-2 h-9 text-left transition-all duration-150",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                          !isOpen && "justify-center px-2",
                        )}
                        asChild={!hasSubItems}
                      >
                        {hasSubItems ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              <item.icon className="h-4 w-4 flex-shrink-0" />
                              {isOpen && (
                                <span className="text-sm font-medium">
                                  {item.title}
                                </span>
                              )}
                            </div>
                            {isOpen && hasSubItems && (
                              <ChevronDown
                                className={cn(
                                  "h-3 w-3 transition-transform duration-200",
                                  isExpanded && "rotate-180",
                                )}
                              />
                            )}
                          </div>
                        ) : (
                          <Link
                            to={item.href!}
                            className="flex items-center space-x-3 w-full"
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            {isOpen && (
                              <span className="text-sm font-medium">
                                {item.title}
                              </span>
                            )}
                          </Link>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    {hasSubItems && isOpen && (
                      <CollapsibleContent className="space-y-0.5 mt-1">
                        {item.subItems?.map((subItem) => (
                          <Link key={subItem.href} to={subItem.href}>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start pl-10 pr-3 py-2 text-xs h-8 transition-all duration-150",
                                isItemActive(subItem.href)
                                  ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                              )}
                            >
                              <span className="truncate">{subItem.title}</span>
                              {subItem.badge && (
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "ml-auto text-xs px-1.5 py-0.5 text-white",
                                    subItem.badge === "HOT"
                                      ? "bg-orange-500"
                                      : "bg-brand-accent",
                                  )}
                                >
                                  {subItem.badge === "HOT" && "🔥 "}
                                  {subItem.badge}
                                </Badge>
                              )}
                            </Button>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-sidebar-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-sidebar-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  管理员
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  admin@tikhub.com
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-accent flex-shrink-0 h-7 w-7"
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
