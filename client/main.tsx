import "./global.css";
import React from "react";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreatorTools from "./pages/CreatorTools";
import CaptionWriter from "./pages/CaptionWriter";
import TitleGenerator from "./pages/TitleGenerator";
import ShootingScriptGenerator from "./pages/ShootingScriptGenerator";
import ForbiddenWords from "./pages/ForbiddenWords";
import VideoDownload from "./pages/VideoDownload";
import ContentExtract from "./pages/ContentExtract";
import TranscriptGenerator from "./pages/TranscriptGenerator";
import VideoNoteExtract from "./pages/VideoNoteExtract";
import AudioExtract from "./pages/AudioExtract";
import AIVideoGeneration from "./pages/AIVideoGeneration";
import AccountPK from "./pages/AccountPK";
import CoverImageCreation from "./pages/CoverImageCreation";
import DataCollection from "./pages/DataCollection";
import AccountInteraction from "./pages/AccountInteraction";
import AccountDetails from "./pages/AccountDetails";
import AccountDetailDouyin from "./pages/AccountDetailDouyin";
import AccountDetailTikTok from "./pages/AccountDetailTikTok";
import AccountDetailXiaohongshu from "./pages/AccountDetailXiaohongshu";
import AccountDetailKuaishou from "./pages/AccountDetailKuaishou";
import AccountDetailX from "./pages/AccountDetailX";
import AccountDetailYoutube from "./pages/AccountDetailYoutube";
import AccountDetailInstagram from "./pages/AccountDetailInstagram";
import ContentInteraction from "./pages/ContentInteraction";
import ContentDetail from "./pages/ContentDetail";
import ContentDetailTiktok from "./pages/ContentDetailTiktok";
import ContentDetailDouyin from "./pages/ContentDetailDouyin";
import ContentDetailKuaishou from "./pages/ContentDetailKuaishou";
import ContentDetailYoutube from "./pages/ContentDetailYoutube";
import ContentDetailX from "./pages/ContentDetailX";
import ContentDetailWeibo from "./pages/ContentDetailWeibo";
import ContentDetailWechat from "./pages/ContentDetailWechat";
import ContentDetailInstagram from "./pages/ContentDetailInstagram";
import ContentDetailBilibili from "./pages/ContentDetailBilibili";
import KeywordContentSearch from "./pages/KeywordContentSearch";
import KeywordAccountSearch from "./pages/KeywordAccountSearch";
import ContentMonitoring from "./pages/ContentMonitoring";
import InfluencerMonitoring from "./pages/InfluencerMonitoring";
import CustomRankings from "./pages/CustomRankings";
import DataMonitoring from "./pages/DataMonitoring";
import DouyinMonitoring from "./pages/DouyinMonitoring";
import TikTokMonitoring from "./pages/TikTokMonitoring";
import XiaohongshuMonitoring from "./pages/XiaohongshuMonitoring";
import KuaishouMonitoring from "./pages/KuaishouMonitoring";
import InstagramMonitoring from "./pages/InstagramMonitoring";
import HotRankings from "./pages/HotRankings";
import DouyinRankings from "./pages/DouyinRankings";
import TikTokRankings from "./pages/TikTokRankings";
import KuaishouRankings from "./pages/KuaishouRankings";
import XiaohongshuRankings from "./pages/XiaohongshuRankings";
import XRankings from "./pages/XRankings";
import YouTubeRankings from "./pages/YouTubeRankings";
import PipixiaRankings from "./pages/PipixiaRankings";
import UniversalConverter from "./pages/UniversalConverter";
import DouyinKolSearch from "./pages/DouyinKolSearch";
import DouyinKolAnalysis from "./pages/DouyinKolAnalysis";
import DouyinKolAnalysisDetail from "./pages/DouyinKolAnalysisDetail";
import TikTokCreatorSearch from "./pages/TikTokCreatorSearch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/creator-tools/*" element={<CreatorTools />} />
          <Route path="/creator-tools/rewrite" element={<CaptionWriter />} />
          <Route
            path="/creator-tools/title-generator"
            element={<TitleGenerator />}
          />
          <Route
            path="/creator-tools/shooting-script"
            element={<ShootingScriptGenerator />}
          />
          <Route
            path="/creator-tools/forbidden-words"
            element={<ForbiddenWords />}
          />
          <Route
            path="/creator-tools/video-download"
            element={<VideoDownload />}
          />
          <Route
            path="/creator-tools/content-extract"
            element={<ContentExtract />}
          />
          <Route
            path="/creator-tools/short-video-copy"
            element={<TranscriptGenerator />}
          />
          <Route
            path="/creator-tools/video-note-extract"
            element={<VideoNoteExtract />}
          />
          <Route
            path="/creator-tools/audio-extract"
            element={<AudioExtract />}
          />
          <Route
            path="/creator-tools/ai-video"
            element={<AIVideoGeneration />}
          />
          <Route
            path="/creator-tools/account-analysis"
            element={<AccountPK />}
          />
          <Route
            path="/creator-tools/image-recreation"
            element={<CoverImageCreation />}
          />
          <Route
            path="/creator-tools/universal-converter"
            element={<UniversalConverter />}
          />
          <Route path="/data-collection/*" element={<DataCollection />} />

          <Route
            path="/data-collection/account-interaction"
            element={<AccountInteraction />}
          />
          <Route
            path="/data-collection/account-details/:platform/:accountId"
            element={<AccountDetails />}
          />
          <Route
            path="/data-collection/content-interaction"
            element={<ContentInteraction />}
          />
          <Route
            path="/data-collection/content-detail/:contentId"
            element={<ContentDetail />}
          />
          <Route
            path="/data-collection/content-detail-tiktok"
            element={<ContentDetailTiktok />}
          />
          <Route
            path="/data-collection/content-detail-douyin"
            element={<ContentDetailDouyin />}
          />
          <Route
            path="/data-collection/content-detail-kuaishou"
            element={<ContentDetailKuaishou />}
          />
          <Route
            path="/data-collection/content-detail-youtube"
            element={<ContentDetailYoutube />}
          />
          <Route
            path="/data-collection/content-detail-x"
            element={<ContentDetailX />}
          />
          <Route
            path="/data-collection/content-detail-weibo"
            element={<ContentDetailWeibo />}
          />
          <Route
            path="/data-collection/content-detail-wechat"
            element={<ContentDetailWechat />}
          />
          <Route
            path="/data-collection/content-detail-instagram"
            element={<ContentDetailInstagram />}
          />
          <Route
            path="/data-collection/content-detail-bilibili"
            element={<ContentDetailBilibili />}
          />
          <Route
            path="/data-collection/keyword-content"
            element={<KeywordContentSearch />}
          />
          <Route
            path="/data-collection/keyword-accounts"
            element={<KeywordAccountSearch />}
          />

          {/* Data Monitoring Routes */}
          <Route path="/data-monitoring" element={<DataMonitoring />} />
          <Route
            path="/data-monitoring/content-monitoring"
            element={<ContentMonitoring />}
          />
          <Route
            path="/data-monitoring/influencer-monitoring"
            element={<InfluencerMonitoring />}
          />
          <Route
            path="/data-monitoring/custom-rankings"
            element={<CustomRankings />}
          />

          {/* Platform-specific monitoring routes */}
          <Route
            path="/data-monitoring/douyin"
            element={<DouyinMonitoring />}
          />
          <Route
            path="/data-monitoring/tiktok"
            element={<TikTokMonitoring />}
          />
          <Route
            path="/data-monitoring/xiaohongshu"
            element={<XiaohongshuMonitoring />}
          />
          <Route
            path="/data-monitoring/kuaishou"
            element={<KuaishouMonitoring />}
          />
          <Route
            path="/data-monitoring/instagram"
            element={<InstagramMonitoring />}
          />

          {/* Placeholder routes for other categories - will be implemented later */}
          <Route path="/hot-rankings" element={<HotRankings />} />
          <Route path="/hot-rankings/douyin" element={<DouyinRankings />} />
          <Route path="/hot-rankings/tiktok" element={<TikTokRankings />} />
          <Route path="/hot-rankings/kuaishou" element={<KuaishouRankings />} />
          <Route
            path="/hot-rankings/xiaohongshu"
            element={<XiaohongshuRankings />}
          />
          <Route path="/hot-rankings/x" element={<XRankings />} />
          <Route path="/hot-rankings/youtube" element={<YouTubeRankings />} />
          <Route path="/hot-rankings/pipixia" element={<PipixiaRankings />} />

          {/* KOL Search & Analysis Routes */}
          <Route
            path="/kol-search-analysis/douyin-search"
            element={<DouyinKolSearch />}
          />
          <Route
            path="/kol-search-analysis/douyin-analysis"
            element={<DouyinKolAnalysis />}
          />
          <Route
            path="/kol-search-analysis/douyin-analysis/:kolId"
            element={<DouyinKolAnalysisDetail />}
          />
          <Route
            path="/kol-search-analysis/tiktok-search"
            element={<TikTokCreatorSearch />}
          />
          
          <Route path="/ads-products/*" element={<DataCollection />} />
          
          {/* KOL Search & Analysis default route - moved after specific routes */}
          <Route path="/kol-search-analysis" element={<DataCollection />} />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
let root: ReturnType<typeof createRoot> | null = null;

if (!root) {
  root = createRoot(container);
}

root.render(<App />);
