# Tikhub Social Media Management Frontend

A comprehensive React-based web application for social media management, content creation, and data analysis across multiple platforms.

## Features

- **Creator Tools**: Content rewriting, title generation, video downloads, AI video generation, and more
- **Data Collection**: Account interaction analysis, comment collection, keyword content search
- **Multi-Platform Support**: Works with TikTok, YouTube, Instagram, Facebook, Twitter, and Xiaohongshu
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS using shadcn/ui components

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd Tikhub_Social_Media_Management_FrontEnd
```

2. Install dependencies:
```bash
npm install
```

## Running the Project

### Development Mode

To start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

1. Build the client and server:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build both client and server for production
- `npm run build:client` - Build client only
- `npm run build:server` - Build server only
- `npm start` - Start production server
- `npm run test` - Run tests
- `npm run format.fix` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
├── client/                 # Frontend React application
│   ├── components/        # Reusable UI components
│   │   └── ui/           # shadcn/ui components
│   ├── pages/            # Page components for each route
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── main.tsx          # Application entry point
├── server/                # Express backend server
│   ├── index.ts          # Server entry point
│   └── routes/           # API routes
├── shared/                # Shared types and utilities
├── public/                # Static assets
└── dist/                  # Build output directory
```

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts
- **3D Graphics**: Three.js with React Three Fiber
- **Backend**: Express.js
- **Build Tool**: Vite

## Key Features by Page

### Creator Tools
- **Content Rewrite**: AI-powered content rewriting for different platforms
- **Title Generator**: Generate engaging titles with trending keywords
- **Video Download**: Multi-platform video downloader with quality options
- **Audio Extract**: Extract text from audio/video files
- **AI Video Generation**: Generate videos from text descriptions
- **Account Analysis (PK)**: Compare metrics between social media accounts
- **Cover Image Creation**: Generate custom cover images

### Data Collection
- **Comment Collection**: Collect and analyze comments from posts
- **Account Interaction**: Track and analyze account content data
- **Keyword Content Search**: Search content across platforms by keywords

## Environment Configuration

The application uses Vite for environment variable management. Create a `.env` file in the root directory for local development:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Tikhub Social Media Management
```

## Deployment

### Netlify Deployment

The project includes Netlify configuration:

```bash
npm run build
# Deploy the 'dist' directory to Netlify
```

### Docker Deployment (if needed)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For issues, questions, or suggestions, please open an issue in the project repository.