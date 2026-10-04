-- ============================================================================
-- AutoMarket Pro - DDL 0020
-- RECONSTRUIDO desde DealerUser.php.
-- Los valores históricos exactos del status no quedaron demostrados; por eso
-- se conserva como VARCHAR y no se inventa un ENUM.
-- ============================================================================

CREATE TABLE dealer_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dealer_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role_in_dealer VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_dealer_users_dealer FOREIGN KEY (dealer_id) REFERENCES dealers (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_dealer_users_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uq_dealer_users_dealer_user (dealer_id, user_id),
    INDEX idx_dealer_users_dealer_status (dealer_id, status),
    INDEX idx_dealer_users_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
