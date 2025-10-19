-- 链上支付系统数据库表结构
-- 创建时间: 2024-12-21

-- 1. 订单表
CREATE TABLE payment_orders (
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
);

-- 2. 交易记录表
CREATE TABLE payment_transactions (
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
);

-- 3. 用户权益表
CREATE TABLE user_benefits (
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
);

-- 4. 产品表
CREATE TABLE payment_products (
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
);

-- 5. 代币配置表
CREATE TABLE token_configs (
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
);

-- 6. 价格历史表
CREATE TABLE price_history (
    id VARCHAR(36) PRIMARY KEY,
    currency VARCHAR(10) NOT NULL,
    fiat_amount DECIMAL(10,2) NOT NULL,
    token_amount DECIMAL(20,8) NOT NULL,
    exchange_rate DECIMAL(20,8) NOT NULL,
    price_ttl BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_currency (currency),
    INDEX idx_created_at (created_at)
);

-- 7. 退款记录表
CREATE TABLE refund_records (
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
);

-- 8. 系统配置表
CREATE TABLE system_configs (
    id VARCHAR(36) PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_config_key (config_key)
);
