package com.example.architectureplatform.expense.service.impl;

import com.example.architectureplatform.expense.dto.request.CreateExpenseRequest;
import com.example.architectureplatform.expense.dto.request.UpdateExpenseRequest;
import com.example.architectureplatform.expense.dto.response.ExpenseResponse;
import com.example.architectureplatform.expense.entity.Expense;
import com.example.architectureplatform.expense.enums.ExpenseCategory;
import com.example.architectureplatform.expense.enums.ExpenseStatus;
import com.example.architectureplatform.expense.exception.DuplicateExpenseReferenceException;
import com.example.architectureplatform.expense.exception.ExpenseNotFoundException;
import com.example.architectureplatform.expense.mapper.ExpenseMapper;
import com.example.architectureplatform.expense.repository.ExpenseRepository;
import com.example.architectureplatform.expense.service.ExpenseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository, ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.expenseMapper = expenseMapper;
    }

    @Override
    public ExpenseResponse createExpense(CreateExpenseRequest request) {
        String normalizedReference = normalizeReference(request.expenseReference());

        if (normalizedReference != null && expenseRepository.existsByExpenseReference(normalizedReference)) {
            throw new DuplicateExpenseReferenceException(normalizedReference);
        }

        Expense expense = new Expense();
        expense.setTitle(request.title().trim());
        expense.setExpenseReference(normalizedReference);
        expense.setDescription(request.description() == null ? null : request.description().trim());
        expense.setCategory(request.category());
        expense.setStatus(request.status());
        expense.setAmount(request.amount());
        expense.setCurrency(request.currency().trim().toUpperCase());
        expense.setExpenseDate(request.expenseDate());
        expense.setVendorName(request.vendorName() == null ? null : request.vendorName().trim());
        expense.setReceiptUrl(request.receiptUrl() == null ? null : request.receiptUrl().trim());
        expense.setNotes(request.notes() == null ? null : request.notes().trim());

        Expense savedExpense = expenseRepository.save(expense);
        return expenseMapper.toResponse(savedExpense);
    }

    @Override
    public ExpenseResponse updateExpense(Long expenseId, UpdateExpenseRequest request) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ExpenseNotFoundException(expenseId));

        String normalizedReference = normalizeReference(request.expenseReference());
        if (normalizedReference != null) {
            expenseRepository.findByExpenseReference(normalizedReference)
                    .filter(existingExpense -> !existingExpense.getId().equals(expenseId))
                    .ifPresent(existingExpense -> {
                        throw new DuplicateExpenseReferenceException(normalizedReference);
                    });
        }

        expense.setTitle(request.title().trim());
        expense.setExpenseReference(normalizedReference);
        expense.setDescription(request.description() == null ? null : request.description().trim());
        expense.setCategory(request.category());
        expense.setStatus(request.status());
        expense.setAmount(request.amount());
        expense.setCurrency(request.currency().trim().toUpperCase());
        expense.setExpenseDate(request.expenseDate());
        expense.setVendorName(request.vendorName() == null ? null : request.vendorName().trim());
        expense.setReceiptUrl(request.receiptUrl() == null ? null : request.receiptUrl().trim());
        expense.setNotes(request.notes() == null ? null : request.notes().trim());

        Expense updatedExpense = expenseRepository.save(expense);
        return expenseMapper.toResponse(updatedExpense);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ExpenseNotFoundException(expenseId));

        return expenseMapper.toResponse(expense);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses() {
        return expenseRepository.findAll()
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByStatus(ExpenseStatus status) {
        return expenseRepository.findByStatusOrderByExpenseDateDesc(status)
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByCategory(ExpenseCategory category) {
        return expenseRepository.findByCategoryOrderByExpenseDateDesc(category)
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ExpenseNotFoundException(expenseId));

        expenseRepository.delete(expense);
    }

    private String normalizeReference(String expenseReference) {
        if (expenseReference == null || expenseReference.isBlank()) {
            return null;
        }
        return expenseReference.trim();
    }
}