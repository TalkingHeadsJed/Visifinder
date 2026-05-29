<?php
/**
 * VisiFinder Phone Capture (V2)
 * - Real CSRF, rate-limited, security headers
 */
declare(strict_types=1);

$cfg = require __DIR__ . '/config.php';
require __DIR__ . '/_lib.php';

vf_send_security_headers();
vf_force_https($cfg);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $cfg['thank_you_page']);
    exit;
}

if (!vf_csrf_check($_POST['csrf_token'] ?? null)) {
    header('Location: ' . $cfg['thank_you_page'] . '?phone=invalid');
    exit;
}

$phoneRaw = (string)($_POST['phone'] ?? '');
$lid      = (int)($_POST['lid'] ?? 0);
$ip       = vf_client_ip();

$phoneDigits = preg_replace('/[^0-9+]/', '', $phoneRaw);
if (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15) {
    header('Location: ' . $cfg['thank_you_page'] . '?phone=invalid');
    exit;
}

try {
    $pdo = vf_db($cfg);
} catch (PDOException $e) {
    error_log('[VisiFinder] Phone DB connect failed: ' . $e->getMessage());
    header('Location: ' . $cfg['thank_you_page'] . '?phone=invalid');
    exit;
}

// Rate-limit phone updates the same way
vf_rate_limit_or_die($pdo, $ip, 10, 10);

try {
    if ($lid > 0) {
        $stmt = $pdo->prepare("UPDATE leads SET phone = ? WHERE id = ? LIMIT 1");
        $stmt->execute([$phoneDigits, $lid]);
    } else {
        $stmt = $pdo->prepare("
            UPDATE leads
            SET phone = ?
            WHERE ip_address = ?
            ORDER BY created_at DESC
            LIMIT 1
        ");
        $stmt->execute([$phoneDigits, $ip]);
    }
    $updated = $stmt->rowCount();
} catch (PDOException $e) {
    error_log('[VisiFinder] Phone update failed: ' . $e->getMessage());
    $updated = 0;
}

if ($updated > 0) {
    vf_mail(
        $cfg,
        $cfg['notification_email'],
        'VisiFinder Lead — Phone Added',
        "Phone added by lead\n"
      . "-------------------\n"
      . "Lead ID : " . ($lid ?: 'latest-for-IP') . "\n"
      . "Phone   : {$phoneDigits}\n"
      . "IP      : {$ip}\n"
      . "Time    : " . date('Y-m-d H:i:s') . "\n"
    );
}

header('Location: ' . $cfg['thank_you_page'] . '?phone=saved');
exit;
