# VisiFinder — Setup Guide

7 files (+ assets folder). About 10 minutes. That's the whole setup.

---

## What you're uploading

```
visifinder/
├── index.html            ← Landing page
├── thank-you.html        ← Post-submit page (calendar + video)
├── contact.html          ← Contact form page
├── process-form.php      ← Saves the lead and emails you
├── process-phone.php     ← Saves a phone number from thank-you
├── process-contact.php   ← Handles contact-page submissions
├── render.php            ← Injects fresh CSRF tokens into served pages
├── config.php            ← Your database creds + email settings
├── _lib.php              ← Shared helpers (security headers, CSRF, etc.)
├── database.sql          ← Builds the leads table
├── site.webmanifest      ← Mobile/PWA metadata
├── .htaccess             ← Apache config (HTTPS, security headers, pretty URLs)
└── assets/
    ├── styles.css        ← Site styles (cached, ~30 KB)
    ├── thank-you.css     ← Thank-you-page styles
    ├── contact.css       ← Contact-page styles
    ├── app.js            ← Front-end behavior (FAQ, video, popup)
    └── lucide.min.js     ← Self-hosted icons (no external CDN)
```

---

## Step 1 — Create the database

1. Log into Pair Networks → **Databases** → **MySQL**.
2. Create a database called `visifinder`. Create a user, give them access. Write down the username/password.
3. Open phpMyAdmin → SQL tab → paste in `database.sql` → click Go.

---

## Step 2 — Upload the files

Drop everything into your web root (usually `public_html/` or `/var/www/html`).

**Important on a VPS:** for extra hardening, move `config.php` and `_lib.php` ONE folder above the web root (e.g. `/var/www/visifinder-config/`) and update the `require __DIR__ . '/config.php';` lines at the top of the 3 processor PHP files to point there.

---

## Step 3 — Edit `config.php`

Open `config.php` and update **just three things**:

```php
'db_user' => 'YOUR_DB_USER',          // ← your DB username
'db_pass' => 'YOUR_DB_PASSWORD',      // ← your DB password
'notification_email' => 'sales@visifinder.com',  // ← already correct
```

Save. That's it for credentials.

---

## Step 4 — Set file permissions (VPS only)

```bash
chown -R www-data:www-data /var/www/html
chmod 644 *.html *.css *.js *.sql
chmod 600 config.php             # Only the web server can read DB creds
chmod 644 *.php
```

---

## Step 5 — Test

1. Visit your site.
2. Submit the form with your real email + your real website.
3. You should:
   - Land on `thank-you.html?lid=N`
   - Receive an email at **sales@visifinder.com** within a minute
   - See the new row in `leads` table

---

## Step 6 — Force HTTPS (after SSL is installed)

Open `.htaccess` and uncomment the 3 RewriteRule lines at the top:

```apache
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

That forces every visitor to HTTPS. The PHP scripts already do this in code too (controlled by `enforce_https` in `config.php`).

---

## What's already built in

- 90-second Vimeo explainer with **facade lazy-load** (page loads fast, video only loads on click)
- Live "How many buyers did you lose today?" banner
- Click-to-call phone in header and CTAs
- Exit-intent popup offers a **free PDF Audit Checklist** (lead magnet)
- Sticky "Get Free Reveal" bar on mobile
- "The VisiFinder Challenge" section (free 7-day POC head-to-head with current tool)
- About / Founder Story section
- FAQ with "Talk to a real human" anchor
- Contact page with full form (no scraped `mailto:`)
- Anti-spam: honeypot + per-IP rate limit (5/hr, 30s cooldown)
- Real session-backed CSRF tokens
- Email validation incl. MX-record check + disposable-domain blocklist
- Strict URL validation (rejects gibberish)
- Self-hosted Lucide icons (no third-party CDN risk)
- HTTP security headers: HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy
- `<meta name="theme-color">` + manifest for mobile browser chrome
- Google Analytics 4 stub (replace `G-XXXXXXXXXX` in `index.html` and `thank-you.html`)
- Schema.org: SoftwareApplication, Organization, VideoObject (with transcript), FAQPage

---

## When you have your tracking IDs

**GA4** — Replace `G-XXXXXXXXXX` with your real measurement ID (appears twice in `index.html`, twice in `thank-you.html`).

**Facebook Pixel / Google Ads conversion tags** — Paste your snippets into `thank-you.html` just before `</head>` (look for the comment placeholder).

---

## Quick fixes

| Problem | Check |
|---|---|
| 500 error on submit | `config.php` credentials or `database.sql` not imported |
| No email arrives | The `from_email` must match a real address on your domain (SPF/DKIM/DMARC) |
| Calendar blank | Verify `https://websitetalkingheads.bookafy.com` is published |
| Video doesn't play | CSP in `.htaccess` may need adjusting; check browser console |
| Forms say "Invalid session" | `render.php` must be the one serving the HTML; check `.htaccess` rewrites |

---

&copy; 2026 VisiFinder.
