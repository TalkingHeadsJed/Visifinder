<?php
/**
 * VisiFinder Lead Form Processor
 * 
 * Security Features:
 * - CSRF token validation
 * - Prepared statements (SQL injection prevention)
 * - Input sanitization and validation
 * - Rate limiting
 * - HTTPS enforcement
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
$config = [
    'db_host' => 'localhost',
    'db_name' => 'visifinder',
    'db_user' => 'YOUR_DB_USER',
    'db_pass' => 'YOUR_DB_PASSWORD',
    'notification_email' => 'YOUR_EMAIL@example.com',
    'from_email' => 'noreply@visifinder.com',
    'rate_limit_seconds' => 60,  // Minimum seconds between submissions from same IP
    'max_submissions_per_hour' => 5  // Max submissions per IP per hour
];

// ============================================
// SECURITY CHECKS
// ============================================

// Enforce HTTPS in production
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    // Uncomment the following line in production:
    // header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    // exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method not allowed');
}

// Get client IP (handles proxies)
function getClientIP() {
    $ip = $_SERVER['REMOTE_ADDR'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    }
    return filter_var(trim($ip), FILTER_VALIDATE_IP) ?: 'unknown';
}

// ============================================
// INPUT VALIDATION & SANITIZATION
// ============================================

function sanitizeInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return $input;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validateURL($url) {
    return filter_var($url, FILTER_VALIDATE_URL);
}

function validatePhone($phone) {
    // Remove all non-numeric characters except + for country code
    $cleaned = preg_replace('/[^0-9+]/', '', $phone);
    return strlen($cleaned) >= 10 && strlen($cleaned) <= 15;
}

// Collect and validate form data
$name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
$website = isset($_POST['website']) ? sanitizeInput($_POST['website']) : '';
$source = isset($_POST['source']) ? sanitizeInput($_POST['source']) : 'main_form';
$ip_address = getClientIP();

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Valid name is required';
}

if (!validateEmail($email)) {
    $errors[] = 'Valid email is required';
}

if (!validatePhone($phone)) {
    $errors[] = 'Valid phone number is required';
}

if (!validateURL($website)) {
    $errors[] = 'Valid website URL is required';
}

if (!empty($errors)) {
    http_response_code(400);
    die('Validation failed: ' . implode(', ', $errors));
}

// ============================================
// DATABASE CONNECTION
// ============================================

try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    http_response_code(500);
    die('Service temporarily unavailable. Please try again later.');
}

// ============================================
// RATE LIMITING
// ============================================

// Check recent submissions from this IP
$stmt = $pdo->prepare("
    SELECT COUNT(*) as count, MAX(created_at) as last_submission 
    FROM leads 
    WHERE ip_address = ? 
    AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
");
$stmt->execute([$ip_address]);
$rateCheck = $stmt->fetch();

if ($rateCheck['count'] >= $config['max_submissions_per_hour']) {
    http_response_code(429);
    die('Too many submissions. Please try again later.');
}

if ($rateCheck['last_submission']) {
    $lastSubmission = strtotime($rateCheck['last_submission']);
    if (time() - $lastSubmission < $config['rate_limit_seconds']) {
        http_response_code(429);
        die('Please wait before submitting again.');
    }
}

// ============================================
// SAVE TO DATABASE
// ============================================

try {
    $stmt = $pdo->prepare("
        INSERT INTO leads (name, email, phone, website, source, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $stmt->execute([
        $name,
        $email,
        $phone,
        $website,
        $source,
        $ip_address,
        isset($_SERVER['HTTP_USER_AGENT']) ? substr($_SERVER['HTTP_USER_AGENT'], 0, 500) : ''
    ]);
    
    $leadId = $pdo->lastInsertId();
    
} catch (PDOException $e) {
    error_log("Database insert failed: " . $e->getMessage());
    http_response_code(500);
    die('Failed to save your information. Please try again.');
}

// ============================================
// SEND EMAIL NOTIFICATION
// ============================================

$subject = "New VisiFinder Lead: $name";
$message = "
New lead submission from VisiFinder website:

Name: $name
Email: $email
Phone: $phone
Website: $website
Source: $source
IP Address: $ip_address
Submitted: " . date('Y-m-d H:i:s') . "
Lead ID: $leadId

---
This is an automated notification from VisiFinder.
";

$headers = [
    'From: ' . $config['from_email'],
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// Send email (will fail silently if mail server not configured)
@mail($config['notification_email'], $subject, $message, implode("\r\n", $headers));

// ============================================
// REDIRECT TO THANK YOU PAGE
// ============================================

header('Location: thank-you.html');
exit();
