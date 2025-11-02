package com.example.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 创建 Stripe Checkout Session 响应
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCheckoutSessionResponse {
    /**
     * 是否成功
     */
    private Boolean success;

    /**
     * Stripe Session ID
     */
    private String sessionId;

    /**
     * Stripe Checkout URL
     */
    private String sessionUrl;

    /**
     * 错误信息
     */
    private String error;
}
