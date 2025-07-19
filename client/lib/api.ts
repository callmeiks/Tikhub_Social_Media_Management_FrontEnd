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
  updated_at?: string; // X平台没有此字段
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

interface KuaishouInfluencer extends BaseInfluencer {
  platform: "kuaishou";
  user_id: string;
  eid: string;
  user_name: string;
  is_verified: boolean;
  user_avatar: string;
  avatar_url: string;
  user_sex: string;
  user_text: string;
  kwai_id: string;
  city_code: string;
  city_name: string;
  is_user_banned: boolean;
  constellation: string;
  enable_moment: boolean;
  follower_count: number;
  post_count: number;
  following_count: number;
  photo_private_count: number;
  moment_count: number;
  can_guest_show_moment_news: boolean;
  privacy_user: string;
  not_allow_find_me_by_mobile: string;
  not_recommend_to_qq_friends: string;
  not_recommend_to_contacts: string;
  show_same_follow_deny: string;
  frequent_user_deny: string;
  acquaintance_deny: string;
  download_deny: string;
  photo_share_add_watermark: string;
  disable_nearby_online_status: string;
  disable_im_online_status: string;
  allow_others_reward_me: string;
}

interface XInfluencer extends BaseInfluencer {
  platform: "x";
  account_status: string;
  screen_name: string;
  rest_id: string;
  blue_verified: boolean;
  label_link: string;
  label_badge: string;
  label_description: string;
  label_type: string;
  user_avatar: string;
  avatar_url: string;
  desc: string;
  name: string;
  friends_count: number;
  follower_count: number;
  following_count: number;
  tweet_count: number;
  media_count: number;
  pinned_tweet_id: string;
  account_created: string;
  // Note: X platform doesn't have updated_at field, only created_at
}

interface YouTubeInfluencer extends BaseInfluencer {
  platform: "youtube";
  channel_id: string;
  title: string;
  description: string;
  subscriber_count: string;
  video_count: string;
  facebook_link: string;
  twitter_link: string;
  tiktok_link: string;
  instagram_link: string;
  other_links: Array<{
    name: string;
    endpoint: string;
  }>;
  channel_avatar: string;
  avatar_url: string;
  channel_name: string;
  is_verified: boolean;
  has_business_email: boolean;
  view_count: string;
  country: string;
  channel_creation_date: string;
}

interface InstagramInfluencer extends BaseInfluencer {
  platform: "instagram";
  username: string;
  user_id: string;
  fbid: string;
  ai_agent_owner_username: string | null;
  ai_agent_type: string | null;
  bio_links: Array<{
    url: string;
    title: string;
    lynx_url: string;
    link_type: string;
  }>;
  biography: string;
  eimu_id: string;
  external_url: string | null;
  following_count: number;
  has_ar_effects: boolean;
  has_clips: boolean;
  has_channel: boolean;
  has_guides: boolean;
  highlight_reel_count: number;
  is_business_account: boolean;
  is_professional_account: boolean;
  business_contact_method: string;
  business_email: string | null;
  business_address_json: string | null;
  business_phone_number: string | null;
  business_category_name: string | null;
  category_name: string | null;
  profile_pic_url: string;
  avatar_url: string;
  is_private: boolean;
  is_verified: boolean;
  media_count: number;
  country: string | null;
  date_joined_as_timestamp: string;
}

type Influencer = TikTokInfluencer | DouyinInfluencer | XiaohongshuInfluencer | KuaishouInfluencer | XInfluencer | YouTubeInfluencer | InstagramInfluencer;

