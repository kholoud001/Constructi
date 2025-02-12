package com.constructi.service.impl;

import com.constructi.model.entity.User;
import com.constructi.model.entity.Role;
import com.constructi.model.enums.RoleType;
import com.constructi.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;


@ExtendWith(MockitoExtension.class)
public class CustomUserDetailsServiceTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    private User user;
    private String email = "test@example.com";
    private String password = "password";
    private Role role;

    @BeforeEach
    void setUp() {
        role = new Role();
        role.setRoleType(RoleType.valueOf("WORKER"));
        user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
    }

    @Test
    void loadUserByUsername_ShouldReturnUserDetails_WhenUserExists() {
        when(userService.findByEmail(email)).thenReturn(user);

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

        assertNotNull(userDetails);
        assertEquals(email, userDetails.getUsername());
        assertEquals(password, userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_WORKER")));

        verify(userService).findByEmail(email);
    }

    @Test
    void loadUserByUsername_ShouldThrowUsernameNotFoundException_WhenUserDoesNotExist() {
        when(userService.findByEmail(email)).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> {
            customUserDetailsService.loadUserByUsername(email);
        });

        verify(userService).findByEmail(email);
    }
}