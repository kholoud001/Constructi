package com.constructi.model.entity;

import com.constructi.model.enums.StatusTask;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

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

    @DecimalMin(value = "0.0", inclusive = true, message = "Budget limit must be greater than 0.")
    @Column(name = "budget_limit", nullable = false)
    private Double budgetLimit;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Invoice> invoices;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @NotNull(message = "Task must be associated with at least one project.")
    @JsonBackReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Project project;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Subtask> subtasks;


}
