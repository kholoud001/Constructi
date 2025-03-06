package com.constructi.service.impl;

import com.constructi.DTO.SubtaskRequestDTO;
import com.constructi.DTO.SubtaskResponseDTO;
import com.constructi.exception.SubtaskNotFoundException;
import com.constructi.mapper.SubtaskMapper;
import com.constructi.model.entity.Subtask;
import com.constructi.model.entity.Task;
import com.constructi.repository.SubtaskRepository;
import com.constructi.repository.TaskRepository;
import com.constructi.repository.UserRepository;
import com.constructi.service.SubtaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubtaskServiceImpl implements SubtaskService {

    private final SubtaskRepository subtaskRepository;
    private final TaskRepository taskRepository;
    private final SubtaskMapper subtaskMapper;
    private final UserRepository userRepository;

    @Override
    public SubtaskResponseDTO createSubtask(SubtaskRequestDTO subtaskRequestDTO) {
        Task parentTask = taskRepository.findById(subtaskRequestDTO.getParentTaskId())
                .orElseThrow(() -> new RuntimeException("Parent task not found"));

        validateSubtaskDates(subtaskRequestDTO, parentTask);

        Subtask subtask = subtaskMapper.toSubtaskEntity(subtaskRequestDTO);
        subtask.setParentTask(parentTask);

        Subtask savedSubtask = subtaskRepository.save(subtask);
        return subtaskMapper.toSubtaskResponseDTO(savedSubtask);
    }

    private void validateSubtaskDates(SubtaskRequestDTO subtaskRequestDTO, Task parentTask) {
        LocalDate subtaskBeginDate = subtaskRequestDTO.getBeginDate();
        LocalDate subtaskEndDate = subtaskRequestDTO.getDateEndEstimated();
        LocalDate parentBeginDate = parentTask.getBeginDate();
        LocalDate parentEndDate = parentTask.getDateEndEstimated();

        if (subtaskBeginDate.isBefore(parentBeginDate) ){
            throw new IllegalArgumentException("Subtask begin date cannot be before the parent task's begin date.");
        }

        if (subtaskEndDate != null && parentEndDate != null && subtaskEndDate.isAfter(parentEndDate)) {
            throw new IllegalArgumentException("Subtask end date cannot exceed the parent task's end date.");
        }

        if (subtaskEndDate != null && subtaskBeginDate.isAfter(subtaskEndDate)) {
            throw new IllegalArgumentException("Subtask begin date cannot be after its end date.");
        }
    }

    @Override
    public SubtaskResponseDTO updateSubtask(Long subtaskId, SubtaskRequestDTO subtaskRequestDTO) {
        Subtask existingSubtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new SubtaskNotFoundException("Subtask not found"));

        existingSubtask.setDescription(subtaskRequestDTO.getDescription());
        existingSubtask.setStatus(subtaskRequestDTO.getStatus());
        existingSubtask.setBeginDate(subtaskRequestDTO.getBeginDate());
        existingSubtask.setDateEndEstimated(subtaskRequestDTO.getDateEndEstimated());
        existingSubtask.setEffectiveTime(subtaskRequestDTO.getEffectiveTime());

        Subtask updatedSubtask = subtaskRepository.save(existingSubtask);
        return subtaskMapper.toSubtaskResponseDTO(updatedSubtask);
    }

    @Override
    public void deleteSubtask(Long subtaskId) {
        if (!subtaskRepository.existsById(subtaskId)) {
            throw new SubtaskNotFoundException("Subtask with ID " + subtaskId + " does not exist.");
        }
        subtaskRepository.deleteById(subtaskId);
    }

    @Override
    public List<SubtaskResponseDTO> getAllSubtasks() {
        List<Subtask> subtasks = subtaskRepository.findAll();
        return subtasks.stream().map(subtaskMapper::toSubtaskResponseDTO).toList();
    }

    @Override
    public SubtaskResponseDTO getSubtaskById(Long subtaskId) {
        Subtask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new SubtaskNotFoundException("Subtask not found"));
        return subtaskMapper.toSubtaskResponseDTO(subtask);
    }

    @Override
    public List<SubtaskResponseDTO> getSubtasksByParentTaskId(Long parentTaskId) {
        List<Subtask> subtasks = subtaskRepository.findByParentTaskId(parentTaskId);
        return subtasks.stream().map(subtaskMapper::toSubtaskResponseDTO).toList();
    }

    @Override
    public SubtaskResponseDTO approveSubtask(Long subtaskId) {
        Subtask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new SubtaskNotFoundException("Subtask not found"));
        subtask.setApproved(true);
        Subtask approvedSubtask = subtaskRepository.save(subtask);
        return subtaskMapper.toSubtaskResponseDTO(approvedSubtask);
    }


    @Override
    public SubtaskResponseDTO prolongSubtask(Long subtaskId, LocalDate newEndDate) {
        Subtask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new SubtaskNotFoundException("Subtask not found"));

        Task parentTask = subtask.getParentTask();

        if (newEndDate.isBefore(subtask.getDateEndEstimated())) {
            throw new IllegalArgumentException("New end date must be later than or equal to the current estimated end date.");
        }

        if (newEndDate.isAfter(parentTask.getDateEndEstimated())) {
            throw new IllegalArgumentException("New end date cannot exceed the parent task's end date.");
        }

        if (subtask.getOriginalDateEndEstimated() == null) {
            subtask.setOriginalDateEndEstimated(subtask.getDateEndEstimated());
        }

        subtask.setDateEndEstimated(newEndDate);
        Subtask updatedSubtask = subtaskRepository.save(subtask);

        return subtaskMapper.toSubtaskResponseDTO(updatedSubtask);
    }


}