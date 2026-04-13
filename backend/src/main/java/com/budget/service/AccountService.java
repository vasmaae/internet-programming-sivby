package com.budget.service;

import com.budget.dto.AccountRequest;
import com.budget.dto.AccountResponse;
import com.budget.entity.Account;
import com.budget.exception.ResourceNotFoundException;
import com.budget.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public List<AccountResponse> findAll() {
        return accountRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public AccountResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    @Transactional
    public AccountResponse create(AccountRequest dto) {
        Account account = new Account();
        account.setName(dto.getName());
        account.setBalance(dto.getBalance());
        account.setCurrency(dto.getCurrency());
        return toResponse(accountRepository.save(account));
    }

    @Transactional
    public AccountResponse update(Long id, AccountRequest dto) {
        Account account = getOrThrow(id);
        account.setName(dto.getName());
        account.setCurrency(dto.getCurrency());
        return toResponse(accountRepository.save(account));
    }

    @Transactional
    public void delete(Long id) {
        accountRepository.delete(getOrThrow(id));
    }

    public Account getOrThrow(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Счёт с id=" + id + " не найден"));
    }

    private AccountResponse toResponse(Account account) {
        AccountResponse r = new AccountResponse();
        r.setId(account.getId());
        r.setName(account.getName());
        r.setBalance(account.getBalance());
        r.setCurrency(account.getCurrency());
        return r;
    }
}
