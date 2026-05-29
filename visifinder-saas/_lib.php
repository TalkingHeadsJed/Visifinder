<?php
/**
 * VisiFinder — Shared helpers
 * Loaded by process-form.php, process-phone.php, process-contact.php
 */

declare(strict_types=1);

// -------- HTTP Security Headers (sent on every PHP response) --------
function vf_send_security_headers(): void {
    header('X-Frame-Options: DENY');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    // CSP is intentionally permissive enough for inline form-redirects; tighten later
    header("Content-Security-Policy: default-src 'self'; "
         . "img-src 'self' data: https://vumbnail.com https://*.vimeocdn.com; "
         . "script-src 'self' https://www.googletagmanager.com 'unsafe-inline'; "
         . "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; "
         . "font-src https://fonts.gstatic.com; "
         . "frame-src https://player.vimeo.com https://websitetalkingheads.bookafy.com; "
         . "connect-src 'self' https://www.google-analytics.com");
    header('Cache-Control: no-store, no-cache, must-revalidate');
}

// -------- Force HTTPS in production --------
function vf_force_https(array $cfg): void {
    if (empty($cfg['enforce_https'])) return;
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    if (!$isHttps) {
        header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'], true, 301);
        exit;
    }
}

// -------- Client IP (proxy-aware) --------
function vf_client_ip(): string {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    } else {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    }
    return filter_var($ip, FILTER_VALIDATE_IP) ?: 'unknown';
}

// -------- CSRF (session-backed double-submit token) --------
function vf_csrf_start(): void {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_set_cookie_params([
            'lifetime' => 0,
            'path'     => '/',
            'secure'   => true,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
}
function vf_csrf_token(): string {
    vf_csrf_start();
    return $_SESSION['csrf_token'];
}
function vf_csrf_check(?string $submitted): bool {
    vf_csrf_start();
    return is_string($submitted)
        && !empty($_SESSION['csrf_token'])
        && hash_equals($_SESSION['csrf_token'], $submitted);
}

// -------- Email validation (format + domain + MX) --------
function vf_validate_email(string $email, array $blocked = []): bool {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) return false;
    $parts = explode('@', $email);
    if (count($parts) !== 2) return false;
    $domain = strtolower($parts[1]);
    if (in_array($domain, $blocked, true)) return false;
    // MX or A record must exist
    if (function_exists('checkdnsrr')) {
        if (!checkdnsrr($domain, 'MX') && !checkdnsrr($domain, 'A')) return false;
    }
    return true;
}

// -------- Strict URL validation (must have valid public TLD) --------
function vf_validate_website(string $url): string|false {
    $url = trim($url);
    if ($url === '') return false;
    if (!preg_match('~^https?://~i', $url)) {
        $url = 'https://' . $url;
    }
    if (!filter_var($url, FILTER_VALIDATE_URL)) return false;
    $host = parse_url($url, PHP_URL_HOST);
    if (!$host) return false;
    // Reject single-word hosts like "garbage" or IP literals for lead capture
    if (filter_var($host, FILTER_VALIDATE_IP)) return false;
    if (strpos($host, '.') === false) return false;
    // Top-level chunk should look like a TLD (2+ letters)
    $tld = substr(strrchr($host, '.'), 1);
    if (!preg_match('/^[a-z]{2,24}$/i', $tld)) return false;
    return $url;
}

// -------- DB connection --------
function vf_db(array $cfg): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            "mysql:host={$cfg['db_host']};dbname={$cfg['db_name']};charset=utf8mb4",
            $cfg['db_user'],
            $cfg['db_pass'],
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
    }
    return $pdo;
}

// -------- Rate limiting --------
function vf_rate_limit_or_die(PDO $pdo, string $ip, int $secondsBetween, int $maxPerHour): void {
    $stmt = $pdo->prepare("
        SELECT COUNT(*) AS cnt, MAX(created_at) AS last_at
        FROM leads
        WHERE ip_address = ?
          AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
    ");
    $stmt->execute([$ip]);
    $rate = $stmt->fetch();
    if ((int)$rate['cnt'] >= $maxPerHour) {
        http_response_code(429);
        exit('Too many submissions. Please try again later.');
    }
    if ($rate['last_at'] && (time() - strtotime($rate['last_at'])) < $secondsBetween) {
        http_response_code(429);
        exit('Please wait a moment before submitting again.');
    }
}

// -------- Send mail with explicit failure logging --------
function vf_mail(array $cfg, string $to, string $subject, string $body, ?string $replyTo = null): bool {
    $headers = [
        "From: {$cfg['from_name']} <{$cfg['from_email']}>",
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8',
    ];
    if ($replyTo) $headers[] = 'Reply-To: ' . $replyTo;

    $ok = mail($to, $subject, $body, implode("\r\n", $headers));
    if (!$ok) {
        error_log("[VisiFinder] mail() failed: to={$to} subject={$subject}");
    }
    return $ok;
}
