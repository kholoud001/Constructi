package com.constructi.DTO;

import com.constructi.model.enums.RoleType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {

    private Long id;

    @NotNull(message = "Role type is required.")
    private RoleType roleType;

    @Size(min = 1, message = "At least one user must be associated with the role.")
    //private List<Long> userIds;
    private List<UserDTO> userDTOS;
}