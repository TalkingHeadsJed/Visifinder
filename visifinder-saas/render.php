<?php
/**
 * Renders any HTML file but injects a fresh CSRF token into every form
 * that has <input name="csrf_token" value="">. Use this to serve
 * index.html, thank-you.html, contact.html on your VPS.
 *
 * Example (Apache .htaccess):
 *   RewriteRule ^/?$ /render.php?page=index.html [L]
 *   RewriteRule ^thank-you/?$ /render.php?page=thank-you.html [L]
 *   RewriteRule ^contact/?$ /render.php?page=contact.html [L]
 *
 * Or in nginx:
 *   location = / { try_files $uri /render.php?page=index.html; }
 */
declare(strict_types=1);

require __DIR__ . '/_lib.php';
vf_send_security_headers();

$allowed = ['index.html' => 1, 'thank-you.html' => 1, 'contact.html' => 1];
$page    = $_GET['page'] ?? 'index.html';
if (!isset($allowed[$page])) {
    http_response_code(404);
    exit('Not found');
}

$path = __DIR__ . '/' . $page;
if (!is_file($path)) {
    http_response_code(404);
    exit('Not found');
}

$html  = file_get_contents($path);
$token = vf_csrf_token();
$html  = str_replace('name="csrf_token" value=""', 'name="csrf_token" value="' . htmlspecialchars($token, ENT_QUOTES) . '"', $html);

header('Content-Type: text/html; charset=UTF-8');
echo $html;
