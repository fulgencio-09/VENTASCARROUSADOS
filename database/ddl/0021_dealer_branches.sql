-- AutoMarket Pro - DDL 0021
-- RECONSTRUIDO desde DealerBranch.php; versión corregida con SoftDeletes.
CREATE TABLE dealer_branches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dealer_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    city_id BIGINT UNSIGNED NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_dealer_branches_dealer FOREIGN KEY (dealer_id) REFERENCES dealers (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_dealer_branches_city FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_dealer_branches_dealer_active (dealer_id, is_active),
    INDEX idx_dealer_branches_city (city_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
