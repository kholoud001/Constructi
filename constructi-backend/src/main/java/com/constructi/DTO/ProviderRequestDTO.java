package com.constructi.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProviderRequestDTO {
    @NotBlank(message = "Provider name is required.")
    @Size(max = 100, message = "Provider name must not exceed 100 characters.")
    private String name;

    @NotBlank(message = "Phone number is required.")
    @Size(max = 20, message = "Phone number must not exceed 20 characters.")
    private String phone;

    @NotBlank(message = "Address is required.")
    @Size(max = 255, message = "Address must not exceed 255 characters.")
    private String address;
}