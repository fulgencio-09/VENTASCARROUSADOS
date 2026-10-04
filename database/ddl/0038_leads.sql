-- AutoMarket Pro v1.2
-- DDL 0038 — APROBADO / CORREGIDO

CREATE TABLE leads (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    seller_user_id BIGINT UNSIGNED NULL,
    buyer_user_id BIGINT UNSIGNED NULL,
    publication_id BIGINT UNSIGNED NULL,
    dealer_id BIGINT UNSIGNED NULL,
    buyer_name VARCHAR(120) NOT NULL,
    buyer_email VARCHAR(150) NULL,
    buyer_phone VARCHAR(30) NULL,
    initial_message TEXT NULL,
    type ENUM('consulta', 'test_drive', 'oferta', 'financiamiento') NOT NULL DEFAULT 'consulta',
    status ENUM('nuevo', 'contactado', 'en_negociacion', 'ganado', 'perdido') NOT NULL DEFAULT 'nuevo',
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_leads_seller_user FOREIGN KEY (seller_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_leads_buyer_user FOREIGN KEY (buyer_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_leads_publication FOREIGN KEY (publication_id) REFERENCES publications (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_leads_dealer FOREIGN KEY (dealer_id) REFERENCES dealers (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_leads_seller_status (seller_user_id, status),
    INDEX idx_leads_dealer_status (dealer_id, status),
    INDEX idx_leads_buyer (buyer_user_id),
    INDEX idx_leads_publication (publication_id),
    INDEX idx_leads_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
