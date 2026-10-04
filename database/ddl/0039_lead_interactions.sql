-- AutoMarket Pro v1.2
-- DDL 0039 — APROBADO

CREATE TABLE lead_interactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lead_id BIGINT UNSIGNED NOT NULL,
    performed_by_user_id BIGINT UNSIGNED NULL,
    type ENUM('nota_interna', 'llamada', 'whatsapp', 'correo', 'visita_concesionario') NOT NULL DEFAULT 'nota_interna',
    notes TEXT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_lead_interactions_lead
        FOREIGN KEY (lead_id) REFERENCES leads (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_lead_interactions_performed_by_user
        FOREIGN KEY (performed_by_user_id) REFERENCES users (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_lead_interactions_timeline (lead_id, created_at),
    INDEX idx_lead_interactions_user (performed_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
