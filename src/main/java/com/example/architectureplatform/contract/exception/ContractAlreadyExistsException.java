package com.example.architectureplatform.contract.exception;

public class ContractAlreadyExistsException extends RuntimeException {

    public ContractAlreadyExistsException(String code) {
        super("Contract already exists with code: " + code);
    }
}