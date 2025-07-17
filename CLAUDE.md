# TikHub Social Media Management Frontend - Claude Documentation

## Project Overview

This is a comprehensive React-based social media management platform that provides content creation, data analysis, and multi-platform management capabilities. The application supports TikTok, Douyin, YouTube, Xiaohongshu, Instagram, X (Twitter), WeChat, Weibo, and Bilibili.

## Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Backend**: Express.js server
- **Build Tool**: Vite with SWC compiler
- **UI Library**: Radix UI primitives with shadcn/ui

### Project Structure

```
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   │   └── ui/            # shadcn/ui components (50+ components)
│   ├── pages/             # Page components (50+ routes)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and API client
│   └── main.tsx           # Application entry point
├── server/                # Express backend server
│   ├── index.ts           # Server entry point
│   └── routes/            # API routes
├── shared/                # Shared types and utilities
├── public/                # Static assets
└── dist/                  # Build output directory
```

## Key Features

### 1. Creator Tools (`/creator-tools/*`)
- **Content Rewrite** (`/rewrite`): AI-powered content rewriting
- **Title Generator** (`/title-generator`): Generate engaging titles
- **Shooting Script** (`/shooting-script`): Video script generation
- **AI Video Generation** (`/ai-video`): AI-driven video creation
- **Video Download** (`/video-download`): Multi-platform video downloader
- **Content Extract** (`/content-extract`): Extract text/images from videos
- **Audio Extract** (`/audio-extract`): Extract audio from videos
- **Account Analysis** (`/account-analysis`): Account PK comparison
- **Cover Image Creation** (`/image-recreation`): AI cover image design
- **Forbidden Words** (`/forbidden-words`): Content compliance checking
- **Universal Converter** (`/universal-converter`): Format conversion

### 2. Data Collection (`/data-collection/*`)
- **Account Interaction** (`/account-interaction`): Account data collection
- **Account Details** (`/account-details/:platform/:accountId`): Detailed account analysis
- **Content Interaction** (`/content-interaction`): Content engagement data
- **Content Detail Pages**: Platform-specific content analysis
  - TikTok (`/content-detail-tiktok`)
  - Douyin (`/content-detail-douyin`)
  - Kuaishou (`/content-detail-kuaishou`)
  - YouTube (`/content-detail-youtube`)
  - X/Twitter (`/content-detail-x`)
  - Weibo (`/content-detail-weibo`)
  - WeChat (`/content-detail-wechat`)
  - Instagram (`/content-detail-instagram`)
  - Bilibili (`/content-detail-bilibili`)
- **Keyword Content Search** (`/keyword-content`): Search content by keywords
- **Keyword Account Search** (`/keyword-accounts`): Search accounts by keywords

### 3. Data Monitoring (`/data-monitoring/*`)
- **Content Monitoring** (`/content-monitoring`): Track content performance
- **Influencer Monitoring** (`/influencer-monitoring`): Monitor influencer activities
- **Custom Rankings** (`/custom-rankings`): Create custom ranking lists

### 4. Hot Rankings (`/hot-rankings/*`)
- **Douyin Rankings** (`/douyin`): Douyin trending content
- **TikTok Rankings** (`/tiktok`): TikTok trending content
- **Kuaishou Rankings** (`/kuaishou`): Kuaishou trending content
- **Xiaohongshu Rankings** (`/xiaohongshu`): Xiaohongshu trending content
- **X Rankings** (`/x`): X/Twitter trending content
- **YouTube Rankings** (`/youtube`): YouTube trending content
- **Pipixia Rankings** (`/pipixia`): Pipixia trending content

## API Integration

### API Client (`client/lib/api.ts`)
The API client provides comprehensive integration with the backend:

```typescript
// API Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://127.0.0.1:8000/api";

// Main API client instance
export const apiClient = new ApiClient();
```

### Supported Data Types
- **Influencers**: TikTok, Douyin, Xiaohongshu influencer data
- **Posts**: Multi-platform post data with engagement metrics
- **Search**: Keyword-based content and account search
- **Collection**: Account data collection workflows

