package com.budget.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountRequest {

    @NotBlank(message = "Название не может быть пустым")
    private String name;

    @NotNull(message = "Баланс обязателен")
    private BigDecimal balance;

    @NotBlank(message = "Валюта обязательна")
    @Size(min = 1, max = 3, message = "Валюта: 1-3 символа")
    private String currency;
}
