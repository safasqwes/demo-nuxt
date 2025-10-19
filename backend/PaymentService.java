package com.novelhub.service;

import com.novelhub.dto.*;
import com.novelhub.entity.PaymentOrder;
import com.novelhub.entity.PaymentTransaction;
import com.novelhub.entity.UserBenefit;
import com.novelhub.mapper.PaymentOrderMapper;
import com.novelhub.mapper.PaymentTransactionMapper;
import com.novelhub.mapper.UserBenefitMapper;
import com.novelhub.utils.BlockchainUtils;
import com.novelhub.utils.PriceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 支付服务实现类
 * 处理所有支付相关的业务逻辑
 */
@Service
public class PaymentService {

    @Autowired
    private PaymentOrderMapper paymentOrderMapper;

    @Autowired
    private PaymentTransactionMapper paymentTransactionMapper;

    @Autowired
    private UserBenefitMapper userBenefitMapper;

    @Autowired
    private PriceService priceService;

    @Autowired
    private BlockchainUtils blockchainUtils;

    @Autowired
    private PriceUtils priceUtils;

    /**
     * 创建支付订单
     */
    @Transactional
    public OrderDTO createOrder(CreateOrderRequestDTO request, String userId) {
        // 1. 获取实时价格
        PriceInfoDTO priceInfo = priceService.getTokenPrice(request.getCurrency(), request.getFiatAmount());
        
        // 2. 生成唯一订单ID
        String orderId = generateOrderId();
        
        // 3. 创建订单实体
        PaymentOrder order = new PaymentOrder();
        order.setId(UUID.randomUUID().toString());
        order.setOrderId(orderId);
        order.setUserId(userId);
        order.setProductType(request.getProductType());
        order.setProductId(request.getProductId());
        order.setCurrency(request.getCurrency());
        order.setFiatAmount(request.getFiatAmount());
        order.setTokenAmount(priceInfo.getTokenAmount());
        order.setRecipientAddress(getRecipientAddress());
        order.setPriceTTL(priceInfo.getPriceTTL());
        order.setStatus("pending");
        order.setCreatedAt(LocalDateTime.now());
        order.setExpiresAt(LocalDateTime.now().plusMinutes(15)); // 15分钟过期
        order.setDescription(request.getDescription());
        
        // 4. 保存订单
        paymentOrderMapper.insert(order);
        
        // 5. 返回订单DTO
        return convertToOrderDTO(order);
    }

    /**
     * 根据ID获取订单
     */
    public OrderDTO getOrderById(String orderId, String userId) {
        PaymentOrder order = paymentOrderMapper.findByOrderIdAndUserId(orderId, userId);
        if (order == null) {
            return null;
        }
        return convertToOrderDTO(order);
    }

    /**
     * 获取用户订单历史
     */
    public PageResult<OrderDTO> getUserOrderHistory(String userId, int page, int limit, String status) {
        int offset = (page - 1) * limit;
        List<PaymentOrder> orders = paymentOrderMapper.findByUserIdWithPagination(userId, offset, limit, status);
        long total = paymentOrderMapper.countByUserId(userId, status);
        
        List<OrderDTO> orderDTOs = orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
        
        return new PageResult<>(
                orderDTOs,
                page,
                limit,
                total,
                (int) Math.ceil((double) total / limit)
        );
    }

    /**
     * 验证支付
     */
    @Transactional
    public VerifyPaymentResponseDTO verifyPayment(VerifyPaymentRequestDTO request, String userId) {
        try {
            // 1. 获取订单
            PaymentOrder order = paymentOrderMapper.findByOrderIdAndUserId(request.getOrderId(), userId);
            if (order == null) {
                return new VerifyPaymentResponseDTO(false, false, 0, 3, null, null, null, "Order not found");
            }
            
            // 2. 检查订单状态
            if (!"pending".equals(order.getStatus())) {
                return new VerifyPaymentResponseDTO(false, false, 0, 3, null, null, null, "Order is not pending");
            }
            
            // 3. 检查价格是否过期
            if (System.currentTimeMillis() / 1000 > order.getPriceTTL()) {
                order.setStatus("expired");
                paymentOrderMapper.update(order);
                return new VerifyPaymentResponseDTO(false, false, 0, 3, null, null, null, "Order price expired");
            }
            
            // 4. 查询链上交易
            TransactionInfo txInfo = blockchainUtils.getTransactionInfo(request.getTxHash());
            if (txInfo == null) {
                return new VerifyPaymentResponseDTO(false, false, 0, 3, null, null, null, "Transaction not found");
            }
            
            // 5. 验证交易参数
            if (!isValidTransaction(txInfo, order, request.getFromAddress())) {
                return new VerifyPaymentResponseDTO(false, false, 0, 3, null, null, null, "Invalid transaction parameters");
            }
            
            // 6. 检查确认数
            int requiredConfirmations = getRequiredConfirmations();
            if (txInfo.getConfirmations() < requiredConfirmations) {
                // 创建交易记录但标记为pending
                createTransactionRecord(order, txInfo);
                return new VerifyPaymentResponseDTO(true, false, txInfo.getConfirmations(), requiredConfirmations, 
                        txInfo.getBlockNumber(), txInfo.getGasUsed(), txInfo.getGasPrice(), null);
            }
            
            // 7. 确认支付
            confirmPayment(order, txInfo);
            
            return new VerifyPaymentResponseDTO(true, true, txInfo.getConfirmations(), requiredConfirmations,
                    txInfo.getBlockNumber(), txInfo.getGasUsed(), txInfo.getGasPrice(), null);
            
        } catch (Exception e) {
            return new VerifyPaymentResponseDTO(false, false, 0, 3, null, null, null, "Verification failed: " + e.getMessage());
        }
    }

