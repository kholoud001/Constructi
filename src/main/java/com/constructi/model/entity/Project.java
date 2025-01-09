package com.constructi.model.entity;

import com.constructi.DTO.UserDTO;
import com.constructi.model.enums.ProjectState;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Project name is required.")
    @Size(max = 100, message = "Project name must not exceed 100 characters.")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Size(max = 255, message = "Description must not exceed 255 characters.")
    @Column(name = "description", length = 255)
    private String description;

    @Setter
    @NotNull(message = "Start date is required.")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;


    @FutureOrPresent(message = "End date must be today or a future date.")
    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Project state is required.")
    @Column(name = "state", nullable = false)
    private ProjectState state;

    @DecimalMin(value = "0.0", inclusive = false, message = "Initial budget must be greater than 0.")
    @NotNull(message = "Initial budget is required.")
    @Column(name = "initial_budget", nullable = false)
    private Double initialBudget;

    @DecimalMin(value = "0.0", inclusive = false, message = "Actual budget must be greater than 0.")
    @NotNull(message = "Actual budget is required.")
    @Column(name = "actual_budget", nullable = false)
    private Double actualBudget;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Task> tasks;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Budget> budgets;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "Project must be associated with a user.")
    private User user;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Material> materials;


}
