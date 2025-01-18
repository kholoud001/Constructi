package com.constructi.DTO;

import com.constructi.model.enums.InvoiceState;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InvoiceResponseDTO {
    private Long id;
    private Double amount;
    private LocalDateTime emissionDate;
    private InvoiceState state;
    private Long userId;
}
