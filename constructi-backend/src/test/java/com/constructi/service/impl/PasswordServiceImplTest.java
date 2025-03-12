package com.constructi.service.impl;

import com.constructi.DTO.ResetPasswordRequest;
import com.constructi.model.entity.User;
import com.constructi.model.entity.PasswordResetToken;
import com.constructi.service.impl.PasswordServiceImpl;
import com.constructi.service.impl.EmailService;
import com.constructi.repository.UserRepository;
import com.constructi.repository.PasswordResetTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class PasswordServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PasswordServiceImpl passwordService;

    private User user;
    private PasswordResetToken token;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("test@example.com");
        user.setFname("John");

        token = new PasswordResetToken(user);
        token.setToken("dummy-token");
    }

    @Test
    void sendResetPasswordEmail_shouldSendEmailWhenUserExists() {
        // Arrange
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(tokenRepository.save(any(PasswordResetToken.class))).thenReturn(token);

        // Act
        passwordService.sendResetPasswordEmail(user.getEmail());

        // Assert
        verify(emailService, times(1)).sendHtmlEmail(eq(user.getEmail()), eq("Reset your password"), anyString());
        verify(tokenRepository, times(1)).save(any(PasswordResetToken.class));
    }

    @Test
    void sendResetPasswordEmail_shouldThrowExceptionWhenUserNotFound() {
        // Arrange
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            passwordService.sendResetPasswordEmail(user.getEmail());
        });
        assertEquals("User not found", thrown.getMessage());
    }

    @Test
    void resetPassword_shouldResetPasswordWhenTokenIsValid() {
        // Arrange
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("dummy-token");
        request.setNewPassword("new-password");

        when(tokenRepository.findByToken(request.getToken())).thenReturn(Optional.of(token));
        when(passwordEncoder.encode(request.getNewPassword())).thenReturn("encoded-password");
        when(userRepository.save(user)).thenReturn(user);

        // Act
        passwordService.resetPassword(request);

        // Assert
        verify(userRepository, times(1)).save(user);
        assertEquals("encoded-password", user.getPassword());
        verify(tokenRepository, times(1)).delete(token);
    }

    @Test
    void resetPassword_shouldThrowExceptionWhenTokenIsInvalid() {
        // Arrange
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("invalid-token");
        request.setNewPassword("new-password");

        when(tokenRepository.findByToken(request.getToken())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            passwordService.resetPassword(request);
        });
        assertEquals("Invalid or expired token", thrown.getMessage());
    }
}
