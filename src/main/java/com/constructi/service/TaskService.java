package com.constructi.service;

import com.constructi.DTO.TaskDTO;

import java.util.List;

public interface TaskService {
    TaskDTO createTask(TaskDTO taskDTO);

    List<TaskDTO> getAllTasks();

    TaskDTO getTaskById(Long id);

    TaskDTO updateTask(Long id, TaskDTO taskDTO);

    void deleteTask(Long id);
}
