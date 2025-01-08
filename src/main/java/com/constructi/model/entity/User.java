package com.constructi.model.entity;

import com.constructi.model.enums.ContratType;
import com.constructi.model.enums.RoleType;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String Lname;

    @NotBlank
    @Size(max = 50)
    private String Fname;

    @Pattern(regexp = "^[0-9]+$")
    private String cell;

    @Email
    @NotNull
    private String email;

    @NotNull
    private String password;

    @Enumerated(EnumType.STRING)
    @NotNull
    private RoleType role;

    @Enumerated(EnumType.STRING)
    private ContratType contratType;

    @DecimalMin("0.0")
    private Double tauxHoraire;
}
