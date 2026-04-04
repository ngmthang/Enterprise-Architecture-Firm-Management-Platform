package com.example.architectureplatform.expense.dto.request;

import com.example.architectureplatform.expense.enums.ExpenseCategory;
import com.example.architectureplatform.expense.enums.ExpenseStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateExpenseRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must not exceed 255 characters")
        String title,

        @Size(max = 100, message = "Expense reference must not exceed 100 characters")
        String expenseReference,

        @Size(max = 5000, message = "Description must not exceed 5000 characters")
        String description,

        @NotNull(message = "Expense category is required")
        ExpenseCategory category,

        @NotNull(message = "Expense status is required")
        ExpenseStatus status,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        @Digits(integer = 10, fraction = 2, message = "Amount format is invalid")
        BigDecimal amount,

        @NotBlank(message = "Currency is required")
        @Size(max = 10, message = "Currency must not exceed 10 characters")
        String currency,

        @NotNull(message = "Expense date is required")
        LocalDate expenseDate,

        @Size(max = 255, message = "Vendor name must not exceed 255 characters")
        String vendorName,

        @Size(max = 5000, message = "Receipt URL must not exceed 5000 characters")
        String receiptUrl,

        @Size(max = 5000, message = "Notes must not exceed 5000 characters")
        String notes
) {
}