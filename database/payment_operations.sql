-- 链上支付系统数据库操作脚本
-- 创建时间: 2024-12-21

-- ==============================================
-- 1. 创建数据库（如果不存在）
-- ==============================================
CREATE DATABASE IF NOT EXISTS novelhub_payment 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE novelhub_payment;

-- ==============================================
-- 2. 创建表结构（如果不存在）
-- ==============================================

-- 订单表
CREATE TABLE IF NOT EXISTS payment_orders (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(64) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    product_type ENUM('subscription', 'chapter', 'coins') NOT NULL,
    product_id VARCHAR(64),
    currency VARCHAR(10) NOT NULL,
    fiat_amount DECIMAL(10,2) NOT NULL,
    token_amount DECIMAL(20,8) NOT NULL,
    recipient_address VARCHAR(42) NOT NULL,
    price_ttl BIGINT NOT NULL,
    status ENUM('pending', 'paid', 'expired', 'cancelled', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    paid_at TIMESTAMP NULL,
    description TEXT,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 交易记录表
CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    tx_hash VARCHAR(66) UNIQUE NOT NULL,
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    block_number BIGINT,
    confirmations INT DEFAULT 0,
    gas_used VARCHAR(20),
    gas_price VARCHAR(20),
    status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES payment_orders(order_id) ON DELETE CASCADE,
    INDEX idx_tx_hash (tx_hash),
    INDEX idx_order_id (order_id),
    INDEX idx_status (status),
    INDEX idx_from_address (from_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户权益表
CREATE TABLE IF NOT EXISTS user_benefits (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(64) NOT NULL,
    benefit_type VARCHAR(50) NOT NULL,
    benefit_value TEXT,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES payment_orders(order_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_benefit_type (benefit_type),
    INDEX idx_expires_at (expires_at),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 产品表
CREATE TABLE IF NOT EXISTS payment_products (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    product_type ENUM('subscription', 'chapter', 'coins') NOT NULL,
    fiat_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_type (product_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 代币配置表
CREATE TABLE IF NOT EXISTS token_configs (
    id VARCHAR(36) PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(42) NOT NULL,
    decimals INT NOT NULL,
    chain_id INT NOT NULL,
    is_native BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_symbol (symbol),
    INDEX idx_chain_id (chain_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 价格历史表
CREATE TABLE IF NOT EXISTS price_history (
    id VARCHAR(36) PRIMARY KEY,
    currency VARCHAR(10) NOT NULL,
    fiat_amount DECIMAL(10,2) NOT NULL,
    token_amount DECIMAL(20,8) NOT NULL,
    exchange_rate DECIMAL(20,8) NOT NULL,
    price_ttl BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_currency (currency),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 退款记录表
CREATE TABLE IF NOT EXISTS refund_records (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL,
    refund_id VARCHAR(64) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    reason VARCHAR(100) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'processed') DEFAULT 'pending',
    tx_hash VARCHAR(66) NULL,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES payment_orders(order_id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_configs (
    id VARCHAR(36) PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================
-- 3. 创建存储过程
-- ==============================================

-- 清理过期订单的存储过程
DELIMITER //
CREATE PROCEDURE CleanExpiredOrders()
BEGIN
    UPDATE payment_orders 
    SET status = 'expired' 
    WHERE status = 'pending' 
    AND expires_at < NOW();
    
    SELECT ROW_COUNT() as expired_orders_count;
END //
DELIMITER ;

-- 获取用户支付统计的存储过程
DELIMITER //
CREATE PROCEDURE GetUserPaymentStats(IN p_user_id VARCHAR(36))
BEGIN
    SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired_orders,
        SUM(CASE WHEN status = 'paid' THEN fiat_amount ELSE 0 END) as total_fiat_spent,
        SUM(CASE WHEN status = 'paid' THEN token_amount ELSE 0 END) as total_tokens_spent
    FROM payment_orders 
    WHERE user_id = p_user_id;
END //
DELIMITER ;

-- 获取支付统计的存储过程
DELIMITER //
CREATE PROCEDURE GetPaymentStats(IN p_start_date DATE, IN p_end_date DATE)
BEGIN
    SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired_orders,
        SUM(CASE WHEN status = 'paid' THEN fiat_amount ELSE 0 END) as total_fiat_volume,
        SUM(CASE WHEN status = 'paid' THEN token_amount ELSE 0 END) as total_token_volume,
        AVG(CASE WHEN status = 'paid' THEN fiat_amount ELSE NULL END) as avg_order_value
    FROM payment_orders 
    WHERE created_at BETWEEN p_start_date AND p_end_date;
END //
DELIMITER ;

-- ==============================================
-- 4. 创建视图
-- ==============================================

-- 订单详情视图
CREATE VIEW v_order_details AS
SELECT 
    o.id,
    o.order_id,
    o.user_id,
    o.product_type,
    o.product_id,
    p.name as product_name,
    o.currency,
    o.fiat_amount,
    o.token_amount,
    o.recipient_address,
    o.status,
    o.created_at,
    o.expires_at,
    o.paid_at,
    o.description,
    t.tx_hash,
    t.confirmations,
    t.block_number
FROM payment_orders o
LEFT JOIN payment_products p ON o.product_id = p.product_id
LEFT JOIN payment_transactions t ON o.order_id = t.order_id;

-- 用户权益视图
CREATE VIEW v_user_benefits AS
SELECT 
    ub.id,
    ub.user_id,
    ub.order_id,
    ub.benefit_type,
    ub.benefit_value,
    ub.expires_at,
    ub.is_active,
    ub.created_at,
    o.product_type,
    o.description as order_description
FROM user_benefits ub
LEFT JOIN payment_orders o ON ub.order_id = o.order_id;

-- 支付统计视图
CREATE VIEW v_payment_stats AS
SELECT 
    DATE(created_at) as payment_date,
    currency,
    COUNT(*) as order_count,
    SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count,
    SUM(CASE WHEN status = 'paid' THEN fiat_amount ELSE 0 END) as fiat_volume,
    SUM(CASE WHEN status = 'paid' THEN token_amount ELSE 0 END) as token_volume
FROM payment_orders
GROUP BY DATE(created_at), currency;

-- ==============================================
-- 5. 创建触发器
-- ==============================================

-- 订单状态更新触发器
DELIMITER //
CREATE TRIGGER tr_order_status_update
AFTER UPDATE ON payment_orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
        INSERT INTO system_logs (id, level, message, context, created_at)
        VALUES (
            UUID(),
            'INFO',
            'Order payment confirmed',
            JSON_OBJECT('order_id', NEW.order_id, 'user_id', NEW.user_id, 'amount', NEW.token_amount, 'currency', NEW.currency),
            NOW()
        );
    END IF;
END //
DELIMITER ;

-- 交易确认触发器
DELIMITER //
CREATE TRIGGER tr_transaction_confirmed
AFTER UPDATE ON payment_transactions
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE payment_orders 
        SET status = 'paid', paid_at = NOW()
        WHERE order_id = NEW.order_id AND status = 'pending';
    END IF;
END //
DELIMITER ;

-- ==============================================
-- 6. 创建索引优化
-- ==============================================

-- 复合索引
CREATE INDEX idx_orders_user_status ON payment_orders(user_id, status);
CREATE INDEX idx_orders_created_status ON payment_orders(created_at, status);
CREATE INDEX idx_transactions_status_created ON payment_transactions(status, created_at);
CREATE INDEX idx_benefits_user_active ON user_benefits(user_id, is_active);

-- 全文索引（用于搜索）
CREATE FULLTEXT INDEX idx_orders_description ON payment_orders(description);

-- ==============================================
-- 7. 创建分区表（可选，用于大数据量）
-- ==============================================

-- 按月份分区的交易记录表
CREATE TABLE payment_transactions_partitioned (
    id VARCHAR(36),
    order_id VARCHAR(64) NOT NULL,
    tx_hash VARCHAR(66) UNIQUE NOT NULL,
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    amount DECIMAL(20,8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    block_number BIGINT,
    confirmations INT DEFAULT 0,
    gas_used VARCHAR(20),
    gas_price VARCHAR(20),
    status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at)) (
    PARTITION p202412 VALUES LESS THAN (202501),
    PARTITION p202501 VALUES LESS THAN (202502),
    PARTITION p202502 VALUES LESS THAN (202503),
    PARTITION p202503 VALUES LESS THAN (202504),
    PARTITION p202504 VALUES LESS THAN (202505),
    PARTITION p202505 VALUES LESS THAN (202506),
    PARTITION p202506 VALUES LESS THAN (202507),
    PARTITION p202507 VALUES LESS THAN (202508),
    PARTITION p202508 VALUES LESS THAN (202509),
    PARTITION p202509 VALUES LESS THAN (202510),
    PARTITION p202510 VALUES LESS THAN (202511),
    PARTITION p202511 VALUES LESS THAN (202512),
    PARTITION p202512 VALUES LESS THAN (202601),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- ==============================================
-- 8. 创建定时任务（事件调度器）
-- ==============================================

-- 启用事件调度器
SET GLOBAL event_scheduler = ON;

-- 每小时清理过期订单
CREATE EVENT ev_clean_expired_orders
ON SCHEDULE EVERY 1 HOUR
DO
  CALL CleanExpiredOrders();

-- 每天更新价格历史
CREATE EVENT ev_update_price_history
ON SCHEDULE EVERY 1 DAY
STARTS '2024-12-21 00:00:00'
DO
  INSERT INTO price_history (id, currency, fiat_amount, token_amount, exchange_rate, price_ttl, created_at)
  SELECT 
    UUID(),
    'MATIC',
    1.00,
    0.5,
    0.5,
    UNIX_TIMESTAMP() + 300,
    NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM price_history 
    WHERE currency = 'MATIC' 
    AND DATE(created_at) = CURDATE()
  );

-- ==============================================
-- 9. 创建备份脚本
-- ==============================================

-- 创建备份存储过程
DELIMITER //
CREATE PROCEDURE BackupPaymentData(IN p_backup_date DATE)
BEGIN
    -- 创建备份表
    SET @backup_table = CONCAT('payment_orders_backup_', DATE_FORMAT(p_backup_date, '%Y%m%d'));
    SET @sql = CONCAT('CREATE TABLE ', @backup_table, ' AS SELECT * FROM payment_orders WHERE DATE(created_at) = ''', p_backup_date, '''');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    SELECT CONCAT('Backup created: ', @backup_table) as result;
END //
DELIMITER ;

-- ==============================================
-- 10. 权限设置
-- ==============================================

-- 创建应用用户
CREATE USER IF NOT EXISTS 'novelhub_payment'@'%' IDENTIFIED BY 'secure_password_123';
GRANT SELECT, INSERT, UPDATE, DELETE ON novelhub_payment.* TO 'novelhub_payment'@'%';
GRANT EXECUTE ON PROCEDURE novelhub_payment.CleanExpiredOrders TO 'novelhub_payment'@'%';
GRANT EXECUTE ON PROCEDURE novelhub_payment.GetUserPaymentStats TO 'novelhub_payment'@'%';
GRANT EXECUTE ON PROCEDURE novelhub_payment.GetPaymentStats TO 'novelhub_payment'@'%';
GRANT EXECUTE ON PROCEDURE novelhub_payment.BackupPaymentData TO 'novelhub_payment'@'%';

-- 创建只读用户
CREATE USER IF NOT EXISTS 'novelhub_readonly'@'%' IDENTIFIED BY 'readonly_password_123';
GRANT SELECT ON novelhub_payment.* TO 'novelhub_readonly'@'%';

FLUSH PRIVILEGES;
