-- AutoMarket Pro - DDL 0030
CREATE TABLE publication_plans_snapshot (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    publication_id BIGINT UNSIGNED NOT NULL,
    plan_id BIGINT UNSIGNED NOT NULL,
    plan_code VARCHAR(50) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    duration_days INT UNSIGNED NOT NULL,
    price_amount DECIMAL(14,2) NOT NULL,
    price_currency CHAR(3) NOT NULL DEFAULT 'COP',
    max_photos INT UNSIGNED NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    captured_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_publication_plans_snapshot_publication FOREIGN KEY (publication_id) REFERENCES publications (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_publication_plans_snapshot_plan FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_publication_plans_snapshot_publication (publication_id),
    INDEX idx_publication_plans_snapshot_plan (plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
