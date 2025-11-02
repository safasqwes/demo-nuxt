package com.example.payment.controller;

import com.example.payment.dto.CreateBinancePayOrderRequest;
import com.example.payment.dto.CreateBinancePayOrderResponse;
import com.example.payment.service.BinancePayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Binance Pay 支付控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/binance-pay")
@RequiredArgsConstructor
public class BinancePayController {

    private final BinancePayService binancePayService;

    /**
     * 创建 Binance Pay 订单（生成二维码）
     *
     * @param request 创建请求
     * @return 订单信息（包含二维码）
     */
    @PostMapping("/create-order")
    public ResponseEntity<CreateBinancePayOrderResponse> createOrder(
            @RequestBody CreateBinancePayOrderRequest request,
            @RequestHeader(value = "Authorization", required = false) String authToken) {

        try {
            log.info("Creating Binance Pay order for planId: {}", request.getPlanId());

            // 从 token 中获取用户 ID
            Long userId = getUserIdFromToken(authToken);

            CreateBinancePayOrderResponse response = binancePayService.createOrder(
                request.getPlanId(),
                userId,
                request.getReturnUrl(),
                request.getCancelUrl()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to create Binance Pay order", e);
            return ResponseEntity.badRequest()
                .body(CreateBinancePayOrderResponse.builder()
                    .success(false)
                    .error(e.getMessage())
                    .build());
        }
    }

    /**
     * 查询 Binance Pay 订单状态
     *
     * @param prepayId Binance Pay 订单 ID
     * @return 订单状态
     */
    @GetMapping("/order-status/{prepayId}")
    public ResponseEntity<?> queryOrderStatus(@PathVariable String prepayId) {
        try {
            log.info("Querying Binance Pay order status: prepayId={}", prepayId);

            var status = binancePayService.queryOrderStatus(prepayId);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "status", status
            ));

        } catch (Exception e) {
            log.error("Failed to query Binance Pay order status", e);
            return ResponseEntity.badRequest()
                .body(Map.of(
                    "success", false,
                    "error", e.getMessage()
                ));
        }
    }

    /**
     * 从 token 中获取用户 ID（示例实现）
     */
    private Long getUserIdFromToken(String authToken) {
        // TODO: 实现实际的 token 解析逻辑
        if (authToken != null && authToken.startsWith("Bearer ")) {
            return 1L; // 示例返回
        }
        throw new RuntimeException("User not authenticated");
    }
}
