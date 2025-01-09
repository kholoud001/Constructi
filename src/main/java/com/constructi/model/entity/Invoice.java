package com.constructi.model.entity;

import com.constructi.model.enums.InvoiceState;
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
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0.")
    @NotNull(message = "Amount is required.")
    @Column(name = "amount", nullable = false)
    private Double amount;

    @NotNull(message = "Emission date is required.")
    @Column(name = "emission_date", nullable = false)
    private LocalDateTime emissionDate;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "State is required.")
    @Column(name = "state", nullable = false)
    private InvoiceState state;
}
