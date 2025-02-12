package com.constructi.exception;

public class InvalidProjectDateException extends RuntimeException {
    public InvalidProjectDateException(String message) {
        super(message);
    }
}
