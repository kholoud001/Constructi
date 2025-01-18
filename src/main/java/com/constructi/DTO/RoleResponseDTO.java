package com.constructi.DTO;

import com.constructi.model.enums.RoleType;
import lombok.Data;

@Data
public class RoleResponseDTO {
    private Long id;
    private RoleType roleType;
}
