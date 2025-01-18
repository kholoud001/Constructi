package com.constructi.DTO;

import com.constructi.model.enums.RoleType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleRequestDTO {
    @NotNull(message = "Role type is required.")
    private RoleType roleType;
}
