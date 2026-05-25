# VisiFinder — Setup Guide

5 files. About 10 minutes. That's the whole setup.

---

## What you're uploading

| File | What it does |
|---|---|
| `index.html` | The landing page |
| `thank-you.html` | The page people see after they sign up |
| `process-form.php` | Saves the lead and emails you |
| `process-phone.php` | Saves a phone number from the thank-you page |
| `database.sql` | Builds the table that stores your leads |

---

## Step 1 — Create the database

1. Log into Pair Networks → **Databases** → **MySQL**.
2. Create a new database. Suggested name: `visifinder`.
3. Create a database user and give them access to that database. **Write down the username and password** — you'll need them in Step 3.
4. Open phpMyAdmin → click the new database → click the **SQL** tab.
5. Open `database.sql` in any text editor, copy everything, paste it into phpMyAdmin, click **Go**.

That's it. The `leads` table is ready.

---

## Step 2 — Upload the files

Upload these 4 files to the root of your website (usually a folder called `public_html`):

- `index.html`
- `thank-you.html`
- `process-form.php`
- `process-phone.php`

You can drop `database.sql` in too — it doesn't have to be there, but it's nice to keep next to the others.

---

## Step 3 — Plug in your database credentials

You only need to edit **two** files. Open them in any text editor.

### `process-form.php`

Find this near the top:

```php
'db_user'  => 'YOUR_DB_USER',
'db_pass'  => 'YOUR_DB_PASSWORD',
```

Replace `YOUR_DB_USER` and `YOUR_DB_PASSWORD` with the database username and password you wrote down in Step 1.

### `process-phone.php`

Same thing. Find the same two lines, paste in the same credentials.

**Save both files. Re-upload them.** Done.

---

## Step 4 — Test it

1. Visit your site.
2. Fill in the form with your real email and a real website (e.g. your own).
3. You should:
   - Land on the thank-you page with the calendar.
   - Receive an email at **sales@websitetalkingheads.com** within a minute.
   - See the new lead in phpMyAdmin under the `leads` table.

If all three happened, you're live.

---

## Step 5 (optional) — Force HTTPS

Once Pair Networks has your SSL certificate installed, open `process-form.php` and find this block near the top:

```php
// if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
//     header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
//     exit;
// }
```

Delete the `//` from the start of those 4 lines. Save. Re-upload. Now every form submission is forced to HTTPS.

---

## What's already built in

You don't need to do anything for these — they're already working:

- Live visitor counter at the top
- Click-to-call phone number in the header
- Exit-intent popup when someone tries to leave
- Sticky "Get Free Reveal" bar on mobile
- Spam blocker (honeypot)
- Rate limit: 5 submissions per hour per IP, 30-second cooldown
- Bookafy calendar on the thank-you page
- Emails go to **sales@websitetalkingheads.com**

---

## Adding tracking later (when you're ready)

When you have the IDs, open `thank-you.html` and look for the comment block near the top. Paste your snippets there:

- Facebook Pixel
- Google Ads conversion tag
- Google Analytics (GA4)

For reCAPTCHA on the form, send me your **site key** and **secret key** and I'll wire it in.

---

## Quick fixes if something breaks

| Problem | What to check |
|---|---|
| Page submits but shows an error | Database credentials in `process-form.php` are wrong, OR you didn't run `database.sql` |
| No email arrives | Pair Networks may need to authorize `noreply@websitetalkingheads.com` as a sender. Or change `from_email` in `process-form.php` to a real address you control. |
| Calendar is blank on thank-you page | Make sure your Bookafy page (`https://websitetalkingheads.bookafy.com`) is published. |
| Form submits but no redirect | Make sure `thank-you.html` is in the same folder as `process-form.php` |

---

That's everything. Questions? Reply to the email and we'll fix it together.
