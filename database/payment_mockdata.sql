-- 链上支付系统模拟数据
-- 创建时间: 2024-12-21

-- 1. 插入代币配置数据
INSERT INTO token_configs (id, symbol, name, address, decimals, chain_id, is_native, is_active) VALUES
('token_001', 'MATIC', 'Polygon', '0x0000000000000000000000000000000000000000', 18, 137, TRUE, TRUE),
('token_002', 'USDT', 'Tether USD', '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 137, FALSE, TRUE),
('token_003', 'USDC', 'USD Coin', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 137, FALSE, TRUE),
('token_004', 'DAI', 'Dai Stablecoin', '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 137, FALSE, TRUE);

-- 2. 插入产品数据
INSERT INTO payment_products (id, product_id, name, description, product_type, fiat_price, currency, is_active, features) VALUES
('prod_001', 'sub-monthly', 'Monthly Premium', 'Access to all premium content and features for one month', 'subscription', 9.99, 'USD', TRUE, '["unlimited_access", "ad_free", "offline_reading", "priority_support"]'),
('prod_002', 'sub-yearly', 'Yearly Premium', 'Best value - 12 months of premium access with 20% discount', 'subscription', 99.99, 'USD', TRUE, '["unlimited_access", "ad_free", "offline_reading", "priority_support", "exclusive_content", "early_access"]'),
('prod_003', 'chapter-001', 'Chapter 1: The Beginning', 'First chapter of the epic fantasy novel "Dragon\'s Quest"', 'chapter', 2.99, 'USD', TRUE, '["high_quality", "offline_reading", "bookmark_support"]'),
('prod_004', 'chapter-002', 'Chapter 2: The Journey', 'Second chapter of the epic fantasy novel "Dragon\'s Quest"', 'chapter', 2.99, 'USD', TRUE, '["high_quality", "offline_reading", "bookmark_support"]'),
('prod_005', 'coins-100', '100 Silver Coins', 'Purchase additional reading coins for premium content', 'coins', 4.99, 'USD', TRUE, '["instant_delivery", "no_expiry", "transferable"]'),
('prod_006', 'coins-500', '500 Silver Coins', 'Bulk purchase of reading coins with 10% bonus', 'coins', 19.99, 'USD', TRUE, '["instant_delivery", "no_expiry", "transferable", "bonus_coins"]'),
('prod_007', 'coins-1000', '1000 Silver Coins', 'Large pack of reading coins with 20% bonus', 'coins', 39.99, 'USD', TRUE, '["instant_delivery", "no_expiry", "transferable", "bonus_coins", "vip_support"]');

-- 3. 插入系统配置数据
INSERT INTO system_configs (id, config_key, config_value, description) VALUES
('config_001', 'payment.recipient_address', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'Main payment recipient address'),
('config_002', 'payment.price_ttl', '300', 'Price lock time in seconds (5 minutes)'),
('config_003', 'payment.required_confirmations', '3', 'Required blockchain confirmations for payment'),
('config_004', 'payment.gas_limit', '21000', 'Default gas limit for transactions'),
('config_005', 'payment.max_price_age', '600', 'Maximum price age in seconds (10 minutes)'),
('config_006', 'payment.auto_expire_minutes', '15', 'Auto expire pending orders after minutes'),
('config_007', 'exchange.polygon_rpc', 'https://polygon-rpc.com', 'Polygon RPC endpoint'),
('config_008', 'exchange.price_api', 'https://api.coingecko.com/api/v3', 'Price API endpoint');

-- 4. 插入模拟订单数据
INSERT INTO payment_orders (id, order_id, user_id, product_type, product_id, currency, fiat_amount, token_amount, recipient_address, price_ttl, status, created_at, expires_at, description) VALUES
('order_001', 'ord_20241221_001', 'user_123', 'subscription', 'sub-monthly', 'MATIC', 9.99, 5.234, '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 1703123456, 'paid', '2024-12-21 10:30:00', '2024-12-21 10:35:00', 'Monthly Premium Subscription'),
('order_002', 'ord_20241221_002', 'user_456', 'chapter', 'chapter-001', 'USDT', 2.99, 2.99, '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 1703124000, 'paid', '2024-12-21 11:00:00', '2024-12-21 11:05:00', 'Chapter 1: The Beginning'),
('order_003', 'ord_20241221_003', 'user_789', 'coins', 'coins-100', 'USDC', 4.99, 4.99, '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 1703125000, 'pending', '2024-12-21 12:00:00', '2024-12-21 12:15:00', '100 Silver Coins'),
('order_004', 'ord_20241221_004', 'user_123', 'subscription', 'sub-yearly', 'MATIC', 99.99, 52.34, '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 1703126000, 'expired', '2024-12-21 13:00:00', '2024-12-21 13:15:00', 'Yearly Premium Subscription'),
('order_005', 'ord_20241221_005', 'user_456', 'chapter', 'chapter-002', 'DAI', 2.99, 2.99, '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 1703127000, 'cancelled', '2024-12-21 14:00:00', '2024-12-21 14:15:00', 'Chapter 2: The Journey');

-- 5. 插入交易记录数据
INSERT INTO payment_transactions (id, order_id, tx_hash, from_address, to_address, amount, currency, block_number, confirmations, gas_used, gas_price, status, created_at, confirmed_at) VALUES
('tx_001', 'ord_20241221_001', '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', '0x1234567890abcdef1234567890abcdef12345678', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 5.234, 'MATIC', 12345678, 12, '21000', '20000000000', 'confirmed', '2024-12-21 10:32:00', '2024-12-21 10:35:00'),
('tx_002', 'ord_20241221_002', '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', '0xabcdef1234567890abcdef1234567890abcdef12', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 2.99, 'USDT', 12345680, 8, '65000', '20000000000', 'confirmed', '2024-12-21 11:02:00', '2024-12-21 11:05:00'),
('tx_003', 'ord_20241221_003', '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba', '0xfedcba9876543210fedcba9876543210fedcba98', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 4.99, 'USDC', 12345685, 2, '65000', '20000000000', 'pending', '2024-12-21 12:05:00', NULL);

-- 6. 插入用户权益数据
INSERT INTO user_benefits (id, user_id, order_id, benefit_type, benefit_value, expires_at, is_active, created_at) VALUES
('benefit_001', 'user_123', 'ord_20241221_001', 'premium_access', '{"level": "monthly", "features": ["unlimited_access", "ad_free"]}', '2025-01-21 10:30:00', TRUE, '2024-12-21 10:35:00'),
('benefit_002', 'user_456', 'ord_20241221_002', 'chapter_access', '{"chapter_id": "chapter-001", "novel_id": "dragon_quest"}', NULL, TRUE, '2024-12-21 11:05:00'),
('benefit_003', 'user_123', 'ord_20241221_001', 'offline_reading', '{"enabled": true, "chapters": ["chapter-001"]}', '2025-01-21 10:30:00', TRUE, '2024-12-21 10:35:00'),
('benefit_004', 'user_123', 'ord_20241221_001', 'priority_support', '{"level": "premium", "response_time": "2h"}', '2025-01-21 10:30:00', TRUE, '2024-12-21 10:35:00');

-- 7. 插入价格历史数据
INSERT INTO price_history (id, currency, fiat_amount, token_amount, exchange_rate, price_ttl, created_at) VALUES
('price_001', 'MATIC', 9.99, 5.234, 0.5234, 1703123456, '2024-12-21 10:30:00'),
('price_002', 'USDT', 2.99, 2.99, 1.0000, 1703124000, '2024-12-21 11:00:00'),
('price_003', 'USDC', 4.99, 4.99, 1.0000, 1703125000, '2024-12-21 12:00:00'),
('price_004', 'MATIC', 99.99, 52.34, 0.5234, 1703126000, '2024-12-21 13:00:00'),
('price_005', 'DAI', 2.99, 2.99, 1.0000, 1703127000, '2024-12-21 14:00:00');

-- 8. 插入退款记录数据
INSERT INTO refund_records (id, order_id, refund_id, user_id, amount, currency, reason, status, created_at) VALUES
('refund_001', 'ord_20241221_004', 'ref_20241221_001', 'user_123', 52.34, 'MATIC', 'order_expired', 'processed', '2024-12-21 13:20:00'),
('refund_002', 'ord_20241221_005', 'ref_20241221_002', 'user_456', 2.99, 'DAI', 'user_cancelled', 'pending', '2024-12-21 14:10:00');

-- 9. 插入一些测试用户数据（如果需要）
INSERT INTO users (id, username, email, wallet_address, created_at) VALUES
('user_123', 'alice_crypto', 'alice@example.com', '0x1234567890abcdef1234567890abcdef12345678', '2024-12-01 10:00:00'),
('user_456', 'bob_trader', 'bob@example.com', '0xabcdef1234567890abcdef1234567890abcdef12', '2024-12-05 14:30:00'),
('user_789', 'charlie_reader', 'charlie@example.com', '0xfedcba9876543210fedcba9876543210fedcba98', '2024-12-10 09:15:00');

-- 10. 插入一些系统日志数据
INSERT INTO system_logs (id, level, message, context, created_at) VALUES
('log_001', 'INFO', 'Order created successfully', '{"order_id": "ord_20241221_001", "user_id": "user_123"}', '2024-12-21 10:30:00'),
('log_002', 'INFO', 'Payment confirmed', '{"order_id": "ord_20241221_001", "tx_hash": "0xabcdef1234567890..."}', '2024-12-21 10:35:00'),
('log_003', 'WARN', 'Order expired', '{"order_id": "ord_20241221_004", "reason": "timeout"}', '2024-12-21 13:20:00'),
('log_004', 'ERROR', 'Payment verification failed', '{"order_id": "ord_20241221_005", "error": "insufficient_confirmations"}', '2024-12-21 14:05:00');
