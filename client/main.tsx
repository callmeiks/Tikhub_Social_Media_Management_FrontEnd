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
import ContentInteraction from "./pages/ContentInteraction";
import ContentDetail from "./pages/ContentDetail";
import KeywordContentSearch from "./pages/KeywordContentSearch";
import KeywordAccountSearch from "./pages/KeywordAccountSearch";
import ContentMonitoring from "./pages/ContentMonitoring";
import InfluencerMonitoring from "./pages/InfluencerMonitoring";
import CustomRankings from "./pages/CustomRankings";
import HotRankings from "./pages/HotRankings";
import DouyinRankings from "./pages/DouyinRankings";
import UniversalConverter from "./pages/UniversalConverter";
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
            path="/data-collection/keyword-content"
            element={<KeywordContentSearch />}
          />
          <Route
            path="/data-collection/keyword-accounts"
            element={<KeywordAccountSearch />}
          />

          {/* Data Monitoring Routes */}
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

          {/* Placeholder routes for other categories - will be implemented later */}
          <Route path="/data-monitoring/*" element={<DataCollection />} />
          <Route path="/hot-rankings/*" element={<HotRankings />} />
          <Route path="/kol-analysis/*" element={<DataCollection />} />
          <Route path="/ads-products/*" element={<DataCollection />} />

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
