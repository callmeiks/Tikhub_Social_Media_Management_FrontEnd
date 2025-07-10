const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://127.0.0.1:8000/api";

interface ApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

interface BaseInfluencer {
  id: string;
  task_id: string;
  platform: string;
  nickname: string;
  follower_count?: number;
  fans_acount?: number;
  aweme_count?: number;
  post_acount?: number;
  total_favorited?: number;
  liked_acount?: number;
  created_at: string;
  updated_at: string;
}

interface TikTokInfluencer extends BaseInfluencer {
  platform: "tiktok";
  sec_user_id: string;
  unique_id: string;
  uid: string;
  category: string;
  avatar_url: string;
  signature: string;
  signature_language: string;
  share_url: string;
  ins_id: string;
  twitter_id: string;
  youtube_channel_id: string;
  youtube_channel_title: string;
  android_download_app_link: string;
  ios_download_app_link: string;
  is_enterprise_verify: boolean;
  commerce_user_level: number;
  is_star: boolean;
  is_effect_artist: boolean;
  live_commerce: boolean;
  message_chat_entry: boolean;
  with_commerce_entry: boolean;
  with_new_goods: boolean;
  following_count: number;
}

interface DouyinInfluencer extends BaseInfluencer {
  platform: "douyin";
  sec_user_id: string;
  unique_id: string;
  age: number;
  gender: number;
  avatar_url: string;
  signature: string;
  share_url: string;
  following_count: number;
  max_follower_count: number;
  ip_location: string;
  is_star: boolean;
  is_effect_artist: boolean;
  is_gov_media_vip: boolean;
  is_live_commerce: boolean;
  is_xingtu_kol: boolean;
  with_commerce_entry: boolean;
  with_fusion_shop_entry: boolean;
  with_new_goods: boolean;
}

interface XiaohongshuInfluencer extends BaseInfluencer {
  platform: "xiaohongshu";
  user_id: string;
  red_id: string;
  gender: number;
  avatar_url: string;
  desc: string;
  share_url: string;
  post_count: number;
  liked_count: number;
  collected_count: number;
  following_count: number;
  fans_count: number;
  is_red_club: boolean;
  tags: string[];
  red_official_verified: boolean;
  ip_location: string;
}

type Influencer = TikTokInfluencer | DouyinInfluencer | XiaohongshuInfluencer;

interface GetInfluencersParams {
  platform: "tiktok" | "douyin" | "xiaohongshu" | "all";
  page?: number;
  limit?: number;
  nickname?: string;
  sort_by_fans?: "ascending" | "descending";
  sort_by_likes?: "ascending" | "descending";
  sort_by_posts?: "ascending" | "descending";
}

interface CollectAccountsParams {
  urls: string[];
  collectPosts: boolean;
  collectCount: number;
}

interface CollectAccountsResponse {
  total_successful: number;
  total_failed: number;
  failed_urls: string[];
  celery_tasks: string[];
}

interface BasePost {
  id: string;
  task_id: string;
  platform: string;
  desc: string;
  create_time: string;
  created_at: string;
  updated_at: string;
}

interface TikTokPost extends BasePost {
  platform: "tiktok";
  aweme_id: string;
  content_type: string;
  duration: number;
  group_id: string;
  share_url: string;
  desc_language: string;
  created_by_ai: boolean;
  is_capcut: boolean;
  is_ads: boolean;
  is_top: boolean;
  is_vr: boolean;
  support_danmaku: boolean;
  is_pgcshow: boolean;
  last_aigc_src: string;
  first_aigc_src: string;
  aigc_src: string;
  has_promote_entry: boolean;
  cha_list: Array<{ cid: string; name: string }>;
  with_promotional_music: boolean;
  author_sec_user_id: string;
  author_uid: string;
  author_nickname: string;
  author_unique_id: string;
  mid: string;
  music_play_url: string;
  music_duration: number;
  music_author: string;
  collect_count: number;
  comment_count: number;
  digg_count: number;
  download_count: number;
  play_count: number;
  share_count: number;
  video_url: string;
}

