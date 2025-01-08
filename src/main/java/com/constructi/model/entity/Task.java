package com.constructi.model.entity;

import com.constructi.model.enums.StatusTask;
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

    @NotBlank
    private String description;

    @Enumerated(EnumType.STRING)
    private StatusTask status;

    @Temporal(TemporalType.DATE)
    private LocalDate beginDate;

    @Temporal(TemporalType.DATE)
    private LocalDate dateEndEstimated;

    private Double effectiveTime;

    @ManyToOne
    private Project project;

    @ManyToOne
    private User user;
}
