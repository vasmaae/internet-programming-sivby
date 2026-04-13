package com.budget.dto;

import com.budget.entity.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionResponse {
    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
    private TransactionType type;
    private Long accountId;
    private String accountName;
    private Long categoryId;
    private String categoryName;
}
