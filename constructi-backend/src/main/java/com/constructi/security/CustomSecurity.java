package com.constructi.security;

import com.constructi.model.entity.User;
import com.constructi.service.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component("customSecurity")
public class CustomSecurity {

    private final UserService userService;

    public CustomSecurity(UserService userService) {
        this.userService = userService;
    }

    public boolean isOwnerOrAdmin(Long id, Object principal) {
        if (principal instanceof UserDetails userDetails) {
            String email = userDetails.getUsername();
            User user = userService.findByEmail(email);
            if (user == null) {
                return false; // User not found
            }
            return user.getId().equals(id) || user.getRole().getRoleType().name().equals("ROLE_ADMIN");
        }
        return false;
    }
}