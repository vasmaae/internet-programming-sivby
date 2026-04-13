package com.budget.repository;

import com.budget.entity.Category;
import com.budget.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByAccountId(Long accountId);
    List<Category> findByAccountIdAndType(Long accountId, TransactionType type);
}
