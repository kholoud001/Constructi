package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.Material;
import com.constructi.model.entity.Project;
import com.constructi.model.entity.Task;
import com.constructi.model.enums.StatusTask;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TaskMapper.class, BudgetMapper.class})
public interface ProjectMapper {

    @Mapping(target = "user", ignore = true)
    Project toEntity(ProjectRequestDTO dto);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "tasks", source = "tasks")
    @Mapping(target = "budgets", source = "budgets")
    @Mapping(target = "materials", expression = "java(mapMaterials(project.getMaterials()))")
    @Mapping(target = "progress", expression = "java(calculateProjectProgress(project))")
    ProjectResponseDTO toDto(Project project);

    default double calculateProjectProgress(Project project) {
        List<Task> tasks = project.getTasks();
        if (tasks.isEmpty()) return 0.0;

        long completedTasks = tasks.stream()
                .filter(task -> task.getStatus() == StatusTask.FINISHED)
                .count();

        return (double) completedTasks / tasks.size() * 100;
    }

    default List<MaterialResponseDTO> mapMaterials(List<Material> materials) {
        return materials.stream()
                .map(material -> {
                    MaterialResponseDTO dto = new MaterialResponseDTO();
                    dto.setName(material.getName());
                    dto.setPriceUnit(material.getPriceUnit());
                    dto.setQuantity(material.getQuantity());
                    return dto;
                })
                .toList();
    }
}