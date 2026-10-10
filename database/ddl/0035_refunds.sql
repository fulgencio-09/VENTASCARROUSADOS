CREATE TABLE refunds (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL,
    payment_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(14, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'COP',
    reason VARCHAR(255) NULL,
    status VARCHAR(50) NOT NULL,
    approved_by_user_id BIGINT UNSIGNED NULL,
    processed_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT uq_refunds_uuid UNIQUE (uuid),
    CONSTRAINT fk_refunds_payment FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_refunds_approved_by_user FOREIGN KEY (approved_by_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_refunds_payment (payment_id),
    INDEX idx_refunds_status (status),
    INDEX idx_refunds_approved_by (approved_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;