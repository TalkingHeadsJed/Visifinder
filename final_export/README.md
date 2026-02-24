# VisiFinder Static Landing Pages

## Files Included

| File | Description |
|------|-------------|
| `index.html` | Main VSL (Video Sales Letter) page with all sections, animations, and A/B testing |
| `schedule.html` | Booking page with Bookafy calendar embed |
| `README.md` | This documentation file |

---

## Quick Start

1. Upload both HTML files to your web hosting
2. That's it! No build process, no dependencies, no backend required

---

## Features

### index.html (VSL Page)
- Hero section with animated headline and Vimeo video embed
- Animated bar graph showing 100% traffic → 3% identified
- "See the Difference" comparison section
- Animated 97% counter (scroll-triggered)
- Before/After transformation cards with images
- "How It Works" feature cards
- 3-step "Risk-Free Offer" section
- "Who This Is For" qualification checklist
- FAQ accordion (6 questions)
- Final urgency CTA section
- Glassmorphism cards with hover effects
- Floating gradient background shapes
- Grain texture overlay

### schedule.html (Booking Page)
- Two-column layout (info + calendar)
- Bookafy calendar embed
- Benefits list
- "What to Expect" section
- Maintains variant tracking from VSL page

---

## A/B Testing

### How It Works
- New visitors are randomly assigned Variant A or B (50/50 split)
- Assignment is stored in localStorage and persists across visits
- Variant can be forced via URL parameter: `?variant=A` or `?variant=B`

### Variant Differences (Headlines)

**Variant A:**
- Badge: "Finally See Who's Visiting Your Website"
- Line 1: "97% of Your Website Visitors"
- Line 2: "Leave Without a Trace"
- Line 3: "And You Have No Idea Who They Were."

**Variant B:**
- Badge: "Stop Losing Anonymous Visitors"
- Line 1: "You're Paying for Traffic"
- Line 2: "That Disappears Forever"
- Line 3: "What If You Could See Your Visitors?"

### Variant Indicator
A small badge showing "Variant A" or "Variant B" appears in the bottom-left corner. **Remove this for production** by deleting these lines in both files:

```javascript
// Add variant indicator (optional - remove in production)
const indicator = document.createElement('div');
indicator.style.cssText = '...';
indicator.textContent = 'Variant ' + currentVariant;
document.body.appendChild(indicator);
```

---

## Webhook Tracking (Zapier Integration)

### Setup Instructions

1. **Create a Zapier Webhook:**
   - Go to [zapier.com](https://zapier.com) → Create new Zap
   - Trigger: "Webhooks by Zapier" → "Catch Hook"
   - Copy the webhook URL provided

2. **Add Webhook URL to HTML Files:**
   
   In BOTH `index.html` AND `schedule.html`, find this line near the top of the `<script>` section:
   
   ```javascript
   const WEBHOOK_URL = ''; // <-- PASTE YOUR ZAPIER WEBHOOK URL HERE
   ```
   
   Replace with your webhook URL:
   
   ```javascript
   const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/123456/abcdef/';
   ```

3. **Connect to Google Sheets in Zapier:**
   - Add action: "Google Sheets" → "Create Spreadsheet Row"
   - Map the incoming fields to your spreadsheet columns

### Data Sent to Webhook

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | String | ISO 8601 format datetime |
| `session_id` | String | Unique visitor session ID |
| `variant` | String | "A" or "B" |
| `page` | String | "vsl" or "schedule" |
| `event_type` | String | "page_view" or "cta_click" |
| `url` | String | Full page URL |
| `referrer` | String | Referring URL or "direct" |
| `user_agent` | String | Browser user agent |
| `cta_name` | String | Button text (for cta_click events only) |

### Sample Webhook Payload

```json
{
  "timestamp": "2024-02-24T01:00:00.000Z",
  "session_id": "session_1708736400000_abc123xyz",
  "variant": "A",
  "page": "vsl",
  "event_type": "page_view",
  "url": "https://yoursite.com/index.html",
  "referrer": "https://google.com",
  "user_agent": "Mozilla/5.0..."
}
```

---

## External Resources Used

### CDN Dependencies (loaded automatically)
- Bootstrap 5.3.2 (CSS + JS)
- Google Fonts (Inter, Outfit)
- Font Awesome 6.5.1

### Images (hosted externally)
All images are loaded from external URLs - no local image files needed:

1. **Comparison Image:**
   ```
   https://customer-assets.emergentagent.com/job_91154cc5-6887-48b2-bd90-93334b2768e9/artifacts/ocl1pycn_Hispanic-manweb.png
   ```

2. **Frustrated Marketer (Before card):**
   ```
   https://images.pexels.com/photos/5717791/pexels-photo-5717791.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
   ```

3. **Analytics Dashboard (After card):**
   ```
   https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGRhc2hib2FyZCUyMGFuYWx5dGljcyUyMGRhdGElMjBpbnNpZ2h0cyUyMHN1Y2Nlc3N8ZW58MHx8fHwxNzcxNzUwNjIxfDA&ixlib=rb-4.1.0&q=85
   ```

**Note:** If you want to self-host these images, download them and update the `src` attributes in the HTML.

---

## Customization Guide

### Change Vimeo Video
Find this line in `index.html` and replace the video ID:
```html
<iframe src="https://player.vimeo.com/video/1167050545?h=8067fe9053&badge=0...
```

### Change Bookafy Calendar
Find this line in `schedule.html`:
```html
<iframe src="https://websitetalkingheads.bookafy.com/schedule?type=iframe&locale=en"
```

### Change Colors
All colors are defined as CSS variables at the top of the `<style>` section:
```css
:root {
    --gold: #EAA73F;
    --gold-dark: #D4922E;
    --blue: #589DFD;
    --blue-dark: #4A8FE7;
    --dark: #0a0a0a;
    --red: #ef4444;
    ...
}
```

### Change A/B Test Headlines
Search for "Variant B" in `index.html` to find the variant content:
```javascript
if (variant === 'B') {
    document.getElementById('badge-text').textContent = 'Stop Losing Anonymous Visitors';
    document.getElementById('headline-line1').textContent = "You're Paying for Traffic";
    // ... etc
}
```

---

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (responsive design included)

---

## Support
These are static HTML files. No server-side code is required. Simply host them on any web server or CDN.
