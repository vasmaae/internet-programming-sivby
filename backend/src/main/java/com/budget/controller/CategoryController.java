package com.budget.controller;

import com.budget.dto.CategoryRequest;
import com.budget.dto.CategoryResponse;
import com.budget.dto.PageResponse;
import com.budget.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Категории", description = "Управление категориями доходов и расходов")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Получить список категорий (опционально — по счёту)")
    public PageResponse<CategoryResponse> getAll(
            @RequestParam(required = false) Long accountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (accountId != null) {
            return categoryService.findByAccountId(accountId, page, size);
        }
        return categoryService.findAll(page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить категорию по ID")
    public CategoryResponse getById(@PathVariable Long id) {
        return categoryService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создать категорию")
    public CategoryResponse create(@Valid @RequestBody CategoryRequest dto) {
        return categoryService.create(dto);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить категорию")
    public CategoryResponse update(@PathVariable Long id, @Valid @RequestBody CategoryRequest dto) {
        return categoryService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Удалить категорию")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}
