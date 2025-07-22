import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  RefreshCw,
  ExternalLink,
  Clock,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";
import { TaskItem } from "@/lib/taskQueue";

interface TaskQueueSectionProps {
  taskQueue: TaskItem[];
  onClearCompleted: () => void;
  onClearAll: () => void;
  onRetryFailed: (taskId: string) => void;
}

export function TaskQueueSection({
  taskQueue,
  onClearCompleted,
  onClearAll,
  onRetryFailed,
}: TaskQueueSectionProps) {
  const getTaskStatusBadge = (status: TaskItem["status"]) => {
    switch (status) {
      case "waiting":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            等待中
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            处理中
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            已完成
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200"
          >
            <X className="h-3 w-3 mr-1" />
            失败
          </Badge>
        );
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  if (taskQueue.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            任务队列 ({taskQueue.length})
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearCompleted}
              disabled={!taskQueue.some((task) => task.status === "completed")}
              className="h-7 text-xs"
            >
              清除已完成
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="h-7 text-xs"
            >
              清空所有
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Queue Statistics */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {taskQueue.filter((task) => task.status === "waiting").length}
              </div>
              <div className="text-xs text-gray-600">等待中</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">
                {
                  taskQueue.filter((task) => task.status === "processing")
                    .length
                }
              </div>
              <div className="text-xs text-gray-600">处理中</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {taskQueue.filter((task) => task.status === "completed").length}
              </div>
              <div className="text-xs text-gray-600">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">
                {taskQueue.filter((task) => task.status === "failed").length}
              </div>
              <div className="text-xs text-gray-600">失败</div>
            </div>
          </div>

          {/* Task List */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">链接</TableHead>
                  <TableHead className="w-[100px]">类型</TableHead>
                  <TableHead className="w-[120px]">状态</TableHead>
                  <TableHead className="w-[150px]">添加时间</TableHead>
                  <TableHead className="w-[150px]">完成时间</TableHead>
                  <TableHead className="w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskQueue.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-[350px] truncate" title={task.url}>
                        {task.url}
                      </div>
                      {task.error && (
                        <div className="text-xs text-red-600 mt-1">
                          {task.error}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {task.type === "content" ? "作品" : "达人"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getTaskStatusBadge(task.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {task.addedAt}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {task.completedAt || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {task.status === "failed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                            onClick={() => onRetryFailed(task.id)}
                            title="重试"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => window.open(task.url, "_blank")}
                          title="查看链接"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
