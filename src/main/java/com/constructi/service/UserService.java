package com.constructi.service;

import com.constructi.DTO.UserRequestDTO;
import com.constructi.DTO.UserResponseDTO;
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
    void deleteUser(Long id);
}
