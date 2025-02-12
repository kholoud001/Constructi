package com.constructi.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BudgetResponseDTO {
    private Long id;
    private LocalDateTime modificationDate;
    private Double amount;
    private String description;
    private Long projectId;
}
