import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";
import AccountDetailDouyin from "./AccountDetailDouyin";
import AccountDetailTikTok from "./AccountDetailTikTok";
import AccountDetailXiaohongshu from "./AccountDetailXiaohongshu";

export default function AccountDetails() {
  const { platform, accountId } = useParams();
  const navigate = useNavigate();

  // 根据平台参数路由到对应的组件
  useEffect(() => {
    if (platform) {
      switch (platform) {
        case "douyin":
          // 渲染 DouyinAccountDetail 组件
          break;
        case "tiktok":
          // 渲染 TikTokAccountDetail 组件
          break;
        case "xiaohongshu":
          // 渲染 XiaohongshuAccountDetail 组件
          break;
        default:
          // 重定向到账号列表
          navigate("/data-collection/account-interaction");
          break;
      }
    }
  }, [platform, navigate]);

  // 根据平台参数渲染对应的组件
  const renderPlatformComponent = () => {
    switch (platform) {
      case "douyin":
        return <AccountDetailDouyin />;
      case "tiktok":
        return <AccountDetailTikTok />;
      case "xiaohongshu":
        return <AccountDetailXiaohongshu />;
      default:
        return (
          <DashboardLayout title="账号详情" subtitle="账号数据详情">
            <div className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">不支持的平台</h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                请选择支持的平台查看账号详情。
              </p>
              <Button
                onClick={() => navigate("/data-collection/account-interaction")}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回账号列表
              </Button>
            </div>
          </DashboardLayout>
        );
    }
  };

  return renderPlatformComponent();
}
