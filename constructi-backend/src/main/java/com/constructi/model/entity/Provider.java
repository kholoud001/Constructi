package com.constructi.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "providers")
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Provider name is required.")
    @Size(max = 100, message = "Provider name must not exceed 100 characters.")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Phone number is required.")
    @Size(max = 20, message = "Phone number must not exceed 20 characters.")
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @NotBlank(message = "Address is required.")
    @Size(max = 255, message = "Address must not exceed 255 characters.")
    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Material> materialsList;
}