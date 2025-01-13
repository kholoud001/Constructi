package com.constructi.DTO;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetDTO {

    private Long id;

    @NotNull(message = "Modification date is required.")
    private LocalDateTime modificationDate;

    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0.")
    @NotNull(message = "Amount is required.")
    private Double amount;

    @NotBlank(message = "Description is required.")
    private String description;

//    @NotNull(message = "Project association is required.")
    //private Long projectId;
//    private ProjectDTO project;
}