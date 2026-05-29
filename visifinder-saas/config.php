<?php
/**
 * VisiFinder — Central Config
 *
 * IMPORTANT (VPS hardening):
 *   1. Move this file OUTSIDE your web root (e.g. /var/www/visifinder-config/)
 *      and update the `require_once` path at the top of process-form.php
 *      and process-phone.php accordingly.
 *   2. Set strict permissions:  chown www-data:www-data config.php
 *                               chmod 600 config.php
 *   3. Use environment variables for DB creds in production:
 *        $cfg['db_user'] = getenv('VISIFINDER_DB_USER') ?: 'YOUR_DB_USER';
 */

return [
    // -------- Database --------
    'db_host' => 'localhost',
    'db_name' => 'visifinder',
    'db_user' => 'YOUR_DB_USER',
    'db_pass' => 'YOUR_DB_PASSWORD',

    // -------- Email --------
    // Notification destination for new leads
    'notification_email' => 'sales@visifinder.com',
    // Must be a real address on the SAME DOMAIN as your site (SPF/DKIM/DMARC)
    'from_email'         => 'noreply@visifinder.com',
    'from_name'          => 'VisiFinder',

    // -------- Pages --------
    'thank_you_page' => 'thank-you.html',
    'contact_page'   => 'contact.html',

    // -------- Security --------
    'enforce_https'           => true,   // 302 to https:// on every POST in production
    'rate_limit_seconds'      => 30,
    'max_submissions_per_hour'=> 5,

    // Disposable / fake-domain blocklist (extend as needed)
    'blocked_email_domains' => [
        'mailinator.com', 'tempmail.com', 'guerrillamail.com', '10minutemail.com',
        'throwaway.email', 'trashmail.com', 'yopmail.com', 'fakeinbox.com',
        'sharklasers.com', 'getairmail.com', 'maildrop.cc', 'dispostable.com',
    ],
];
