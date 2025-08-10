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
  uid?: string;
  category?: string;
  avatar_url: string;
  signature: string;
  signature_language?: string;
  share_url: string;
  ins_id?: string;
  twitter_id?: string;
  youtube_channel_id?: string;
  youtube_channel_title?: string;
  android_download_app_link?: string;
  ios_download_app_link?: string;
  is_enterprise_verify?: boolean;
  commerce_user_level?: number;
  is_star?: boolean;
  is_effect_artist?: boolean;
  live_commerce?: boolean;
  message_chat_entry?: boolean;
  with_commerce_entry?: boolean;
  with_new_goods?: boolean;
  following_count: number;
  region?: string;
  language?: string;
  is_verified?: boolean;
  is_live_open?: boolean;
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

type Influencer =
  | TikTokInfluencer
  | DouyinInfluencer
  | XiaohongshuInfluencer
  | KuaishouInfluencer
  | XInfluencer
  | YouTubeInfluencer
  | InstagramInfluencer;

interface GetInfluencersParams {
  platform:
    | "tiktok"
    | "douyin"
    | "xiaohongshu"
    | "kuaishou"
    | "x"
    | "youtube"
    | "instagram"
    | "all";
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

type Post =
  | TikTokPost
  | DouyinPost
  | XiaohongshuPost
  | KuaishouPost
  | XPost
  | YouTubePost
  | InstagramPost;

// 抖音KOL搜索请求参数
interface DouyinKolSearchRequest {
  keyword: string;
  max_users: number;
}

// 抖音KOL搜索结果
interface DouyinKolSearchResult {
  assign_cpm_suggest_price: number | null;
  author_status: number;
  author_type: number;
  avatar_uri: string;
  nick_name: string;
  id: string;
  core_user_id: string;
  city: string;
  province: string;
  content_theme_labels_180d: string[];
  tags_relation: Record<string, string[]>;
  follower: number;
  follower_count: number | string;
  fans_increment_rate_within_15d: number;
  fans_increment_within_15d: number;
  fans_increment_within_30d: number;
  e_commerce_enable: boolean | null;
  ecom_score: number | null;
  ecom_video_product_num_30d: number | null;
  price_1_20: number | null;
  price_20_60: number | null;
  price_60: number | null;
  expected_play_num: number;
  expected_natural_play_num: number;
  brand_boost_vv: number | null;
  vv_median_30d: number;
  star_index: number | string | null;
  link_convert_index: number | null;
  link_shopping_index: number | null;
  link_spread_index: number | null;
  link_star_index: number | null;
  interaction_median_30d: number;
  gender: number;
  kol_id: string;
}

interface DouyinKolSearchResponse {
  results: DouyinKolSearchResult[];
}

// KOL管理接口
interface DouyinKolFetchInfoRequest {
  urls: string[];
}

interface DouyinKolFetchInfoResponse {
  total_successful: number;
  total_failed: number;
  failed_urls: string[];
  celery_tasks: {
    task_id: string;
    celery_id: string;
    url: string;
  }[];
}

interface DouyinKolListParams {
  page?: number;
  limit?: number;
  nickname?: string;
  sort_by_fans?: boolean;
}

interface DouyinKolInfo {
  id: string;
  kol_id: string;
  sec_user_id: string | null;
  core_user_id: string;
  unique_id: string;
  short_id: string;
  nick_name: string;
  avatar_uri: string;
  gender: string;
  age: number | null;
  author_status: number | null;
  author_type: number | null;
  city: string;
  province: string;
  mcn_id: string;
  mcn_name: string;
  follower_count: number;
  fans_increment_rate_within_15d: number | null;
  fans_increment_within_15d: number | null;
  fans_increment_within_30d: number | null;
  is_star: boolean;
  is_online: boolean;
  is_game_author: boolean;
  is_plan_author: boolean;
  e_commerce_enable: boolean;
  ecom_score: number | null;
  ecom_video_product_num_30d: number | null;
  assign_cpm_suggest_price: number | null;
  price_1_20: number | null;
  price_20_60: number | null;
  price_60: number | null;
  expected_play_num: number | null;
  expected_natural_play_num: number | null;
  brand_boost_vv: number | null;
  vv_median_30d: number | null;
  interaction_median_30d: number | null;
  star_index: number | null;
  link_convert_index: number | null;
  link_shopping_index: number | null;
  link_spread_index: number | null;
  link_star_index: number | null;
  tags_relation: { [key: string]: string[] } | null;
  created_at: string;
  updated_at: string;
}

interface DouyinKolListResponse {
  kols: DouyinKolInfo[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// KOL详情相关接口
interface KolDetailRequest {
  kol_id: string;
}

// 受众画像分析
interface AudiencePortraitResponse {
  city: {
    data: Array<{distribution_key: string; distribution_value: string}>;
    description: string;
  };
  city_level: {
    data: Array<{distribution_key: string; distribution_value: string}>;
    description: string;
  };
  interests: {
    data: Array<{distribution_key: string; distribution_value: string}>;
    description: string;
  };
  audience_category: {
    data: Array<{distribution_key: string; distribution_value: string}>;
    description: string;
  };
  age: {
    data: Array<{distribution_key: string; distribution_value: string}>;
    description: string;
  };
  gender: {
    data: Array<{distribution_key: string; distribution_value: string}>;
    description: string;
  };
  phone_type: {
    data: Array<{distribution_key: string; distribution_value: string}>;
    description: string;
  };
  province: {
    data: Array<{distribution_key: string; distribution_value: string}>;
    description: string;
  };
}

// 服务报价查询
interface ServicePricingResponse {
  industry_tags: string[];
  service_pricing: Array<{
    activity_info: any[];
    author_id: string;
    desc: string;
    do_fold: boolean;
    enable: boolean;
    end_time: string;
    field: string;
    has_discount: boolean;
    is_open: boolean;
    need_price: boolean;
    online_status: number;
    origin_price: number;
    platform_activity_id: string;
    platform_source: number;
    price: number;
    settlement_desc: string;
    settlement_type: number;
    start_time: string;
    task_category: number;
    task_category_status: number;
    template_list: any[];
    video_type: number;
  }>;
}

// 视频表现分析
interface VideoPerformanceRequest extends KolDetailRequest {
  type: string;
  range: string;
}

interface VideoPerformanceResponse {
  video_performance_overview: {
    avg_duration: string;
    base_resp: {
      status_code: number;
      status_message: string;
    };
    comment_avg: string;
    expect_cpe: {
      cpe_1_20: string;
      cpe_21_60: string;
      cpe_60: string;
    };
    expect_cpm: {
      cpm_1_20: string;
      cpm_21_60: string;
      cpm_60: string;
    };
    interact_rate: {
      label: string;
      overtake: number;
      value: number;
    };
    item_num: string;
    item_rate: {
      interact_rate: any;
      item_num: {
        label: string;
        overtake: number;
        value: number;
      };
      play_mid: {
        label: string;
        overtake: number;
        value: number;
      };
    };
    like_avg: string;
    play_mid: string;
    play_over_rate: {
      label: string;
      overtake: number;
      value: number;
    };
    play_stability: {
      label: string;
      overtake: number;
      value: number;
    };
    sales_expect_cpm: {
      cpm_1_20: string;
      cpm_21_60: string;
      cpm_60: string;
    };
    share_avg: string;
  };
  latest_videos: Array<{
    comment: number;
    core_user_id: string;
    create_time: number;
    create_timestamp: number;
    duration: number;
    duration_min: number;
    head_image_uri: string;
    is_hot: boolean;
    is_playlet: number;
    item_animated_cover: string;
    item_cover: string;
    item_date: string;
    item_id: string;
    item_title: string;
    like: number;
    media_type: string;
    original_status: number;
    play: number;
    share: number;
    status: number;
    title: string;
    url: string;
    video_id: string;
  }>;
  latest_star_videos: Array<{
    comment: number;
    core_user_id: string;
    create_time: number;
    create_timestamp: number;
    duration: number;
    duration_min: number;
    head_image_uri: string;
    is_hot: boolean;
    is_playlet: number;
    item_animated_cover: string;
    item_cover: string;
    item_date: string;
    item_id: string;
    item_title: string;
    like: number;
    media_type: string;
    original_status: number;
    play: number;
    share: number;
    status: number;
    title: string;
    url: string;
    video_id: string;
  }>;
}

// 影响力指标
interface InfluenceMetricsResponse {
  base_resp: {
    status_code: number;
    status_message: string;
  };
  cooperate_index: {
    avg_value: number;
    link_relative_ratio: number;
    rank: string;
    rank_percent: number;
    value: number;
  };
  cp_index: {
    avg_value: number;
    link_relative_ratio: number;
    rank: string;
    rank_percent: number;
    value: number;
  };
  link_convert_index: {
    avg_value: number;
    link_relative_ratio: number;
    rank: string;
    rank_percent: number;
    value: number;
  };
  link_shopping_index: {
    avg_value: number;
    link_relative_ratio: number;
    rank: string;
    rank_percent: number;
    value: number;
  };
  link_spread_index: {
    avg_value: number;
    link_relative_ratio: number;
    rank: string;
    rank_percent: number;
    value: number;
  };
  link_star_index: {
    avg_value: number;
    link_relative_ratio: number;
    rank: string;
    rank_percent: number;
    value: number;
  };
}

// 粉丝趋势分析
interface FansTrendRequest extends KolDetailRequest {
  start_date: string;
  end_date: string;
}

interface FansTrendResponse {
  fans_count: Array<{
    date: string;
    fans_cnt: string;
  }>;
  fans_growth: Array<{
    date: string;
    fans_cnt: string;
  }>;
}

// 热门评论词汇
interface HotCommentWordsResponse {
  hot_comment_words: Array<{
    comment_token: string;
    hot_rate: number;
  }>;
}

interface GetPostsParams {
  platform:
    | "tiktok"
    | "douyin"
    | "xiaohongshu"
    | "kuaishou"
    | "x"
    | "youtube"
    | "instagram";
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
  user_search_follower_count?:
    | ""
    | "ZERO_TO_ONE_K"
    | "ONE_K_TO_TEN_K"
    | "TEN_K_TO_ONE_H_K"
    | "ONE_H_K_PLUS";
  user_search_profile_type?: "" | "VERIFIED";
}

interface XiaohongshuUserFilters {
  // No filters available for Xiaohongshu
}

interface KuaishouUserFilters {
  // No filters available for Kuaishou
}

type UserSearchFilters =
  | DouyinUserFilters
  | TikTokUserFilters
  | XiaohongshuUserFilters
  | KuaishouUserFilters;

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
  platform_user_id?: string;
  keyword: string;
  username?: string;
  nickname: string;
  avatar_url: string;
  follower_count: number;
  following_count: number;
  post_count?: number;
  is_verified?: boolean;
  profile_url?: string;
  created_at: string;
  
  // Douyin-specific fields
  sec_user_id?: string;
  unique_id?: string;
  age?: number | null;
  gender?: number;
  signature?: string | null;
  share_url?: string | null;
  total_favorited?: number;
  max_follower_count?: number;
  aweme_count?: number;
  ip_location?: string | null;
  is_star?: boolean;
  is_effect_artist?: boolean;
  is_gov_media_vip?: boolean;
  is_live_commerce?: boolean;
  is_xingtu_kol?: boolean;
  with_commerce_entry?: boolean;
  with_fusion_shop_entry?: boolean;
  with_new_goods?: boolean;
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

// Douyin Rankings API Interfaces
interface DouyinHotRiseParams {
  max_topics?: number;
  order?: "rank" | "rank_diff";
  sentence_tags?: string;
}

interface DouyinHotCityParams {
  max_topics?: number;
  order?: "rank" | "rank_diff";
  city_code?: string;
  sentence_tags?: string;
}

interface DouyinHotChallengeParams {
  max_topics?: number;
  keyword?: string;
}

interface DouyinHotSearchParams {
  board_type?: number;
  board_sub_type?: string;
}

interface DouyinHotAccountParams {
  max_users?: number;
  date_window?: number;
  query_tag?: object;
}

interface DouyinHotVideoParams {
  max_videos?: number;
  date_window?: number;
  tags?: object;
}

interface DouyinHotWordsParams {
  max_words?: number;
  date_window?: number;
  keyword?: string;
}

interface DouyinHotBrandParams {
  category_id: string;
}

interface DouyinHotActivityCalendarParams {
  city_code?: string;
  category_code?: string;
  start_date?: number;
  end_date?: number;
}

// Response interfaces
interface DouyinHotTrendPoint {
  datetime: string;
  hot_score: number;
}

interface DouyinHotTopic {
  rank: number;
  rank_diff?: number;
  sentence: string;
  sentence_id: string;
  create_at: number;
  hot_score: number;
  video_count: number;
  sentence_tag: string;
  city_code: string;
  city_name: string;
  trends: DouyinHotTrendPoint[];
  index: number;
  sentence_tag_name: string;
  snapshot_type: string;
  snapshot_id: string;
}

interface DouyinHotSearchItem {
  can_extend_detail: boolean;
  discuss_video_count: number;
  event_time: number;
  group_id: string;
  hot_value: number;
  hotlist_param: string;
  is_n1: boolean;
  label: string;
  label_url: string;
  max_rank: number;
  position: number;
  sentence_id: string;
  sentence_tag: string;
  video_count: number;
  view_count: number;
  word: string;
  word_cover: string;
  word_type: string;
}

interface DouyinHotAccount {
  user_id: string;
  nick_name: string;
  avatar_url: string;
  fans_cnt: number;
  like_cnt: number;
  publish_cnt: number;
  fans_trends: number[];
}

interface DouyinHotVideo {
  video_id: string;
  title: string;
  author: string;
  play_count: number;
  like_count: number;
  share_count: number;
  comment_count: number;
  create_time: number;
  video_url: string;
  cover_url: string;
  duration: number;
  tags: string[];
  hot_score: number;
}

interface DouyinHotWord {
  word: string;
  hot_score: number;
  video_count: number;
  view_count: number;
  create_time: number;
  trend: string;
  category: string;
  related_words: string[];
}

interface DouyinHotMusic {
  id: string;
  title: string;
  author: string;
  album: string;
  play_url: string;
  cover_large: string;
  duration: number;
  is_high_follow_user: boolean;
  hit_high_follow_original: boolean;
  peak: number;
  has_edited: boolean;
  loudness: number;
  languages: string[];
  moods: string[];
  genres: string[];
  themes: string[];
  aeds: any[];
  user_count: number;
  status: number;
  is_original: boolean;
  mid: string;
  is_restricted: boolean;
  lyric_url: string;
  is_commerce_music: boolean;
  is_pgc: boolean;
  share_enable: boolean;
  story_share: boolean;
  playlist_available: boolean;
  collect_available: boolean;
  download_available: boolean;
  heat: number;
  can_background_play: boolean;
  has_copyright: boolean;
}

interface DouyinHotBrand {
  brand_id: string;
  brand_name: string;
  category: string;
  logo_url: string;
  hot_score: number;
  video_count: number;
  view_count: number;
  rank: number;
  trend: string;
  description: string;
}

interface DouyinHotLive {
  user_id: string;
  nickname: string;
  gender: number;
  avatar: string;
  verified: boolean;
  display_id: string;
  with_commerce_permission: boolean;
  with_fusion_shop_entry: boolean;
  sec_uid: string;
  is_anonymous: boolean;
  pay_grade_level: number;
  current_grade_min_diamond: number;
  current_grade_max_diamond: number;
  score: number;
  rank: number;
  gap_description: string;
  room_title: string;
  room_id: string;
  room_user_count: number;
  room_cover: string;
}

interface DouyinHotActivity {
  id: string;
  parent_id: string;
  hot_title: string;
  start_date: number;
  end_date: number;
  level_code: string;
  category_name: string;
  city_name: string;
  event_ids: string[];
  cover_url: string;
  event_status: string;
  sentence_id: string;
  sentence_type: string;
  sentence_rank: number;
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
    customBaseURL?: string,
  ): Promise<T> {
    const baseURL = customBaseURL || this.baseURL;
    const url = `${baseURL}${endpoint}`;
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
    const endpoint = `/user-collection/posts/${platform}/${platform_user_id}${query}`;

    return this.request<ApiResponse<Post>>(endpoint, {
      method: "GET",
    });
  }

  async getAccountDetail(accountId: string): Promise<Influencer> {
    const data = await this.request<{ items: Influencer[] }>("/account-interaction/influencers", {
      method: "GET",
    });

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
    return this.request<KeywordUserSearchResponse>("/keyword-search-user/search", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getUserInfluencers(
    params: GetUserInfluencersParams = {},
  ): Promise<GetInfluencersResponse> {
    const searchParams = new URLSearchParams();

    if (params.platform) searchParams.append("platform", params.platform);
    if (params.keyword) searchParams.append("keyword", params.keyword);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    const endpoint = `/keyword-search-user/influencers?${searchParams.toString()}`;
    
    return this.request<GetInfluencersResponse>(endpoint, {
      method: "GET",
    });
  }

  // Douyin Rankings API Methods
  async getDouyinHotRise(
    params: DouyinHotRiseParams = {},
  ): Promise<DouyinHotTopic[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-rise`;
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

  async getDouyinHotCity(
    params: DouyinHotCityParams = {},
  ): Promise<DouyinHotTopic[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-city`;
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

  async getDouyinHotChallenge(
    params: DouyinHotChallengeParams = {},
  ): Promise<DouyinHotTopic[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-challenge`;
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

  async getDouyinHotSearch(
    params: DouyinHotSearchParams = {},
  ): Promise<DouyinHotSearchItem[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-search`;
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

  async getDouyinHotAccount(
    params: DouyinHotAccountParams = {},
  ): Promise<DouyinHotAccount[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-account`;
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

  async getDouyinHotVideo(
    params: DouyinHotVideoParams = {},
  ): Promise<DouyinHotVideo[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-video`;
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

  async getDouyinHotLowFan(
    params: DouyinHotVideoParams = {},
  ): Promise<DouyinHotVideo[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-low-fan`;
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

  async getDouyinHotHighCompletionRate(
    params: DouyinHotVideoParams = {},
  ): Promise<DouyinHotVideo[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-high-completion-rate`;
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

  async getDouyinHotHighLikeRate(
    params: DouyinHotVideoParams = {},
  ): Promise<DouyinHotVideo[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-high-like-rate`;
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

  async getDouyinHotHighFanRate(
    params: DouyinHotVideoParams = {},
  ): Promise<DouyinHotVideo[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-high-fan-rate`;
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

  async getDouyinHotTopics(
    params: DouyinHotVideoParams = {},
  ): Promise<DouyinHotVideo[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-topics`;
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

  async getDouyinHotWords(
    params: DouyinHotWordsParams = {},
  ): Promise<DouyinHotWord[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-words`;
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

  async getDouyinHotMusic(): Promise<DouyinHotMusic[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-music`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async getDouyinHotBrand(
    params: DouyinHotBrandParams,
  ): Promise<DouyinHotBrand[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-brand`;
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

  async getDouyinHotLive(): Promise<DouyinHotLive[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-live`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async getDouyinHotActivityCalendar(
    params: DouyinHotActivityCalendarParams = {},
  ): Promise<DouyinHotActivity[]> {
    const url = `${this.baseURL}/hot-rankings/douyin/hot-activity-calendar`;
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

  // Kuaishou Hot Rankings API methods
  async getKuaishouHotBoard(): Promise<KuaishouHotRankingItem[]> {
    return this.request<KuaishouHotRankingItem[]>(
      "/hot-rankings/kuaishou/hot-board",
      {
        method: "POST",
      },
    );
  }

  async getKuaishouHotEntertainmentBoard(): Promise<KuaishouHotRankingItem[]> {
    return this.request<KuaishouHotRankingItem[]>(
      "/hot-rankings/kuaishou/hot-entertainment-board",
      {
        method: "POST",
      },
    );
  }

  async getKuaishouHotSocialBoard(): Promise<KuaishouHotRankingItem[]> {
    return this.request<KuaishouHotRankingItem[]>(
      "/hot-rankings/kuaishou/hot-social-board",
      {
        method: "POST",
      },
    );
  }

  async getKuaishouHotUsefulBoard(): Promise<KuaishouHotRankingItem[]> {
    return this.request<KuaishouHotRankingItem[]>(
      "/hot-rankings/kuaishou/hot-useful-board",
      {
        method: "POST",
      },
    );
  }

  async getKuaishouHotChallengeBoard(): Promise<KuaishouHotRankingItem[]> {
    return this.request<KuaishouHotRankingItem[]>(
      "/hot-rankings/kuaishou/hot-challenge-board",
      {
        method: "POST",
      },
    );
  }

  async getKuaishouHotSearchUsersRank(): Promise<KuaishouHotUser[]> {
    return this.request<KuaishouHotUser[]>(
      "/hot-rankings/kuaishou/hot-search-users-rank",
      {
        method: "POST",
      },
    );
  }

  async getKuaishouHotLiveRank(
    params: KuaishouHotLiveParams = {},
  ): Promise<KuaishouHotLive[]> {
    return this.request<KuaishouHotLive[]>(
      "/hot-rankings/kuaishou/hot-live-rank",
      {
        method: "POST",
        body: JSON.stringify({
          sub_tab_id: params.sub_tab_id || 0,
          sub_tab_name: params.sub_tab_name || null,
        }),
      },
    );
  }

  async getKuaishouHotShoppingRank(): Promise<KuaishouHotProduct[]> {
    return this.request<KuaishouHotProduct[]>(
      "/hot-rankings/kuaishou/hot-shopping-rank",
      {
        method: "POST",
      },
    );
  }

  async getKuaishouHotBrandRank(
    params: KuaishouHotBrandParams,
  ): Promise<any[]> {
    return this.request<any[]>("/hot-rankings/kuaishou/hot-brand-rank", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }


  // Xiaohongshu Hot Rankings API methods
  async getXiaohongshuHotList(): Promise<XiaohongshuHotRankingItem[]> {
    return this.request<XiaohongshuHotRankingItem[]>(
      "/hot-rankings/xiaohongshu/hot-list",
      {
        method: "GET",
      },
    );
  }

  // X Hot Rankings API methods
  async getXHotTrending(
    params: XHotTrendingParams = {},
  ): Promise<XHotTrendingItem[]> {
    return this.request<XHotTrendingItem[]>("/hot-rankings/twitter/trending", {
      method: "POST",
      body: JSON.stringify({
        country: params.country || "UnitedStates",
      }),
    });
  }

  // YouTube Hot Rankings API methods
  async getYouTubeHotTrending(
    params: YouTubeHotTrendingParams = {},
  ): Promise<YouTubeHotTrendingItem[]> {
    return this.request<YouTubeHotTrendingItem[]>(
      "/hot-rankings/youtube/trending-videos",
      {
        method: "POST",
        body: JSON.stringify({
          language_code: params.language_code || "en",
          country_code: params.country_code || "us",
          section: params.section || "Now",
        }),
      },
    );
  }

  // 抖音KOL搜索API
  async searchDouyinKol(params: DouyinKolSearchRequest): Promise<DouyinKolSearchResponse> {
    return this.request<DouyinKolSearchResponse>(
      "/kol/douyin/search",
      {
        method: "POST",
        body: JSON.stringify(params),
      },
      API_BASE_URL
    );
  }

  // 抖音KOL管理API - 添加KOL到分析列表
  async fetchDouyinKolInfo(params: DouyinKolFetchInfoRequest): Promise<DouyinKolFetchInfoResponse> {
    return this.request<DouyinKolFetchInfoResponse>(
      "/kol/douyin/create-tasks",
      {
        method: "POST",
        body: JSON.stringify(params),
      },
      API_BASE_URL
    );
  }

  // 抖音KOL管理API - 获取KOL列表
  async getDouyinKolList(params: DouyinKolListParams = {}): Promise<DouyinKolListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.nickname) queryParams.append('nickname', params.nickname);
    if (params.sort_by_fans !== undefined) queryParams.append('sort_by_fans', params.sort_by_fans.toString());

    const endpoint = `/kol/douyin/kols${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return this.request<DouyinKolListResponse>(
      endpoint,
      {
        method: "GET",
      },
      API_BASE_URL
    );
  }

  // KOL详情分析相关API
  // 受众画像分析
  async getKolAudiencePortrait(params: KolDetailRequest): Promise<AudiencePortraitResponse> {
    return this.request<AudiencePortraitResponse>(
      "/kol/douyin/audience-portrait",
      {
        method: "POST",
        body: JSON.stringify(params),
      },
      API_BASE_URL
    );
  }

  // 服务报价查询
  async getKolServicePricing(params: KolDetailRequest): Promise<ServicePricingResponse> {
    return this.request<ServicePricingResponse>(
      "/kol/douyin/service-price",
      {
        method: "POST",
        body: JSON.stringify(params),
      },
      API_BASE_URL
    );
  }

  // 视频表现分析
  async getKolVideoPerformance(params: VideoPerformanceRequest): Promise<VideoPerformanceResponse> {
    return this.request<VideoPerformanceResponse>(
      "/kol/douyin/video-performance",
      {
        method: "POST",
        body: JSON.stringify(params),
      },
      API_BASE_URL
    );
  }

  // 影响力指标
  async getKolInfluenceMetrics(params: KolDetailRequest): Promise<InfluenceMetricsResponse> {
    return this.request<InfluenceMetricsResponse>(
      "/kol/douyin/influence-metrics",
      {
        method: "POST",
        body: JSON.stringify(params),
      },
      API_BASE_URL
    );
  }

  // 粉丝趋势分析
  async getKolFansTrend(params: FansTrendRequest): Promise<FansTrendResponse> {
    return this.request<FansTrendResponse>(
      "/kol/douyin/fans-trend",
      {
        method: "POST",
        body: JSON.stringify(params),
      },
      API_BASE_URL
    );
  }

  // 热门评论词汇
  async getKolHotCommentWords(params: KolDetailRequest): Promise<HotCommentWordsResponse> {
    return this.request<HotCommentWordsResponse>(
      "/kol/douyin/hot-comment-words",
      {
        method: "POST",
        body: JSON.stringify(params),
      },
      API_BASE_URL
    );
  }

  // 获取用户的KOL任务列表
  async getDouyinKolTasks(): Promise<any> {
    return this.request<any>(
      "/kol/douyin/tasks",
      {
        method: "GET",
      },
      API_BASE_URL
    );
  }

  // 获取Top 50 KOLs
  async getDouyinTop50Kols(): Promise<any> {
    return this.request<any>(
      "/kol/douyin/top50",
      {
        method: "GET",
      },
      API_BASE_URL
    );
  }

  // 取消KOL任务
  async cancelDouyinKolTask(taskId: string): Promise<any> {
    return this.request<any>(
      `/kol/douyin/task/${taskId}/cancel`,
      {
        method: "POST",
      },
      API_BASE_URL
    );
  }

  // 重试KOL任务
  async retryDouyinKolTask(taskId: string): Promise<any> {
    return this.request<any>(
      `/kol/douyin/task/${taskId}/retry`,
      {
        method: "POST",
      },
      API_BASE_URL
    );
  }

  // 获取KOL详情（根据ID）
  async getDouyinKolDetails(kolId: string): Promise<any> {
    return this.request<any>(
      `/kol/douyin/${kolId}`,
      {
        method: "GET",
      },
      API_BASE_URL
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
  KuaishouInfluencer,
  XInfluencer,
  YouTubeInfluencer,
  InstagramInfluencer,
  DouyinKolSearchRequest,
  DouyinKolSearchResult,
  DouyinKolSearchResponse,
  DouyinKolFetchInfoRequest,
  DouyinKolFetchInfoResponse,
  DouyinKolListParams,
  DouyinKolInfo,
  DouyinKolListResponse,
  KolDetailRequest,
  AudiencePortraitResponse,
  ServicePricingResponse,
  VideoPerformanceRequest,
  VideoPerformanceResponse,
  InfluenceMetricsResponse,
  FansTrendRequest,
  FansTrendResponse,
  HotCommentWordsResponse,
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
  // Douyin Rankings Types
  DouyinHotRiseParams,
  DouyinHotCityParams,
  DouyinHotChallengeParams,
  DouyinHotSearchParams,
  DouyinHotAccountParams,
  DouyinHotVideoParams,
  DouyinHotWordsParams,
  DouyinHotBrandParams,
  DouyinHotActivityCalendarParams,
  DouyinHotTrendPoint,
  DouyinHotTopic,
  DouyinHotSearchItem,
  DouyinHotAccount,
  DouyinHotVideo,
  DouyinHotWord,
  DouyinHotMusic,
  DouyinHotBrand,
  DouyinHotLive,
  DouyinHotActivity,
  KuaishouHotRankingItem,
  KuaishouHotUser,
  KuaishouHotLive,
  KuaishouHotProduct,
  KuaishouHotBrandParams,
  KuaishouHotLiveParams,
  XiaohongshuHotRankingItem,
  XHotTrendingItem,
  XHotTrendingParams,
  YouTubeHotTrendingItem,
  YouTubeHotTrendingParams,
};
