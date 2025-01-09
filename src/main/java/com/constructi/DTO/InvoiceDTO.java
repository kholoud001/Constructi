package com.constructi.DTO;

import com.constructi.model.enums.InvoiceState;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {

    private Long id;

    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0.")
    @NotNull(message = "Amount is required.")
    private Double amount;

    @NotNull(message = "Emission date is required.")
    private LocalDateTime emissionDate;

    @NotNull(message = "State is required.")
    private InvoiceState state;

    private UserDTO user;


}