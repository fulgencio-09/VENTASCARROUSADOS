-- AutoMarket Pro - DDL 0026
CREATE TABLE vehicle_features (
    vehicle_id BIGINT UNSIGNED NOT NULL,
    feature_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (vehicle_id, feature_id),
    CONSTRAINT fk_vehicle_features_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_vehicle_features_feature FOREIGN KEY (feature_id) REFERENCES features (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
