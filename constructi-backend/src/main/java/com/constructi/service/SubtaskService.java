package com.constructi.service;

import com.constructi.DTO.SubtaskRequestDTO;
import com.constructi.DTO.SubtaskResponseDTO;

import java.util.List;

public interface SubtaskService {
    SubtaskResponseDTO createSubtask(SubtaskRequestDTO subtaskRequestDTO);

    SubtaskResponseDTO updateSubtask(Long subtaskId, SubtaskRequestDTO subtaskRequestDTO);

    void deleteSubtask(Long subtaskId);

    List<SubtaskResponseDTO> getAllSubtasks();

    SubtaskResponseDTO getSubtaskById(Long subtaskId);

    List<SubtaskResponseDTO> getSubtasksByParentTaskId(Long parentTaskId);

    SubtaskResponseDTO approveSubtask(Long subtaskId);

}
