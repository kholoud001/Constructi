package com.constructi.service.impl;

import com.constructi.DTO.ProfileUpdateRequestDTO;
import com.constructi.DTO.UserRequestDTO;
import com.constructi.DTO.UserResponseDTO;
import com.constructi.model.entity.Role;
import com.constructi.model.entity.User;
import com.constructi.model.enums.RoleType;
import com.constructi.repository.RoleRepository;
import com.constructi.repository.UserRepository;
import com.constructi.mapper.UserMapper;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private UserRequestDTO userRequestDTO;
    private UserResponseDTO userResponseDTO;
    private Role role;

    @BeforeEach
    void setUp() {
        role = new Role();
        role.setId(1L);
        role.setRoleType(RoleType.WORKER);

        user = new User();
        user.setId(1L);
        user.setFname("John");
        user.setLname("Doe");
        user.setEmail("john@example.com");
        user.setPassword("password123");
        user.setRole(role);

        userRequestDTO = new UserRequestDTO();
        userRequestDTO.setFname("John");
        userRequestDTO.setLname("Doe");
        userRequestDTO.setEmail("john@example.com");
        userRequestDTO.setPassword("password123");
        userRequestDTO.setRoleId(1L);

        userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(1L);
        userResponseDTO.setFname("John");
        userResponseDTO.setLname("Doe");
        userResponseDTO.setEmail("john@example.com");
    }

    @Test
    void createUser_Success() {
        when(userRepository.existsByEmail(userRequestDTO.getEmail())).thenReturn(false);
        when(roleRepository.findById(userRequestDTO.getRoleId())).thenReturn(Optional.of(role));
        when(userMapper.toEntity(userRequestDTO)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponseDTO(user)).thenReturn(userResponseDTO);

        UserResponseDTO result = userService.createUser(userRequestDTO);

        assertNotNull(result);
        assertEquals(userResponseDTO.getEmail(), result.getEmail());
        verify(userRepository).save(user);
    }

    @Test
    void createUser_EmailAlreadyExists_ThrowsException() {
        when(userRepository.existsByEmail(userRequestDTO.getEmail())).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> userService.createUser(userRequestDTO));
    }

    @Test
    void getUserById_UserExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toResponseDTO(user)).thenReturn(userResponseDTO);

        UserResponseDTO result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(userResponseDTO.getEmail(), result.getEmail());
    }

    @Test
    void getUserById_UserNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> userService.getUserById(1L));
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        doNothing().when(userRepository).delete(user);
        userService.deleteUser(1L);
        verify(userRepository).delete(user);
    }

    @Test
    void deleteUser_UserNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> userService.deleteUser(1L));
    }

    @Test
    void findByEmail_Success() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        User foundUser = userService.findByEmail("john@example.com");
        assertNotNull(foundUser);
        assertEquals(user.getEmail(), foundUser.getEmail());
    }

    @Test
    void findByEmail_NotFound_ThrowsException() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> userService.findByEmail("notfound@example.com"));
    }

    @Test
    void activateAccount_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        doNothing().when(emailService).sendHtmlEmail(anyString(), anyString(), anyString());

        userService.activateAccount(1L);

        assertTrue(user.isActive());
        assertNotNull(user.getPassword());
        verify(userRepository).save(user);
    }


    @Test
    void deactivateUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        userService.deactivateUser(1L);
        assertFalse(user.isActive());
        verify(userRepository).save(user);
    }


    @Test
    void updateUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail(userRequestDTO.getEmail())).thenReturn(false);
        when(roleRepository.findById(userRequestDTO.getRoleId())).thenReturn(Optional.of(role));
        when(passwordEncoder.encode(userRequestDTO.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toResponseDTO(any(User.class))).thenReturn(userResponseDTO);

        UserResponseDTO result = userService.updateUser(1L, userRequestDTO);

        assertNotNull(result);
        assertEquals("John", result.getFname());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_UserNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> userService.updateUser(1L, userRequestDTO));
    }

    @Test
    void updateUser_EmailAlreadyExists_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail(userRequestDTO.getEmail())).thenReturn(true);

        assertThrows(EntityNotFoundException.class, () -> userService.updateUser(1L, userRequestDTO));
    }

    @Test
    void updateUser_RoleNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail(userRequestDTO.getEmail())).thenReturn(false);
        when(roleRepository.findById(userRequestDTO.getRoleId())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> userService.updateUser(1L, userRequestDTO));
    }

    @Test
    void updateUserProfile_Success() {
        ProfileUpdateRequestDTO profileUpdateRequestDTO = new ProfileUpdateRequestDTO();
        profileUpdateRequestDTO.setFname("Jane");
        profileUpdateRequestDTO.setLname("Smith");
        profileUpdateRequestDTO.setCell("123456789");
        profileUpdateRequestDTO.setPassword("newpassword");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(profileUpdateRequestDTO.getPassword())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toResponseDTO(any(User.class))).thenReturn(userResponseDTO);

        UserResponseDTO result = userService.updateUserProfile(1L, profileUpdateRequestDTO);

        assertNotNull(result);
//        assertEquals("Jane", result.getFname());
//        assertEquals("Smith", result.getLname());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUserProfile_UserNotFound_ThrowsException() {
        ProfileUpdateRequestDTO profileUpdateRequestDTO = new ProfileUpdateRequestDTO();
        profileUpdateRequestDTO.setFname("Jane");

        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> userService.updateUserProfile(1L, profileUpdateRequestDTO));
    }



}