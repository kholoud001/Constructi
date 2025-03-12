package com.constructi.service.impl;

import com.constructi.DTO.TaskRequestDTO;
import com.constructi.DTO.TaskResponseDTO;
import com.constructi.exception.TaskNotFoundException;
import com.constructi.mapper.TaskMapper;
import com.constructi.model.entity.*;
import com.constructi.model.enums.RoleType;
import com.constructi.repository.ProjectRepository;
import com.constructi.repository.SubtaskRepository;
import com.constructi.repository.TaskRepository;
import com.constructi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TaskMapper taskMapper;

    @Mock
    private Authentication authentication;

    @Mock
    private User user;

    @Mock
    private Project project;

    @Mock
    private Task task;

    @Mock
    private Subtask subtask;

    @Mock
    private TaskRequestDTO taskRequestDTO;

    @Mock
    private TaskResponseDTO taskResponseDTO;

    @Mock
    private SubtaskRepository subtaskRepository;


    @InjectMocks
    private TaskServiceImpl taskService;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
//        taskRequestDTO = new TaskRequestDTO();
//        taskResponseDTO = new TaskResponseDTO();
//        task = new Task();
//        user = new User();
//        project = new Project();
         subtask = new Subtask();



        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        when(authentication.getName()).thenReturn("user@example.com");

        // Mock the behavior of other dependencies
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        // Make sure projectRepository.findById() returns an Optional containing the mock project
        when(projectRepository.findById(anyLong())).thenReturn(Optional.of(project));

        when(taskMapper.toTaskEntity(any(TaskRequestDTO.class))).thenReturn(task);
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(taskMapper.toTaskResponseDTO(any(Task.class))).thenReturn(taskResponseDTO);
    }

    @Test
    void createTask_ShouldCreateTask() {
        TaskResponseDTO createdTask = taskService.createTask(taskRequestDTO);

        verify(userRepository).findByEmail(anyString());
        verify(projectRepository).findById(anyLong());
        verify(taskRepository).save(any(Task.class));
        assertNotNull(createdTask);
    }

    @Test
    void updateTask_ShouldUpdateTask() {
        // Mock behavior
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(taskRepository.findById(anyLong())).thenReturn(Optional.of(task));
        when(projectRepository.findById(anyLong())).thenReturn(Optional.of(project));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(taskMapper.toTaskResponseDTO(any(Task.class))).thenReturn(taskResponseDTO);

        // Call the service method
        TaskResponseDTO updatedTask = taskService.updateTask(1L, taskRequestDTO);

        // Verify interactions and assert the results
        verify(taskRepository).save(any(Task.class));
        assertNotNull(updatedTask);
    }

    @Test
    void deleteTask_ShouldDeleteTask() {
        // Mock behavior
        when(taskRepository.existsById(anyLong())).thenReturn(true);

        // Call the service method
        taskService.deleteTask(1L);

        // Verify interaction
        verify(taskRepository).deleteById(anyLong());
    }

    @Test
    void deleteTask_ShouldThrowTaskNotFoundException_WhenTaskNotFound() {
        when(taskRepository.existsById(anyLong())).thenReturn(false);

        assertThrows(TaskNotFoundException.class, () -> taskService.deleteTask(1L));
    }

    @Test
    void getTaskById_ShouldReturnTask() {
        when(taskRepository.findById(anyLong())).thenReturn(Optional.of(task));
        when(taskMapper.toTaskResponseDTO(any(Task.class))).thenReturn(taskResponseDTO);

        TaskResponseDTO fetchedTask = taskService.getTaskById(1L);

        verify(taskRepository).findById(anyLong());
        assertNotNull(fetchedTask);
    }

    @Test
    void getMyTasks_ShouldReturnTasksAssignedToUser() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(taskRepository.findByUserId(anyLong())).thenReturn(List.of(task));
        when(taskMapper.toTaskResponseDTO(any(Task.class))).thenReturn(taskResponseDTO);
        when(subtaskRepository.findByParentTaskId(anyLong())).thenReturn(List.of(subtask));

        List<TaskResponseDTO> tasks = taskService.getMyTasks();

        verify(taskRepository).findByUserId(anyLong());
        assertNotNull(tasks);
        assertFalse(tasks.isEmpty());
    }

    @Test
    void assignTaskToWorker_ShouldAssignTaskToWorker() {
        User architect = new User();
//        Role architectRole = new Role();
//        architectRole.setRoleType(RoleType.ARCHITECT);
//        architectRole.setUsers(new ArrayList<>());
        Role architectRole = mock(Role.class);
        when(architectRole.getRoleType()).thenReturn(RoleType.ADMIN);
        architect.setRole(architectRole);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(architect));
        when(taskRepository.findById(anyLong())).thenReturn(Optional.of(task));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(taskMapper.toTaskResponseDTO(any(Task.class))).thenReturn(taskResponseDTO);

        TaskResponseDTO assignedTask = taskService.assignTaskToWorker(1L, 1L);

        verify(taskRepository).save(any(Task.class));
        assertNotNull(assignedTask);
    }

    @Test
    void assignTaskToWorker_ShouldThrowException_WhenNotAdmin() {
        // Mock behavior
        User nonArchitect = new User();
        nonArchitect.setRole(new Role());
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(nonArchitect));

        assertThrows(RuntimeException.class, () -> taskService.assignTaskToWorker(1L, 1L));
    }

}