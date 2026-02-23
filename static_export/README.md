# VisiFinder Landing Page - Simple Static Version

## What's Included
- `index.html` - Main landing page (VSL)
- `schedule.html` - Booking page with Bookafy calendar

## How to Deploy
1. Upload both HTML files to your web server
2. That's it! No build process, no dependencies, no database needed.

## A/B Testing
The landing page supports two headline variants:
- **Default (Variant A)**: Just visit `index.html`
- **Variant B**: Visit `index.html?variant=B`

You can send different traffic sources to different variants to test which performs better.

## Customization

### Change Headlines
Edit `index.html` and find the `<script>` section at the bottom. You can modify:
- Variant A content (in the HTML directly)
- Variant B content (in the JavaScript)

### Change Colors
Edit the CSS variables at the top of each file:
```css
:root {
    --gold: #EAA73F;
    --blue: #589DFD;
    --dark: #0a0a0a;
}
```

### Change Bookafy Calendar
In `schedule.html`, find the iframe and update the URL:
```html
<iframe src="https://websitetalkingheads.bookafy.com/schedule?type=iframe&locale=en">
```

### Change Video
In `index.html`, find the video iframe and update the Vimeo URL:
```html
<iframe src="https://player.vimeo.com/video/1055973007...">
```

### Change Comparison Image
In `index.html`, find the image tag and update the src URL:
```html
<img src="https://customer-assets.emergentagent.com/...Hispanic-manweb.png">
```

## Browser Support
Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## Dependencies (loaded from CDN)
- Bootstrap 5.3.2
- Font Awesome 6.5.1
- Google Fonts (Outfit, Inter)

No npm, no build tools, no server-side code required!
