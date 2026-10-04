-- ============================================================================
-- AutoMarket Pro - DDL 0019
-- RECONSTRUIDO desde Dealer.php + matriz de recuperación.
-- ============================================================================

CREATE TABLE dealers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL,
    legal_name VARCHAR(200) NOT NULL,
    commercial_name VARCHAR(150) NOT NULL,
    nit VARCHAR(30) NOT NULL,
    email VARCHAR(150) NULL,
    phone VARCHAR(30) NULL,
    whatsapp VARCHAR(30) NULL,
    website VARCHAR(255) NULL,
    logo_media_id BIGINT UNSIGNED NULL,
    banner_media_id BIGINT UNSIGNED NULL,
    city_id BIGINT UNSIGNED NULL,
    address VARCHAR(255) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    verified_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT uq_dealers_uuid UNIQUE (uuid),
    CONSTRAINT uq_dealers_nit UNIQUE (nit),
    CONSTRAINT fk_dealers_city FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_dealers_status (status),
    INDEX idx_dealers_city (city_id),
    INDEX idx_dealers_logo_media (logo_media_id),
    INDEX idx_dealers_banner_media (banner_media_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FKs logo_media_id/banner_media_id -> media_files.id se agregan después de 0031_media_files.
