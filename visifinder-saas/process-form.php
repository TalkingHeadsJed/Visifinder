<?php
/**
 * VisiFinder Lead Form Processor
 *
 * Captures: Email + Website (only) from any form on the site
 * Sources : main_form (default), exit_popup, bottom_form
 *
 * Security:
 *  - Prepared statements (SQL injection safe)
 *  - Input validation & sanitization
 *  - Per-IP rate limiting
 *  - HTTPS-aware (uncomment redirect block in production)
 *  - Optional honeypot field (`hp_field`) — bots will fill it; humans won't
 */

// ============================================
// CONFIGURATION
// ============================================
$config = [
    'db_host'                 => 'localhost',
    'db_name'                 => 'visifinder',
    'db_user'                 => 'YOUR_DB_USER',
    'db_pass'                 => 'YOUR_DB_PASSWORD',
    'notification_email'      => 'sales@websitetalkingheads.com',
    'from_email'              => 'noreply@websitetalkingheads.com',
    'thank_you_page'          => 'thank-you.html',
    'rate_limit_seconds'      => 30,
    'max_submissions_per_hour'=> 5,
];

// ============================================
// REQUEST GUARDS
// ============================================

// Force HTTPS in production (uncomment when live)
// if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
//     header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
//     exit;
// }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

// Honeypot — silently drop bots
if (!empty($_POST['hp_field'])) {
    header('Location: ' . $config['thank_you_page']);
    exit;
}

// ============================================
// HELPERS
// ============================================
function getClientIP() {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    }
    return filter_var($ip, FILTER_VALIDATE_IP) ?: 'unknown';
}

function sanitize($v) {
    return htmlspecialchars(trim((string)$v), ENT_QUOTES, 'UTF-8');
}

function normalizeWebsite($url) {
    $url = trim($url);
    if ($url === '') return '';
    if (!preg_match('~^https?://~i', $url)) {
        $url = 'https://' . $url;
    }
    return $url;
}

// ============================================
// COLLECT & VALIDATE
// ============================================
$email   = isset($_POST['email'])   ? sanitize($_POST['email'])   : '';
$website = isset($_POST['website']) ? normalizeWebsite($_POST['website']) : '';
$source  = isset($_POST['source'])  ? sanitize($_POST['source'])  : 'main_form';
$ip      = getClientIP();
$ua      = isset($_SERVER['HTTP_USER_AGENT']) ? substr($_SERVER['HTTP_USER_AGENT'], 0, 500) : '';

$errors = [];
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}
if (!filter_var($website, FILTER_VALIDATE_URL)) {
    $errors[] = 'A valid website URL is required.';
}

if ($errors) {
    http_response_code(400);
    exit('Validation failed: ' . implode(' ', $errors));
}

// ============================================
// DATABASE
// ============================================
try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    error_log('DB connect failed: ' . $e->getMessage());
    http_response_code(500);
    exit('Service temporarily unavailable. Please try again shortly.');
}

// ============================================
// RATE LIMITING (per IP)
// ============================================
$stmt = $pdo->prepare("
    SELECT COUNT(*) AS cnt, MAX(created_at) AS last_at
    FROM leads
    WHERE ip_address = ?
      AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
");
$stmt->execute([$ip]);
$rate = $stmt->fetch();

if ((int)$rate['cnt'] >= $config['max_submissions_per_hour']) {
    http_response_code(429);
    exit('Too many submissions. Please try again later.');
}
if ($rate['last_at'] && (time() - strtotime($rate['last_at'])) < $config['rate_limit_seconds']) {
    http_response_code(429);
    exit('Please wait a moment before submitting again.');
}

// ============================================
// INSERT LEAD
// ============================================
try {
    $stmt = $pdo->prepare("
        INSERT INTO leads (email, website, source, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([$email, $website, $source, $ip, $ua]);
    $leadId = $pdo->lastInsertId();
} catch (PDOException $e) {
    error_log('DB insert failed: ' . $e->getMessage());
    http_response_code(500);
    exit('Failed to save your information. Please try again.');
}

// ============================================
// EMAIL NOTIFICATION
// ============================================
$subject = 'New VisiFinder Lead: ' . $email;
$body    = "New lead from VisiFinder website\n"
         . "----------------------------------\n"
         . "Email   : {$email}\n"
         . "Website : {$website}\n"
         . "Source  : {$source}\n"
         . "IP      : {$ip}\n"
         . "Lead ID : {$leadId}\n"
         . "Time    : " . date('Y-m-d H:i:s') . "\n";

$headers = implode("\r\n", [
    'From: ' . $config['from_email'],
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8',
]);

@mail($config['notification_email'], $subject, $body, $headers);

// ============================================
// REDIRECT TO THANK-YOU
// ============================================
// Pass lead_id so phone-collection form on thank-you page can append to it
header('Location: ' . $config['thank_you_page'] . '?lid=' . urlencode($leadId));
exit;
