package com.constructi.service.impl;

import com.constructi.DTO.TaskRequestDTO;
import com.constructi.DTO.TaskResponseDTO;
import com.constructi.exception.TaskNotFoundException;
import com.constructi.mapper.SubtaskMapper;
import com.constructi.mapper.TaskMapper;
import com.constructi.model.entity.Project;
import com.constructi.model.entity.Subtask;
import com.constructi.model.entity.Task;
import com.constructi.model.entity.User;
import com.constructi.model.enums.RoleType;
import com.constructi.model.enums.StatusTask;
import com.constructi.repository.ProjectRepository;
import com.constructi.repository.SubtaskRepository;
import com.constructi.repository.TaskRepository;
import com.constructi.repository.UserRepository;
import com.constructi.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final SubtaskRepository subtaskRepository;
    private final SubtaskMapper subtaskMapper;

    @Override
    public TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO) {
        String authenticatedUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User authenticatedUser = userRepository.findByEmail(authenticatedUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Project project = projectRepository.findById(taskRequestDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Task task = taskMapper.toTaskEntity(taskRequestDTO);
        task.setProject(project);
        task.setUser(authenticatedUser);

        Task savedTask = taskRepository.save(task);
        return taskMapper.toTaskResponseDTO(savedTask);
    }


    @Override
    public TaskResponseDTO updateTask(Long taskId, TaskRequestDTO taskRequestDTO) {
        String authenticatedUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User authenticatedUser = userRepository.findByEmail(authenticatedUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Project project = projectRepository.findById(taskRequestDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        existingTask.setDescription(taskRequestDTO.getDescription());
        existingTask.setStatus(taskRequestDTO.getStatus());
        existingTask.setBeginDate(taskRequestDTO.getBeginDate());
        existingTask.setDateEndEstimated(taskRequestDTO.getDateEndEstimated());
        existingTask.setEffectiveTime(taskRequestDTO.getEffectiveTime());
        existingTask.setProject(project);
        existingTask.setUser(authenticatedUser);

        Task updatedTask = taskRepository.save(existingTask);
        return taskMapper.toTaskResponseDTO(updatedTask);
    }

    @Override
    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new TaskNotFoundException("Task with ID " + taskId + " does not exist.");
        }
        taskRepository.deleteById(taskId);
    }


    @Override
    public TaskResponseDTO getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        TaskResponseDTO dto = taskMapper.toTaskResponseDTO(task);
        dto.setProgress(TaskMapper.calculateTaskProgress(task.getSubtasks()));
        return dto;
    }


    @Override
    public List<TaskResponseDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(task -> {
                    TaskResponseDTO dto = taskMapper.toTaskResponseDTO(task);
                    dto.setProgress(calculateTaskProgress(task));
                    return dto;
                })
                .toList();
    }

    @Override
    public List<TaskResponseDTO> getTasksAssignedToWorker() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User worker = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        List<Task> tasks = taskRepository.findByUser(worker);

        return tasks.stream()
                .map(task -> {
                    TaskResponseDTO dto = taskMapper.toTaskResponseDTO(task);
                    dto.setProgress(calculateTaskProgress(task));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDTO> getMyTasks() {
        String authenticatedUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Long userId = userRepository.findByEmail(authenticatedUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        List<Task> tasks = taskRepository.findByUserId(userId);
        return tasks.stream()
                .map(task -> {
                    TaskResponseDTO dto = taskMapper.toTaskResponseDTO(task);
                    dto.setProgress(calculateTaskProgress(task)); // Calculate progress
                    return dto;
                })
                .toList();
    }


    @Override
    public TaskResponseDTO assignTaskToWorker(Long taskId, Long workerId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() == null || admin.getRole().getRoleType() != RoleType.ADMIN  ) {
            throw new RuntimeException("Only admin can assign tasks");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        task.setUser(worker);
        Task updatedTask = taskRepository.save(task);

        return taskMapper.toTaskResponseDTO(updatedTask);
    }



    @Override
    public TaskResponseDTO getTaskWithInvoices(Long taskId) {
        Task task = taskRepository.findByIdWithInvoices(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        return taskMapper.toTaskResponseDTO(task);
    }



    private Double calculateTaskProgress(Task task) {
        List<Subtask> subtasks = subtaskRepository.findByParentTaskId(task.getId());

        if (subtasks.isEmpty()) {
            return task.getStatus() == StatusTask.FINISHED ? 100.0 : 0.0;
        }

        long approvedCompleted = subtasks.stream()
                .filter(s -> s.getStatus() == StatusTask.FINISHED && s.isApproved())
                .count();

        return (double) approvedCompleted / subtasks.size() * 100;
    }


    @Override
    public TaskResponseDTO prolongTask(Long taskId, LocalDate newEndDate) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (newEndDate.isBefore(task.getDateEndEstimated())) {
            throw new IllegalArgumentException("New end date must be later than or equal to the current estimated end date.");
        }

        if (task.getOriginalDateEndEstimated() == null) {
            task.setOriginalDateEndEstimated(task.getDateEndEstimated());
        }

        task.setDateEndEstimated(newEndDate);
        Task updatedTask = taskRepository.save(task);

        return taskMapper.toTaskResponseDTO(updatedTask);
    }


}