    /**
     * 根据交易哈希获取交易详情
     */
    public TransactionDTO getTransactionByHash(String txHash) {
        PaymentTransaction transaction = paymentTransactionMapper.findByTxHash(txHash);
        if (transaction == null) {
            return null;
        }
        return convertToTransactionDTO(transaction);
    }

    /**
     * 获取网络状态
     */
    public NetworkStatusDTO getNetworkStatus() {
        try {
            return blockchainUtils.getNetworkStatus();
        } catch (Exception e) {
            return new NetworkStatusDTO(137, "Polygon", 0L, "0", false, LocalDateTime.now());
        }
    }

    /**
     * 激活用户权益
     */
    @Transactional
    public void activateUserBenefits(String orderId, List<String> benefits, String userId) {
        PaymentOrder order = paymentOrderMapper.findByOrderIdAndUserId(orderId, userId);
        if (order == null || !"paid".equals(order.getStatus())) {
            throw new RuntimeException("Order not found or not paid");
        }
        
        for (String benefitType : benefits) {
            UserBenefit userBenefit = new UserBenefit();
            userBenefit.setId(UUID.randomUUID().toString());
            userBenefit.setUserId(userId);
            userBenefit.setOrderId(orderId);
            userBenefit.setBenefitType(benefitType);
            userBenefit.setBenefitValue("{}");
            userBenefit.setIsActive(true);
            userBenefit.setCreatedAt(LocalDateTime.now());
            
            // 根据权益类型设置过期时间
            if ("premium_access".equals(benefitType)) {
                userBenefit.setExpiresAt(LocalDateTime.now().plusMonths(1));
            }
            
            userBenefitMapper.insert(userBenefit);
        }
    }

    /**
     * 获取用户权益
     */
    public List<UserBenefitDTO> getUserBenefits(String userId) {
        List<UserBenefit> benefits = userBenefitMapper.findByUserId(userId);
        return benefits.stream()
                .map(this::convertToUserBenefitDTO)
                .collect(Collectors.toList());
    }

    /**
     * 申请退款
     */
    @Transactional
    public RefundDTO requestRefund(RefundRequestDTO request, String userId) {
        PaymentOrder order = paymentOrderMapper.findByOrderIdAndUserId(request.getOrderId(), userId);
        if (order == null) {
            throw new RuntimeException("Order not found");
        }
        
        if (!"paid".equals(order.getStatus())) {
            throw new RuntimeException("Order is not paid");
        }
        
        // 创建退款记录
        String refundId = generateRefundId();
        RefundDTO refund = new RefundDTO();
        refund.setId(UUID.randomUUID().toString());
        refund.setOrderId(request.getOrderId());
        refund.setRefundId(refundId);
        refund.setUserId(userId);
        refund.setAmount(request.getAmount() != null ? request.getAmount() : order.getTokenAmount());
        refund.setCurrency(order.getCurrency());
        refund.setReason(request.getReason());
        refund.setStatus("pending");
        refund.setCreatedAt(LocalDateTime.now());
        
        // 保存退款记录到数据库
        // refundMapper.insert(refund);
        
        return refund;
    }

    /**
     * 获取支付统计
     */
    public PaymentStatsDTO getPaymentStats(String startDate, String endDate) {
        // 实现统计逻辑
        return new PaymentStatsDTO();
    }

    /**
     * 导出交易记录
     */
    public byte[] exportTransactions(String format, String startDate, String endDate) {
        // 实现导出逻辑
        return new byte[0];
    }

    // 私有辅助方法

    private String generateOrderId() {
        return "ord_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String generateRefundId() {
        return "ref_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String getRecipientAddress() {
        // 从配置中获取收款地址
        return "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
    }

    private int getRequiredConfirmations() {
        // 从配置中获取所需确认数
        return 3;
    }

