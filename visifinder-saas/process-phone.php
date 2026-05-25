<?php
/**
 * VisiFinder Phone Number Collector
 *
 * Used on the thank-you page to append a phone number to the most
 * recent lead from this IP (or to the lead ID passed in `lid`).
 * Always redirects back to the thank-you page on success/failure.
 */

$config = [
    'db_host'            => 'localhost',
    'db_name'            => 'visifinder',
    'db_user'            => 'YOUR_DB_USER',
    'db_pass'            => 'YOUR_DB_PASSWORD',
    'notification_email' => 'sales@websitetalkingheads.com',
    'from_email'         => 'noreply@websitetalkingheads.com',
    'thank_you_page'     => 'thank-you.html',
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $config['thank_you_page']);
    exit;
}

function getClientIP() {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    } else {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    }
    return filter_var($ip, FILTER_VALIDATE_IP) ?: 'unknown';
}

$phoneRaw = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$lid      = isset($_POST['lid']) ? (int)$_POST['lid'] : 0;
$ip       = getClientIP();

// Strip everything except digits and leading +
$phoneDigits = preg_replace('/[^0-9+]/', '', $phoneRaw);
if (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15) {
    header('Location: ' . $config['thank_you_page'] . '?phone=invalid');
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE          => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    if ($lid > 0) {
        $stmt = $pdo->prepare("UPDATE leads SET phone = ? WHERE id = ? LIMIT 1");
        $stmt->execute([$phoneDigits, $lid]);
        $updated = $stmt->rowCount();
    } else {
        // Fallback: update the most recent lead from this IP
        $stmt = $pdo->prepare("
            UPDATE leads
            SET phone = ?
            WHERE ip_address = ?
            ORDER BY created_at DESC
            LIMIT 1
        ");
        $stmt->execute([$phoneDigits, $ip]);
        $updated = $stmt->rowCount();
    }

    // Notify sales of the new phone number
    if ($updated > 0) {
        $subject = 'VisiFinder Lead — Phone Added';
        $body    = "A lead added a phone number on the thank-you page\n"
                 . "-------------------------------------------------\n"
                 . "Lead ID : " . ($lid ?: 'most recent for IP') . "\n"
                 . "Phone   : {$phoneDigits}\n"
                 . "IP      : {$ip}\n"
                 . "Time    : " . date('Y-m-d H:i:s') . "\n";
        $headers = implode("\r\n", [
            'From: ' . $config['from_email'],
            'Content-Type: text/plain; charset=UTF-8',
        ]);
        @mail($config['notification_email'], $subject, $body, $headers);
    }
} catch (PDOException $e) {
    error_log('Phone update failed: ' . $e->getMessage());
}

header('Location: ' . $config['thank_you_page'] . '?phone=saved');
exit;
