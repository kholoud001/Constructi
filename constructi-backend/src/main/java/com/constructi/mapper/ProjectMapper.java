package com.constructi.mapper;

import com.constructi.DTO.ProjectRequestDTO;
import com.constructi.DTO.ProjectResponseDTO;
import com.constructi.model.entity.Project;
import com.constructi.model.entity.Task;
import com.constructi.model.entity.Budget;
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
    @Mapping(target = "materials", expression = "java(project.getMaterials().stream().map(material -> material.getName()).toList())")
    ProjectResponseDTO toDto(Project project);

}
