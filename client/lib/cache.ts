// 缓存工具类
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expireTime: number;
}

export interface CacheConfig {
  defaultTTL: number; // 默认缓存时间 (毫秒)
  maxSize?: number;   // 最大缓存数量
}

export class Cache {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;

  constructor(config: CacheConfig = { defaultTTL: 5 * 60 * 1000 }) { // 默认5分钟
    this.config = config;
  }

  // 设置缓存项
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expireTime = now + (ttl || this.config.defaultTTL);
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expireTime,
    });

    // 如果设置了最大缓存数量，清理旧缓存
    if (this.config.maxSize && this.cache.size > this.config.maxSize) {
      this.evictOldest();
    }
  }

  // 获取缓存项
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() > item.expireTime) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  // 检查缓存是否存在且未过期
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // 删除指定缓存
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // 清空所有缓存
  clear(): void {
    this.cache.clear();
  }

  // 获取缓存信息
  getCacheInfo(key: string): { exists: boolean; age?: number; remainingTTL?: number } {
    const item = this.cache.get(key);
    if (!item) {
      return { exists: false };
    }

    const now = Date.now();
    const age = now - item.timestamp;
    const remainingTTL = item.expireTime - now;

    return {
      exists: true,
      age,
      remainingTTL: remainingTTL > 0 ? remainingTTL : 0,
    };
  }

  // 清理过期缓存
  private evictExpired(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, item] of entries) {
      if (now > item.expireTime) {
        this.cache.delete(key);
      }
    }
  }

  // 清理最旧的缓存项
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    const entries = Array.from(this.cache.entries());
    for (const [key, item] of entries) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // 获取所有缓存键
  keys(): string[] {
    this.evictExpired();
    return Array.from(this.cache.keys());
  }

  // 获取缓存大小
  size(): number {
    this.evictExpired();
    return this.cache.size;
  }
}

// 热榜专用缓存实例
export const hotRankingsCache = new Cache({
  defaultTTL: 3 * 60 * 1000, // 3分钟缓存
  maxSize: 50, // 最多缓存50个项目
});

// 保持向后兼容
export const kuaishouHotRankingsCache = hotRankingsCache;

// 缓存键生成器
export const createCacheKey = (platform: string, tabId?: string, filterType?: string): string => {
  let baseKey = `${platform}_hot`;
  if (tabId) baseKey += `_${tabId}`;
  return filterType ? `${baseKey}_${filterType}` : baseKey;
};

// 缓存状态类型
export interface CacheStatus {
  isFromCache: boolean;
  cacheAge?: number;
  remainingTTL?: number;
}