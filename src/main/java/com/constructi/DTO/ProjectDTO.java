package com.constructi.DTO;

import com.constructi.model.enums.ProjectState;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {

    private Long id;

    @NotBlank(message = "Project name is required.")
    @Size(max = 100, message = "Project name must not exceed 100 characters.")
    private String name;

    @Size(max = 255, message = "Description must not exceed 255 characters.")
    private String description;

    @NotNull(message = "Start date is required.")
    private LocalDate startDate;

    @FutureOrPresent(message = "End date must be today or a future date.")
    private LocalDate endDate;

    @NotNull(message = "Project state is required.")
    private ProjectState state;

    @DecimalMin(value = "0.0", inclusive = false, message = "Initial budget must be greater than 0.")
    @NotNull(message = "Initial budget is required.")
    private Double initialBudget;

    @DecimalMin(value = "0.0", inclusive = false, message = "Actual budget must be greater than 0.")
    @NotNull(message = "Actual budget is required.")
    private Double actualBudget;

    @NotNull(message = "Project must be associated with a user.")
    //private Long userId;
    private UserDTO user;

    private List<TaskDTO> tasks;
    private List<BudgetDTO> budgets;
    private List<MaterialDTO> materials;
}