    private boolean isValidTransaction(TransactionInfo txInfo, PaymentOrder order, String fromAddress) {
        return txInfo.getToAddress().equalsIgnoreCase(order.getRecipientAddress()) &&
               txInfo.getFromAddress().equalsIgnoreCase(fromAddress) &&
               txInfo.getAmount().compareTo(order.getTokenAmount()) == 0 &&
               txInfo.getCurrency().equals(order.getCurrency());
    }

    private void createTransactionRecord(PaymentOrder order, TransactionInfo txInfo) {
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setId(UUID.randomUUID().toString());
        transaction.setOrderId(order.getOrderId());
        transaction.setTxHash(txInfo.getTxHash());
        transaction.setFromAddress(txInfo.getFromAddress());
        transaction.setToAddress(txInfo.getToAddress());
        transaction.setAmount(txInfo.getAmount());
        transaction.setCurrency(txInfo.getCurrency());
        transaction.setBlockNumber(txInfo.getBlockNumber());
        transaction.setConfirmations(txInfo.getConfirmations());
        transaction.setGasUsed(txInfo.getGasUsed());
        transaction.setGasPrice(txInfo.getGasPrice());
        transaction.setStatus("pending");
        transaction.setCreatedAt(LocalDateTime.now());
        
        paymentTransactionMapper.insert(transaction);
    }

    private void confirmPayment(PaymentOrder order, TransactionInfo txInfo) {
        // 更新订单状态
        order.setStatus("paid");
        order.setPaidAt(LocalDateTime.now());
        paymentOrderMapper.update(order);
        
        // 创建交易记录
        createTransactionRecord(order, txInfo);
        
        // 激活用户权益
        // activateUserBenefits(order.getOrderId(), getDefaultBenefits(order.getProductType()), order.getUserId());
    }

    private OrderDTO convertToOrderDTO(PaymentOrder order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderId(order.getOrderId());
        dto.setUserId(order.getUserId());
        dto.setProductType(order.getProductType());
        dto.setProductId(order.getProductId());
        dto.setCurrency(order.getCurrency());
        dto.setFiatAmount(order.getFiatAmount());
        dto.setTokenAmount(order.getTokenAmount());
        dto.setRecipientAddress(order.getRecipientAddress());
        dto.setPriceTTL(order.getPriceTTL());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setExpiresAt(order.getExpiresAt());
        dto.setPaidAt(order.getPaidAt());
        dto.setDescription(order.getDescription());
        return dto;
    }

    private TransactionDTO convertToTransactionDTO(PaymentTransaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setOrderId(transaction.getOrderId());
        dto.setTxHash(transaction.getTxHash());
        dto.setFromAddress(transaction.getFromAddress());
        dto.setToAddress(transaction.getToAddress());
        dto.setAmount(transaction.getAmount());
        dto.setCurrency(transaction.getCurrency());
        dto.setBlockNumber(transaction.getBlockNumber());
        dto.setConfirmations(transaction.getConfirmations());
        dto.setGasUsed(transaction.getGasUsed());
        dto.setGasPrice(transaction.getGasPrice());
        dto.setStatus(transaction.getStatus());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setConfirmedAt(transaction.getConfirmedAt());
        return dto;
    }

    private UserBenefitDTO convertToUserBenefitDTO(UserBenefit benefit) {
        UserBenefitDTO dto = new UserBenefitDTO();
        dto.setId(benefit.getId());
        dto.setUserId(benefit.getUserId());
        dto.setOrderId(benefit.getOrderId());
        dto.setBenefitType(benefit.getBenefitType());
        dto.setBenefitValue(benefit.getBenefitValue());
        dto.setExpiresAt(benefit.getExpiresAt());
        dto.setIsActive(benefit.getIsActive());
        dto.setCreatedAt(benefit.getCreatedAt());
        return dto;
    }

    // 内部类
    private static class TransactionInfo {
        private String txHash;
        private String fromAddress;
        private String toAddress;
        private BigDecimal amount;
        private String currency;
        private Long blockNumber;
        private Integer confirmations;
        private String gasUsed;
        private String gasPrice;
        
        // getters and setters
        public String getTxHash() { return txHash; }
        public void setTxHash(String txHash) { this.txHash = txHash; }
        public String getFromAddress() { return fromAddress; }
        public void setFromAddress(String fromAddress) { this.fromAddress = fromAddress; }
        public String getToAddress() { return toAddress; }
        public void setToAddress(String toAddress) { this.toAddress = toAddress; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public Long getBlockNumber() { return blockNumber; }
        public void setBlockNumber(Long blockNumber) { this.blockNumber = blockNumber; }
        public Integer getConfirmations() { return confirmations; }
        public void setConfirmations(Integer confirmations) { this.confirmations = confirmations; }
        public String getGasUsed() { return gasUsed; }
        public void setGasUsed(String gasUsed) { this.gasUsed = gasUsed; }
        public String getGasPrice() { return gasPrice; }
        public void setGasPrice(String gasPrice) { this.gasPrice = gasPrice; }
    }
}
