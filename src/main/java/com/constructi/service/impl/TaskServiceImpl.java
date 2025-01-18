package com.constructi.service.impl;

import com.constructi.DTO.TaskRequestDTO;
import com.constructi.DTO.TaskResponseDTO;
import com.constructi.exception.TaskNotFoundException;
import com.constructi.mapper.TaskMapper;
import com.constructi.model.entity.Project;
import com.constructi.model.entity.Task;
import com.constructi.model.entity.User;
import com.constructi.repository.ProjectRepository;
import com.constructi.repository.TaskRepository;
import com.constructi.repository.UserRepository;
import com.constructi.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;


    @Override
    public TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO) {
        Project project = projectRepository.findById(taskRequestDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = null;
        if (taskRequestDTO.getUserId() != null) {
            user = userRepository.findById(taskRequestDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Task task = taskMapper.toTaskEntity(taskRequestDTO);
        task.setProject(project);
        task.setUser(user);

        Task savedTask = taskRepository.save(task);
        return taskMapper.toTaskResponseDTO(savedTask);
    }


    @Override
    public TaskResponseDTO updateTask(Long taskId, TaskRequestDTO taskRequestDTO) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Project project = projectRepository.findById(taskRequestDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = null;
        if (taskRequestDTO.getUserId() != null) {
            user = userRepository.findById(taskRequestDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        existingTask.setDescription(taskRequestDTO.getDescription());
        existingTask.setStatus(taskRequestDTO.getStatus());
        existingTask.setBeginDate(taskRequestDTO.getBeginDate());
        existingTask.setDateEndEstimated(taskRequestDTO.getDateEndEstimated());
        existingTask.setEffectiveTime(taskRequestDTO.getEffectiveTime());
        existingTask.setProject(project);
        existingTask.setUser(user);

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
    public List<TaskResponseDTO> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return tasks.stream().map(taskMapper::toTaskResponseDTO).toList();
    }

    @Override
    public TaskResponseDTO getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return taskMapper.toTaskResponseDTO(task);
    }

//    @Override
//    public List<TaskResponseDTO> getMyTasks() {
//        String email = SecurityContextHolder.getContext().getAuthentication().ge();
//
//        Long userId = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found"))
//                .getId();
//
//        List<Task> tasks = taskRepository.findByUserId(userId);
//        return tasks.stream()
//                .map(taskMapper::toTaskResponseDTO)
//                .collect(Collectors.toList());
//    }






}
