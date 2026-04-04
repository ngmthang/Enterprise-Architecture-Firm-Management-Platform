package com.example.architectureplatform.expense.service;

import com.example.architectureplatform.expense.dto.request.CreateExpenseRequest;
import com.example.architectureplatform.expense.dto.request.UpdateExpenseRequest;
import com.example.architectureplatform.expense.dto.response.ExpenseResponse;
import com.example.architectureplatform.expense.enums.ExpenseCategory;
import com.example.architectureplatform.expense.enums.ExpenseStatus;

import java.util.List;

public interface ExpenseService {

    ExpenseResponse createExpense(CreateExpenseRequest request);

    ExpenseResponse updateExpense(Long expenseId, UpdateExpenseRequest request);

    ExpenseResponse getExpenseById(Long expenseId);

    List<ExpenseResponse> getAllExpenses();

    List<ExpenseResponse> getExpensesByStatus(ExpenseStatus status);

    List<ExpenseResponse> getExpensesByCategory(ExpenseCategory category);

    void deleteExpense(Long expenseId);
}