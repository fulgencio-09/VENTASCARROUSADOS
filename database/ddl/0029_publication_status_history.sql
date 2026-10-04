-- AutoMarket Pro - DDL 0029
CREATE TABLE publication_status_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    publication_id BIGINT UNSIGNED NOT NULL,
    from_status VARCHAR(30) NULL,
    to_status VARCHAR(30) NOT NULL,
    changed_by_user_id BIGINT UNSIGNED NULL,
    reason VARCHAR(500) NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_publication_status_history_publication FOREIGN KEY (publication_id) REFERENCES publications (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_publication_status_history_user FOREIGN KEY (changed_by_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_publication_status_history_timeline (publication_id, created_at),
    INDEX idx_publication_status_history_user (changed_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
