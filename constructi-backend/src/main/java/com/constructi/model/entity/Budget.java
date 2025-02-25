package com.constructi.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Transaction date is required.")
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0.")
    @NotNull(message = "Amount is required.")
    @Column(name = "amount", nullable = false)
    private Double amount;

    @NotNull(message = "Transaction type is required.")
    @Column(name = "transaction_type", nullable = false)
    private String transactionType;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @NotNull(message = "Project association is required.")
    private Project project;

}