interface GetInfluencersParams {
  platform: "tiktok" | "douyin" | "xiaohongshu" | "kuaishou" | "x" | "youtube" | "instagram" | "all";
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
  desc?: string; // X平台使用text字段
  create_time?: string; // X平台使用created_time字段
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

interface KuaishouPost extends BasePost {
  platform: "kuaishou";
  photo_id: string;
  eid: string | null;
  reward_count: number;
  collect_count: number;
  video_duration: number;
  author_name: string;
  author_user_id: string;
  author_avatar: string;
  user_sex: string;
  video_caption: string;
  like_count: number;
  view_count: number;
  share_count: number;
  comment_count: number;
  sound_track_id: string;
  sound_track_audio_url: string;
  sound_track_artist: string;
  video_play_url: string;
  blur_probability: number | null;
  blocky_probability: number | null;
  avg_entropy: number | null;
  mos_score: number | null;
  audio_quality: number | null;
  music_probability: number | null;
  dialog_probability: number | null;
  background_sound_probability: number | null;
  stereophonic_richness: number | null;
  share_url: string;
  keyword: string | null;
}

interface XPost extends BasePost {
  platform: "x";
  tweet_id: string;
  created_time: string;
  like_count: number;
  status: string | null;
  text: string;
  retweet_count: number;
  bookmarks_count: number;
  quotes_count: number;
  replies_count: number;
  lang: string;
  view_count: number;
  sensitive: boolean;
  conversation_id: string;
  images_url: string[];
  video_url: string;
  author_rest_id: string;
  author_screen_name: string;
  author_avatar: string;
  author_blue_verified: boolean;
  author_follower_count: number;
  display_url: string;
  expanded_url: string;
  media_type: string;
  is_pinned: boolean;
  keyword: string | null;
}

interface YouTubePost extends BasePost {
  platform: "youtube";
  video_id: string;
  title: string;
  description: string | null;
  channel_id: string;
  channel_name: string | null;
  is_channel_verified: boolean;
  channel_avatar: string | null;
  length_seconds: number;
  view_count: number;
  like_count: number;
  published_time: string;
  is_live_stream: boolean;
  is_live_now: boolean;
  is_regionally_restricted: boolean;
  comment_count: number;
  video_play_url: string | null;
  audio_play_url: string | null;
  keyword: string | null;
}

interface InstagramPost extends BasePost {
  platform: "instagram";
  pk: string;
  code: string;
  taken_at: number;
  taken_at_date: string;
  media_type: number;
  typename: string;
  is_video: boolean;
  user_id: string;
  username: string;
  full_name: string | null;
  profile_pic_url: string | null;
  is_verified: boolean;
  is_private: boolean;
  caption_text: string;
  caption_created_at: string | null;
  hashtags: string[];
  accessibility_caption: string | null;
  thumbnail_url: string;
  image_urls: string[];
  video_url: string;
  video_duration: number | null;
  like_count: number;
  comment_count: number;
  save_count: number;
  share_count: number;
  view_count: number;
  can_save: boolean;
  can_reshare: boolean;
  can_reply: boolean;
  has_liked: boolean;
  comments_disabled: boolean;
  is_paid_partnership: boolean;
  tagged_users: Array<{
    x: number;
    y: number;
    user_id: string;
    username: string;
    full_name: string;
  }>;
  keyword: string | null;
}

type Post = TikTokPost | DouyinPost | XiaohongshuPost | KuaishouPost | XPost | YouTubePost | InstagramPost;

interface GetPostsParams {
  platform: "tiktok" | "douyin" | "xiaohongshu" | "kuaishou" | "x" | "youtube" | "instagram";
  platform_user_id: string;
  page?: number;
  limit?: number;
  sort_by_time?: 0 | 1;
}

interface DouyinFilters {
  sort_type?: "0" | "1" | "2";
  publish_time?: "0" | "1" | "7" | "30";
  filter_duration?: "0" | "1" | "2" | "3";
  content_type?: "0" | "1" | "2" | "3";
}

interface TikTokFilters {
  sort_type?: "0" | "1";
  publish_time?: "0" | "1" | "7" | "30";
}

interface XiaohongshuFilters {
  sort_type?: "general" | "time_descending" | "popularity_descending";
  filter_note_type?: "不限" | "视频" | "图文";
  filter_note_time?: "不限" | "一周内" | "一月内" | "三月内";
}

interface YouTubeFilters {
  order_by?: "relevance" | "this_month" | "this_week" | "today";
  country_code?: string;
}

interface XFilters {
  search_type?: "Top" | "Latest" | "Media" | "People" | "Lists";
}

interface InstagramFilters {
  feed_type?: "top" | "recent";
}

interface KuaishouFilters {
  [key: string]: any;
}

type SearchFilters =
  | DouyinFilters
  | TikTokFilters
  | XiaohongshuFilters
  | YouTubeFilters
  | XFilters
  | InstagramFilters
  | KuaishouFilters;

interface KeywordSearchParams {
  keyword: string;
  platform:
    | "douyin"
    | "tiktok"
    | "xhs"
    | "kuaishou"
    | "youtube"
    | "x"
    | "instagram";
  content_count?: number;
  filters?: SearchFilters;
}

interface KeywordSearchResponse {
  task_id: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  message: string;
}

// Keyword User Search Types
interface DouyinUserFilters {
  douyin_user_fans?: "" | "0_1k" | "1k_1w" | "1w_10w" | "10w_100w" | "100w_";
  douyin_user_type?: "" | "common_user" | "enterprise_user" | "personal_user";
}

interface TikTokUserFilters {
  user_search_follower_count?: "" | "ZERO_TO_ONE_K" | "ONE_K_TO_TEN_K" | "TEN_K_TO_ONE_H_K" | "ONE_H_K_PLUS";
  user_search_profile_type?: "" | "VERIFIED";
}

interface XiaohongshuUserFilters {
  // No filters available for Xiaohongshu
}

interface KuaishouUserFilters {
  // No filters available for Kuaishou
}

type UserSearchFilters = DouyinUserFilters | TikTokUserFilters | XiaohongshuUserFilters | KuaishouUserFilters;

interface KeywordUserSearchParams {
  keyword: string;
  platform: "douyin" | "tiktok" | "xhs" | "kuaishou";
  user_count: number;
  filters?: UserSearchFilters;
}

interface KeywordUserSearchResponse {
  status: "success" | "error";
  task_id: string;
  message: string;
}

// Influencer/User Data Types
interface UserInfluencer {
  id: string;
  task_id: string;
  platform: string;
  platform_user_id: string;
  keyword: string;
  username: string;
  nickname: string;
  avatar_url: string;
  follower_count: number;
  following_count: number;
  post_count: number;
  is_verified: boolean;
  profile_url: string;
  created_at: string;
}

interface GetInfluencersResponse {
  influencers: UserInfluencer[];
  total: number;
  page: number;
  limit: number;
}

interface GetUserInfluencersParams {
  platform?: "douyin" | "tiktok" | "xhs" | "kuaishou";
  keyword?: string;
  page?: number;
  limit?: number;
}

// Kuaishou Hot Rankings types
interface KuaishouHotRankingItem {
  keyword: string;
  hotValue: number;
  id: string;
  is_tophot: boolean;
}

interface KuaishouHotUser {
  order_index: number;
  avatar: string;
  title: string;
  author_id: number;
  hotValue: number;
  viewType: number;
}

interface KuaishouHotLive {
  viewType: number;
  avatar_url: string;
  title: string;
  tag: string;
  hot_score: string;
  authorid: string;
  param_id: string;
  param_type: string;
  linkUrl: string;
}

interface KuaishouHotProduct {
  viewType: number;
  avatar_url: string;
  title: string;
  linkUrl: string;
  hot_score: string;
  id: string;
  type: string;
  authorid: string;
  product_price: string;
  product_review: string;
}

interface KuaishouHotBrandParams {
  sub_tab_id: number;
  sub_tab_name: string;
}

interface KuaishouHotLiveParams {
  sub_tab_id?: number;
  sub_tab_name?: string | null;
}

// Pipixia Hot Rankings types
interface PipixiaHotSearchWord {
  word: string;
  schema: string;
  write_history: boolean;
  hot_type: number;
}

interface PipixiaHotContent {
  item_id: string;
  item_type: number;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar_url: string;
  author_follower_count: number;
  author_following_count: number;
  author_like_count: number;
  author_gender: number;
  author_description: string;
  author_region: string;
  item_create_time: number;
  duration: number;
  video_id: string;
  video_text: string;
  video_url: string;
  today_show_num: number;
}

// Xiaohongshu Hot Rankings types
interface XiaohongshuHotRankingItem {
  icon: string;
  id: string;
  rank_change: number;
  score: string;
  title: string;
  title_img: string;
  type: string;
  word_type: string;
}

// X Hot Rankings types
interface XHotTrendingItem {
  name: string;
  description: string | null;
  context: string;
}

interface XHotTrendingParams {
  country?: string;
}

// YouTube Hot Rankings types
interface YouTubeHotTrendingItem {
  video_id: string;
  title: string;
  author: string;
  number_of_views: number;
  video_length: string;
  description: string;
  is_live_content: boolean | null;
  published_time: string;
  channel_id: string;
  category: string | null;
  type: string;
  keywords: string[];
  thumbnails: Array<{
    url: string;
    width: number;
    height: number;
  }>;
}

interface YouTubeHotTrendingParams {
  language_code?: string;
  country_code?: string;
  section?: string;
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

