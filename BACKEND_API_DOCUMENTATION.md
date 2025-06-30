# Backend API Documentation for Tikhub Social Media Management

This document outlines all the backend API endpoints required to support the frontend application.

## Table of Contents

- [Authentication](#authentication)
- [AI Video Generation](#ai-video-generation)
- [Account Interaction](#account-interaction)
- [Account PK (Comparison)](#account-pk-comparison)
- [Audio Extract](#audio-extract)
- [Comment Collection](#comment-collection)
- [Content Extract](#content-extract)
- [Content Rewrite](#content-rewrite)
- [Cover Image Creation](#cover-image-creation)
- [Video Download](#video-download)
- [Title Generator](#title-generator)
- [Video Note Extract](#video-note-extract)
- [Short Video Copy](#short-video-copy)
- [Forbidden Words](#forbidden-words)
- [Keyword Content Search](#keyword-content-search)
- [Common Endpoints](#common-endpoints)

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.tikhub.com/api
```

## Authentication

All API endpoints require authentication unless specified otherwise. Include the authentication token in the header:

```
Authorization: Bearer <token>
```

### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## AI Video Generation

### Generate AI Video

```http
POST /api/ai-video/generate
```

**Request Body:**
```json
{
  "description": "A beautiful sunset over mountains",
  "category": "nature",
  "style": {
    "duration": 30,
    "aspectRatio": "16:9",
    "quality": "HD"
  }
}
```

**Response:**
```json
{
  "videoId": "vid_123456",
  "status": "processing",
  "estimatedTime": 120
}
```

### Get Video Templates

```http
GET /api/ai-video/templates?category=nature&page=1&limit=20
```

**Response:**
```json
{
  "templates": [
    {
      "id": "template_001",
      "name": "Scenic Nature",
      "category": "nature",
      "previewUrl": "https://...",
      "tags": ["landscape", "outdoor"]
    }
  ],
  "total": 50
}
```

### Check Video Status

```http
GET /api/ai-video/status/{videoId}
```

**Response:**
```json
{
  "status": "completed",
  "progress": 100,
  "url": "https://download.example.com/video.mp4"
}
```

### Get User Quota

```http
GET /api/ai-video/user-quota
```

**Response:**
```json
{
  "remaining": 10,
  "total": 50,
  "resetDate": "2024-02-01T00:00:00Z"
}
```

## Account Interaction

### Collect Account Data

```http
POST /api/account-data/collect
```

**Request Body:**
```json
{
  "platform": "tiktok",
  "accounts": ["@username1", "@username2"],
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "options": {
    "includeComments": true,
    "includeLikes": true
  }
}
```

**Response:**
```json
{
  "taskId": "task_789",
  "status": "queued"
}
```

### Get Collection History

```http
GET /api/account-data/history?page=1&limit=20
```

**Response:**
```json
{
  "records": [
    {
      "id": "record_001",
      "platform": "tiktok",
      "accounts": ["@username1"],
      "createdAt": "2024-01-15T10:30:00Z",
      "status": "completed",
      "dataCount": 150
    }
  ],
  "total": 45
}
```

### Get Account Statistics

```http
GET /api/account-data/statistics?platform=tiktok&dateRange=30d
```

**Response:**
```json
{
  "totalAccounts": 25,
  "activeAccounts": 20,
  "totalPosts": 1500,
  "avgViews": 50000
}
```

### Get Account Scoring

```http
GET /api/account-data/scoring/{accountId}
```

**Response:**
```json
{
  "qualityScore": 85,
  "contentScore": 90,
  "influenceScore": 78,
  "details": {
    "engagement": 4.5,
    "consistency": 92,
    "growth": 15.3
  }
}
```

## Account PK (Comparison)

### Compare Accounts

```http
POST /api/account-pk/compare
```

**Request Body:**
```json
{
  "platform": "tiktok",
  "account1": "@creator1",
  "account2": "@creator2"
}
```

**Response:**
```json
{
  "comparison": {
    "account1": {
      "followers": "1.2M",
      "avgViews": "500K",
      "engagement": "5.2%"
    },
    "account2": {
      "followers": "850K",
      "avgViews": "300K",
      "engagement": "6.1%"
    }
  },
  "winner": "account1"
}
```

### Get Comparison History

```http
GET /api/account-pk/history
```

**Response:**
```json
{
  "comparisons": [
    {
      "id": "comp_001",
      "account1": "@creator1",
      "account2": "@creator2",
      "platform": "tiktok",
      "createdAt": "2024-01-20T14:00:00Z"
    }
  ],
  "total": 15
}
```

### Get Account Metrics

```http
GET /api/account-pk/metrics?accountUrl=https://tiktok.com/@creator1
```

**Response:**
```json
{
  "followers": "1.2M",
  "views": "50M",
  "likes": "5M",
  "comments": "500K",
  "shares": "200K",
  "engagement": "5.2%"
}
```

## Audio Extract

### Upload Audio/Video File

```http
POST /api/audio-extract/upload
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <audio/video file>
```

**Response:**
```json
{
  "fileId": "file_456",
  "status": "uploaded"
}
```

### Process Audio Extraction

```http
POST /api/audio-extract/process
```

**Request Body:**
```json
{
  "fileId": "file_456",
  "language": "en",
  "mode": "accurate"
}
```

**Response:**
```json
{
  "taskId": "task_789",
  "status": "processing"
}
```

### Get Extraction Result

```http
GET /api/audio-extract/result/{taskId}
```

**Response:**
```json
{
  "text": "This is the extracted text from the audio...",
  "confidence": 0.95,
  "keywords": ["audio", "extraction", "technology"],
  "language": "en",
  "speakers": 2
}
```

### Get Audio Quota

```http
GET /api/audio-extract/quota
```

**Response:**
```json
{
  "usedToday": 45,
  "remainingMinutes": 255,
  "dailyLimit": 300
}
```

## Comment Collection

### Collect Comments

```http
POST /api/comments/collect
```

**Request Body:**
```json
{
  "urls": [
    "https://tiktok.com/@user/video/123",
    "https://tiktok.com/@user/video/456"
  ],
  "platform": "tiktok",
  "limit": 100
}
```

**Response:**
```json
{
  "taskId": "task_comment_001",
  "urlCount": 2,
  "status": "processing"
}
```

### Check Collection Status

```http
GET /api/comments/status/{taskId}
```

**Response:**
```json
{
  "status": "in_progress",
  "progress": 60,
  "completed": 1,
  "total": 2
}
```

### Get Collection Result

```http
GET /api/comments/result/{taskId}
```

**Response:**
```json
{
  "comments": [
    {
      "id": "comment_001",
      "author": "user123",
      "text": "Great video!",
      "likes": 150,
      "timestamp": "2024-01-20T10:30:00Z",
      "postUrl": "https://tiktok.com/@user/video/123"
    }
  ],
  "total": 250,
  "platform": "tiktok"
}
```

### Get Pricing Tiers

```http
GET /api/comments/pricing
```

**Response:**
```json
{
  "tiers": [
    {
      "name": "Basic",
      "commentsPerMonth": 10000,
      "price": 29.99
    },
    {
      "name": "Pro",
      "commentsPerMonth": 50000,
      "price": 99.99
    }
  ]
}
```

### Get Collection History

```http
GET /api/comments/history
```

**Response:**
```json
{
  "tasks": [
    {
      "id": "task_comment_001",
      "platform": "tiktok",
      "urlCount": 2,
      "commentCount": 250,
      "createdAt": "2024-01-20T15:00:00Z",
      "status": "completed"
    }
  ],
  "total": 20
}
```

## Content Extract

### Process Content Extraction

```http
POST /api/content-extract/process
```

**Request Body:**
```json
{
  "url": "https://xiaohongshu.com/post/123456",
  "options": {
    "extractImages": true,
    "extractText": true,
    "quality": "high"
  }
}
```

**Response:**
```json
{
  "taskId": "task_extract_001",
  "status": "processing"
}
```

### Get Extraction Result

```http
GET /api/content-extract/result/{taskId}
```

**Response:**
```json
{
  "title": "Amazing Travel Guide",
  "content": "Full post content here...",
  "images": [
    {
      "url": "https://image1.jpg",
      "width": 1080,
      "height": 1920
    }
  ],
  "tags": ["travel", "guide", "tips"],
  "author": {
    "name": "TravelBlogger",
    "id": "user123"
  },
  "stats": {
    "likes": 5000,
    "comments": 200,
    "shares": 100
  }
}
```

### Download Images Batch

```http
POST /api/content-extract/download-batch
```

**Request Body:**
```json
{
  "images": [
    "https://image1.jpg",
    "https://image2.jpg"
  ]
}
```

**Response:**
```json
{
  "downloadUrl": "https://download.example.com/batch_123.zip"
}
```

### Get Extraction Quota

```http
GET /api/content-extract/quota
```

**Response:**
```json
{
  "used": 150,
  "remaining": 850,
  "dailyLimit": 1000
}
```

## Content Rewrite

### Rewrite Content

```http
POST /api/content-rewrite/process
```

**Request Body:**
```json
{
  "text": "Original content to be rewritten",
  "platform": "instagram",
  "options": {
    "tone": "professional",
    "length": "medium",
    "style": "engaging"
  }
}
```

**Response:**
```json
{
  "rewrittenText": "Professionally rewritten content...",
  "suggestions": [
    "Consider adding more hashtags",
    "Include a call-to-action"
  ]
}
```

### Get Rewrite Templates

```http
GET /api/content-rewrite/templates
```

**Response:**
```json
{
  "templates": [
    {
      "id": "template_001",
      "name": "Instagram Caption",
      "platform": "instagram",
      "description": "Engaging captions for Instagram posts"
    }
  ]
}
```

### Get Rewrite Quota

```http
GET /api/content-rewrite/quota
```

**Response:**
```json
{
  "used": 20,
  "remaining": 80,
  "dailyLimit": 100
}
```

## Cover Image Creation

### Generate Cover Image

```http
POST /api/cover-image/generate
```

**Request Body:**
```json
{
  "title": "10 Travel Tips",
  "style": "modern",
  "template": "blog_cover",
  "colors": ["#FF5733", "#33FF57"]
}
```

**Response:**
```json
{
  "imageUrl": "https://generated.example.com/image_001.png",
  "variations": [
    "https://generated.example.com/image_001_v1.png",
    "https://generated.example.com/image_001_v2.png"
  ]
}
```

### Get Image Templates

```http
GET /api/cover-image/templates
```

**Response:**
```json
{
  "templates": [
    {
      "id": "template_001",
      "name": "Blog Cover",
      "category": "blog",
      "previewUrl": "https://preview.example.com/blog_cover.png"
    }
  ]
}
```

### Customize Image

```http
POST /api/cover-image/customize
```

**Request Body:**
```json
{
  "imageUrl": "https://generated.example.com/image_001.png",
  "modifications": {
    "text": {
      "title": "Updated Title",
      "fontSize": 48
    },
    "filters": {
      "brightness": 1.2,
      "contrast": 1.1
    }
  }
}
```

**Response:**
```json
{
  "modifiedImageUrl": "https://generated.example.com/image_001_modified.png"
}
```

## Video Download

### Process Video Download

```http
POST /api/video-download/process
```

**Request Body:**
```json
{
  "urls": [
    "https://tiktok.com/@user/video/123",
    "https://youtube.com/watch?v=abc123"
  ],
  "settings": {
    "quality": "1080p",
    "format": "mp4",
    "keepWatermark": false
  }
}
```

**Response:**
```json
{
  "taskIds": ["task_video_001", "task_video_002"],
  "status": "queued"
}
```

### Check Download Status

```http
GET /api/video-download/status/{taskId}
```

**Response:**
```json
{
  "status": "downloading",
  "progress": 45,
  "fileInfo": {
    "filename": "video_123.mp4",
    "size": 52428800,
    "duration": 120
  }
}
```

### Download Video File

```http
GET /api/video-download/download/{taskId}
```

**Response:**
Binary video file with appropriate headers:
```
Content-Type: video/mp4
Content-Disposition: attachment; filename="video_123.mp4"
```

### Get Download Queue

```http
GET /api/video-download/queue
```

**Response:**
```json
{
  "queue": [
    {
      "taskId": "task_video_001",
      "url": "https://tiktok.com/@user/video/123",
      "status": "downloading",
      "progress": 45,
      "position": 1
    }
  ],
  "stats": {
    "activeDownloads": 3,
    "queuedDownloads": 5,
    "completedToday": 25
  }
}
```

### Cancel Download

```http
DELETE /api/video-download/cancel/{taskId}
```

**Response:**
```json
{
  "success": true
}
```

## Title Generator

### Generate Titles

```http
POST /api/title-generator/generate
```

**Request Body:**
```json
{
  "content": "This is my blog post about travel tips...",
  "keywords": ["travel", "tips", "budget"],
  "platform": "youtube",
  "types": ["how-to", "listicle", "question"]
}
```

**Response:**
```json
{
  "titles": [
    {
      "title": "10 Budget Travel Tips That Will Save You Thousands",
      "score": 0.92,
      "tags": ["informative", "engaging", "seo-friendly"]
    },
    {
      "title": "How to Travel the World on $50 a Day",
      "score": 0.88,
      "tags": ["actionable", "specific", "appealing"]
    }
  ]
}
```

### Get Trending Keywords

```http
GET /api/title-generator/trending-keywords?platform=youtube
```

**Response:**
```json
{
  "keywords": [
    {
      "keyword": "travel hacks",
      "trend": "rising",
      "volume": 150000
    },
    {
      "keyword": "budget travel",
      "trend": "stable",
      "volume": 120000
    }
  ]
}
```

### Get Title Generator Quota

```http
GET /api/title-generator/quota
```

**Response:**
```json
{
  "used": 15,
  "remaining": 35,
  "dailyLimit": 50
}
```

## Video Note Extract

### Extract Video Notes

```http
POST /api/video-notes/extract
```

**Request Body:**
```json
{
  "videoUrl": "https://youtube.com/watch?v=abc123",
  "options": {
    "includeTimestamps": true,
    "language": "en"
  }
}
```

**Response:**
```json
{
  "taskId": "task_notes_001",
  "status": "processing"
}
```

### Get Notes Result

```http
GET /api/video-notes/result/{taskId}
```

**Response:**
```json
{
  "notes": [
    {
      "text": "Introduction to the topic",
      "timestamp": "00:00:00"
    },
    {
      "text": "Main point 1: Budget planning",
      "timestamp": "00:02:15"
    }
  ],
  "summary": "This video covers essential travel tips...",
  "keyPoints": [
    "Budget planning is crucial",
    "Book flights in advance",
    "Use local transportation"
  ],
  "timestamps": [
    {
      "time": "00:00:00",
      "chapter": "Introduction"
    },
    {
      "time": "00:02:15",
      "chapter": "Budget Planning"
    }
  ]
}
```

## Short Video Copy

### Copy Short Video

```http
POST /api/short-video/copy
```

**Request Body:**
```json
{
  "url": "https://tiktok.com/@user/video/123",
  "removeWatermark": true
}
```

**Response:**
```json
{
  "videoUrl": "https://download.example.com/video_copy.mp4",
  "metadata": {
    "duration": 30,
    "resolution": "1080x1920",
    "fileSize": 15728640,
    "originalAuthor": "@username"
  }
}
```

## Forbidden Words

### Check Forbidden Words

```http
POST /api/forbidden-words/check
```

**Request Body:**
```json
{
  "text": "This is my content to check for forbidden words",
  "platform": "instagram"
}
```

**Response:**
```json
{
  "hasForbiddenWords": true,
  "words": ["forbidden1", "banned2"],
  "suggestions": [
    "Replace 'forbidden1' with 'alternative1'",
    "Remove or rephrase 'banned2'"
  ]
}
```

### Get Forbidden Words List

```http
GET /api/forbidden-words/list?platform=instagram
```

**Response:**
```json
{
  "words": [
    {
      "word": "forbidden1",
      "severity": "high",
      "platforms": ["instagram", "facebook"],
      "alternatives": ["alternative1", "alternative2"]
    }
  ]
}
```

## Keyword Content Search

### Search Content

```http
POST /api/content-search/search
```

**Request Body:**
```json
{
  "keyword": "travel tips",
  "platforms": ["tiktok", "youtube"],
  "timeRange": "7d",
  "searchIn": ["title", "description", "tags"],
  "sortBy": "engagement"
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "result_001",
      "platform": "tiktok",
      "title": "10 Travel Tips You Need to Know",
      "author": "@travelblogger",
      "url": "https://tiktok.com/@travelblogger/video/123",
      "engagement": {
        "views": 500000,
        "likes": 50000,
        "comments": 2000
      },
      "publishedAt": "2024-01-20T10:00:00Z"
    }
  ],
  "total": 150
}
```

### Export Search Results

```http
POST /api/content-search/export
```

**Request Body:**
```json
{
  "resultIds": ["result_001", "result_002"],
  "format": "csv"
}
```

**Response:**
```json
{
  "exportUrl": "https://download.example.com/export_123.csv"
}
```

### Get Search Suggestions

```http
GET /api/content-search/suggestions?keyword=travel
```

**Response:**
```json
{
  "suggestions": [
    "travel tips",
    "travel hacks",
    "travel vlog",
    "travel essentials"
  ]
}
```

## Common Endpoints

### Get User Profile

```http
GET /api/user/profile
```

**Response:**
```json
{
  "id": "user123",
  "email": "user@example.com",
  "name": "John Doe",
  "subscription": {
    "plan": "pro",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

### Update User Profile

```http
PUT /api/user/profile
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "preferences": {
    "language": "en",
    "timezone": "UTC"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

### Get Usage Summary

```http
GET /api/usage/summary
```

**Response:**
```json
{
  "daily": {
    "apiCalls": 150,
    "dataProcessed": "1.5GB",
    "videosDownloaded": 10
  },
  "monthly": {
    "apiCalls": 3500,
    "dataProcessed": "45GB",
    "videosDownloaded": 250
  },
  "quotas": {
    "apiCallsLimit": 10000,
    "dataLimit": "100GB",
    "videoDownloadLimit": 500
  }
}
```

### Get Supported Platforms

```http
GET /api/platforms/supported
```

**Response:**
```json
{
  "platforms": [
    {
      "id": "tiktok",
      "name": "TikTok",
      "features": ["download", "comments", "analytics"],
      "icon": "https://icons.example.com/tiktok.svg"
    },
    {
      "id": "youtube",
      "name": "YouTube",
      "features": ["download", "transcript", "analytics"],
      "icon": "https://icons.example.com/youtube.svg"
    }
  ]
}
```

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": {
      "resourceId": "123",
      "resourceType": "video"
    }
  }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

All endpoints include rate limiting headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with query parameters:

```
GET /api/endpoint?page=1&limit=20&sort=createdAt&order=desc
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Webhooks

For long-running tasks, webhook notifications can be configured:

```http
POST /api/webhooks/configure
```

**Request Body:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["task.completed", "task.failed"],
  "secret": "your-webhook-secret"
}
```

Webhook payload format:

```json
{
  "event": "task.completed",
  "taskId": "task_123",
  "timestamp": "2024-01-25T10:30:00Z",
  "data": {
    // Event-specific data
  }
}
```