package com.budget.dto;

import com.budget.entity.TransactionType;
import lombok.Data;

@Data
public class CategoryResponse {
    private Long id;
    private String name;
    private TransactionType type;
    private Long accountId;
    private String accountName;
}
