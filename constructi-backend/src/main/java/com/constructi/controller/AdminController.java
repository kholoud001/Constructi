package com.constructi.controller;

import com.constructi.DTO.RegistrationRequest;
import com.constructi.DTO.UserRequestDTO;
import com.constructi.DTO.UserResponseDTO;
import com.constructi.model.enums.ContratType;
import com.constructi.model.enums.RoleType;
import com.constructi.repository.RoleRepository;
import com.constructi.service.RoleService;
import com.constructi.service.UserService;
import com.constructi.model.entity.User;

import com.constructi.service.impl.EmailService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.constructi.model.entity.Role;
import com.constructi.util.EmailTemplateUtil;


import java.time.LocalDateTime;
import java.util.Random;



import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final RoleService roleService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final EmailService emailService;



    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegistrationRequest registrationRequest) {
        if (userService.existsByEmail(registrationRequest.getEmail())) {
            return ResponseEntity.badRequest().body("User already exists with this email");
        }

        String randomPassword = generateRandomPassword();
        String hashedPassword = passwordEncoder.encode(randomPassword);
        String loginUrl = "http://localhost:4200/auth/login";

        User user = createUserFromRequest(registrationRequest, hashedPassword);
//        user.setPasswordUpdateExpiry(LocalDateTime.now().plusDays(7));
        user.setPasswordUpdateExpiry(LocalDateTime.now().plusHours(1)); // Set expiry to 1 hour from now

        user.setActive(true);
        userService.save(user);
        sendCredentialsEmail(user, randomPassword, loginUrl);

        return ResponseEntity.ok("User registered successfully");
    }

    private User createUserFromRequest(RegistrationRequest request, String hashedPassword) {
        Role defaultRole = roleRepository.findByRoleType(RoleType.WORKER)
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        return User.builder()
                .Fname(request.getFirstName())
                .Lname(request.getLastName())
                .cell(request.getCell())
                .email(request.getEmail())
                .password(hashedPassword)
                .RateHourly(request.getRateHourly())
                .contratType(ContratType.valueOf(request.getContratType()))
                .role(defaultRole)
                .build();
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        StringBuilder password = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 12; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }

    private void sendCredentialsEmail(User user, String password, String loginUrl) {
        String emailContent = EmailTemplateUtil.generateCredentialsEmail(user.getFname(), user.getEmail(), password, loginUrl);
        emailService.sendHtmlEmail(user.getEmail(), "Your Account Credentials", emailContent);
    }




    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return roleService.findAllRoles();
    }


    @PostMapping("/users/add")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        try {
            UserResponseDTO response = userService.createUser(userRequestDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        try {
            UserResponseDTO response = userService.getUserById(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> userResponseDTOs = userService.getUsers();
        return new ResponseEntity<>(userResponseDTOs, HttpStatus.OK);
    }

    @PutMapping("/users/update/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO userRequestDTO) {
        try {
            UserResponseDTO response = userService.updateUser(id, userRequestDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User with ID " + id + " has been successfully deleted.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User with ID " + id + " was not found.");
        }
    }

    @PutMapping("/users/activate/{id}")
    public ResponseEntity<String> activateUser(@PathVariable Long id) {
        userService.activateAccount(id);
        return ResponseEntity.ok("User activated successfully");
    }

    @PutMapping("/users/deactivate/{id}")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.ok("User deactivated successfully");
    }



}