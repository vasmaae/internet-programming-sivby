package com.budget.controller;

import com.budget.dto.PageResponse;
import com.budget.dto.TransactionRequest;
import com.budget.dto.TransactionResponse;
import com.budget.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Транзакции", description = "Управление финансовыми транзакциями")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @Operation(summary = "Получить список транзакций (опционально — по счёту)")
    public PageResponse<TransactionResponse> getAll(
            @RequestParam(required = false) Long accountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (accountId != null) {
            return transactionService.findByAccountId(accountId, page, size);
        }
        return transactionService.findAll(page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить транзакцию по ID")
    public TransactionResponse getById(@PathVariable Long id) {
        return transactionService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать транзакцию")
    public TransactionResponse create(@Valid @RequestBody TransactionRequest dto) {
        return transactionService.create(dto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить транзакцию")
    public TransactionResponse update(@PathVariable Long id, @Valid @RequestBody TransactionRequest dto) {
        return transactionService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Удалить транзакцию")
    public void delete(@PathVariable Long id) {
        transactionService.delete(id);
    }
}
