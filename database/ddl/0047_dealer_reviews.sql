-- AutoMarket Pro v1.2
-- DDL 0047 — APROBADO

CREATE TABLE dealer_reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dealer_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    title VARCHAR(255) NULL,
    comment TEXT NULL,
    status ENUM('pendiente','publicada','rechazada') NOT NULL DEFAULT 'publicada',
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_dealer_reviews_dealer FOREIGN KEY (dealer_id) REFERENCES dealers (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_dealer_reviews_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uq_dealer_reviews_dealer_user (dealer_id,user_id),
    INDEX idx_dealer_reviews_dealer_status (dealer_id,status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
