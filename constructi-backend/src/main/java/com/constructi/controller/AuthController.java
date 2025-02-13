package com.constructi.controller;

import com.constructi.DTO.AuthenticationRequest;
import com.constructi.DTO.AuthenticationResponse;
import com.constructi.DTO.RegistrationRequest;
import com.constructi.DTO.ForgotPasswordRequest;
import com.constructi.DTO.ResetPasswordRequest;

import com.constructi.model.entity.Role;
import com.constructi.model.entity.User;
import com.constructi.model.enums.ContratType;
import com.constructi.model.enums.RoleType;
import com.constructi.repository.RoleRepository;
import com.constructi.security.JwtUtils;
import com.constructi.service.UserService;
import com.constructi.service.PasswordService;
import com.constructi.service.impl.CustomUserDetailsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final PasswordService passwordService;
    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegistrationRequest registrationRequest) {
        if (userService.existsByEmail(registrationRequest.getEmail())) {
            return ResponseEntity.badRequest().body("User already exists with this email");
        }

        User user = new User();
        user.setFname(registrationRequest.getFirstName());
        user.setLname(registrationRequest.getLastName());
        user.setCell(registrationRequest.getCell());
        user.setEmail(registrationRequest.getEmail());

        String hashedPassword = passwordEncoder.encode(registrationRequest.getPassword());
        user.setPassword(hashedPassword);

        user.setRateHourly(registrationRequest.getRateHourly());
        user.setContratType(ContratType.valueOf(registrationRequest.getContratType()));

        Role defaultRole = roleRepository.findByRoleType(RoleType.WORKER)
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        user.setRole(defaultRole);

        userService.save(user);

        return ResponseEntity.ok("User registered successfully");
    }



    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody @Valid AuthenticationRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(authRequest.getEmail());
        System.out.println("Authenticated user: " + userDetails.getUsername());

        User user = userService.findByEmail(authRequest.getEmail());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().getRoleType().name());
        System.out.println("Generated token: " + token);

        return ResponseEntity.ok(new AuthenticationResponse(token));
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        passwordService.sendResetPasswordEmail(request.getEmail());
        return ResponseEntity.ok("Password reset link sent to email");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordService.resetPassword(request);
        return ResponseEntity.ok("Password has been reset successfully");
    }

//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(HttpServletRequest request) {
//        passwordService.logout(request);
//        return ResponseEntity.ok("Logged out successfully");
//    }

}
