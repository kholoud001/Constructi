package com.constructi.service.impl;

import com.constructi.DTO.ProjectRequestDTO;
import com.constructi.DTO.ProjectResponseDTO;
import com.constructi.exception.InvalidProjectDateException;
import com.constructi.mapper.ProjectMapper;
import com.constructi.mapper.UserMapper;
import com.constructi.model.entity.Project;
import com.constructi.model.entity.User;
import com.constructi.model.enums.ProjectState;
import com.constructi.repository.ProjectRepository;
import com.constructi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProjectServiceImplTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectMapper projectMapper;

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private Project project;
    private ProjectRequestDTO requestDTO;
    private ProjectResponseDTO responseDTO;
    private User user;

    @BeforeEach
    void setUp() {

        MockitoAnnotations.openMocks(this);

        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@example.com");

        SecurityContextHolder.setContext(securityContext);

        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setStartDate(LocalDate.now().minusDays(1));
        project.setEndDate(LocalDate.now().plusDays(5));
        project.setUser(user);
        project.setState(ProjectState.IN_PROGRESS);

        requestDTO = new ProjectRequestDTO();
        requestDTO.setName("Test Project");
        requestDTO.setStartDate(LocalDate.now().minusDays(1));
        requestDTO.setEndDate(LocalDate.now().plusDays(5));
        if (requestDTO.getState() == null) {
            requestDTO.setState(String.valueOf(ProjectState.IN_PROGRESS));
        }


        responseDTO = new ProjectResponseDTO();
        responseDTO.setName("Test Project");
    }

    private void mockAuthenticatedUser() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@example.com");
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void createProject_ShouldReturnProjectResponseDTO() {
        mockAuthenticatedUser();

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(projectMapper.toEntity(any())).thenReturn(project);
        when(projectRepository.save(any())).thenReturn(project);
        when(projectMapper.toDto(any())).thenReturn(responseDTO);

        ProjectResponseDTO result = projectService.createProject(requestDTO);

        assertNotNull(result);
        assertEquals("Test Project", result.getName());
    }

    @Test
    void createProject_ShouldThrowExceptionWhenDatesInvalid() {
        requestDTO.setStartDate(LocalDate.now().plusDays(1));
        requestDTO.setEndDate(LocalDate.now().minusDays(1));

        assertThrows(InvalidProjectDateException.class, () -> projectService.createProject(requestDTO));
    }

    @Test
    void updateProject_ShouldReturnUpdatedProject() {
        mockAuthenticatedUser();

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(projectRepository.findById(any())).thenReturn(Optional.of(project));
        when(projectMapper.toEntity(any())).thenReturn(project);
        when(projectRepository.save(any())).thenReturn(project);
        when(projectMapper.toDto(any())).thenReturn(responseDTO);

        ProjectResponseDTO result = projectService.updateProject(1L, requestDTO);

        assertNotNull(result);
        assertEquals("Test Project", result.getName());
    }

    @Test
    void updateProject_ShouldThrowExceptionWhenUserUnauthorized() {
        mockAuthenticatedUser();

        User anotherUser = new User();
        anotherUser.setId(2L);
        anotherUser.setEmail("anotheruser@example.com");
        project.setUser(anotherUser);

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(projectRepository.findById(any())).thenReturn(Optional.of(project));

        assertThrows(SecurityException.class, () -> projectService.updateProject(1L, requestDTO));
    }

    @Test
    void deleteProject_ShouldDeleteWhenExists() {
        when(projectRepository.existsById(anyLong())).thenReturn(true);
        doNothing().when(projectRepository).deleteById(anyLong());

        assertDoesNotThrow(() -> projectService.deleteProject(1L));
        verify(projectRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteProject_ShouldThrowExceptionWhenNotFound() {
        when(projectRepository.existsById(anyLong())).thenReturn(false);
        assertThrows(RuntimeException.class, () -> projectService.deleteProject(1L));
    }
}
