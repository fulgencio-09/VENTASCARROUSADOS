-- ============================================================================
-- AutoMarket Pro - DDL 0028
-- RECONSTRUIDO desde Publication.php + matriz de recuperación.
-- Estados físicos confirmados: pendiente, publicado, en_pausa, vendido,
-- rechazado. La expiración se representa mediante expires_at y transición
-- posterior a en_pausa; no se crea un estado 'expired'.
-- ============================================================================

CREATE TABLE publications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL,
    vehicle_id BIGINT UNSIGNED NOT NULL,
    seller_user_id BIGINT UNSIGNED NOT NULL,
    dealer_id BIGINT UNSIGNED NULL,
    plan_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price_amount DECIMAL(14,2) NOT NULL,
    price_currency CHAR(3) NOT NULL DEFAULT 'COP',
    is_negotiable BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    featured_until TIMESTAMP NULL DEFAULT NULL,
    status ENUM('pendiente', 'publicado', 'en_pausa', 'vendido', 'rechazado') NOT NULL DEFAULT 'pendiente',
    published_at TIMESTAMP NULL DEFAULT NULL,
    paused_at TIMESTAMP NULL DEFAULT NULL,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    rejection_reason VARCHAR(500) NULL,
    rejection_internal_notes TEXT NULL,
    views_count INT UNSIGNED NOT NULL DEFAULT 0,
    leads_count INT UNSIGNED NOT NULL DEFAULT 0,
    favorites_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT uq_publications_uuid UNIQUE (uuid),
    CONSTRAINT uq_publications_slug UNIQUE (slug),
    CONSTRAINT fk_publications_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_publications_seller_user FOREIGN KEY (seller_user_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_publications_dealer FOREIGN KEY (dealer_id) REFERENCES dealers (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_publications_plan FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_publications_status (status),
    INDEX idx_publications_vehicle (vehicle_id),
    INDEX idx_publications_seller_status (seller_user_id, status),
    INDEX idx_publications_dealer_status (dealer_id, status),
    INDEX idx_publications_plan (plan_id),
    INDEX idx_publications_expires_at (expires_at),
    INDEX idx_publications_featured_until (featured_until),
    INDEX idx_publications_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
