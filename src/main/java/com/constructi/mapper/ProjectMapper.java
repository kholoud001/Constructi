package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(target = "budgets", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "materials", ignore = true)
    @Mapping(target = "user", ignore = true)
    ProjectDTO entityToDto(Project entity);

    @Mapping(target = "budgets", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    @Mapping(target = "materials", ignore = true)
    @Mapping(target = "user.projects", ignore = true)
    Project dtoToEntity(ProjectDTO dto);

    List<ProjectDTO> entityListToDtoList(List<Project> projects);
}

