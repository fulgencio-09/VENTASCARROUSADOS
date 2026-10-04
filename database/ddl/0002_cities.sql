-- AutoMarket Pro - DDL 0002
CREATE TABLE cities (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 department_id BIGINT UNSIGNED NOT NULL,
 code VARCHAR(20) NOT NULL,
 name VARCHAR(150) NOT NULL,
 is_active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NULL DEFAULT NULL,
 updated_at TIMESTAMP NULL DEFAULT NULL,
 CONSTRAINT uq_cities_code UNIQUE (code),
 CONSTRAINT fk_cities_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT ON UPDATE CASCADE,
 INDEX idx_cities_department (department_id),
 INDEX idx_cities_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
