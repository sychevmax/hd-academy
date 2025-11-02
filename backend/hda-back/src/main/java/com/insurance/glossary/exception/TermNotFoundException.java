package com.insurance.glossary.exception;

public class TermNotFoundException extends RuntimeException {
    public TermNotFoundException(String message) {
        super(message);
    }
}
