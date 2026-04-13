package com.budget.dto;

import com.budget.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Название не может быть пустым")
    private String name;

    @NotNull(message = "Тип обязателен")
    private TransactionType type;

    @NotNull(message = "Счёт обязателен")
    private Long accountId;
}
