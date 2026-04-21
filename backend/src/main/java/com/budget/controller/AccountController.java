package com.budget.controller;

import com.budget.dto.AccountRequest;
import com.budget.dto.AccountResponse;
import com.budget.dto.PageResponse;
import com.budget.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Tag(name = "Счета", description = "Управление финансовыми счетами")
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    @Operation(summary = "Получить список счетов")
    public PageResponse<AccountResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return accountService.findAll(page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить счёт по ID")
    public AccountResponse getById(@PathVariable Long id) {
        return accountService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать счёт")
    public AccountResponse create(@Valid @RequestBody AccountRequest dto) {
        return accountService.create(dto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить счёт")
    public AccountResponse update(@PathVariable Long id, @Valid @RequestBody AccountRequest dto) {
        return accountService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Удалить счёт")
    public void delete(@PathVariable Long id) {
        accountService.delete(id);
    }
}
