package com.budget.service;

import com.budget.dto.PageResponse;
import com.budget.dto.TransactionRequest;
import com.budget.dto.TransactionResponse;
import com.budget.entity.Account;
import com.budget.entity.Category;
import com.budget.entity.Transaction;
import com.budget.entity.TransactionType;
import com.budget.exception.ResourceNotFoundException;
import com.budget.repository.AccountRepository;
import com.budget.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private static final Sort DATE_DESC = Sort.by(Sort.Direction.DESC, "date");

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final AccountService accountService;
    private final CategoryService categoryService;

    public PageResponse<TransactionResponse> findAll(int page, int size) {
        return PageResponse.of(
                transactionRepository.findAll(PageRequest.of(page, size, DATE_DESC))
                        .map(this::toResponse));
    }

    public PageResponse<TransactionResponse> findByAccountId(Long accountId, int page, int size) {
        return PageResponse.of(
                transactionRepository.findByAccountId(accountId, PageRequest.of(page, size, DATE_DESC))
                        .map(this::toResponse));
    }

    public TransactionResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    @Transactional
    public TransactionResponse create(TransactionRequest dto) {
        Account account = accountService.getOrThrow(dto.getAccountId());
        Category category = dto.getCategoryId() != null
                ? categoryService.getOrThrow(dto.getCategoryId())
                : null;

        if (category != null && !category.getType().equals(dto.getType())) {
            throw new IllegalArgumentException("Тип категории не совпадает с типом транзакции");
        }

        Transaction transaction = new Transaction();
        transaction.setAmount(dto.getAmount());
        transaction.setDescription(dto.getDescription());
        transaction.setDate(dto.getDate());
        transaction.setType(dto.getType());
        transaction.setAccount(account);
        transaction.setCategory(category);

        applyBalanceChange(account, dto.getType(), dto.getAmount());
        accountRepository.save(account);

        return toResponse(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponse update(Long id, TransactionRequest dto) {
        Transaction transaction = getOrThrow(id);
        Account oldAccount = transaction.getAccount();
        Account newAccount = accountService.getOrThrow(dto.getAccountId());
        Category category = dto.getCategoryId() != null
                ? categoryService.getOrThrow(dto.getCategoryId())
                : null;

        if (category != null && !category.getType().equals(dto.getType())) {
            throw new IllegalArgumentException("Тип категории не совпадает с типом транзакции");
        }

        // Откатываем старое изменение баланса
        reverseBalanceChange(oldAccount, transaction.getType(), transaction.getAmount());
        accountRepository.save(oldAccount);

        // Применяем новое изменение баланса
        applyBalanceChange(newAccount, dto.getType(), dto.getAmount());
        accountRepository.save(newAccount);

        transaction.setAmount(dto.getAmount());
        transaction.setDescription(dto.getDescription());
        transaction.setDate(dto.getDate());
        transaction.setType(dto.getType());
        transaction.setAccount(newAccount);
        transaction.setCategory(category);

        return toResponse(transactionRepository.save(transaction));
    }

    @Transactional
    public void delete(Long id) {
        Transaction transaction = getOrThrow(id);
        Account account = transaction.getAccount();
        reverseBalanceChange(account, transaction.getType(), transaction.getAmount());
        accountRepository.save(account);
        transactionRepository.delete(transaction);
    }

    private void applyBalanceChange(Account account, TransactionType type, BigDecimal amount) {
        if (type == TransactionType.INCOME) {
            account.setBalance(account.getBalance().add(amount));
        } else {
            account.setBalance(account.getBalance().subtract(amount));
        }
    }

    private void reverseBalanceChange(Account account, TransactionType type, BigDecimal amount) {
        if (type == TransactionType.INCOME) {
            account.setBalance(account.getBalance().subtract(amount));
        } else {
            account.setBalance(account.getBalance().add(amount));
        }
    }

    private Transaction getOrThrow(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Транзакция с id=" + id + " не найдена"));
    }

    private TransactionResponse toResponse(Transaction t) {
        TransactionResponse r = new TransactionResponse();
        r.setId(t.getId());
        r.setAmount(t.getAmount());
        r.setDescription(t.getDescription());
        r.setDate(t.getDate());
        r.setType(t.getType());
        r.setAccountId(t.getAccount().getId());
        r.setAccountName(t.getAccount().getName());
        if (t.getCategory() != null) {
            r.setCategoryId(t.getCategory().getId());
            r.setCategoryName(t.getCategory().getName());
        }
        return r;
    }
}
