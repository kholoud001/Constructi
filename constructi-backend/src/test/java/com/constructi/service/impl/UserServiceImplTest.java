//package com.constructi.service.impl;
//
//import com.constructi.DTO.UserRequestDTO;
//import com.constructi.DTO.UserResponseDTO;
//import com.constructi.mapper.UserMapper;
//import com.constructi.model.entity.Role;
//import com.constructi.model.entity.User;
//import com.constructi.model.enums.RoleType;
//import com.constructi.repository.RoleRepository;
//import com.constructi.repository.UserRepository;
//import jakarta.persistence.EntityNotFoundException;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class UserServiceImplTest {
//
//    @Mock
//    private UserRepository userRepository;
//
//    @Mock
//    private RoleRepository roleRepository;
//
//    @Mock
//    private UserMapper userMapper;
//
//    @Mock
//    private PasswordEncoder passwordEncoder;
//
//    private UserServiceImpl userService;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        userService = new UserServiceImpl(userRepository, roleRepository, userMapper, passwordEncoder);
//    }
//
//    @Test
//    void createUser_shouldCreateUserSuccessfully() {
//        // Arrange
//        UserRequestDTO userRequestDTO = new UserRequestDTO();
//        userRequestDTO.setEmail("test@example.com");
//        userRequestDTO.setRoleId(1L);
//
//        Role role = new Role(1L, RoleType.ADMIN, null);
//        User user = new User();
//        user.setEmail(userRequestDTO.getEmail());
//        user.setRole(role);
//
//        User savedUser = new User();
//        savedUser.setEmail("test@example.com");
//        savedUser.setRole(role);
//
//        UserResponseDTO responseDTO = new UserResponseDTO();
//        responseDTO.setEmail("test@example.com");
//
//        when(userRepository.existsByEmail(userRequestDTO.getEmail())).thenReturn(false);
//        when(roleRepository.findById(userRequestDTO.getRoleId())).thenReturn(Optional.of(role));
//        when(userMapper.toEntity(userRequestDTO)).thenReturn(user);
//        when(userRepository.save(user)).thenReturn(savedUser);
//        when(userMapper.toResponseDTO(savedUser)).thenReturn(responseDTO);
//
//        // Act
//        UserResponseDTO result = userService.createUser(userRequestDTO);
//
//        // Assert
//        assertNotNull(result);
//        assertEquals("test@example.com", result.getEmail());
//        verify(userRepository, times(1)).save(user);
//    }
//
//    @Test
//    void createUser_shouldThrowExceptionIfEmailAlreadyExists() {
//        // Arrange
//        UserRequestDTO userRequestDTO = new UserRequestDTO();
//        userRequestDTO.setEmail("test@example.com");
//
//        when(userRepository.existsByEmail(userRequestDTO.getEmail())).thenReturn(true);
//
//        // Act & Assert
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            userService.createUser(userRequestDTO);
//        });
//        assertEquals("Email is already in use.", exception.getMessage());
//    }
//
//    @Test
//    void getUsers_shouldReturnListOfUsers() {
//        // Arrange
//        User user1 = new User();
//        user1.setEmail("user1@example.com");
//        User user2 = new User();
//        user2.setEmail("user2@example.com");
//        List<User> users = List.of(user1, user2);
//
//        UserResponseDTO responseDTO1 = new UserResponseDTO();
//        responseDTO1.setEmail("user1@example.com");
//        UserResponseDTO responseDTO2 = new UserResponseDTO();
//        responseDTO2.setEmail("user2@example.com");
//        List<UserResponseDTO> responseDTOs = List.of(responseDTO1, responseDTO2);
//
//        when(userRepository.findAll()).thenReturn(users);
//        when(userMapper.toResponseDTO(user1)).thenReturn(responseDTO1);
//        when(userMapper.toResponseDTO(user2)).thenReturn(responseDTO2);
//
//        // Act
//        List<UserResponseDTO> result = userService.getUsers();
//
//        // Assert
//        assertNotNull(result);
//        assertEquals(2, result.size());
//    }
//
//    @Test
//    void getUserById_shouldReturnUserIfExists() {
//        // Arrange
//        User user = new User();
//        user.setEmail("test@example.com");
//
//        UserResponseDTO responseDTO = new UserResponseDTO();
//        responseDTO.setEmail("test@example.com");
//
//        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
//        when(userMapper.toResponseDTO(user)).thenReturn(responseDTO);
//
//        // Act
//        UserResponseDTO result = userService.getUserById(1L);
//
//        // Assert
//        assertNotNull(result);
//        assertEquals("test@example.com", result.getEmail());
//    }
//
//    @Test
//    void getUserById_shouldThrowExceptionIfUserNotFound() {
//        // Arrange
//        when(userRepository.findById(1L)).thenReturn(Optional.empty());
//
//        // Act & Assert
//        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
//            userService.getUserById(1L);
//        });
//        assertEquals("User not found", exception.getMessage());
//    }
//
//    @Test
//    void updateUser_shouldUpdateUserSuccessfully() {
//        // Arrange
//        UserRequestDTO userRequestDTO = new UserRequestDTO();
//        userRequestDTO.setEmail("updated@example.com");
//
//        User existingUser = new User();
//        existingUser.setEmail("old@example.com");
//
//        Role role = new Role();
//        User updatedUser = new User();
//        updatedUser.setEmail(userRequestDTO.getEmail());
//        updatedUser.setRole(role);
//
//        UserResponseDTO responseDTO = new UserResponseDTO();
//        responseDTO.setEmail(userRequestDTO.getEmail());
//
//        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
//        when(userRepository.existsByEmail(userRequestDTO.getEmail())).thenReturn(false);
//        when(userMapper.toEntity(userRequestDTO)).thenReturn(updatedUser);
//        when(userRepository.save(updatedUser)).thenReturn(updatedUser);
//        when(userMapper.toResponseDTO(updatedUser)).thenReturn(responseDTO);
//
//        // Act
//        UserResponseDTO result = userService.updateUser(1L, userRequestDTO);
//
//        // Assert
//        assertNotNull(result);
//        assertEquals("updated@example.com", result.getEmail());
//        verify(userRepository, times(1)).save(updatedUser);
//    }
//
//    @Test
//    void updateUser_shouldThrowExceptionIfEmailAlreadyExists() {
//        // Arrange
//        UserRequestDTO userRequestDTO = new UserRequestDTO();
//        userRequestDTO.setEmail("updated@example.com");
//
//        User existingUser = new User();
//        existingUser.setEmail("old@example.com");
//
//        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
//        when(userRepository.existsByEmail(userRequestDTO.getEmail())).thenReturn(true);
//
//        // Act & Assert
//        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
//            userService.updateUser(1L, userRequestDTO);
//        });
//        assertEquals("Email is already in use.", exception.getMessage());
//    }
//
//    @Test
//    void deleteUser_shouldDeleteUserIfExists() {
//        // Arrange
//        User user = new User();
//        user.setEmail("test@example.com");
//
//        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
//
//        // Act
//        userService.deleteUser(1L);
//
//        // Assert
//        verify(userRepository, times(1)).delete(user);
//    }
//
//    @Test
//    void deleteUser_shouldThrowExceptionIfUserNotFound() {
//        // Arrange
//        when(userRepository.findById(1L)).thenReturn(Optional.empty());
//
//        // Act & Assert
//        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
//            userService.deleteUser(1L);
//        });
//        assertEquals("User not found", exception.getMessage());
//    }
//
//    @Test
//    void findByEmail_shouldReturnUserIfExists() {
//        // Arrange
//        User user = new User();
//        user.setEmail("test@example.com");
//
//        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
//
//        // Act
//        User result = userService.findByEmail("test@example.com");
//
//        // Assert
//        assertNotNull(result);
//        assertEquals("test@example.com", result.getEmail());
//    }
//
//    @Test
//    void findByEmail_shouldThrowExceptionIfUserNotFound() {
//        // Arrange
//        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
//
//        // Act & Assert
//        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
//            userService.findByEmail("test@example.com");
//        });
//        assertEquals("User not found with email: test@example.com", exception.getMessage());
//    }
//
//    @Test
//    void existsByEmail_shouldReturnTrueIfEmailExists() {
//        // Arrange
//        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
//
//        // Act
//        boolean result = userService.existsByEmail("test@example.com");
//
//        // Assert
//        assertTrue(result);
//    }
//
//    @Test
//    void existsByEmail_shouldReturnFalseIfEmailDoesNotExist() {
//        // Arrange
//        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
//
//        // Act
//        boolean result = userService.existsByEmail("test@example.com");
//
//        // Assert
//        assertFalse(result);
//    }
//
//    @Test
//    void save_shouldSaveUser() {
//        User user = new User();
//        user.setEmail("test@example.com");
//
//        // Act
//        userService.save(user);
//
//        // Assert
//        verify(userRepository, times(1)).save(user);
//    }
//
//
//
//    }