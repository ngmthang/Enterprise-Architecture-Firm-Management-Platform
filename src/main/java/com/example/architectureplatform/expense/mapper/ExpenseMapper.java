package com.example.architectureplatform.expense.mapper;

import com.example.architectureplatform.expense.dto.response.ExpenseResponse;
import com.example.architectureplatform.expense.entity.Expense;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    public ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getExpenseReference(),
                expense.getDescription(),
                expense.getCategory(),
                expense.getStatus(),
                expense.getAmount(),
                expense.getCurrency(),
                expense.getExpenseDate(),
                expense.getVendorName(),
                expense.getReceiptUrl(),
                expense.getNotes(),
                expense.getCreatedAt(),
                expense.getUpdatedAt()
        );
    }
}