package com.example.architectureplatform.expense.dto.response;

import com.example.architectureplatform.expense.enums.ExpenseCategory;
import com.example.architectureplatform.expense.enums.ExpenseStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ExpenseResponse(
        Long id,
        String title,
        String expenseReference,
        String description,
        ExpenseCategory category,
        ExpenseStatus status,
        BigDecimal amount,
        String currency,
        LocalDate expenseDate,
        String vendorName,
        String receiptUrl,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}