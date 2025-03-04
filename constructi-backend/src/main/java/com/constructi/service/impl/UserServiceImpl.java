package com.constructi.service.impl;

import com.constructi.DTO.ProfileUpdateRequestDTO;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private  RoleRepository roleRepository;
    @Autowired
    private  UserMapper userMapper;
    @Autowired
    @Lazy
    private  PasswordEncoder passwordEncoder;


    @Override
    public void save(User user) {

        userRepository.save(user);
    }

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
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
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
        existingUser.setRateHourly(userRequestDTO.getRateHourly());
        existingUser.setContratType(userRequestDTO.getContratType());

        if (userRequestDTO.getPassword() != null &&
                !userRequestDTO.getPassword().equals(existingUser.getPassword())) {
            existingUser.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }

        Role role = roleRepository.findById(userRequestDTO.getRoleId())
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));

        existingUser.setRole(role);

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponseDTO(updatedUser);
    }

    @Override
    @Transactional
    public UserResponseDTO updateUserProfile(Long id, ProfileUpdateRequestDTO profileUpdateRequestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setFname(profileUpdateRequestDTO.getFname());
        user.setLname(profileUpdateRequestDTO.getLname());
        user.setCell(profileUpdateRequestDTO.getCell());
        user.setPassword(passwordEncoder.encode(profileUpdateRequestDTO.getPassword()));

        userRepository.save(user);
        return userMapper.toResponseDTO(user);
    }


    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
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
    public void activateAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(true);
        user.setPasswordUpdateExpiry(null);
        userRepository.save(user);
    }


    @Override
    public void deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }







}
