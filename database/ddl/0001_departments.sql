-- AutoMarket Pro - DDL 0001
CREATE TABLE departments (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 code VARCHAR(20) NOT NULL,
 name VARCHAR(120) NOT NULL,
 is_active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NULL DEFAULT NULL,
 updated_at TIMESTAMP NULL DEFAULT NULL,
 CONSTRAINT uq_departments_code UNIQUE (code),
 INDEX idx_departments_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
