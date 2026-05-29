# VisiFinder — Image Asset Plan

A short plan for the visuals we still need to add or upgrade across the site.

---

## 1. Customer logos (5 spots)

**Where:** `index.html` → `.logos-section` (currently 5 "YOUR LOGO" placeholders).

**Spec:**
- Format: **SVG** (preferred — scales perfectly, tiny file size) or **PNG** with transparency
- Color: monochrome dark navy `#1E3A5F` or pure black; the site will dim to grey on hover
- Dimensions: 200×80 px viewbox; the page renders them at max 120×40
- File names: `clients/<companyname>-logo.svg`
- Total weight target: under 30 KB combined

**Action:** when Jed sends 5 logos, drop them in `/assets/clients/` and replace the placeholder `<div>`s with `<img src="assets/clients/...">`.

---

## 2. Founder photo (1 spot)

**Where:** `index.html` → `#about` section (currently shows "Founder photo coming soon" placeholder).

**Spec:**
- Format: **WebP** (with JPEG fallback via `<picture>`)
- Dimensions: 800×800 px (square, will display at 320×320)
- File: `assets/jed-founder.webp` + `assets/jed-founder.jpg`
- Style: headshot, professional but warm; ideally on a solid neutral background that complements the navy/orange palette
- File weight target: under 80 KB

**Action:** once Jed uploads photo, swap the placeholder div for:
```html
<picture>
  <source srcset="assets/jed-founder.webp" type="image/webp">
  <img src="assets/jed-founder.jpg" alt="Jed, Founder of VisiFinder"
       width="320" height="320" loading="lazy">
</picture>
```

---

## 3. Customer testimonial photos (3 spots, optional)

**Where:** `index.html` → 3 testimonial cards (currently show initials in a navy box).

**Spec:**
- Format: WebP + JPEG fallback
- Dimensions: 96×96 px circular crops
- File: `assets/testimonials/<firstname>.webp`
- Weight: <15 KB each

**Action:** swap each `.author-avatar` div containing initials for the `<picture>` above.

---

## 4. Open Graph share image (1 spot)

**Where:** referenced from `<meta property="og:image">` in `index.html` head.

**Spec:**
- Format: **PNG or JPEG**, 1200×630 px (Facebook/LinkedIn standard)
- File: `assets/og-share.png`
- Should include: VisiFinder logo + headline "Identify 50–85% of your website visitors" + orange CTA box
- Weight: under 200 KB

**Action:** add `<meta property="og:image" content="https://websitetalkingheads.com/assets/og-share.png">` to head.

---

## 5. Twitter Card image (1 spot, can reuse #4)

Same as Open Graph image, or a square 1200×1200 variant. Add `<meta name="twitter:image" content="...">`.

---

## 6. Video poster image (already handled)

The Vimeo facade auto-pulls a thumbnail from `https://vumbnail.com/1167550168.jpg`. No action needed — but if you'd like a custom poster image:
- Format: JPEG 1280×720
- File: `assets/explainer-poster.jpg`
- Update `<img src="">` inside `.video-facade` to point to it.

---

## 7. Favicon upgrade (optional)

**Current:** Inline SVG with "V" mark in navy/orange (lives in `data:` URI in the `<head>`).

**Upgrade path** (if Jed wants a proper full-color icon):
- `favicon.ico` 32×32 (multi-resolution)
- `favicon-16x16.png`, `favicon-32x32.png`
- `apple-touch-icon.png` 180×180
- Update `<link>` tags in `index.html`, `thank-you.html`, `contact.html`

---

## Performance budgets

| Asset | Target | Why |
|---|---|---|
| Per-image (above-fold) | <100 KB | LCP under 2.5s |
| Per-image (below-fold) | <50 KB | Total page weight <800 KB |
| All logos combined | <30 KB | Logos load on first paint |
| Total page weight | <1 MB | Mobile 4G load <3s |

**Use `loading="lazy"` on every below-fold `<img>`. Always set explicit `width` and `height` to prevent layout shift.**

---

## Future ideas (not blocking launch)

- A 3-frame "before/after" comparison graphic showing what a typical dashboard looks like vs. what VisiFinder delivers
- A small infographic for the "How It Works" section (currently just numbered steps with text)
- Replace the navy "JT/MJ/SR/DK" initial avatars with actual customer headshots once real testimonials roll in