    // Use port 8001 for account-interaction API
    const apiUrl = this.baseURL.replace(':8000', ':8001');
    const url = `${apiUrl}/account-interaction/posts/${platform}/${platform_user_id}${query}`;
    
    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async getAccountDetail(accountId: string): Promise<Influencer> {
    // Use port 8001 for account-interaction API
    const apiUrl = this.baseURL.replace(':8000', ':8001');
    const url = `${apiUrl}/account-interaction/influencers`;
    
    const headers: Record<string, string> = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    // 从返回的列表中查找匹配的账号
    const account = data.items.find((item: any) => item.id === accountId);
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }
    return account;
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

  async keywordSearch(
    params: KeywordSearchParams,
  ): Promise<KeywordSearchResponse> {
    return this.request<KeywordSearchResponse>("/keyword-search-post/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  }

  async keywordUserSearch(
    params: KeywordUserSearchParams,
  ): Promise<KeywordUserSearchResponse> {
    // The API endpoint expects port 8001 based on the documentation
    const apiUrl = this.baseURL.replace(':8000', ':8001');
    const url = `${apiUrl}/keyword-search-user/search`;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async getUserInfluencers(
    params: GetUserInfluencersParams = {},
  ): Promise<GetInfluencersResponse> {
    // The API endpoint expects port 8001 based on the documentation
    const apiUrl = this.baseURL.replace(':8000', ':8001');
    const searchParams = new URLSearchParams();

    if (params.platform) searchParams.append("platform", params.platform);
    if (params.keyword) searchParams.append("keyword", params.keyword);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    const url = `${apiUrl}/keyword-search-user/influencers?${searchParams.toString()}`;
    
    const headers: Record<string, string> = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  // Kuaishou Hot Rankings API methods
  async getKuaishouHotBoard(): Promise<KuaishouHotRankingItem[]> {
    return this.request<KuaishouHotRankingItem[]>("/hot-rankings/kuaishou/hot-board", {
      method: "POST",
    });
  }

  async getKuaishouHotEntertainmentBoard(): Promise<KuaishouHotRankingItem[]> {
    return this.request<KuaishouHotRankingItem[]>("/hot-rankings/kuaishou/hot-entertainment-board", {
      method: "POST",
    });
  }

  async getKuaishouHotSocialBoard(): Promise<KuaishouHotRankingItem[]> {
    return this.request<KuaishouHotRankingItem[]>("/hot-rankings/kuaishou/hot-social-board", {
      method: "POST",
    });
  }

  async getKuaishouHotUsefulBoard(): Promise<KuaishouHotRankingItem[]> {
    return this.request<KuaishouHotRankingItem[]>("/hot-rankings/kuaishou/hot-useful-board", {
      method: "POST",
    });
  }

  async getKuaishouHotChallengeBoard(): Promise<KuaishouHotRankingItem[]> {
    return this.request<KuaishouHotRankingItem[]>("/hot-rankings/kuaishou/hot-challenge-board", {
      method: "POST",
    });
  }

  async getKuaishouHotSearchUsersRank(): Promise<KuaishouHotUser[]> {
    return this.request<KuaishouHotUser[]>("/hot-rankings/kuaishou/hot-search-users-rank", {
      method: "POST",
    });
  }

  async getKuaishouHotLiveRank(params: KuaishouHotLiveParams = {}): Promise<KuaishouHotLive[]> {
    return this.request<KuaishouHotLive[]>("/hot-rankings/kuaishou/hot-live-rank", {
      method: "POST",
      body: JSON.stringify({
        sub_tab_id: params.sub_tab_id || 0,
        sub_tab_name: params.sub_tab_name || null,
      }),
    });
  }

  async getKuaishouHotShoppingRank(): Promise<KuaishouHotProduct[]> {
    return this.request<KuaishouHotProduct[]>("/hot-rankings/kuaishou/hot-shopping-rank", {
      method: "POST",
    });
  }

  async getKuaishouHotBrandRank(params: KuaishouHotBrandParams): Promise<any[]> {
    return this.request<any[]>("/hot-rankings/kuaishou/hot-brand-rank", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // Pipixia Hot Rankings API methods
  async getPipixiaHotSearchWords(): Promise<PipixiaHotSearchWord[]> {
    return this.request<PipixiaHotSearchWord[]>("/hot-rankings/pipixia/hot-search-words", {
      method: "GET",
    });
  }

  async getPipixiaHotSearchList(): Promise<PipixiaHotContent[]> {
    return this.request<PipixiaHotContent[]>("/hot-rankings/pipixia/hot-search-list", {
      method: "GET",
    });
  }

  // Xiaohongshu Hot Rankings API methods
  async getXiaohongshuHotList(): Promise<XiaohongshuHotRankingItem[]> {
    return this.request<XiaohongshuHotRankingItem[]>("/hot-rankings/xiaohongshu/hot-list", {
      method: "GET",
    });
  }

  // X Hot Rankings API methods
  async getXHotTrending(params: XHotTrendingParams = {}): Promise<XHotTrendingItem[]> {
    return this.request<XHotTrendingItem[]>("/hot-rankings/twitter/trending", {
      method: "POST",
      body: JSON.stringify({
        country: params.country || "UnitedStates",
      }),
    });
  }

  // YouTube Hot Rankings API methods
  async getYouTubeHotTrending(params: YouTubeHotTrendingParams = {}): Promise<YouTubeHotTrendingItem[]> {
    return this.request<YouTubeHotTrendingItem[]>("/hot-rankings/youtube/trending-videos", {
      method: "POST",
      body: JSON.stringify({
        language_code: params.language_code || "en",
        country_code: params.country_code || "us",
        section: params.section || "Now",
      }),
    });
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
  KuaishouInfluencer,
  XInfluencer,
  YouTubeInfluencer,
  InstagramInfluencer,
  Post,
  TikTokPost,
  DouyinPost,
  XiaohongshuPost,
  KuaishouPost,
  XPost,
  YouTubePost,
  InstagramPost,
  GetInfluencersParams,
  GetPostsParams,
  CollectAccountsParams,
  CollectAccountsResponse,
  ApiResponse,
  KeywordSearchParams,
  KeywordSearchResponse,
  SearchFilters,
  DouyinFilters,
  TikTokFilters,
  XiaohongshuFilters,
  YouTubeFilters,
  XFilters,
  InstagramFilters,
  KuaishouFilters,
  KeywordUserSearchParams,
  KeywordUserSearchResponse,
  DouyinUserFilters,
  TikTokUserFilters,
  XiaohongshuUserFilters,
  KuaishouUserFilters,
  UserSearchFilters,
  UserInfluencer,
  GetInfluencersResponse,
  GetUserInfluencersParams,
  KuaishouHotRankingItem,
  KuaishouHotUser,
  KuaishouHotLive,
  KuaishouHotProduct,
  KuaishouHotBrandParams,
  KuaishouHotLiveParams,
  PipixiaHotSearchWord,
  PipixiaHotContent,
  XiaohongshuHotRankingItem,
  XHotTrendingItem,
  XHotTrendingParams,
  YouTubeHotTrendingItem,
  YouTubeHotTrendingParams,
};
