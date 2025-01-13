package com.constructi.DTO;

import com.constructi.model.enums.ContratType;
import com.constructi.model.enums.RoleType;
import jakarta.validation.constraints.*;

import lombok.Data;
import java.util.List;


@Data
public class UserDTO {

    private Long id;

    @NotBlank(message = "Last name is required.")
    @Size(max = 50, message = "Last name must not exceed 50 characters.")
    private String lname;

    @NotBlank(message = "First name is required.")
    @Size(max = 50, message = "First name must not exceed 50 characters.")
    private String fname;

    @Pattern(regexp = "^[0-9]{10}$", message = "Cell number must be exactly 10 digits.")
    private String cell;

    @Email(message = "Email should be valid.")
    @NotNull(message = "Email is required.")
    private String email;

    @NotNull(message = "Password is required.")
    @Size(min = 6, message = "Password must be at least 6 characters long.")
    private String password;

//    private RoleType role;

    private ContratType contratType;

    @DecimalMin(value = "0.0", inclusive = false, message = "Hourly rate must be greater than 0.")
    private Double tauxHoraire;

    @NotNull(message = "Role is required.")
    private RoleDTO role;

    private List<TaskDTO> tasks;
    private List<InvoiceDTO> invoices;
    private List<ProjectDTO> projects;

}
