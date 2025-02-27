package com.constructi.service.impl;

import com.constructi.DTO.SubtaskRequestDTO;
import com.constructi.DTO.SubtaskResponseDTO;
import com.constructi.exception.SubtaskNotFoundException;
import com.constructi.mapper.SubtaskMapper;
import com.constructi.model.entity.Subtask;
import com.constructi.model.entity.Task;
import com.constructi.model.entity.User;
import com.constructi.repository.SubtaskRepository;
import com.constructi.repository.TaskRepository;
import com.constructi.repository.UserRepository;
import com.constructi.service.SubtaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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

        Subtask subtask = subtaskMapper.toSubtaskEntity(subtaskRequestDTO);
        subtask.setParentTask(parentTask);
        Subtask savedSubtask = subtaskRepository.save(subtask);
        return subtaskMapper.toSubtaskResponseDTO(savedSubtask);
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
    public List<SubtaskResponseDTO> getMyAssignedSubtasks() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return subtaskRepository.findByUserId(user.getId())
                .stream()
                .map(subtaskMapper::toSubtaskResponseDTO)
                .toList();
    }
}