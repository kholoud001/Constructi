package com.constructi.model.entity;

import com.constructi.model.enums.RoleType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Role type is required.")
    @Column(name = "role_type", nullable = false, unique = true)
    private RoleType roleType;

    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<User> users;


    @Override
    public String toString() {
        return "Role{id=" + id + ", roleType=" + roleType + "}";
    }

}
