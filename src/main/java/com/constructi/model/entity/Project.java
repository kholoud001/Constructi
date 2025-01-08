package com.constructi.model.entity;

import com.constructi.model.enums.ProjectState;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @NotBlank
    private String name;

    private String description;

    @Temporal(TemporalType.DATE)
    private LocalDate startdate;

    @Temporal(TemporalType.DATE)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private ProjectState state;

    @DecimalMin("0.0")
    private Double initialbudget;

    @DecimalMin("0.0")
    private Double actuelBudget;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Task> tasks;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Budget> budgets;

//    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL)
//    private List<Materiel> materiels;

    @ManyToOne
    private User user;
}
