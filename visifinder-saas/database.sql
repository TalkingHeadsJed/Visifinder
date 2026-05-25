-- ============================================
-- VisiFinder Database Schema
-- ============================================
-- Run this SQL to set up your database
-- ============================================

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS visifinder
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE visifinder;

-- ============================================
-- LEADS TABLE
-- Stores all form submissions
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    website VARCHAR(500) NOT NULL,
    source VARCHAR(50) DEFAULT 'main_form' COMMENT 'Form source: main_form, exit_popup, bottom_form',
    ip_address VARCHAR(45) COMMENT 'IPv4 or IPv6 address',
    user_agent VARCHAR(500) COMMENT 'Browser user agent string',
    status ENUM('new', 'contacted', 'qualified', 'converted', 'lost') DEFAULT 'new',
    notes TEXT COMMENT 'Internal notes about the lead',
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for common queries
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_ip_address (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- RATE LIMITING VIEW (Optional)
-- Helpful for monitoring suspicious activity
-- ============================================
CREATE OR REPLACE VIEW v_submissions_by_ip AS
SELECT 
    ip_address,
    COUNT(*) as total_submissions,
    MIN(created_at) as first_submission,
    MAX(created_at) as last_submission,
    COUNT(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN 1 END) as submissions_last_hour,
    COUNT(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as submissions_last_day
FROM leads
GROUP BY ip_address
ORDER BY submissions_last_hour DESC;

-- ============================================
-- SAMPLE QUERIES
-- ============================================

-- Get all new leads
-- SELECT * FROM leads WHERE status = 'new' ORDER BY created_at DESC;

-- Get leads from the last 7 days
-- SELECT * FROM leads WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY created_at DESC;

-- Get lead count by source
-- SELECT source, COUNT(*) as count FROM leads GROUP BY source;

-- Check for potential spam (many submissions from same IP)
-- SELECT * FROM v_submissions_by_ip WHERE submissions_last_hour > 3;

-- Update lead status
-- UPDATE leads SET status = 'contacted', notes = 'Called on date' WHERE id = 1;
