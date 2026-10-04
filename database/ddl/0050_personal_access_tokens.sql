-- =============================================================================
-- BLOQUE DDL: 0050
-- TABLA: personal_access_tokens
-- DESCRIPCIÓN: Almacenamiento de Personal Access Tokens para Laravel Sanctum.
-- PROYECTO: AutoMarket Pro v1.2
-- MOTOR: MySQL 8.0 | CHARSET: utf8mb4 | COLLATION: utf8mb4_unicode_ci
-- =============================================================================

CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL,
    abilities TEXT NULL DEFAULT NULL,
    last_used_at TIMESTAMP NULL DEFAULT NULL,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT uq_personal_access_tokens_token UNIQUE (token),
    INDEX idx_personal_access_tokens_tokenable (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
