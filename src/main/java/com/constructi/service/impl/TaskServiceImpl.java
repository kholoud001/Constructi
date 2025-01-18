//package com.constructi.service.impl;
//
//import com.constructi.DTO.TaskDTO;
//import com.constructi.mapper.TaskMapper;
//import com.constructi.model.entity.Task;
//import com.constructi.repository.TaskRepository;
//import com.constructi.service.TaskService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class TaskServiceImpl implements TaskService {
//
//    private final TaskRepository taskRepository;
//    private final TaskMapper taskMapper;
//
//    @Override
//    public TaskDTO createTask(TaskDTO taskDTO) {
//        Task task = taskMapper.dtoToEntity(taskDTO);
//        Task savedTask = taskRepository.save(task);
//        return taskMapper.entityToDto(savedTask);
//    }
//
//    @Override
//    public List<TaskDTO> getAllTasks() {
//        return taskRepository.findAll()
//                .stream()
//                .map(taskMapper::entityToDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public TaskDTO getTaskById(Long id) {
//        Task task = taskRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
//        return taskMapper.entityToDto(task);
//    }
//
//    @Override
//    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
//        Task existingTask = taskRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
//
//        Task updatedTask = taskMapper.dtoToEntity(taskDTO);
//        updatedTask.setId(existingTask.getId());
//        updatedTask = taskRepository.save(updatedTask);
//
//        return taskMapper.entityToDto(updatedTask);
//    }
//
//    @Override
//    public void deleteTask(Long id) {
//        Task existingTask = taskRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
//        taskRepository.delete(existingTask);
//    }
//
//}
