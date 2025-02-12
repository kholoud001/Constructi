package com.constructi.DTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BudgetRequestDTO {
    @NotNull(message = "Modification date is required.")
    private LocalDateTime modificationDate;

    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0.")
    @NotNull(message = "Amount is required.")
    private Double amount;

    @NotBlank(message = "Description is required.")
    private String description;

    @NotNull(message = "Project ID is required.")
    private Long projectId;
}
