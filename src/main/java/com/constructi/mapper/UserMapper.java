package com.constructi.mapper;

import com.constructi.DTO.*;
import com.constructi.model.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "projects", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    UserDTO entityToDto(User entity);

//    @Mapping(target = "project", ignore = true)
    User dtoToEntity(UserDTO dto);
}
