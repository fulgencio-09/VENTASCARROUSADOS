-- ============================================================================
-- AutoMarket Pro - DDL 0024
-- RECONSTRUIDO desde UserKycDocument.php.
-- La FK hacia media_files se difiere a 0031 para respetar el orden DDL.
-- ============================================================================

CREATE TABLE user_kyc_documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    media_file_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
    rejection_reason VARCHAR(500) NULL,
    verified_at TIMESTAMP NULL DEFAULT NULL,
    verified_by_user_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_user_kyc_documents_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_user_kyc_documents_verified_by FOREIGN KEY (verified_by_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_user_kyc_documents_user_status (user_id, status),
    INDEX idx_user_kyc_documents_media (media_file_id),
    INDEX idx_user_kyc_documents_verified_by (verified_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FK user_kyc_documents.media_file_id -> media_files.id se agrega después de crear 0031_media_files.
