# VisiFinder — Product Requirements Document

## Original Problem Statement (Final)
Jed (websitetalkingheads.com) needed a **high-converting, SEO-optimized,
secure B2B SaaS landing page** for VisiFinder — a website-visitor
identification product targeted at small business owners.

Strict requirements:
- **Static HTML frontend + native PHP/MySQL backend** (deployed on Pair Networks; no 3rd-party form services, no React).
- **Strict design system**: solid Trust Blue (#1E3A5F) + Orange (#F97316). **NO gradients, NO blur effects, NO rounded pills.** Sharp edges, solid shadows, left-aligned hero.
- High security: prepared statements, rate limiting, honeypot.
- Conversion-optimized: reduced form (Email + Website only), click-to-call phone in header, live counters, exit-intent popup, sticky mobile CTA, Bookafy calendar on the thank-you page.

Contact details on the site:
- Phone: `(801) 748-2281`
- Email: `sales@websitetalkingheads.com` (lead notifications + visible contact)
- Calendar: `https://websitetalkingheads.bookafy.com/schedule?type=iframe&locale=en`

---

## Project Stack
- Frontend: Static HTML5 / CSS / vanilla JS (no build step)
- Backend: PHP 8 + MySQL (deployed via Pair Networks)
- Integration: Bookafy iframe (calendar)
- SEO: Schema.org JSON-LD (SoftwareApplication + FAQPage)

---

## File Inventory — `/app/visifinder-saas/`

| File | Purpose | Status |
|---|---|---|
| `index.html` | Main landing page with 10 conversion boosters | ✅ Final |
| `thank-you.html` | Post-submit page, Bookafy embed, phone capture | ✅ Final |
| `process-form.php` | Validates + stores lead, emails sales | ✅ Final |
| `process-phone.php` | Appends phone to existing lead | ✅ Final |
| `database.sql` | MySQL schema for `leads` table | ✅ Final |
| `README.md` | Pair Networks deployment guide | ✅ Final |

Deployment zip: **`/app/visifinder-saas-deploy.zip`** (21 KB, ready to upload).

---

## Implementation Log (CHANGELOG)

### 2026-02-XX — Forked Session
- ✅ Verified V3 visuals: solid Trust Blue/Orange, sharp edges, no gradients
- ✅ Reduced form fields to **Email + Website only** (highest-converting B2B variant)
- ✅ Updated `process-form.php`:
  - Email + Website validation
  - Auto-prepends `https://` for forgiving URL input
  - Honeypot field (`hp_field`) — silent bot drop
  - Per-IP rate limit (5/hr, 30s cooldown)
  - Notification email → `sales@websitetalkingheads.com`
  - Redirect to `thank-you.html?lid={leadId}`
- ✅ Created `process-phone.php` — appends phone to last lead by IP or by `lid`
- ✅ Updated `database.sql`:
  - `email` + `website` NOT NULL; `phone` nullable (collected later)
  - Indexes on email, status, created_at, ip_address
  - `v_submissions_by_ip` monitoring view
- ✅ Added honeypot to all 3 forms (hero, bottom-CTA, exit popup)
- ✅ Replaced all `Jed@…` visible mailto links with `sales@…`
- ✅ Renamed `index-v3.html` → `index.html`, `thank-you-v2.html` → `thank-you.html`; deleted old V1/V2 files
- ✅ Wrote Pair Networks `README.md`
- ✅ Packaged deployment zip at `/app/visifinder-saas-deploy.zip`
- ✅ PHP syntax-linted both scripts (`php -l`) — clean
- ✅ End-to-end form simulated with curl: 405/400/302 (honeypot)/500 (no-DB) all correct

---

## Conversion Boosters Shipped (10 of 10)
1. Live visitor counter banner
2. Click-to-call phone CTA in header + hero + footer + mobile sticky
3. Reduced 2-field form (Email + Website)
4. Exit-intent popup (mouse-leave, once per session)
5. Sticky mobile CTA bar
6. Social-proof logo bar (5 placeholders, ready for real logos)
7. Video testimonial section (placeholder, ready for iframe/video)
8. 3 star-rated written testimonials
9. FAQ accordion (5 questions, GDPR/setup/trial covered)
10. Bookafy calendar embed on thank-you page

---

## Roadmap / Backlog

### P1 — Awaiting Jed (he's traveling)
- [ ] Wire **GA4** tag in `<head>` of `index.html`
- [ ] Wire **Facebook Pixel** + `Lead` event on `thank-you.html`
- [ ] Wire **Google Ads conversion** tag on `thank-you.html`
- [ ] Add **reCAPTCHA v3** to the lead forms

### P2 — Content swaps
- [ ] Replace 5 `YOUR LOGO` placeholders with real client logos
- [ ] Replace "Video Testimonial Placeholder" with real client video
- [ ] Replace 3 written testimonials (currently Jennifer Torres, Michael Johnson, Sarah Rodriguez, David Kim) with real customer quotes/photos

### P3 — Optional polish
- [ ] A/B test variants (different hero headlines, different CTA copy)
- [ ] Add `<link rel="canonical">` once production URL is decided
- [ ] Create `robots.txt` + XML sitemap
- [ ] Set up Pair Networks-side SMTP for guaranteed email delivery

---

## Critical Contacts
- Phone: (801) 748-2281
- Sales email: sales@websitetalkingheads.com
- Calendar: https://websitetalkingheads.bookafy.com

## Hosting Target
Pair Networks shared hosting / VPS (LAMP stack).

## Notes for Future Agents
- **Do NOT** re-add gradients, pill buttons, blur effects, or rounded UI. Solid colors + sharp edges are mandatory.
- **Do NOT** rebuild as React. The user explicitly chose static HTML + PHP.
- `/app/static_export/` (older VSL pivot) and any Zapier code are DEPRECATED.
- `/app/design_guidelines.json` is the source of truth for visual rules.
