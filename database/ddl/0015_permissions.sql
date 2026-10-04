-- AutoMarket Pro - DDL 0015
-- RECONSTRUIDO desde Permission.php y especificación de migración aprobada.
CREATE TABLE permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    guard_name VARCHAR(100) NOT NULL DEFAULT 'web',
    description VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT uq_permissions_name_guard UNIQUE (name, guard_name),
    INDEX idx_permissions_guard_name (guard_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
