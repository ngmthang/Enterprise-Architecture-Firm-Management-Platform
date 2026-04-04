package com.example.architectureplatform.expense.repository;

import com.example.architectureplatform.expense.entity.Expense;
import com.example.architectureplatform.expense.enums.ExpenseCategory;
import com.example.architectureplatform.expense.enums.ExpenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    Optional<Expense> findByExpenseReference(String expenseReference);

    boolean existsByExpenseReference(String expenseReference);

    List<Expense> findByStatusOrderByExpenseDateDesc(ExpenseStatus status);

    List<Expense> findByCategoryOrderByExpenseDateDesc(ExpenseCategory category);
}