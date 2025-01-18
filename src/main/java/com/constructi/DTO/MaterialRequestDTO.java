package com.constructi.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class MaterialRequestDTO {
    @NotBlank(message = "Material name is required.")
    @Size(max = 100, message = "Material name must not exceed 100 characters.")
    private String name;

    @NotNull(message = "Quantity is required.")
    @Min(value = 1, message = "Quantity must be at least 1.")
    private Integer quantity;

    @NotNull(message = "Price per unit is required.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price per unit must be greater than 0.")
    private Double priceUnit;

    @NotNull(message = "Project ID is required.")
    private Long projectId;

    @NotNull(message = "Provider ID is required.")
    private Long providerId;
}
