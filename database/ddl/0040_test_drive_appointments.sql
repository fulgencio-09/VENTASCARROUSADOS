-- AutoMarket Pro v1.2
-- DDL 0040 — APROBADO

CREATE TABLE test_drive_appointments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lead_id BIGINT UNSIGNED NOT NULL,
    dealer_branch_id BIGINT UNSIGNED NULL,
    scheduled_at DATETIME NOT NULL,
    location_address VARCHAR(255) NOT NULL,
    status ENUM('solicitada', 'confirmada', 'completada', 'cancelada', 'no_show') NOT NULL DEFAULT 'solicitada',
    notes TEXT NULL,
    cancellation_reason VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_test_drive_appointments_lead
        FOREIGN KEY (lead_id) REFERENCES leads (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_test_drive_appointments_branch
        FOREIGN KEY (dealer_branch_id) REFERENCES dealer_branches (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_test_drive_lead_status (lead_id, status),
    INDEX idx_test_drive_agenda (scheduled_at, status),
    INDEX idx_test_drive_branch (dealer_branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
