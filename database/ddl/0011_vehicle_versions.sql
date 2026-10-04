-- AutoMarket Pro - DDL 0011
CREATE TABLE vehicle_versions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 uuid CHAR(36) NOT NULL,
 model_id BIGINT UNSIGNED NOT NULL,
 name VARCHAR(150) NOT NULL,
 slug VARCHAR(180) NOT NULL,
 is_active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NULL DEFAULT NULL,
 updated_at TIMESTAMP NULL DEFAULT NULL,
 CONSTRAINT uq_vehicle_versions_uuid UNIQUE (uuid),
 CONSTRAINT uq_vehicle_versions_model_slug UNIQUE (model_id, slug),
 CONSTRAINT fk_vehicle_versions_model FOREIGN KEY (model_id) REFERENCES vehicle_models(id) ON DELETE CASCADE ON UPDATE CASCADE,
 INDEX idx_vehicle_versions_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
