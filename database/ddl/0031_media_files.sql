-- AutoMarket Pro - DDL 0031
-- RECONSTRUIDO desde MediaFile.php. Mantiene los campos consumidos por el modelo.
CREATE TABLE media_files (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL,
    file_type VARCHAR(30) NOT NULL,
    publication_id BIGINT UNSIGNED NULL,
    vehicle_inspection_id BIGINT UNSIGNED NULL,
    uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    s3_bucket VARCHAR(255) NOT NULL,
    s3_key_original VARCHAR(500) NOT NULL,
    s3_key_hd VARCHAR(500) NULL,
    s3_key_thumb VARCHAR(500) NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL,
    width INT UNSIGNED NULL,
    height INT UNSIGNED NULL,
    aspect_ratio DECIMAL(8,2) NULL,
    order_index INT UNSIGNED NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    processing_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    checksum_sha256 CHAR(64) NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT uq_media_files_uuid UNIQUE (uuid),
    CONSTRAINT uq_media_files_checksum_sha256 UNIQUE (checksum_sha256),
    CONSTRAINT fk_media_files_publication FOREIGN KEY (publication_id) REFERENCES publications (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_media_files_vehicle_inspection FOREIGN KEY (vehicle_inspection_id) REFERENCES vehicle_inspections (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_media_files_uploaded_by FOREIGN KEY (uploaded_by_user_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_media_files_publication_order (publication_id, order_index),
    INDEX idx_media_files_publication_primary (publication_id, is_primary),
    INDEX idx_media_files_inspection (vehicle_inspection_id),
    INDEX idx_media_files_uploaded_by (uploaded_by_user_id),
    INDEX idx_media_files_processing_status (processing_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FKs diferidas: se agregan después de crear media_files.
ALTER TABLE profiles
    ADD CONSTRAINT fk_profiles_avatar_media
    FOREIGN KEY (avatar_media_id) REFERENCES media_files (id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE dealers
    ADD CONSTRAINT fk_dealers_logo_media
    FOREIGN KEY (logo_media_id) REFERENCES media_files (id)
    ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT fk_dealers_banner_media
    FOREIGN KEY (banner_media_id) REFERENCES media_files (id)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE user_kyc_documents
    ADD CONSTRAINT fk_user_kyc_documents_media
    FOREIGN KEY (media_file_id) REFERENCES media_files (id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE vehicle_makes
    ADD CONSTRAINT fk_vehicle_makes_logo_media
    FOREIGN KEY (logo_media_id) REFERENCES media_files (id)
    ON DELETE SET NULL ON UPDATE CASCADE;
