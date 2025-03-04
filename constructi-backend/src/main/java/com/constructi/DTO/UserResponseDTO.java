package com.constructi.DTO;

import com.constructi.model.enums.ContratType;
import lombok.Data;

import java.util.List;

@Data
public class UserResponseDTO {

    private Long id;
    private String lname;
    private String fname;
    private String cell;
    private String email;
    private Double rateHourly;
    private ContratType contratType;
    private Long roleId;
    private List<Long> taskIds;
    private List<Long> invoiceIds;
    private List<Long> projectIds;
    private boolean isActive;

}
