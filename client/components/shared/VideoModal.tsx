import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ 
  isOpen, 
  onClose, 
  videoUrl, 
  title 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <video
            className="absolute top-0 left-0 w-full h-full rounded-lg bg-black"
            controls
            autoPlay
            src={videoUrl}
          >
            <source src={videoUrl} type="video/mp4" />
            您的浏览器不支持视频播放。
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
};