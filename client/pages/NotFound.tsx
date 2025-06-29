import React from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="border-0 shadow-md max-w-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-white">404</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">页面未找到</h1>
              <p className="text-muted-foreground">
                抱歉，您访问的页面不存在或已被移动到其他位置。
              </p>
            </div>

            <div className="space-y-3">
              <Link to="/">
                <Button className="w-full brand-gradient">
                  <Home className="mr-2 h-4 w-4" />
                  返回首页
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回上一页
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">
                或者您可以尝试：
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link to="/creator-tools">
                  <Button variant="ghost" size="sm">
                    创作者工具
                  </Button>
                </Link>
                <Link to="/hot-rankings">
                  <Button variant="ghost" size="sm">
                    热点榜单
                  </Button>
                </Link>
                <Link to="/kol-analysis">
                  <Button variant="ghost" size="sm">
                    KOL分析
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
