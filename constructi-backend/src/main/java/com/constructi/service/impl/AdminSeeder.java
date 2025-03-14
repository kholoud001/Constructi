package com.constructi.service.impl;

import com.constructi.model.entity.Role;
import com.constructi.model.entity.User;
import com.constructi.model.enums.ContratType;
import com.constructi.model.enums.RoleType;
import com.constructi.repository.RoleRepository;
import com.constructi.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AdminSeeder {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Transactional
    public ApplicationRunner seedAdminUser() {
        return args -> {
            Optional<Role> adminRoleOpt = roleRepository.findByRoleType(RoleType.ADMIN);
            if (adminRoleOpt.isEmpty()) {
                return;
            }

            Role adminRole = adminRoleOpt.get();

            if (userRepository.findByEmail("kholoud.sanak@gmail.com").isEmpty()) {
                User admin = User.builder()
                        .Fname("Kholoud")
                        .Lname("Sanak")
                        .cell("1234567890")
                        .email("kholoud.sanak@gmail.com")
                        .password(passwordEncoder.encode("adminadmin"))
                        .RateHourly(35.5)
                        .contratType(ContratType.FULL_TIME)
                        .role(adminRole)
                        .active(true)
                        .build();

                userRepository.save(admin);
                System.out.println("✅ Admin user created successfully.");
            } else {
                System.out.println("ℹ️ Admin user already exists.");
            }
        };
    }
}