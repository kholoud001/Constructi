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

    @NotBlank
    private String name;

    @Min(1)
    private Integer quantity;

    @DecimalMin("0.0")
    private Double priceUnit;

    @ManyToOne
    private Project project;

//    @ManyToOne
//    private Fournisseur fournisseur;
}
