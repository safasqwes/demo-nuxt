package com.example.payment.service;

import com.example.payment.dto.CreateCheckoutSessionResponse;
import com.example.payment.entity.Order;
import com.example.payment.entity.Payment;
import com.example.payment.entity.Plan;
import com.example.payment.repository.OrderRepository;
import com.example.payment.repository.PaymentRepository;
import com.example.payment.repository.PlanRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Stripe 支付服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StripePaymentService {

    private final PlanRepository planRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Value("${stripe.api.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    /**
     * 创建 Stripe Checkout Session
     *
     * @param planId 套餐 ID
     * @param userId 用户 ID
     * @param successUrl 成功回调 URL
     * @param cancelUrl 取消回调 URL
     * @return Checkout Session 响应
     */
    @Transactional
    public CreateCheckoutSessionResponse createCheckoutSession(
            Long planId,
            Long userId,
            String successUrl,
            String cancelUrl) {

        try {
            // 初始化 Stripe API Key
            Stripe.apiKey = stripeSecretKey;

            // 查询套餐信息
            Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

            // 创建订单
            Order order = createOrder(userId, plan);

            // 创建支付记录
            Payment payment = createPayment(order);

            // 构建 Checkout Session 参数
            SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(
                    SessionCreateParams.LineItem.builder()
                        .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount(plan.getPrice()) // 金额（分）
                                .setProductData(
                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(plan.getName())
                                        .setDescription(plan.getDescription())
                                        .build()
                                )
                                .build()
                        )
                        .setQuantity(1L)
                        .build()
                )
                // 在 metadata 中存储订单和支付信息，用于 Webhook 处理
                .putMetadata("orderId", order.getOrderId().toString())
                .putMetadata("paymentId", payment.getPaymentId().toString())
                .putMetadata("userId", userId.toString())
                .putMetadata("planId", planId.toString())
                .setClientReferenceId(order.getOrderNumber())
                .build();

            // 创建 Stripe Checkout Session
            Session session = Session.create(params);

            // 更新支付记录，保存 Stripe Session ID
            payment.setStripeSessionId(session.getId());
            paymentRepository.save(payment);

            log.info("Stripe Checkout Session created: sessionId={}, orderId={}, paymentId={}",
                session.getId(), order.getOrderId(), payment.getPaymentId());

            return CreateCheckoutSessionResponse.builder()
                .success(true)
                .sessionId(session.getId())
                .sessionUrl(session.getUrl())
                .build();

        } catch (StripeException e) {
            log.error("Stripe API error", e);
            throw new RuntimeException("Failed to create Stripe Checkout Session: " + e.getMessage());
        } catch (Exception e) {
            log.error("Failed to create checkout session", e);
            throw new RuntimeException("Failed to create checkout session: " + e.getMessage());
        }
    }

    /**
     * 创建订单
     */
    private Order createOrder(Long userId, Plan plan) {
        Order order = new Order();
        order.setUserId(userId);
        order.setPlanId(plan.getPlanId());
        order.setPlanName(plan.getName());
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase());
        order.setAmount(plan.getPrice());
        order.setCurrency("USD");
        order.setPoints(plan.getPointsAmount());
        order.setStatus(0); // 待支付
        order.setOrderType(plan.getPlanType());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    /**
     * 创建支付记录
     */
    private Payment createPayment(Order order) {
        Payment payment = new Payment();
        payment.setOrderId(order.getOrderId());
        payment.setUserId(order.getUserId());
        payment.setPaymentNumber("PAY-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase());
        payment.setPaymentMethod("STRIPE");
        payment.setAmount(order.getAmount());
        payment.setCurrency(order.getCurrency());
        payment.setStatus(0); // 待支付
        payment.setExpiresAt(LocalDateTime.now().plusHours(24)); // 24小时后过期
        payment.setCreatedAt(LocalDateTime.now());

        return paymentRepository.save(payment);
    }
}
