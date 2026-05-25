-- ============================================
-- VisiFinder Database Schema
-- ============================================
-- Run this once on your Pair Networks MySQL server.
-- Required fields: email + website (matches the V3 forms).
-- Optional fields: phone (collected on thank-you page).
-- ============================================

CREATE DATABASE IF NOT EXISTS visifinder
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE visifinder;

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(255) NOT NULL,
    website     VARCHAR(500) NOT NULL,
    phone       VARCHAR(32)  DEFAULT NULL    COMMENT 'Collected on thank-you page (optional)',
    source      VARCHAR(50)  DEFAULT 'main_form'
                              COMMENT 'main_form | exit_popup | bottom_form',
    ip_address  VARCHAR(45)  DEFAULT NULL    COMMENT 'IPv4 or IPv6',
    user_agent  VARCHAR(500) DEFAULT NULL,
    status      ENUM('new','contacted','qualified','converted','lost') DEFAULT 'new',
    notes       TEXT         DEFAULT NULL    COMMENT 'Internal notes',
    created_at  DATETIME     NOT NULL,
    updated_at  DATETIME     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email       (email),
    INDEX idx_status      (status),
    INDEX idx_created_at  (created_at),
    INDEX idx_ip_address  (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- OPTIONAL: monitoring view for spam / abuse
-- ============================================
CREATE OR REPLACE VIEW v_submissions_by_ip AS
SELECT
    ip_address,
    COUNT(*)                                                       AS total_submissions,
    MIN(created_at)                                                AS first_submission,
    MAX(created_at)                                                AS last_submission,
    SUM(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
             THEN 1 ELSE 0 END)                                    AS submissions_last_hour,
    SUM(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
             THEN 1 ELSE 0 END)                                    AS submissions_last_day
FROM leads
GROUP BY ip_address
ORDER BY submissions_last_hour DESC;

-- ============================================
-- HANDY QUERIES
-- ============================================
-- New leads only:
--   SELECT id, email, website, source, created_at
--   FROM leads WHERE status = 'new'
--   ORDER BY created_at DESC;
--
-- Leads from last 7 days:
--   SELECT * FROM leads
--   WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
--   ORDER BY created_at DESC;
--
-- Count by source:
--   SELECT source, COUNT(*) AS total
--   FROM leads
--   GROUP BY source;
--
-- Flag potential spam:
--   SELECT * FROM v_submissions_by_ip WHERE submissions_last_hour > 3;
--
-- Mark a lead contacted:
--   UPDATE leads
--   SET status = 'contacted', notes = 'Called 2026-02-01'
--   WHERE id = 1;
