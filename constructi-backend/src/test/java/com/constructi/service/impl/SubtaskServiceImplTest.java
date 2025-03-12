package com.constructi.service.impl;

import com.constructi.DTO.SubtaskRequestDTO;
import com.constructi.DTO.SubtaskResponseDTO;
import com.constructi.exception.SubtaskNotFoundException;
import com.constructi.mapper.SubtaskMapper;
import com.constructi.model.entity.Subtask;
import com.constructi.model.entity.Task;
import com.constructi.model.enums.StatusTask;
import com.constructi.repository.SubtaskRepository;
import com.constructi.repository.TaskRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)

class SubtaskServiceImplTest {

    @Mock
    private SubtaskRepository subtaskRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private SubtaskMapper subtaskMapper;

    @InjectMocks
    private SubtaskServiceImpl subtaskService;

    private Subtask subtask;
    private Task parentTask;
    private SubtaskRequestDTO requestDTO;
    private SubtaskResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        parentTask = new Task();
        parentTask.setId(1L);
        parentTask.setBeginDate(LocalDate.of(2024, 1, 1));
        parentTask.setDateEndEstimated(LocalDate.of(2024, 12, 31));

        subtask = new Subtask();
        subtask.setId(1L);
        subtask.setDescription("Description");
        subtask.setBeginDate(LocalDate.of(2024, 6, 1));
        subtask.setDateEndEstimated(LocalDate.of(2024, 6, 30));
        subtask.setParentTask(parentTask);
        subtask.setApproved(false);

        requestDTO = new SubtaskRequestDTO();
        requestDTO.setDescription("Updated Description");
        requestDTO.setStatus(StatusTask.FINISHED);
        requestDTO.setBeginDate(LocalDate.of(2024, 6, 1));
        requestDTO.setDateEndEstimated(LocalDate.of(2024, 6, 30));
        requestDTO.setEffectiveTime(8.0);


        responseDTO = new SubtaskResponseDTO();
        responseDTO.setId(1L);
        responseDTO.setDescription("Updated Description");
        responseDTO.setStatus(StatusTask.FINISHED);
        responseDTO.setBeginDate(LocalDate.of(2024, 6, 1));
        responseDTO.setDateEndEstimated(LocalDate.of(2024, 6, 30));
        responseDTO.setEffectiveTime(8.0);
        responseDTO.setApproved(true);

        System.out.println("ResponseDTO Initialized: " + responseDTO);
        when(subtaskMapper.toSubtaskResponseDTO(any(Subtask.class))).thenReturn(responseDTO);


    }

    @Test
    void createSubtask_ShouldCreateSubtask() {
        when(taskRepository.findById(requestDTO.getParentTaskId())).thenReturn(Optional.of(parentTask));
        when(subtaskMapper.toSubtaskEntity(requestDTO)).thenReturn(subtask);
        when(subtaskRepository.save(any(Subtask.class))).thenReturn(subtask);
        when(subtaskMapper.toSubtaskResponseDTO(subtask)).thenReturn(responseDTO);

        SubtaskResponseDTO result = subtaskService.createSubtask(requestDTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void createSubtask_ShouldThrowException_WhenParentTaskNotFound() {
        when(taskRepository.findById(requestDTO.getParentTaskId())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> subtaskService.createSubtask(requestDTO));
    }

    @Test
    void getSubtaskById_ShouldReturnSubtask() {
        when(subtaskRepository.findById(1L)).thenReturn(Optional.of(subtask));
        when(subtaskMapper.toSubtaskResponseDTO(subtask)).thenReturn(responseDTO);

        SubtaskResponseDTO result = subtaskService.getSubtaskById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getSubtaskById_ShouldThrowException_WhenSubtaskNotFound() {
        when(subtaskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(SubtaskNotFoundException.class, () -> subtaskService.getSubtaskById(1L));
    }

    @Test
    void deleteSubtask_ShouldDeleteSuccessfully() {
        when(subtaskRepository.existsById(1L)).thenReturn(true);
        doNothing().when(subtaskRepository).deleteById(1L);

        assertDoesNotThrow(() -> subtaskService.deleteSubtask(1L));
    }

    @Test
    void deleteSubtask_ShouldThrowException_WhenSubtaskNotFound() {
        when(subtaskRepository.existsById(1L)).thenReturn(false);

        assertThrows(SubtaskNotFoundException.class, () -> subtaskService.deleteSubtask(1L));
    }

    @Test
    void prolongSubtask_ShouldUpdateEndDate() {
        LocalDate newEndDate = LocalDate.of(2024, 7, 15);
        when(subtaskRepository.findById(1L)).thenReturn(Optional.of(subtask));
        when(subtaskRepository.save(subtask)).thenReturn(subtask);
        when(subtaskMapper.toSubtaskResponseDTO(subtask)).thenReturn(responseDTO);

        SubtaskResponseDTO result = subtaskService.prolongSubtask(1L, newEndDate);

        assertNotNull(result);
    }

    @Test
    void prolongSubtask_ShouldThrowException_WhenNewDateIsEarlier() {
        LocalDate newEndDate = LocalDate.of(2024, 5, 1);
        when(subtaskRepository.findById(1L)).thenReturn(Optional.of(subtask));

        assertThrows(IllegalArgumentException.class, () -> subtaskService.prolongSubtask(1L, newEndDate));
    }


    @Test
    void testUpdateSubtask() {
        when(subtaskRepository.findById(1L)).thenReturn(Optional.of(subtask));
        when(subtaskRepository.save(any(Subtask.class))).thenReturn(subtask);

        when(subtaskMapper.toSubtaskResponseDTO(any(Subtask.class))).thenReturn(responseDTO);

        SubtaskResponseDTO updatedSubtaskResponse = subtaskService.updateSubtask(1L, requestDTO);

        verify(subtaskRepository).save(subtask);

        assertEquals("Updated Description", subtask.getDescription());
//        assertEquals("FINISHED", subtask.getStatus());
        assertEquals(LocalDate.of(2024, 6, 1), subtask.getBeginDate());
        assertEquals(LocalDate.of(2024, 6, 30), subtask.getDateEndEstimated());
        assertEquals(8.0, subtask.getEffectiveTime());

        assertEquals(responseDTO, updatedSubtaskResponse);
    }

    @Test
    void testUpdateSubtask_SubtaskNotFound() {
        when(subtaskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(SubtaskNotFoundException.class, () -> subtaskService.updateSubtask(1L, requestDTO));
    }

    @Test
    void testApproveSubtask() {
        // Mock the repository's behavior
        when(subtaskRepository.findById(1L)).thenReturn(Optional.of(subtask));
        when(subtaskRepository.save(any(Subtask.class))).thenReturn(subtask);

        SubtaskResponseDTO result = subtaskService.approveSubtask(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertTrue(result.isApproved());
        assertEquals("Updated Description", result.getDescription());

    }

    @Test
    void testApproveSubtask_SubtaskNotFound() {
        when(subtaskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(SubtaskNotFoundException.class, () -> subtaskService.approveSubtask(1L));
    }


}
