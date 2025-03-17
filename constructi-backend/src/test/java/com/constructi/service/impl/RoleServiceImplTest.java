package com.constructi.service.impl;

import com.constructi.model.entity.Role;
import com.constructi.model.enums.RoleType;
import com.constructi.repository.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RoleServiceImplTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleServiceImpl roleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSeedRoles_ShouldSaveRolesWhenNotExist() {
        // Arrange
        for (RoleType roleType : RoleType.values()) {
            when(roleRepository.existsByRoleType(roleType)).thenReturn(false);
        }

        // Act
        roleService.seedRoles();

        // Assert
        for (RoleType roleType : RoleType.values()) {
            verify(roleRepository).existsByRoleType(roleType);
        }
        verify(roleRepository, times(RoleType.values().length)).save(any(Role.class));
    }

    @Test
    void testSeedRoles_ShouldNotSaveRolesWhenExist() {
        // Arrange
        for (RoleType roleType : RoleType.values()) {
            when(roleRepository.existsByRoleType(roleType)).thenReturn(true);
        }

        // Act
        roleService.seedRoles();

        // Assert
        for (RoleType roleType : RoleType.values()) {
            verify(roleRepository).existsByRoleType(roleType);
            verify(roleRepository, never()).save(any(Role.class));
        }
    }
}