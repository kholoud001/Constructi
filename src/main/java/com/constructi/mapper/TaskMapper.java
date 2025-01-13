package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {ProjectMapper.class, UserMapper.class})
public interface TaskMapper {

    TaskMapper INSTANCE = Mappers.getMapper(TaskMapper.class);

    @Mapping(target = "project", source = "project")
    @Mapping(target = "user", source = "user")
    TaskDTO entityToDto(Task entity);

    @Mapping(target = "project", source = "project")
    @Mapping(target = "user", source = "user")
    Task dtoToEntity(TaskDTO dto);
}
