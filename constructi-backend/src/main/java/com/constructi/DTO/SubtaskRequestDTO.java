package com.constructi.DTO;

import com.constructi.model.enums.StatusTask;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SubtaskRequestDTO {

    @NotBlank(message = "Subtask description is required.")
    @Size(max = 255, message = "Description must not exceed 255 characters.")
    private String description;

    @NotNull(message = "Subtask status is required.")
    private StatusTask status;

    @NotNull(message = "Begin date is required.")
    private LocalDate beginDate;

    @FutureOrPresent(message = "Estimated end date must be today or a future date.")
    private LocalDate dateEndEstimated;

    @DecimalMin(value = "0.0", inclusive = true, message = "Effective time must be 0 or greater.")
    private Double effectiveTime;

    @NotNull(message = "Parent task ID is required.")
    private Long parentTaskId;

    @NotNull(message = "Assigned user ID is required.")
    private Long userId;
}