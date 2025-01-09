package com.constructi.DTO;

import com.constructi.model.enums.StatusTask;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {

    private Long id;

    @NotBlank(message = "Task description is required.")
    @Size(max = 255, message = "Description must not exceed 255 characters.")
    private String description;

    @NotNull(message = "Task status is required.")
    private StatusTask status;

    @NotNull(message = "Begin date is required.")
    private LocalDate beginDate;

    @FutureOrPresent(message = "Estimated end date must be today or a future date.")
    private LocalDate dateEndEstimated;

    @DecimalMin(value = "0.0", inclusive = true, message = "Effective time must be 0 or greater.")
    private Double effectiveTime;

    @NotNull(message = "Task must be associated with a project.")
    //private Long projectId;
    private ProjectDTO project;

    private UserDTO user;

    //private Long userId;

}
