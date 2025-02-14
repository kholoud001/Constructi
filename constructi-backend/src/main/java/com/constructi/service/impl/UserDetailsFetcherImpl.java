package com.constructi.service.impl;

import com.constructi.DTO.UserRequestDTO;
import com.constructi.DTO.UserResponseDTO;
import com.constructi.model.entity.Role;
import com.constructi.model.entity.User;
import com.constructi.repository.RoleRepository;
import com.constructi.repository.UserRepository;
import com.constructi.mapper.UserMapper;
import com.constructi.service.UserDetailsFetcher;
import com.constructi.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.List;

@Service
public class UserDetailsFetcherImpl implements UserDetailsFetcher {
    private final UserService userService;

    public UserDetailsFetcherImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public User findByEmail(String email) {
        return userService.findByEmail(email);
    }
}
