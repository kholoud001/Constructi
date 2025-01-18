package com.constructi.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectRequestDTO {

    @NotBlank(message = "Project name is required.")
    @Size(max = 100, message = "Project name must not exceed 100 characters.")
    private String name;

    @Size(max = 255, message = "Description must not exceed 255 characters.")
    private String description;

    @NotNull(message = "Start date is required.")
    @PastOrPresent(message = "Start date must be in the past or present.")
    private LocalDate startDate;

    @FutureOrPresent(message = "End date must be today or in the future.")
    private LocalDate endDate;

    @NotNull(message = "Project state is required.")
    private String state;

    @DecimalMin(value = "0.0", inclusive = false, message = "Initial budget must be greater than 0.")
    @NotNull(message = "Initial budget is required.")
    private Double initialBudget;

    @DecimalMin(value = "0.0", inclusive = false, message = "Actual budget must be greater than 0.")
    @NotNull(message = "Actual budget is required.")
    private Double actualBudget;

    @NotNull(message = "Project must be associated with a user ID.")
    private Long userId;
}
