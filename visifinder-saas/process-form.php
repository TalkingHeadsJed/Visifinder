<?php
/**
 * VisiFinder Lead Form Processor (V2)
 * - Real session-backed CSRF
 * - Strict email (MX) + URL validation
 * - Rate limiting, honeypot, HTTPS-forced
 * - Security headers, explicit mail() failure logging
 */
declare(strict_types=1);

$cfg = require __DIR__ . '/config.php';
require __DIR__ . '/_lib.php';

vf_send_security_headers();
vf_force_https($cfg);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

// Honeypot — silently drop bots
if (!empty($_POST['hp_field'])) {
    header('Location: ' . $cfg['thank_you_page']);
    exit;
}

// Real CSRF check
if (!vf_csrf_check($_POST['csrf_token'] ?? null)) {
    http_response_code(403);
    exit('Invalid session. Please reload and try again.');
}

// Inputs
$emailRaw   = trim((string)($_POST['email']   ?? ''));
$websiteRaw = trim((string)($_POST['website'] ?? ''));
$source     = preg_replace('/[^a-z0-9_]/i', '', (string)($_POST['source'] ?? 'main_form'));
$ip         = vf_client_ip();
$ua         = isset($_SERVER['HTTP_USER_AGENT']) ? substr($_SERVER['HTTP_USER_AGENT'], 0, 500) : '';

// Validate
if (!vf_validate_email($emailRaw, $cfg['blocked_email_domains'])) {
    http_response_code(400);
    exit('Please enter a valid work email address.');
}
$website = vf_validate_website($websiteRaw);
if ($website === false) {
    http_response_code(400);
    exit('Please enter a valid website URL (e.g. https://yourcompany.com).');
}

// DB
try {
    $pdo = vf_db($cfg);
} catch (PDOException $e) {
    error_log('[VisiFinder] DB connect failed: ' . $e->getMessage());
    http_response_code(500);
    exit('Service temporarily unavailable. Please try again shortly.');
}

vf_rate_limit_or_die($pdo, $ip, $cfg['rate_limit_seconds'], $cfg['max_submissions_per_hour']);

// Insert
try {
    $stmt = $pdo->prepare("
        INSERT INTO leads (email, website, source, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([$emailRaw, $website, $source, $ip, $ua]);
    $leadId = (int)$pdo->lastInsertId();
} catch (PDOException $e) {
    error_log('[VisiFinder] DB insert failed: ' . $e->getMessage());
    http_response_code(500);
    exit('Failed to save your information. Please try again.');
}

// Notify sales
$subject = "New VisiFinder Lead: {$emailRaw}";
$body    = "New lead from VisiFinder\n"
         . "--------------------------\n"
         . "Email   : {$emailRaw}\n"
         . "Website : {$website}\n"
         . "Source  : {$source}\n"
         . "IP      : {$ip}\n"
         . "Lead ID : {$leadId}\n"
         . "Time    : " . date('Y-m-d H:i:s') . "\n";

vf_mail($cfg, $cfg['notification_email'], $subject, $body, $emailRaw);

header('Location: ' . $cfg['thank_you_page'] . '?lid=' . urlencode((string)$leadId));
exit;
