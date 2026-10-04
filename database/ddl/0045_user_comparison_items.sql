-- AutoMarket Pro v1.2
-- DDL 0045 — APROBADO

CREATE TABLE user_comparison_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    publication_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT uq_user_comparison_items_user_publication UNIQUE (user_id, publication_id),
    INDEX idx_user_comparison_items_publication (publication_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
