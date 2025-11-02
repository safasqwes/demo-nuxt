package com.example.payment.controller;

import com.example.payment.dto.CreateCheckoutSessionRequest;
import com.example.payment.dto.CreateCheckoutSessionResponse;
import com.example.payment.service.StripePaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Stripe 支付控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/stripe")
@RequiredArgsConstructor
public class StripeController {

    private final StripePaymentService stripePaymentService;

    /**
     * 创建 Stripe Checkout Session
     *
     * @param request 创建请求
     * @return Checkout Session 信息
     */
    @PostMapping("/create-checkout-session")
    public ResponseEntity<CreateCheckoutSessionResponse> createCheckoutSession(
            @RequestBody CreateCheckoutSessionRequest request,
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        try {
            log.info("Creating Stripe Checkout Session for planId: {}", request.getPlanId());

            // 从 token 中获取用户 ID（实际项目中需要实现）
            Long userId = getUserIdFromToken(authToken);

            CreateCheckoutSessionResponse response = stripePaymentService.createCheckoutSession(
                request.getPlanId(),
                userId,
                request.getSuccessUrl(),
                request.getCancelUrl()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to create Stripe Checkout Session", e);
            return ResponseEntity.badRequest()
                .body(CreateCheckoutSessionResponse.builder()
                    .success(false)
                    .error(e.getMessage())
                    .build());
        }
    }

    /**
     * 从 token 中获取用户 ID（示例实现）
     */
    private Long getUserIdFromToken(String authToken) {
        // TODO: 实现实际的 token 解析逻辑
        // 这里仅作示例，实际项目中应该使用 JWT 解析或 Session 管理
        if (authToken != null && authToken.startsWith("Bearer ")) {
            // 解析 JWT token 获取用户 ID
            return 1L; // 示例返回
        }
        throw new RuntimeException("User not authenticated");
    }
}
