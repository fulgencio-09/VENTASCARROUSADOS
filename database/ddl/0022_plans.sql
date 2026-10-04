-- AutoMarket Pro v1.2
-- DDL 0022 — APROBADO

CREATE TABLE plans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    target ENUM('publication', 'dealer') NOT NULL DEFAULT 'publication',
    price_amount DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    price_currency CHAR(3) NOT NULL DEFAULT 'COP',
    duration_days INT UNSIGNED NOT NULL DEFAULT 30,
    max_photos INT UNSIGNED NOT NULL DEFAULT 10,
    max_listings INT UNSIGNED NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT uq_plans_code UNIQUE (code),
    INDEX idx_plans_target_active (target, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
