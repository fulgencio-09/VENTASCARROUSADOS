-- ============================================================================
-- AutoMarket Pro - DDL 0012
-- RECONSTRUIDO desde el modelo User.php + decisiones de recuperación.
-- No incluye MFA/last_login/pending_verification/banned: no hay evidencia final.
-- ============================================================================

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    email_verified_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT uq_users_uuid UNIQUE (uuid),
    CONSTRAINT uq_users_email UNIQUE (email),
    INDEX idx_users_status (status),
    INDEX idx_users_email_verified_at (email_verified_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
