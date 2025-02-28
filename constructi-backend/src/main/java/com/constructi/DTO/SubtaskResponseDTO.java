package com.constructi.DTO;

import com.constructi.model.enums.StatusTask;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SubtaskResponseDTO {
    private Long id;
    private String description;
    private StatusTask status;
    private LocalDate beginDate;
    private LocalDate dateEndEstimated;
    private Double effectiveTime;
    private Long parentTaskId;
    private boolean approved;
}