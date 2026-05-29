<?php
/**
 * VisiFinder Contact Form Handler
 * Used by the public contact page (replaces direct mailto: in the footer)
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

if (!empty($_POST['hp_field'])) {
    header('Location: ' . $cfg['contact_page'] . '?sent=1');
    exit;
}

if (!vf_csrf_check($_POST['csrf_token'] ?? null)) {
    http_response_code(403);
    exit('Invalid session. Please reload and try again.');
}

$name    = htmlspecialchars(substr(trim((string)($_POST['name']    ?? '')), 0, 120), ENT_QUOTES, 'UTF-8');
$email   = trim((string)($_POST['email']   ?? ''));
$message = htmlspecialchars(substr(trim((string)($_POST['message'] ?? '')), 0, 4000), ENT_QUOTES, 'UTF-8');
$ip      = vf_client_ip();

if ($name === '' || strlen($name) < 2) {
    http_response_code(400);
    exit('Please enter your name.');
}
if (!vf_validate_email($email, $cfg['blocked_email_domains'])) {
    http_response_code(400);
    exit('Please enter a valid email.');
}
if ($message === '' || strlen($message) < 5) {
    http_response_code(400);
    exit('Please include a short message.');
}

try {
    $pdo = vf_db($cfg);
    vf_rate_limit_or_die($pdo, $ip, 60, 5);
} catch (PDOException $e) {
    error_log('[VisiFinder] Contact rate-limit DB error: ' . $e->getMessage());
    // continue — we'll still try to send mail
}

vf_mail(
    $cfg,
    $cfg['notification_email'],
    "VisiFinder Contact Form — {$name}",
    "New contact form submission\n"
  . "-----------------------------\n"
  . "Name    : {$name}\n"
  . "Email   : {$email}\n"
  . "IP      : {$ip}\n"
  . "Time    : " . date('Y-m-d H:i:s') . "\n\n"
  . "Message:\n{$message}\n",
    $email
);

header('Location: ' . $cfg['contact_page'] . '?sent=1');
exit;
