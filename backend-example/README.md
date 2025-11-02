# Stripe 支付集成指南

## 项目概述

这是一个完整的 Stripe 支付集成示例，包含前端（Nuxt 4）和后端（Spring Boot）代码。

## 功能特性

- ✅ 支持 Stripe 信用卡支付
- ✅ 支持 Web3 加密货币支付
- ✅ Stripe Checkout Session 创建
- ✅ Stripe Webhook 签名验证
- ✅ 支付成功自动更新订单状态和用户积分
- ✅ 支付失败、过期、退款处理

---

## 前端集成 (Nuxt 4)

### 1. 安装依赖

前端不需要安装 Stripe.js（后端处理），但需要确保 HTTP 客户端配置正确。

### 2. 文件结构

```
utils/
  ├── stripeService.ts       # Stripe 支付服务
  ├── paymentService.ts      # 通用支付服务
  └── http.ts                # HTTP 客户端

types/
  └── payment.ts             # 类型定义

pages/
  ├── payment.vue            # 支付页面（支持双支付方式）
  └── payment-success.vue    # 支付成功页面
```

### 3. 使用方法

#### 从价格页面跳转到支付页面

```typescript
// 在价格页面选择套餐后跳转
router.push({
  path: '/payment',
  query: {
    planId: plan.planId,
    method: 'stripe'  // 或 'web3'
  }
})
```

#### 支付流程

1. 用户选择套餐并跳转到 `/payment?planId=1&method=stripe`
2. 前端调用 `/api/stripe/create-checkout-session` 创建 Checkout Session
3. 前端跳转到 Stripe Checkout 页面
4. 用户完成支付
5. Stripe 发送 Webhook 到后端
6. 后端验证签名并更新订单状态
7. 用户跳转回 `/payment-success`

---

## 后端集成 (Spring Boot)

### 1. 添加 Maven 依赖

在 `pom.xml` 中添加 Stripe Java SDK：

```xml
<dependency>
    <groupId>com.stripe</groupId>
    <artifactId>stripe-java</artifactId>
    <version>24.16.0</version>
</dependency>
```

### 2. 配置文件

在 `application.properties` 中配置 Stripe：

```properties
# Stripe API Secret Key
stripe.api.secret-key=sk_test_your_secret_key_here

# Stripe Webhook Secret
stripe.webhook.secret=whsec_your_webhook_secret_here
```

### 3. 获取 Stripe 密钥

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 在 **Developers > API keys** 获取 `Secret key`
3. 在 **Developers > Webhooks** 创建 Webhook 端点：
   - URL: `https://your-domain.com/api/stripe/webhook`
   - 选择事件：
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
4. 获取 `Signing secret`（whsec_xxx）

### 4. 文件结构

```
controller/
  ├── StripeController.java           # Stripe 支付接口
  └── StripeWebhookController.java    # Webhook 接收接口

service/
  ├── StripePaymentService.java       # Stripe 支付业务逻辑
  └── StripeWebhookService.java       # Webhook 事件处理

dto/
  ├── CreateCheckoutSessionRequest.java
  └── CreateCheckoutSessionResponse.java

repository/
  ├── OrderRepository.java
  ├── PaymentRepository.java
  ├── PlanRepository.java
  └── UserRepository.java
```

### 5. 重要说明

#### Webhook 签名验证

Webhook 端点必须验证 Stripe 签名以防止伪造请求：

```java
Event event = Webhook.constructEvent(
    payload,           // 原始请求体（String）
    sigHeader,         // Stripe-Signature 头部
    webhookSecret      // Webhook Secret
);
```

⚠️ **注意**：
- 必须使用**原始请求体**（String），不能使用解析后的 JSON 对象
- Spring Boot 中使用 `@RequestBody String payload` 接收原始数据

#### 数据库事务

所有 Webhook 处理方法都使用 `@Transactional` 确保数据一致性：

```java
@Transactional
public void handleCheckoutSessionCompleted(Event event) {
    // 1. 更新支付记录
    // 2. 更新订单状态
    // 3. 增加用户积分
    // 以上操作要么全部成功，要么全部回滚
}
```

#### 幂等性处理

防止 Webhook 重复处理（Stripe 可能重发 Webhook）：

```java
// 检查订单状态，避免重复处理
if (order.getStatus() == 1) {
    log.warn("Order already paid: orderId={}", orderId);
    return;
}
```

---

## 测试指南

### 1. 测试卡号

