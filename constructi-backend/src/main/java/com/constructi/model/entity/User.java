package com.constructi.model.entity;

import com.constructi.model.enums.ContratType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Last name is required.")
    @Size(max = 50, message = "Last name must not exceed 50 characters.")
    @Column(name = "last_name", nullable = false, length = 50)
    private String Lname;

    @NotBlank(message = "First name is required.")
    @Size(max = 50, message = "First name must not exceed 50 characters.")
    @Column(name = "first_name", nullable = false, length = 50)
    private String Fname;

    @Pattern(regexp = "^[0-9]{10}$", message = "Cell number must be exactly 10 digits.")
    @Column(name = "cell", length = 10)
    private String cell;

    @Email(message = "Email should be valid.")
    @NotNull(message = "Email is required.")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotNull(message = "Password is required.")
    @Size(min = 6, message = "Password must be at least 6 characters long.")
    @Column(name = "password", nullable = false)
    private String password;

    @DecimalMin(value = "0.0", inclusive = false, message = "Hourly rate must be greater than 0.")
    @Column(name = "rate_hourly")
    private Double RateHourly;

    @Enumerated(EnumType.STRING)
    @Column(name = "contrat_type")
    private ContratType contratType;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "password_update_expiry")
    private LocalDateTime passwordUpdateExpiry;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Task> tasks;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Invoice> invoices;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Project> projects;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference
    private Project project;


    @Override
    public String toString() {
        return "User{id=" + id + ", email=" + email + "}";
    }

}
