// Task queue interfaces and utilities for monitoring pages
export interface TaskItem {
  id: string;
  url: string;
  type: 'content' | 'influencer';
  status: 'waiting' | 'processing' | 'completed' | 'failed';
  addedAt: string;
  completedAt?: string;
  error?: string;
}

export const createTaskQueueItems = (urls: string[], isContentUrlFn: (url: string) => boolean): TaskItem[] => {
  return urls.map((url) => ({
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    url,
    type: isContentUrlFn(url) ? 'content' : 'influencer',
    status: 'waiting' as const,
    addedAt: new Date().toLocaleString("zh-CN"),
  }));
};

export const processTaskQueue = async (
  tasks: TaskItem[],
  setTaskQueue: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  onSuccess: (task: TaskItem, index: number) => void
) => {
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    
    // Update task status to processing
    setTaskQueue(prev => 
      prev.map(t => t.id === task.id ? { ...t, status: 'processing' } : t)
    );

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    try {
      // Simulate random success/failure (90% success rate)
      const success = Math.random() > 0.1;
      
      if (success) {
        // Call success callback
        onSuccess(task, i);

        // Mark task as completed
        setTaskQueue(prev => 
          prev.map(t => t.id === task.id ? { 
            ...t, 
            status: 'completed', 
            completedAt: new Date().toLocaleString("zh-CN") 
          } : t)
        );
      } else {
        // Mark task as failed
        setTaskQueue(prev => 
          prev.map(t => t.id === task.id ? { 
            ...t, 
            status: 'failed',
            error: '链接解析失败，请检查链接有效性'
          } : t)
        );
      }
    } catch (error) {
      // Mark task as failed
      setTaskQueue(prev => 
        prev.map(t => t.id === task.id ? { 
          ...t, 
          status: 'failed',
          error: '处理过程中发生错误'
        } : t)
      );
    }
  }
};
