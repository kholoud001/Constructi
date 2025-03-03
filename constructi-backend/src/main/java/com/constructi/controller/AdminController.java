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

        // Generate a random password
        String randomPassword = generateRandomPassword();
        String hashedPassword = passwordEncoder.encode(randomPassword);
        String loginUrl ="http://localhost:4200/auth/login";

        // Create the user
        User user = new User();
        user.setFname(registrationRequest.getFirstName());
        user.setLname(registrationRequest.getLastName());
        user.setCell(registrationRequest.getCell());
        user.setEmail(registrationRequest.getEmail());
        user.setPassword(hashedPassword);
        user.setRateHourly(registrationRequest.getRateHourly());
        user.setContratType(ContratType.valueOf(registrationRequest.getContratType()));

        Role defaultRole = roleRepository.findByRoleType(RoleType.WORKER)
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        user.setRole(defaultRole);

        userService.save(user);
        sendCredentialsEmail(user, randomPassword , loginUrl);

        return ResponseEntity.ok("User registered successfully");
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
        String emailContent = """
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { text-align: center; padding: 20px 0; }
                .logo { width: 100px; height: auto; margin-bottom: 15px; }
                h2 { color: #2563eb; margin-top: 0; font-weight: 600; }
                .content { padding: 20px; }
                .credentials-box { background-color: #f0f7ff; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb; }
                .btn-container { text-align: center; margin: 30px 0; }
                .btn-login { display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: 500; transition: background-color 0.3s; }
                .btn-login:hover { background-color: #1d4ed8; }
                .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; margin-top: 20px; color: #666; font-size: 14px; }
                p { margin: 10px 0; }
                strong { color: #333; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://media-hosting.imagekit.io//6a2add728e6e44d0/logo-black.png?Expires=1835622901&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=bBxCKQPMzfwgT8unST5rHsIifcRRIK3EnjtU8CS0kMNtN69IdALPdrWqRRdOLiDSHPLcxNSzNLZS4OPrNayTcmBUzB~5W0IkGsXK5L3E8wnAbhLhfnu3S2hukRJL~XpKoZUvX~L~fmob5fUw5jrmYsvH2~hhnqu2tvuiMfclnuQF2g8g2KQNFIBJPfMZTeOlyk06eRRRv00rbnB6LOwlLEIWkRQi2rFaEO1KSxb~sNVG62ica2mCsvMNozqBwjTWzortH1icmlhE9m72HwRabjO6CAexLd7-dgbjlofeFmG2SgDGmahh2F73Q7w4jfpGvT8EHcfwifbeXkfW2JCOlA__" 
                    alt="Constructi Logo" class="logo">
                    <h2>Welcome to Constructi</h2>
                </div>
                <div class="content">
                    <p>Hello %s,</p>
                    <p>Your account has been created by the admin. Here are your login credentials:</p>
                    
                    <div class="credentials-box">
                        <p><strong>Email:</strong> %s</p>
                        <p><strong>Password:</strong> %s</p>
                    </div>
                    
                    <p>Please log in and change your password after your first login for security purposes.</p>
                    
                    <div class="btn-container">
                        <a href="%s" class="btn-login">Login to Your Account</a>
                    </div>
                    
                    <p>If you have any questions, please contact our support team.</p>
                </div>
                <div class="footer">
                    <p>Thank you,<br><strong>Constructi Team</strong></p>
                    <p>&copy; 2025 Constructi. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(user.getFname(), user.getEmail(), password, loginUrl);

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



}