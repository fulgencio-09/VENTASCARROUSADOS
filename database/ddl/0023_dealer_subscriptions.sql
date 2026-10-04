-- ============================================================================
-- AutoMarket Pro - DDL 0023
-- RECONSTRUIDO desde DealerSubscription.php + plan 0022.
-- ============================================================================

CREATE TABLE dealer_subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dealer_id BIGINT UNSIGNED NOT NULL,
    plan_id BIGINT UNSIGNED NOT NULL,
    status ENUM('active', 'past_due', 'cancelled', 'expired') NOT NULL DEFAULT 'active',
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NOT NULL,
    cancelled_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_dealer_subscriptions_dealer FOREIGN KEY (dealer_id) REFERENCES dealers (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_dealer_subscriptions_plan FOREIGN KEY (plan_id) REFERENCES plans (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_dealer_subscriptions_dealer_status (dealer_id, status),
    INDEX idx_dealer_subscriptions_plan (plan_id),
    INDEX idx_dealer_subscriptions_ends_at (ends_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
