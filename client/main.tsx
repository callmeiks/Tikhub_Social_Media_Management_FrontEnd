import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreatorTools from "./pages/CreatorTools";
import ContentRewrite from "./pages/ContentRewrite";
import TitleGenerator from "./pages/TitleGenerator";
import ForbiddenWords from "./pages/ForbiddenWords";
import VideoDownload from "./pages/VideoDownload";
import ContentExtract from "./pages/ContentExtract";
import ShortVideoCopy from "./pages/ShortVideoCopy";
import VideoNoteExtract from "./pages/VideoNoteExtract";
import AudioExtract from "./pages/AudioExtract";
import AIVideoGeneration from "./pages/AIVideoGeneration";
import AccountPK from "./pages/AccountPK";
import CoverImageCreation from "./pages/CoverImageCreation";
import DataCollection from "./pages/DataCollection";
import CommentCollection from "./pages/CommentCollection";
import AccountInteraction from "./pages/AccountInteraction";
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
          <Route path="/creator-tools/rewrite" element={<ContentRewrite />} />
          <Route
            path="/creator-tools/title-generator"
            element={<TitleGenerator />}
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
            element={<ShortVideoCopy />}
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
          <Route path="/data-collection/*" element={<DataCollection />} />
          <Route
            path="/data-collection/comments"
            element={<CommentCollection />}
          />
          <Route
            path="/data-collection/account-interaction"
            element={<AccountInteraction />}
          />

          {/* Placeholder routes for other categories - will be implemented later */}
          <Route path="/data-monitoring/*" element={<DataCollection />} />
          <Route path="/hot-rankings/*" element={<DataCollection />} />
          <Route path="/kol-analysis/*" element={<DataCollection />} />
          <Route path="/ads-products/*" element={<DataCollection />} />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
