-- AutoMarket Pro - DDL 0027
CREATE TABLE vehicle_inspections (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT UNSIGNED NOT NULL,
    inspector_user_id BIGINT UNSIGNED NULL,
    score TINYINT UNSIGNED NULL,
    report_s3_key VARCHAR(500) NULL,
    summary_json JSON NULL,
    inspected_at DATETIME NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_vehicle_inspections_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_vehicle_inspections_inspector FOREIGN KEY (inspector_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_vehicle_inspections_vehicle (vehicle_id),
    INDEX idx_vehicle_inspections_inspector (inspector_user_id),
    INDEX idx_vehicle_inspections_inspected_at (inspected_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
