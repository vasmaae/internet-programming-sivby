package com.budget.service;

import com.budget.dto.CategoryRequest;
import com.budget.dto.CategoryResponse;
import com.budget.dto.PageResponse;
import com.budget.entity.Account;
import com.budget.entity.Category;
import com.budget.exception.ResourceNotFoundException;
import com.budget.repository.CategoryRepository;
import com.budget.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final AccountService accountService;

    public PageResponse<CategoryResponse> findAll(int page, int size) {
        return PageResponse.of(
                categoryRepository.findAll(PageRequest.of(page, size))
                        .map(this::toResponse));
    }

    public PageResponse<CategoryResponse> findByAccountId(Long accountId, int page, int size) {
        return PageResponse.of(
                categoryRepository.findByAccountId(accountId, PageRequest.of(page, size))
                        .map(this::toResponse));
    }

    public CategoryResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    @Transactional
    public CategoryResponse create(CategoryRequest dto) {
        Account account = accountService.getOrThrow(dto.getAccountId());
        Category category = new Category();
        category.setName(dto.getName());
        category.setType(dto.getType());
        category.setAccount(account);
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest dto) {
        Category category = getOrThrow(id);
        Account account = accountService.getOrThrow(dto.getAccountId());
        category.setName(dto.getName());
        category.setType(dto.getType());
        category.setAccount(account);
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        Category category = getOrThrow(id);
        // Отвязываем транзакции от категории перед удалением
        transactionRepository.findByAccountIdOrderByDateDesc(category.getAccount().getId())
                .stream()
                .filter(t -> category.equals(t.getCategory()))
                .forEach(t -> {
                    t.setCategory(null);
                    transactionRepository.save(t);
                });
        categoryRepository.delete(category);
    }

    public Category getOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Категория с id=" + id + " не найдена"));
    }

    private CategoryResponse toResponse(Category category) {
        CategoryResponse r = new CategoryResponse();
        r.setId(category.getId());
        r.setName(category.getName());
        r.setType(category.getType());
        r.setAccountId(category.getAccount().getId());
        r.setAccountName(category.getAccount().getName());
        return r;
    }
}
