-- AutoMarket Pro - DDL 0010
CREATE TABLE vehicle_models (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 make_id BIGINT UNSIGNED NOT NULL,
 body_type_id BIGINT UNSIGNED NULL,
 name VARCHAR(150) NOT NULL,
 slug VARCHAR(180) NOT NULL,
 is_active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NULL DEFAULT NULL,
 updated_at TIMESTAMP NULL DEFAULT NULL,
 CONSTRAINT uq_vehicle_models_make_slug UNIQUE (make_id, slug),
 CONSTRAINT fk_vehicle_models_make FOREIGN KEY (make_id) REFERENCES vehicle_makes(id) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT fk_vehicle_models_body_type FOREIGN KEY (body_type_id) REFERENCES body_types(id) ON DELETE SET NULL ON UPDATE CASCADE,
 INDEX idx_vehicle_models_body_type (body_type_id),
 INDEX idx_vehicle_models_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
