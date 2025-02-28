package com.constructi.mapper;

import com.constructi.DTO.TaskRequestDTO;
import com.constructi.DTO.TaskResponseDTO;
import com.constructi.model.entity.Invoice;
import com.constructi.model.entity.Subtask;
import com.constructi.model.entity.Task;
import com.constructi.model.enums.StatusTask;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.email", target = "userEmail")
    @Mapping(source = "invoices", target = "totalPaid", qualifiedByName = "calculateTotalPaid")
    @Mapping(source = "subtasks", target = "progress", qualifiedByName = "calculateTaskProgress")
    TaskResponseDTO toTaskResponseDTO(Task task);

    @Mapping(source = "projectId", target = "project.id")
    @Mapping(target = "user.id", ignore = true)
    @Mapping(source = "budgetLimit", target = "budgetLimit")
    Task toTaskEntity(TaskRequestDTO taskRequestDTO);

    List<TaskResponseDTO> toDtoList(List<Task> tasks);

    @Named("calculateTotalPaid")
    static Double calculateTotalPaid(List<Invoice> invoices) {
        if (invoices == null || invoices.isEmpty()) {
            return 0.0;
        }
        return invoices.stream()
                .mapToDouble(Invoice::getAmount)
                .sum();
    }

    @Named("calculateTaskProgress")
    static Double calculateTaskProgress(List<Subtask> subtasks) {
        if (subtasks == null || subtasks.isEmpty()) {
            return 0.0;
        }
        long approvedCompleted = subtasks.stream()
                .filter(s -> s.getStatus() == StatusTask.FINISHED && s.isApproved())
                .count();
        return (double) approvedCompleted / subtasks.size() * 100;
    }

}
