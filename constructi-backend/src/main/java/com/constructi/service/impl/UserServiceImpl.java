package com.constructi.service.impl;

import com.constructi.DTO.UserRequestDTO;
import com.constructi.DTO.UserResponseDTO;
import com.constructi.model.entity.Role;
import com.constructi.model.entity.User;
import com.constructi.repository.RoleRepository;
import com.constructi.repository.UserRepository;
import com.constructi.mapper.UserMapper;
import com.constructi.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
//    private final PasswordEncoder passwordEncoder;



    @Override
    @Transactional
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        Role role = roleRepository.findById(userRequestDTO.getRoleId())
                .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + userRequestDTO.getRoleId()));


        User user = userMapper.toEntity(userRequestDTO);
        user.setRole(role);
        User savedUser = userRepository.save(user);
        return userMapper.toResponseDTO(savedUser);
    }

    @Override
    public List<UserResponseDTO> getUsers(){
        List<User> users = userRepository.findAll();
        return users.stream().map(userMapper::toResponseDTO).toList();

    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return userMapper.toResponseDTO(user);
    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!existingUser.getEmail().equals(userRequestDTO.getEmail()) &&
                userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        existingUser.setLname(userRequestDTO.getLname());
        existingUser.setFname(userRequestDTO.getFname());
        existingUser.setEmail(userRequestDTO.getEmail());
        existingUser.setPassword(userRequestDTO.getPassword());
        existingUser.setRateHourly(userRequestDTO.getRateHourly());
        existingUser.setContratType(userRequestDTO.getContratType());

        Role role = roleRepository.findById(userRequestDTO.getRoleId())
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));

        existingUser.setRole(role);

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponseDTO(updatedUser);
    }


    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
        userRepository.delete(user);
    }


    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }


    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public void save(User user) {
        userRepository.save(user);
    }



}
