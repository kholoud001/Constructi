package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    TaskMapper INSTANCE = Mappers.getMapper(TaskMapper.class);

    @Mapping(target = "project", source = "entity.project")
    @Mapping(target = "user", source = "entity.user")
    TaskDTO entityToDto(Task entity);

    @Mapping(target = "project", source = "dto.project")
    @Mapping(target = "user", source = "dto.user")
    Task dtoToEntity(TaskDTO dto);
}
