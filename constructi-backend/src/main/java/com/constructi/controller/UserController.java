package com.constructi.controller;

import com.constructi.DTO.ProfileUpdateRequestDTO;
import com.constructi.DTO.UserRequestDTO;
import com.constructi.DTO.UserResponseDTO;
import com.constructi.service.UserService;
import com.constructi.model.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ARCHITECT', 'ROLE_WORKER')")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        try {
            UserResponseDTO response = userService.getUserById(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }


    @PutMapping("/update/{id}")
    @PreAuthorize("#id == authentication.principal.id or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<UserResponseDTO> updateUserProfile(
            @PathVariable Long id,
            @Valid @RequestBody ProfileUpdateRequestDTO profileUpdateRequestDTO) {
        try {
            UserResponseDTO response = userService.updateUserProfile(id, profileUpdateRequestDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

        @GetMapping("/profile")
        public ResponseEntity<UserResponseDTO> getCurrentUserProfile() {
            Long userId = getCurrentUserId();
            try {
                UserResponseDTO response = userService.getUserById(userId);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } catch (EntityNotFoundException e) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        }


    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userService.findByEmail(email);
        return user.getId();
    }


}