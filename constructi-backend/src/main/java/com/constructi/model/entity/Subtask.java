package com.constructi.model.entity;

import com.constructi.model.enums.StatusTask;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "subtasks")
public class Subtask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Subtask description is required.")
    @Size(max = 255, message = "Description must not exceed 255 characters.")
    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Subtask status is required.")
    @Column(name = "status", nullable = false)
    private StatusTask status;

    @NotNull(message = "Begin date is required.")
    @Column(name = "begin_date", nullable = false)
    private LocalDate beginDate;

    @FutureOrPresent(message = "Estimated end date must be today or a future date.")
    @Column(name = "date_end_estimated")
    private LocalDate dateEndEstimated;

    @DecimalMin(value = "0.0", inclusive = true, message = "Effective time must be 0 or greater.")
    @Column(name = "effective_time")
    private Double effectiveTime;

    @Column(name = "approved", nullable = false)
    private boolean approved = false;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    @NotNull(message = "Subtask must be associated with a parent task.")
    private Task parentTask;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;
}


