package com.constructi.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "materials")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Material name is required.")
    @Size(max = 100, message = "Material name must not exceed 100 characters.")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotNull(message = "Quantity is required.")
    @Min(value = 1, message = "Quantity must be at least 1.")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotNull(message = "Price per unit is required.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price per unit must be greater than 0.")
    @Column(name = "price_unit", nullable = false)
    private Double priceUnit;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @NotNull(message = "Material must be associated with a project.")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    @NotNull(message = "Material must be associated with a provider.")
    private Provider provider;
}
