# Site Performance Analyzer

A web-based tool for analyzing website performance metrics, including Core Web Vitals, resource loading timelines, and actionable performance suggestions.

## Features

- **Core Web Vitals Analysis**: Measure LCP, FID, and CLS with color-coded ratings
- **Detailed Performance Metrics**: TTFB, DOM Content Loaded, Full Page Load, and more
- **Resource Waterfall Visualization**: View resource loading timeline in chart or table format
- **Performance Suggestions**: Get actionable recommendations based on your site's metrics
- **Easy to Use**: Simply enter a URL and get comprehensive analysis in seconds

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Analysis Engine**: Puppeteer (headless Chrome)
- **Deployment**: Docker + Docker Compose

## Prerequisites

Choose one based on your preferred setup method:

### For Local Development:
- Node.js 18 or higher
- npm or yarn

### For Docker Deployment:
- Docker
- Docker Compose

## Quick Start with Docker (Recommended)

The easiest way to run the application is using Docker Compose:

```bash
# Clone or navigate to the project directory
cd siteperformance

# Start the application
docker-compose up -d

# The application will be available at http://localhost
```

To stop the application:
```bash
docker-compose down
```

## Local Development Setup

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The backend will run on http://localhost:3001

### Frontend Setup

In a separate terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development serve
npm run dev
```

The frontend will run on http://localhost:5173

## Usage

1. Open the application in your browser (http://localhost or http://localhost:5173 for dev)
2. Enter the URL you want to analyze (must start with http:// or https://)
3. Click "Analyze Performance"
4. Wait 10-30 seconds for the analysis to complete
5. Review the results:
   - Core Web Vitals with color-coded ratings
   - Navigation timing metrics
   - Resource summary and breakdown
   - Resource waterfall (chart or table view)
   - Performance suggestions

## Environment Variables

### Backend (.env)

```
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend

For production builds, you can set:
```
VITE_API_URL=https://your-backend-url.com
```

In development, the Vite proxy handles API routing automatically.

## Deployment to Cloud Platforms

### Railway

1. Create a new project on Railway
2. Add two services:
   - **Backend Service**:
     - Root directory: `/backend`
     - Build command: (Docker will be detected automatically)
     - Environment variables: `PORT=3001`, `FRONTEND_URL=https://your-frontend-url.com`
   - **Frontend Service**:
     - Root directory: `/frontend`
     - Build command: (Docker will be detected automatically)
3. Deploy both services

### Render

1. Create a new Web Service for backend:
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`
   - Or use Docker (select Dockerfile: `backend/Dockerfile`)
2. Create a Static Site for frontend:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - Or use Docker
3. Set environment variables appropriately

### Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Deploy backend
cd backend
fly launch
fly deploy

# Deploy frontend
cd ../frontend
fly launch
fly deploy
```

### General Deployment Notes

- Backend requires ~1GB RAM for Puppeteer/Chromium
- Set appropriate CORS origins in backend environment
- Frontend should proxy `/api` requests to backend URL
- Consider adding rate limiting for production use

## Project Structure

```
siteperformance/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express server entry point
│   │   ├── routes/
│   │   │   └── analyze.js        # API endpoint
│   │   ├── services/
│   │   │   ├── analyzer.js       # Puppeteer analysis
│   │   │   └── suggestions.js    # Performance suggestions
│   │   └── utils/
│   │       ├── validators.js     # URL validation
│   │       └── metrics.js        # Metric calculations
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main app with routing
│   │   ├── main.jsx              # React entry point
│   │   ├── pages/
│   │   │   ├── Home.jsx          # URL input page
│   │   │   └── Results.jsx       # Results display
│   │   ├── components/
│   │   │   ├── MetricCard.jsx
│   │   │   ├── MetricsGrid.jsx
│   │   │   ├── Waterfall.jsx
│   │   │   ├── WaterfallTable.jsx
│   │   │   ├── Suggestions.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── services/
│   │   │   └── api.js            # Backend API calls
│   │   ├── hooks/
│   │   │   └── useAnalysis.js    # Analysis state hook
│   │   └── styles/
│   │       └── index.css         # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## API Documentation

### POST /api/analyze

Analyze performance of a given URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response (200 OK):**
```json
{
  "url": "https://example.com",
  "timestamp": "2025-12-04T10:30:00.000Z",
  "metrics": {
    "coreWebVitals": {
      "lcp": { "value": 2400, "rating": "good" },
      "fid": { "value": null, "rating": "unknown" },
      "cls": { "value": 0.12, "rating": "needs-improvement" }
    },
    "navigationTiming": {
      "ttfb": 320,
      "domContentLoaded": 1800,
      "loadComplete": 3200,
      "domInteractive": 1600
    },
    "additionalMetrics": {
      "fcp": 1200,
      "tti": 3400,
      "tbt": 450,
      "speedIndex": 2100
    },
    "resourceSummary": {
      "totalRequests": 47,
      "totalSize": 2457600,
      "byType": {
        "script": { "count": 12, "size": 892000 },
        "stylesheet": { "count": 5, "size": 145000 },
        "image": { "count": 18, "size": 1200000 },
        "font": { "count": 4, "size": 180000 },
        "other": { "count": 8, "size": 40600 }
      }
    }
  },
  "resources": [ /* array of resource objects */ ],
  "suggestions": [ /* array of suggestion objects */ ]
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message"
}
```

## Troubleshooting

### Analysis hangs or times out
- Verify the target URL is publicly accessible
- Some sites with bot protection (Cloudflare, etc.) may block automated browsers
- Increase timeout if analyzing very large/slow sites

### CORS errors
- Check `FRONTEND_URL` environment variable in backend matches your frontend URL
- In development, ensure Vite proxy is configured correctly

### Docker memory errors
- Puppeteer/Chromium requires ~1GB RAM
- Increase Docker memory limit: `docker-compose.yml` already sets 1GB limit for backend
- On Docker Desktop, ensure you've allocated sufficient resources

### "Could not reach URL" errors
- Verify the URL is correct and publicly accessible
- Check your internet connection
- Some sites may block automated access

### Build fails
- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- For Docker builds, ensure Docker has sufficient disk space

## Known Limitations

1. **FID cannot be accurately measured** without real user interaction - value will be null
2. **CLS** may be incomplete for content loaded beyond initial viewport
3. **Desktop-only analysis** - viewport fixed at 1920x1080 (mobile analysis not included)
4. **No authentication support** - cannot analyze pages behind login walls
5. **No historical data** - each analysis is fresh, results are not cached
6. **Resource intensive** - each analysis launches a full Chrome browser instance
7. **Rate limiting not included** - consider adding rate limiting for production
8. **Bot protection** - sites with Cloudflare or similar may block analysis

## Performance Notes

- Analysis typically takes 10-30 seconds depending on target site
- Backend requires approximately 1GB RAM for Puppeteer
- Results are not cached - each request performs fresh analysis
- Concurrent analyses will spawn separate browser instances

## Future Enhancement Ideas

- Mobile viewport analysis with network throttling
- Historical data tracking and comparison
- Scheduled monitoring with email alerts
- PDF report generation
- Lighthouse integration for additional insights
- Multi-region analysis
- API key access for programmatic use
- User authentication and saved history

## License

MIT

## Support

For issues and feature requests, please open an issue in the repository.
