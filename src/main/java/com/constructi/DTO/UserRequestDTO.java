package com.constructi.DTO;

import com.constructi.model.enums.ContratType;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserRequestDTO {


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

    @DecimalMin(value = "0.0", inclusive = false, message = "Hourly rate must be greater than 0.")
    private Double rateHourly;

    @NotNull(message = "Contrat type is required.")
    private ContratType contratType;

    private Long roleId;
}
