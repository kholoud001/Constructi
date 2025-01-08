package com.constructi.model.entity;

import com.constructi.model.enums.InvoiceState;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
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

    @DecimalMin("0.0")
    private Double amount;

    @Temporal(TemporalType.DATE)
    private LocalDateTime emissionDate;

    @Enumerated(EnumType.STRING)
    private InvoiceState state;
}
