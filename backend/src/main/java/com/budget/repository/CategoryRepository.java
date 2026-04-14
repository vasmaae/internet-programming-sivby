package com.budget.repository;

import com.budget.entity.Category;
import com.budget.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findByAccountId(Long accountId, Pageable pageable);
    List<Category> findByAccountId(Long accountId);
    List<Category> findByAccountIdAndType(Long accountId, TransactionType type);
}
