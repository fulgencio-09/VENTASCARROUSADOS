-- AutoMarket Pro v1.2
-- DDL 0042 — APROBADO

CREATE TABLE messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT UNSIGNED NOT NULL,
    sender_user_id BIGINT UNSIGNED NULL,
    body TEXT NOT NULL,
    read_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_messages_sender_user FOREIGN KEY (sender_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_messages_conversation_timeline (conversation_id, created_at),
    INDEX idx_messages_unread (conversation_id, read_at),
    INDEX idx_messages_sender (sender_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
