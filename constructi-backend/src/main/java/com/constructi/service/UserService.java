package com.constructi.service;

import com.constructi.DTO.ProfileUpdateRequestDTO;
import com.constructi.DTO.UserRequestDTO;
import com.constructi.DTO.UserResponseDTO;
import com.constructi.model.entity.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserService {
    @Transactional
    UserResponseDTO createUser(UserRequestDTO userRequestDTO);

    List<UserResponseDTO> getUsers();

    UserResponseDTO getUserById(Long id);

    @Transactional
    UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO);

    @Transactional
    UserResponseDTO updateUserProfile(Long id, ProfileUpdateRequestDTO profileUpdateRequestDTO);

    @Transactional
    void deleteUser(Long id);

    User findByEmail(String email);

    boolean existsByEmail(String email);

    void save(User user);


    void activateAccount(Long userId);

    void deactivateUser(Long id);
}
