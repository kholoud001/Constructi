package com.constructi.mapper;


import com.constructi.DTO.ProjectRequestDTO;
import com.constructi.DTO.ProjectResponseDTO;
import com.constructi.model.entity.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(target = "user", ignore = true)
    Project toEntity(ProjectRequestDTO dto);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "tasks", expression = "java(project.getTasks().stream().map(task -> task.getDescription()).toList())")
    @Mapping(target = "budgets", expression = "java(project.getBudgets().stream().map(budget -> budget.getAmount()).toList())")
    @Mapping(target = "materials", expression = "java(project.getMaterials().stream().map(material -> material.getName()).toList())")
    ProjectResponseDTO toDto(Project project);

}

