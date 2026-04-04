package com.example.architectureplatform.expense.exception;

public class DuplicateExpenseReferenceException extends RuntimeException {

    public DuplicateExpenseReferenceException(String expenseReference) {
        super("Expense reference already exists: " + expenseReference);
    }
}