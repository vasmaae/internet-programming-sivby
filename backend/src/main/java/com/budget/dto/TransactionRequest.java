package com.budget.dto;

import com.budget.entity.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionRequest {

    @NotNull(message = "Сумма обязательна")
    @DecimalMin(value = "0.01", message = "Сумма должна быть больше 0")
    private BigDecimal amount;

    private String description;

    @NotNull(message = "Дата обязательна")
    private LocalDate date;

    @NotNull(message = "Тип обязателен")
    private TransactionType type;

    @NotNull(message = "Счёт обязателен")
    private Long accountId;

    private Long categoryId;
}
