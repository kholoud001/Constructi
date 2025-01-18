package com.constructi.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProviderRequestDTO {
    @NotBlank(message = "Provider name is required.")
    @Size(max = 100, message = "Provider name must not exceed 100 characters.")
    private String name;
}
