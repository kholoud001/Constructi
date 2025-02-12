package com.constructi.service.impl;

import com.constructi.model.entity.Role;
import com.constructi.model.enums.RoleType;
import com.constructi.repository.RoleRepository;
import com.constructi.service.RoleService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @PostConstruct
    public void seedRoles() {
        for (RoleType roleType : RoleType.values()) {
            if (!roleRepository.existsByRoleType(roleType)) {
                Role role = new Role();
                role.setRoleType(roleType);
                roleRepository.save(role);
            }
        }
    }

}
