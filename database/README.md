# 链上支付系统数据库设计

## 📋 概述

本目录包含链上支付系统的完整数据库设计，包括表结构、模拟数据、存储过程、触发器等。

## 📁 文件结构

```
database/
├── payment_schema.sql      # 基础表结构定义
├── payment_mockdata.sql    # 模拟数据插入
├── payment_operations.sql  # 高级操作（存储过程、触发器、视图等）
└── README.md              # 本文档
```

## 🗄️ 数据库表结构

### 核心表

1. **payment_orders** - 支付订单表
   - 存储所有支付订单信息
   - 支持订阅、章节、积分等多种产品类型
   - 包含价格锁定机制

2. **payment_transactions** - 交易记录表
   - 存储区块链交易详情
   - 跟踪交易状态和确认数
   - 支持Gas费用记录

3. **user_benefits** - 用户权益表
   - 管理用户购买后的权益
   - 支持权益过期机制
   - 灵活的权益类型配置

### 配置表

4. **payment_products** - 产品表
   - 定义可购买的产品
   - 支持JSON格式的功能特性
   - 产品类型和价格管理

5. **token_configs** - 代币配置表
   - 支持的加密货币配置
   - 合约地址和精度信息
   - 网络链ID管理

6. **price_history** - 价格历史表
   - 记录历史价格信息
   - 用于价格分析和审计
   - 支持汇率追踪

### 管理表

7. **refund_records** - 退款记录表
   - 处理退款申请和状态
   - 支持链上退款交易
   - 退款原因和状态跟踪

8. **system_configs** - 系统配置表
   - 系统参数配置
   - 动态配置管理
   - 环境变量存储

## 🚀 快速开始

### 1. 创建数据库

```sql
-- 执行基础表结构
source payment_schema.sql;

-- 插入模拟数据
source payment_mockdata.sql;

-- 创建高级功能
source payment_operations.sql;
```

### 2. 验证安装

```sql
-- 检查表是否创建成功
SHOW TABLES;

-- 检查数据是否插入成功
SELECT COUNT(*) FROM payment_orders;
SELECT COUNT(*) FROM payment_products;
SELECT COUNT(*) FROM token_configs;
```

## 🔧 核心功能

### 订单管理

- **创建订单**: 支持多种产品类型和代币
- **价格锁定**: 防止价格波动风险
- **状态跟踪**: 完整的订单生命周期管理
- **自动过期**: 定时清理过期订单

### 支付验证

- **链上验证**: 验证区块链交易真实性
- **确认数检查**: 确保交易最终性
- **防重放**: 防止重复支付
- **参数验证**: 确保支付参数正确

### 权益管理

- **自动激活**: 支付成功后自动激活权益
- **过期管理**: 支持权益过期机制
- **类型灵活**: 支持多种权益类型
- **状态跟踪**: 实时权益状态管理

## 📊 数据示例

### 订单数据示例

```sql
-- 查看订单详情
SELECT 
    order_id,
    product_type,
    currency,
    fiat_amount,
    token_amount,
    status,
    created_at
FROM payment_orders
ORDER BY created_at DESC
LIMIT 10;
```

### 交易数据示例

```sql
-- 查看交易记录
SELECT 
    tx_hash,
    from_address,
    to_address,
    amount,
    currency,
    confirmations,
    status
FROM payment_transactions
ORDER BY created_at DESC
LIMIT 10;
```

## 🔒 安全特性

### 数据完整性

- **外键约束**: 确保数据关联完整性
- **唯一索引**: 防止重复数据
- **检查约束**: 确保数据有效性
- **触发器**: 自动维护数据一致性

### 访问控制

- **用户权限**: 分离读写权限
- **存储过程**: 封装敏感操作
- **视图**: 限制数据访问范围
- **审计日志**: 记录所有操作

## 📈 性能优化

### 索引策略

- **主键索引**: 所有表都有主键
- **外键索引**: 关联查询优化
- **复合索引**: 多条件查询优化
- **全文索引**: 文本搜索优化

### 分区策略

- **时间分区**: 按月份分区大表
- **范围分区**: 优化历史数据查询
- **自动分区**: 自动创建新分区

### 查询优化

- **存储过程**: 减少网络开销
- **视图**: 简化复杂查询
- **缓存**: 热点数据缓存
- **分页**: 大数据量分页查询

## 🔄 维护操作

### 定时任务

```sql
-- 清理过期订单
CALL CleanExpiredOrders();

-- 获取用户统计
CALL GetUserPaymentStats('user_123');

-- 获取支付统计
CALL GetPaymentStats('2024-12-01', '2024-12-31');
```

### 数据备份

```sql
-- 创建数据备份
CALL BackupPaymentData('2024-12-21');
```

### 监控查询

```sql
-- 查看系统状态
SELECT 
    (SELECT COUNT(*) FROM payment_orders WHERE status = 'pending') as pending_orders,
    (SELECT COUNT(*) FROM payment_orders WHERE status = 'paid') as paid_orders,
    (SELECT COUNT(*) FROM payment_transactions WHERE status = 'pending') as pending_transactions;

-- 查看性能统计
SHOW TABLE STATUS WHERE Name LIKE 'payment_%';
```

## 🛠️ 开发指南

### 添加新产品类型

1. 在 `payment_products` 表中添加产品
2. 更新 `product_type` 枚举值
3. 配置产品特性和价格

### 添加新代币

1. 在 `token_configs` 表中添加代币配置
2. 更新前端支持的代币列表
3. 配置价格API集成

### 自定义权益类型

1. 在 `user_benefits` 表中添加权益记录
2. 实现权益激活逻辑
3. 配置权益过期机制

## 📞 技术支持

如有问题或建议，请联系开发团队：

- **数据库设计**: 确保数据模型符合业务需求
- **性能优化**: 根据实际使用情况调整索引和分区
- **安全加固**: 定期审查权限和访问控制
- **监控告警**: 设置关键指标监控和告警

## 📝 更新日志

- **2024-12-21**: 初始版本，包含完整的支付系统表结构
- **未来版本**: 根据业务需求持续优化和扩展

---

**注意**: 在生产环境部署前，请确保：
1. 修改默认密码
2. 配置适当的权限
3. 设置监控和告警
4. 进行充分的测试
