package com.constructi.DTO;

import lombok.Data;
import com.constructi.DTO.TaskResponseDTO;
import com.constructi.DTO.BudgetResponseDTO;


import java.time.LocalDate;
import java.util.List;

@Data
public class ProjectResponseDTO {

    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String state;
    private Double initialBudget;
    private Double actualBudget;

    private Long userId;

    private List<TaskResponseDTO> tasks;
    private List<BudgetResponseDTO> budgets;
    private List<String> materials;

    private Double progress;
    private int teamSize;
}
