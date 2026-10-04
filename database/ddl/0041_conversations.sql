-- AutoMarket Pro v1.2
-- DDL 0041 — APROBADO

CREATE TABLE conversations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    publication_id BIGINT UNSIGNED NOT NULL,
    buyer_user_id BIGINT UNSIGNED NULL,
    seller_user_id BIGINT UNSIGNED NULL,
    status ENUM('activa', 'archivada', 'bloqueada') NOT NULL DEFAULT 'activa',
    last_message_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_conversations_publication FOREIGN KEY (publication_id) REFERENCES publications (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_conversations_buyer_user FOREIGN KEY (buyer_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_conversations_seller_user FOREIGN KEY (seller_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_conversations_pub_buyer (publication_id, buyer_user_id),
    INDEX idx_conversations_buyer_inbox (buyer_user_id, last_message_at),
    INDEX idx_conversations_seller_inbox (seller_user_id, last_message_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
