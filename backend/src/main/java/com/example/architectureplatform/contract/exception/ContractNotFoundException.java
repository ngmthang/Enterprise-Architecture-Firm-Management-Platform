package com.example.architectureplatform.contract.exception;

public class ContractNotFoundException extends RuntimeException {

    public ContractNotFoundException(Long id) {
        super("Contract not found with id: " + id);
    }

    public ContractNotFoundException(String code) {
        super("Contract not found with code: " + code);
    }
}