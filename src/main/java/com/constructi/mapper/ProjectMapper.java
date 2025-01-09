package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    ProjectMapper INSTANCE = Mappers.getMapper(ProjectMapper.class);

    @Mapping(target = "tasks", source = "entity.tasks")
    @Mapping(target = "budgets", source = "entity.budgets")
    @Mapping(target = "materials", source = "entity.materials")
    @Mapping(target = "user", source = "entity.user")
    ProjectDTO entityToDto(Project entity);

    @Mapping(target = "tasks", source = "dto.tasks")
    @Mapping(target = "budgets", source = "dto.budgets")
    @Mapping(target = "materials", source = "dto.materials")
    @Mapping(target = "user", source = "dto.user")
    Project dtoToEntity(ProjectDTO dto);
}
