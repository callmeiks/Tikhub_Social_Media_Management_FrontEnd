import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Eye } from "lucide-react";

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  postTitle: string;
  onDownloadAll: () => void;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  postTitle,
  onDownloadAll,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate pr-4">{postTitle}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                共 {images.length} 张图片
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onDownloadAll}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>下载全部</span>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[70vh] pr-2">
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onIndexChange(index)}
              >
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Eye className="h-4 w-4 text-gray-700" />
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
        {currentIndex >= 0 && currentIndex < images.length && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                当前查看: 第 {currentIndex + 1} 张图片
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = images[currentIndex];
                    link.download = `${postTitle}_image_${currentIndex + 1}.jpg`;
                    link.click();
                  }}
                  className="flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span>下载当前图片</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};