package com.example.payment.repository;

import com.example.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 支付记录 Repository
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * 根据 Stripe Session ID 查询支付记录
     */
    Optional<Payment> findByStripeSessionId(String stripeSessionId);

    /**
     * 根据 Stripe Payment Intent ID 查询支付记录
     */
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);

    /**
     * 根据支付编号查询支付记录
     */
    Optional<Payment> findByPaymentNumber(String paymentNumber);

    /**
     * 根据订单 ID 查询支付记录
     */
    Optional<Payment> findByOrderId(Long orderId);
}
