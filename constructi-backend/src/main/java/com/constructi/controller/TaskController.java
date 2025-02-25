package com.constructi.controller;

import com.constructi.DTO.TaskRequestDTO;
import com.constructi.DTO.TaskResponseDTO;
import com.constructi.model.entity.Task;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;



import com.constructi.service.TaskService;

import java.util.List;


@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping("/add")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ARCHITECT')")
    public ResponseEntity<TaskResponseDTO> createTask(@Valid @RequestBody TaskRequestDTO taskRequestDTO) {
        TaskResponseDTO taskResponseDTO = taskService.createTask(taskRequestDTO);
        return new ResponseEntity<>(taskResponseDTO, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ARCHITECT', 'ROLE_WORKER')")
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks() {
        List<TaskResponseDTO> taskResponseDTOs = taskService.getAllTasks();
        return new ResponseEntity<>(taskResponseDTOs, HttpStatus.OK);
    }

    @GetMapping("/{taskId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ARCHITECT', 'ROLE_WORKER')")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long taskId) {
        TaskResponseDTO taskResponseDTO = taskService.getTaskById(taskId);
        return new ResponseEntity<>(taskResponseDTO, HttpStatus.OK);
    }

    @PutMapping("/update/{taskId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ARCHITECT')")

    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long taskId,
                                                      @Valid @RequestBody TaskRequestDTO taskRequestDTO) {
        TaskResponseDTO taskResponseDTO = taskService.updateTask(taskId, taskRequestDTO);
        return new ResponseEntity<>(taskResponseDTO, HttpStatus.OK);
    }

//    @GetMapping("/mytasks")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<List<TaskResponseDTO>> getMyTasks() {
//        List<TaskResponseDTO> tasks = taskService.getMyTasks();
//        return ResponseEntity.ok(tasks);
//    }


    @DeleteMapping("/delete/{taskId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok("Task with ID " + taskId + " has been successfully deleted.");
    }

    @PostMapping("/assign/{taskId}/{workerId}")
    @PreAuthorize("hasAuthority('ROLE_ARCHITECT')")
    public ResponseEntity<TaskResponseDTO> assignTaskToWorker(@PathVariable Long taskId,
                                                              @PathVariable Long workerId) {
        TaskResponseDTO taskResponseDTO = taskService.assignTaskToWorker(taskId, workerId);
        return new ResponseEntity<>(taskResponseDTO, HttpStatus.OK);
    }

    @GetMapping("/mytasks")
    @PreAuthorize("hasAuthority('ROLE_WORKER')")
    public ResponseEntity<List<TaskResponseDTO>> getAssignedTasks() {
        List<TaskResponseDTO> tasks = taskService.getTasksAssignedToWorker();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

//    @GetMapping("/project/{projectId}")
//    public ResponseEntity<List<TaskResponseDTO>> getTasksByProject(@PathVariable Long projectId) {
//        return ResponseEntity.ok(taskService.getTasksByProjectId(projectId));
//    }


}
