-- AutoMarket Pro v1.2
-- DDL 0046 — APROBADO

CREATE TABLE publication_analytics_daily (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    publication_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    views_count INT UNSIGNED NOT NULL DEFAULT 0,
    leads_count INT UNSIGNED NOT NULL DEFAULT 0,
    favorites_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_pub_analytics_publication FOREIGN KEY (publication_id) REFERENCES publications (id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uq_publication_analytics_daily (publication_id, date),
    INDEX idx_publication_analytics_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
