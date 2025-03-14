package com.constructi.service;


import com.constructi.DTO.TaskRequestDTO;
import com.constructi.DTO.TaskResponseDTO;
import com.constructi.model.entity.Task;

import java.time.LocalDate;
import java.util.List;

public interface TaskService {

    TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO);

    TaskResponseDTO updateTask(Long taskId, TaskRequestDTO taskRequestDTO);

    void deleteTask(Long taskId);

    List<TaskResponseDTO> getAllTasks();

    TaskResponseDTO getTaskById(Long taskId);

    List<TaskResponseDTO> getMyTasks();

    TaskResponseDTO assignTaskToWorker(Long taskId, Long workerId);

    List<TaskResponseDTO> getTasksAssignedToWorker();

//    TaskResponseDTO getTaskWithBudgetAndInvoices(Long taskId);

    TaskResponseDTO getTaskWithInvoices(Long taskId);

    void updateParentTaskStatusIfSubtasksCompleted(Long parentTaskId);


//    TaskResponseDTO prolongTask(Long taskId, LocalDate newEndDate);
}
