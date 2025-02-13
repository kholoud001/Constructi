package com.constructi.DTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class ForgotPasswordRequest {
    private String email;
}
