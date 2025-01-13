package com.constructi.model.entity;

import com.constructi.model.enums.StatusTask;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Task description is required.")
    @Size(max = 255, message = "Description must not exceed 255 characters.")
    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Task status is required.")
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

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @NotNull(message = "Task must be associated with at least one project.")
    @JsonBackReference
    private Project project;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


}
