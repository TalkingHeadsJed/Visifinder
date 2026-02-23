# VisiFinder VSL Landing Page - Deployment Guide

## Overview
This package includes:
- **Landing Page (VSL)** - The main video sales letter page with A/B testing
- **Schedule Page** - Bookafy calendar integration
- **Admin Dashboard** - A/B test analytics and tracking
- **Backend API** - Handles tracking and Bookafy webhooks

---

## Architecture

```
Frontend (React) ←→ Backend (FastAPI/Python) ←→ MongoDB
                          ↑
                    Bookafy Webhooks
```

---

## File Structure

### Frontend (React)
```
frontend/
├── src/
│   ├── pages/
│   │   ├── VSLPage.jsx          # Main landing page with A/B testing
│   │   ├── SchedulePage.jsx     # Bookafy calendar embed
│   │   └── AdminDashboard.jsx   # A/B test analytics dashboard
│   ├── config/
│   │   └── abTest.js            # A/B test configuration (headlines, split ratio)
│   ├── components/
│   │   └── ui/                  # Shadcn UI components
│   ├── App.js                   # React Router setup
│   └── index.css                # Global styles
├── public/
│   └── index.html
├── package.json
└── .env                         # Environment variables
```

### Backend (Python/FastAPI)
```
backend/
├── server.py                    # Main API server
├── requirements.txt             # Python dependencies
└── .env                         # Environment variables (API keys, DB connection)
```

---

## Environment Variables

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-api-domain.com
```

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=visifinder
BOOKAFY_API_KEY=uMDhO0NotBZBPdGLA-LAPA
```

---

## Deployment Steps

### 1. Frontend Deployment

**Option A: Static Hosting (Netlify, Vercel, etc.)**
```bash
cd frontend
npm install
npm run build
# Deploy the 'build' folder to your hosting
```

**Option B: Traditional Hosting**
1. Run `npm run build` locally
2. Upload contents of `build/` folder to your web server
3. Configure server to serve index.html for all routes (SPA)

**Apache .htaccess (if needed):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 2. Backend Deployment

**Requirements:**
- Python 3.9+
- MongoDB instance
- HTTPS enabled (required for webhooks)

**Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

**Run with Uvicorn:**
```bash
uvicorn server:app --host 0.0.0.0 --port 8001
```

**For production, use Gunicorn:**
```bash
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001
```

### 3. MongoDB Setup
- Install MongoDB or use MongoDB Atlas (cloud)
- Create database named `visifinder`
- Collections will be created automatically:
  - `variant_visits` - Tracks page visits
  - `booking_conversions` - Tracks bookings from Bookafy

### 4. Update Bookafy Webhook
After deploying your backend, update the webhook URL:

```bash
curl -X POST "https://app.bookafy.com/api/v3/api_subscriptions" \
  -H "api-key: uMDhO0NotBZBPdGLA-LAPA" \
  -H "Content-Type: application/json" \
  -d '{
    "api_subscription": {
      "callback_url": "https://YOUR-API-DOMAIN.com/api/bookafy/webhook",
      "event_type": "appointment_created"
    }
  }'
```

---

## URLs After Deployment

| Page | URL |
|------|-----|
| Landing Page | https://visifinder.com/ |
| Landing Page (Variant A) | https://visifinder.com/?variant=A |
| Landing Page (Variant B) | https://visifinder.com/?variant=B |
| Schedule Page | https://visifinder.com/schedule |
| Admin Dashboard | https://visifinder.com/admin |
| API Stats | https://api.visifinder.com/api/ab-stats |

---

## A/B Test Configuration

Edit `frontend/src/config/abTest.js` to change:
- Headlines for each variant
- Traffic split ratio (default 50/50)
- Test name for tracking

```javascript
export const AB_TEST_CONFIG = {
  testName: "headline_test_v1",
  splitRatio: 0.5,  // 50% to each variant
  
  variantA: {
    headline: { ... }
  },
  variantB: {
    headline: { ... }
  }
};
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/ab-stats | Get A/B test statistics |
| GET | /api/ab-stats?start_date=2026-01-01&end_date=2026-01-31 | Filter by date |
| POST | /api/ab-reset | Reset all A/B test data |
| POST | /api/track-variant | Track page visits |
| POST | /api/bookafy/webhook | Receive Bookafy booking webhooks |

---

## Important Notes

1. **HTTPS Required**: Bookafy webhooks require HTTPS
2. **CORS**: Backend is configured to allow all origins. Restrict in production.
3. **API Prefix**: All backend routes use `/api` prefix
4. **Bookafy Calendar**: The schedule page embeds Bookafy via iframe

---

## Support

For questions about:
- **Bookafy Integration**: api@bookafy.com
- **Code Issues**: Review this deployment guide

---

## Quick Test After Deployment

1. Visit landing page - should show random variant
2. Visit with `?variant=A` - should show Variant A
3. Click CTA to go to schedule page
4. Check `/admin` - should show visit tracked
5. Make a test booking on Bookafy
6. Check `/admin` - should show conversion recorded
