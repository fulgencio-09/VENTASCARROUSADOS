-- ============================================================================
-- AutoMarket Pro - DDL 0019
-- RECONSTRUIDO desde Dealer.php + matriz de recuperación.
-- ============================================================================

CREATE TABLE dealers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL,
    commercial_name VARCHAR(150) NOT NULL,
    nit VARCHAR(30) NOT NULL,
    website VARCHAR(255) NULL,
    whatsapp VARCHAR(30) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    logo_media_id BIGINT UNSIGNED NULL,
    banner_media_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT uq_dealers_uuid UNIQUE (uuid),
    CONSTRAINT uq_dealers_nit UNIQUE (nit),
    INDEX idx_dealers_status (status),
    INDEX idx_dealers_logo_media (logo_media_id),
    INDEX idx_dealers_banner_media (banner_media_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FK dealers.logo_media_id/banner_media_id -> media_files.id se agrega después
-- de crear 0031_media_files.
