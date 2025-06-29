import React from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Construction } from "lucide-react";

export default function DataCollection() {
  return (
    <DashboardLayout
      title="数据采集"
      subtitle="智能采集各平台数据，为运营决策提供支持"
      actions={<Button className="brand-gradient">新建采集任务</Button>}
    >
      <div className="flex items-center justify-center h-96">
        <Card className="border-0 shadow-md max-w-md">
          <CardContent className="p-8 text-center">
            <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">数据采集功能开发中</h3>
            <p className="text-muted-foreground mb-4">
              我们正在开发强大的数据采集工具，敬请期待！
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Construction className="h-4 w-4" />
              <span>即将上线</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
