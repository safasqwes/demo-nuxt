package com.example.payment.dto;

import lombok.Data;

/**
 * 创建 Stripe Checkout Session 请求
 */
@Data
public class CreateCheckoutSessionRequest {
    /**
     * 套餐 ID
     */
    private Long planId;

    /**
     * 成功回调 URL
     */
    private String successUrl;

    /**
     * 取消回调 URL
     */
    private String cancelUrl;
}