### Authentication
- Token-based authentication with localStorage fallback
- Environment variable support for API tokens
- Bearer token authorization headers

## Development Workflow

### Available Scripts
```bash
npm run dev          # Start development server (port 8080)
npm run build        # Build client and server for production
npm run build:client # Build client only
npm run build:server # Build server only  
npm start           # Start production server
npm run test        # Run tests with Vitest
npm run typecheck   # TypeScript type checking
npm run format.fix  # Format code with Prettier
```

### Environment Configuration
Create `.env` file in root directory:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_BACKEND_API_TOKEN=your_api_token_here
VITE_APP_TITLE=TikHub Social Media Management
```

## Component Architecture

### UI Components (`client/components/ui/`)
- Complete shadcn/ui implementation with 50+ components
- Custom dashboard layout with sidebar navigation
- Responsive design with dark/light theme support
- Brand-specific styling with CSS custom properties

### Page Components (`client/pages/`)
- Feature-specific page implementations
- Consistent layout using DashboardLayout component
- Form handling with React Hook Form + Zod validation
- Data fetching with TanStack Query

## Deployment

### Netlify Deployment
```bash
npm run build
# Deploy 'dist' directory to Netlify
```

### Production Configuration
- `netlify.toml` for Netlify deployment settings
- `netlify/functions/api.ts` for serverless functions
- Build outputs to `dist/spa` for client and `dist/server` for server

## Code Style & Conventions

### TypeScript
- Strict TypeScript configuration
- Comprehensive type definitions for API responses
- Interface-driven development

### Styling
- Tailwind CSS with custom design system
- CSS custom properties for theming
- Consistent spacing and typography scales
- Brand accent colors and animations

### File Organization
- Feature-based page organization
- Shared components in `/components/ui/`
- Utility functions in `/lib/`
- API types and client in `/lib/api.ts`

## Key Dependencies

### Core Framework
- `react@^18.3.1` - React framework
- `typescript@^5.5.3` - TypeScript support
- `vite@^6.2.2` - Build tool and dev server

### UI & Styling  
- `tailwindcss@^3.4.11` - Utility-first CSS
- `@radix-ui/*` - Primitive UI components
- `lucide-react@^0.462.0` - Icon library
- `framer-motion@^12.6.2` - Animations

### State & Data
- `@tanstack/react-query@^5.56.2` - Server state management
- `react-router-dom@^6.26.2` - Client-side routing
- `react-hook-form@^7.53.0` - Form handling
- `zod@^3.23.8` - Schema validation

### Backend
- `express@^4.18.2` - Server framework
- `cors@^2.8.5` - CORS middleware

## Best Practices

### Code Quality
- Use TypeScript strict mode
- Follow React best practices with hooks
- Implement proper error boundaries
- Use consistent naming conventions

### Performance
- Lazy load pages with React.lazy
- Optimize images and assets
- Use React Query for caching
- Implement proper loading states

### Security
- Validate all user inputs with Zod
- Sanitize API responses
- Use environment variables for sensitive data
- Implement proper authentication flows

## Future Development

### Testing Strategy
- Unit tests with Vitest
- Component testing with React Testing Library
- E2E testing setup needed
- API integration testing

### Monitoring
- Error tracking integration needed
- Performance monitoring setup
- User analytics implementation
- API response time monitoring

## Troubleshooting

### Common Issues
1. **Build Failures**: Check TypeScript errors and dependency versions
2. **API Connection**: Verify VITE_API_BASE_URL environment variable
3. **Authentication**: Ensure API token is properly configured
4. **Styling Issues**: Check Tailwind CSS configuration and imports

### Debug Commands
```bash
npm run typecheck     # Check for TypeScript errors
npm run dev          # Start development server with hot reload
npm run format.fix   # Fix code formatting issues
```

---

*This documentation should be updated as the project evolves. Keep it synchronized with actual implementation changes.*