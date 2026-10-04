-- AutoMarket Pro - DDL 0008
CREATE TABLE features (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(150) NOT NULL,
 category VARCHAR(100) NULL,
 is_active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NULL DEFAULT NULL,
 updated_at TIMESTAMP NULL DEFAULT NULL,
 INDEX idx_features_category (category),
 INDEX idx_features_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
