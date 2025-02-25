package com.constructi.DTO;

import com.constructi.model.enums.InvoiceState;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InvoiceRequestDTO {
    @NotNull(message = "User ID is required.")
    private Long userId;

    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0.")
    @NotNull(message = "Amount is required.")
    private Double amount;
}
