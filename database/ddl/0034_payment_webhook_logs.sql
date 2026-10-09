CREATE TABLE payment_webhook_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    gateway VARCHAR(50) NOT NULL,
    event_id VARCHAR(150) NOT NULL,
    idempotency_key VARCHAR(150) NULL,
    payload JSON NOT NULL,
    signature VARCHAR(500) NULL,
    status VARCHAR(50) NOT NULL,
    error_message TEXT NULL,
    processed_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_payment_webhook_logs_gateway_event (gateway, event_id),
    INDEX idx_payment_webhook_logs_status (status),
    INDEX idx_payment_webhook_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
