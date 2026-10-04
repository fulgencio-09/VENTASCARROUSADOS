-- AutoMarket Pro - DDL 0009
CREATE TABLE vehicle_makes (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(120) NOT NULL,
 slug VARCHAR(150) NOT NULL,
 logo_media_id BIGINT UNSIGNED NULL,
 is_active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NULL DEFAULT NULL,
 updated_at TIMESTAMP NULL DEFAULT NULL,
 CONSTRAINT uq_vehicle_makes_slug UNIQUE (slug),
 INDEX idx_vehicle_makes_active (is_active),
 INDEX idx_vehicle_makes_logo_media (logo_media_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FK logo_media_id -> media_files.id se difiere hasta 0031_media_files.
