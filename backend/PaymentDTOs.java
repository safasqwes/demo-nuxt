package com.novelhub.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 支付相关DTO类
 */

// 通用API响应类
@Data
@AllArgsConstructor
@NoArgsConstructor
class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private String error;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null, null);
    }

    public static <T> ApiResponse<T> error(String error) {
        return new ApiResponse<>(false, null, null, error);
    }
}

// 分页结果类
@Data
@AllArgsConstructor
@NoArgsConstructor
class PageResult<T> {
    private List<T> items;
    private int page;
    private int limit;
    private long total;
    private int totalPages;
}

// 产品相关DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
class ProductDTO {
    private String id;
    private String productId;
    private String name;
    private String description;
    private String productType;
    private BigDecimal fiatPrice;
    private String currency;
    private boolean isActive;
    private List<String> features;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// 价格相关DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
class PriceRequestDTO {
    @NotBlank(message = "Currency is required")
    private String currency;
    
    @NotNull(message = "Fiat amount is required")
    @DecimalMin(value = "0.01", message = "Fiat amount must be greater than 0")
    private BigDecimal fiatAmount;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class PriceInfoDTO {
    private String currency;
    private BigDecimal fiatAmount;
    private BigDecimal tokenAmount;
    private Long priceTTL;
    private BigDecimal exchangeRate;
    private BigDecimal gasEstimate;
    private LocalDateTime createdAt;
}

// 订单相关DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
class CreateOrderRequestDTO {
    @NotBlank(message = "Currency is required")
    private String currency;
    
    @NotNull(message = "Fiat amount is required")
    @DecimalMin(value = "0.01", message = "Fiat amount must be greater than 0")
    private BigDecimal fiatAmount;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Product type is required")
    private String productType;
    
    private String productId;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class OrderDTO {
    private String id;
    private String orderId;
    private String userId;
    private String productType;
    private String productId;
    private String currency;
    private BigDecimal fiatAmount;
    private BigDecimal tokenAmount;
    private String recipientAddress;
    private Long priceTTL;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime paidAt;
    private String description;
    private String transactionHash;
    private Integer confirmations;
}

// 支付验证相关DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
class VerifyPaymentRequestDTO {
    @NotBlank(message = "Order ID is required")
    private String orderId;
    
    @NotBlank(message = "Transaction hash is required")
    private String txHash;
    
    @NotBlank(message = "From address is required")
    private String fromAddress;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class VerifyPaymentResponseDTO {
    private boolean success;
    private boolean confirmed;
    private Integer confirmations;
    private Integer requiredConfirmations;
    private Long blockNumber;
    private String gasUsed;
    private String gasPrice;
    private String error;
}

// 交易相关DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
class TransactionDTO {
    private String id;
    private String orderId;
    private String txHash;
    private String fromAddress;
    private String toAddress;
    private BigDecimal amount;
    private String currency;
    private Long blockNumber;
    private Integer confirmations;
    private String gasUsed;
    private String gasPrice;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
}

// 网络状态DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
class NetworkStatusDTO {
    private Integer chainId;
    private String name;
    private Long blockHeight;
    private String gasPrice;
    private boolean isHealthy;
    private LocalDateTime lastChecked;
}

// 用户权益相关DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
class ActivateBenefitsRequestDTO {
    @NotBlank(message = "Order ID is required")
    private String orderId;
    
    @NotEmpty(message = "Benefits list cannot be empty")
    private List<String> benefits;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class UserBenefitDTO {
    private String id;
    private String userId;
    private String orderId;
    private String benefitType;
    private String benefitValue;
    private LocalDateTime expiresAt;
    private boolean isActive;
    private LocalDateTime createdAt;
}

// 退款相关DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
class RefundRequestDTO {
    @NotBlank(message = "Order ID is required")
    private String orderId;
    
    @NotBlank(message = "Reason is required")
    private String reason;
    
    private BigDecimal amount;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class RefundDTO {
    private String id;
    private String orderId;
    private String refundId;
    private String userId;
    private BigDecimal amount;
    private String currency;
    private String reason;
    private String status;
    private String txHash;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;
}

// 统计相关DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
class PaymentStatsDTO {
    private BigDecimal totalVolume;
    private BigDecimal totalFiatVolume;
    private Integer totalOrders;
    private Integer paidOrders;
    private Integer pendingOrders;
    private Integer expiredOrders;
    private BigDecimal averageOrderValue;
    private List<CurrencyStatsDTO> currencyStats;
    private List<DailyStatsDTO> dailyStats;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class CurrencyStatsDTO {
    private String currency;
    private BigDecimal totalAmount;
    private BigDecimal totalFiatAmount;
    private Integer orderCount;
    private BigDecimal averageAmount;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class DailyStatsDTO {
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime date;
    private Integer orderCount;
    private BigDecimal totalVolume;
    private BigDecimal totalFiatVolume;
}