interface DouyinPost extends BasePost {
  platform: "douyin";
  aweme_id: string;
  group_id: string;
  city: string;
  ip_attribution: string;
  region: string;
  duration: number;
  share_url: string;
  digg_count: number;
  comment_count: number;
  share_count: number;
  collect_count: number;
  play_count: number;
  is_ads: boolean;
  is_warned: boolean;
  is_top: boolean;
  with_goods: boolean;
  cha_list: Array<{ cid: string; name: string }>;
  author_nickname: string;
  author_unique_id: string;
  author_sec_user_id: string;
  author_uid: string;
  mid: string;
  music_play_url: string;
  music_duration: number;
  music_author: string;
  image_urls: string[];
  video_url: string;
  shoot_way: string;
}

interface XiaohongshuPost extends BasePost {
  platform: "xiaohongshu";
  note_id: string;
  last_update_time: string;
  title: string;
  type: string;
  images_list: string[];
  author_user_id: string;
  author_nickname: string;
  author_avatar: string;
  has_music: boolean;
  is_good_note: boolean;
  level: number;
  collect_count: number;
  comment_count: number;
  likes_count: number;
  digg_count: number;
  nice_count: number;
  share_count: number;
}

type Post = TikTokPost | DouyinPost | XiaohongshuPost;

interface GetPostsParams {
  platform: "tiktok" | "douyin" | "xiaohongshu";
  platform_user_id: string;
  page?: number;
  limit?: number;
  sort_by_time?: 0 | 1;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    // 优先使用环境变量中的token，如果没有则从localStorage获取
    this.token =
      import.meta.env.VITE_BACKEND_API_TOKEN ||
      localStorage.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async getInfluencers(
    params: GetInfluencersParams,
  ): Promise<ApiResponse<Influencer>> {
    const searchParams = new URLSearchParams();

    searchParams.append("platform", params.platform);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.nickname) searchParams.append("nickname", params.nickname);
    if (params.sort_by_fans)
      searchParams.append("sort_by_fans", params.sort_by_fans);
    if (params.sort_by_likes)
      searchParams.append("sort_by_likes", params.sort_by_likes);
    if (params.sort_by_posts)
      searchParams.append("sort_by_posts", params.sort_by_posts);

    return this.request<ApiResponse<Influencer>>(
      `/account-interaction/influencers?${searchParams.toString()}`,
    );
  }

  async getPosts(params: GetPostsParams): Promise<ApiResponse<Post>> {
    const { platform, platform_user_id, ...queryParams } = params;
    const searchParams = new URLSearchParams();

    if (queryParams.page)
      searchParams.append("page", queryParams.page.toString());
    if (queryParams.limit)
      searchParams.append("limit", queryParams.limit.toString());
    if (queryParams.sort_by_time !== undefined)
      searchParams.append("sort_by_time", queryParams.sort_by_time.toString());

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

    return this.request<ApiResponse<Post>>(
      `/account-interaction/posts/${platform}/${platform_user_id}${query}`,
    );
  }

  async collectAccounts(
    params: CollectAccountsParams,
  ): Promise<CollectAccountsResponse> {
    return this.request<CollectAccountsResponse>(
      "/account-interaction/collect",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      },
    );
  }

  setToken(token: string) {
    this.token = token;
    // 只有在没有环境变量token时才存储到localStorage
    if (!import.meta.env.VITE_BACKEND_API_TOKEN) {
      localStorage.setItem("auth_token", token);
    }
  }

  clearToken() {
    this.token = import.meta.env.VITE_BACKEND_API_TOKEN || null;
    // 只有在没有环境变量token时才清除localStorage
    if (!import.meta.env.VITE_BACKEND_API_TOKEN) {
      localStorage.removeItem("auth_token");
    }
  }
}

export const apiClient = new ApiClient();
export type {
  Influencer,
  TikTokInfluencer,
  DouyinInfluencer,
  XiaohongshuInfluencer,
  Post,
  TikTokPost,
  DouyinPost,
  XiaohongshuPost,
  GetInfluencersParams,
  GetPostsParams,
  ApiResponse,
};
