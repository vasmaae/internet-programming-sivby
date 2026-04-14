package com.budget.repository;

import com.budget.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // для внутреннего использования (каскадное обнуление категории)
    List<Transaction> findByAccountIdOrderByDateDesc(Long accountId);
    // для пагинированного API
    Page<Transaction> findByAccountId(Long accountId, Pageable pageable);
}
