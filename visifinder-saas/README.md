# VisiFinder — Pair Networks Deployment Guide

A high-converting B2B SaaS landing page for VisiFinder. Static HTML frontend
plus PHP/MySQL lead capture, ready to drop into a Pair Networks shared host
or VPS.

---

## Files in this package

| File | Purpose |
|---|---|
| `index.html` | Main landing page (SEO-optimized, 10 conversion boosters baked in) |
| `thank-you.html` | Post-submission page with Bookafy calendar + phone capture |
| `process-form.php` | Server-side lead handler (validates, stores, emails) |
| `process-phone.php` | Optional phone-number capture on the thank-you page |
| `database.sql` | One-time MySQL schema setup |

---

## 1. Set up the database

In Pair Networks' control panel, create a MySQL database (e.g. `visifinder`)
and a DB user with INSERT/SELECT/UPDATE privileges. Then import the schema:

```bash
mysql -u YOUR_DB_USER -p visifinder < database.sql
```

…or paste the contents of `database.sql` into phpMyAdmin's SQL tab.

---

## 2. Configure the PHP scripts

Open both PHP files and update the `$config` block at the top:

```php
$config = [
    'db_host'            => 'localhost',
    'db_name'            => 'visifinder',
    'db_user'            => 'YOUR_DB_USER',     // <-- change
    'db_pass'            => 'YOUR_DB_PASSWORD', // <-- change
    'notification_email' => 'sales@websitetalkingheads.com',
    'from_email'         => 'noreply@websitetalkingheads.com',
    // ...
];
```

Edit `process-form.php` AND `process-phone.php` (same credentials).

---

## 3. Upload to your web root

Upload all five files to your domain's web root (typically `public_html/`
on Pair Networks). The directory tree should be flat:

```
public_html/
├── index.html
├── thank-you.html
├── process-form.php
├── process-phone.php
└── database.sql          (optional — can stay for reference)
```

---

## 4. Force HTTPS (recommended)

Once your SSL is active in Pair Networks, open `process-form.php` and
uncomment this block near the top so non-HTTPS requests redirect:

```php
// if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
//     header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
//     exit;
// }
```

---

## 5. Test the form

1. Open your live site.
2. Submit the hero form with a real email + website.
3. You should:
   - land on `thank-you.html?lid=N`
   - receive a notification email at `sales@websitetalkingheads.com`
   - see the new row inside the `leads` table

---

## Conversion boosters already wired in

1. **Live visitor counter** (top banner, randomized 2,500–3,000)
2. **Click-to-call phone CTA** in header + hero + sticky-mobile bar
3. **Reduced form fields** — Email + Website only
4. **Exit-intent popup** — fires once per session when mouse leaves window
5. **Sticky mobile CTA** — pinned bottom bar on screens ≤ 768 px
6. **Social-proof logo bar** — 5 placeholders ready for client logos
7. **Video testimonial placeholder** — drop in an `<iframe>` or `<video>`
8. **Star-rated testimonials** — 3 cards with author + role
9. **FAQ accordion** — 5 entries answering common buyer objections
10. **Bookafy calendar embed** on the thank-you page for instant booking

---

## Adding tracking pixels later

Open `thank-you.html`, find the comment block near the top, and uncomment
the Facebook Pixel and/or Google Ads conversion snippets. Drop in your IDs.

GA4, Microsoft Clarity, Hotjar, etc. can go in the `<head>` of `index.html`
just before `</head>`.

---

## Quick troubleshooting

| Symptom | Fix |
|---|---|
| 500 error on submit | DB credentials wrong, or `leads` table missing |
| No notification email | Pair Networks may need `noreply@yourdomain.com` set up as an authorized sender |
| Bookafy calendar blank | Confirm `websitetalkingheads.bookafy.com` is live & iframe-allowed |
| Form submits but no redirect | Make sure `thank-you.html` exists in the same folder |

---

## Security notes

- All SQL queries use prepared statements (no injection risk).
- Honeypot field (`hp_field`) silently drops bots.
- Rate limit: 5 submissions per IP per hour, 30-second cooldown between submits.
- Email validation via `FILTER_VALIDATE_EMAIL`.
- URL validation + auto-https prefix via `FILTER_VALIDATE_URL`.

To layer in reCAPTCHA v3 later, add the JS snippet to `index.html` and
verify the token server-side at the top of `process-form.php`.

---

© 2026 VisiFinder — Built for Pair Networks deployment.
