package com.example.architectureplatform.expense.controller;

import com.example.architectureplatform.common.response.ApiResponse;
import com.example.architectureplatform.expense.dto.request.CreateExpenseRequest;
import com.example.architectureplatform.expense.dto.request.UpdateExpenseRequest;
import com.example.architectureplatform.expense.dto.response.ExpenseResponse;
import com.example.architectureplatform.expense.enums.ExpenseCategory;
import com.example.architectureplatform.expense.enums.ExpenseStatus;
import com.example.architectureplatform.expense.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @Valid @RequestBody CreateExpenseRequest request
    ) {
        ExpenseResponse response = expenseService.createExpense(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Expense created successfully", response));
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @PathVariable Long expenseId,
            @Valid @RequestBody UpdateExpenseRequest request
    ) {
        ExpenseResponse response = expenseService.updateExpense(expenseId, request);
        return ResponseEntity.ok(ApiResponse.success("Expense updated successfully", response));
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(@PathVariable Long expenseId) {
        ExpenseResponse response = expenseService.getExpenseById(expenseId);
        return ResponseEntity.ok(ApiResponse.success("Expense retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getAllExpenses() {
        List<ExpenseResponse> response = expenseService.getAllExpenses();
        return ResponseEntity.ok(ApiResponse.success("Expenses retrieved successfully", response));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getExpensesByStatus(@PathVariable ExpenseStatus status) {
        List<ExpenseResponse> response = expenseService.getExpensesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Expenses by status retrieved successfully", response));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getExpensesByCategory(@PathVariable ExpenseCategory category) {
        List<ExpenseResponse> response = expenseService.getExpensesByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Expenses by category retrieved successfully", response));
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long expenseId) {
        expenseService.deleteExpense(expenseId);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully", null));
    }
}