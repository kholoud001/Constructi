package com.constructi.DTO;

import com.constructi.model.enums.StatusTask;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TaskResponseDTO {
    private Long id;
    private String description;
    private StatusTask status;
    private LocalDate beginDate;
    private LocalDate dateEndEstimated;
    private Double effectiveTime;
    private Double budgetLimit;
    private Double totalPaid;
    private List<InvoiceResponseDTO> invoices;
    private Long projectId;
    private Long userId;
    private String userEmail;
    private Double progress;
    private List<SubtaskResponseDTO> subtasks;

}