Stripe 提供测试卡号用于开发环境测试：

| 卡号 | 场景 |
|------|------|
| `4242 4242 4242 4242` | 成功支付 |
| `4000 0000 0000 0002` | 支付被拒绝 |
| `4000 0025 0000 3155` | 需要 3D 验证 |

- **过期日期**：任意未来日期（如 12/34）
- **CVC**：任意 3 位数字（如 123）
- **邮编**：任意 5 位数字（如 12345）

### 2. 本地测试 Webhook

使用 Stripe CLI 转发 Webhook 到本地：

```bash
# 安装 Stripe CLI
# https://stripe.com/docs/stripe-cli

# 登录
stripe login

# 转发 Webhook 到本地
stripe listen --forward-to localhost:8080/api/stripe/webhook

# 触发测试事件
stripe trigger checkout.session.completed
```

### 3. 端到端测试流程

1. 启动后端服务（Spring Boot）
2. 启动前端服务（Nuxt）
3. 访问 `http://localhost:3000/payment?planId=1&method=stripe`
4. 点击 "Pay with Stripe"
5. 在 Stripe Checkout 页面输入测试卡号
6. 完成支付
7. 检查数据库订单状态、支付记录、用户积分是否正确更新
8. 检查后端日志是否收到 Webhook 事件

---

## API 接口文档

### 1. 创建 Checkout Session

**请求：**
```http
POST /api/stripe/create-checkout-session
Content-Type: application/json
Authorization: Bearer <token>

{
  "planId": 1,
  "successUrl": "https://example.com/payment-success?session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://example.com/payment?planId=1&method=stripe"
}
```

**响应：**
```json
{
  "success": true,
  "sessionId": "cs_test_xxx",
  "sessionUrl": "https://checkout.stripe.com/c/pay/cs_test_xxx"
}
```

### 2. Webhook 端点

**请求：**
```http
POST /api/stripe/webhook
Content-Type: application/json
Stripe-Signature: t=1234567890,v1=xxx

{
  "id": "evt_xxx",
  "type": "checkout.session.completed",
  "data": {
    "object": { ... }
  }
}
```

**响应：**
```
200 OK
Webhook handled successfully
```

---

## 安全建议

1. **生产环境配置**：
   - 使用正式的 Stripe API 密钥（sk_live_xxx）
   - 启用 HTTPS（Stripe Webhook 要求）
   - 配置 CORS 白名单

2. **密钥管理**：
   - 不要将密钥提交到 Git
   - 使用环境变量或密钥管理服务
   - 定期轮换密钥

3. **错误处理**：
   - Webhook 处理失败时返回 500（Stripe 会自动重试）
   - 记录所有错误日志
   - 设置异常监控和告警

4. **数据验证**：
   - 验证 Webhook 签名
   - 验证金额和订单信息
   - 防止重复处理

---

## 常见问题

### Q1: Webhook 签名验证失败？

**原因**：请求体不是原始 JSON 字符串

**解决**：使用 `@RequestBody String payload` 而不是对象

### Q2: Stripe Checkout 跳转后无法返回？

**原因**：successUrl 和 cancelUrl 配置错误

**解决**：使用完整的 URL（包含协议和域名）

### Q3: 本地开发无法接收 Webhook？

**原因**：Stripe 无法访问 localhost

**解决**：使用 Stripe CLI 转发或部署到公网

### Q4: 订单重复支付？

**原因**：Webhook 重复发送，未做幂等性处理

**解决**：检查订单状态，避免重复处理

---

## 生产环境部署清单

- [ ] 替换为正式 API 密钥（sk_live_xxx）
- [ ] 配置 HTTPS
- [ ] 创建生产环境 Webhook 端点
- [ ] 配置 Webhook 重试策略
- [ ] 设置错误监控和告警
- [ ] 测试支付成功、失败、退款流程
- [ ] 配置备份和容灾
- [ ] 审查安全配置

---

## 参考资料

- [Stripe API 文档](https://stripe.com/docs/api)
- [Stripe Checkout 文档](https://stripe.com/docs/payments/checkout)
- [Stripe Webhook 文档](https://stripe.com/docs/webhooks)
- [Stripe Java SDK](https://github.com/stripe/stripe-java)
- [Stripe 测试卡号](https://stripe.com/docs/testing)

---

## 联系支持

如有问题，请联系：
- 技术支持：support@example.com
- Stripe 官方支持：https://support.stripe.com
