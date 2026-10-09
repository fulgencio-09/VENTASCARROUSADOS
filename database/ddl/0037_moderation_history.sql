CREATE TABLE moderation_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    moderation_case_id BIGINT UNSIGNED NOT NULL,
    moderator_user_id BIGINT UNSIGNED NULL,
    from_status VARCHAR(30) NULL,
    to_status VARCHAR(30) NOT NULL,
    decision VARCHAR(30) NULL,
    reason VARCHAR(500) NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_moderation_history_case FOREIGN KEY (moderation_case_id) REFERENCES moderation_cases (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_moderation_history_moderator FOREIGN KEY (moderator_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_moderation_history_case_created (moderation_case_id, created_at),
    INDEX idx_moderation_history_moderator (moderator_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
