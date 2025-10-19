package com.novelhub.controller;

import com.novelhub.dto.*;
import com.novelhub.service.PaymentService;
import com.novelhub.service.PriceService;
import com.novelhub.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 链上支付控制器
 * 处理所有与支付相关的API请求
 */
@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PriceService priceService;

    @Autowired
    private ProductService productService;

    /**
     * 获取产品列表
     */
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getProducts(
            @RequestParam(required = false) String type,
            @RequestParam(required = false, defaultValue = "true") Boolean active) {
        try {
            List<ProductDTO> products = productService.getProducts(type, active);
            return ResponseEntity.ok(ApiResponse.success(products));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch products: " + e.getMessage()));
        }
    }

    /**
     * 获取产品详情
     */
    @GetMapping("/products/{productId}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProduct(@PathVariable String productId) {
        try {
            ProductDTO product = productService.getProductById(productId);
            if (product == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(ApiResponse.success(product));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch product: " + e.getMessage()));
        }
    }

    /**
     * 获取代币价格
     */
    @PostMapping("/price")
    public ResponseEntity<ApiResponse<PriceInfoDTO>> getTokenPrice(@Valid @RequestBody PriceRequestDTO request) {
        try {
            PriceInfoDTO priceInfo = priceService.getTokenPrice(request.getCurrency(), request.getFiatAmount());
            return ResponseEntity.ok(ApiResponse.success(priceInfo));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get token price: " + e.getMessage()));
        }
    }

    /**
     * 创建支付订单
     */
    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
            @Valid @RequestBody CreateOrderRequestDTO request,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = extractUserIdFromToken(token);
            OrderDTO order = paymentService.createOrder(request, userId);
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create order: " + e.getMessage()));
        }
    }

    /**
     * 获取订单状态
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderStatus(
            @PathVariable String orderId,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = extractUserIdFromToken(token);
            OrderDTO order = paymentService.getOrderById(orderId, userId);
            if (order == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get order status: " + e.getMessage()));
        }
    }

    /**
     * 获取用户订单历史
     */
    @GetMapping("/orders/history")
    public ResponseEntity<ApiResponse<PageResult<OrderDTO>>> getOrderHistory(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String status) {
        try {
            String userId = extractUserIdFromToken(token);
            PageResult<OrderDTO> orders = paymentService.getUserOrderHistory(userId, page, limit, status);
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get order history: " + e.getMessage()));
        }
    }

    /**
     * 验证支付
     */
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<VerifyPaymentResponseDTO>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequestDTO request,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = extractUserIdFromToken(token);
            VerifyPaymentResponseDTO result = paymentService.verifyPayment(request, userId);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to verify payment: " + e.getMessage()));
        }
    }

    /**
     * 获取交易详情
     */
    @GetMapping("/transactions/{txHash}")
    public ResponseEntity<ApiResponse<TransactionDTO>> getTransaction(@PathVariable String txHash) {
        try {
            TransactionDTO transaction = paymentService.getTransactionByHash(txHash);
            if (transaction == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(ApiResponse.success(transaction));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get transaction: " + e.getMessage()));
        }
    }

    /**
     * 获取网络状态
     */
    @GetMapping("/network/status")
    public ResponseEntity<ApiResponse<NetworkStatusDTO>> getNetworkStatus() {
        try {
            NetworkStatusDTO status = paymentService.getNetworkStatus();
            return ResponseEntity.ok(ApiResponse.success(status));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get network status: " + e.getMessage()));
        }
    }

    /**
     * 激活用户权益
     */
    @PostMapping("/activate-benefits")
    public ResponseEntity<ApiResponse<String>> activateBenefits(
            @Valid @RequestBody ActivateBenefitsRequestDTO request,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = extractUserIdFromToken(token);
            paymentService.activateUserBenefits(request.getOrderId(), request.getBenefits(), userId);
            return ResponseEntity.ok(ApiResponse.success("Benefits activated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to activate benefits: " + e.getMessage()));
        }
    }

    /**
     * 获取用户权益状态
     */
    @GetMapping("/user/benefits")
    public ResponseEntity<ApiResponse<List<UserBenefitDTO>>> getUserBenefits(
            @RequestHeader("Authorization") String token) {
        try {
            String userId = extractUserIdFromToken(token);
            List<UserBenefitDTO> benefits = paymentService.getUserBenefits(userId);
            return ResponseEntity.ok(ApiResponse.success(benefits));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get user benefits: " + e.getMessage()));
        }
    }

    /**
     * 申请退款
     */
    @PostMapping("/refund")
    public ResponseEntity<ApiResponse<RefundDTO>> requestRefund(
            @Valid @RequestBody RefundRequestDTO request,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = extractUserIdFromToken(token);
            RefundDTO refund = paymentService.requestRefund(request, userId);
            return ResponseEntity.ok(ApiResponse.success(refund));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to request refund: " + e.getMessage()));
        }
    }

    /**
     * 获取支付统计（管理员）
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<PaymentStatsDTO>> getPaymentStats(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            // 验证管理员权限
            validateAdminToken(token);
            PaymentStatsDTO stats = paymentService.getPaymentStats(startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get payment stats: " + e.getMessage()));
        }
    }

    /**
     * 导出交易记录（管理员）
     */
    @GetMapping("/export/transactions")
    public ResponseEntity<byte[]> exportTransactions(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "csv") String format,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            // 验证管理员权限
            validateAdminToken(token);
            byte[] data = paymentService.exportTransactions(format, startDate, endDate);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/octet-stream")
                    .header("Content-Disposition", "attachment; filename=transactions." + format)
                    .body(data);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 从JWT token中提取用户ID
     */
    private String extractUserIdFromToken(String token) {
        // 实现JWT解析逻辑
        // 这里简化处理，实际应该使用JWT工具类
        return "user_123"; // 临时返回固定值
    }

    /**
     * 验证管理员权限
     */
    private void validateAdminToken(String token) {
        // 实现管理员权限验证逻辑
        // 这里简化处理
    }
}
