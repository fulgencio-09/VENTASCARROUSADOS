-- ============================================================================
-- AutoMarket Pro - DDL 0013
-- RECONSTRUIDO desde Profile.php.
-- Las FK hacia media_files se difieren hasta DDL 0031 para evitar dependencia
-- circular de orden de creación.
-- ============================================================================

CREATE TABLE profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    document_type VARCHAR(30) NULL,
    document_number VARCHAR(50) NULL,
    phone VARCHAR(30) NULL,
    whatsapp VARCHAR(30) NULL,
    city_id BIGINT UNSIGNED NULL,
    address VARCHAR(255) NULL,
    avatar_media_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT uq_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_profiles_city FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_profiles_document (document_type, document_number),
    INDEX idx_profiles_city (city_id),
    INDEX idx_profiles_avatar_media (avatar_media_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FK profiles.avatar_media_id -> media_files.id se agrega después de crear 0031_media_files.
