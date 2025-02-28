package com.constructi.controller;

import com.constructi.DTO.SubtaskRequestDTO;
import com.constructi.DTO.SubtaskResponseDTO;
import com.constructi.service.SubtaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subtasks")
@RequiredArgsConstructor
public class SubtaskController {

    private final SubtaskService subtaskService;

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<SubtaskResponseDTO> createSubtask(@Valid @RequestBody SubtaskRequestDTO subtaskRequestDTO) {
        SubtaskResponseDTO subtaskResponseDTO = subtaskService.createSubtask(subtaskRequestDTO);
        return new ResponseEntity<>(subtaskResponseDTO, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<SubtaskResponseDTO>> getAllSubtasks() {
        List<SubtaskResponseDTO> subtasks = subtaskService.getAllSubtasks();
        return new ResponseEntity<>(subtasks, HttpStatus.OK);
    }

    @GetMapping("/{subtaskId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ARCHITECT', 'ROLE_WORKER')")
    public ResponseEntity<SubtaskResponseDTO> getSubtaskById(@PathVariable Long subtaskId) {
        SubtaskResponseDTO subtaskResponseDTO = subtaskService.getSubtaskById(subtaskId);
        return new ResponseEntity<>(subtaskResponseDTO, HttpStatus.OK);
    }

    @PutMapping("/update/{subtaskId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<SubtaskResponseDTO> updateSubtask(@PathVariable Long subtaskId,
                                                            @Valid @RequestBody SubtaskRequestDTO subtaskRequestDTO) {
        SubtaskResponseDTO subtaskResponseDTO = subtaskService.updateSubtask(subtaskId, subtaskRequestDTO);
        return new ResponseEntity<>(subtaskResponseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{subtaskId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteSubtask(@PathVariable Long subtaskId) {
        subtaskService.deleteSubtask(subtaskId);
        return ResponseEntity.ok("Subtask with ID " + subtaskId + " has been successfully deleted.");
    }

    @GetMapping("/parent/{parentTaskId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<SubtaskResponseDTO>> getSubtasksByParentTaskId(@PathVariable Long parentTaskId) {
        List<SubtaskResponseDTO> subtasks = subtaskService.getSubtasksByParentTaskId(parentTaskId);
        return new ResponseEntity<>(subtasks, HttpStatus.OK);
    }

    @PostMapping("/approve/{subtaskId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<SubtaskResponseDTO> approveSubtask(@PathVariable Long subtaskId) {
        SubtaskResponseDTO subtaskResponseDTO = subtaskService.approveSubtask(subtaskId);
        return new ResponseEntity<>(subtaskResponseDTO, HttpStatus.OK);
    }

}