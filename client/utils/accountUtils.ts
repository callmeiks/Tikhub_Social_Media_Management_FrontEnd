// 账号详情页面的公共工具函数

export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}千`;
  }
  return num.toString();
};

export const formatDateTime = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp) * 1000);
  return (
    date.toLocaleDateString("zh-CN") +
    " " +
    date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  );
};

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const getPlatformUserIdKey = (platform: string): string => {
  switch (platform) {
    case "tiktok":
      return "sec_user_id";
    case "douyin":
      return "sec_user_id";
    case "xiaohongshu":
      return "user_id";
    case "kuaishou":
      return "user_id";
    case "x":
      return "rest_id";
    case "youtube":
      return "channel_id";
    default:
      return "id";
  }
};

export const getPlatformDisplayName = (platform: string): string => {
  const platformMap: { [key: string]: string } = {
    douyin: "抖音",
    xiaohongshu: "小红书",
    tiktok: "TikTok",
    kuaishou: "快手",
    x: "X",
    youtube: "YouTube",
  };
  return platformMap[platform] || platform;
};

export const getPlatformBadgeConfig = (platform: string) => {
  const platformConfig = {
    douyin: { color: "bg-red-100 text-red-800", emoji: "🎤" },
    xiaohongshu: { color: "bg-pink-100 text-pink-800", emoji: "📖" },
    tiktok: { color: "bg-purple-100 text-purple-800", emoji: "🎵" },
    kuaishou: { color: "bg-yellow-100 text-yellow-800", emoji: "⚡" },
    x: { color: "bg-blue-100 text-blue-800", emoji: "✖️" },
    youtube: { color: "bg-red-100 text-red-800", emoji: "📺" },
  };
  
  return platformConfig[platform] || {
    color: "bg-gray-100 text-gray-800",
    emoji: "📱",
  };
};

// 下载所有图片的工具函数
export const downloadAllImages = async (images: string[], postTitle: string) => {
  try {
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${postTitle}_image_${i + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      // Add delay to avoid overwhelming the browser
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  } catch (error) {
    console.error("Error downloading images:", error);
  }
};

// 导出 Excel 的通用函数
export const exportAccountToExcel = (accountData: any, posts: any[], platformName: string) => {
  // 动态导入 XLSX
  import("xlsx").then((XLSX) => {
    const wb = XLSX.utils.book_new();

    // User Info Sheet
    const userInfoHeaders = Object.keys(accountData);
    const userInfoData = [userInfoHeaders];
    const userInfoRow = userInfoHeaders.map((key) => {
      const value = accountData[key];
      if (value === null || value === undefined) return "";
      if (typeof value === "boolean") return value ? "是" : "否";
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    });
    userInfoData.push(userInfoRow);

    const userInfoWS = XLSX.utils.aoa_to_sheet(userInfoData);
    XLSX.utils.book_append_sheet(wb, userInfoWS, "User Info");

    // Posts Sheet
    if (posts.length > 0) {
      const allPostKeys = new Set<string>();
      posts.forEach((post) => {
        Object.keys(post).forEach((key) => allPostKeys.add(key));
      });

      const postsHeaders = Array.from(allPostKeys);
      const postsData = [postsHeaders];

      posts.forEach((post) => {
        const postRow = postsHeaders.map((key) => {
          const value = post[key];
          if (value === null || value === undefined) return "";
          if (typeof value === "boolean") return value ? "是" : "否";
          if (typeof value === "object") {
            if (Array.isArray(value)) {
              return value
                .map((item) =>
                  typeof item === "object"
                    ? JSON.stringify(item)
                    : String(item),
                )
                .join("; ");
            }
            return JSON.stringify(value);
          }
          return String(value);
        });
        postsData.push(postRow);
      });

      const postsWS = XLSX.utils.aoa_to_sheet(postsData);
      XLSX.utils.book_append_sheet(wb, postsWS, "User Posts");
    }

    const fileName = `${accountData.nickname}_${platformName}数据_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  });
};